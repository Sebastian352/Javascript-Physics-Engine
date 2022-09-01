const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const BALLZ = [];

let LEFT, UP, RIGHT, DOWN;
let friction = 0.1;

//a class Vector with basic vector operations
class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(v){
        return new Vector(this.x+v.x, this.y+v.y);
    }

    subtr(v){
        return new Vector(this.x-v.x, this.y-v.y);
    }

    mag(){
        return Math.sqrt(this.x**2 + this.y**2)
    }

    mult(n){
        return new Vector(this.x*n, this.y*n);
    }

    drawVec(start_x, start_y, n, color){
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }
}

class Ball{
    constructor(x, y, r){
        this.pos = new Vector(x,y);
        this.r = r;
        this.vel = new Vector(0,0);
        this.acc = new Vector(0,0);
        this.acceleration = 1;
        this.player = false;
        BALLZ.push(this);
    }

    drawBall(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2*Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    display(){
        this.vel.drawVec(this.x, this.y, 10, "green");
        this.acc.drawVec(this.x, this.y, 100, "blue");
    }
}

function keyControl(b){
    canvas.addEventListener('keydown', function(e){
        if(e.key === 'a'){
            LEFT = true;
        }
        if(e.key === 'w'){
            UP = true;
        }
        if(e.key === 'd'){
            RIGHT = true;
        }
        if(e.key === 's'){
            DOWN = true;
        }
    });
    
    canvas.addEventListener('keyup', function(e){
        if(e.key === 'a'){
            LEFT = false;
        }
        if(e.key === 'w'){
            UP = false;
        }
        if(e.key === 'd'){
            RIGHT = false;
        }
        if(e.key === 's'){
            DOWN = false;
        }
    });
    
    if(LEFT){
        b.acc.x = -b.acceleration;
    }
    if(UP){
        b.acc.y = -b.acceleration;
    }
    if(RIGHT){
        b.acc.x = b.acceleration;
    }
    if(DOWN){
        b.acc.y = b.acceleration;
    }
    if(!LEFT && !RIGHT){
        b.acc.x = 0;
    }
    if(!UP && !DOWN){
        b.acc.y = 0;
    }
    
    //acceleration vector gets added to the velocity vector
    b.vel = b.vel.add(b.acc);
    b.vel = b.vel.mult(1-friction);
    b.pos = b.pos.add(b.vel);
}


function round(number, precision){
    let factor = 10 ** precision;
    return Math.round(number * factor)/factor;
}

function coll_det_bb(b1,b2){
    if(b1.r + b2.r >= b2.pos.subtr(b1.pos).mag()){
        return true;
    }else {
        return false;
    }
}

function mainLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    BALLZ.forEach((b) => {
        b.drawBall();
        if (b.player){
            keyControl(b);
        }
        b.display();
    })

    if(coll_det_bb(Ball1,Ball2)){
        ctx.fillText("Collision",500,300);
    }

    requestAnimationFrame(mainLoop);
}

let Ball1 = new Ball(200, 200, 30);
let Ball2 = new Ball(200, 300, 50);

Ball1.player = true;

requestAnimationFrame(mainLoop);
