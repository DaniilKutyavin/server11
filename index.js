require('dotenv').config();  // Загружаем переменные окружения из .env файла

const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const sequelize = require('./db');
const models = require('./models/models.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const router = require('./routes/index.js');
const errorHandler = require('./middleware/ErrorHandlingMiddleware.js');
const path = require('path');

const PORT = process.env.PORT || 5000; // Используем переменную окружения или 5000 по умолчанию

// Настройки для HTTPS (с использованием Let's Encrypt)
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/asatag.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/asatag.com/fullchain.pem')
};

// Настройка CORS
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        const allowedOrigins = ['https://asatag.com:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

// Используем различные middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);
app.use(errorHandler);

// Стартуем сервер с подключением к базе данных
const start = async () => {
    try {
        // Подключение к базе данных
        await sequelize.authenticate();
        await sequelize.sync();

        // Запуск HTTPS сервера
        https.createServer(options, app).listen(PORT, () => {
            console.log(`Server is running on https://asatag.com:${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
