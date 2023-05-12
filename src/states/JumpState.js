import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class JumpState extends State {

  constructor(player, scene) {
    super(player,scene, "jump");
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
    const qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    const dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const isSpaceDown= this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space); 

    // INCREASE PLAYER JUMP BUFFER 
    if(isSpaceJustDown){
      this.player.lastJumpBufferTime = getTimestamp();
    }

    if(qKey.isDown && !this.player.isOnFloor){
      this.player.setVelocityX(this.player.body.velocity.x - this.player.acceleration);
      if (this.player.body.velocity.x < -this.player.speed){
          this.player.setVelocityX(-this.player.speed);
      }
      
    }
    else if(dKey.isDown && !this.player.isOnFloor){
        this.player.setVelocityX(this.player.body.velocity.x + this.player.acceleration);
        if (this.player.body.velocity.x > this.player.speed){
          this.player.setVelocityX(this.player.speed);
        }
    }
    else {
      if (this.player.body.velocity.x < 0){
        this.player.setVelocityX(this.player.body.velocity.x + this.player.deceleration)
        if(this.player.body.velocity.x > 10){
            this.player.setState("idle");
        }
      }
      else if (this.player.body.velocity.x > 0){
          this.player.setVelocityX(this.player.body.velocity.x - this.player.deceleration)
          if(this.player.body.velocity.x < 10){
              this.player.setState("idle");
          }
      }
    }

    if (!isSpaceDown.isDown && (getTimestamp() - this.timeAtStartJump > this.player.jumpCutOff)){
      this.player.setVelocityY(0);
    }

    if (this.player.body.blocked.right || this.player.body.blocked.left){
      this.player.setState("wallSlide");
    }

    if (this.player.body.velocity.y >= 0){
      this.player.setState("fall");
    }

  }
}