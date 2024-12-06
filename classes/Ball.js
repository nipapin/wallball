class Ball {
    constructor(x, y, r, powers) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.speedX = 0;
        this.speedY = 0;
        this.blocks = [];
        this.stopped = true;
        this.acceleration = 1;
        this.twinchance = 0.5;
        this.dieOnEnd = false;
        this.damage = 10;
        this.speed = 5;
        this.isTwin = false;
        this.powers = powers || {};
        this.modificators = [];
        this.hitCount = 2;
        this.visuals = [];
    }

    show() {
        // fill(255);
        // noStroke();
        // circle(this.x, this.y, this.r * 2);
        this.isTwin ? image(world.ballTexture, this.x - 25, this.y - 25, this.r * 12.5, this.r * 12.5) : image(world.ballTexture, this.x - 50, this.y - 50, this.r * 12.5, this.r * 12.5);
    }

    position(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    shoot() {
        if (this.stopped) {
            this.speedX = this.speed;
            this.speedY = this.speed;
            this.stopped = false;
        }
    }

    borders() {
        if (this.x < this.r || this.x > width - this.r) {
            this.playSound()
            this.speedX *= -this.acceleration;
        }
        if (this.y < this.r) {
            this.setGhost(false);
            this.playSound()
            this.speedY *= -this.acceleration;
        }

        if (this.y > world.floor - this.r) {
            this.reset();
        } else {
            if (this.x < this.r) this.x = this.r;
            if (this.x > width - this.r) this.x = width - this.r;
        }
    }

    spawnTwin() {
        let twin = new Ball(this.x, this.y, this.r / 2, this.powers);
        twin.acceleration = this.acceleration;
        twin.speedX = this.speedX * random([-1, 1]);
        twin.speedY = this.speedY * random([-1, 1]);
        twin.damage = this.damage / 2;
        twin.twinchance = this.twinchance / 2;
        twin.dieOnEnd = true;
        twin.isTwin = true;
        twin.modificators = this.modificators;
        world.balls.push(twin);
    }

    checkHit(block) {
        const blockLeft = block.position.x - block.w / 2;
        const blockRight = block.position.x + block.w / 2;
        const blockTop = block.position.y - block.w / 2;
        const blockBottom = block.position.y + block.w / 2;

        // Границы шара
        const ballLeft = this.x - this.r;
        const ballRight = this.x + this.r;
        const ballTop = this.y - this.r;
        const ballBottom = this.y + this.r;

        return ballRight > blockLeft &&
            ballLeft < blockRight &&
            ballBottom > blockTop &&
            ballTop < blockBottom
    }

    collide() {
        if (this.powers.ghost) return;
        for (let i = world.blocks.length - 1; i >= 0; i--) {
            const block = world.blocks[i];

            // Границы блока
            const blockLeft = block.position.x - block.w / 2;
            const blockRight = block.position.x + block.w / 2;
            const blockTop = block.position.y - block.w / 2;
            const blockBottom = block.position.y + block.w / 2;

            // Границы шара
            const ballLeft = this.x - this.r;
            const ballRight = this.x + this.r;
            const ballTop = this.y - this.r;
            const ballBottom = this.y + this.r;

            // Проверка на пересечение
            if (this.checkHit(block)) {
                // Определение стороны столкновения
                const overlapX = Math.min(ballRight - blockLeft, blockRight - ballLeft);
                const overlapY = Math.min(ballBottom - blockTop, blockBottom - ballTop);

                if (this.isTwin) {
                    this.hitCount -= 1;
                    if (this.hitCount === 0) {
                        world.balls.splice(world.balls.indexOf(this), 1);
                    }
                }

                if (random() < this.twinchance) {
                    this.spawnTwin();
                }

                // Обработка столкновения
                block.health -= this.damage;

                this.useModificator(block);
                console.log(world.hitsToNextModificator);
                if (block.health <= 1) {
                    world.blocks.splice(i, 1);
                    world.returnGoodSpot(block);
                    world.countHits();
                }

                if (overlapX < overlapY) {
                    // Столкновение по горизонтали
                    this.playSound()
                    this.speedX *= -this.acceleration;
                    if (ballRight - blockLeft < blockRight - ballLeft) {
                        this.x = blockLeft - this.r; // Исправление позиции
                    } else {
                        this.x = blockRight + this.r;
                    }
                } else {
                    // Столкновение по вертикали
                    this.playSound()
                    this.speedY *= -this.acceleration;
                    if (ballBottom - blockTop < blockBottom - ballTop) {
                        this.y = blockTop - this.r; // Исправление позиции
                    } else {
                        this.y = blockBottom + this.r;
                    }
                }
            }
        }
    }

    update(direction) {
        const steps = 20;
        for (let i = 0; i < steps; i++) {
            const stepX = direction.x * this.speedX / steps;
            const stepY = direction.y * this.speedY / steps;
            this.x += stepX;
            this.y += stepY;
            this.borders();
            this.collide();
        }
    }

    playSound() {
        if (world.hitSound.isPlaying()) {
            world.hitSound.stop();
        }
        world.hitSound.play();
    }

    reset() {
        this.speedX = 0;
        this.speedY = 0;
        this.stopped = true;
        this.y = world.floor - this.r;
        this.visuals = [];
        if (this.dieOnEnd) {
            world.balls.splice(world.balls.indexOf(this), 1);
        } else {
            if (world.gameboard.length < world.level.blocksPerWave) {
                world.gameOver();
                this.modificators = [];
                return;
            }
            world.level.waves--;
            if (world.level.waves > 0) {
                world.generateRandomGrid();
            } else if (world.level.waves === 0) {
                world.createBoss();
            } else {
                world.gameOver();
                this.modificators = [];
                return;
            }

            if (world.hitsToNextModificator <= 1) {
                noLoop();
                pickModificator.style.display = 'flex';
                const modificators = ['Молния', "Огонь"];
                let option_1 = random(modificators);
                modificators.splice(modificators.indexOf(option_1), 1);
                let option_2 = random(modificators)
                const buttons = [...pickModificator.querySelectorAll('button')];
                buttons[0].innerText = option_1;
                buttons[1].innerText = option_2;
                buttons.forEach(button => {
                    button.addEventListener('click', () => {
                        world.balls[0].addModificator(button.innerText);
                        world.hitsToNextModificator = world.level.blocksPerWave;
                        pickModificator.style.display = 'none';
                        loop();
                    })
                })
            }
        }
    }

    setGhost(state) {
        this.powers.ghost = state;
    }

    addModificator(item) {
        if (!this.modificators.includes(item)) {
            this.modificators.push(item);
        }
    }

    useModificator(primeBlock) {
        const modificatorActions = {
            'Молния': () => {
                const randomSpot = world.pickRandomSpot();
                const block = world.blocks.find(block => block.x === randomSpot.x && block.y === randomSpot.y);
                if (block) {
                    block.health -= this.damage * 0.2;
                }
                if (world.lightningSound.play()) {
                    world.lightningSound.stop();
                }
                world.lightningSound.play();
                const visual = new Visual(randomSpot.x, randomSpot.y, world.blockSize, [0, 255, 255]);
                this.visuals.push(visual);
            },
            'Огонь': () => { }
        }

        for (let key of this.modificators) {
            modificatorActions[key]();
        }

    }

    clearVisuals() {
        this.visuals = this.visuals.filter(visual => alpha(visual.color) > 0);
    }
}