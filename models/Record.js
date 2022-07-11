import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema(
  {
    patientId:String,
    bcg: String,
    covid: String,
    bcg: String,
    covid: String,
    description: String,
    dpt: String,
    dt: String,
    hbv: String,
    height: String,
    measles: String,
    polio: String,
    weight: String,
  },
  { timestamps: true }
);

const Record = mongoose.model("Record", RecordSchema);

export default Record;
