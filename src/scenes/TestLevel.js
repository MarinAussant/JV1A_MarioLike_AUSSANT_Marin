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
        this.MAP_WIDTH = 6450 / 2;
        this.MAP_HEIGHT = 3225 / 2;
        this.zoom = this.config.zoomFactor;
        this.sceneName = this.add.systems.config;

        //this.physics.add.sprite(0,0, "bg").setOrigin(0).setScrollFactor(0).setDepth(-10); 

        this.add.image(0, 0, "back").setOrigin(0, 0).setScale(1.5);

        //Creation de la scene : map + layers
        const map = this.createMap();
        this.layers = this.createLayers(map);
        const playerPoints = this.getPlayerPoints(this.layers.playerSpawn);
        const vide = this.createVoid();


        //Creation joueur
        this.player = this.createPlayer(playerPoints);

        //ajout colliders au joueur
        this.player.addCollider(this.layers.layer_plateformes);
        this.player.addOverlap(vide, this.player.respawn);

        //Limites monde et caméra
        this.cameras.main.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT - 48);
        this.cameras.main.setZoom(this.zoom);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.y = 100;

        this.physics.world.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);

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
        const playerSpawn = map.getObjectLayer('PlayerSpawn');
        layer_plateformes.setCollisionByExclusion(-1, true);

        return { layer_plateformes, playerSpawn };
    }

    createPlayer(playerPoints) {
        //Recréé le joueur dans la scène en lui passant des propriétés qu'il garde de scène en scène (liste heros, hero actuel, hp)
        console.log(playerPoints.start.x,playerPoints.start.y);
        return new Player(this, playerPoints.start.x/4, playerPoints.start.y/4, this.skyglow).setSize(512, 1024);
    }

    createSkyglow(skyglow){
        console.log(skyglow);
        this.physics.add.collider(skyglow, this.layers.layer_plateformes);
    }

    getPlayerPoints(layer) {
        const playerPoints = layer.objects;
        return {
            start: playerPoints[0]
        }
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