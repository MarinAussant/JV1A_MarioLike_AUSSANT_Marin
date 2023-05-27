import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class IdleState extends State {
  
    constructor(player, scene) {
        super(player, scene, "idle");
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }
  
    enter() {
      // code pour entrer dans l'état "idle"
      // Jouer animation idle
      this.player.anims.play("idle", true);
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

        this.player.setVelocityX(0);

        if((qKey.isDown || dKey.isDown) && this.player.isOnFloor){
            if(this.player.canSpeedBoost){
                this.player.canSpeedBoost = false;
                this.player.activeSpeedRoutine();
            }
            this.player.setState("run");
        }

        if (this.player.isOnFloor){
            if (isSpaceJustDown || getTimestamp() - this.player.lastJumpBufferTime < this.player.jumpBufferTime ){
                if(this.player.canJumpBoost){
                    this.player.canJumpBoost = false;
                    this.player.activeJumpRoutine();
                    this.player.setState("boostJump");
                }
                else{
                    this.player.setState("jump");
                }
            }
        }

        if(!this.player.isOnFloor){
            this.player.setState("fall");
        }
    }
  }