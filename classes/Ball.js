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
        this.twins = [];
        this.modificators = [];
        this.hitCount = 2;
        this.visuals = [];
        this.ethereal = powers?.ghost;
        this.etherealCount = 3;
        this.availableModificators = [...world.modificators];
        this.willReset = false;
    }

    show() {
        const imageOffset = this.isTwin ? 25 : 50;
        const imageSize = this.isTwin ? this.r * 6.25 : this.r * 12.5
        image(world.ballTexture, this.x - imageOffset, this.y - imageOffset, imageSize, imageSize);
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
            this.willReset = true;
        }
    }

    borders() {
        // Отскок от боковых стен
        if (this.x < this.r) {
            this.x = this.r; // Исправляем позицию
            this.speedX *= -1; // Меняем направление по X
            this.playSound(); // Воспроизводим звук отскока
        } else if (this.x > width - this.r) {
            this.x = width - this.r; // Исправляем позицию
            this.speedX *= -1; // Меняем направление по X
            this.playSound(); // Воспроизводим звук отскока
        }

        // Отскок от потолка
        if (this.y < this.r) {
            this.y = this.r; // Исправляем позицию
            this.speedY *= -1; // Меняем направление по Y
            this.setGhost(false); // Сбрасываем "призрачный" режим, если активен
            this.playSound(); // Воспроизводим звук отскока
        }

        // Достижение пола
        if (this.y > world.floor - this.r) {
            if (this.isTwin) {
                // Убираем шар-близнец
                const index = world.balls.indexOf(this);
                if (index !== -1) {
                    world.balls.splice(index, 1);
                }
            } else {
                // Останавливаем основной шар
                this.speedX = 0;
                this.speedY = 0;
                this.stopped = true;
                this.y = world.floor - this.r;
                this.reset();
            }
        }
    }



    spawnTwin() {
        let twin = new Ball(this.x, this.y, this.r, this.powers);
        twin.acceleration = this.acceleration;
        twin.speedX = this.speedX * random([-1, 1]);
        twin.speedY = this.speedY * random([-1, 1]);
        twin.damage = this.damage / 2;
        twin.twinchance = this.twinchance / 2;
        twin.dieOnEnd = true;
        twin.isTwin = true;
        twin.hitCount = 2;
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
        if (this.ethereal) return;
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

                if (this.powers.doubler && random() < this.twinchance) {
                    this.spawnTwin();
                }

                // Обработка столкновения
                block.health -= this.damage;

                if (this.isTwin) {
                    this.hitCount = this.hitCount - 1;
                    if (this.hitCount === 0) {
                        const index = world.balls.indexOf(this);
                        if (index !== -1) {
                            world.balls.splice(index, 1);
                        }
                    }
                }

                this.useModificator(block);

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
        const steps = 10;
        for (let i = 0; i < steps; i++) {
            const stepX = direction.x * this.speedX / steps;
            const stepY = direction.y * this.speedY / steps;
            this.x += stepX;
            this.y += stepY;
            this.collide();
            this.borders();
        }
    }

    playSound() {
        if (world.sounds.hit.isPlaying()) {
            world.sounds.hit.stop();
        }
        world.sounds.hit.play();
    }

    reset() {
        this.visuals = [];

        if (this.powers.ghost) {
            this.etherealCount = this.etherealCount - 1;
            if (this.etherealCount === 0) {
                this.setGhost(true);
                this.etherealCount = 3;
            }
        }

        world.level.waves--;

        if (world.level.waves > 0 && world.gameboard.length < world.level.blocksPerWave) {
            world.gameOver();
            this.modificators = [];
            return;
        }
        if (world.level.waves > 0) {
            world.generateRandomGrid();
        } else if (world.level.waves === 0) {
            world.createBoss();
        } else {
            world.gameOver();
            this.modificators = [];
            return;
        }
    }


    setGhost(state) {
        this.ethereal = state;
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
                if (world.sounds.lightning.play()) {
                    world.sounds.lightning.stop();
                }
                world.sounds.lightning.play();
                const visual = new Visual(randomSpot.x, randomSpot.y, world.blockSize, [0, 188, 212]);
                this.visuals.push(visual);
            },
            'Огонь +': () => {
                const neighbours = primeBlock.getNeighbours();
                if (!neighbours.length) return;
                const dealDamage = round(this.damage / neighbours.length);
                neighbours.forEach(block => {
                    block.health -= dealDamage;
                    const visual = new Visual(block.x, block.y, world.blockSize, [246, 67, 54]);
                    this.visuals.push(visual);
                });

                if (world.sounds.fire.play()) {
                    world.sounds.fire.stop();
                }
                world.sounds.fire.play();
            },
            'Огонь X': () => {
                const neighbours = primeBlock.getNeighbours(true);
                if (!neighbours.length) return;
                const dealDamage = round(this.damage / neighbours.length);
                neighbours.forEach(block => {
                    block.health -= dealDamage;
                    const visual = new Visual(block.x, block.y, world.blockSize, [246, 67, 54]);
                    this.visuals.push(visual);
                });

                if (world.sounds.fire.play()) {
                    world.sounds.fire.stop();
                }
                world.sounds.fire.play();
            },
            'Молния Линия': () => {
                const direction = primeBlock.getSide(this);
                let createdAt = frameCount;
                const touchBlocks = (block, index) => {
                    block.health -= this.damage * 0.2;
                    const visual = new Visual(block.x, block.y, world.blockSize, [0, 188, 212], {
                        createdAt: createdAt + index * 7, delay: index * 7
                    });
                    this.visuals.push(visual);
                }
                const lineByDirection = {
                    left: () => {
                        world.blocks.filter(block => block.x >= primeBlock.x && block.y === primeBlock.y).forEach(touchBlocks);
                    },
                    right: () => {
                        world.blocks.filter(block => block.x <= primeBlock.x && block.y === primeBlock.y).forEach(touchBlocks);
                    },
                    top: () => {
                        world.blocks.filter(block => block.y >= primeBlock.y && block.x === primeBlock.x).forEach(touchBlocks);
                    },
                    bottom: () => {
                        world.blocks.filter(block => block.y <= primeBlock.y && block.x === primeBlock.x).forEach(touchBlocks);
                    }
                }
                lineByDirection[direction]();
                if (world.sounds.lightning.play()) {
                    world.sounds.lightning.stop();
                }
                world.sounds.lightning.play();
            }
        }

        for (let key of this.modificators) {
            this.isTwin ? random() < 0.5 && modificatorActions[key]() : modificatorActions[key]();
        }

    }

    clearVisuals() {
        this.visuals = this.visuals.filter(visual => alpha(visual.color) > 0);
    }
}