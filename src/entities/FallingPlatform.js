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
        this.active = false; 
        this.body.allowGravity = false; 

    }

    initEvents(){
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
    }

    update(time, delta){

        if (this.body.blocked.down){
            this.setInactive();
        }

    }

    setActive(){
        this.body.allowGravity = true; 
        this.active = true;
    }

    setInactive(){
        this.body.allowGravity = false; 
        this.active = false;
    }

    reset(){
        this.body.allowGravity = false; 
        this.active = false;

        this.x = this.initX;
        this.y = this.initY; 
    }


}

export default FallingPlatform; 