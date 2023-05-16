import collidable from "../extra/makeCollidable.js";

// Class Skyglow
class Skyglow extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite).setScale(0.75);
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        //Mixins collisions
        Object.assign(this, collidable);

        //Propriétés à passer de scène en scène

        this.init(sprite);
        this.initEvents();

    }

    init(sprite) {

    }

    initEvents() {
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }


    update(time, delta) {

    }

    displace(){
         
    }

}

export default Skyglow;