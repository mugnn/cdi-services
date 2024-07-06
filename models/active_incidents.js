
const mongoose = require('./../config/mongodb');

const { Schema } = mongoose;

const activeIncident = new Schema({
  date: {
    type: String,
    required: true
  },
  new: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  pending: {
    type: Number,
    required: true
  },
  inline: {
    type: Array,
    required: true
  },
  incidents: {
    type: Array,
    required: true
  }
}, { collection: 'realtime' })

const IncidentModel = mongoose.model('activeIncident', activeIncident);

module.exports = IncidentModel;
