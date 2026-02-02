import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    url: { type: String },
    events: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Session", sessionSchema);
