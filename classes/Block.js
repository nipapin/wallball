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

}

