import Skyglow from "./Skyglow.js";
import collidable from "../extra/makeCollidable.js";

// Class Skyglow
class GlideSkyglow extends Skyglow {

    constructor(scene, x, y, sprite) {
        super(scene, x, y, "glideSkyglow").setScale(0.75);
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        //Mixins collisions
        Object.assign(this, collidable);

        //Propriétés à passer de scène en scène

        this.init();
        this.initEvents();

    }

    init() {

        //Variables personnage

        this.isOnFloor = false;
        
        this.gravity = 0;
        this.speed = 400;

        this.acceleration = 10;
        this.deceleration = 40;

        this.xToGo;
        this.yToGo; 

        this.type = "glide";

        //Physique avec le monde
        //this.body.maxVelocity.y = 1500;
        this.setDepth(1);
        this.setCollideWorldBounds(true);
        
        this.setSize(128, 128);
        this.setOffset(0, 0);


    }

    initEvents() {
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }


    update(time, delta) {
        //this.isOnFloor = this.body.onFloor();
    }

    displace(player){
        this.setGravityY(this.gravity);
    }

}

export default GlideSkyglow;