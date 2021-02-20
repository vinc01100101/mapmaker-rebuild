const React = require("react");
const worker = require("../helpers/webworker-events");
module.exports = class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			imgData: {},
		};
	}
	componentDidMount() {
		worker(
			{ type: "getArrayImgBitmap", names: ["Default 1", "Default 2"] },
			(d) => {
				this.setState({
					imgData: d,
				});
			}
		);
	}
	render() {
		console.log(this.state.imgData);
		return (
			<div className="option-component">
				My Tilesets
				<img src={"data:image/bmp," + this.state.imgData["Default 1"]} />
			</div>
		);
	}
};
