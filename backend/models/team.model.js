import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    category: [{ type: String, required: true }],
})

const teamModel = mongoose.models.team || mongoose.model('team', teamSchema)

export default teamModel