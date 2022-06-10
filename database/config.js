const mongoose = require('mongoose');

const mongodbInitialSetup = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN,mongodbInitialSetup);

        console.log('Sucessfuly connection to the data base');

    } catch (error) {
        console.log(error);
        throw new Error('Error in connection time');
    }
}

module.exports = {
    dbConnection
}