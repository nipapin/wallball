class World {
    constructor() {
        this.balls = [];
        this.blocks = [];
        this.trajectory = undefined;
        this.cols = 7;
        this.blocksCount = 15;
        this.ballSize = 8;
        this.ballTexture = undefined;
        this.blockSize = undefined;
        this.padding = 10;
        this.floor = height - 100;
        this.level = null;
        this.gameboard = [];
        this.modificators = ["Молния", "Огонь +", 'Огонь X', 'Молния Линия'];
        this.pickModificatorShown = false;
    }

    initEmptyGrid() {
        this.blocks = [];
        this.gameboard = Array(this.cols).fill().map((_, x) => Array(this.cols).fill().map((__, y) => ({ x, y }))).flat();
    }

    generateRandomGrid() {
        this.blockSize = (width - world.padding * 2) / world.cols;
        this.hitsToNextModificator = this.hitsToNextModificator ?? this.level.blocksPerWave;
        for (let i = 0; i < this.level.blocksPerWave; i++) {
            const randomBlock = random(this.gameboard);
            const { x, y } = randomBlock;
            this.gameboard.splice(this.gameboard.indexOf(randomBlock), 1);
            this.blocks.push(new Block(x, y, this.blockSize))
        }
    }

    returnGoodSpot(block) {
        this.gameboard.push({ x: block.x, y: block.y });
    }

    createBoss() {
        this.blocks = [];
        let x = 3;
        let y = 1;
        const bossBlock = new Block(x, y, this.blockSize * this.level.boss.size);
        bossBlock.health = this.level.boss.health;
        this.blocks.push(bossBlock)
    }


    gameOver() {
        this.level = null;
        gameOverScreen.style.display = 'flex';
        gameOverScreen.style.pointerEvents = 'auto';
    }

    countHits() {
        this.hitsToNextModificator = this.hitsToNextModificator - 1;
    }

    pickRandomSpot() {
        const initGrid = Array(this.cols).fill().map((_, x) => Array(this.cols).fill().map((__, y) => ({ x, y }))).flat();
        return random(initGrid);
    }

    checkAllBallsStopped() {
        const allBallsStopped = this.balls.every(ball => ball.stopped);

        if (allBallsStopped && !this.pickModificatorShown && this.hitsToNextModificator < 1) {
            this.pickModificatorShown = true;
            this.showModificatorWindow();
        }
    }


    showModificatorWindow() {
        noLoop(); // Останавливаем игру
        pickModificator.style.display = 'flex';

        let option_1 = random(this.balls[0].availableModificators);
        this.balls[0].availableModificators.splice(this.balls[0].availableModificators.indexOf(option_1), 1);

        let option_2 = random(this.balls[0].availableModificators);
        const buttons = [...pickModificator.querySelectorAll('button')];
        buttons[0].innerText = option_1;
        buttons[1].innerText = option_2;

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.balls[0].addModificator(button.innerText);
                this.hitsToNextModificator = this.level.blocksPerWave;
                pickModificator.style.display = 'none';
                this.pickModificatorShown = false; // Сбрасываем флаг
                loop(); // Возобновляем игру
            });
        });
    }

}