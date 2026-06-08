class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_grassy_tiles", "grassy_tilemap.png");                         // Packed tilemap
        this.load.image("tilemap_farmy_tiles", "farm_tilemap.png");
        this.load.image("tilemap_background_tiles", "tilemap-backgrounds_packed.png");
        this.load.tilemapTiledJSON("platformer-level-design", "DraftLevelDesign3(a).tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("platformer-level2-design", "PlatformerLevelDesign.tmj");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_GrassySheet", "grassy_tilemap.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("tilemap_FarmSheet", "farm_tilemap.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("tilemap_BGSheet", "tilemap-backgrounds_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        //load jump sound effect
        this.load.audio('jumpSound', 'jingles_PIZZI09.ogg');
        //load death sound effect
        this.load.audio('deathSound', 'jingles_PIZZI11.ogg');
        //load coin pick up sound effect
        this.load.audio('coinSound', 'impactMetal_light_002.ogg');

        //load asset for font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 4,
                end: 5,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0004.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0005.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}