//main purpose of this helper is to add callback when response from
//worker is needed by other components, callbacks are stored in an object
//with unique id

console.log("web worker event handler module has been loaded");

//where we store callbacks with id properties
const callbackId = {};

let worker = null;

if (window.Worker) {
	console.log("Worker API is supported! :)");
	worker = new Worker("./webWorker.js");
	worker.onmessage = (e) => {
		switch (e.data.type) {
			case "to bitmap success":
				console.log("Success storing file: " + e.data.name);
				break;
		}
		//if the data has callback from main thread,
		//call it then delete it
		if (e.data.cbid) {
			callbackId[e.data.cbid](e.data.value);
			delete callbackId[e.data.cbid];
		}
	};
} else {
	console.log("Worker API is not supported.. :(");
	window.location.href = "./error/worker-api-not-supported";
}

function postMessage(data, callback) {
	//if callback function is passed
	//generate id using time miliseconds
	//and use it as property that holds callback as value
	if (callback) {
		const date = new Date();
		const id = date.getTime();
		callbackId[id] = callback;
		data[0].cbid = id;
	}
	worker.postMessage(...data);
}

module.exports = postMessage;
