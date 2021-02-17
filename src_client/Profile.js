const React = require("react");
const ReactDOM = require("react-dom");
const reduxConfig = require("./redux/redux-config");

//components
const EditProfile = require("./components/EditProfile");
const MapMaker = require("./components/MapMaker");
const MyGallery = require("./components/MyGallery");
const MyTilesets = require("./components/MyTilesets");
const Posts = require("./components/Posts");
const Settings = require("./components/Settings");

//helpers
const Context = require("./helpers/context-profile");

//reference for each width of active option
const userOptions = {
	posts: [44, "[ ]", "#a1b9fc", <Posts />],
	myGallery: [79, "[ ]", "#a3edff", <MyGallery />],
	myTilesets: [85, "[ ]", "#a3ffba", <MyTilesets />],
	mapMaker: [
		82,
		"( )",
		"#e8ffa3",
		<MapMaker _reduxActionCallback={this._reduxActionCallback} />,
	],
	editProfile: [83, "{ }", "#ffa8a3", <EditProfile />],
	settings: [63, "{ }", "#ffa3ff", <Settings />],
};
class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chatInput: "",
		};
		this._handleChanges = (e) => {
			this.setState({
				[e.target.id]: e.target.value,
			});
		};
		this._handleSend = () => {
			chatInput != "" &&
				(() => {
					this.emits("message", this.state.chatInput);
					this.setState({ chatInput: "" });
				})();
		};
		this._reduxActionCallback = (action, value) => {
			value ? this.props[action](value) : this.props[action];
		};
		this._generateUserOptionButtons = (name, sign) => {
			//split between lowercase and uppercase
			let activeName = name.split(/(?=[A-Z][a-z]+)/);
			//capitalize the first letter
			activeName[0] =
				activeName[0].charAt(0).toUpperCase() + activeName[0].slice(1);
			//join with space delimiter
			activeName = activeName.join(" ");

			return (
				<div
					id={name}
					key={name}
					className="user-options"
					onClick={() => {
						this._reduxActionCallback("changeMainScreen", name);
					}}
				>
					<div
						style={{
							transform:
								this.props.currMainScreen == name &&
								`translate(${200 - userOptions[name][0]}px,50%)`,
							opacity: this.props.currMainScreen == name && 0,
						}}
					>
						{name + " " + sign}
					</div>
					<div
						style={{
							fontWeight: "bold",
							transform:
								this.props.currMainScreen == name &&
								`translate(${200 - userOptions[name][0]}px,50%)`,
							opacity: this.props.currMainScreen == name ? 1 : 0,
						}}
					>
						{activeName}
					</div>
				</div>
			);
		};
	}
	componentDidMount() {
		this.emits = require("./helpers/client-emits")(this._reduxActionCallback);
	}
	render() {
		return (
			<div className="flex-row" id="profile-container">
				<div id="user-sideboard" className="no-user-select">
					<div className="flex-row">
						<img
							src="/assets/profile_pictures/default.jpg"
							style={{ width: 80, height: 80 }}
						/>
						<div>
							<div>
								<strong>User Name</strong>
							</div>
							<div>@username</div>
							<a href="#">inbox</a>
						</div>
					</div>
					{
						//generate buttons
						Object.keys(userOptions).map((x) => {
							return this._generateUserOptionButtons(x, userOptions[x][1]);
						})
					}
					<div
						className="user-options"
						onClick={() => {
							window.location.href = "/logout";
						}}
					>
						<div>{"logout ( )"}</div>
					</div>
				</div>
				{/*MAIN SCREEN*/}
				<Context.Provider
					value={{
						reduxActionCallback: this._reduxActionCallback,
						loadOrNew: this.props.loadOrNew,
					}}
				>
					<div id="main-screen">
						{userOptions[this.props.currMainScreen][3]}
					</div>
				</Context.Provider>

				{/*CHAT FUNCTIONALITY*/}
				{/*<ul>
					{this.props.msgData.length > 0 &&
						this.props.msgData.map((x, i) => {
							return (
								<li key={i}>
									<strong>{x.username} </strong> : {x.message}
								</li>
							);
						})}
				</ul>

				<input
					id="chatInput"
					type="text"
					onChange={this._handleChanges}
					value={this.state.chatInput}
				/>
				<button onClick={this._handleSend}>Send</button>
				<br />*/}
			</div>
		);
	}
}

reduxConfig(Profile);
