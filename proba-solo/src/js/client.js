import { io } from 'socket.io-client';


export default class Client {
    constructor(gameInstance) {
        this.socket = io('http://localhost:3000');

        this.game = gameInstance;

        this.game.onPlayerMove((playerCoordinates) => {
            this.socket.emit('clientData', { type: 'playerMove', coordinates: playerCoordinates });
        });

        this.socket.on('serverData', (result) => {
            console.log('Получен результат от сервера:', result);
            // Здесь вы можете использовать результат по своему усмотрению
        });
    }
}

