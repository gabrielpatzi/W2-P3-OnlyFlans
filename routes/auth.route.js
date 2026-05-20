import { Router } from 'express';
import validate from '../middlewares/validateSchema.js';
import jsonRequestValid from '../middlewares/jsonRequestValid.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { registerUserSchema, loginUserSchema } from '../validators/user.schema.js';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', jsonRequestValid, validate(registerUserSchema), registerUser);
authRouter.post('/login', jsonRequestValid, validate(loginUserSchema), loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);

export default authRouter;
