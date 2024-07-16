const mongoose = require('../config/mongodb');

const { Schema } = mongoose;

const icSchema = new Schema({
  ic_code: {
    type: String,
    required: true
  },
  ic_name: {
    type: String,
    required: true
  },
  site: {
    type: String,
    required: true
  },
  suffix: {
    type: String,
    required: true
  },
  related_incidents: {
    type: Array,
    required: true
  },
  recurrences: {
    type: Number,
    required: true
  }
}, { collection: 'ic' })

const IcModel = mongoose.model('ic_model', icSchema);

module.exports = IcModel;
