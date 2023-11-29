const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export default class Game {
    isPlaying = true;
    //можем указать начальное значение свойства (поскольку оно нам известно) не в конструкторе.
    score = 0;
    lines = 0;
    level = 0;
    // игровое поле 20 на 20
    playfield = [
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0]
    ];
    static colors = {
        '1': 'cyan',
        '2': 'blue',
        '3': 'orange',
        '4': 'yellow',
        '5': 'green',
        '6': 'purple',
        '7': 'red',
    };
    player = {
        x: 0,
        y: 0,
        blocks: [
            [9]
        ],
    };
    // методы для передвижения персонажа
        // Событие, которое вызывается при перемещении игрока
    onPlayerMove(callback) {
        this.playerMoveCallback = callback;
    }
    moveLeft() {
        this.player.x -= 1;
        this.draw();

        if (this.hasCollision()) {
            this.player.x += 1;
            this.draw();
        }
        this.emitPlayerMove();
    }
    moveRight() {
        this.player.x += 1;
        this.draw();

        if (this.hasCollision()) {
            this.player.x -= 1;
            this.draw();
        }
        this.emitPlayerMove();
    }
    moveDown() {
        this.player.y += 1;
        this.draw();
        if (this.hasCollision()) {
            this.player.y -= 1;
            this.draw();
        }
        this.emitPlayerMove();
    }
    moveUp() {
        this.player.y -= 1;
        this.draw();
        if (this.hasCollision()) {
            this.player.y += 1;
            this.draw();
        }
        this.emitPlayerMove();
    }
    emitPlayerMove() {
        if (this.playerMoveCallback) {
            this.playerMoveCallback({ x: this.player.x, y: this.player.y });
        }
    }
    // Метод для проверки, находится ли фигура на поле и задевает ли она другие фигуры.
    // Идея в том, что если мы попытаемся проверить несуществующий индекс нам придет undefined поскольку он неопределен
    // Если хотя бы одна из проверок вернет true - функция вернет true.
    hasCollision() {
        const { y: pieceY, x: pieceX, blocks } = this.player;
        // цикл перебирает ряды
        for (let y = 0; y < blocks.length; y++) {
            // цикл перебирает элементы каждого ряда
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x] && 
                    ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) ||
                    this.playfield[pieceY + y][pieceX + x])
                    ) {
                    return true;
                }
            }
        }
        return false;
    }
    draw() {
        // Очистите холст
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Отрисуйте игровое поле
        for (let y = 0; y < this.playfield.length; y++) {
            for (let x = 0; x < this.playfield[y].length; x++) {
                if (this.playfield[y][x]) {
                    // Отрисовка заполненной ячейки (например, квадрата)
                    ctx.fillStyle = "#00F"; // Цвет
                    ctx.fillRect(x * 20, y * 20, 20, 20); // Размер и позиция
                }
            }
        }

        // Отрисуйте Игрока
        const { x: playerX, y: playerY, blocks } = this.player;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    // Отрисовка Игрока (например, квадрата)
                    ctx.fillStyle = "#F00"; // Цвет
                    ctx.fillRect((playerX + x) * 20, (playerY + y) * 20, 20, 20); // Размер и позиция
                }
            }
        }
    }

    // Перемещение персонажа
    handleKeyDown(event) {  
        switch(event.key) {
            case 'ArrowLeft': // стрелка влево
                if (this.isPlaying) { 
                    this.moveLeft();
                }
                break;
            case 'ArrowUp': // стрелка вверх
                if (this.isPlaying) { 
                    this.moveUp(); 
                }
                break;
            case 'ArrowRight': // стрелка вправо
                if (this.isPlaying) { 
                    this.moveRight();
                }
                break;
            case 'ArrowDown': // стрелка вниз
                if (this.isPlaying) { 
                    this.moveDown();
                }
                break;
        }
    }
}
class Client {
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
const game = new Game();
const client = new Client(game);
window.game = game;
window.client = client;
// Добавить обработчик событий для слушания событий клавиш
window.addEventListener("keydown", (event) => {
    game.handleKeyDown(event);
});

// Установить фокус на элементе холста
canvas.focus();