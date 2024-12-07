class Visual {
    constructor(x, y, width, blockColor, options) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.color = color(blockColor);
        this.position = {
            x: x * world.blockSize + world.blockSize / 2 + world.padding,
            y: (y + 1) * world.blockSize + world.blockSize / 2 + world.padding
        }
        this.alpha = 255;
        this.delay = options?.delay || 0;
        this.createAt = options?.createdAt || frameCount;
    }

    show() {
        if (frameCount - this.createAt < this.delay) return;
        noFill();
        stroke(this.color);
        rect(this.position.x, this.position.y, this.width, this.width);
    }

    fade() {
        this.color.setAlpha(max(alpha(this.color) - 2, 0));
    }
}