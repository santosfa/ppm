const mongoose = require('mongoose');

const username = encodeURIComponent("appusr");
const password = encodeURIComponent("zAW7zHHpuXcHjapL");
const cluster  = "schmdb.tqfdr1i.mongodb.net";
const database = "crm";

const conn_str = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);

mongoose.connect(
    conn_str,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },(err) => {
        if (err) {
        console.log(err);
    } else {
        console.log("mongodb is connected");
    }});

mongoose.Promise = global.Promise;

module.exports = mongoose;

