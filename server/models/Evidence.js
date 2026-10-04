import mongoose from 'mongoose';
const { Schema } = mongoose;

const evidenceSchema = new Schema({
  case: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  key: { type: String, required: true, trim: true },
  order: { type: Number, required: true },
  kind: String,
  title: { type: String, required: true },
  short: String, detail: String, reveal: String, found: String,
  role: { type: String, enum: ['key', 'supporting', 'misleading'], required: true },
  hint: String, why: String,
  clues: [{ type: Schema.Types.ObjectId, ref: 'Clue' }], // clues this evidence supports
}, { timestamps: true });
evidenceSchema.index({ case: 1, key: 1 }, { unique: true });

export default mongoose.models.Evidence || mongoose.model('Evidence', evidenceSchema);
