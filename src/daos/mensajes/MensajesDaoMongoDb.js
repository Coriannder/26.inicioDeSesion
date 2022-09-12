import ContenedorMongoDb from "../../container/ContenedorMongoDb.js";


class MensajesDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super('Mensajes', {
            author: {
                email: {type: String, required: true},
                nombre: {type: String, required: true},
                apellido: {type: String, required: true},
                edad: {type: Number, required: true},
                alias: {type: String, required: true},
            },
            text: {type: String, required: true},
        })
        /* {
            entities: {
                chat: {
                    mensajes: {type: [], required: true}
                }
            },
            result: { type: String, require: true,}
        }) */
    }
}
export default MensajesDaoMongoDb


/* {
    entities: { chat: { chat: { id: 'chat', mensajes: [] } } },
    result: 'chat'
  } */