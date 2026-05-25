import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateSchema.js';
import validateParams from '../middlewares/validateParams.js';
import jsonRequestValid from '../middlewares/jsonRequestValid.js';
import verifyDonor from '../middlewares/verifyDonor.js';

import { donationSchema, donationParamsSchema } from '../validators/donation.schema.js';
import { commentSchema,postParamsSchema } from '../validators/post.schema.js';
import { creatorParamsSchema } from '../validators/creator.schema.js';

import {
    sendDonation,
    getDonationHistory,
    getCreatorPosts,
    commentOnPost,
    addFavorite,
    removeFavorite,
    getMyFavorites,
    getFeed,
    searchCreators,
    getPublicCreatorProfile
} from '../controllers/follower.controller.js';

const followerRouter = Router();

// Todas las rutas son solo para seguidores
followerRouter.use(authMiddleware, requireRole('seguidor'));


followerRouter.get('/search', searchCreators);
followerRouter.get('/:creatorId/public', validateParams(creatorParamsSchema), getPublicCreatorProfile); 

// Donaciones
followerRouter.post('/creators/:creatorId/donate',
    validateParams(creatorParamsSchema),
    jsonRequestValid,
    validate(donationSchema),
    sendDonation
);

// Ver publicaciones de un creador (solo si haya donado)
followerRouter.get('/creators/:creatorId/posts',
    validateParams(creatorParamsSchema),
    verifyDonor,
    getCreatorPosts
);

// Comentar en un post (solo si ha donado al creador)
followerRouter.post('/creators/:creatorId/posts/:postId/comments',
    validateParams(postParamsSchema),
    verifyDonor,
    jsonRequestValid,
    validate(commentSchema),
    commentOnPost
);

// Favoritos
followerRouter.get('/favorites', getMyFavorites);
followerRouter.post('/favorites/:creatorId',
    validateParams(creatorParamsSchema),
    addFavorite
);
followerRouter.delete('/favorites/:creatorId',
    validateParams(creatorParamsSchema),
    removeFavorite
);

// Feed (posts de creadores a los que sigo/doné)
followerRouter.get('/feed', getFeed);

// Historial de donaciones propias
followerRouter.get('/donations/history', getDonationHistory);



export default followerRouter;
