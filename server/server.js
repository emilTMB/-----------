const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://127.0.0.1:5501', 'http://127.0.0.1:5500'];

const io = socketIO(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const clients = [];

// Обработчик события от клиента
io.on('connection', (socket) => {
    clients.push(socket);
    console.log('Новый клиент подключен');

    socket.on('clientData', (data) => {
        console.log('Получены данные от клиента:', data);
        const processedData = data;

        // Трансляция обработанных данных всем подключенным клиентам
        socket.broadcast.emit('serverData', processedData);
    });

    socket.on('disconnect', () => {
        const index = clients.indexOf(socket);
        if (index !== -1) {
            clients.splice(index, 1);
        }

        console.log('Клиент отключен');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
