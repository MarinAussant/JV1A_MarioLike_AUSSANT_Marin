import Player from "../entities/Player.js";

class TestLevel extends Phaser.Scene {

    constructor(config) {
        super("TestLevel");
        this.config = config;
    }

    init(data) {
        this.skyglow = data.skyglow;
    }

    create() {

        this.SCREEN_WIDTH = this.config.width;
        this.SCREEN_HEIGHT = this.config.height;
        this.MAP_WIDTH = (50 * 256) / 4;
        this.MAP_HEIGHT = (25 * 256) / 4;
        this.zoom = this.config.zoomFactor;
        this.sceneName = this.add.systems.config;

        //this.physics.add.sprite(0,0, "bg").setOrigin(0).setScrollFactor(0).setDepth(-10); 

        this.add.image(0, 0, "back").setOrigin(0, 0).setScale(1.5);

        //Creation de la scene : map + layers
        const map = this.createMap();
        const layers = this.createLayers(map);
        const playerPoints = this.getPlayerPoints(layers.spawn_end);
        const endZone = this.createEnd(playerPoints.end); 
        const vide = this.createVoid();

        //Creation skyglows
        const skyglows = this.createSkyglow(layers.skyglows);

        //Creation joueur
        this.player = this.createPlayer(playerPoints);

        //Creation kill
        const kill = this.createKill(layers.kill);

        //Creation plateformes qui tombent
        const fallingPlatforms = this.createFallingPlatforms(layers.fallingPlatforms);

        //ajout colliders au joueur
        this.player.addCollider(layers.layer_plateformes);
        this.endOverlap = this.physics.add.overlap(this.player, endZone,this.endLevel, null, this); 
        this.player.addOverlap(vide, this.player.respawn);

        // Gestion des checkpoints
        const myCheckpoints = this.createCheckpoint(layers.checkpoints); 
        this.physics.add.overlap(this.player, myCheckpoints, this.onCheckpointCollision);

        this.physics.add.collider(this.player, this.fallingPlatforms, this.onFallingPlatform, null, this);

        //Limites monde et caméra
        this.cameras.main.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT - 48);
        this.cameras.main.setZoom(this.zoom);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.y = 100;

        this.physics.world.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);

        this.add.image(0, 0, "front").setOrigin(0, 0).setScale(0.25);

    }

    //Creation de la map
    createMap() {
        const map = this.make.tilemap({ key: "testLevelJson" });
        map.addTilesetImage("placeholder", "tileset");
        return map;
    }

    //Creation des layers
    createLayers(map) {
        const tileset = map.getTileset("placeholder");
        const layer_plateformes = map.createLayer("Plateformes", tileset);
        layer_plateformes.setScale(0.25);
        //layer_plateformes.setAlpha(0);
        const spawn_end = map.getObjectLayer('Spawn_End');
        const skyglows = map.getObjectLayer('Skyglows');
        const kill = map.getObjectLayer('Kill');
        const checkpoints = map.getObjectLayer('Checkpoints_Zones');
        const fallingPlatforms = map.getObjectLayer('Falling_Plateformes');
        layer_plateformes.setCollisionByExclusion(-1, true);

        return { layer_plateformes, spawn_end, skyglows, kill, checkpoints, fallingPlatforms };
    }

    createPlayer(playerPoints) {
        //Recréé le joueur dans la scène en lui passant des propriétés qu'il garde de scène en scène (liste heros, hero actuel, hp)
        //console.log(playerPoints.start.x,playerPoints.start.y);
        return new Player(this, playerPoints.start.x/4, playerPoints.start.y/4, this.skyglow).setSize(512, 1024);
    }

    createEnd(end){

        console.log(end);

        //TODO -> EVENTUELLEMENT MODIF POUR LA ZONE DE FIN DE NIVEAU

        const endLevel = this.physics.add.sprite(end.x, end.y, 'none')
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

        console.log(objectSkyglow);

        //TODO GERER L'APPARITION DES SKYGLOWS GRACE AU CALQUE OBJECT
        // S'INSPIRER DE LA FONCTION JUSTE EN DESSOUS V
    }

    
    createEnemies(layer, platformsLayer){
        const enemies = new Phaser.GameObjects.Group; 

        
        layer.objects.forEach(spawn => {
            let enemy = null; 
            if(spawn.type == "Tornado"){
                enemy = new Tornado(this,spawn.x, spawn.y, spawn.properties[0].value, spawn.properties[1].value );  
            }else if(spawn.type == "Cloud"){
                enemy = new TCloud(this,spawn.x, spawn.y);
                enemy.detectionBox.addOverlap(this.player, () => {enemy.setTarget(this.player), this});     
                enemy.attackBox.addOverlap(this.player, this.onPlayerCollision);     
            }else if(spawn.type == "StaticCloud"){
                enemy = new STCloud(this,spawn.x, spawn.y);    
                enemy.attackBox.addOverlap(this.player, this.onPlayerCollision);     
            }else if(spawn.type == "Caster"){
                enemy = new Caster(this,spawn.x, spawn.y, spawn.properties[0].value, spawn.properties[1].value, spawn.properties[2].value);     
            }else if(spawn.type == "Protected"){
                enemy = new ProtectedEnemy(this,spawn.x, spawn.y ,  spawn.properties[0].value, spawn.properties[1].value );    
            }  

            enemy.setPlatformColliders(platformsLayer); 
            enemies.add(enemy); 
            
        }); 

        return enemies ; 
    }
    

    createKill(objectKill){

        console.log(objectKill);

        //TODO GERER L'APPARITION DES ZONE DE KILL GRACE AU CALQUE OBJECT (EN GERANT LA ROTATION)

    }

    getPlayerPoints(layer) {
        const playerPoints = layer.objects;
        return {
            start : playerPoints[0],
            end : playerPoints[1]
        }
    }

    createCheckpoint(layer){

        console.log(layer);

        //TODO -> GERER LA TAILLE ET L'EMPLACEMENT DES CHECKPOINT GRACE
        //          AUX OBJETS ET TAILLE (SUREMENT EN LOADAND L'AUTRE CALQUE...)

        const groupCheckpoint = new Phaser.GameObjects.Group; 

        layer.objects.forEach(checkpoint => {
            const cp = this.physics.add.sprite(checkpoint.x, checkpoint.y, 'none')
            cp.setOrigin(0,0)
            cp.setAlpha(0)
            cp.setSize(5, 2000); 
           

            groupCheckpoint.add(cp); 
        })

        return groupCheckpoint; 
    }

    onCheckpointCollision(player, checkpoint){
        player.savePosition(checkpoint);
    }

    createFallingPlatforms(layer){

        console.log(layer);

        //TODO -> CREATION DES PLATEFORMES QUI TOMBENT S'INSPIRER DES PLATEFORMES MOVABLE

        const platforms = new Phaser.GameObjects.Group; 
        
        /*
        layer.objects.forEach(pltf => {
            let platform = new MovingPlatform(this, pltf.x, pltf.y, pltf.properties[0].value, pltf.properties[1].value, pltf.properties[2].value);  
            platforms.add(platform); 
            
        });
        */

        return platforms; 
    }

    onFallingPlatform(player,platform){

        console.log(platform);

        //TODO -> FAIRE EN SORTE QUE LA PLATEFORME TOMBE ECT...

    }

    createVoid() {
        const vide = this.physics.add.sprite(0, this.MAP_HEIGHT - 32, 'none')
            .setOrigin(0, 0)
            .setAlpha(0)
            .setSize(this.MAP_WIDTH * 2, 50);
        return vide;
    }

    update() {


    }

}

export default TestLevel;