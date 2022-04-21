import { findByApiKey } from "../repositories/companyRepository.js";
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { TransactionTypes, CardInsertData, CardUpdateData } from '../repositories/cardRepository.js';
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from 'bcrypt';

async function createCard(apiKey: string, employeeId: number, type: TransactionTypes) {
    await validateApiKey(apiKey);

    const employee = await employeeRepository.findById(employeeId)
    if(!employee){
        throw { type: 'bad_request', message: 'funcionário não encontrado' }
    }

    const cardTypeExists = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
    if(cardTypeExists){
        throw { type: 'conflict', message: 'funcionário já possui esse tipo de cartão' }
    }

    const cardData = generateCardData(employeeId, employee, type);

    await cardRepository.insert(cardData);
}

async function activateCard(cardId: number, cvv: string, password: string) {
    const card = await validateCardId(cardId);

    validateExpirationDate(card.expirationDate);

    if(card.password){
        throw { type: 'bad_request', message: 'cartão já ativado' }
    }

    if(!(bcrypt.compareSync(cvv, card.securityCode))){
        throw { type: 'unauthorized', message: 'CVV incorreto' }
    }

    validatePassword(password);
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const cardData: CardUpdateData = {
        password: encryptedPassword
    }
    await cardRepository.update(cardId, cardData);
}

async function cardBalance(cardId: number) {
    await validateCardId(cardId);

    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);

    const rechargesSum = amount(recharges)
    const transactionsSum = amount(transactions)
    const balance = rechargesSum - transactionsSum;

    const balanceData = {
        balance,
        transactions,
        recharges
    }

    return balanceData;
}

async function cardRecharge(apiKey: string, cardId: number, amount: number) {
    await validateApiKey(apiKey);

    const card = await validateCardId(cardId);

    validateExpirationDate(card.expirationDate);

    await rechargeRepository.insert({ cardId, amount });
}


async function validateApiKey(apiKey: string) {
    const key = await findByApiKey(apiKey);
    if (!key) {
        throw { type: 'unauthorized', message: 'chave inválida' }
    }
}

function generateCardData(employeeId: number, employee: any, type: TransactionTypes){
    const number: string = faker.finance.creditCardNumber('mastercard');

    const cardholderName: string =  createCardHolderName(employee.fullName);

    const expirationDate:string = dayjs().add(5, 'year').format('MM/YY');

    const cvv = faker.finance.creditCardCVV();
    console.log(cvv);
    const securityCode = bcrypt.hashSync(cvv, 10);

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

    return cardData;
}

async function validateCardId(cardId: number){
    const card = await cardRepository.findById(cardId);
    if(!card){
        throw { type: 'not_found', message: 'cartão não encontrado' }
    }

    return card;
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
    let isExpirationDateValid = false;
    
    if (currentDate[1] < expirationDate[1]) {
        isExpirationDateValid = true;
    } else if(currentDate[1] === expirationDate[1]) {
        if (currentDate[0] <= expirationDate[0]) {
            isExpirationDateValid = true;
        }
    }

    if(!isExpirationDateValid){
        throw { type: 'unauthorized', message: 'cartão fora da data de validade' }
    }
}

function validatePassword(password: string){
    if(password.length !== 4){
        throw { type: 'bad_request', message: 'senha deve conter 4 dígitos numéricos' }
    }

    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    for(let i=0; i<password.length; i++){
        if(!numbers.includes(password[i])){
            throw { type: 'bad_request', message: 'senha deve conter apenas números' }
        }
    }
}

function amount(movements: any) {
    let balance = 0;
    movements.map(movement => {
        return balance += movement.amount
    });

    return balance;
}


export {
    createCard,
    activateCard,
    cardBalance,
    cardRecharge,
    validateCardId,
    validateExpirationDate
}