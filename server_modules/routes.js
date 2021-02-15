const passport = require("passport");
const flash = require("express-flash");
const bcrypt = require("bcrypt");

module.exports = (app, UserModel) => {
	app.use(flash());
	//function for checking if the user is authenticated
	const checkIfAuthenticated = (req, res, next) => {
		req.isAuthenticated() ? next() : res.redirect("/");
	};
	//function for checking if the user is NOT authenticated
	const checkIfNotAuthenticated = (req, res, next) => {
		req.isAuthenticated() ? res.redirect("/profile") : next();
	};
	//function for rendering pug
	const renderPug = (res, value) => {
		res.render("../dist/index.pug", value);
	};

	app.get("/", checkIfNotAuthenticated, (req, res) => {
		renderPug(res, { page: "home", errorDom: req.flash("error") });
	});
	//profile page needs to check if user is authenticated
	app.get("/profile", checkIfAuthenticated, (req, res) => {
		renderPug(res, {
			page: "profile",
			user: JSON.stringify({
				username: req.user.username,
				name: req.user.name,
				profilePicture: req.user.profilePicture,
			}),
		});
	});

	app.get("/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});

	app.post(
		"/login",
		checkIfNotAuthenticated,
		passport.authenticate("local", {
			successRedirect: "/profile",
			failureRedirect: "/",
			failureFlash: true,
		})
	);

	app.post(
		"/register",
		checkIfNotAuthenticated,
		(req, res, next) => {
			const username = req.body.username.toLowerCase();
			const regex = /^\w+$/i;

			if (!regex.test(username)) {
				res.send("invalid username");
			} else {
				const hash = bcrypt.hashSync(req.body.password, 12);
				const newDoc = new UserModel({
					username,
					password: hash,
				});
				newDoc.save((err, usr) => {
					if (err) {
						console.log("Error upon creation of the new user doc: " + err);
						//if the error is ValidationError
						//means that username is already exist in db
						const reg = /ValidationError/g;
						if (reg.test(err)) {
							renderPug(res, {
								page: "register",
								errorDom: JSON.stringify({
									message: "username already exists",
									prevValues: { username },
								}),
							});
							return;
						}
						renderPug(res, {
							page: "register",
							errorDom: JSON.stringify({
								message: "username already exists",
								prevValues: { username },
							}),
						});
						return;
					}
					next(null, usr);
				});
			}
		},
		passport.authenticate("local", {
			failureRedirect: "/register",
			successRedirect: "/profile",
			failureFlash: true,
		})
	);
	app.get("/:page", checkIfNotAuthenticated, (req, res) => {
		const page = req.params.page.toLowerCase();

		const autoPages = ["home", "register"];
		autoPages.indexOf(page) !== -1
			? renderPug(res, { page, errorDom: req.flash("error") })
			: res.send("Error 404: Page not found");
	});
};
