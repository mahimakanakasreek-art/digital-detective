import mongoose from 'mongoose';
const { Schema } = mongoose;

const clueSchema = new Schema({
  case: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  key: { type: String, required: true, trim: true },
  order: { type: Number, required: true },
  kind: String,
  title: { type: String, required: true },
  short: String, detail: String, reveal: String, found: String,
  role: { type: String, enum: ['key', 'supporting', 'misleading'], required: true }, // server-side only
  hint: String, why: String, // used for result feedback only
  suspects: [{ type: Schema.Types.ObjectId, ref: 'Suspect' }], // suspects this clue points at
}, { timestamps: true });
clueSchema.index({ case: 1, key: 1 }, { unique: true });

export default mongoose.models.Clue || mongoose.model('Clue', clueSchema);
