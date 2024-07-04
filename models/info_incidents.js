const mongoose = require('../config/mongodb');

const { Schema } = mongoose;

const incidents = new Schema({
  tasknumber: {
    type: String,
    required: true
  },

}, { collection: 'incidents' })

const IncidentsValuesModel = mongoose.model('incidentsValues', incidents);


module.exports = IncidentsValuesModel;