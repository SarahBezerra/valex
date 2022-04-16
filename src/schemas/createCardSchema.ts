import joi from 'joi';

const createCardSchema = joi.object({
    employeeId: joi.number().required(),
    cardType: joi.string().required().valid('groceries', 'restaurant', 'transport', 'education', 'health').insensitive()
})

export default createCardSchema;