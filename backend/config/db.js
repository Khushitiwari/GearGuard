import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("DB connnected");

    })
    await mongoose.connect(`${process.env.MONGODB_URL}/GearGuardCluster`)
}

export default connectDB