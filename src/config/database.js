require('dotenv').config();
const mongoose = require('mongoose');

const conn_str = `mongodb+srv://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true`;

mongoose.connect(conn_str)
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

mongoose.Promise = global.Promise;

module.exports = mongoose;
