import collidable from "../extra/makeCollidable.js";

import JumpState from "../states/JumpState.js";
import IdleState from "../states/IdleState.js";
import RunState from "../states/RunState.js";
import FallState from "../states/FallState.js";
import WallSlideState from "../states/WallSlideState.js";
import WallJumpState from "../states/WallJumpState.js";
import BoostJumpState from "../states/BoostJumpState.js";
import WallBoostJumpState from "../states/WallBoostJumpState.js";

// Class Player
class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
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
        this.playerLightUp = this.scene.lights.addLight(this.x, this.y, 1200, 0xd5bc70, 0.20);
        this.playerLightDown = this.scene.lights.addLight(this.x, this.y+120, 1200, 0xd5bc70, 0.20);

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

        this.coyoteTime = 150;

        this.jumpBufferTime = 125;
      
        this.lastJumpBufferTime = 201;

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.cantMove = false;

        this.canSpeedBoost = false;
        this.canJumpBoost = false;
        this.canGlide = false;

        this.lastSaveX = 0;
        this.lastSaveY = 0;

        //this.displayState = this.scene.add.text(0, 0, "", { fontSize: 80, color: '#FF0000' }).setScrollFactor(0);

        // Control Keyboard 
        this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.zKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.sKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // Control Controller
        // gamepad controls
		this.inputPad = {
			left: false,
			right: false,
			a: false,
			aOnce: false,
            l1: false,
			l1Once: false,
            r1: false,
			r1Once: false,
		};

        this.scene.input.gamepad.on('connected', this.gamepadEventConnect, this);
        this.scene.input.gamepad.on('disconnected', this.gamepadEventDisconnect, this);

        //Physique avec le monde
        this.body.setGravityY(this.gravity);
        this.body.maxVelocity.y = 1500;
        this.setDepth(0.2);
        this.setCollideWorldBounds(true);

        this.listeSkyglow = [];
        this.actualPrepareJump;
        this.actualPrepareSpeed;
        this.actualPrepareGlide;

        // Animations
    
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
        //this.displayState.setText(stateName);

    }

    update(time, delta) {


        if (!this.active) { return; }

        if (this.cantMove) {
            return;
        }

        // Gestion direction

        if(this.body.velocity.x > 20){
            this.flipX = false;
        }
        else if(this.body.velocity.x < -20){
            this.flipX = true;
        }   

        // gestion des lights

        this.manageLights();

        // Gestion des inputs

        this.isShiftJustDown = Phaser.Input.Keyboard.JustDown(this.sKey);

        this.isZJustDown = Phaser.Input.Keyboard.JustDown(this.zKey);

        this.handleGamepadAxis()



        this.isOnFloor = this.body.onFloor();

        // Gestion Skyglow

        // Gestion Jump Skyglow

        if ((this.isZJustDown || this.inputPad.l1Once) && !this.canJumpBoost){
            
                const jumpSkyglow = this.listeSkyglow.find(skyglow => skyglow.type == "jump");

                if (jumpSkyglow){
                    this.scene.jumpParticles.start();
                    this.canJumpBoost = true;
                    jumpSkyglow.skyglowLight.setVisible(true);
                    this.actualPrepareJump = jumpSkyglow;
                    this.listeSkyglow.splice(this.listeSkyglow.indexOf(jumpSkyglow),1);
                }

        }

        // Gestion Speed Skyglow
        
        if ((this.isShiftJustDown || this.inputPad.r1Once) && !this.canSpeedBoost){
            
            const speedSkyglow = this.listeSkyglow.find(skyglow => skyglow.type == "speed");

            if (speedSkyglow){    

                this.canSpeedBoost = true;
                speedSkyglow.skyglowLight.setVisible(true);
                this.actualPrepareSpeed = speedSkyglow;
                this.listeSkyglow.splice(this.listeSkyglow.indexOf(speedSkyglow),1);       
                
            }

        }

        if (this.speedBoost){
            this.checkResetSpeedBoost();
        }

        // Gestion States

        if (this.currentState) {
            this.currentState.update(); // Mettre à jour l'état actuel
        }

        this.inputPad.aOnce = false;
        this.inputPad.l1Once = false;
        this.inputPad.r1Once = false;

    }

    manageLights(){
        this.playerLightUp.x = this.x;
        this.playerLightUp.y = this.y;
        this.playerLightDown.x = this.x;
        this.playerLightDown.y = this.y + 120;
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

        this.scene.physics.moveTo(skyglow, this.x + Math.floor((Math.random()*100)-50), this.y + 50 + Math.floor((Math.random()*32)-16), 350, skyglow.speed);
        const event = this.scene.time.addEvent({
            delay: 150,                
            callback: () => {
             
                this.scene.physics.moveTo(skyglow, this.x + Math.floor((Math.random()*100)-50), this.y + 50 + Math.floor((Math.random()*32)-16), 350, skyglow.speed);
       
            },
            loop: true
        },this)

        event.type = "skyglowFollow";
        event.skyglow = skyglow;

        this.scene.activeEvents.push(event);
        
    }

    activeJumpRoutine(){

        this.scene.jumpParticles.stop(false);

        this.scene.cameras.main.shake(100, .0025, true);

        this.actualPrepareJump.skyglowLight.setVisible(false);

        this.scene.activeEvents.forEach(event => {

            if (event.skyglow == this.actualPrepareJump){
                this.scene.time.removeEvent(event);
                this.scene.activeEvents.splice(this.scene.activeEvents.indexOf(event),1);
            }

        })

        this.scene.time.delayedCall(100, () => {
            this.actualPrepareJump.reset();
            this.actualPrepareJump = false;
        }, this);
        
    }

    activeSpeedRoutine(){
        
        this.scene.speedParticles.speedX = 1000 * Math.sign(this.body.velocity.x);
        if(this.body.velocity.x < 0 ){this.scene.speedParticles.particleRotate = 180;}
        else{this.scene.speedParticles.particleRotate = 0;}
        this.scene.speedParticles.start();

        this.scene.cameras.main.shake(100, .0025, true);

        this.body.setVelocityX(this.boostSpeed * Math.sign(this.body.velocity.x));
        this.speed = this.boostSpeed;

        this.actualPrepareSpeed.speed = this.actualPrepareSpeed.boostSpeed;
            
        this.canSpeedBoost = false;
        this.speedBoost = true;

    }

    checkResetSpeedBoost(){
        const distanceVitesse = Math.abs(0-this.body.velocity.x);
        if(distanceVitesse < this.speed - 40){

            this.scene.speedParticles.stop(false);

            this.speed = this.constantSpeed;
            this.speedBoost = false;

            this.scene.time.delayedCall(100, () => {
                this.actualPrepareSpeed.speed = this.actualPrepareSpeed.constantSpeed;
                this.actualPrepareSpeed.reset();
                this.actualPrepareSpeed = false;
            }, this);
        }
    }

    gamepadEventConnect() {
		if (this.scene == undefined){
			this.gamepad = false;
			this.resetGamepad();
			return;
		} else {
			console.log("Controller connected!");
			this.gamepad = this.scene.input.gamepad.pad1;

			// setup events
			this.gamepad.on("down", () => {
				this.handleGamepadButtons("down");
			});
			this.gamepad.on("up", () => {
				this.handleGamepadButtons("up");
			});
		}

	}

    gamepadEventDisconnect(){
        console.log("Controller disconnected!");

        // clear the gamepad
        this.gamepad = null;
        // resets inputs when disconnected
        this.resetGamepad();
    }

    resetGamepad(){
		// avoid ghost inputs when disconnecting gamepad
		this.inputPad = {
			left: false,
			right: false,
			a: false,
			aOnce: false,
            l1: false,
			l1Once: false,
            r1: false,
			r1Once: false,
		};
	}

    handleGamepadButtons(event){
		if (this.gamepad){

            const buttonA = this.gamepad.A;
            const buttonL1 = this.gamepad.L1;
            const buttonR1 = this.gamepad.R1;

            // aOnce and xOnce are true during 1 frame even when holding a or x
			if (event == "down") {
				if (buttonA && !this.inputPad.a)
					this.inputPad.aOnce = buttonA;
                if (buttonL1 && !this.inputPad.l1)
					this.inputPad.l1Once = buttonL1;
                if (buttonR1 && !this.inputPad.r1)
					this.inputPad.r1Once = buttonR1;
			}

			this.inputPad.a = buttonA;
			this.inputPad.l1 = buttonL1;
			this.inputPad.r1 = buttonR1;

		}
	}

    handleGamepadAxis(){
		if (this.gamepad){
			// get axis values
            
			const horizAxis = this.gamepad.leftStick;

			// set input values according to axis/dpad values
			if (horizAxis.x < -0.4){
				this.inputPad.right = false;
				this.inputPad.left = true;
			} else if (horizAxis.x > 0.4) {
				this.inputPad.right = true;
				this.inputPad.left = false;
			}
            else{
                this.inputPad.right = false;
				this.inputPad.left = false;
            }
        
		}
	}

}

export default Player;