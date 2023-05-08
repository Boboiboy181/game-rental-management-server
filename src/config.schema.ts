import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
});
