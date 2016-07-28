var Vayne = function(startx, starty) {
	// jumpheight, 
	this.buffQ = false;
	this.ultOn = false;

    this.cdQ = 0;
    this.cdW = 0;
    this.cdE = 0;
    this.cdR = 20000;
    
	Player.call(this, 210, 190, startx, starty, 10, "Vayne");
}
herdaPlayer(Vayne);


Vayne.prototype.draw = function(timestamp){
	this.pdraw(timestamp);
}
Vayne.prototype.autoAttack = function(){
	var damage = 50;
	if(this.buffQ){
		damage+= 20;
		this.buffQ = false;
	}
	if(this.ultOn){
		damage+=30;
	}
	this.pAutoAttack(10, 100, damage, this, this.enemy); // speed, range
}

Vayne.prototype.castQ = function(){

    var buff = new Buff(400, this, this.enemy);
    var dashSpeed = 7.5*dt;

    this.casting = 400;

    buff.tick = function(timestamp) {
        if (!this.started){
            this.buffLTS = timestamp;
            this.started = true;
        }
        this.caster.x += dashSpeed;
        this.checkEnd(timestamp);
    }	
	
    skill.onEnd = function(){
        this.buffQ = true;
    }

    this.skills.push(skill);
}

Vayne.prototype.castW = function(){
	this.contW = 0;

	skill.onHitEffect = function(){
        this.target.knockback = 2000;
    }
}

Vayne.prototype.castE = function(){
	var x, y, sx, sy;
    var speed = 6*dt;
    var range = 220;
    var damage = 20;
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
    var skill = new Projectile(x, y, sx, sy, 6, 6, range, damage, this, this.enemy, true);

    skill.onHitEffect = function(){
    	var debuff =  new Buff(200, this.caster, this.target);
    	var dashSpeed = 15*dt;

    	this.target.casting = 200;

	    debuff.tick = function(timestamp) {
	        if (!this.started){
	            this.buffLTS = timestamp;
	            this.started = true;
	        }
	        this.target.x += dashSpeed;
	        //checa colisao
	        this.checkEnd(timestamp);
	    }

        this.target.buffs.push(debuff);

	}
    this.skills.push(skill);
}

Vayne.prototype.castR = function(){
	var buff = new Buff(10000, this, this.enemy);
	this.ultOn = true;

    buff.onEnd = function(){
    	this.caster.ultOn = false;
    }
    
    this.buffs.push(buff);
}