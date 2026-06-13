class CreditsScene extends Phaser.Scene{
    constructor(){
        super("creditsScene");
        this.my = {sprite: {}, text: {}};
    }

    preload(){
        //assets already preloaded in Load.js
    }

    create(){
        let my = this.my;
        let {width, height} = this.scale;
        let spacing = 40;
        let firstLine = height/2 - 60;

        my.sprite.alien = this.add.sprite(width/2, firstLine - 100, "platformer_characters", "tile_0004.png").setScale(6);
        my.text.credits1 = this.add.bitmapText(width/2, firstLine, "rocketSquare", "Lead Programming Developer: Angela Jodie Untalan").setOrigin(0.5);
        my.text.credits2 = this.add.bitmapText(width/2, firstLine + spacing, "rocketSquare", "Lead Game Designer: Angela Jodie Untalan").setOrigin(0.5);
        my.text.credits3 = this.add.bitmapText(width/2, firstLine + (spacing*2), "rocketSquare", "Art and Audio Assets: Kenney").setOrigin(0.5);
        my.text.credits4 = this.add.bitmapText(width/2, firstLine + (spacing*3), "rocketSquare", "Background Music: Pixabay").setOrigin(0.5);

        this.restart = this.input.keyboard.addKey("R");
        my.text.restartPrompt = this.add.bitmapText(width/2, firstLine + (spacing*4), "rocketSquare", "Press R to Play Again!").setOrigin(0.5);
        this.cameras.main.setBackgroundColor('#87CEEB');
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.restart)){
            this.scene.start("menuScreen");
        }
    }
}