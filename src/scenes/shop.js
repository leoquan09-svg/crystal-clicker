import Phaser from "phaser";
import Game from "/src/scenes/game";

export default class game extends Phaser.Scene {
    constructor() {
        super('shop');
    }

    create() {
        //start
        this.cameras.main.fadeIn(700, 255, 255, 255);

        //score data
        const savedScore = localStorage.getItem('crystalScore');
        let score = savedScore ? parseInt(savedScore) : 0;

        //miner data
        const savedMinerLevel = localStorage.getItem('autoMinerLevel') || 0;
        const savedMinerRate = localStorage.getItem('autoMinerRate') || 1;
        const savedMinerCooldown = localStorage.getItem('autoMinerCooldown') || 1000;

        const minerLevel = parseInt(savedMinerLevel);
        const minerBaseCost = 50;
        const minerGrowthRate = 1.3;
        const minerCost = Math.floor(minerBaseCost * Math.pow(minerGrowthRate, minerLevel));

        //mine data
        const savedMineLevel = localStorage.getItem('MineLevel') || 0;
        const savedMineRate = localStorage.getItem('MineRate') || 1;
        const savedMineCooldown = localStorage.getItem('MineCooldown') || 1000;

        const mineLevel = parseInt(savedMineLevel);
        const mineBaseCost = 50000;
        const mineGrowthRate = 1.63;
        const mineCost = Math.floor(mineBaseCost * Math.pow(mineGrowthRate, mineLevel));
        
        // Display crystals
        this.add.text(400, 40, `Crystals: ${score}`, { fontSize: '40px' }).setOrigin(0.5);

        //Miner upgrade button
        this.add.text(100, 130, `Upgrade Auto Miner for ${minerCost} crystals`, { fontSize: '24px' }).setInteractive().on('pointerdown', () => {
            if (score >= minerCost) {
            score -= minerCost;
            const newLevel = minerLevel + 1;
            const newRate = parseFloat(savedMinerRate) + (minerLevel * 0.15);
            const newCooldown = Math.max(300, parseInt(savedMinerCooldown) - 100);

            localStorage.setItem('crystalScore', score);
            localStorage.setItem('autoMinerLevel', newLevel);
            localStorage.setItem('autoMinerRate', newRate);
            localStorage.setItem('autoMinerCooldown', newCooldown);

            this.scene.restart(); // refresh shop
            }
        });

        //Mine upgrade button
        this.add.text(100, 250, `Upgrade Crystal Mine for ${mineCost} crystals`, { fontSize: '24px' }).setInteractive().on('pointerdown', () => {
            if (score >= mineCost) {
            score -= mineCost;
            const newLevel2 = mineLevel + 1;
            const newRate2 = parseFloat(savedMineRate) + (mineLevel * 0.4);
            const newCooldown2 = Math.max(300, parseInt(savedMineCooldown) - 100);

            localStorage.setItem('crystalScore', score);
            localStorage.setItem('MineLevel', newLevel2);
            localStorage.setItem('MineRate', newRate2);
            localStorage.setItem('MineCooldown', newCooldown2);

            this.scene.restart(); // refresh shop
            }
        });

        this.add.text(50, 50, '<---').setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.cameras.main.fade(500, 135, 206, 250);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('game');
        });
        });
    }
}