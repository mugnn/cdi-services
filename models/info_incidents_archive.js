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
  mesa_atendimento: {
    type: String,
    required: true
  },
  abertura: {
    type: String,
    required: true
  },
  limite: {
    type: String,
    required: true
  },
  ultima_atualizacao: {
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
  localizacao: {  
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
  url: {
    type: String,
    required: true
  },
  sla: {
    type: Boolean,
    required: true
  },
  justificativa: {
    type: String,
    required: false
  },
}, { collection: 'incidents_archive' })

const IncidentsValuesModel = mongoose.model('incidentsValuesArchive', incidents);


module.exports = IncidentsValuesModel;