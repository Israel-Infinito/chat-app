const mongoose = require('mongoose');

const uri = 'mongodb+srv://ioa:rnlEXOGK91WwZGkQ@clusterusers.6ypib1g.mongodb.net/test?retryWrites=true&w=majority';  

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}

module.exports = { connect };