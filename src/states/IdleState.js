import State from "./State.js";

export default class IdleState extends State {
  
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

        this.player.setVelocityX(0);

        if((qKey.isDown || dKey.isDown) && this.player.isOnFloor){
            this.player.setState("run");
        }
        if (isSpaceJustDown && (this.player.isOnFloor)){
            this.player.setState("jump");
        }
        if(!this.player.isOnFloor){
            this.player.setState("fall");
        }
    }
  }