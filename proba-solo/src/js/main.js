import Game from "../js/game.js";
import Client from '../js/client.js';


const game = new Game();
const client = new Client(game);
// window - глобальный объект. И поскольку мы используем модули - константа game не попадает в глобальное пространство имен
// в связи с этим мы добавляем объект game в глобальный объект window в ручную
window.game = game;
window.client = client;


window.addEventListener("DOMContentLoaded", () => {
    game.draw();
  });

console.log(game)