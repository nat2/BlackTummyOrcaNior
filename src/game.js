import Player from "./player.js";
import WaterBackground from "./waterbackground.js";
import Octopi from "./octopi.js";
import Score from "./score.js";
import Controller from "./controller.js";
import GameOverAnimation from "./gameoveranimation.js";

/////////////////////////////////////////////////////////
const FRAMES_PER_SEC = 120.0;

const GAME_SPEED_START = 1.0;
const GAME_SPEED_INCREMENT = 0.005;

const GAME_SIZE = Object.freeze({
  width:  800.0,
  height: 200.0  
});
const PLAYER_SIZE = Object.freeze({
  width:  92.0 / 1.5,  // 61.33
  height: 66.0 / 1.5   // 44.0
});
const PLAYER_MAX_JUMP_HEIGHT = GAME_SIZE.height;
const PLAYER_MIN_JUMP_HEIGHT = GAME_SIZE.height * 0.75;
const PLAYER_JUMP_SPEED = 180.0 / FRAMES_PER_SEC;
const PLAYER_FALL_SPEED = 120.0 / FRAMES_PER_SEC;
const WATER_SIZE = Object.freeze({
  width: 1600.0,
  height: 48.0
});
const WATER_MIN_REPEATED_PICS_TO_BUFFER = 3;
const WATER_AND_OCTOPUS_SPEED = 180.0 / FRAMES_PER_SEC;
const OCTOPUS_SIZE = Object.freeze({
  width:  48.0 / 1.5,  // 32
  height: 90.0 / 1.5   // 60
});
const NEXT_OCTOPUS_INTERVAL_MIN = 1.2 * FRAMES_PER_SEC;
const NEXT_OCTOPUS_INTERVAL_MAX = 4.8 * FRAMES_PER_SEC; 

const HIGH_SCORE_KEY = "high_score";
const SCORE_INC_RATE = 1.0 / FRAMES_PER_SEC;
const SCORE_FONT_SIZE = 19;
const SCORE_POSITION = Object.freeze({
  x: 400.0,
  y: 22.0
});
const WAIT_TO_START_TEXT = Object.freeze({
  textToRender: "Tap screen or press any button to start!",
  fontSize: 39,
  x: 60.0,
  y: 100.0
});

const PLAYER_PIC_SIZE = Object.freeze({
  width:  132.0,
  height: 184.0
});
const PLAYER_PIC_SPEED = -180.0 / FRAMES_PER_SEC;
const OCTOPUS_PIC_SIZE = Object.freeze({
  width:  90.0 * 2.0,
  height: 48.0 * 2.0
});
const OCTOPUS_PIC_SPEED = 180.0 / FRAMES_PER_SEC;
const GAME_OVER_TEXT_FONT_SIZE = 70.0;
const GAME_OVER_ANIMATION_END_TIME = 2.35 * FRAMES_PER_SEC;
/////////////////////////////////////////////////////////


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');

const GameStateEnum = Object.freeze({
  Invalid: 0,
  WaitToStart: 1,
  GameInProgress: 2,
  GameOver: 3,
  Reinitializing: 4,
});

///// Game objects /////
let gameState = GameStateEnum.Invalid;
let gameSpeed = null;

let scaleRatio = null;

let player = null;
let waterBackground = null;
let octopi = null;

let score = null;

let controller = null;

let gameOverAnimation = null;
////////////////////////

function resetScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_SIZE.width * scaleRatio;
  canvas.height = GAME_SIZE.height * scaleRatio;
}

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  // Window ratio is taller than the game ratio,
  // so use width to scale the ratio.
  if (screenWidth / screenHeight < GAME_SIZE.width / GAME_SIZE.height) {
    return screenWidth / GAME_SIZE.width;
  } else {
    // Otherwise use height to scale the ratio.
    return screenHeight / GAME_SIZE.height;
  }
}

function createGameObjects() {
  // Create sprites.
  player = new Player(
      GAME_SIZE,
      PLAYER_SIZE,
      PLAYER_MIN_JUMP_HEIGHT,
      PLAYER_MAX_JUMP_HEIGHT,
      PLAYER_JUMP_SPEED,
      PLAYER_FALL_SPEED
  );
  waterBackground = new WaterBackground(
      GAME_SIZE,
      WATER_SIZE,
      WATER_AND_OCTOPUS_SPEED,
      WATER_MIN_REPEATED_PICS_TO_BUFFER
  );
  octopi = new Octopi(
      GAME_SIZE,
      OCTOPUS_SIZE,
      WATER_AND_OCTOPUS_SPEED,
      NEXT_OCTOPUS_INTERVAL_MIN,
      NEXT_OCTOPUS_INTERVAL_MAX
  );

  score = new Score(
      HIGH_SCORE_KEY,
      SCORE_INC_RATE,
      SCORE_FONT_SIZE,
      SCORE_POSITION
  );

  gameOverAnimation = new GameOverAnimation(
      GAME_SIZE,
      PLAYER_PIC_SIZE,
      OCTOPUS_PIC_SIZE, 
      PLAYER_PIC_SPEED,
      OCTOPUS_PIC_SPEED, 
      GAME_OVER_TEXT_FONT_SIZE,
      GAME_OVER_ANIMATION_END_TIME
  );

  controller = new Controller();
}

function resetGameObjects() {
  player.reset();
  octopi.reset();
  score.reset();
  gameOverAnimation.reset();
}

//function showGameOver() {
//  const fontSize = 70 * scaleRatio;
//  ctx.font = `${fontSize}px Arial`;
//  ctx.fillStyle = "blue";
//  const x = ctx.canvas.width / 4.5;
//  const y = ctx.canvas.height / 2.0;
 // ctx.fillText("Game Over!", x, y);
//}

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawObjects(sprites, texts) {
  clearScreen();

  // console.log("sprites' length: " + sprites.length);
  sprites.forEach((sprite) => {
    ctx.drawImage(
      sprite.image,
      sprite.x * scaleRatio,
      sprite.y * scaleRatio,
      sprite.width * scaleRatio,
      sprite.height * scaleRatio);
  });

  texts.forEach((text) => {
    ctx.fillStyle = "blue";
    const fontSize = text.fontSize * scaleRatio;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(text.textToRender, text.x * scaleRatio, text.y * scaleRatio);
  });
}

function gameLoop() {
  // console.log("gameLoop--gameSpeed: " + gameSpeed);

  switch(gameState) {
    case GameStateEnum.WaitToStart:
      drawObjects([...waterBackground.waterArray,
                   ...octopi.octopusArray, 
                   player],
                  [score,
                   WAIT_TO_START_TEXT]);
      if (controller.isPressed) {
        gameState = GameStateEnum.GameInProgress;
      }
      break;
    case GameStateEnum.GameInProgress:
      // Update game objects.
      waterBackground.update(gameSpeed);
      octopi.update(gameSpeed);
      player.update(gameSpeed, controller.isPressed);
      gameSpeed += GAME_SPEED_INCREMENT;
      score.update();

      // Draw game objects.
      drawObjects([...waterBackground.waterArray,
                   ...octopi.octopusArray, 
                   player],
                  [score]);

      // Check if game over.
      if (octopi.collideWith(player)) {    
        score.mayWriteHighScore();
        gameState = GameStateEnum.GameOver;
      }

      break;
    case GameStateEnum.GameOver:
      gameOverAnimation.update();
      drawObjects([...waterBackground.waterArray,
                   ...octopi.octopusArray, 
                   player,
                   ...gameOverAnimation.picArray],
                  [score, gameOverAnimation.gameOverText]);
      if (gameOverAnimation.isAnimationOver() && controller.isPressed) {
        gameState = GameStateEnum.Reinitializing;
      }
      break;
    case GameStateEnum.Reinitializing:
      gameSpeed = GAME_SPEED_START;
      resetGameObjects();
      if (!controller.isPressed) {
        gameState = GameStateEnum.WaitToStart;
      }
      break;
    default:
      console.log("Error in gameLoop.");
  }
}

// Use setTimeout for Safari mobile browser rotation.
// (Other browsers may not need this, just Safari mobile browser.)
window.addEventListener("resize", () => setTimeout(resetScreen, 500));

if (screen.orientation) {
  screen.orientation.addEventListener("change", resetScreen);
}

resetScreen();
createGameObjects();
gameState = GameStateEnum.WaitToStart;
gameSpeed = GAME_SPEED_START;

setInterval(gameLoop, 1000 / FRAMES_PER_SEC);
