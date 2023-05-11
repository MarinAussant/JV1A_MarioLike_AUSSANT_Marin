import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class FallState extends State {
  
    constructor(player, scene) {
        super(player, scene, "fall");
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }
  
    enter() {
      // code pour entrer dans l'état "idle"
      // Jouer animation idle
      // Son idle ?
      // Décélaration ?
      this.startFallTime = getTimestamp();
    }
  
    exit() {
      // code pour sortir de l'état "idle"
    }
  
    update() {

        const qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        const dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space); 

        // COYOTTE JUMP SI ETAIT AU SOL AVANT
        if(getTimestamp() - this.startFallTime < this.player.coyoteTime && isSpaceJustDown && this.player.lastState == "run"){
          this.player.setState("jump");
        }

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
            if(this.player.body.velocity.x > 0){
              this.player.setVelocityX(0);
            }
          }
          else if (this.player.body.velocity.x > 0){
              this.player.setVelocityX(this.player.body.velocity.x - this.player.deceleration)
              if(this.player.body.velocity.x < 0){
                this.player.setVelocityX(0);
              }
          }
        }    

        if (this.player.isOnFloor){
          if (this.player.body.velocity.x != 0){
            this.player.setState("run");
          }
          else {
            this.player.setState("idle");
          }
        }

    }

  }