import express from "express"
import { register, login, logout, getAllUsers } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/user.middleware.js";

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', logout)
userRouter.get('/get-all', userAuth, getAllUsers)

export default userRouter;