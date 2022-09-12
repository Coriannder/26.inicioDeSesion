
let productosDao
let carritosDao = ''
let mensajesDao

switch (/* process.env.PERS */'mongoDb') {

    case 'mongoDb':
        const {default: ProductosDaoMongoDb} = await import ('./productos/ProductosDaoMongoDb.js')
        productosDao = new ProductosDaoMongoDb()

        const { default: CarritoDaoMongoDb } = await import ('./carritos/CarritosDaoMongoDb.js')
        carritosDao = new CarritoDaoMongoDb()

        const { default: MensajesDaoMongoDb } = await import ('./mensajes/mensajesDaoMongoDb.js')
        mensajesDao = new MensajesDaoMongoDb()
}

export {productosDao, carritosDao, mensajesDao }

