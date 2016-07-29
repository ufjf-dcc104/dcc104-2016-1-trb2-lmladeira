var Vayne = function(startx, starty) {
    // jumpheight, 
    this.buffQ = false;
    this.buffQR = false;
    this.ultOn = false;
    this.Wstack = 0;
    this.cdAA = 0;
    this.cdQ = 0;
    this.cdW = 0;
    this.cdE = 0;
    this.cdR = 20000;

    this.audio = {};

    this.audio["AACast"] = new Audio("Champions/Vayne/Audio/AA_cast.wav");
    this.audio["AAHit"] = new Audio("Champions/Vayne/Audio/AA_hit.wav");

    this.audio["QCast"] = new Audio("Champions/Vayne/Audio/Q_cast.wav");

    this.audio["WHit"] = new Audio("Champions/Vayne/Audio/W_hit.wav");

    this.audio["ECast"] = new Audio("Champions/Vayne/Audio/E_cast.wav");
    this.audio["EVoice"] = new Audio("Champions/Vayne/Audio/E_voice.wav");
    this.audio["EHit"] = new Audio("Champions/Vayne/Audio/E_hit.wav");

    this.audio["RCast"] = new Audio("Champions/Vayne/Audio/R_cast.wav");
    this.audio["RVoice"] = new Audio("Champions/Vayne/Audio/R_voice.wav");
    this.audio["RLoop"] = new Audio("Champions/Vayne/Audio/R_loop.wav"); this.audio["RLoop"].loop = true;
    this.audio["REnd"] = new Audio("Champions/Vayne/Audio/R_end.wav");

    this.audio["taunt"] = new Audio("Champions/Vayne/Audio/taunt.wav");

    for (var i in this.audio){
        this.audio[i].load();
    }

    Player.call(this, 355, 283, startx, starty, 12, "Vayne");
}
herdaPlayer(Vayne);


Vayne.prototype.draw = function(timestamp){
    if(!this.ultOn|| !this.buffQR)
    this.pdraw(timestamp);
}
Vayne.prototype.autoAttack = function(){
    var damage = 50;
    var speed = 10;
    var range = 250;
    if(this.buffQ){
        damage+= 20;
        this.buffQ = false;
        this.buffQR = false;
    }
    if(this.ultOn){
        damage+=30;
    }
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
        if(this.caster.Wstack < 2) this.caster.Wstack++;
        else{
            this.caster.Wstack=0;
            skill.target.hp -= 20;
            this.caster.audio["WHit"].play();
        }
        this.caster.audio["AAHit"].play();
    }

    this.skills.push(skill);
    this.cdAA = 1000;
    this.audio["AACast"].play();
}

Vayne.prototype.castQ = function(){
    this.mp-= 30;
    var buff = new Buff(200, this, this.enemy);
    var dashSpeed = 8*dt;
    if (this.flip) dashSpeed = -dashSpeed;
    this.casting = 200;
    this.buffQ = true;
    if(this.ultOn){
        this.buffQR = true;
    }

    buff.tick = function(timestamp) {
        if (!this.started){
            this.buffLTS = timestamp;
            this.started = true;
        }
        if ((this.caster.x + dashSpeed < (WIDTH-(this.caster.sizex/2))) && (this.caster.x + dashSpeed > (0+(this.caster.sizex/2)))){
            this.caster.x += dashSpeed;
        }
        this.checkEnd(timestamp);
    }   
    
    buff.onEnd = function(){
       
    }

    this.buffs.push(buff);
    this.cdQ = 3000;
    this.audio["QCast"].play();
}

Vayne.prototype.castW = function(){
    
}

Vayne.prototype.castE = function(){
    var range = 220;
    if (this.distance(this.enemy) <= range){
        this.mp-= 50;
        var x, y;
        var speed = 10*dt;
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
            var debuff =  new Buff(200, this.caster, this.target);
            var dashSpeed = 15*dt;
            if (this.x > this.target.x) dashSpeed = -dashSpeed;

            this.target.casting = 200;
            this.caster.audio["EHit"].play();

            debuff.tick = function(timestamp) {
                if (!this.started){
                    this.buffLTS = timestamp;
                    this.started = true;
                }


                if (this.target.x + dashSpeed > (WIDTH-(this.target.sizex/2)) ){
                    this.target.x = (WIDTH-(this.target.sizex/2));
                    this.end = true;
                    this.target.casting = 0;
                    this.target.stunned = 2000;
                } else if (this.target.x + dashSpeed < (0+(this.target.sizex/2))){
                    this.target.x = (0+(this.target.sizex/2));
                    this.end = true;
                    this.target.casting = 0;
                    this.target.stunned = 2000;
                } else {
                    this.target.x += dashSpeed;
                }

                this.checkEnd(timestamp);
            }

            this.target.buffs.push(debuff);

        }
        this.skills.push(skill);
        this.cdE = 10000;
        this.audio["ECast"].play();
        this.audio["taunt"].pause();
        this.audio["taunt"].currentTime = 0;
        this.audio["EVoice"].play();
    }
}

Vayne.prototype.castR = function(){
    this.mp-= 100;
    var buff = new Buff(10000, this, this.enemy);
    this.ultOn = true;

    buff.tick = function(timestamp) {
        if (!this.started){
            this.buffLTS = timestamp;
            this.started = true;
        }
        this.checkEnd(timestamp);
    }

    buff.onEnd = function(){
        this.caster.ultOn = false;   
        this.caster.audio["RLoop"].pause();     
        this.caster.audio["REnd"].play();
    }


    this.audio["RCast"].play();
    this.audio["RVoice"].play();
    this.audio["RLoop"].play();
    this.cdR = 25000;

    this.buffs.push(buff);    
}