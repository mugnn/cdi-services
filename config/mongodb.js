
const mongoose = require('mongoose');

const pass = "tNpKtP0NRkaKrwts"
const uri = `mongodb+srv://gusmaooleo:${pass}@cdi-aton.3jltpj5.mongodb.net/cdi?appName=cdi-aton`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then().catch(err => console.error('Error: ', err));
    

module.exports = mongoose;
