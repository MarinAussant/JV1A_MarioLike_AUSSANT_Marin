import collidable from "../extra/makeCollidable.js";
import JumpState from "../states/JumpState.js";
import IdleState from "../states/IdleState.js";
import RunState from "../states/RunState.js";
import FallState from "../states/FallState.js";


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
        this.initStates();

    }

    init(){
        //Variables personnage
        this.gravity = 2000; 
        this.speed = 400; 

        this.acceleration = 50;
        this.deceleration = 40;

        this.isOnFloor;

        this.airAcceleration = 35;
        this.ariDeceleration = 85;
        this.airTurnSpeed = 80;

        this.jumpSpeed = 800;
        this.boostJumpSpeed = 1200; 
        this.jumpCutOff = 120;

        this.coyoteTime = 100;

        this.jumpBufferTime = 100;
        this.lastJumpBufferTime = 101;

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        this.dir = "right"; 
        this.cantMove = false; 

        this.lastSaveX = 0;
        this.lastSaveY = 0; 

        this.displayState = this.scene.add.text(0,0,"",{ fontSize: 80, color: '#FF0000'}).setScrollFactor(0);


        //Physique avec le monde
        this.body.setGravityY(this.gravity);
        this.body.maxVelocity.y = 1500;
        this.setDepth(1);  
        this.setCollideWorldBounds(true); 
        this.setSize(11,20);
        this.setOffset(26,28);


    }

    initEvents(){
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
    }

    initStates(){

        this.currentState = null;
        this.states = {};
        this.lastState = "idle";

        this.states["idle"] = new IdleState(this, this.scene);
        this.states["run"] = new RunState(this, this.scene);
        this.states["jump"] = new JumpState(this, this.scene);
        this.states["fall"] = new FallState(this, this.scene);

        this.setState("idle")
    }

    setState(stateName){

        if (this.currentState){
            this.currentState.exit();
            this.lastState = this.currentState.name;
        }

        this.currentState = this.states[stateName];

        this.currentState.enter();
        this.displayState.setText(stateName);
    }

    update(time, delta){

        if(!this.active){return; }

        if(this.cantMove){
            return; 
        }
    
        this.isOnFloor = this.body.onFloor(); 

        
        // Gestion States

        if (this.currentState){
            this.currentState.update(); // Mettre à jour l'état actuel
        }

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