import joi from 'joi';

const purchaseSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().required(),
    businessId: joi.number().required(),
    price: joi.number().required()
})

export default purchaseSchema;