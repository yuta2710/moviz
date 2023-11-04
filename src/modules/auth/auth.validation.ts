import Joi from "joi";

export const onLogin = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().required().trim(),
});
