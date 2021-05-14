const express = require('express')
const fileUpload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { sleep } = require('./helper')
const bodyParser = require('body-parser')


const sockets = {}

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

app.use('/files', express.static('files'))

app.use(fileUpload())

app.use(bodyParser.json())

//Upload Endpoint

app.post('/upload', async (req, res) => {
    console.log("uploading file...")

    res.setHeader('Access-Control-Allow-Origin', '*')

    if (req.files === null) {
        return res.status(400).json({ msg: "No File was uploaded" })
    }

    //await sleep(5000)

    const file = req.files.file

    file.mv(`${__dirname}/files/${file.name}`, async err => {
        if(err) {
            console.error("error: " + err)
            return res.status(500).send(err)
        }
       
        const path = `/files/${file.name}`
        const contextId = uuidv4()
        console.log('uploaded successfuly to', path)

        await saveContextAndFile(contextId, path)

        res.json({ fileName: file.name, filePath: path , contextId})
    })
})


app.post('/process', async (req, res) => {
    console.log("processing with contextId: ", req.body.contextId)

    res.setHeader('Access-Control-Allow-Origin', '*')

    const context = await getFileByContextId(req.body.contextId)
    logger.log({level: "info", context})



    res.json({ msg: "ok", context: context[0], content: "start processing the video" })
})


app.post('/finishProcess', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const context = await getFileByContextId(req.body.contextId)
    const socket = sockets[context[0].contextId]

    socket.send({context, status: "finished", processType: req.body.processName})

    res.json({ msg: "ok", context: context[0], content: "notify to user" })
})

// added cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

const server = require('http').createServer(app)
const io = require('socket.io')(server, { origins: ["http://localhost:8000"], handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "my-custom-header",
      "Access-Control-Allow-Credentials": true
    });
    res.end();
  }})


io.on('connection', (socket) => {
     console.log("socket started") 
     socket.on("message", data => {
        console.log(data);
        if (data.contextId) {
            console.log("put contextId: " + data.contextId)
            sockets[data.contextId] = socket
        }
      });
})
server.listen(5000, () => console.log('server started'))


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
    const collection = db.collection('contexts')
    // Find some documents
    console.log(contextId)
    var query = { contextId: contextId }


    collection.find(query).toArray(function(err, docs) {
      console.log('Found the following records')
      console.log(docs)
      callback(docs)
    })
}