import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class WallJumpState extends State {

    constructor(player, scene) {
        super(player, scene, "wallJump");
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    enter() {
        // code pour entrer dans l'état "saut"
        // Jouer animation idle
        this.player.anims.play("jump", false);
        this.jumpSound = this.scene.sound.add('jump').setVolume(0.02);
        this.jumpSound.play({ loop: false });
        this.timeAtStartWallJump = getTimestamp();
        this.player.setVelocityY(-this.player.jumpSpeed);

        if (this.player.lastWallDirection == "right") {
            this.player.setVelocityX(-this.player.speed*1.1);
        }
        if (this.player.lastWallDirection == "left") {
            this.player.setVelocityX(this.player.speed*1.1);
        }

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

        if (getTimestamp() - this.timeAtStartWallJump >= this.player.wallJumpCutDirection){
            if ((qKey.isDown || this.player.inputPad.left) && !this.player.isOnFloor) {
                this.player.setVelocityX(this.player.body.velocity.x - this.player.acceleration);
                if (this.player.body.velocity.x < -this.player.speed) {
                    this.player.setVelocityX(-this.player.speed);
                }

            }
            else if ((dKey.isDown || this.player.inputPad.right) && !this.player.isOnFloor) {
                this.player.setVelocityX(this.player.body.velocity.x + this.player.acceleration);
                if (this.player.body.velocity.x > this.player.speed) {
                    this.player.setVelocityX(this.player.speed);
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

        }

        if ((dKey.isDown || this.player.inputPad.right) && this.player.lastWallDirection == "left"){
            if(this.player.canSpeedBoost){
                this.player.canSpeedBoost = false;
                this.player.activeSpeedRoutine();
            }
        }
        else if ((qKey.isDown || this.player.inputPad.left) && this.player.lastWallDirection == "right"){
            if(this.player.canSpeedBoost){
                this.player.canSpeedBoost = false;
                this.player.activeSpeedRoutine();
            }
        }
        
        if ((!isSpaceDown.isDown && !this.player.inputPad.a) && (getTimestamp() - this.timeAtStartWallJump > this.player.jumpCutOff)) {
            this.player.setVelocityY(this.player.body.velocity.y + this.player.deceleration*4);
        }

        if (this.player.body.velocity.y > 0) {
            this.player.setState("fall");
        }
        
    }
}