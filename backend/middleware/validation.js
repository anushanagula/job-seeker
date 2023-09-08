const Joi = require('joi')
const validateUser = (user) => {
    const schema = Joi.object({
      email: Joi.string().email().min(5).max(500).required(),
      firstName: Joi.string().min(1).max(500).required(),
      lastName: Joi.string().min(1).max(500).required(),
      contact: Joi.number().integer().required(),
    })
    return schema.validate(user)
  }
  const validateEducation = (education) => {
    const schema = Joi.object({
      college: Joi.string().min(5).max(500).required(),
      university: Joi.string().min(1).max(500).required(),
      course: Joi.string().min(1).max(500).required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().greater(Joi.ref('startDate')).required()
    })
    return schema.validate(education)
  }

  module.exports = {
    validateUser,
    validateEducation
  }