import Joi from 'joi';

const donationSchema = Joi.object({
    flanCount: Joi.number().integer().min(1).required(),
    message: Joi.string().max(300).allow('', null)
});

const donationParamsSchema = Joi.object({
    creatorId: Joi.number().integer().positive().required()
});

const donationFilterSchema = Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    creatorName: Joi.string()
});

export { donationSchema, donationParamsSchema, donationFilterSchema };
