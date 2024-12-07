class Block {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.position = {
            x: x * world.blockSize + world.blockSize / 2 + world.padding,
            y: (y + 1) * world.blockSize + world.blockSize / 2 + world.padding
        }
        this.padding = 4;
        this.health = random([10, 20]);
    }

    show() {
        stroke(this.health < 50 ? 255 : 0)
        fill(map(this.health, 0, 100, 0, 255));
        rect(this.position.x, this.position.y, this.w, this.w);
        noStroke();
        fill(this.health < 50 ? 255 : 0);
        textAlign(CENTER, CENTER);
        text(this.health, this.position.x, this.position.y);
    }

    getNeighbours(cross) {
        if (cross) {
            const topleft = world.blocks.find(block => block.x === this.x - 1 && block.y === this.y - 1);
            const topright = world.blocks.find(block => block.x === this.x + 1 && block.y === this.y - 1);
            const bottomright = world.blocks.find(block => block.x === this.x + 1 && block.y === this.y + 1);
            const bottomleft = world.blocks.find(block => block.x === this.x - 1 && block.y === this.y + 1);
            return [topleft, topright, bottomright, bottomleft].filter(Boolean);
        }
        const left = world.blocks.find(block => block.x === this.x - 1 && block.y === this.y);
        const right = world.blocks.find(block => block.x === this.x + 1 && block.y === this.y);
        const top = world.blocks.find(block => block.x === this.x && block.y === this.y - 1);
        const bottom = world.blocks.find(block => block.x === this.x && block.y === this.y + 1);
        return [left, right, top, bottom].filter(Boolean);
    }

    checkHealth() {
        if (this.health < 1) {
            world.blocks.splice(world.blocks.indexOf(this), 1);
            world.returnGoodSpot({ x: this.x, y: this.y });
        }
    }

    getSide(ball) {
        let side = 'left';
        if (ball.x > this.position.x + this.w / 2) {
            side = 'right';
        }
        if (ball.y > this.position.y + this.w / 2) {
            side = 'bottom';
        }
        if (ball.y < this.position.y - this.w / 2) {
            side = 'top';
        }
        return side;
    }

}

