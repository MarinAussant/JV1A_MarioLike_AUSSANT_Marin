import collidable from "../extra/makeCollidable.js";

import JumpState from "../states/JumpState.js";
import IdleState from "../states/IdleState.js";
import RunState from "../states/RunState.js";
import FallState from "../states/FallState.js";
import WallSlideState from "../states/WallSlideState.js";
import WallJumpState from "../states/WallJumpState.js";
import BoostJumpState from "../states/BoostJumpState.js";
import WallBoostJumpState from "../states/WallBoostJumpState.js";

import JumpSkyglow from "./JumpSkyglow.js";
import SpeedSkyglow from "./SpeedSkyglow.js";
import GlideSkyglow from "./GlideSkyglow.js";



// Class Player
class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, skyglow) {
        super(scene, x, y, "idleSprite").setScale(0.3);
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        //Mixins collisions
        Object.assign(this, collidable);

        //Propriétés à passer de scène en scène

        this.init();
        this.initEvents();
        this.initStates();

    }

    init() {
        //Variables personnage

        this.isOnFloor;

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
        this.constantJumpSpeed = 800;
        this.increaseJumpBoost = 20;

        this.jumpCutOff = 120;
        this.boostJumpCutOff = 350;

        this.lastWallDirection;
        this.wallJumpCutDirection = 300;

        this.coyoteTime = 100;

        this.jumpBufferTime = 100;
        this.lastJumpBufferTime = 101;

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.cantMove = false;

        this.canSpeedBoost = false;
        this.canJumpBoost = false;
        this.canGlide = false;

        this.lastSaveX = 0;
        this.lastSaveY = 0;

        this.displayState = this.scene.add.text(0, 0, "", { fontSize: 80, color: '#FF0000' }).setScrollFactor(0);

        this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.zKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.sKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        //Physique avec le monde
        this.body.setGravityY(this.gravity);
        this.body.maxVelocity.y = 1500;
        this.setDepth(0);
        this.setCollideWorldBounds(true);

        this.listeSkyglow = [];
        this.actualPrepareJump;
        this.actualPrepareSpeed;
        this.actualPrepareGlide;


        // Animations
        /*
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("rain_spritesheet", {start: 0, end: 1}),
            frameRate: 2,
            repeat: -1
        });
        */
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("idleSprite", {start: 0, end: 19}),
            frameRate: 20,
            repeat: -1
        });
        this.scene.anims.create({
            key: "run",
            frames: this.scene.anims.generateFrameNumbers("runSprite", {start: 0, end: 24}),
            frameRate: 30,
            repeat: -1
        });
        this.scene.anims.create({
            key: "boostJump",
            frames: this.scene.anims.generateFrameNumbers("jumpSprite", {start: 0, end: 13}),
            frameRate: 42,
            repeat: 0
        });
        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers("jumpSprite", {start: 0, end: 13}),
            frameRate: 63,
            repeat: 0
        });
        this.scene.anims.create({
            key: "fall",
            frames: this.scene.anims.generateFrameNumbers("jumpSprite", {start: 14, end: 26}),
            frameRate: 39,
            repeat: 0
        });
        this.scene.anims.create({
            key: "wallSlide",
            frames: this.scene.anims.generateFrameNumbers("wallSlideSprite", {start: 0, end: 23}),
            frameRate: 5,
            repeat: -1
        });

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
        this.states["wallBoostJump"] = new WallBoostJumpState(this, this.scene);

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

        console.log(this.body.velocity.x);

        if (!this.active) { return; }

        if (this.cantMove) {
            return;
        }

        if(this.body.velocity.x > 20){
            this.flipX = false;
        }
        else if(this.body.velocity.x < -20){
            this.flipX = true;
        }

        this.isShiftJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.shift);
        this.isShiftJustUp = Phaser.Input.Keyboard.JustUp(this.cursors.shift);

        this.isZJustDown = Phaser.Input.Keyboard.JustDown(this.zKey);
        this.isZJustUp = Phaser.Input.Keyboard.JustUp(this.zKey);

        this.isOnFloor = this.body.onFloor();

        // Gestion Skyglow

        // Gestion Jump Skyglow

        if (this.isZJustDown && !this.canJumpBoost){
            
                const jumpSkyglow = this.listeSkyglow.find(skyglow => skyglow.type == "jump");

                if (jumpSkyglow){
                    
                    this.canJumpBoost = true;
                    this.scene.activeEvents.forEach(event => {
                        if (event.skyglow == jumpSkyglow && event.type == 'skyglowFollow'){

                            this.scene.time.removeEvent(event);
                            this.scene.activeEvents.splice(this.scene.activeEvents.indexOf(event),1);
                            this.listeSkyglow.splice(this.listeSkyglow.indexOf(jumpSkyglow),1);
                        }
                    })

                    //Faire en sorte qu'il s'illumine en bleu 

                    this.createPrepareJumpRoutine(jumpSkyglow);
                    
                }

        }

        // Gestion Speed Skyglow
        
        if (this.isShiftJustDown && !this.canSpeedBoost){
            
            const speedSkyglow = this.listeSkyglow.find(skyglow => skyglow.type == "speed");

            this.listeSkyglow.splice(this.listeSkyglow.indexOf(speedSkyglow),1);

            if (speedSkyglow){    

                //Faire en sorte qu'il s'illumine en vert 

                this.canSpeedBoost = true;
                
                this.actualPrepareSpeed = speedSkyglow;

                this.scene.tweens.add({
                    targets: speedSkyglow,
                    scale: speedSkyglow.sizeReal,
                    duration: 300,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
                
            }

        }

        if (this.speedBoost){
            this.checkResetSpeedBoost();
        }

        // Gestion States

        if (this.currentState) {
            this.currentState.update(); // Mettre à jour l'état actuel
        }

    }

    savePosition(point) {
        this.lastSaveX = point.x/4;
        this.lastSaveY = point.y/4;
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

             // Pour reset les éléments bougeable à la mort du joueur 
            this.scene.fallingPlatforms.children.each(function(platform) {
                
                platform.reset(); 
   
            }, this);

            this.scene.skyglows.children.each(function(skyglow) {
                
                skyglow.reset(); 
   
            }, this);

            this.listeSkyglow = [];    

        }, this);

    }

    createFollowRoutine(skyglow){

        this.scene.physics.moveTo(skyglow, this.x + Math.floor((Math.random()*100)-50), this.y + Math.floor((Math.random()*32)-16), 350, 350);
        const event = this.scene.time.addEvent({
            delay: 350,                
            callback: () => {
                if (skyglow.type == "jump"){
                    this.scene.physics.moveTo(skyglow, this.x + Math.floor((Math.random()*100)-50), this.y + Math.floor((Math.random()*32)-16), 350, 350);
                }
                else if (skyglow.type == "speed"){
                    this.scene.physics.moveTo(skyglow, this.x + Math.floor((Math.random()*100)-50) - (32 * Math.sign(this.body.velocity.x)), this.y + Math.floor((Math.random()*32)-16), 350, 350);
                }
                else if (skyglow.type == "glide"){
                    this.scene.physics.moveTo(skyglow, this.x + Math.floor((Math.random()*100)-50), this.y - Math.floor((Math.random()*32)-16), 350, 350);
                }
                    
            },
            loop: true
        },this)

        event.type = "skyglowFollow";
        event.skyglow = skyglow;

        this.scene.activeEvents.push(event);
        
    }

    createPrepareJumpRoutine(skyglow){

        this.actualPrepareJump = skyglow;

        this.scene.tweens.add({
            targets: skyglow,
            scale: skyglow.sizeReal,
            duration: 300,  // Durée de l'animation en millisecondes
            ease: 'Linear', // Fonction d'interpolation pour l'animation
        });

        this.scene.physics.moveTo(skyglow, this.x + Math.floor((Math.random()*50)-25), this.y + 192 + Math.floor((Math.random()*32)-16), 350, 200);
        const event = this.scene.time.addEvent({
            delay: 200,                
            callback: () => {
                    this.scene.physics.moveTo(skyglow, this.x + Math.floor((Math.random()*50)-25), this.y + 192 + Math.floor((Math.random()*32)-16), 350, 200);
            },
            loop: true
        },this)
        
        event.type = "skyglowPrepareJump";
        event.skyglow = skyglow;

        this.scene.activeEvents.push(event);

    }

    activeJumpRoutine(){

        this.scene.activeEvents.forEach(event => {

            if (event.skyglow == this.actualPrepareJump){
                this.scene.time.removeEvent(event);
                this.scene.activeEvents.splice(this.scene.activeEvents.indexOf(event),1);
            }

        })

        this.scene.tweens.add({
            targets: this.actualPrepareJump,
            x : this.x ,
            y : this.y - 400,
            duration: 300,
            ease : "Ease.Out"  // Durée de l'animation en millisecondes
        });

        this.scene.time.delayedCall(400, () => {
            this.actualPrepareJump.reset();
            this.actualPrepareJump = false;
        }, this);
        
    }

    activeSpeedRoutine(){

        this.scene.cameras.main.shake(100, .0015, true);
        this.body.setVelocityX(this.boostSpeed * Math.sign(this.body.velocity.x));
        this.speed = this.boostSpeed;

        this.scene.activeEvents.forEach(event => {

            if (event.skyglow == this.actualPrepareSpeed){
                this.scene.time.removeEvent(event);
                this.scene.activeEvents.splice(this.scene.activeEvents.indexOf(event),1);
            }

        })

        this.scene.tweens.add({
            targets: this.actualPrepareSpeed,
            x : this.x + (500 * Math.sign(this.body.velocity.x)),
            y : this.y ,
            duration: 300,
            ease : "Ease.Out"  // Durée de l'animation en millisecondes
        });
            
        this.scene.time.delayedCall(300, () => {
            this.actualPrepareSpeed.reset();
            this.actualPrepareSpeed = false;
        }, this);

        this.canSpeedBoost = false;
        this.speedBoost = true;

    }

    checkResetSpeedBoost(){
        const distanceVitesse = Math.abs(0-this.body.velocity.x);
        if(distanceVitesse < this.speed - 40){
            this.speed = this.constantSpeed;
            this.speedBoost = false;
        }
    }

}

export default Player;