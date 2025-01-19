// models/Template.js
import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  footer: { type: String, required: true },
});

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);