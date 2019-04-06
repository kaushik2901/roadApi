const http = require('http');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 2998;
// const MONGODB = process.env.MONGODB || 'mongodb://localhost:27017/roads'
const MONGODB = process.env.MONGODB || 'mongodb://road123:road123@ds163835.mlab.com:63835/roads';

mongoose.set('useCreateIndex', true);
mongoose.connect(MONGODB, { useNewUrlParser: true });
const connection = mongoose.connection;
mongoose.Promise = global.Promise;

connection.on('error', () => {
    console.log("Error connecting database");
});

connection.once('open', () => {
    //Running server
    const app = require('./app');

    app.set('port', PORT);
    server = http.createServer(app);
    server.listen(app.get('port'), () => console.log("Road API is listening on port " + app.get('port')));
});
