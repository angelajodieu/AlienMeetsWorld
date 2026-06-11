//platformer addition to final
class Platformer2 extends Phaser.Scene{
    constructor(){
        super("platformerTwoScene");
    }
    
    init(){
        this.ACCELERATION = 200;
        this.DRAG = 950;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -480;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 4.0;
    }

    create(){
        //-create the map-
        this.map = this.add.tilemap("platformer-level2-design", 18, 18, 120, 60);

        //-add tilesets-
        this.tilesetGrassy = this.map.addTilesetImage("grassy_tilemap", "tilemap_grassy_tiles");
        this.tilesetFarmy = this.map.addTilesetImage("farm_tilemap", "tilemap_farmy_tiles");
        this.tilesetBG = this.map.addTilesetImage("background_tilemap", "tilemap_background_tiles");

        //-create layers-
        const BGLayer = this.map.createLayer("Background", this.tilesetBG, 0, 0).setScrollFactor(0.75); //paralax background
        this.groundLayer = this.map.createLayer("Platforms-n-Stuff", [this.tilesetGrassy, this.tilesetFarmy], 0, 0); //platforms
        this.detailsLayer = this.map.createLayer("Details", [this.tilesetGrassy, this.tilesetFarmy], 0, 0); //details

        //-set up ground properties-
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        //-create spawn-
        this.spawn = this.map.createFromObjects("Objects", {
            name: "spawn",
            key: "tilemap_GrassySheet",
            frame: 124 //ID for spawn sprite
        })[0];

        //-set up player avatar-
        my.sprite.player = this.physics.add.sprite(this.spawn.x, this.spawn.y, "platformer_characters", "tile_0004.png");
        my.sprite.player.body.setSize(13, 17);//make a hitbox for the player
        my.sprite.player.body.setOffset(2, 7);
        
        //set up map bounds
        this.physics.world.setBounds(0, 0,this.map.widthInPixels, this.map.heightInPixels);
        my.sprite.player.setCollideWorldBounds(true);

        //-object creation-
        //create coin objects
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_GrassySheet",
            frame: 151 //ID for the key sprite
        });
        this.coinGroup = this.add.group(this.coins);
        //create flag checkpoint objects
        this.flag = this.map.createFromObjects("Objects", {
            name: "flag",
            key: "tilemap_GrassySheet",
            frame: 111 //ID for the flag sprite
        });
        this.flagGroup = this.add.group(this.flag);
        //create door end point object
        this.door = this.map.createFromObjects("Objects", {
            name: "door",
            key: "tilemap_GrassySheet",
            frame: 61
        });
        //create button object
        this.button = this.map.createFromObjects("Objects", {
            name: "button",
            key: "tilemap_GrassySheet",
            frame: 148
        });
        //create key objects
        this.key = this.map.createFromObjects("Objects", {
            name: "key",
            key: "tilemap_GrassySheet",
            frame: 27
        });

        //-vfx stuff-
        //vfx for horizontal movement (walking)
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles",{
            frame: ['star_07.png', 'star_08.png'],
            scale: {start: 0.01, end: 0.1},
            lifespan: 300,
            alpha: {start: 1, end: 0.1},
            quantity: 1,
        });
        my.vfx.walking.stop();
        //vfx for vertical movement (jumping)
        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['magic_03.png', 'magic_04'],
            scale: {start: 0.08, end: 0.01},
            lifespan: 200,
            quantity: 1
        })
        my.vfx.jumping.stop();
        //vfx for water death
        my.vfx.explode = this.add.particles(0, 0, "kenny-particles", {
            frame: 'muzzle_04.png',
            scale: {start: 0.03, end: 0.3},
            lifespan: 350,
            alpha: {start: 1, end: 0.1},
        });
        my.vfx.explode.stop();
        //TO DO: ADD A VFX FOR COIN COLLECTION
        //TO DO: ADD A VFX FOR GETTING TO A CHECKPOINT (FIREWORK)

        //-sound effects-
        //coin collection sound effect
        this.coinSound = this.sound.add('coinSound', {volume: 1});
        //jumping sound effect
        this.jumpSound = this.sound.add('jumpSound', {volume: 1});
        //death sound effect
        this.deathSound = this.sound.add('deathSound', {volume: 1});
        //TO DO: ADD A INTERACTABLE ITEM (BUTTON AND KEY) SOUND EFFECT
        //TO DO: ADD A REACHED CHECKPOINT SOUND EFFECT
        this.bgMusic = this.sound.add('backgroundMusic', {volume: 0.5, loop: true});
        this.bgMusic.play();

        //-collision + physics handling-
        //player and ground collision (so that the platforms are walkable)
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        //player and coin collision (coin collection)
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.registry.set('score', 0);
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.coinSound.play();
            obj2.destroy();
            let score = this.registry.get('score') + 5;
            this.registry.set('score', score);
        });
        //player and flag collision (player reaches checkpoint)
        this.physics.world.enable(this.flag, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.add.overlap(my.sprite.player, this.flagGroup, () => {
            //TO DO: IMPLEMENT A CHECKPOINT THING HERE
            //like make it so that the character respawns here instead and plays the checkpoint sound
        });
        //player and door collision (end level indicator)
        this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.add.overlap(my.sprite.player, this.door, () => {
            let score = this.registry.get('score');
            this.scene.start("endScreen");
        });
        //TO DO: MAKE A SYSTEM WHERE IF YOU PUSH THE BUTTON, IT STAYS DOWN AND THE WATERFALLS DISAPPEAR
        //TO DO: MAKE A SYSTEM WHERE YOU COLLECT THE KEYS, AND IF YOU GET BOTH IT GETS RID OF THE LOCKS
        //TO DO: MAKE A SYSTEM WHERE IF THE PLAYER GETS HIT BY THE ENEMY'S PARITCLES, THEY DIE
        //player and water collision (player drowns)
        this.physics.add.overlap(my.sprite.player, this.groundLayer, (obj1, obj2) => {
            let water = obj2.properties?.water == true;
            if (water){//make sure you make the explode elsewhere
                console.log('hit water');//check if it hits the water
                my.sprite.player.body.enable = false; //so that it doesn't repeatedly check for collision
                this.deathSound.play();
                my.vfx.explode.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2-5, false);
                my.vfx.explode.setParticleSpeed(0,0);
                my.vfx.explode.start();
                setTimeout(() =>{
                    setTimeout(() => {
                        my.vfx.explode.stop();
                        my.sprite.player.setPosition(this.spawn.x, this.spawn.y);
                        my.sprite.player.body.setVelocity(0, 0);
                        my.sprite.player.body.enable = true;//make it collisionable again
                    }, 500);
                })
            }
        });

        //-camera-
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 1);
        this.cameras.main.setDeadzone(50, 100);
        this.cameras.main.setZoom(2);

        //-taking cursor input-
        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');
    }

    update() {
        //-walking left-
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } 
        //-walking right-
        else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        }
        //-idle- 
        else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        //-jumping-
        //TO DO: MAKE IT SO THAT THE PLAYER CAN TRIPLE JUMP (UNLOCKED IN THE ENEMY SECTION)
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jumping.start();
        } else{
            my.vfx.jumping.stop();
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.jumpSound.play();
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}