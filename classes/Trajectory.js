class Trajectory {
    constructor(start) {
        this.start = start;
        this.length = 10;
        this.direction = createVector(0, -1);
        this.gap = 25;
        this.points = [];
    }

    show(ball) {
        this.start = createVector(ball.x, ball.y);
        const target = createVector(constrain(mouseX, 0, width), constrain(mouseY, 0, world.floor - 100));
        const angle = atan2(target.y - this.start.y, target.x - this.start.x);
        this.direction = p5.Vector.fromAngle(angle);
        noFill();
        stroke(255);
        this.calculateTrajectory();
    }

    calculateTrajectory() {
        this.points = [];
        let position = this.start;
        let tempPosition = position.copy();
        let tempVelocity = this.direction.copy().setMag(this.gap);
        for (let i = 0; i < this.length; i++) {
            circle(tempPosition.x, tempPosition.y, 5);
            if (this.overlapped(tempPosition)) {
                break;
            }
            for (let step = 0; step < 10; step++) {
                tempVelocity.setMag(this.gap / 10);
                if (tempPosition.x <= world.ballSize || tempPosition.x >= width - world.ballSize) {
                    tempVelocity.x *= -1;
                }
                if (tempPosition.y <= world.ballSize) {
                    tempVelocity.y *= -1;
                }
                tempPosition.add(tempVelocity);
            }

        }
    }

    overlapped(position) {
        for (let block of world.blocks) {
            return position.x > block.x - block.w / 2 && position.x < block.x + block.w / 2 && position.y > block.y - block.w / 2 && position.y < block.y + block.w / 2
        }
        return false
    }

}