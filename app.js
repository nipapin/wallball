let wallball_canvas;

const debug = true;
let PLAY = false;

let world;
let ballTexture;

let startPoint;

let ballPerson;

function preload() {
    world = new World();
    world.ballTexture = loadImage('assets/ball.png');
    world.hitSound = loadSound('assets/hit.mp3');
    world.lightningSound = loadSound('assets/lightning.mp3');
    world.initEmptyGrid();
}


function setup() {
    wallball_canvas = createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    world.floor = height - 100;
    ballPerson = {
        default: new Ball(width / 2, world.floor - world.ballSize, world.ballSize),
        doubler: new Ball(width / 2, world.floor - world.ballSize, world.ballSize, { doubler: true })
    }

    world.balls.push(ballPerson.doubler);
    world.trajectory = new Trajectory(createVector(world.balls[0].x, world.balls[0].y));
    startPoint = new Ball(world.balls[0].x, world.balls[0].y, world.ballSize);
    frameRate(120);

    wallball_canvas.touchEnded(() => {
        if (mouseY < world.floor) {
            world.balls[0].shoot();
        }
    })
}

function draw() {
    background(20);

    if (world.level) {
        text(`${world.level.name} | Wave: ${world.level.waves || 'Boss Fight'}`, width / 2, world.floor + 50);
    } else {
        return
    }

    for (let block of world.blocks) {
        block.show();
    }

    for (let ball of world.balls) {
        ball.update(world.trajectory.direction);
        ball.show();
        ball.clearVisuals();
        ball.visuals.forEach(visual => {
            visual.show();
            visual.fade();
        });
    }

    if (mouseIsPressed && world.balls[0].stopped && mouseY < world.floor) {
        world.trajectory.show(world.balls[0]);
    }

    stroke(255);
    line(0, world.floor, width, world.floor);
    noStroke();
    fill(255);
}
