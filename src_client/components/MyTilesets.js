const React = require("react");
const worker = require("../helpers/webworker-events");
module.exports = class extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {}
	render() {
		return <div className="option-component">My Tilesets</div>;
	}
};
