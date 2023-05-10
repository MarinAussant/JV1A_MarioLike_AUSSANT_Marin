import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class JumpState extends State {

  constructor(player, scene) {
    super(player,scene);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  enter() {
    // code pour entrer dans l'état "saut"
    // Jouer animation idle
    // Son jump ?
    this.timeAtStartJump = getTimestamp();
    this.player.setVelocityY(-this.player.jumpSpeed);

  }

  exit() {
    // code pour sortir de l'état "saut"
  }

  update() {
    // code spécifique à l'état "saut" pour mettre à jour l'état du joueur pendant un saut
    const isSpaceDown= this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    if (!isSpaceDown.isDown && (getTimestamp() - this.timeAtStartJump > this.player.jumpCutOff)){
      this.player.setVelocityY(0);
    }

    if (this.player.body.velocity.y >= 0){
      this.player.setState("fall");
    }

  }
}