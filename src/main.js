
import express from 'express'
import { Server as HttpServer }  from 'http'
import { Server as IOServer } from 'socket.io'
import { productosDao , mensajesDao } from './daos/index.js'
import { ContenedorMemoria } from './container/ContenedorMemoria.js'
import { createManyProducts } from './mocks/productosMocks.js'
import { webAuth, apiAuth } from '../src/auth/index.js'

import session from 'express-session'
import MongoStore from 'connect-mongo'



const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


app.use(express.json())
app.use(express.urlencoded({extended: true}))
//------------------Configuracion EJS---------------------------------//
app.set('views', './views')
app.set('view engine', 'ejs')


const advancedOptions = { useNewUrlParser: true , useUnifiedTopology: true}

app.use(session({
    // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
    store: MongoStore.create(
        {
            mongoUrl:'mongodb+srv://admin:admin456@22mocksynormalizacion.xj8iwvr.mongodb.net/test',
            mongoOptions: advancedOptions
        }),
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 6000
    }
}))

app.get('/login' , (req, res) => {
    res.render('pages/login')
})

app.post('/login', (req, res) => {
    req.session.nombre = req.body.name
    console.log(req.session)
    res.redirect('/index')
})

app.get('/index', apiAuth , (req, res) => {
    res.render('pages/index',{nombre: req.session.nombre})
})

app.get('/logout', apiAuth , (req, res) => {
    console.log('Estas en ruta /logout')
    res.render('pages/logout', { nombre : req.session.nombre})
    req.session.destroy()
})

/* app.get('/index/logout', apiAuth , (req, res) => {
    if(req.session.nombre){
        res.redirect('/logout', { nombre: req.session.nombre })
        req.session.destroy()
    } else {
        res.redirect('login')}
}) */





const mensajesMemoria = new ContenedorMemoria()          // Instancio contendor de mensajes en memoria

await mensajesDao.borrarTodo()                           // Borro los mensajes guardados en mongoDB
await productosDao.borrarTodo();                         // Booro los productos guardados en mongoDB


const prod = createManyProducts(5)                       // Mockeo 5 productos
prod.forEach(elem => {
    productosDao.guardar(elem)
})

//--------------------------Websockets----------------------------//

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado!')

    /* Envio los productos y mensajes al cliente que se conectó */
    socket.emit('products', await productosDao.listarAll())
    socket.emit('messages',  mensajesMemoria.listarAll())

    /* Escucho el nuevo producto enviado por el cliente y se los propago a todos */
    socket.on('newProduct', async (newProduct) => {
        await productosDao.guardar(newProduct)
        console.log(newProduct)
        io.sockets.emit('products', await productosDao.listarAll())
    })

    /* Escucho el nuevo mensaje de chat enviado por el cliente y se los propago a todos */
    socket.on('newMessage', async (res) =>{
        mensajesMemoria.guardar(res)
        await mensajesDao.guardar(res)
        io.sockets.emit('messages', mensajesMemoria.listarAll())
    })
})


//------------------Configuracion Server---------------------------------//

const PORT = 8080
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on(`error`, error => console.log(`Error en servidor: ${error}`))
