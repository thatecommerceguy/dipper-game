import { Game } from "./game/Game.js";
import "./styles/game.css";

const app = document.querySelector("#app");
const game = new Game(app);

game.start();
