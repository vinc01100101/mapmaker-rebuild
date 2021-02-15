module.exports = (req, res, next) => {
	console.log(`
Method: ${req.method}
Path: ${req.path}
IP: ${req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress}
Time: ${new Date()}
______________________________
		`);

	next();
};
