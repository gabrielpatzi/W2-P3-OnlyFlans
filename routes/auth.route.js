import { Router } from 'express';
import validate from '../middlewares/validateSchema.js';
import jsonRequestValid from '../middlewares/jsonRequestValid.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { registerUserSchema, loginUserSchema } from '../validators/user.schema.js';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', jsonRequestValid, validate(registerUserSchema), registerUser); //check
authRouter.post('/login', jsonRequestValid, validate(loginUserSchema), loginUser); //check
authRouter.post('/logout', authMiddleware, logoutUser); //check

export default authRouter;
