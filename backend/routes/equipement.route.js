import express from "express";
import {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment
} from "../controllers/equipement.controller.js";

import { userAuth } from "../middlewares/user.middleware.js";

const equipmentRouter = express.Router();

equipmentRouter.post("/create", userAuth, createEquipment);
equipmentRouter.get("/get-all", userAuth, getAllEquipment);
equipmentRouter.get("/get/:id", userAuth, getEquipmentById);
equipmentRouter.put("/update/:id", userAuth, updateEquipment);
equipmentRouter.delete("/delete/:id", userAuth, deleteEquipment);

export default equipmentRouter;
