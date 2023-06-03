
class Menu extends Phaser.Scene {

    constructor(config) {
        super("Menu");
        this.config = config;
    }

    init(data) {
        this.gamepad = data.gamepad;
    }

    create() {

        this.SCREEN_WIDTH = this.config.width;
        this.SCREEN_HEIGHT = this.config.height;
        this.zoom = this.config.zoomFactor;
        this.sceneName = this.add.systems.config;

        // Chargement des backgrounds + parralax
        
        this.add.image(-500,-250,"sky").setOrigin(0, 0).setScale(0.6).setScrollFactor(0.25,0.25).setDepth(-1);
        this.add.image(-500,-250,"backgroundBackgroundBlur").setOrigin(0, 0).setScale(0.6).setScrollFactor(0.25,0.25).setDepth(-0.5);
        this.add.image(-500,-250,"filtre").setOrigin(0, 0).setScale(0.6).setScrollFactor(0.25,0.25).setAlpha(0.25).setDepth(-0.5);
        this.add.image(-425,-400,"backgroundBlur").setOrigin(0, 0).setScale(0.6).setScrollFactor(0.45,0.6).setDepth(-0.20);
        this.add.image(-425,-400,"filtre").setOrigin(0, 0).setScale(0.6).setScrollFactor(0.45,0.6).setAlpha(0.1).setDepth(-0.20);

        // Chargement des nuages
        this.nuage1Back = this.physics.add.image(3000, 500,"nuage1").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.25,0.25).setDepth(-0.75).setAlpha(0.5);
        this.nuage1Back.body.setVelocityX(-20);
        this.nuage2Back = this.physics.add.image(0, 0,"nuage2").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.25,0.25).setDepth(-0.75).setAlpha(0.5);
        this.nuage2Back.body.setVelocityX(30);
        this.nuage3Front = this.physics.add.image(1000, 500,"nuage3").setOrigin(0, 0).setScale(0.25).setScrollFactor(0.45,0.6).setDepth(-0.25).setAlpha(0.75);
        this.nuage3Front.body.setVelocityX(60);
        this.nuage3Front2 = this.physics.add.image(2000, 800,"nuage3").setOrigin(0, 0).setScale(0.25).setScrollFactor(0.45,0.6).setDepth(-0.25).setAlpha(0.75);
        this.nuage3Front2.body.setVelocityX(-50);
        this.nuage2Front = this.physics.add.image(3000, 650,"nuage2").setOrigin(0, 0).setScale(0.25).setScrollFactor(0.45,0.6).setDepth(-0.25).setAlpha(0.75);
        this.nuage2Front.body.setVelocityX(-40);
        this.nuage1Front = this.physics.add.image(0, 700,"nuage1").setOrigin(0, 0).setScale(0.25).setScrollFactor(0.45,0.6).setDepth(-0.25).setAlpha(0.75);
        this.nuage1Front.body.setVelocityX(-35);

        this.add.image(50,-350,"logo").setOrigin(0,0);
        this.selectedPlayButton = this.add.image(350,600,"playSelected").setOrigin(0,0).setAlpha(0);
        this.playButton = this.add.image(350,600,"play").setOrigin(0,0).setAlpha(1).setInteractive();
        this.selectedQuitButton = this.add.image(950,600,"quitSelected").setOrigin(0,0).setAlpha(0);
        this.quitButton = this.add.image(950,600,"quit").setOrigin(0,0).setAlpha(1).setInteractive();
        

        this.playHover = false;
        this.playButton.on('pointerover', () => {

            if (!this.playHover){
                this.playHover = true;
                this.tweens.killTweensOf(this.playButton);
                //this.tweens.killAll();
                this.tweens.add({
                    targets: this.playButton,
                    alpha: 0,
                    duration: 200,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });

                this.tweens.add({
                    targets: this.selectedPlayButton,
                    alpha: 1,
                    duration: 200,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
            }

        });
        this.playButton.on('pointerout', () => {

            if(this.playHover){
                this.playHover = false;
                this.tweens.killTweensOf(this.playButton);
                this.tweens.add({
                    targets: this.playButton,
                    alpha: 1,
                    duration: 200,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });

                this.tweens.add({
                    targets: this.selectedPlayButton,
                    alpha: 0,
                    duration: 200,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
            }
            
        });

        this.quitHover = false;
        this.quitButton.on('pointerover', () => {

            if (!this.quitHover){
                this.quitHover = true;
                this.tweens.killTweensOf(this.quitButton);
                this.tweens.add({
                    targets: this.quitButton,
                    alpha: 0,
                    duration: 200,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });

                this.tweens.add({
                    targets: this.selectedQuitButton,
                    alpha: 1,
                    duration: 200,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
            }

        });
        this.quitButton.on('pointerout', () => {

            if(this.quitHover){
                this.quitHover = false;
                this.tweens.killTweensOf(this.quitButton);
                this.tweens.add({
                    targets: this.quitButton,
                    alpha: 1,
                    duration: 200,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });

                this.tweens.add({
                    targets: this.selectedQuitButton,
                    alpha: 0,
                    duration: 200,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
            }
            
        });

        this.playButton.on('pointerup', () => {

            this.cameras.main.fadeOut(1000, 34, 27, 29);
            this.time.delayedCall(1000, () => {
				this.scene.start("Level_01");
            })
            
        });

        this.quitButton.on('pointerup', () => {

            this.cameras.main.fadeOut(1000, 34, 27, 29);
            this.time.delayedCall(1000, () => {
				this.game.destroy();
            })
            
        });

        //Limites monde et caméra
        this.cameras.main.setZoom(this.zoom);

        const sensitivity = 0.05;

        this.input.on('pointermove', (pointer) => {

            // Obtenez la différence entre la position actuelle de la souris et sa position précédente
            const deltaX = pointer.position.x - pointer.prevPosition.x;
            const deltaY = pointer.position.y - pointer.prevPosition.y;
          
            // Appliquez cette différence à la position de la caméra avec une sensibilité
            this.cameras.main.scrollX += deltaX * sensitivity;
            this.cameras.main.scrollY += deltaY * sensitivity;
          });
        
    }

    gestionNuage(){

        // Nuage 1 back
        if(this.nuage1Back.x + this.nuage1Back.width < - 100){
            this.nuage1Back.x = 3000;
        }
        // Nuage 2 back
        if(this.nuage2Back.x > 2500){
            this.nuage2Back.x = 0 - this.nuage1Back.width;
        }
        // Nuage 3 front
        if(this.nuage3Front.x > 2500){
            this.nuage3Front.x = 0 - this.nuage3Front.width;
        }
        // Nuage 3 front 2
        if(this.nuage3Front2.x + this.nuage3Front2.width < - 100){
            this.nuage3Front2.x = 1920 + this.nuage3Front2.width;
        }
        // Nuage 2 front
        if(this.nuage2Front.x + this.nuage2Front.width < 500){
            this.nuage2Front.x = 1920 + this.nuage3Front2.width;
        }
        // Nuage 2 front
        if(this.nuage1Front.x + this.nuage1Front.width < - 100){
            this.nuage1Front.x = 1920 + this.nuage1Front.width;
        }

    }

    update() {
        this.gestionNuage();

    }

}

export default Menu;