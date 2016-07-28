var Buff = function(duration, caster, target){

	this.target = target;
    this.caster = caster;
	this.duration = duration;
    this.end = false;
    this.started = false;
    this.buffLTS = 0;


    this.tick = function(timestamp) {
        if (!this.started){
            this.buffLTS = timestamp;
            this.started = true;
        }
        this.checkEnd(timestamp);
    }

    this.checkEnd = function(timestamp){

        this.duration -= (timestamp - this.buffLTS);
        if (this.duration <= 0) {
            this.end = true;
            this.onEnd();
        }
        this.buffLTS = timestamp;
    }

    this.onEnd = function(){

    }

}