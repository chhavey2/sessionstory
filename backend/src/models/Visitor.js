import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    fp: { type: String, required: true, unique: true },
    ip: { type: String, required: true },
    country: { type: String },
    region: { type: String },
    city: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    timezone: { type: String },
    isp: { type: String },
    org: { type: String },
    as: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Visitor", visitorSchema);
