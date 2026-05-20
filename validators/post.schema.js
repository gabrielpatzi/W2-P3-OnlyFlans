import Joi from 'joi';

const createPostSchema = Joi.object({
    text: Joi.string().min(1).required()
    // imageUrl viene de multer, no del body JSON
});

const postParamsSchema = Joi.object({
    creatorId: Joi.number().integer().positive().required(),
    postId: Joi.number().integer().positive().required()
});

const commentSchema = Joi.object({
    text: Joi.string().min(1).max(1000).required()
});

const commentParamsSchema = Joi.object({
    creatorId: Joi.number().integer().positive().required(),
    postId: Joi.number().integer().positive().required(),
    commentId: Joi.number().integer().positive().required()
});

export { createPostSchema, postParamsSchema, commentSchema, commentParamsSchema };
