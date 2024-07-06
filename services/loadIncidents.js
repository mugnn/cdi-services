const { DateTime } = require("luxon");
const { ObjectId } = require("mongodb");

class LoadIncidents {
  constructor() {
    this.IncidentModel = require("./../models/active_incidents");
    this.incident = require("./../controllers/updateIncidents");
    this.current_id = { _id: new ObjectId("667c3a926ab21b0be6fafc75") };
    this.previous_id = { _id: new ObjectId("667c3a926ab21b0be6fafc76") };
  }

  update() {
    this.incident()
      .then(async (values) => {
        try {
          const previous_values = await this.IncidentModel.findById(this.current_id).exec();

          const previous = await this.IncidentModel.updateOne(this.previous_id, {
            date: previous_values.date,
            new: previous_values.new,
            progress: previous_values.progress,
            pending: previous_values.pending,
            inline: previous_values.inline,
            incidents: previous_values.incidents,
          });
          const current = await this.IncidentModel.updateOne(this.current_id, {
            date: DateTime.now().setZone("America/Sao_Paulo").toISO(),
            new: values.new,
            progress: values.progress,
            pending: values.pending,
            inline: values.inline,
            incidents: values.incidents,
          });
          console.log(`added: ${current.acknowledged && previous.acknowledged}`);
        } catch (e) {
          console.log(
            `error: (${String.toString(e).slice(
              0,
              20
            )}). waiting for the next jump.`
          );
        }
      })
      .finally(() => {
        console.log(
          `update ${DateTime.now().setZone("America/Sao_Paulo").toISO()}`
        );
      });
  }
}

module.exports = LoadIncidents;
