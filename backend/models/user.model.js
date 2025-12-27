import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, default: "" },
    otpExpiryAt: { type: Number, default: 0 },
    role: { type: String, enum: ["Employee", "Technician", "Manager"], default: "Employee" },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User