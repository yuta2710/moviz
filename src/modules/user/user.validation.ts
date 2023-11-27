import Joi from "joi";

export const onCreate = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  username: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().required().min(6).trim(),
  role: Joi.string().required().trim(),
});
