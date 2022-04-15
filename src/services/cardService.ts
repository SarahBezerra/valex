import { findByApiKey } from "../repositories/companyRepository.js"

async function validateApiKey(apiKey: string) {
    const result =  await findByApiKey(apiKey);

    if(!result){
        throw ("chave de api não encontrada")
    }
}

export {
    validateApiKey
}