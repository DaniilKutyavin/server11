const fs = require('fs');
const https = require('https');
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const router = require('./routes/index.js');
const errorHandler = require('./middleware/ErrorHandlingMiddleware.js');
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();

// Чтение SSL-сертификатов
const privateKey = fs.readFileSync('/etc/letsencrypt/live/asatag.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/asatag.com/fullchain.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/asatag.com/chain.pem', 'utf8'); // Иногда может понадобиться chain.pem

const credentials = { key: privateKey, cert: certificate, ca: ca };

// Настройка CORS
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

// Подключаем middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));

// API и обработка ошибок
app.use('/api', router);
app.use(errorHandler);

// Запуск сервера
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
        // Запуск HTTPS сервера
        https.createServer(credentials, app).listen(PORT, () => {
            console.log(`Server started on https://localhost:${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
