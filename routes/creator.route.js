import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateSchema.js';
import validateParams from '../middlewares/validateParams.js';
import jsonRequestValid from '../middlewares/jsonRequestValid.js';
import upload from '../config/multer.config.js';

import { updateProfileSchema, goalSchema, goalParamsSchema, creatorParamsSchema } from '../validators/creator.schema.js';
import { createPostSchema } from '../validators/post.schema.js';

import {
    getMyProfile,
    updateMyProfile,
    uploadProfilePhoto,
    uploadBannerPhoto,
    createGoal,
    getMyGoals,
    deleteGoal,
    createPost,
    getMyPage,
    deletePost,
    getIncomeReport,
    searchCreators,
    getPublicCreatorProfile
} from '../controllers/creator.controller.js';

const creatorRouter = Router();

// ─── Rutas compartidas (cualquier usuario autenticado) ────────────────────────
// Buscar creadores y ver su perfil publico
creatorRouter.get('/search', authMiddleware, searchCreators);
creatorRouter.get('/:creatorId/public', authMiddleware, validateParams(creatorParamsSchema), getPublicCreatorProfile);

// ─── Rutas exclusivas para creadores ─────────────────────────────────────────
creatorRouter.use(authMiddleware, requireRole('creador'));

// Perfil
creatorRouter.get('/me/profile', getMyProfile);
creatorRouter.put('/me/profile', jsonRequestValid, validate(updateProfileSchema), updateMyProfile);
creatorRouter.post('/me/profile/photo', upload.single('profilePhoto'), uploadProfilePhoto);
creatorRouter.post('/me/profile/banner', upload.single('bannerPhoto'), uploadBannerPhoto);

// Metas
creatorRouter.get('/me/goals', getMyGoals);
creatorRouter.post('/me/goals', jsonRequestValid, validate(goalSchema), createGoal);
creatorRouter.delete('/me/goals/:goalId', validateParams(goalParamsSchema), deleteGoal);

// Posts y pagina principal
creatorRouter.get('/me/page', getMyPage);
creatorRouter.post('/me/posts', upload.single('image'), createPost);
creatorRouter.delete('/me/posts/:postId', deletePost);

// Reporte de ingresos
creatorRouter.get('/me/income', getIncomeReport);

export default creatorRouter;
