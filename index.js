require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models.js')
const cors = require('cors')
const cookieParser =require('cookie-parser')
const fileUpload = require('express-fileupload')
const router = require('./routes/index.js')
const errorHandler = require('./middleware/ErrorHandlingMiddleware.js')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        const allowedOrigins = ['https://asatag.com', 'https://www.asatag.com'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));
app.use(express.json())
app.use(cookieParser())
app.use('/api', express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=>console.log(`Sever started on port ${PORT}`))
    } catch(e){
        console.log(e)
    }

}

start()