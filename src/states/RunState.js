import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class RunState extends State {
  
    constructor(player, scene) {
        super(player, scene);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }
  
    enter() {
      // code pour entrer dans l'état "idle"
      // Jouer animation idle
      // Son idle ?
      // Décélaration ?
    }
  
    exit() {
      // code pour sortir de l'état "idle"
    }
  
    update() {

        const qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        const dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space); 

        if(qKey.isDown && this.player.isOnFloor){
            this.player.setVelocityX(this.player.body.velocity.x - this.player.acceleration);
            if (this.player.body.velocity.x < -this.player.speed){
                this.player.setVelocityX(-this.player.speed);
            }
            
        }
        else if(dKey.isDown && this.player.isOnFloor){
            this.player.setVelocityX(this.player.body.velocity.x + this.player.acceleration);
            if (this.player.body.velocity.x > this.player.speed){
                this.player.setVelocityX(this.player.speed);
            }
        }
        else {
            this.player.setState("idle");
        }

        if (isSpaceJustDown && (this.player.isOnFloor)){
            this.player.setState("jump");
        }

        if(!this.player.isOnFloor){
            this.player.setState("fall");
        }

    }
  }