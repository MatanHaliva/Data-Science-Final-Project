const express = require('express')
const fileUpload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { sleep } = require('./helper')
const bodyParser = require('body-parser');
const { getUser, loginRoute, registerRoute } = require('./user.routes');
const { saveProcesses, getProcessesByUserId, saveProcessesList } = require('./process.module');
const axios = require('axios')

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

        let userId

        try {
            const decodeData = await decodeJwt.decodeJwt(req.header("Authorization"))
            const users = await getUser({ email: decodeData.email })
            userId = users[0]._id
    
        } catch (err) {
            res.status(400).json({msg: "failed not authorization"})
        }
    

        await saveContextAndFile(contextId, path, userId)

        res.json({ fileName: file.name, filePath: path , contextId})
    })
})

app.get('/upload', async (req, res) => {
    const contextIds = req.query.contextIds
    res.setHeader('Access-Control-Allow-Origin', '*')

    let uploads = []
    // if (contextIds && contextIds.length > 0) {
    //     uploads = await Promise.all(contextIds.map(contextId => getFileByContextId(contextId)))
    // } else {
    //     uploads = await getFileByContextId(contextIds)
    // }

    let userId
        
    try {
        const decodeData = await decodeJwt.decodeJwt(req.header("Authorization"))
        const users = await getUser({ email: decodeData.email })
        userId = users[0]._id

    } catch (err) {
        res.status(400).json({msg: "failed not authorization"})
    }

    uploads = await getFileByContextId(contextIds, userId)

    res.json({msg: "ok", uploads: uploads.flat()})
})


app.post('/process', async (req, res) => {
    console.log("processing with contextId: ", req.body.contextId)
    console.log("auth", req.header("Authorization"))

    let userId

    try {
        const decodeData = await decodeJwt.decodeJwt(req.header("Authorization"))
        const users = await getUser({ email: decodeData.email })
        userId = users[0]._id

    } catch (err) {
        res.status(400).json({msg: "failed not authorization"})
    }

    res.setHeader('Access-Control-Allow-Origin', '*')

    const process = await saveProcesses(req.body.contextId, userId, 0)
    logger.log({level: "info", process})

    const filePath = await getFileByContextId(req.body.contextId, userId)


    const carDetectionServiceUrl = 'http://localhost:5000/startProcess'
    const faceDetectionServiceUrl = 'http://localhost:5001/startProces'

    const processDto = {
        contextId: req.body.contextId,
        filePath: `http://localhost:33345${filePath[0].filePath}`
    }

    try {
        const response = await Promise.all([
            axios.post(carDetectionServiceUrl, processDto, {headers: {'Content-Type': 'application/json'}}),
            // axios.post(faceDetectionServiceUrl, processDto)
        ])
    } catch(err) {
        console.log(err)
        res.status(400).json({status: "failed start processing", err: err})
    }

    console.log("hereeeeeeeasdasdasda")
    

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
server.listen(33345, () => console.log('server started'))


function saveContextAndFile(contextId, filePath, userId) {
    const MongoClient = require('mongodb').MongoClient;

    // Connection URL
    const url = 'mongodb+srv://admin:admin@cluster0.zoiem.mongodb.net/ds-db?retryWritesc=true';

    // Database Name
    const dbName = 'ds-db';

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        console.log('Connected correctly to mongodb server');

        const db = client.db(dbName);

        insertContextsDocuments(db, (result) => client.close())({contextId, filePath, userId})
    })
}

const insertContextsDocuments = (db, callback) => ({contextId, filePath, userId}) => {
    // Get the documents collection
    const collection = db.collection('contexts');
    logger.log({
        level: 'info',
        message: 'inserting into contexts'
    })
    // Insert some documents
    collection.insertMany([{contextId, filePath, userId}], function(err, result) {
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
    console.log("queryyyyy", query)
    collection.find(query).toArray(function(err, docs) {
      console.log('Found the following records')
      console.log(docs)
      callback(docs)
    })
}


app.post("/login", loginRoute)
app.post("/register", registerRoute)



const calculateAvgFromStatuses = (statuses) => {
    const valuedStatuses = statuses.filter(status => status.status === 'fulfilled').map(status => status.value)
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    return valuedStatuses.reducer(reducer) / statuses.length
}

app.get('/process', async (req, res) => {
    console.log("processing with contextId: ", req.body.contextId)
    console.log("auth", req.header("Authorization"))
    const decodeData = await decodeJwt.decodeJwt(req.header("Authorization"))

    console.log(decodeData)
    const users = await getUser({ email: decodeData.email })
    const userId = users[0]._id

    res.setHeader('Access-Control-Allow-Origin', '*')

    const processes = await getProcessesByUserId(req.body.contextId, userId)
    
    const carDetectionServiceUrl = 'http://localhost:5000/checkStatus'
    const faceDetectionServiceUrl = 'http://localhost:5001/checkStatus'
    
    const statuses = await Promise.allSettled([
        axios.get(`${carDetectionServiceUrl}/${contextId}`),
        // axios.get(`${faceDetectionServiceUrl}/${contextId}`)
    ])

    res.json({ msg: "ok", processes: {...processes, status: calculateAvgFromStatuses(statuses) } , content: "start processing the video" })
})


// setInterval(async () => {
//     const proccessStatusLessThan100 = await getProcessesByUserId()  
//     const processes = proccessStatusLessThan100.filter(process => process.status < 100)
//     if(processes.length > 0) {
//         const randomNumberFromProcesses = Math.floor(Math.random() * (processes.length))
//         processes[randomNumberFromProcesses] = {
//             ...processes[randomNumberFromProcesses],
//              status: processes[randomNumberFromProcesses].status + 1
//         }
//         await saveProcessesList(processes)
//     } else {
//         saveProcessesList(proccessStatusLessThan100.map(process => ({...process, status: 0})))
//     }

// }, 500)
