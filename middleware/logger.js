import { format } from 'date-fns'
import { uuid } from 'uuidv4';
import fs from 'fs'
import {fileURLToPath} from 'url';
import path from 'path'

const fsPromises = fs.promises;
 

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const logEvent = async(message, logFileName) =>{
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

export const logger = (req, res, next) =>{
    logEvent(`${req.method}\t ${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}` )
    next()
}

