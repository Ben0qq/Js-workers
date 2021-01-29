"use strict";
var mean=2;
var stdev=3;
var g;
var mu=4;
var expScale=5;
this.g = this.gaussian(this.mean, this.stdev)
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;               
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }
       var retval = mean + stdev * y1;
       if(retval > 0) 
           return retval;
       return -retval;
   }
}
function exponential(mu, scale) {
    var u = Math.random();
    return scale* (-Math.log(1.0 - u) / mu);
}
function newClient(){
    postMessage({"command": "new", "client": g()*1000});
    this.setTimeout(newClient, this.exponential(mu, expScale)*1000);
}
self.onmessage = function(event) {
    if (event.data.command == "updateGauss1") {
        this.mean = event.data.value;
        this.g = this.gaussian(this.mean, this.stdev);
    }
    if (event.data.command == "updateGauss2") {
        this.stdev = event.data.value;
        this.g = this.gaussian(this.mean, this.stdev);
    }
    if (event.data.command == "updateExp1") {
        this.mu = event.data.value;
    }
    if (event.data.command == "updateExp2") {
        this.scale = event.data.value;
    }
}

this.newClient();