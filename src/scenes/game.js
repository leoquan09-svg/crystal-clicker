import Phaser from "phaser";

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {
        this.load.image('crystal', 'Crystal-final.png');
        this.load.image('crystalf', 'Crystal-flas.png')
        this.load.image('shop', 'shop.png');
    }
    
    create() {
        
        //start
        this.cameras.main.fadeIn(700, 255, 255, 255);

        //vars for centering
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Create crystal
        this.crystal = this.add.sprite(centerX, centerY - 10, 'crystal').setOrigin(0.5);
        this.crystal.setInteractive();
        this.crystal.setScale(6.35);
        this.textures.get('crystal').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('crystalf').setFilter(Phaser.Textures.FilterMode.NEAREST);

        //shop
        this.shop = this.add.sprite(550, 460, 'shop').setOrigin(0.5).setInteractive().setScale(5);
        this.textures.get('shop').setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Score setup
        const savedScore = localStorage.getItem('crystalScore');
        this.score = savedScore ? parseInt(savedScore) : 0;
        this.scoreText = this.add.text(centerX, centerY - 215, `${this.score} crystals mined!`, {
            fontSize: '35px',
            fontFamily: 'readyp2',
            color: '#ffffff',
            padding: { top: 20, bottom: 20 }
        }).setOrigin(0.5);
        this.scoreText.setResolution(2);
        this.scoreText.setScale(1, 1.15);

        // Passive crystal gain on return
        const lastActiveTime = parseInt(localStorage.getItem('lastActiveTime')) || Date.now();
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastActiveTime) / 1000);

        // Calculate passive CPS
        const passiveMinerCPS = this.autoMiner?.rate && this.autoMiner?.cooldown
            ? this.autoMiner.rate * (1000 / this.autoMiner.cooldown)
            : 0;
        const passiveMineCPS = this.mine?.rate && this.mine?.cooldown
            ? this.mine.rate * (1000 / this.mine.cooldown)
            : 0;
        const passiveCPS = passiveMinerCPS + passiveMineCPS;

        // Add passive crystals
        const passiveCrystals = Math.floor(passiveCPS * elapsedSeconds);
        this.score += passiveCrystals;
        localStorage.setItem('crystalScore', this.score);
        this.scoreText.setText(`${this.score} crystals mined!`);

        //cps
        this.clicksThisSecond = 0;
        this.cpsText = this.add.text(centerX, centerY - 150, `CPS: 0`, {
            fontSize: '23px',
            fontFamily: 'readyp2',
            color: '#ffffff',
            padding: { top: 20, bottom: 20 }
        }).setOrigin(0.5);

        const calculateCPS = () => {
            const minerCPS = this.autoMiner.level > 0 ? this.autoMiner.rate * (1000 / this.autoMiner.cooldown) : 0;
            const mineCPS = this.mine.level > 0 ? this.mine.rate * (1000 / this.mine.cooldown) : 0;
            const clicks = this.clicksThisSecond;
            return (minerCPS + mineCPS + clicks).toFixed(2);
        }

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callbackScope: this,
            callback: () => {
                const cps = calculateCPS();
                this.clicksThisSecond = 0
                this.cpsText.setText(`CPS: ${cps}`);
            },
        });

        // Auto miner setup
        const savedMinerLevel = localStorage.getItem('autoMinerLevel');
        const savedMinerRate = localStorage.getItem('autoMinerRate');
        const savedMinerCooldown = localStorage.getItem('autoMinerCooldown');

        this.autoMiner = {
            level: savedMinerLevel ? parseInt(savedMinerLevel) : 0,
            rate: savedMinerRate ? parseFloat(savedMinerRate) : 1, 
            cooldown: savedMinerCooldown ? parseInt(savedMinerCooldown) : 1000
        };

        this.time.addEvent({
            delay: this.autoMiner.cooldown,
            loop: true,
            callback: () => {
            if (this.autoMiner.level > 0) {
                this.score += Math.floor(this.autoMiner.rate);
                this.scoreText.setText(`${this.score} crystals mined!`);
                localStorage.setItem('crystalScore', this.score);
            }
        }   
        });

        // mine setup
        const savedMineLevel = localStorage.getItem('MineLevel');
        const savedMineRate = localStorage.getItem('MineRate');
        const savedMineCooldown = localStorage.getItem('MineCooldown');

        this.mine = {
            level: savedMineLevel ? parseInt(savedMineLevel) : 0,
            rate: savedMineRate ? parseFloat(savedMineRate) : 1, 
            cooldown: savedMineCooldown ? parseInt(savedMineCooldown) : 1000
        };

        this.time.addEvent({
            delay: this.mine.cooldown,
            loop: true,
            callback: () => {
            if (this.mine.level > 0) {
                this.score += Math.floor(this.mine.rate);
                this.scoreText.setText(`${this.score} crystals mined!`);
                localStorage.setItem('crystalScore', this.score);
            }
        }   
        });

        // Register click event
            this.crystal.on('pointerdown', () => {

            //change score
            this.score += 1;
            this.clicksThisSecond += 1;
            this.scoreText.setText(`${this.score} crystals mined!`);
            localStorage.setItem('crystalScore', this.score);
            console.log('Click registered');

            //animations on click
            this.crystal.setTexture('crystalf');
            this.crystal.setScale(4.5);
            this.time.delayedCall(40, () => {
                this.crystal.setTexture('crystal');
                this.crystal.setScale(5);
            });
        });

        //shop event
        this.shop.on('pointerdown', () => {
            localStorage.setItem('lastActiveTime', Date.now());
            this.cameras.main.fadeOut(500, 135, 206, 250);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('shop');
        });
        });

    }
}
