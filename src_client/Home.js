const React = require("react");
const ReactDOM = require("react-dom");
const ErrorMessage = require("./components/ErrorMessage");

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
		};
		this._handleOnChange = (e) => {
			this.setState({
				[e.target.id]: e.target.value,
			});
		};
		this._setStateCallback = (key, val) => {
			this.setState({ [key]: val });
		};
	}

	render() {
		return (
			<div>
				<header className="flex-row flex-space-between">
					<div>
						<h1 className="page-title">mapMaker Rebuild</h1>
						<div style={{ margin: 0, display: "inline" }}>v1.0.0</div>
					</div>
					<form action="/login" method="post">
						<input
							required
							type="text"
							id="username"
							name="username"
							placeholder="Username"
							onChange={this._handleOnChange}
							value={this.state.username}
						/>
						<input
							required
							type="password"
							id="password"
							name="password"
							placeholder="Password"
							onChange={this._handleOnChange}
							value={this.state.password}
						/>
						<button type="submit">Login</button>
						<div className="flex-row flex-space-between">
							<ErrorMessage setStateCallback={this._setStateCallback} />
							<a href="#">Forgot password?</a>
						</div>
					</form>
				</header>

				<a href="/register">
					<button>Register</button>
				</a>
			</div>
		);
	}
}

const root = document.querySelector("#root");

ReactDOM.render(<Home />, root);
