import Joi from 'joi';

const updateProfileSchema = Joi.object({
    bio: Joi.string().max(500).allow('', null) //un usuario no deberia decidir cuanto vale un flan para el, eso esta definido por el sistema 
}).min(1);
// cito al pdf de jm: "Cada donación equivale a un "flan" con un monto fijo (por ejemplo, Bs. 10)."
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
