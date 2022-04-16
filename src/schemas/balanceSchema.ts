import joi from 'joi';

const balanceSchema = joi.object({
    cardId: joi.number().required()
})

export default balanceSchema;