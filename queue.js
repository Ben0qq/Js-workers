"use strict";
var queue = [];
var limit = 20;
var freeA = true;
var freeB = true;
var freeC = true;
self.onmessage = function(event) {
    if(event.data.command == "newClient"){
        if(freeA == true){
            postMessage({"command": "sendClient", "client": event.data.value, "official":"A"});
            freeA = false;
        }
        else if(freeB == true){
            postMessage({"command": "sendClient", "client": event.data.value, "official":"B"});
            freeB = false;
        }
        else if(freeC == true){
            postMessage({"command": "sendClient", "client": event.data.value, "official":"C"});
            freeC = false;
        }
        else if(this.queue.length<this.limit){
            this.queue.push(event.data.value);
        }
        else postMessage({"command": "tooLong"});
    }
    if(event.data.command == "update") {
        if(this.queue.length==0)
        {
            if(event.data.tag == "A"){
                freeA = true;
            }
            else if(event.data.tag == "B"){
                freeB = true;
            }
            else if(event.data.tag == "C"){
                 freeC = true;
            }
        }else{
            let element = this.queue.shift();
            postMessage({"command": "sendClient", "client": element, "official":event.data.tag});
        } 
    }
    if(event.data.command == "updateLength"){
        this.limit = event.data.value;
    }
    if(event.data.command == "getOfficials"){
        postMessage({"command": "sendOfficials", "A": this.freeA, "B": this.freeB, "C": this.freeC});
    }
    if(event.data.command == "getLength"){
        this.postMessage({"command": "length", "value": this.queue.length});
    }
}