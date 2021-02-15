module.exports = (io) => {
	io.on("connection", (socket) => {
		console.log(
			"socket has connected. username: " + socket.request.user.username
		);

		socket.on("message", (message) => {
			io.emit("message", {
				username: socket.request.user.username,
				message,
			});
		});
	});
};
