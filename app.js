const LoadIncidents = require('./services/loadIncidents');
const LoadInfo = require('./controllers/infoIncidents')


const LoadData = async () => {
  const v = await new LoadIncidents().update();
  await LoadInfo(v);

  /* ... */
}

LoadData();

setInterval(LoadData, 500000);