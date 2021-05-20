const express = require('express')
const fileUpload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { sleep } = require('./helper')
const bodyParser = require('body-parser');
const { getUser, loginRoute, registerRoute } = require('./user.routes');
const { saveProcesses, getProcessesByUserId, saveProcessesList } = require('./process.module');

const decodeJwt = require("./jwt")

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

app.get('/upload', async (req, res) => {
    const contextIds = req.query.contextIds
    res.setHeader('Access-Control-Allow-Origin', '*')

    const uploads = await Promise.all(contextIds.map(contextId => getFileByContextId(contextId)))

    res.json({msg: "ok", uploads: uploads.flat()})
})


app.post('/process', async (req, res) => {
    console.log("processing with contextId: ", req.body.contextId)
    console.log("auth", req.header("Authorization"))
    const decodeData = await decodeJwt.decodeJwt(req.header("Authorization"))

    console.log(decodeData)
    const users = await getUser({ email: decodeData.email })
    const userId = users[0]._id

    res.setHeader('Access-Control-Allow-Origin', '*')

    const process = await saveProcesses(req.body.contextId, userId, 0)
    logger.log({level: "info", process})


    res.json({ msg: "ok", process, content: "start processing the video" })
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
    res.header("Access-Control-Allow-Headers", "*");
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

const getFileByContextId = async (contextId, userId) => {
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
            )({ contextId, userId })
        })
    })
   
}

const findDocuments = (db, callback) => ({contextId, userId}) => {
    // Get the documents collection
    const collection = db.collection('contexts')
    // Find some documents
    console.log(contextId)
    var query = contextId && contextId.length > 0 ? { contextId: contextId, userId: userId } : { userId: userId }

    collection.find(query).toArray(function(err, docs) {
      console.log('Found the following records')
      console.log(docs)
      callback(docs)
    })
}


app.post("/login", loginRoute)
app.post("/register", registerRoute)





app.get('/process', async (req, res) => {
    console.log("processing with contextId: ", req.body.contextId)
    console.log("auth", req.header("Authorization"))
    const decodeData = await decodeJwt.decodeJwt(req.header("Authorization"))

    console.log(decodeData)
    const users = await getUser({ email: decodeData.email })
    const userId = users[0]._id

    res.setHeader('Access-Control-Allow-Origin', '*')

    const processes = await getProcessesByUserId(req.body.contextId, userId)

    res.json({ msg: "ok", processes, content: "start processing the video" })
})


setInterval(async () => {
    const proccessStatusLessThan100 = await getProcessesByUserId()  
    const processes = proccessStatusLessThan100.filter(process => process.status < 100)
    if(processes.length > 0) {
        const randomNumberFromProcesses = Math.floor(Math.random() * (processes.length - 1))
        processes[randomNumberFromProcesses] = {
            ...processes[randomNumberFromProcesses],
             status: processes[randomNumberFromProcesses].status + 1
        }
        await saveProcessesList(processes)
    } else {
        saveProcessesList(proccessStatusLessThan100.map(process => ({...process, status: 0})))
    }

}, 500)