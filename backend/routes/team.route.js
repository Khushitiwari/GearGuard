import express from "express";
import {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
    deleteTeam
} from "../controllers/team.controller.js";

import { userAuth, authorizeRoles } from "../middlewares/user.middleware.js";

const teamRouter = express.Router();

teamRouter.post(
    "/create",
    userAuth,
    authorizeRoles("Manager"),
    createTeam
);


teamRouter.get(
    "/get-all",
    userAuth,
    getAllTeams
);


teamRouter.get(
    "/:id",
    userAuth,
    getTeamById
);

teamRouter.put(
    "/:id",
    userAuth,
    updateTeam
);

teamRouter.delete(
    "/:id",
    userAuth,
    authorizeRoles("Manager"),
    deleteTeam
);

export default teamRouter;
