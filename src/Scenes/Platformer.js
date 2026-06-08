//platformer3(b)
class Platformer extends Phaser.Scene{
    constructor(){
        super("platformerScene");
    }

    init(){
        this.ACCELERATION = 200;
        this.DRAG = 950;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -480;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    create(){
        this.map = this.add.tilemap("platformer-level-design", 18, 18, 120, 25);

        //add tilesets to the map
        this.tilesetGrassy = this.map.addTilesetImage("grassy_tilemap", "tilemap_grassy_tiles");
        this.tilesetFarmy = this.map.addTilesetImage("farm_tilemap", "tilemap_farmy_tiles");
        this.tilesetBG = this.map.addTilesetImage("background_tilemap", "tilemap_background_tiles");

        //create a layer
        const BGLayer = this.map.createLayer("Background", this.tilesetBG, 0, 0).setScrollFactor(0.75);
        //layer below uses multiple tilemaps
        this.groundLayer = this.map.createLayer("Platforms-n-Stuff", [this.tilesetGrassy, this.tilesetFarmy], 0, 0);
        this.detailsLayer = this.map.createLayer("Details", [this.tilesetGrassy, this.tilesetFarmy], 0, 0);
    

        //make platformer layer collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        })
       

        //create spawn
        this.spawn = this.map.createFromObjects("Objects", {
            name: "spawn",
            key: "tilemap_GrassySheet",
            frame: 124 //ID for spawn sprite
        })[0];

        //create coins
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_GrassySheet",
            frame: 151 //ID for the key sprite
        })

        //create coin animation
        this.anims.create({
            key:'coinAnimation',
            frames: this.anims.generateFrameNumbers('tilemap_GrassySheet', {
                start: 151,
                end: 152
            }),
            frameRate: 1,
            repeat: -1
        });
        this.coins.forEach(coin => coin.play('coinAnimation'));

        //create flag
        this.flag = this.map.createFromObjects("Objects", {
            name: "flag",
            key: "tilemap_GrassySheet",
            frame: 111 //ID for the flag sprite
        })

        //flag animation
        this.anims.create({
            key: 'flagAnimation',
            frames: this.anims.generateFrameNumbers('tilemap_GrassySheet', {
                start: 111,
                end: 112
            }),
            frameRate: 1,
            repeat: -1
        });
        this.flag.forEach(flag => flag.play('flagAnimation'));

        //create carrots
        this.carrot = this.map.createFromObjects("Objects", {
            name: "carrot",
            key: "tilemap_FarmSheet",
            frame: 56 //ID for the flag sprite
        })

        //carrot animation
        this.anims.create({
            key: 'carrotAnimation',
            frames: this.anims.generateFrameNumbers('tilemap_FarmSheet', {
                frames: [56, 72]
            }),
            frameRate: 1,
            repeat: -1
        });
        this.carrot.forEach(carrot => carrot.play('carrotAnimation'));

        //create halfcarrots
        this.halfCarrot = this.map.createFromObjects("Objects", {
            name: "halfCarrot",
            key: "tilemap_FarmSheet",
            frame: 56 //ID for the flag sprite
        })

        //halfcarrot animation
        this.anims.create({
            key: 'halfCarrotAnimation',
            frames: this.anims.generateFrameNumbers('tilemap_FarmSheet', {
                frames: [72, 56]
            }),
            frameRate: 1,
            repeat: -1
        });
        this.halfCarrot.forEach(halfCarrot => halfCarrot.play('halfCarrotAnimation'));

        //create carrotWs
        this.carrotW = this.map.createFromObjects("Objects", {
            name: "carrotW",
            key: "tilemap_FarmSheet",
            frame: 42 //ID for the flag sprite
        })

        //carrotW animation
        this.anims.create({
            key: 'carrotWAnimation',
            frames: this.anims.generateFrameNumbers('tilemap_FarmSheet', {
                start: 42,
                end: 43
            }),
            frameRate: 1,
            repeat: -1
        });
        this.carrotW.forEach(carrotW => carrotW.play('carrotWAnimation'));

        //create halfcarrotsW
        this.halfCarrotW = this.map.createFromObjects("Objects", {
            name: "halfCarrotW",
            key: "tilemap_FarmSheet",
            frame: 43 //ID for the flag sprite
        })

        //halfcarrotW animation
        this.anims.create({
            key: 'halfCarrotWAnimation',
            frames: this.anims.generateFrameNumbers('tilemap_FarmSheet', {
                frames: [43, 42]
            }),
            frameRate: 1,
            repeat: -1
        });
        this.halfCarrotW.forEach(halfCarrotW => halfCarrotW.play('halfCarrotWAnimation'));

        

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.flag, Phaser.Physics.Arcade.STATIC_BODY);
        this.flagGroup = this.add.group(this.flag);

        //coin group used for collision detection
        this.coinGroup = this.add.group(this.coins);

        //movement VFX
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles",{
            frame: ['star_07.png', 'star_08.png'],
            scale: {start: 0.01, end: 0.1},
            lifespan: 300,
            alpha: {start: 1, end: 0.1},
            quantity: 1,
        });
        my.vfx.walking.stop();

        
        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['magic_03.png', 'magic_04'],
            scale: {start: 0.08, end: 0.01},
            lifespan: 200,
            quantity: 1
        })
        my.vfx.jumping.stop();

        my.vfx.explode = this.add.particles(0, 0, "kenny-particles", {
            frame: 'muzzle_04.png',
            scale: {start: 0.03, end: 0.3},
            lifespan: 350,
            alpha: {start: 1, end: 0.1},
        });
        my.vfx.explode.stop();

        //create jumping sound effect
        this.jumpSound = this.sound.add('jumpSound', {volume: 1});
        //create death sound effect
        this.deathSound = this.sound.add('deathSound', {volume: 1});
        //create coin pick up sound effect
        this.coinSound = this.sound.add('coinSound', {volume: 1});

        //set up player avatar
        my.sprite.player = this.physics.add.sprite(this.spawn.x, this.spawn.y, "platformer_characters", "tile_0004.png");
        console.log("spawn:", this.spawn);
        console.log("player x/y:", my.sprite.player.x, my.sprite.player.y);
        //bounds for the map so that the player doesn't go out of bounds
        this.physics.world.setBounds(0, 0,this.map.widthInPixels, this.map.heightInPixels);
        my.sprite.player.setCollideWorldBounds(true);

        //collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //coin collision handler (when the player touches it)
        this.registry.set('score', 0);
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.coinSound.play();
            obj2.destroy();
            let score = this.registry.get('score') + 5;
            this.registry.set('score', score);
        }); 

        //flag collision handler (player reaches the endpoint)
        this.physics.add.overlap(my.sprite.player, this.flagGroup, () => {
            let score = this.registry.get('score');
            this.scene.start("endScreen");
        });

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');


        //camera stuff
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        //^makes it so that the camera sticks to the player more (moves right when the player moves)
        this.cameras.main.setDeadzone(50, 100);
        this.cameras.main.setZoom(this.SCALE);

        //use physics.add.overlap
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

        document.getElementById('description').innerHTML = '<h2>SeasonalRun!</h2><br>Right Cursor: move forward, Left Cursor: move back, Up Cursor: jump';
    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
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