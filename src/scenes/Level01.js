import Player from "../entities/Player.js";
import FallingPlatform from "../entities/FallingPlatform.js";
import JumpSkyglow from "../entities/JumpSkyglow.js";
import SpeedSkyglow from "../entities/SpeedSkyglow.js";

class Level01 extends Phaser.Scene {

    constructor(config) {
        super("Level_01");
        this.config = config;
    }

    init(data) {
        this.skyglow = data.skyglow;
    }

    create() {

        this.SCREEN_WIDTH = this.config.width;
        this.SCREEN_HEIGHT = this.config.height;
        this.MAP_WIDTH = (100 * 256) / 4;
        this.MAP_HEIGHT = (30 * 256) / 4;
        this.zoom = this.config.zoomFactor;
        this.sceneName = this.add.systems.config;

        this.activeEvents = [];
        

        // Chargement des backgrounds + parralax
        for (let i = -300; i < this.MAP_WIDTH; i += (5263/4)*3){
            this.add.image(i,- Math.abs(3000 - this.MAP_HEIGHT),"sky").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.25,0.25).setDepth(-1);
            this.add.image(i,- Math.abs(2750 - this.MAP_HEIGHT),"backgroundBackground").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.25,0.25).setDepth(-0.5);
            this.add.image(i,- Math.abs(3000 - this.MAP_HEIGHT),"filtre").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.25,0.25).setAlpha(0.25).setDepth(-0.5);
            this.add.image(i,- Math.abs(3000 - this.MAP_HEIGHT),"background").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.45,0.6).setDepth(-0.20);
            this.add.image(i,- Math.abs(3000 - this.MAP_HEIGHT),"filtre").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.45,0.6).setAlpha(0.1).setDepth(-0.20);
        }

        // Chargement des nuages
        this.nuage1Back = this.physics.add.image(3000, 225,"nuage1").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.25,0.25).setDepth(-0.75).setAlpha(0.5);
        this.nuage1Back.body.setVelocityX(-20);
        this.nuage2Back = this.physics.add.image(0, -75,"nuage2").setOrigin(0, 0).setScale(0.75).setScrollFactor(0.25,0.25).setDepth(-0.75).setAlpha(0.5);
        this.nuage2Back.body.setVelocityX(30);
        this.nuage3Front = this.physics.add.image(1000, 100,"nuage3").setOrigin(0, 0).setScale(0.25).setScrollFactor(0.45,0.6).setDepth(-0.25).setAlpha(0.75);
        this.nuage3Front.body.setVelocityX(60);
        this.nuage3Front2 = this.physics.add.image(3000, 400,"nuage3").setOrigin(0, 0).setScale(0.25).setScrollFactor(0.45,0.6).setDepth(-0.25).setAlpha(0.75);
        this.nuage3Front2.body.setVelocityX(-50);
        this.nuage2Front = this.physics.add.image(2500, 300,"nuage2").setOrigin(0, 0).setScale(0.25).setScrollFactor(0.45,0.6).setDepth(-0.25).setAlpha(0.75);
        this.nuage2Front.body.setVelocityX(-40);
        this.nuage1Front = this.physics.add.image(0, 200,"nuage1").setOrigin(0, 0).setScale(0.25).setScrollFactor(0.45,0.6).setDepth(-0.25).setAlpha(0.75);
        this.nuage1Front.body.setVelocityX(-35);
        

        this.add.image(0, 0, "backLevel01").setOrigin(0, 0).setScale(1).setPipeline('Light2D');

        // Activation des lights

        this.lights.enable().setAmbientColor(0xeeeeee); ;
        //this.soleil = this.lights.addLight(0, -10000, 50000, 0xffffff, 250);

        //Creation de la scene : map + layers
        const map = this.createMap();
        const layers = this.createLayers(map);
        const playerPoints = this.getPlayerPoints(layers.spawn_end);
        const endZone = this.createEnd(playerPoints.end); 
        const vide = this.createVoid();

        //Creation skyglows
        this.skyglows = this.createSkyglow(layers.skyglows);

        //Creation joueur
        this.player = this.createPlayer(playerPoints);
        this.player.savePosition(playerPoints.start);
        this.player.setPipeline('Light2D');

        //Creation kill
        const kill = this.createKill(layers.kill);

        //Creation plateformes qui tombent
        this.fallingPlatforms = this.createFallingPlatforms(layers.fallingPlatforms);

        //ajout colliders au joueur
        this.player.addCollider(layers.layer_plateformes);
        this.endOverlap = this.physics.add.overlap(this.player, endZone,this.endLevel, null, this); 
        this.player.addOverlap(vide, this.player.respawn);
        this.player.addOverlap(kill, this.player.respawn);
        this.player.addOverlap(this.skyglows, this.getSkyglow);

        // Gestion des checkpoints
        const myCheckpoints = this.createCheckpoint(layers.checkpoints, layers.checkpointsPoints); 
        this.player.addOverlap(myCheckpoints, this.onCheckpointCollision);
        
        this.physics.add.collider(this.fallingPlatforms, layers.layer_plateformes);
        this.physics.add.collider(this.player, this.fallingPlatforms, this.onFallingPlatform, null, this);

        //Limites monde et caméra
        this.cameras.main.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT - 48);
        this.cameras.main.setZoom(this.zoom);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.y = 100;

        this.physics.world.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);

        // Particules de Saut

        this.jumpParticles = this.add.particles(this.player.x - 190, this.player.y,'jumpParticles', {
            emitZone:{
                source : new Phaser.Geom.Rectangle(this.player.x - 260, this.player.y - 225, this.player.x + -50, this.player.y + 50),
                type: "random",
            },
            scale: {start: 1.1, end: 0.1},
            lifespan: 1000, // Durée de vie des particules en millisecondes
            speedY: -500, // Vitesse verticale des particules (vers le haut)
            quantity: 0.5, // Nombre de particules à émettre
            frequency: 125, // Fréquence d'émission en particules par seconde

        });
        this.jumpParticles.stop(true);
        this.jumpParticles.setDepth(0);
        this.jumpParticles.startFollow(this.player);

        this.add.image(0, 0, "frontLevel01").setOrigin(0, 0).setScale(1).setDepth(2).setPipeline('Light2D');
        
        // Particules de Speed

        this.speedParticles = this.add.particles(this.player.x - 190, this.player.y,'speedParticles', {
            emitZone:{
                source : new Phaser.Geom.Rectangle(this.player.x - 260, this.player.y - 225, this.player.x + -50, this.player.y + 50),
                type: "random",
            },
            scale: {start: 1.1, end: 0.1},
            lifespan: 1000, // Durée de vie des particules en millisecondes
            speedX: 1000/*this.player.body.velocity.x + (Math.sign(this.player.body.velocity.x) * 50)*/, // Vitesse verticale des particules (vers le haut)
            quantity: 0.5, // Nombre de particules à émettre
            frequency: 125, // Fréquence d'émission en particules par seconde

        });
        this.speedParticles.stop(true);
        this.speedParticles.setDepth(0);
        this.speedParticles.startFollow(this.player);

    }

    //Creation de la map
    createMap() {
        const map = this.make.tilemap({ key: "level01" });
        map.addTilesetImage("placeholder", "tileset");
        return map;
    }

    //Creation des layers
    createLayers(map) {
        const tileset = map.getTileset("placeholder");
        const layer_plateformes = map.createLayer("Plateformes", tileset);
        layer_plateformes.setScale(0.25);
        layer_plateformes.setPipeline('Light2D');
        layer_plateformes.setAlpha(0);
        const spawn_end = map.getObjectLayer('Spawn_End');
        const skyglows = map.getObjectLayer('Skyglows');
        const kill = map.getObjectLayer('Kill');
        const checkpoints = map.getObjectLayer('Checkpoints_Zones');
        const checkpointsPoints = map.getObjectLayer('Checkpoints_Points');
        const fallingPlatforms = map.getObjectLayer('Falling_Plateformes');
        layer_plateformes.setCollisionByExclusion(-1, true);

        return { layer_plateformes, spawn_end, skyglows, kill, checkpoints, fallingPlatforms, checkpointsPoints };
    }

    createPlayer(playerPoints) {
        //Recréé le joueur dans la scène en lui passant des propriétés qu'il garde de scène en scène (liste heros, hero actuel, hp)
        const player = new Player(this, playerPoints.start.x/4, playerPoints.start.y/4, this.skyglow);
        player.setSize(250, 575).setOffset(375,610);
        return player;
    }

    createEnd(end){

        const endLevel = this.physics.add.sprite(end.x/4 + 32, end.y/4, 'none')
            .setOrigin(0,0)
            .setAlpha(0)
            .setSize(5, this.MAP_HEIGHT*2); 
        if(end.properties[0]){
            endLevel.nextZone = end.properties[0].value; 
        }
        return endLevel; 
    }

    endLevel(player, endPoint){ 

        player.scene.scene.start(endPoint.nextZone);  
     
        this.endOverlap.active = false; 
    }

    createSkyglow(objectSkyglow){

        const skyglows = new Phaser.GameObjects.Group; 

        objectSkyglow.objects.forEach(spawn => {
            let skyglow = null;

            switch(spawn.type) {
                case "Jump" :
                    skyglow = new JumpSkyglow(this,spawn.x/4, spawn.y/4);
                    break

                case "Speed" :
                    skyglow = new SpeedSkyglow(this,spawn.x/4, spawn.y/4); 
                    break

                case "Glide" :
                    break
            }

            skyglows.add(skyglow); 
            
        }); 

        return skyglows ; 

    }

    getSkyglow(player,skyglow){
        if (!skyglow.inInventory){
            player.listeSkyglow.push(skyglow);
            player.createFollowRoutine(skyglow);
            skyglow.putInventory();
        }
    }

    createKill(objectKill){

        const groupKill = new Phaser.GameObjects.Group; 

        objectKill.objects.forEach(kill => {
            const direction = kill.properties[0].value;

            switch(direction) {
                case "up" :
                    const leKillUp = this.physics.add.sprite(kill.x/4 + 17, kill.y/4 - 28, 'none');
                    leKillUp.setOrigin(0,0);
                    leKillUp.setAlpha(0);
                    leKillUp.setSize(192/4, 24);

                    groupKill.add(leKillUp);
                    break;

                case "down" :
                    const leKillDown = this.physics.add.sprite(kill.x/4 - 48, kill.y/4 - 4, 'none');
                    leKillDown.setOrigin(0,0);
                    leKillDown.setAlpha(0);
                    leKillDown.setSize(192/4, 24);

                    groupKill.add(leKillDown);
                    break;

                case "left" :
                    const leKillLeft = this.physics.add.sprite(kill.x/4 - 28, kill.y/4 - 48, 'none');
                    leKillLeft.setOrigin(0,0);
                    leKillLeft.setAlpha(0);
                    leKillLeft.setSize(24, 192/4);

                    groupKill.add(leKillLeft);
                    break;

                case "right" :
                    const leKillRight = this.physics.add.sprite(kill.x/4 - 68, kill.y/4 - 48, 'none');
                    leKillRight.setOrigin(0,0);
                    leKillRight.setAlpha(0);
                    leKillRight.setSize(24, 192/4);

                    groupKill.add(leKillRight);
                    break;
            }

        })

        return groupKill;

        //TODO GERER L'APPARITION DES ZONE DE KILL GRACE AU CALQUE OBJECT (EN GERANT LA ROTATION)

    }

    getPlayerPoints(layer) {
        const playerPoints = layer.objects;
        return {
            start : playerPoints[0],
            end : playerPoints[1]
        }
    }

    createCheckpoint(layer,points){

        const groupCheckpoint = new Phaser.GameObjects.Group; 

        layer.objects.forEach(checkpoint => {
            const cp = this.physics.add.sprite(checkpoint.x/4 + checkpoint.width/9, checkpoint.y/4 + checkpoint.height/9, 'none');
            cp.setOrigin(0,0);
            cp.setAlpha(0);
            cp.setSize(checkpoint.width/4, checkpoint.height/4);

            const pointValue = checkpoint.properties[0].value
            const coord = {x : 0, y : 0};

            points.objects.forEach(point => {
                if(point.id == pointValue){
                    coord.x = point.x; 
                    coord.y = point.y;
                }
            })

            cp.spawnPosition = coord;

            groupCheckpoint.add(cp); 
        })

        return groupCheckpoint; 
    }

    onCheckpointCollision(player, checkpoint){
        player.savePosition(checkpoint.spawnPosition);
    }

    gestionNuage(){

        // Nuage 1 back
        if(this.nuage1Back.x + this.nuage1Back.width < - 100){
            this.nuage1Back.x = this.MAP_WIDTH + this.nuage1Back.width;
        }
        // Nuage 2 back
        if(this.nuage1Back.x > this.MAP_WIDTH){
            this.nuage1Back.x = 0 - this.nuage1Back.width;
        }
        // Nuage 3 front
        if(this.nuage3Front.x > this.MAP_WIDTH){
            this.nuage3Front.x = 0 - this.nuage3Front.width;
        }
        // Nuage 3 front 2
        if(this.nuage3Front2.x + this.nuage3Front2.width < - 100){
            this.nuage3Front2.x = this.MAP_WIDTH + this.nuage3Front2.width;
        }
        // Nuage 2 front
        if(this.nuage2Front.x + this.nuage2Front.width < - 100){
            this.nuage2Front.x = this.MAP_WIDTH + this.nuage2Front.width;
        }
        // Nuage 2 front
        if(this.nuage1Front.x + this.nuage1Front.width < - 100){
            this.nuage1Front.x = this.MAP_WIDTH + this.nuage1Front.width;
        }

    }

    createFallingPlatforms(layer){

        const platforms = new Phaser.GameObjects.Group; 
        
        layer.objects.forEach(pltf => {
            let platform = new FallingPlatform(this, pltf.x/4 + 96, pltf.y/4 + 64);  
            platform.setScale(0.25);
            platforms.add(platform); 
            
        });
        
        return platforms; 
    }

    onFallingPlatform(player,platform){
        
        platform.setActive();

    }

    createVoid() {
        const vide = this.physics.add.sprite(0, this.MAP_HEIGHT - 32, 'none')
            .setOrigin(0, 0)
            .setAlpha(0)
            .setSize(this.MAP_WIDTH * 2, 50);
        return vide;
    }

    update() {
        
        this.gestionNuage();

    }

}

export default Level01;