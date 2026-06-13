class EndScreen extends Phaser.Scene{
    constructor(){
        super("endScreen");
        this.my = {sprite: {}, text: {}};
    }

    preload(){
        //assets already preloaded in Load.js
    }

    create(){
        let my = this.my;
        let {width, height} = this.scale;
        let finalScore = this.registry.get('score');
        my.text.score = this.add.bitmapText(width/2, height/2, "rocketSquare", "Score: " + finalScore).setOrigin(0.5);// og placement is 290, 200
        my.sprite.alien = this.add.sprite(width/2, height/2 - 120, "platformer_characters", "tile_0004.png").setScale(6);

        this.restart = this.input.keyboard.addKey("R");
        my.text.restartPrompt = this.add.bitmapText(width/2, height/2 + 80, "rocketSquare", "Press R to Play Again!").setOrigin(0.5);

        this.credits = this.input.keyboard.addKey("C");
        my.text.creditsPrompt = this.add.bitmapText(width/2, height/2 + 150, "rocketSquare", "Press C to See Credits!").setOrigin(0.5);
        this.cameras.main.setBackgroundColor('#87CEEB');
        document.getElementById('description').innerHTML = '<h2>EndScreen.js</h2><br>R: restart';
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.restart)){
            this.scene.start("menuScreen");
        }
        if(Phaser.Input.Keyboard.JustDown(this.credits)){
            this.scene.start("creditsScene");
        }
    }
}