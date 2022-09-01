const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const buton = document.getElementById('buton');

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
    unit(){
        if(this.mag() === 0)
            return new Vector(0,0);
        else
            return new Vector(this.x/this.mag(),this.y/this.mag());
    }

    normal(){
        return new Vector(-this.y, this.x);
    }

    drawVec(start_x, start_y, n, color){
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    static dot(v1, v2){
        return v1.x*v2.x + v1.y*v2.y;
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


if(buton){
buton.addEventListener("click", function() {
    let b = new Ball(400,Math.random()*100+200,20);
});
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
    b.acc = b.acc.unit().mult(b.acceleration);
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

function pen_res_bb(b1,b2){
    let dist = b1.pos.subtr(b2.pos);
    let pen_depth = b1.r + b2.r - dist.mag();
    let pen_res = dist.unit().mult(pen_depth/2);
    b1.pos = b1.pos.add(pen_res);
    b2.pos = b2.pos.add(pen_res.mult(-1));
}
console.log(buton);
function mainLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    BALLZ.forEach((b,index) => {
        b.drawBall();
        if (b.player){
            keyControl(b);
        }
        for(let i = index + 1; i < BALLZ.length; i++)
            if(coll_det_bb(BALLZ[index],BALLZ[i])){
                pen_res_bb(BALLZ[index],BALLZ[i]);
        }
        b.display();
    })
    requestAnimationFrame(mainLoop);
}

let Ball1 = new Ball(200, 200, 30);
let Ball2 = new Ball(200, 300, 50);

Ball1.player = true;

requestAnimationFrame(mainLoop);
