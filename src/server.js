const express = require('express');
const server = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const validatePayload = require('./middleware/validatePayload');

server.use(cors());
server.use(express.json());
server.use(validatePayload);
server.use(bodyParser.json());


//--------------------------------------------------------------------------
server.use('/auth',     require('./routes/authRoutes'));
server.use('/user', require('./routes/user/userRoutes'));
server.use('/health',   require('./routes/healthRoutes'));

server.use('/customer', require('./routes/customer/customerRoutes'));
server.use('/contract', require('./routes/contract/contractRoutes'));
server.use('/location', require('./routes/location/locationRoutes'));


// Middleware para lidar com rotas não encontradas
server.use((req, res) => {
    res.status(404).json({ error: 'Rota não cadastrada' });
});


//init server
server.listen(3001, ()=>{
    console.log('API RUNNING AT 3001');
})



