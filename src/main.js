
/* LOAD DES LEVELS
import PlayScene from './scenes/Play.js';
import PreloadScene from './scenes/Preload.js';
import TestScene from './scenes/EnvironnementTest.js';
import DialogueSystem from './scenes/DialogueSystem.js';

import ChooseChar from './scenes/ChooseChar.js';
import UIScene from './scenes/UIScene.js';
import Scene02 from './scenes/Scene_02.js';
import Level01 from './scenes/Level_01.js';
import Level02 from './scenes/Level_02.js';
import Level03 from './scenes/Level_03.js';
import Level04 from './scenes/Level_04.js';
import Level05 from './scenes/Level_05.js';
import Level06 from './scenes/Level_06.js';
import EndScene from './scenes/EndScene.js';
*/

import PreloadScene from './scenes/Preload.js';
import TestLevel from './scenes/TestLevel.js';

import Menu from './scenes/Menu.js';

import Level01 from './scenes/Level01.js';
import Level02 from './scenes/Level02.js';
import Level03 from './scenes/Level03.js';
import Level04 from './scenes/Level04.js';
import Level05 from './scenes/Level05.js';
import Level06 from './scenes/Level06.js';
import Level07 from './scenes/Level07.js';
/*
import Level08 from './scenes/Level08.js';
*/


const WIDTH = 1920;
const HEIGHT = 1080;
const ZOOM_FACTOR = 0.75; 

const SHARED_CONFIG = {
  scale: {
    mode: Phaser.Scale.FIT,
    width: WIDTH,
    height: HEIGHT
  },
  zoomFactor: ZOOM_FACTOR,
  leftTopCorner: {
    x: (WIDTH - (WIDTH / ZOOM_FACTOR)) / 2,
    y: (HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2
  }
}

const Scenes = [PreloadScene, Menu, TestLevel, Level01, Level02, Level03, Level04, Level05, Level06, Level07];
const createScene = Scene => new Scene(SHARED_CONFIG) //A voir
const initScenes = () => Scenes.map(createScene) 

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
        debug: false,
        tileBias: 128
    }
  },
  fps: {
    target: 70,
    forceSetTimeOut: true
  },
  input : {
    gamepad : true
  },
  scene: initScenes()
}

new Phaser.Game(config);