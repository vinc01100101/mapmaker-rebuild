const React = require("react");
const Context = require("../../helpers/context-profile");

let map = {
	name: "",
	previewUrl: "",
	tilesetsUsed: [],
	cellSizePixel: 0,
	cellCountX: 0,
	cellCountY: 0,
	render: [], //[{layerName:"name",draw:{7_4:[tileset,sx,sy]}}]
};

class MainComponents extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="mapmaker-main-components">
				<Header />
				<Body />
			</div>
		);
	}
}

class Header extends React.Component {
	render() {
		return (
			<div id="mm-header">
				<select defaultValue="label">
					<option value="label" disabled>
						Sample Tileset
					</option>
				</select>
				<button>Menu</button>
				<input type="range" className="slider" step="2" min="0" max="75" />
				<button>Fullscreen</button>
				<select defaultValue="label">
					<option value="label" disabled>
						Zoom
					</option>
				</select>
				<button>Undo</button>
				<button>Redo</button>
				<button>Bucket</button>
				<button>Pick</button>
				<button>Eraser</button>
			</div>
		);
	}
}
function Body() {
	return (
		<div id="mm-body">
			<LeftPane />
			<MiddlePane />
			<RightPane />
		</div>
	);
}
class LeftPane extends React.Component {
	render() {
		return <div id="mm-left-pane"></div>;
	}
}
class MiddlePane extends React.Component {
	render() {
		return (
			<div id="mm-middle-pane">
				<div id="mm-middle-pane-layers">
					<button id="button-add-layer">+</button>
					<div className="mm-middle-pane-layer">
						Layer 1
						<div>
							<canvas className="layer-preview " width="32" height="32" />
							<input
								type="range"
								className="slider layer-opacity-slider"
								step="2"
								min="0"
								max="75"
							/>
						</div>
					</div>
				</div>
				<div id="mm-middle-pane-animation"></div>
			</div>
		);
	}
}
class RightPane extends React.Component {
	render() {
		return <div id="mm-right-pane"></div>;
	}
}
module.exports = MainComponents;
