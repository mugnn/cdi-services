const LoadIncidents = require('./services/loadIncidents');
const InfoIncidents = require('./controllers/infoIncidents')
const Scheduler = require('node-cron');

const LoadData = async () => {
  const v = await new LoadIncidents().update();
  await new InfoIncidents().loadInfo(v);
}

const UpdateInfoIncidents = async () => {
  await new InfoIncidents().updateInfo();
}

const run = async () => {
  await LoadData();
  await UpdateInfoIncidents();
}

run();


Scheduler.schedule('*/6 8-18 * * 1-5', async () => {
  await LoadData();
});

Scheduler.schedule('*/20 8-18 * * 1-5', async () => {
  await UpdateInfoIncidents();
});

Scheduler.schedule('0 0 1 */2 *', async () => {
  const deletedIncidents = await new InfoIncidents().deleteArchived();
  console.log(`
    | (scheduled event) successfull incidents deleted: ${deletedIncidents} |
  `)
});