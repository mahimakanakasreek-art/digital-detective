import mongoose from 'mongoose';
const { Schema } = mongoose;

// A player's submitted deduction. `createdAt` is the submission timestamp.
const investigationSchema = new Schema({
  case: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  suspect: { type: Schema.Types.ObjectId, ref: 'Suspect', required: true },
  clues: [{ type: Schema.Types.ObjectId, ref: 'Clue' }],
  evidence: [{ type: Schema.Types.ObjectId, ref: 'Evidence' }],
  deduction: { type: String, required: true, trim: true, maxlength: 2000 },
  result: { solved: { type: Boolean, required: true }, strength: { type: Number, min: 0, max: 100 } },
  revealed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Investigation || mongoose.model('Investigation', investigationSchema);
