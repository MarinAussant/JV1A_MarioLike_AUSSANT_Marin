import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class WallSlideState extends State {

  constructor(player, scene) {
    super(player, scene, "wallSlide");
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  enter() {
    // code pour entrer dans l'état "saut"
    // Jouer animation idle
    this.player.anims.play("wallSlide", true);
    this.player.body.setGravityY(0);
    //this.player.body.setVelocityY(0);
    // Son jump ?
  }

  exit() {
    // code pour sortir de l'état "saut"
    this.player.body.setGravityY(2000);
  }

  update() {
    // code spécifique à l'état "saut" pour mettre à jour l'état du joueur pendant un saut
    const qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    const dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if (this.player.body.blocked.right) {
      this.player.lastWallDirection = "right";
    }

    if (this.player.body.blocked.left) {
      this.player.lastWallDirection = "left";
    }

    // SI LE JOUEUR SAUT EN ETAT SUR LE MUR ALORS WALLJUMP
    if (isSpaceJustDown || getTimestamp() - this.player.lastJumpBufferTime < this.player.jumpBufferTime) {
      if(this.player.canJumpBoost){
        this.player.canJumpBoost = false;
        this.player.activeJumpRoutine();
        this.player.setState("wallBoostJump");
    }
    else{
        this.player.setState("wallJump");
    }
    }

    if (this.player.body.velocity.y >= 0) {
      this.player.setVelocityY(this.player.body.velocity.y + this.player.wallSlideAcceleration);
      if (this.player.body.velocity.y >= this.player.wallSlideSpeed) {
        this.player.setVelocityY(this.player.wallSlideSpeed);
      }
    }

    if (qKey.isDown && !this.player.isOnFloor) {
      this.player.setVelocityX(this.player.body.velocity.x - this.player.acceleration);
      if (this.player.body.velocity.x < -this.player.speed) {
        this.player.setVelocityX(-this.player.speed);
      }

    }
    else if (dKey.isDown && !this.player.isOnFloor) {
      this.player.setVelocityX(this.player.body.velocity.x + this.player.acceleration);
      if (this.player.body.velocity.x > this.player.speed) {
        this.player.setVelocityX(this.player.speed);
      }
    }

    if (this.player.isOnFloor) {
      if (this.player.body.velocity.x != 0) {
        this.player.setState("run");
      }
      else {
        this.player.setState("idle");
      }
    }

    if (!this.player.body.blocked.right && !this.player.body.blocked.left && !(getTimestamp() - this.player.lastJumpBufferTime < this.player.jumpBufferTime)) {
      this.player.setState("fall");
    }

  }
}