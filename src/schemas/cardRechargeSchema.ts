import joi from 'joi';

const cardRechargeSchema = joi.object({
    amount: joi.number().required()
})

export default cardRechargeSchema;