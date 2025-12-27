import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    description: { type: String, required: true },
    createdFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'equipment', required: true },
    requestedAt: { type: Date, default: Date.now },
    type: { type: String, enum: ["Corrective", "Preventive"], required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'team', required: true },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    status: { type: String, enum: ["New", "In Progress", "Repaired", "Scraped"], default: "New" },
    createdAt: { type: Date, default: Date.now },
});

const requestModel = mongoose.models.request || mongoose.model('request', requestSchema)

export default requestModel
