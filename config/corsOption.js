import {allowOrigins} from "./allowOrigins.js"

  export const corsOption = {
    origin:(origin, callback) =>{
        if(allowOrigins.indexOf(origin) !== -1  || origin ){
            callback(null, true)
        }else{
            callback(new Error("Nott Allowed By Cors"))
        }
    },
    credentials: true,
    optionSucessStatus: 200
}

export default corsOption