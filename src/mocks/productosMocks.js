import { faker } from '@faker-js/faker';

faker.locale = 'es'

let idProduct = 0
let idMesagge = 0


export const createManyProducts = (cant) => {
    let result = []
    for(let i = 0 ; i < cant ; i++ ) {
        result.push(createProduct())
    }
    return result;
}

const createProduct = () => {
    idProduct++
    return {
        id: idProduct,
        title: faker.commerce.product(),
        price: faker.commerce.price() ,
        thumbnail: faker.image.abstract( 640 , 480 , true)
    }
}


export const createManyMesagges = (cant) => {
    let result = []
    for(let i = 0 ; i < cant ; i++ ) {
        result.push(createMesagge())
    }
    return result;
}

const createMesagge = () => {
    const firstName =faker.name.firstName()
    const lastName = faker.name.lastName()
    return {
        id: faker.internet.ip(),
        author: {
            id: faker.internet.email(firstName, lastName),
            nombre: firstName ,
            apellido: lastName,
            edad: Math.round(Math.random() * (95 - 14) + 14),
            alias: faker.internet.userName(firstName, lastName),
        },

        text: faker.lorem.words(15),
    }
}





