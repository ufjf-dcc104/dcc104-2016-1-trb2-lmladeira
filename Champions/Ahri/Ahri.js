var Ahri = function(startx, starty) {
	this.ultCharges = 3;

    this.cdAA = 0;
    this.cdQ = 0;
    this.cdW = 0;
    this.cdE = 0;
    this.cdR = 20000;
    
    this.audio = {};
    this.audio["AACast"] = new Audio("Champions/Ahri/Audio/AA_cast.wav");
    this.audio["AAHit"] = new Audio("Champions/Ahri/Audio/AA_hit.wav");

    this.audio["QCast"] = new Audio("Champions/Ahri/Audio/Q_cast.wav");
    this.audio["QVoice"] = new Audio("Champions/Ahri/Audio/Q_voice.wav");
    this.audio["QHit"] = new Audio("Champions/Ahri/Audio/Q_hit.wav");
    this.audio["QBCast"] = new Audio("Champions/Ahri/Audio/QB_cast.wav");
    this.audio["QBHit"] = new Audio("Champions/Ahri/Audio/QB_hit.wav");

    this.audio["WCast"] = new Audio("Champions/Ahri/Audio/W_cast.wav");
    this.audio["WVoice"] = new Audio("Champions/Ahri/Audio/W_voice.wav");
    this.audio["WHit1"] = new Audio("Champions/Ahri/Audio/W_hit.wav");
    this.audio["WHit2"] = new Audio("Champions/Ahri/Audio/W_hit.wav");
    this.audio["WHit3"] = new Audio("Champions/Ahri/Audio/W_hit.wav");

    this.audio["ECast"] = new Audio("Champions/Ahri/Audio/E_cast.wav");
    this.audio["EVoice"] = new Audio("Champions/Ahri/Audio/E_voice.wav");
    this.audio["EHit"] = new Audio("Champions/Ahri/Audio/E_hit.wav");

    this.audio["RCast"] = new Audio("Champions/Ahri/Audio/R_cast.wav");
    this.audio["RVoice"] = new Audio("Champions/Ahri/Audio/R_voice.wav");
    this.audio["RHit"] = new Audio("Champions/Ahri/Audio/R_hit.wav");

    this.audio["taunt"] = new Audio("Champions/Ahri/Audio/taunt.wav");


    for (var i in this.audio){
        this.audio[i].load();
    }

	Player.call(this, 355, 283, startx, starty, 12, "Ahri");
}
herdaPlayer(Ahri);


Ahri.prototype.draw = function(timestamp){
	this.pdraw(timestamp);
}
Ahri.prototype.autoAttack = function(){
    var damage = 40;
    var speed = 5;
    var range = 250;
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

    var skill = new Projectile(x, y, sx, sy, 6, 6, range, damage, this, this.enemy, true);

    skill.onHitEffect = function(){
        this.caster.audio["AAHit"].play();
    }

    this.skills.push(skill);
    this.cdAA = 1500;
    this.audio["AACast"].play();
}
Ahri.prototype.castQ = function(){
    this.mp -= 40;
	var x, y, sx, sy;
	var speed = 8*dt;
	var range = 200;
    var damage = 40;
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
    var skill = new Projectile(x, y, sx, sy, 6, 6, range, damage, this, this.enemy, false);
    
    skill.onEnd = function(){
    	this.caster.castQback(skill.x, skill.y);
    }
    skill.onHitEffect = function(){
        this.caster.audio["QHit"].play();
    }

    this.skills.push(skill);
    this.audio["QCast"].play();
    this.audio["taunt"].pause();
    this.audio["taunt"].currentTime = 0;
    this.audio["QVoice"].play();
    this.cdQ = 6000;
}
Ahri.prototype.castQback = function(x, y){
	var speed = 9*dt;
	var damage = 50
    var skill = new Projectile(x, y, 0, 0, 6, 6, 0, damage, this, this.enemy, false);

    skill.move = function() {
        this.checkHit();
        var xdist = this.caster.x-this.x;
        var ydist = this.y-(this.caster.y-(this.caster.sizey/2));
        var dist = Math.sqrt((xdist*xdist)+(ydist*ydist));

        this.sx = (speed)* (xdist/dist);
        this.sy = (-speed)* (ydist/dist);

        this.x += this.sx;
        this.y += this.sy;
        
    }

    skill.checkHit = function() {
        var xdist = (this.sizex/2)+ (this.target.sizex/2);
        var ydist;
        if (this.y > this.target.y){
            ydist = this.sizey/2;
        } else {
            ydist = this.sizey/2 + this.target.sizey;
        }

        if ((Math.abs(this.x-this.target.x) < xdist) && (Math.abs(this.y-this.target.y) < ydist)){
            //console.log("acerto mizeravi");
            this.onHit();
        }

        xdist = (this.sizex/2)+ (this.caster.sizex/2);
        ydist;
        if (this.y > this.caster.y){
            ydist = this.sizey/2;
        } else {
            ydist = this.sizey/2 + this.caster.sizey;
        }

        if ((Math.abs(this.x-this.caster.x) < xdist) && (Math.abs(this.y-this.caster.y) < ydist)){
            //console.log("acerto mizeravi");
            this.end = true;
        }
    }
    skill.onHitEffect = function() {
        this.caster.audio["QBHit"].play();
    }
    this.skills.push(skill);
    this.audio["QBCast"].play();

}

Ahri.prototype.castW = function(){
    this.mp -= 50;
    
    var buff = new Buff(6000, this, this.enemy);
    buff.charges = 3;
    buff.insideCD = 0;

    buff.tick = function(timestamp) {
        if (!this.started){
            this.buffLTS = timestamp;
            this.started = true;
        }
        console.log(this.caster.distance(this.target));
        if (this.charges > 0){
            this.insideCD -= (timestamp - this.buffLTS);
            if (this.insideCD <= 0) {
                if (this.caster.distance(this.target) <= 250){
                    this.caster.castWFire(this.charges);
                    this.charges--;
                    this.insideCD = 500;
                }
            }
        } else {
            this.end = true;           
        }
        
        
        this.checkEnd(timestamp);
    }

    this.buffs.push(buff);
    this.audio["WCast"].play();
    this.audio["WVoice"].play();
    this.cdW = 12000;
}

Ahri.prototype.castWFire = function(charges){
    var x, y;
    var speed = 9*dt;
    var damage = 20;
    x = this.x;
    y = this.y - (this.sizey/2);

    var skill = new Projectile(x, y, 0, 0, 6, 6, 0, damage, this, this.enemy, true);

    skill.move = function() {
        
        var xdist = this.target.x-this.x;
        var ydist = this.y-(this.target.y-(this.target.sizey/2));
        var dist = Math.sqrt((xdist*xdist)+(ydist*ydist));

        this.sx = (speed)* (xdist/dist);
        this.sy = (-speed)* (ydist/dist);

        this.x += this.sx;
        this.y += this.sy;

        this.checkHit();
        
    }
    skill.onHitEffect = function(){
        var key = "WHit" + charges;
        this.caster.audio[key].play();
    }
    this.skills.push(skill);
}

Ahri.prototype.castE = function(){
    this.mp -= 60;
    var x, y, sx, sy;
    var speed = 6*dt;
    var range = 220;
    var damage = 50;
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
        this.target.snared = 2000;
        this.caster.audio["EHit"].play();
    }

    this.skills.push(skill);
    this.audio["ECast"].play();
    this.audio["taunt"].pause();
    this.audio["taunt"].currentTime = 0;
    this.audio["EVoice"].play();
    this.cdE = 10000;
}

Ahri.prototype.castR = function() {
    this.mp -= 30;
    if (this.ultCharges > 0){

        var buff = new Buff(200, this, this.enemy);
        var dashSpeed = 15*dt;

        var dashx = dashSpeed
        var dashy = 0;

        if (this.flip) dashx = -dashx;
        if (this.lookingUp){
            dashx = dashx/2;
            dashy = -dashSpeed/2;
        }

        this.casting = 200;
        this.ultCharges--;

        buff.tick = function(timestamp) {
            if (!this.started){
                this.buffLTS = timestamp;
                this.started = true;
            }
            if ((this.caster.x + dashx < (WIDTH-(this.caster.sizex/2))) && (this.caster.x + dashx > (0+(this.caster.sizex/2)))){
                this.caster.x += dashx;
            }
            if (this.caster.y + dashy > (0+(this.caster.sizey))){
                this.caster.y += dashy;
            }
            this.checkEnd(timestamp);
        }

        buff.onEnd = function() {
            if (this.caster.distance(this.target) <= 250){
                this.caster.castRFire();
            }
        }
        
        this.buffs.push(buff);
        this.audio["RCast"].play();
        this.audio["taunt"].pause();
        this.audio["taunt"].currentTime = 0;
        this.audio["RVoice"].play();
    }
    if (this.ultCharges == 0){
        //entra em cd e recarrega
        this.cdR = 20000;
        this.ultCharges = 3;
    }
    
}
Ahri.prototype.castRFire = function() {
    var x, y;
    var speed = 9*dt;
    var damage = 30;
    x = this.x;
    y = this.y - (this.sizey/2);

    var skill = new Projectile(x, y, 0, 0, 6, 6, 0, damage, this, this.enemy, true);

    skill.move = function() {
        
        var xdist = this.target.x-this.x;
        var ydist = this.y-(this.target.y-(this.target.sizey/2));
        var dist = Math.sqrt((xdist*xdist)+(ydist*ydist));

        this.sx = (speed)* (xdist/dist);
        this.sy = (-speed)* (ydist/dist);

        this.x += this.sx;
        this.y += this.sy;

        this.checkHit();
        
    }
    skill.onHitEffect = function(){
        this.caster.audio["RHit"].play();
    }
    this.skills.push(skill);
}
