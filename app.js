const LoadIncidents = require('./services/loadIncidents');
const InfoIncidents = require('./controllers/infoIncidents')


const LoadData = async () => {
  const v = await new LoadIncidents().update();
  await new InfoIncidents().loadInfo(v);
  /* ... */
}

const UpdateInfoIncidents = async () => {
  await new InfoIncidents().updateInfo();
}

const run = async () => {
  await LoadData();
  await UpdateInfoIncidents();
}
run();

setInterval(async () => {
  await LoadData()
}, 360000);
setInterval(async () => {
  await UpdateInfoIncidents();
}, 1200000)