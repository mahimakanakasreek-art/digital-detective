import mongoose from 'mongoose';
const { Schema } = mongoose;

const suspectSchema = new Schema({
  case: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  key: { type: String, required: true, trim: true }, // stable slug inside the case, e.g. "ryan"
  order: { type: Number, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  initials: String, access: String, accessPct: Number, status: String, risk: Number,
  short: String, reveal: String, activity: String, notes: String,
  log: [{ _id: false, time: String, event: String }],
}, { timestamps: true });
suspectSchema.index({ case: 1, key: 1 }, { unique: true });

export default mongoose.models.Suspect || mongoose.model('Suspect', suspectSchema);
