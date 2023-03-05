import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connect from './database/conn.js'
import router from './router/route.js'

const app = express()

/**  middleware **/
app.use(express.json())
app.use(cors());
app.use(morgan('tiny'))
app.disable('x-powered-by'); // less hacker know about our stack

const port = 8000;

/** http Get request **/
app.get('/', (req, res) =>{
    res.status(201).json("Get Req");
})

/** Api Routes **/
app.use('/api', router);


/** start server only when we have valid connection **/
connect().then(()=>{
    try {
        app.listen(port, () =>{
            console.log(`Server connected port ${port}`)
        })        
    } catch (error) {
        console.log(`Cannot connect to the server ${error}`)
    }
}).catch(error => {
    console.log('Invalid database connection...!')  
})

