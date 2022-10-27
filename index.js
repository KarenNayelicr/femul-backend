const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const port = (process.env.port || 3000)
const AuthRoutes = require("./rutas/auth");
const cors = require("cors");


// Lectura y parseo del body
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({
    extended: true
  }));

// Configurar CORS
app.use(cors());

//configurar
app.set('port',port)

//rutas
app.use('/api/auth', AuthRoutes)

//función de middleware
app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))


app.listen(process.env.PORT || 3000) //Esto es para Heroku, asi se ejecuta el puerto


//inicializar express localmente
/* app.listen(app.get('port'),(error)=>{
    if(error)
    {console.log('error al iniciar el servidor: '+error)}
    else{
        console.log('servidor iniciado en el prueto: '+port)
    }
}) */
