const LoadIncidents = require('./services/loadIncidents');


const LoadData = async () => {
  await new LoadIncidents().update();
  /* ... */
}

setInterval(LoadData, 100000);