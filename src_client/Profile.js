const React = require("react");
const ReactDOM = require("react-dom");
const reduxConfig = require("./redux/redux-config");

//name of each option buttons
const userOptions = [
	"posts []",
	"myGallery []",
	"myTilesets []",
	"mapMaker ()",
	"editProfile {}",
	"settings {}",
];
//reference for each width of active option
const widthRef = {
	posts: 44,
	myGallery: 79,
	myTilesets: 85,
	mapMaker: 82,
	editProfile: 83,
	settings: 63,
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
								`translate(${200 - widthRef[name]}px,50%)`,
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
								`translate(${200 - widthRef[name]}px,50%)`,
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
				<div id="user-sideboard">
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
						userOptions.map((x) => {
							x = x.split(" ");
							return this._generateUserOptionButtons(...x);
						})
					}
					<div
						className="user-options"
						onClick={() => {
							window.location.href = "/logout";
						}}
					>
						<div>{"logout ()"}</div>
					</div>
				</div>
				<div id="main-screen"></div>
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
