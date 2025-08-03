import { Router } from "express";
import { createAccount, loginAccount, getUserDetails, logoutAccount } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const authRouter = Router()

authRouter.post('/register', createAccount)
authRouter.post('/login', loginAccount)
authRouter.delete('/logout', authenticate, logoutAccount)
authRouter.get('/get', authenticate, getUserDetails)

export default authRouter