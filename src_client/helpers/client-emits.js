const socket = io();

module.exports = (reduxActionCallback) => {
	socket.on("message", (msgData) => {
		reduxActionCallback("addMessage", msgData);
	});

	return (action, data) => {
		socket.emit(action, data);
	};
};
