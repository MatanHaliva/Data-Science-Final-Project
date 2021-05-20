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

function saveProcesses(contextId, userId, status) {
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

            insertProcessesDocuments(db, (result) => {
                client.close()
                resolve(result)
            })({contextId, userId, status})
        })
    })  
}

const insertProcessesDocuments = (db, callback) => ({contextId, userId, status}) => {
    // Get the documents collection
    const collection = db.collection('processes');
    logger.log({
        level: 'info',
        message: 'inserting into processes'
    })
    // Insert some documents
    collection.insertMany([{contextId, userId, status}], function(err, result) {
        logger.log({
            level: 'info',
            message: 'Inserted 1 documents into the collection processes'
        })
        callback(result);
    })
  }




const getProcessesByUserId = async (contextId, userId) => {
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
    const collection = db.collection('processes')
    // Find some documents
    var query = contextId && contextId.length > 0 ? { contextId: contextId, userId: userId } : userId ? { userId: userId } : { }

    collection.find(query).toArray(function(err, docs) {
      console.log('Found the following records')
      console.log(docs)
      callback(docs)
    })
}



const saveProcessesList = async (processes) => {
        const MongoClient = require('mongodb').MongoClient;

        // Connection URL
        const url = 'mongodb+srv://admin:admin@cluster0.zoiem.mongodb.net/ds-db?retryWritesc=true';

        // Database Name
        const dbName = 'ds-db';

        const client = new MongoClient(url);

        await client.connect()

        // Use connect method to connect to the server
        console.log('Connected correctly to mongodb server');

        const db = client.db(dbName);

        const results = await insertProcessesDocumentsList(db)(processes)
        client.close()

        return results
}

const insertProcessesDocumentsList = (db) => async (processes) => {
    // Get the documents collection
    const collection = db.collection('processes');
    logger.log({
        level: 'info',
        message: 'inserting into processes'
    })
    // Insert some documents
    const toUpdate = { "$set": {} }

    const bulk = processes.map(process => {
        return { replaceOne:
            {
               "filter" : { "_id":  { "$eq": process._id }},
               "replacement" : process,
            }
        }
    })
    
    const result = await collection.bulkWrite(bulk)

    logger.log({
        level: 'info',
        message: 'Inserted 1 documents into the collection processes'
    })

    return result
}


  module.exports = {
    saveProcesses,
    getProcessesByUserId,
    saveProcessesList
  }