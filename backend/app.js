const express = require('express');
const session = require('express-session');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const services = require("./requests")
const cors = require('cors')
const cronJob = require('cron').CronJob;
const port = 4010;
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));


class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

// create connection to database
const db_config = {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
};
db = new Database(db_config)

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
// app.use(cors({origin: 'http://192.168.1.6:3000', credentials: true}));
app.use(fileUpload()); // configure fileupload

// routes for the app
app.get('/getUsers', services.getUsers);
app.get('/getRoles', services.getRoles);
app.get('/getProjects/:userId', services.getProjects);
app.get('/getUsersFromProject/:projectId', services.getUsersFromProject);

app.post('/auth', services.authentication);
app.post('/addUser', services.addUser);
app.post('/deleteUser', services.deleteUser);
app.post('/checkUsername/:username', services.checkUsername);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
