class Visual {
    constructor(x, y, width, blockColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.color = color(blockColor);
        this.position = {
            x: x * world.blockSize + world.blockSize / 2 + world.padding,
            y: (y + 1) * world.blockSize + world.blockSize / 2 + world.padding
        }
        this.alpha = 255;
    }

    show() {
        noFill();
        stroke(this.color);
        rect(this.position.x, this.position.y, this.width, this.width);
    }

    fade() {
        this.color.setAlpha(alpha(this.color) - 1);
    }
}