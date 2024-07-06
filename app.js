const LoadIncidents = require('./services/loadIncidents');


const LoadData = async () => {
  const v = await new LoadIncidents().update();
  console.log(v)
  /* ... */
}

LoadData();

setInterval(LoadData, 100000);