import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    warrantyExpiry: { type: Date, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'team' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now },
});

const equipmentModel =
    mongoose.models.equipment || mongoose.model('equipment', equipmentSchema);

export default equipmentModel;
