import Phaser from "phaser";
import Game from "/src/scenes/game.js";
import shop from '/src/scenes/shop.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#8b8c7a',
  parent: 'app',
  scene: [Game, shop],
};

new Phaser.Game(config);
