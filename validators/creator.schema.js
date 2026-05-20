import Joi from 'joi';

const updateProfileSchema = Joi.object({
    bio: Joi.string().max(500).allow('', null),
    flanPrice: Joi.number().positive()
}).min(1);

const creatorParamsSchema = Joi.object({
    creatorId: Joi.number().integer().positive().required()
});

const goalSchema = Joi.object({
    title: Joi.string().min(3).max(150).required(),
    description: Joi.string().max(500).required()
});

const goalParamsSchema = Joi.object({
    goalId: Joi.number().integer().positive().required()
});

export { updateProfileSchema, creatorParamsSchema, goalSchema, goalParamsSchema };
