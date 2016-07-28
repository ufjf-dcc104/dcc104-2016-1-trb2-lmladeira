var Player = function (imgsizex, imgsizey, startx, starty, jumpheight, src) {
    
    this.hp = 500;
    this.mp = 500;

    this.damageIncrease = 1;
    this.flatDamageIncrease = 0;

    this.armorIncrease = 1;
    this.flatArmorIncrease = 0;

    this.cdr = 1;

    this.moveSpdIncrease = 1;
    this.flatMoveSpdIncrease = 0;

	this.x = startx;
    this.y = starty;
    this.sx = 0;
    this.sy = 0;
    this.rotation = 0;
    this.flip = false;
    this.moveLTS = 0;

    this.skills = [];
    this.buffs = [];

    this.sizex = 50;
    this.sizey = 40;

    this.jumpheight = jumpheight;
    this.jumping = true;
    this.movingLeft = false;
    this.movingRight = false;
    this.lookingUp = false;
    this.lookingDown = false;

    this.stunned = 0;
    this.silenced = 0;
    this.snared = 0;
    this.casting = 0;

    this.imgsizex = imgsizex;
    this.imgsizey = imgsizey;

    this.champImg = new Image();
    this.champImg.src = "Champions/"+src+"/"+src+".png";
    
    this.champImg.onload = (function(that) {
        loaded++;
        console.log(toLoad);
        console.log(loaded);
    })(this);
    this.champImg.onerror = function(){
        console.log("aff");
    }
    
    this.tilex = Math.floor(this.x / tilewidth);
    this.tiley = Math.floor(this.y / tileheight);
    this.posx = (this.tilex) * tilewidth;
    this.posy = (this.tiley) * tileheight;
}



Player.prototype.move = function (timestamp) {

	this.tilex = Math.floor(this.x / tilewidth);
    this.tiley = Math.floor(this.y / tileheight);

    this.posx = (this.tilex) * tilewidth;
    this.posy = (this.tiley) * tileheight;

	this.sx = 0

    for (var i = this.skills.length-1; i>=0 ; i--) {
        this.skills[i].move();
        if (this.skills[i].end){
            this.skills.splice(i, 1);
        }
    }
    for (var i = this.buffs.length-1; i>=0 ; i--) {
        this.buffs[i].tick(timestamp);
        if (this.buffs[i].end){
            this.buffs.splice(i, 1);
        }
    }

    if (this.stunned <= 0  && this.snared <= 0 && this.casting <= 0) {
    	if (this.movingLeft) {
            this.sx -= 4*dt;
        }

        if (this.movingRight) {
            this.sx += 4*dt;
        }

        if (this.lookingUp && !this.jumping) {
            this.sy = -this.jumpheight*dt;
            this.jumping = true;
        }

        
        if (this.x + this.sx > (WIDTH-(this.sizex/2)) ){
            this.sx = 0;
            this.x = (WIDTH-(this.sizex/2));
        } else if (this.x + this.sx < (0+(this.sizex/2))){
        	this.sx = 0;
        	this.x = (0+(this.sizex/2));
        }
    }
        this.stunned -= (timestamp - this.moveLTS);
        this.snared -= (timestamp - this.moveLTS);
        this.casting -= (timestamp - this.moveLTS);
        this.cdAA -= (timestamp - this.moveLTS);
        this.cdQ -= (timestamp - this.moveLTS);
        this.cdW -= (timestamp - this.moveLTS);
        this.cdE -= (timestamp - this.moveLTS);
        this.cdR -= (timestamp - this.moveLTS);


        this.silenced -= (timestamp - this.moveLTS);


    this.moveLTS = timestamp;


    if (this.casting <= 0) {
        this.sy += gravity*dt;
        if (this.y + this.sy > (this.posy + tileheight) && map[this.tiley][this.tilex] == 1) {
            this.sy = 0;
            this.jumping = false;
        } else if (this.y + this.sy > HEIGHT){
        	this.sy = 0;
            this.jumping = false;
        } else if (this.y + this.sy < (0+(this.sizey))){
        	this.sy = 0;
        }
    } else {
        this.sy = 0;
    }

    this.x += this.sx;
    this.y += this.sy;
    
}

Player.prototype.pdraw = function (timestamp) {

    for (var i = this.skills.length-1; i>=0 ; i--) {
        this.skills[i].draw();
    }

    var state = 0;
    if (this.movingLeft && !this.movingRight) {
        state = 1;
        this.flip = true;
    }
    if (!this.movingLeft && this.movingRight) {
        state = 1;
        this.flip = false;
    }
    if (this.jumping){
        state = 2;
    }
    //console.log(timestamp);
    if (state < 2) {
    	this.rotation = Math.floor((timestamp/100)%10);
    } else {
        if (this.sy < 0){
            this.rotation = 0;
        } else {
            this.rotation = 1;
        }
    }

    if (!this.flip){
        gamectx.drawImage(this.champImg,
        this.imgsizex*this.rotation, this.imgsizey*state, this.imgsizex, this.imgsizey,
        this.x-(this.sizex/2), this.y-this.sizey, this.sizex, this.sizey);
    } else {
        gamectx.save();
        gamectx.translate(WIDTH, 0);
        gamectx.scale(-1, 1);
        gamectx.drawImage(this.champImg,
            this.imgsizex*this.rotation, this.imgsizey*state, 
            this.imgsizex, this.imgsizey,
            WIDTH-(this.x+(this.sizex/2)), this.y-this.sizey, 
            this.sizex, this.sizey);
        gamectx.restore();
    }
    //this.debugdraw();
}
Player.prototype.debugdraw = function () {
 
    gamectx.strokeStyle = "rgb(250, 0, 0)";
    gamectx.beginPath();
    gamectx.strokeRect(this.posx, this.posy, tilewidth, tileheight);
    gamectx.closePath();
    gamectx.stroke();

    gamectx.fillStyle = "#444444";
    gamectx.beginPath();
    gamectx.fillRect(this.x-this.sizex/2, this.y-this.sizey, this.sizex, this.sizey);
    gamectx.closePath();
    gamectx.fill();

}
Player.prototype.pAutoAttack = function(speed, range, damage, caster, target){
    var x, y, sx, sy;
    if(this.flip){
        x = this.x - this.sizex;
        y = this.y - (this.sizey/2);
        if(this.lookingUp){
            sx = (-speed/2);
            sy = (-speed/2); 
        }
        else{    
            sx = -speed;
            sy = 0; 
        }
    }
    else if(!this.flip){
        x = this.x + this.sizex;
        y = this.y - (this.sizey/2);
        if(this.lookingUp){
            sx = (speed/2);
            sy = (-speed/2); 
        }
        else{    
            sx = speed;
            sy = 0; 
        }
    }



    this.skills.push(new Projectile(x, y, sx, sy, 6, 6, range, damage, this, target, true));
}
Player.prototype.distance = function(target){
    return Math.sqrt(((this.x-target.x)*(this.x-target.x))+(((this.y-(this.sizey/2))-(target.y-(target.sizey/2)))*((this.y-(this.sizey/2))-(target.y-(this.sizey/2)))));
}


var herdaPlayer = function(subc){
	var superc = Object.create(Player.prototype);
	subc.prototype = superc;
	subc.prototype.constructor = subc;
}