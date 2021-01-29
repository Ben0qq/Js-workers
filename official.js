"use strict";

var free = true;
var name;
function send(){
    postMessage({"command": "free","tag": this.name});
}
self.onmessage = function(event) {
    if (event.data.command == "serveClient") {
        this.name = event.data.tag;
        this.setTimeout(this.send,event.data.client);
    }
}