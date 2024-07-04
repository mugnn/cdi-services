const LoadIncidents = require('./services/loadIncidents');


const LoadData = async () => {
  await new LoadIncidents().update();
  /* ... */
}

LoadData();

setInterval(LoadData, 100000);