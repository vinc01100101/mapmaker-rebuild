const page = document.querySelector("#page").textContent;

(() => {
	switch (page) {
		case "home":
			import("./home.js");
			break;
		case "profile":
			import("./profile.js");
			break;
		case "register":
			import("./register.js");
			break;
		default:
			import("./home.js");
			break;
	}
})();
