const React = require("react");
const errorDom = document.querySelector("#errorDom").textContent;

//this component accepts error and setStateCallback props to handle error ui
module.exports = class ErrorMessage extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.errorMessage = "";
		if (errorDom != "") {
			const parsed = JSON.parse(errorDom);
			this.errorMessage = parsed.message;
			this.props.setStateCallback("username", parsed.prevValues.username);
		}
	}
	render() {
		return (
			<div id="error-message" style={{ color: "red" }}>
				{this.props.error || this.errorMessage}
			</div>
		);
	}
};
