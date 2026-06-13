class StartScreen extends Phaser.Scene{
    constructor(){
        super("startScreen");
        this.my = {sprite: {}, text: {}};
    }

    preload(){
        //assets already preloaded in Load.js
    }

    create(){
        let my = this.my;
        let {width, height} = this.scale;

        my.text.title = this.add.bitmapText(width/2, height/2, "rocketSquare", "Alien Meets World!").setOrigin(0.5).setScale(3);
        my.sprite.alien = this.add.sprite(width/2, height/2 - 120, "platformer_characters", "tile_0004.png").setScale(6);

        this.start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        my.text.restartPrompt = this.add.bitmapText(width/2, height/2 + 80, "rocketSquare", "Press SPACE to Start!").setOrigin(0.5);
        this.cameras.main.setBackgroundColor('#87CEEB');

        //background music
        this.bgMusic = this.sound.add('backgroundMusic', {volume: 0.5, loop: true});
        this.bgMusic.play();
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.start)){
            this.scene.start("menuScreen");
        }
    }
}
