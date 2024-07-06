const mongoose = require('../config/mongodb');

const { Schema } = mongoose;

const incidents = new Schema({
  inc: {
    type: String,
    required: true
  },
  kb: {
    type: Boolean,
    required: true
  },
  abertura: {
    type: String,
    required: true
  },
  assumido: {
    type: String,
    required: true 
  },
  limite: {
    type: String,
    required: true
  },
  data_atual: {
    type: String,
    required: true
  },
  solicitante: {
    type: String,
    required: true
  },
  analista: {
    type: String,
    required: true,
  },
  dispositivo: {
    type: String,
    required: true 
  },
  pendencia: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  problema: {
    type: String,
    required: true
  },
  sla: {
    type: Boolean,
    required: true
  },
}, { collection: 'incidents' })

const IncidentsValuesModel = mongoose.model('incidentsValues', incidents);


module.exports = IncidentsValuesModel;