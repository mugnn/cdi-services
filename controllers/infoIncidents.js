process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

class InfoIncidents {
  constructor() {
    this.InfoIncidents = require("../models/info_incidents");
    this.ArchiveIncidents = require("../models/info_incidents_archive");
    this.axios = require("axios");
    this.auth = require("../config/base64auth");
    this.Ic = require("../models/ic");
  }

  detectKB(data) {
    for (let note of data) {
      if (note.includes("sys_kb_id")) {
        return true;
      }
    }
    return false;
  }

  filterAutomaticCall(obj) {
    if (
      obj.cat_operacional_n3.includes("_impacto") &&
      obj.mesa_atendimento !== "N3-SERVIDORES_OUTSOURCING_CFTV"
    ) {
      return "Câmera Offline / Câmera sem Imagem";
    }
    if (obj.mesa_atendimento === "N3-SERVIDORES_OUTSOURCING_CFTV") {
      return "Problema no servidor";
    }

    return obj.cat_operacional_n3;
  }

  async getData(inc) {
    return await this.axios
      .get(
        `https://api.petrobras.com.br/ti/itsm/v1/itsm-chamados/chamados/ref/${inc}`,
        this.auth
      )
      .then((response) => {
        return response.data.Chamado;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getIc(ic) {
    return await this.axios
      .get(
        `https://api.petrobras.com.br/ti/itsm/v1/itsm-bdgc/ic/ref/${ic}`,
        this.auth
      )
      .then((response) => {
        return response.data.IC;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async verifyIc(obj) {
    const hasIc = await this.Ic.findOne({ ic_code: obj.ic }).exec();

    if (hasIc === null) {
      const icData = await this.getIc(obj.ic);
      const newIc = await this.Ic.create({
        ic_code: obj.ic,
        ic_name: icData.nome_ic,
        site: icData.site || obj.site,
        suffix: icData.microlocalizacao || "none",
        related_incidents: [obj.identificador],
        recurrences: 1,
      });
      return newIc;
    }

    if (!hasIc.related_incidents.includes(obj.identificador)) {
      await hasIc.updateOne({
        $inc: { recurrences: 1 },
        $push: { related_incidents: obj.identificador },
      });

      hasIc.recurrences += 1;
      hasIc.related_incidents.push(obj.identificador);
    }

    return hasIc;
  }

  async addInfo(obj) {
    try {
      const icData = obj.ic === "" ? "" : await this.verifyIc(obj);
      const issue = this.filterAutomaticCall(obj);

      await this.InfoIncidents.findOneAndUpdate(
        { inc: obj.identificador },
        {
          inc: obj.identificador,
          kb: this.detectKB(obj.notas_de_trabalho),
          mesa_atendimento: obj.mesa_atendimento,
          abertura: obj.data_registro,
          limite: obj.sla_resolucao_data_prazo,
          ultima_atualizacao: obj.data_atualizacao,
          solicitante: obj.primeiro_nome_cliente,
          analista: obj.atendente || "não atribuído",
          localizacao: icData.site || obj.site, //
          dispositivo: icData.ic_name || "sem dispositivo", //
          pendencia: obj.notas_de_trabalho.at(-1),
          status: obj.status,
          problema: issue,
          url: `https://petrobras.service-now.com/incident.do?sys_id=${obj.id_chamado}&sysparm_record_target=incident&sysparm_record_list=assignment_group%3D72e9c9e91b94d5106c9842ece54bcb68%5EORassignment_group%3D12e989e91b94d5106c9842ece54bcba8%5EORassignment_group%3D28e985e91b94d5106c9842ece54bcbb1%5EORassignment_group%3Ddca36c211bb7c114de26a750f54bcb11%5Eactive%3Dtrue%5Estate%21%3D6%5Estate%3D3%5EORDERBYcategory`,
          sla: parseInt(obj.resolucao_tempo_restante) || 0,
        },
        { new: false, upsert: true }
      ).then(() => {
        console.log(
          `document of incident ${obj.identificador} successfully saved`
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  async deleteInfo(inc) {
    try {
      const doc = await this.InfoIncidents.findOneAndDelete(
        { inc: inc },
        { returnDocument: "before" }
      );
      
      if (doc) {
        const { _id, ...doc_archive } = doc.toObject();
        doc_archive.sla = doc.sla === 0;
        doc_archive.status = "Encerrado";
        doc_archive.justificativa = "";
        await this.ArchiveIncidents.create(doc_archive);
        console.log(`successfully deleted document of incident: ${inc}`);
      } else {
        console.log(`No document found with incident: ${inc}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async loadInfo(data) {
    let incListDB = [];
    const dataResponse = await this.InfoIncidents.find().exec();

    for (let obj of dataResponse) {
      incListDB.push(obj.inc);
    }

    for (let inc of data) {
      if (!incListDB.includes(inc)) {
        const modelData = await this.getData(inc);
        await this.addInfo(modelData);
      }
    }

    for (let inc of incListDB) {
      if (!data.includes(inc)) {
        await this.deleteInfo(inc);
      }
    }
  }

  async updateInfo() {
    const dataResponse = await this.InfoIncidents.find().exec();
    for (let data of dataResponse) {
      const obj = await this.getData(data.inc);
      await this.addInfo(obj);
    }
  }
}

module.exports = InfoIncidents;
