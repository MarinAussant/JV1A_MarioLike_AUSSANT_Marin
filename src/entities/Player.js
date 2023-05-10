import collidable from "../extra/makeCollidable.js";
import { getTimestamp } from "../extra/time.js";


// Class Player
class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, skyglow){
        super(scene, x,y, "tempSprite").setScale(0.25); 
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        //Mixins collisions
        Object.assign(this, collidable); 

        //Propriétés à passer de scène en scène
        this.listeSkyglow = skyglow; 

        this.init();
        this.initEvents();

        this.currentState = null;
        this.states = {};

    }

    init(){
        //Variables personnage
        this.gravity = 1500; 
        this.speed = 300; 

        this.acceleration = 50;
        this.deceleration = 90;
        this.turnSpeed = 50;

        this.isOnFloor;

        this.airAcceleration = 25;
        this.ariDeceleration = 70;
        this.airTurnSpeed = 80;

        this.jumpSpeed = 800; 
        this.timeToApex = 0.4;
        this.jumpCutOff = 3;

        this.coyoteTime = 0.05;
        this.jumpBuffer = 0.1;

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        this.dir = "right"; 
        this.cantMove = false; 

        this.lastSaveX = 0;
        this.lastSaveY = 0; 


        //Physique avec le monde
        this.body.setGravityY(this.gravity);
        this.setDepth(1);  
        this.setCollideWorldBounds(true); 
        this.setSize(11,20);
        this.setOffset(26,28);  


    }

    initEvents(){
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
    }

    setState(stateName){
        if (this.currentState){
            this.currentState.exit();
        }

        this.currentState = this.states[stateName];

        this.currentState.enter();
    }

    update(time, delta){

        if(!this.active){return; }

        if(this.cantMove){
            return; 
        }

        //Keys
        const {left, right, up, down, space} = this.cursors;
        const zKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        const qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        const dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const sKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space); 
        const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);

    
        this.isOnFloor = this.body.onFloor(); 


        //Déplacements
        // A REFFAIRE
        if (qKey.isDown){
            this.setVelocityX(-this.speed);
            this.setFlipX(true); 
        }
        else if (dKey.isDown){
            this.setVelocityX(this.speed);
            this.setFlipX(false); 
        }
        else {
            this.setVelocityX(0);
        }

       
        //Reset onFloor
        // A MODIF
        if(isOnFloor){
            this.jumpCount = 0;
        }
        
        //Saut et chute 
        // A REFAIRE
        if (isSpaceJustDown && (isOnFloor)){
            this.setVelocityY(-this.jumpSpeed);
        }


        //  if(isSpaceJustDown ){
        //    this.respawn(); 
        // }


    }


    savePosition(point){
        this.lastSaveX = point.x;
        this.lastSaveY = point.y;      
    }


    respawn(){
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

}

export default Player;