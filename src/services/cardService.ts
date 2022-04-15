import { findByApiKey } from "../repositories/companyRepository.js";
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { TransactionTypes, CardInsertData, CardUpdateData } from '../repositories/cardRepository.js';
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from 'bcrypt';

async function createCard(apiKey: string, employeeId: number, type: TransactionTypes) {
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

    const expirationDate:string = dayjs().add(5, 'year').format('MM/YY');

    const securityCode = bcrypt.hashSync((faker.finance.creditCardCVV()), 10);

    const cardData: CardInsertData = {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type,
    };

    await cardRepository.insert(cardData);
}

async function activateCard(cardId: number, cvv: string, password: string) {
    const card = await cardRepository.findById(cardId);
    if(!card){
        throw ("cartão não encontrado")
    }

    const isExpirationDateValid = validateExpirationDate(card.expirationDate);
    if(!isExpirationDateValid){
        throw ("cartão fora da data de validade")
    }

    if(card.password){
        throw ("cartão já ativado")
    }

    if(!(bcrypt.compareSync(cvv, card.securityCode))){
        throw ("CVV incorreto")
    }

    validatePassword(password);
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const cardData: CardUpdateData = {
        password: encryptedPassword
    }
    await cardRepository.update(cardId, cardData)
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

function validateExpirationDate(date: string) {
    var currentDate = dayjs().format('MM/YY').split("/");
    var expirationDate = date.split("/");

    if (currentDate[1] < expirationDate[1]) {
        return true;
    } else if (currentDate[1] === expirationDate[1]) {
        if (currentDate[0] <= expirationDate[0]) {
            return true;
        }
        return false;
    }
    return false;
}

function validatePassword(password: string){
    if(password.length !== 4){
        throw ("senha deve contar 4 dígitos numéricos")
    }

    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    for(let i=0; i<password.length; i++){
        if(!numbers.includes(password[i])){
            throw ("senha deve conter apenas números")
        }
    }
}

export {
    createCard,
    activateCard
}