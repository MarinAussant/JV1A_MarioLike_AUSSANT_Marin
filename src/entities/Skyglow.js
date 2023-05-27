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

    putInventory(){

        this.inInventory = true;

        this.scene.tweens.add({
            targets: this,
            scale: this.sizeInventory,
            duration: 300,  // Durée de l'animation en millisecondes
            ease: 'Linear', // Fonction d'interpolation pour l'animation
          });

    }

    reset(){
   
        this.scene.activeEvents.forEach(event => {
            if (event.skyglow == this){
                this.scene.time.removeEvent(event);
                this.scene.activeEvents.splice(this.scene.activeEvents.indexOf(event),1);
            }
        })

        this.scene.tweens.add({
            targets : this, 
            x: this.initX,
            y : this.initY,
            scale: this.sizeReal,
            duration: 300,  // Durée de l'animation en millisecondes
            ease: 'Linear', // Fonction d'interpolation pour l'animation
        });

        this.scene.time.delayedCall(300, () => {
            this.inInventory = false;
            switch (this.type){
                case "speed" :
                    this.scene.player.canSpeedBoost = false;
                    break;
                case "jump" :
                    this.scene.player.canJumpBoost = false;
                    break;
                case "glide" :
                    this.scene.player.canGlide = false;
                    break;
            }
            this.body.setVelocity(0,0);
        }, this);

        

        
    }

}

export default Skyglow;