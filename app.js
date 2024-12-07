let wallball_canvas;

let world;

let ballPerson;

let activeBall;

p5.disableFriendlyErrors = true;

function preload() {
    world = new World();
    world.ballTexture = loadImage('assets/default.png');
    world.sounds = {
        hit: loadSound('assets/hit.mp3'),
        lightning: loadSound('assets/lightning.mp3'),
        fire: loadSound('assets/fire.mp3'),
    }
    world.initEmptyGrid();
}

function prepare() {
    world.floor = height - 100;
    ballPerson = {
        DEFAULT: new Ball(width / 2, world.floor - world.ballSize, world.ballSize),
        DOUBLER: new Ball(width / 2, world.floor - world.ballSize, world.ballSize, { doubler: true }),
        GHOST: new Ball(width / 2, world.floor - world.ballSize, world.ballSize, { ghost: true }),
        CHAOS: new Ball(width / 2, world.floor - world.ballSize, world.ballSize, { chaos: true })
    }
    activeBall = ballPerson.DEFAULT;
    world.trajectory = new Trajectory(createVector(activeBall.x, activeBall.y));
    Object.values(world.sounds).forEach(sound => sound.setVolume(0.1))
}

function setup() {
    wallball_canvas = createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    prepare();
    frameRate(120);

    wallball_canvas.touchEnded(() => {
        if (mouseY < world.floor) {
            world.balls[0].shoot();
        }
    });
    noLoop();
}

function draw() {
    background(0, 0, 20);

    if (world.level) {
        text(`${world.level.name} | Wave: ${world.level.waves || 'Boss Fight'}`, width / 2, world.floor + 50);
    } else {
        return
    }

    for (let block of world.blocks) {
        block.show();
        block.checkHealth();
    }

    for (let ball of world.balls) {
        ball.update(world.trajectory.direction);
        ball.show();
        ball.clearVisuals();
        ball.visuals.forEach(visual => {
            visual.show();
            visual.fade();
        });

        ball.twins.forEach(twin => {
            twin.update(world.trajectory.direction);
            twin.show();
        });
    }

    if (mouseIsPressed && world.balls[0].stopped && mouseY < world.floor) {
        world.trajectory.show(world.balls[0]);
    }

    world.checkAllBallsStopped();

    stroke(255);
    line(0, world.floor, width, world.floor);
    noStroke();
    fill(255);
}
