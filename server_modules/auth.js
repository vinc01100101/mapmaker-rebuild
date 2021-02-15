const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require("bcrypt");
const passportSocketIo = require("passport.socketio");
const cookieParser = require("cookie-parser");

module.exports = (app, client, UserModel, io) => {
	//takes the db client to store the sessions
	const store = new MongoStore({ mongooseConnection: client.connection });

	//mount middlewares

	//socketio config

	const onAuthorizeSuccess = (data, accept) => {
		console.log("Successful connection to socket io");
		accept(null, true);
	};
	const onAuthorizeFail = (data, message, error, accept) => {
		if (error) throw new Error(message);
		console.log("Error socket connection: " + message);
		accept(null, false);
	};
	io.use(
		passportSocketIo.authorize({
			store,
			key: "express.sid",
			cookieParser,
			secret: process.env.SESSION_SECRET,
			success: onAuthorizeSuccess,
			fail: onAuthorizeFail,
		})
	);

	//passport config
	app.use(
		session({
			store,
			key: "express.sid",
			secret: process.env.SESSION_SECRET,
			resave: true,
			saveUninitialized: true,
			cookie: { secure: false }, //requires https
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	//serialize deserialize
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});
	passport.deserializeUser((id, done) => {
		UserModel.findById(id, (err, doc) => {
			if (err) {
				console.log("error on _deserializeUser_: " + err);
				done(err);
			} else if (!doc) {
				console.log("non serialized user attempted to connect with id: " + id);
				done(null, false);
			} else {
				done(null, doc); //will be saved to req.user
			}
		});
	});

	//authenticating using local strategy
	passport.use(
		new LocalStrategy((username, password, done) => {
			console.log("Attempting to login- username: " + username);
			UserModel.findOne({ username }, (err, doc) => {
				if (err) {
					console.log("error on _LocalStrategy_: " + err);
					return done(err);
				} else if (!doc) {
					console.log("login failed: invalid username: " + username);
					return done(null, false, {
						message: JSON.stringify({
							message: "Invalid username",
							prevValues: { username },
						}),
					});
				} else if (!bcrypt.compareSync(password, doc.password)) {
					console.log("login failed: invalid password: username: " + username);
					return done(null, false, {
						message: JSON.stringify({
							message: "Wrong password",
							prevValues: { username },
						}),
					});
				} else {
					console.log("login successful: username: " + doc.username);
					return done(null, doc);
				}
			});
		})
	);
};
