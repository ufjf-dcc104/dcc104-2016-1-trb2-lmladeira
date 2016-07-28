var Vayne = function(startx, starty) {
    // jumpheight, 
    this.buffQ = false;
    this.ultOn = false;
    this.Wstack = 0;
    this.cdQ = 0;
    this.cdW = 0;
    this.cdE = 0;
    this.cdR = 20000;
    Player.call(this, 355, 283, startx, starty, 10, "Vayne");
}
herdaPlayer(Vayne);


Vayne.prototype.draw = function(timestamp){
    this.pdraw(timestamp);
}
Vayne.prototype.autoAttack = function(){
    var damage = 50;
    var speed = 10;
    var range = 250;
    if(this.buffQ){
        damage+= 20;
        this.buffQ = false;
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
        }
    }

    this.skills.push(skill);
}

Vayne.prototype.castQ = function(){
    this.mp-= 30;
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
    
    buff.onEnd = function(){
        this.caster.buffQ = true;
    }

    this.buffs.push(buff);
    this.cdQ = 3000;
}

Vayne.prototype.castW = function(){
    
}

Vayne.prototype.castE = function(){
    this.mp-= 50;
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
    this.cdE = 10000;
}

Vayne.prototype.castR = function(){
    this.mp-= 100;
    var buff = new Buff(6000, this, this.enemy);
    this.ultOn = true;

    buff.onEnd = function(){
        this.caster.ultOn = false;
    }
    
    this.buffs.push(buff);
    this.cdR = 20000;
}