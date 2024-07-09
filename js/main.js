/**
 * FROGRRR
 * A frog eating flies
 */

// The frog
const frog = {
    body: {
        x: 240,
        y: 640,
        size: 100,
    },
    tongue: {
        x: 240,
        y: 640,
        size: 20,
        // Pixels per frame the tongue moves
        speed: 20,
        // Track how much the user has charged the tongue
        charge: 0,
        // Track the current state of the tongue
        state: "idle"
    }
};

// Our fly, moves across the screen linearly for now
const fly = {
    x: 0,
    y: 200,
    size: 20,
    speed: 2
}

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(480, 640);
}

/**
 * Runs the game
 */
function draw() {
    background(220);

    chargeTongue();

    moveFly();
    drawFly();

    moveFrog();
    moveTongue();
    drawFrog();

    checkTongue();
}

/**
 * Charges the tongue when in that state
 */
function chargeTongue() {
    if (frog.tongue.state === "charging") {
        frog.tongue.charge += 0.1;
    }
}

/**
 * Moves the fly across the screen, wraps if needed
 */
function moveFly() {
    fly.x += fly.speed;
    if (fly.x > width) {
        fly.x = 0;
        fly.y = random(0, height * 0.75);
    }
}

/**
 * Displays the fly
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Moves the frog based on mouse position
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Moves the tongue based on launch + mouse position
 */
function moveTongue() {
    // If the tongue has been launched
    if (frog.tongue.state === "outbound") {
        // Make sure it has charge
        if (frog.tongue.charge > 0) {
            // If so, reduce charge
            frog.tongue.charge -= 0.2;
            // And move it
            frog.tongue.y -= frog.tongue.speed;
        } else {
            // Otherwise it has run out of charge, so it should come back
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is coming back
    else if (frog.tongue.state === "inbound") {
        // Bring it back
        frog.tongue.y += frog.tongue.speed;
        // Check if it's back in the body
        if (frog.tongue.y > frog.body.y) {
            // Clamp position
            frog.tongue.y = frog.body.y;
            // Back to idle
            frog.tongue.state = "idle";
        }
    }
    // Tongue x always matched the body
    frog.tongue.x = frog.body.x;
}

/**
 * Draws the frog (including tongue)
 */
function drawFrog() {
    // Draw tongue (so it's behind the body)
    push();
    noStroke();
    fill(255, 0, 0);
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);

    stroke(255, 0, 0);
    strokeWeight(10);
    line(frog.body.x, frog.body.y, frog.tongue.x, frog.tongue.y);
    pop();

    // Draw frog body
    push();
    noStroke();
    fill(0, 255, 0);
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    // Draw frog eyes
    push();
    noStroke();
    fill("#ffffff");
    ellipse(frog.body.x - frog.body.size / 3, frog.body.y - frog.body.size / 3, frog.body.size / 3);
    ellipse(frog.body.x + frog.body.size / 3, frog.body.y - frog.body.size / 3, frog.body.size / 3);

    fill("#000000");
    ellipse(frog.body.x - frog.body.size / 3, frog.body.y - frog.body.size / 2.5, frog.body.size / 6);
    ellipse(frog.body.x + frog.body.size / 3, frog.body.y - frog.body.size / 2.5, frog.body.size / 6);
    pop();
}

/**
 * Check if the tongue got a fly
 */
function checkTongue() {
    // Get the distance between tongue tip and fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it overlaps
    if (d < frog.tongue.size / 2 + fly.size / 2) {
        // If so, fly resets
        fly.x = 0;
        fly.y = random(0, height * 0.75);
    }
}

/**
 * On click down we start charging the tongue
 */
function mousePressed() {
    // Make sure the tongue isn't already out
    if (frog.tongue.state === "idle") {
        // Switch to charging
        frog.tongue.state = "charging";
        // Reset the charge
        frog.tongue.charge = 0;
    }
}

/**
 * On release the tongue is launched
 */
function mouseReleased() {
    // Make sure the tongue is charging (don't launch otherwise)
    if (frog.tongue.state === "charging") {
        // And switch to launched state
        frog.tongue.state = "outbound";
    }
}