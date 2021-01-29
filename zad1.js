//@ts-check
"use strict";
var clientsWorker;
var queueWorker;
var officialAWorker;
var officialBWorker;
var officialCWorker;
var rejected = 0;
var accepted = 0;
var isFull;
var isEmpty;
var freeA=true;
var freeB=true;
var freeC=true;
var length = 0;
var clientFromQueue;
var name;
var ready = true;

function startClientsWorker(clientsWorker) {
        clientsWorker = new Worker("clients.js");
        clientsWorker.onmessage = function(event){
            if (event.data.command == "new") {
                queueWorker.postMessage({"command": "newClient", "value": event.data.client});
                queueWorker.postMessage({"command":"getOfficials"});
                queueWorker.postMessage({"command":"getLength"});
            } 
        };  
        return clientsWorker;    
}
function startQueueWorker(worker) {
        worker = new Worker("queue.js");
        worker.onmessage = function(event){
            if(event.data.command == "sendClient"){
                if(event.data.official == "A"){
                    officialAWorker.postMessage({"command":"serveClient","client":event.data.client,"tag":"A"});
                }else if(event.data.official == "B") {
                    officialBWorker.postMessage({"command":"serveClient","client":event.data.client,"tag":"B"});
                }else if(event.data.official == "C") {
                    officialCWorker.postMessage({"command":"serveClient","client":event.data.client,"tag":"C"});
                }
                queueWorker.postMessage({"command":"getOfficials"});
                queueWorker.postMessage({"command":"getLength"});
            }
            if(event.data.command == "sendOfficials"){
                if(event.data.A == true) document.getElementById("official1").textContent="Urzędnik A: wolny";
                else document.getElementById("official1").textContent="Urzędnik A: zajęty";
                if(event.data.B == true) document.getElementById("official2").textContent="Urzędnik B: wolny";
                else document.getElementById("official2").textContent="Urzędnik B: zajęty";
                if(event.data.C == true) document.getElementById("official3").textContent="Urzędnik C: wolny";
                else document.getElementById("official3").textContent="Urzędnik C: zajęty";
            }
            if(event.data.command == "tooLong"){
                rejected++;
                document.getElementById("failed").textContent="Odrzuceni: " + rejected;
            }
            if(event.data.command == "length"){
                document.getElementById("queue").textContent="Długość kolejki: "+event.data.value;
            }
        };  
        return worker;    
}

function startOfficialWorker(worker) {
        worker = new Worker("official.js");
        worker.onmessage = function(event){
            if (event.data.command == "free") {
                accepted++;
                document.getElementById("succeeded").textContent="Obsłużeni: " + accepted;
                queueWorker.postMessage({"command":"update","tag":event.data.tag});
                queueWorker.postMessage({"command":"getOfficials"});
                queueWorker.postMessage({"command":"getLength"});
            }
        }; 
        return worker;     
}

function stopWorker(worker){
    worker.terminate();
    worker = undefined;
}

window.addEventListener("load",function(){
    queueWorker = startQueueWorker(queueWorker);
    officialAWorker = startOfficialWorker(officialAWorker);
    officialBWorker = startOfficialWorker(officialBWorker);
    officialCWorker = startOfficialWorker(officialCWorker);
    clientsWorker = startClientsWorker(clientsWorker);
});

function changeQueue(){
    queueWorker.postMessage({"command": "updateLength", "value": parseInt(document.getElementById("inputQueue").value)});
}

function changeGauss(){
    clientsWorker.postMessage({"command": "updateGauss1", "value": parseInt(document.getElementById("gaussParameter").value)});
}

function changeExp(){
    clientsWorker.postMessage({"command": "updateGauss2", "value": parseInt(document.getElementById("gaussParameter2").value)});
}

function changeGauss2(){
    clientsWorker.postMessage({"command": "updateExp1", "value": parseInt(document.getElementById("expParameter").value)});
}

function changeExp2(){
    clientsWorker.postMessage({"command": "updateExp2", "value": parseInt(document.getElementById("expParameter2").value)});
}