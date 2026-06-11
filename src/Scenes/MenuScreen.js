class MenuScreen extends Phaser.Scene{
    constructor(){
        super("menuScreen");
        this.my = {sprite: {}, text: {}};
    }

    preload(){
        //assets already preloaded in Load.js
    }

    create(){
        let my = this.my;
        let {width, height} = this.scale;

        //create sprites
        my.text.levelSelect = this.add.bitmapText(width/2, height/2 - 120, "rocketSquare", "Level Select").setOrigin(0.5).setScale(2);
        my.sprite.alien = this.add.sprite(width/2, height/2, "platformer_characters", "tile_0004.png").setScale(6);
        my.sprite.butterfly1 = this.add.sprite(width/2 - 150, height/2, "platformer_characters", "tile_0013.png").setScale(7);
        my.sprite.butterfly2 = this.add.sprite(width/2 + 150, height/2, "platformer_characters", "tile_0013.png").setScale(7);
        my.text.level1 = this.add.bitmapText(width/2 - 170, height/2 + 95, "rocketSquare", "1").setScale(2);
        my.text.level2 = this.add.bitmapText(width/2 + 125, height/2 + 95, "rocketSquare", "2").setScale(2);

        //make interactable butterfly sprites that correlate to a level upon selection
        my.sprite.butterfly1.setInteractive();
        my.sprite.butterfly1.on('pointerdown', () => {
            this.scene.start("platformerScene");
        });

        my.sprite.butterfly2.setInteractive();
        my.sprite.butterfly2.on('pointerdown', () => {
            this.scene.start("platformerTwoScene");
        })

        //add tweens for the butterfly sprites
        //pulsing tween for butterfly1
        this.tweens.add({
            targets: my.sprite.butterfly1,
            scaleX: 8,
            scaleY: 8,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        //pulsing tween for butterfly2
        this.tweens.add({
            targets: my.sprite.butterfly2,
            scaleX: 8,
            scaleY: 8,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

    }

    update(){
        //
    }
}