const express = require('express')
const fileUpload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid');
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

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const app = express()

app.use(fileUpload())

app.listen(5000, () => console.log('server started'))

//Upload Endpoint

app.post('/upload', async (req, res) => {
    console.log("uploading file...")

    res.setHeader('Access-Control-Allow-Origin', '*')

    if (req.files === null) {
        return res.status(400).json({ msg: "No File was uploaded" })
    }

    //await sleep(5000)

    const file = req.files.file

    file.mv(`${__dirname}/files/${file.name}`, err => {
        if(err) {
            console.error(err)
            return res.status(500).send(err)
        }
       
        const path = `/uploads/${file.name}`
        const contextId = uuidv4()
        console.log('uploaded successfuly to', path)

        saveContextAndFile(contextId, path)

        res.json({ fileName: file.name, filePath: path , contextId})
    })
})

app.post('/process', async (req, res) => {
    const context = await getFileByContextId(req.query.contextId)
    logger.log({level: "info", context})

    res.json({msg: "ok", context: context, content: "start processing the video"})
})

app.options('/upload', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  

function saveContextAndFile(contextId, filePath) {
    const MongoClient = require('mongodb').MongoClient;

    // Connection URL
    const url = 'mongodb+srv://admin:admin@cluster0.zoiem.mongodb.net/ds-db?retryWritesc=true';

    // Database Name
    const dbName = 'ds-db';

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        console.log('Connected correctly to mongodb server');

        const db = client.db(dbName);

        insertContextsDocuments(db, (result) => client.close())({contextId, filePath})
    })
}

const insertContextsDocuments = (db, callback) => ({contextId, filePath}) => {
    // Get the documents collection
    const collection = db.collection('contexts');
    logger.log({
        level: 'info',
        message: 'inserting into contexts'
    })
    // Insert some documents
    collection.insertMany([{contextId, filePath}], function(err, result) {
        logger.log({
            level: 'info',
            message: 'Inserted 1 documents into the collection'
        })
        callback(result);
    })
  }


const getFileByContextId = async (contextId) => {
    const MongoClient = require('mongodb').MongoClient;

    // Connection URL
    const url = 'mongodb+srv://admin:admin@cluster0.zoiem.mongodb.net/ds-db?retryWritesc=true';

    // Database Name
    const dbName = 'ds-db';


    return new Promise((resolve, reject) => {
         // Use connect method to connect to the server
        MongoClient.connect(url, function(err, client) {
            console.log('Connected correctly to mongodb server');

            const db = client.db(dbName);

            findDocuments(db, (result) => {
                client.close()
                resolve(result)
            }
            )({ contextId })
        })
    })
   
}

const findDocuments = (db, callback) => ({contextId}) => {
    // Get the documents collection
    const collection = db.collection('contexts');
    // Find some documents
    collection.find({"contextId": contextId}).toArray(function(err, docs) {
      console.log('Found the following records');
      console.log(docs);
      callback(docs);
    })
  }