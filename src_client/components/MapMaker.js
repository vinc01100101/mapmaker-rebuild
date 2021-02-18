const React = require("react");
const InitialComponents = require("./MapMaker/InitialComponents");
const MainComponents = require("./MapMaker/MainComponents");

//mutable map layers
let layers = [];

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="option-component" id="option-component_MAPMAKER">
				<InitialComponents />
			</div>
		);
	}
};
