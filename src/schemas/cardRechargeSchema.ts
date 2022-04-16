import joi from 'joi';

const cardRechargeSchema = joi.object({
    cardId: joi.number().required(),
    amount: joi.number().required()
})

export default cardRechargeSchema;