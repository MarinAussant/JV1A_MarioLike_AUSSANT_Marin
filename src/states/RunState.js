import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class RunState extends State {

    constructor(player, scene) {
        super(player, scene, "run");
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    enter() {
        // code pour entrer dans l'état "idle"
        // Jouer animation idle
        this.player.anims.play("run", true);
        this.runSound = this.scene.sound.add('footstep').setVolume(0.02);
        this.runSound.play({ loop: true });
        
        // Décélaration ?
    }

    exit() {
        this.runSound.stop();
    }

    update() {

        const qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        const dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space);

        if ((qKey.isDown || this.player.inputPad.left) && this.player.isOnFloor) {
            this.player.setVelocityX(this.player.body.velocity.x - this.player.acceleration);
            if (this.player.body.velocity.x < -this.player.speed) {
                this.player.setVelocityX(-this.player.speed);
            }
            if(this.player.canSpeedBoost){
                this.player.canSpeedBoost = false;
                this.player.activeSpeedRoutine();
            }

        }
        else if ((dKey.isDown || this.player.inputPad.right) && this.player.isOnFloor) {
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
                if (this.player.body.velocity.x > -20) {
                    this.player.setState("idle");
                }
            }
            else if (this.player.body.velocity.x > 0) {
                this.player.setVelocityX(this.player.body.velocity.x - this.player.deceleration)
                if (this.player.body.velocity.x < 20) {
                    this.player.setState("idle");
                }
            }
            else {
                this.player.setState("idle");
            }
        }

        if (this.player.isOnFloor) {
            if ((isSpaceJustDown || this.player.inputPad.aOnce) || getTimestamp() - this.player.lastJumpBufferTime < this.player.jumpBufferTime) {
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

        if (!this.player.isOnFloor) {
            this.player.setState("fall");
        }

    }
}