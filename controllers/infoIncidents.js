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
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
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
      console.log(modelData);
    }
  }
};
