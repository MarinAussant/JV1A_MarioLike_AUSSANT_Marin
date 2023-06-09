import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class BoostJumpState extends State {

  constructor(player, scene) {
    super(player, scene, "boostJump");
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  enter() {
    // code pour entrer dans l'état "saut"
    // Jouer animation idle
    this.player.anims.play("boostJump", false);
    this.jumpSound = this.scene.sound.add('jump').setVolume(0.02);
    this.jumpSound.play({ loop: false });
    this.timeAtStartJump = getTimestamp();
    this.player.setVelocityY(-this.player.boostJumpSpeed);
    this.player.jumpSpeed = this.player.constantJumpSpeed;

  }

  exit() {
    // code pour sortir de l'état "saut"
  }

  update() {
    // code spécifique à l'état "saut" pour mettre à jour l'état du joueur pendant un saut
    const qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    const dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const isSpaceDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    // INCREASE PLAYER JUMP BUFFER 
    if (isSpaceJustDown || this.player.inputPad.aOnce) {
      this.player.lastJumpBufferTime = getTimestamp();
    }

    if ((qKey.isDown || this.player.inputPad.left) && !this.player.isOnFloor) {
      this.player.setVelocityX(this.player.body.velocity.x - this.player.acceleration);
      if (this.player.body.velocity.x < -this.player.speed) {
        this.player.setVelocityX(-this.player.speed);
      }
      if(this.player.canSpeedBoost){
        this.player.canSpeedBoost = false;
        this.player.activeSpeedRoutine();
      }

    }
    else if ((dKey.isDown || this.player.inputPad.right )&& !this.player.isOnFloor) {
      this.player.setVelocityX(this.player.body.velocity.x + this.player.acceleration);
      if (this.player.body.velocity.x > this.player.speed) {
        this.player.setVelocityX(this.player.speed);
      }
      if(this.player.canSpeedBoost){
        this.player.canSpeedBoost = false;
        this.player.activeSpeedRoutine();
      }
    }
    else {
      if (this.player.body.velocity.x < 0) {
        this.player.setVelocityX(this.player.body.velocity.x + this.player.deceleration)
        
      }
      else if (this.player.body.velocity.x > 0) {
        this.player.setVelocityX(this.player.body.velocity.x - this.player.deceleration)
        
      }
    }

    if ((!isSpaceDown.isDown && !this.player.inputPad.a) && (getTimestamp() - this.timeAtStartJump > this.player.boostJumpCutOff)) {
      this.player.setVelocityY(this.player.body.velocity.y + this.player.deceleration*4);
    }
    
    if (this.player.body.blocked.right || this.player.body.blocked.left) {
      if (isSpaceJustDown || this.player.inputPad.aOnce) {
        this.player.setState("wallJump");
      }
    }

    if (this.player.body.velocity.y >= 0) {
      this.player.setState("fall");
    }

  }
}