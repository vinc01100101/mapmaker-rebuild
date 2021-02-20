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
			case "returned a bitmap":
				callbackId[e.data.cbid](e.data.bitmaps);
				delete callbackId[e.data.cbid];
				break;
		}
	};
} else {
	console.log("Worker API is not supported.. :(");
	window.location.href = "./error/worker-api-not-supported";
}

function postMessage(data, callback) {
	if (callback) {
		const date = new Date();
		const id = date.getTime();
		callbackId[id] = callback;
		data.cbid = id;
	}
	worker.postMessage(data);
}

module.exports = postMessage;
