import joi from 'joi';

const activateCardSchema = joi.object({
    cvv: joi.string().required(),
    password: joi.string().required()
})

export default activateCardSchema;