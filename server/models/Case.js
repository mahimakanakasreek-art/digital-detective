import mongoose from 'mongoose';
const { Schema } = mongoose;

// One document per case. Suspects, clues and evidence point back to it with a `case` reference,
// so adding another case later only means inserting more documents.
const caseSchema = new Schema({
  caseId: { type: String, required: true, unique: true, trim: true }, // public id, e.g. "404"
  title: { type: String, required: true, trim: true },
  status: { type: String, enum: ['ACTIVE', 'CLOSED'], default: 'ACTIVE' },
  security: { type: String, default: 'CLASSIFIED' },
  location: { type: String, default: '' },
  summary: { type: String, default: '' },
  difficulty: String, // optional, e.g. "MEDIUM"
  subject: String, // what went missing, e.g. "the prototype" (used in UI copy)
  label: String, // short decorative label for the landing hologram
  solution: { suspect: { type: Schema.Types.ObjectId, ref: 'Suspect' } }, // never sent to the client before a submission
  timeline: [{ _id: false, n: String, time: String, title: String, text: String }],
  report: { what: String, conclusion: String, splitRoles: Boolean }, // splitRoles: reveal lists key / supporting / misleading items separately
}, { timestamps: true });

export default mongoose.models.Case || mongoose.model('Case', caseSchema);
