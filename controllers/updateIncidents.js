const axios = require("axios");
const auth = require("./../config/base64auth");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const groups = [
  "N3-MI-OUTSOURCING",
  "N3-IVA",
  "N3-MI-OUTSOURCING-24X7",
  "N3-SERVIDORES_OUTSOURCING_CFTV",
];

async function updatePendingIncidents() {
  let pending = 0;
  let pendingList = [];

  for (const group of groups) {
    await axios
      .get(
        `https://api.petrobras.com.br/ti/itsm/v1/itsm-chamados/chamados?mesa_atendimento=${group}&tipo_servico=incident&status=Pending`,
        auth
      )
      .then((response) => {
        const n = response.data.Chamados.length;
        pending += n;
        for (const obj of response.data.Chamados) {
          pendingList.push(obj.identificador)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return { pending: pending, pendingList: pendingList };
}

async function updateActiveIncidents() {
  let newCall = 0;
  let progress = 0;
  let inline = [];

  for (const group of groups) {
    await axios
      .get(
        `https://api.petrobras.com.br/ti/itsm/v1/itsm-chamados/chamados?mesa_atendimento=${group}&tipo_servico=incident&status=Open`,
        auth
      )
      .then((response) => {
        for (const obj of response.data.Chamados) {
          if (obj.status === "Em Andamento") {
            progress += 1;
          }
          if (obj.status === "Novo") {
            newCall += 1;
            inline.push(obj.identificador);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return { new: newCall, progress: progress, inline: inline };
}

module.exports = async function getValues() {
  const pendingIncidents = await updatePendingIncidents().then((value) => {
    return value;
  });
  const activeIncidents = await updateActiveIncidents().then((value) => {
    return value;
  });

  return await {
    new: activeIncidents.new,
    progress: activeIncidents.progress,
    pending: pendingIncidents.pending,
    inline: activeIncidents.inline,
    incidents: [...activeIncidents.inline, ...pendingIncidents.pendingList]
  };
};
