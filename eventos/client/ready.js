const mongoose = require('mongoose');
const config = require('../../config/config.json');
module.exports = client => {
    // coneccion a base de datos

    mongoose.connect(config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Conectado a la base de datos mongodb'.blue);
    }).catch((err) => {
        console.log(`error al conectar a la base de datos de mongodb`.red);
        console.log(err)
    })

    console.log(`conectado como: ${client.user.tag}`.green)
}