var Projectile = function(x, y, sx, sy, sizex, sizey, range, damage, caster, target, end){
	this.x = x;
	this.y = y;
	this.sx = sx*dt;
	this.sy = sy*dt;
	this.sizex = sizex;
	this.sizey = sizey;
	this.range = range;
	this.target = target;
    this.caster = caster;
	this.end = false;
    this.hit = false;
	this.step = Math.sqrt((this.sx*this.sx)+(this.sy*this.sy));

	this.move = function(){

        this.x += this.sx;
        this.y += this.sy;
        this.range -= this.step;
        if (this.range <= 0) {
        	this.end = true;
        	this.onEnd();
        }
        this.checkHit();
        //console.log(this.y);
    }

    this.checkHit = function() {
    	var xdist = (this.sizex/2)+ (this.target.sizex/2);
    	var ydist;
    	if (this.y > this.target.y){
    		ydist = this.sizey/2;
    	} else {
    		ydist = this.sizey/2 + this.target.sizey;
    	}
    	//console.log(ydist);
    	if ((Math.abs(this.x-this.target.x) < xdist) && (Math.abs(this.y-this.target.y) < ydist)){
    		//console.log("acerto mizeravi");
    		this.onHit();
    	}

    }

    this.draw = function(){
	    gamectx.fillStyle = "#FFFFFF";
	    gamectx.beginPath();
	    gamectx.fillRect(this.x-this.sizex, this.y-this.sizey, this.sizex, this.sizey);
	    gamectx.closePath();
	    gamectx.fill();
    }

    this.onHit = function(){
        if (!this.hit){
        	this.target.hp -= ((damage*this.caster.damageIncrease)+this.caster.flatDamageIncrease);
        	this.hit = true;
            this.onHitEffect();
            this.end = end;
            if (this.end) this.onEnd();
        }
    }

    this.onHitEffect = function(){

    }

    this.onEnd = function(){

    }
}