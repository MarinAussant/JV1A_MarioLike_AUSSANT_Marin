class FallingPlatform extends Phaser.Physics.Arcade.Sprite{


    constructor(scene, x, y){
        super(scene, x,y, "falling"); 
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        this.initX = x;
        this.initY = y; 
        this.init(); 
        this.initEvents(); 

    }

    init(){
        this.gravity = 2000; 
        //this.setImmovable(true); 
        this.beenActive = false; 
        this.onAir = false;
        this.body.allowGravity = false; 
        this.pushable = false;
        this.body.immovable = true;
        this.body.maxVelocity.y = 1500;

    }

    initEvents(){
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
    }

    update(time, delta){

        if (this.onAir){
            if (this.body.velocity.y < this.body.maxVelocity.y){
                this.body.setVelocityY(this.body.velocity.y + 15);
            }
            else {
                this.body.setVelocityY(this.body.maxVelocity.y);
            }
        }

        if (this.body.blocked.down){
            this.setInactive();
        }

    }

    setActive(){
        if (!this.beenActive){
            this.beenActive = true;
            this.scene.cameras.main.shake(350, .0010, true);
            this.scene.time.delayedCall(300, () => {
                this.body.allowGravity = true; 
                this.onAir = true;
            }, this);
            
        }  
    }

    setInactive(){
        this.scene.cameras.main.shake(100, .0020, true);
        this.onAir = false;
        this.body.setVelocityY(0);
        this.body.allowGravity = false;
    }

    reset(){
        this.body.allowGravity = false; 
        this.active = false;
        this.beenActive = false; 

        this.x = this.initX;
        this.y = this.initY; 
    }


}

export default FallingPlatform; 