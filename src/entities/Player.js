import collidable from "../extra/makeCollidable.js";

import JumpState from "../states/JumpState.js";
import IdleState from "../states/IdleState.js";
import RunState from "../states/RunState.js";
import FallState from "../states/FallState.js";
import WallSlideState from "../states/WallSlideState.js";
import WallJumpState from "../states/WallJumpState.js";
import BoostJumpState from "../states/BoostJumpState.js";

import JumpSkyglow from "./JumpSkyglow.js";
import SpeedSkyglow from "./SpeedSkyglow.js";



// Class Player
class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, skyglow) {
        super(scene, x, y, "tempSprite").setScale(0.25);
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        //Mixins collisions
        Object.assign(this, collidable);

        //Propriétés à passer de scène en scène
        this.listeSkyglow = skyglow;

        this.init();
        this.initEvents();
        this.initStates();

    }

    init() {
        //Variables personnage

        this.isOnFloor;
        this.isOnSpeed;
        this.isOnDisplace = false;

        this.gravity = 2000;
        this.speed = 400;
        this.constantSpeed = 400;
        this.boostSpeed = 850;
        this.wallSlideSpeed = 300;

        this.acceleration = 50;
        this.deceleration = 40;
        this.wallSlideAcceleration = 5;

        this.jumpSpeed = 800;
        this.boostJumpSpeed = 1200;
        this.jumpCutOff = 120;
        this.boostJumpCutOff = 350;

        this.lastWallDirection;
        this.wallJumpCutDirection = 300;

        this.coyoteTime = 100;

        this.jumpBufferTime = 100;
        this.lastJumpBufferTime = 101;

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.cantMove = false;
        this.withJumpSkyglow = false;
        this.withSpeedSkyglow = false;
        this.withGlideSkyglow = false;

        this.lastSaveX = 0;
        this.lastSaveY = 0;

        this.displayState = this.scene.add.text(0, 0, "", { fontSize: 80, color: '#FF0000' }).setScrollFactor(0);

        this.skyglow;

        this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.zKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.sKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        //Physique avec le monde
        this.body.setGravityY(this.gravity);
        this.body.maxVelocity.y = 1500;
        this.setDepth(1);
        this.setCollideWorldBounds(true);
        this.setSize(11, 20);
        this.setOffset(26, 28);

    }

    initEvents() {
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    initStates() {

        this.currentState = null;
        this.states = {};
        this.lastState = "idle";

        this.states["idle"] = new IdleState(this, this.scene);
        this.states["run"] = new RunState(this, this.scene);
        this.states["jump"] = new JumpState(this, this.scene);
        this.states["boostJump"] = new BoostJumpState(this, this.scene);
        this.states["fall"] = new FallState(this, this.scene);
        this.states["wallSlide"] = new WallSlideState(this, this.scene);
        this.states["wallJump"] = new WallJumpState(this, this.scene);

        this.setState("idle")
    }

    setState(stateName) {

        if (this.currentState) {
            this.currentState.exit();
            this.lastState = this.currentState.name;
        }

        this.currentState = this.states[stateName];

        this.currentState.enter();
        this.displayState.setText(stateName);
    }

    update(time, delta) {

        console.log(this.withSpeedSkyglow);

        this.isShiftJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.shift);
        this.isShiftJustUp = Phaser.Input.Keyboard.JustUp(this.cursors.shift);

        this.isZJustDown = Phaser.Input.Keyboard.JustDown(this.zKey);
        this.isZJustUp = Phaser.Input.Keyboard.JustUp(this.zKey);

        this.isSJustDown = Phaser.Input.Keyboard.JustDown(this.sKey);
        this.isSJustUp = Phaser.Input.Keyboard.JustUp(this.sKey);


        if(this.skyglow){
            if(this.scene.physics.overlap(this, this.skyglow)){
                if(this.skyglow.type == "jump"){
                    this.withJumpSkyglow = true;
                }
                if(this.skyglow.type == "speed"){
                    this.withSpeedSkyglow = true;
                }
                if(this.skyglow.type == "glide"){
                    this.withGlideSkyglow = true;
                }
            }
            else{
                this.withJumpSkyglow = false;
                //this.withSpeedSkyglow = false;
                this.withGlideSkyglow = false;
            }
        }


        if (!this.active) { return; }

        if (this.cantMove) {
            return;
        }

        this.isOnFloor = this.body.onFloor();

        if (this.withSpeedSkyglow){
            this.turn();
        }

        // Gestion States

        if (this.currentState) {
            this.currentState.update(); // Mettre à jour l'état actuel
        }

        this.displaceSkyglow();

    }

    displaceSkyglow(){

        // Select Jump Skyglow :

        if(this.isShiftJustDown && !this.isOnDisplace){
            this.isOnDisplace = true;
            this.showJumpSkyglow();
        }

        if(this.shiftKey.isDown && this.isOnDisplace){
            this.moveJumpSkyglow();
        }

        if(this.isShiftJustUp && this.isOnDisplace){
            this.placeJumpSkyglow();
            this.isOnDisplace = false;
        }

        // Select Speed Skyglow :

        if(this.isSJustDown && !this.isOnDisplace){
            this.isOnDisplace = true;
            this.showSpeedSkyglow();
        }

        if(this.sKey.isDown && this.isOnDisplace){
            this.moveSpeedSkyglow();
        }

        if(this.isSJustUp && this.isOnDisplace){
            this.placeSpeedSkyglow();
            this.isOnDisplace = false;
        }

        // Select Glide Skyglow :

        if(this.isZJustDown && !this.isOnDisplace){
            this.isOnDisplace = true;
            this.showGlideSkyglow();
        }

        if(this.zKey.isDown && this.isOnDisplace){
            this.moveGlideSkyglow();
        }

        if(this.isZJustUp && this.isOnDisplace){
            this.placeGlideSkyglow();
            this.isOnDisplace = false;
        }
    }


    savePosition(point) {
        this.lastSaveX = point.x;
        this.lastSaveY = point.y;
    }

    respawn() {
        this.disableBody();
        this.setAlpha(0);
        this.scene.time.delayedCall(70, () => {
            this.setAlpha(0);
        }, this);
        this.scene.time.delayedCall(500, () => {
            this.setAlpha(1);
            this.enableBody();
            this.setAlpha(1);
            this.body.reset(this.lastSaveX, this.lastSaveY);

            /* // Pour reset les éléments bougeable à la mort du joueur 
            this.scene.movingPlatforms.children.each(function(platform) {

            platform.reset(); 
   
               }, this);
            */

        }, this);

    }

    

    showJumpSkyglow(){
        if(this.skyglow){
            this.skyglow.destroy();
        }
        this.skyglow = new JumpSkyglow(this.scene, this.x, this.y + 32);
        this.skyglow.alpha = 0.5;
    }

    moveJumpSkyglow(){
        
        if(this.body.velocity.x >= 0){
            this.skyglow.x = this.x + 192;
        }
        else {
            this.skyglow.x = this.x - 192;
        }
        this.skyglow.y = this.y + 64;

    }

    placeJumpSkyglow(){
        this.skyglow.alpha = 1;
        this.skyglow.displace();
        this.scene.createSkyglow(this.skyglow);
    }

    showSpeedSkyglow(){
        if(this.skyglow){
            this.skyglow.destroy();
        }
        this.skyglow = new SpeedSkyglow(this.scene, this.x, this.y + 32);
        this.skyglow.alpha = 0.5;
    }

    moveSpeedSkyglow(){
        
        if(this.body.velocity.x >= 0){
            this.skyglow.x = this.x - 116;
        }
        else {
            this.skyglow.x = this.x + 116;
        }
        this.skyglow.y = this.y + 64;

    }

    placeSpeedSkyglow(){
        this.skyglow.alpha = 1;
        this.skyglow.displace(this);
        this.scene.createSkyglow(this.skyglow);
        if (!this.withSpeedSkyglow){
            this.scene.physics.add.collider(this,this.skyglow, this.return, null, this);
        }
    }


    showGlideSkyglow(){
        if(this.skyglow){
            this.skyglow.destroy();
        }
        this.skyglow = new JumpSkyglow(this.scene, this.x, this.y + -32);
        this.skyglow.alpha = 0.5;
    }

    moveGlideSkyglow(){
        
        if(this.body.velocity.x >= 0){
            this.skyglow.x = this.x + 192;
        }
        else {
            this.skyglow.x = this.x - 192;
        }
        this.skyglow.y = this.y - 256;

    }

    placeGlideSkyglow(){
        this.skyglow.alpha = 1;
        this.skyglow.displace();
        this.scene.createSkyglow(this.skyglow);
    }

    return(){
        this.withSpeedSkyglow = true;
        this.scene.cameras.main.shake(100, .0015, true);
        this.speed = this.boostSpeed;
        this.skyglow.destroy();
    }

    turn(){
        const distanceVitesse = Math.abs(0-this.body.velocity.x);
        console.log(distanceVitesse);
        if(distanceVitesse < 600){
            this.speed = this.constantSpeed;
            this.withSpeedSkyglow = false;
            console.log("arret");
        }
    }


}

export default Player;