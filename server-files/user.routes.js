const decodeJwt = require("./jwt")
const winston = require('winston');


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });


const loginRoute = async (req, res) => {
    const { token } = req.body
    try {
        const { email, password } = req.body

        console.log("pass: " + password)
        const jwt = await decodeJwt.createJwt({email, password})

        console.log("login flow")
        const users = await getUser({ email })
        console.log("user: " + users)

        if (users[0] && users[0].password.toString() === password.toString()) {
            res.json({status: "ok", token: jwt, firstname: users[0].firstname, lastname: users[0].lastname, email: users[0].email})
        } else {
            res.status(500).json({status: "failed to get user creds"})
        }
    } catch (err) {
        res.status(400).json({status: "Failed to login"})
    }
}

const registerRoute = async (req, res) => {
    const { email, firstname, lastname, password} = req.body

    verifyUser( {email, firstname, lastname, password} )

    try {
        const user = await saveUser({email, firstname, lastname, password})

        res.json({status: "user created successfully", data: user})

    } catch (err) {
        res.status(400).json({status: "user creation has been failed", data: err})
    }
}

const verifyUser = ({ email, firstname, lastname, password }) => {
    return true
}


function saveUser({ email, firstname, lastname, password }) {
    return new Promise((resolve, reject) => {
        const MongoClient = require('mongodb').MongoClient;

        // Connection URL
        const url = 'mongodb+srv://admin:admin@cluster0.zoiem.mongodb.net/ds-db?retryWritesc=true';
    
        // Database Name
        const dbName = 'ds-db';
    
        // Use connect method to connect to the server
        MongoClient.connect(url, function(err, client) {
            console.log('Connected correctly to mongodb server');
    
            const db = client.db(dbName);
    
            insertContextsDocuments(db, (err, result) => {
                if (err) {
                    reject(err)
                }
                client.close()
                resolve(result)
            })({ email, firstname, lastname, password })
        })
    })
}

const insertContextsDocuments = (db, callback) => ({ email, firstname, lastname, password }) => {
    // Get the documents collection
    const collection = db.collection('users');
    logger.log({
        level: 'info',
        message: 'inserting into users'
    })
    // Insert some documents
    collection.insertMany([{ email, firstname, lastname, password }], function(err, result) {
        logger.log({
            level: 'info',
            message: 'Inserted 1 documents into the collection users'
        })
        callback(err, result);
    })
  }

const getUser = ({email}) => {
    return new Promise((resolve, reject) => {
        const MongoClient = require('mongodb').MongoClient;

        // Connection URL
        const url = 'mongodb+srv://admin:admin@cluster0.zoiem.mongodb.net/ds-db?retryWritesc=true';
    
        // Database Name
        const dbName = 'ds-db';

        // Use connect method to connect to the server
       MongoClient.connect(url, function(err, client) {
           console.log('Connected correctly to mongodb server');
    
           const db = client.db(dbName);
    
           findDocumentsByEmail(db, (result) => {
               client.close()
               resolve(result)
           }
           )({ email })
       })
    })
}

const findDocumentsByEmail = (db, callback) => ({email}) => {
    // Get the documents collection
    const collection = db.collection('users')
    // Find some documents
    console.log("email: " + email)
    var query = { email }

    collection.find(query).toArray(function(err, docs) {
      console.log('Found the following records')
      console.log(docs)
      callback(docs)
    })
}

module.exports = {
    loginRoute,
    registerRoute,
    getUser
}