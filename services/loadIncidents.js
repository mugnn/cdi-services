const { DateTime } = require("luxon");
const { ObjectId } = require("mongodb");

class LoadIncidents {
  constructor() {
    this.IncidentModel = require("./../models/active_incidents");
    this.incident = require("./../controllers/updateIncidents");
    this.id = { _id: new ObjectId("667c3a926ab21b0be6fafc75") };
  }

  update() {
    this.incident()
      .then(async (values) => {
        try {
          const res = await this.IncidentModel.updateOne(this.id, {
            date: DateTime.now().setZone("America/Sao_Paulo").toISO(),
            new: values.new,
            progress: values.progress,
            pending: values.pending,
          });
          console.log(`added: ${res.acknowledged}`);
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
        console.log("update incidents cicle done");
      });
  }
}

module.exports = LoadIncidents;
