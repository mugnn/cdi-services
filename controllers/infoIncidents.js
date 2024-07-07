const InfoIncidents = require("../models/info_incidents");
const axios = require("axios");
const auth = require("../config/base64auth");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const getData = async (inc) => {
  return await axios
    .get(
      `https://api.petrobras.com.br/ti/itsm/v1/itsm-chamados/chamados/ref/${inc}`,
      auth
    )
    .then((response) => {
      return response.data.Chamado;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getIc = async (ic) => {
  return await axios
    .get(`https://api.petrobras.com.br/ti/itsm/v1/itsm-bdgc/ic/ref/${ic}`, auth)
    .then((response) => {
      return response.data.IC;
    })
    .catch((error) => {
      console.error(error);
    });
};

const detectKB = (data) => {
  for (let note of data) {
    if (note.includes("sys_kb_id")) {
      return true;
    }
  }
  return false;
};

const startService = (data) => {
  return data[1].slice(2, 22);
};

const addInfo = async (obj) => {
  try {
    let dataIC = await getIc(obj.ic);
    await InfoIncidents.create({
      inc: obj.identificador,
      kb: detectKB(obj.notas_de_trabalho),
      abertura: obj.data_registro,
      assumido: startService(obj.notas_de_trabalho),
      limite: obj.sla_resolucao_data_prazo,
      ultima_atualizacao: obj.data_atualizacao,
      solicitante: obj.primeiro_nome_cliente,
      analista: obj.atendente,
      localizacao: dataIC.site || "",
      dispositivo: dataIC.nome_ic || "",
      pendencia: obj.notas_de_trabalho.at(-1),
      status: obj.status,
      problema:
        obj.cat_operacional_n3 === "P3_impacto1_urgencia3"
          ? "Câmera offline"
          : obj.cat_operacional_n3,
      sla: parseInt(obj.resolucao_tempo_restante),
    }).then(() => {
      console.log(
        `document of incident ${obj.identificador} successfully saved`
      );
    });
  } catch (e) {
    console.log(e);
  }
};

const deleteInfo = async (inc) => {
  try {
    await InfoIncidents.deleteOne({ inc: inc });
  } catch (e) {
    console.error(e);
  }
};

module.exports = async function loadInfo(data) {
  let incListDB = [];
  const dataResponse = await InfoIncidents.find().exec();

  for (let obj of dataResponse) {
    incListDB.push(obj.inc);
  }

  for (let inc of data) {
    if (!incListDB.includes(inc)) {
      const modelData = await getData(inc);
      await addInfo(modelData);
    }
  }

  for (let inc of incListDB) {
    if (!data.includes(inc)) {
      await deleteInfo(inc);
    }
  }
};
