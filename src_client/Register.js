const React = require("react");
const ReactDOM = require("react-dom");
const ErrorMessage = require("./components/ErrorMessage");

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			confirmPassword: "",
			error: null,
		};
		this._handleOnChange = this._handleOnChange.bind(this);
		this._handleSubmit = (e) => {
			e.preventDefault();
			if (this.state.password == this.state.confirmPassword) {
				document.querySelector("#form").submit();
			} else {
				this.setState({
					error: "Passwords don't match",
				});
			}
		};
		this._setStateCallback = (key, val) => {
			this.setState({ [key]: val });
		};
	}

	_handleOnChange(e) {
		if (e.target.id == "username") e.target.style = { border: "none" };
		this.setState({
			[e.target.id]: e.target.value,
		});
	}
	render() {
		return (
			<div>
				<h1>Registration Page</h1>
				<form id="form" action="/register" method="post">
					<ErrorMessage
						error={this.state.error}
						setStateCallback={this._setStateCallback}
					/>
					<input
						required
						type="text"
						id="username"
						name="username"
						placeholder="Username"
						onChange={this._handleOnChange}
						value={this.state.username}
					/>
					<br />
					<input
						required
						type="password"
						id="password"
						name="password"
						placeholder="Password"
						onChange={this._handleOnChange}
						value={this.state.password}
					/>
					<br />
					<input
						required
						type="password"
						id="confirmPassword"
						placeholder="Confirm Password"
						onChange={this._handleOnChange}
						value={this.state.confirmPassword}
					/>
					<br />
					<button onClick={this._handleSubmit}>Submit</button>
				</form>
				<a href="/">
					<button>Back</button>
				</a>
			</div>
		);
	}
}

const root = document.querySelector("#root");

ReactDOM.render(<Register />, root);
