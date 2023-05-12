import State from "./State.js";
import { getTimestamp } from "../extra/time.js";

export default class WallGrabState extends State {

  constructor(player, scene) {
    super(player, scene, "wallGrab");
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  enter() {
    // code pour entrer dans l'état "saut"
    // Jouer animation idle
    // Son jump ?
  }

  exit() {
    // code pour sortir de l'état "saut"
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
      this.player.setState("wallJump");
    }

    if (this.player.body.velocity.y > 0) {
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