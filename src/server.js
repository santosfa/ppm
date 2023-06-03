const express = require('express');
const server = express();
const cors = require("cors");

server.use(cors());
server.use(express.json());


//Inclui as rotas para as requisições.
server.use('/health', require('./routes/healthRoutes'));
server.use('/task', require('./routes/taskRoutes'));
server.use('/auth', require('./routes/authRoutes'));

//-----------------------------------------------------


//init server
server.listen(3001, ()=>{
    console.log('API RUNNING AT 3001');
})



