import ContenedorMongoDb from "../../container/ContenedorMongoDb.js";


class UsuariosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super('Usuarios', {
            email: {type: String, required: true, index: { unique: true }},
            password: {type: String, required: true },
        })
    }
}

export default UsuariosDaoMongoDb