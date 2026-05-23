import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateSchema.js';
import validateParams from '../middlewares/validateParams.js';
import jsonRequestValid from '../middlewares/jsonRequestValid.js';
import upload from '../config/multer.config.js';

import { updateProfileSchema, goalSchema, goalParamsSchema, creatorParamsSchema } from '../validators/creator.schema.js';
import { createPostSchema } from '../validators/post.schema.js';
import * as creatorController from '../controllers/creator.controller.js';

const creatorRouter = Router();

// ─── Rutas exclusivas para creadores ─────────────────────────────────────────
creatorRouter.use(authMiddleware, requireRole('creador'));

// Perfil
creatorRouter.get('/me/profile', creatorController.getMyProfile); 
creatorRouter.put('/me/profile', jsonRequestValid, validate(updateProfileSchema), creatorController.updateMyProfile); 
creatorRouter.post('/me/profile/photo', upload.single('profilePhoto'), creatorController.uploadProfilePhoto); 
creatorRouter.post('/me/profile/banner', upload.single('bannerPhoto'), creatorController.uploadBannerPhoto);  

// Metas
creatorRouter.get('/me/goals', creatorController.getMyGoals); 
creatorRouter.post('/me/goals', jsonRequestValid, validate(goalSchema), creatorController.createGoal); 
creatorRouter.delete('/me/goals/:goalId', validateParams(goalParamsSchema), creatorController.deleteGoal); 
 
// Posts y pagina principal
creatorRouter.get('/me/page', creatorController.getMyPage); 
creatorRouter.post('/me/posts', upload.single('image'), validate(createPostSchema), creatorController.createPost); 
creatorRouter.delete('/me/posts/:postId', creatorController.deletePost); 

// Reporte de ingresos
creatorRouter.get('/me/income', creatorController.getIncomeReport); 

export default creatorRouter;
