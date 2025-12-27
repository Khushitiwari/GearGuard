import express from "express";
import {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} from "../controllers/request.controller.js";

import { userAuth } from "../middlewares/user.middleware.js";

const requestRouter = express.Router();

requestRouter.post("/create", userAuth, createRequest);
requestRouter.get("/get-all", userAuth, getAllRequests);
requestRouter.get("/get/:id", userAuth, getRequestById);
requestRouter.put("/:id", userAuth, updateRequest);
requestRouter.delete("/:id", userAuth, deleteRequest);

export default requestRouter;
