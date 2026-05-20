import Joi from 'joi';

const registerUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('creador', 'seguidor').required()
});

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export { registerUserSchema, loginUserSchema };
