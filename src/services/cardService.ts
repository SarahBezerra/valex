import { findByApiKey } from "../repositories/companyRepository.js";
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { TransactionTypes, CardInsertData } from '../repositories/cardRepository.js';
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from 'bcrypt';

async function validateCard(apiKey: string, employeeId: number, type: TransactionTypes) {
    const key =  await findByApiKey(apiKey);
    if(!key){
        throw ("chave de api não encontrada")
    }

    const employee = await employeeRepository.findById(employeeId)
    if(!employee){
        throw ("fucionario não cadastrado")
    }

    const cardTypeExists = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
    if(cardTypeExists){
        throw ("funcionário já possui esse tipo de cartão")
    }

    const number: string = faker.finance.creditCardNumber('mastercard');

    const cardholderName: string =  createCardHolderName(employee.fullName);

    const expirationDate:string = dayjs().add(5, 'year').format('MM/YYYY');

    const securityCode = bcrypt.hashSync((faker.finance.creditCardCVV()), 10);

    const cardData: CardInsertData = {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: "",
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type,
    };

    await cardRepository.insert(cardData);
}


function createCardHolderName(employeeName: string) {
    const name = employeeName.split(" ");

    let cardHolderName = "";
    for (let i = 0; i < name.length; i++) {
        if (i === 0) {
            cardHolderName += name[i] + " ";
        } else if (i !== name.length - 1 && name[i].length > 2) {
            cardHolderName += name[i][0] + " ";
        } else if (i === name.length - 1) {
            cardHolderName += name[i];
        }
    }

    return cardHolderName.toUpperCase();
}

export {
    validateCard
}