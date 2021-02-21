const React = require("react");
const Context = require("../../helpers/context-profile");
const worker = require("../../helpers/webworker-events");

let map = {
	name: "",
	previewUrl: "",
	tilesetsUsed: [],
	cellSizePixel: 0,
	cellCountX: 0,
	cellCountY: 0,
	render: [], //[{layerName:"name",draw:{7_4:[tileset,sx,sy]}}]
};
//doms
const DOMS = {};
const STYLES = {
	"tileset-canvas-container": {
		dragInitial: [0, 0],
		translate: [0, 0],
		zoomScale: 1,
	},
	"render-canvas-container": {
		dragInitial: [0, 0],
		translate: [0, 0],
		zoomScale: 1,
	},
};
class MainComponents extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		DOMS["tileset-canvas-container"] = document.querySelector(
			"#tileset-canvas-container"
		);
		DOMS["render-canvas-container"] = document.querySelector(
			"#render-canvas-container"
		);
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

const optionsGenerator = (arr) => {
	return arr.map((name, i) => {
		return (
			<option key={i} value={name}>
				{name}
			</option>
		);
	});
};

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tilesetOptionsElement: null,
			tilesetSelected: "",
		};
		this._renderTileset = (name) => {
			//get the bitmap from the worker first
			worker(
				[{ type: "getArrayImgBitmap", names: [name], group: "tilesets" }],
				//the callback
				(data) => {
					const w = data[name].width;
					const h = data[name].height;
					const c = document.querySelector("#tileset-canvas");
					c.width = w;
					c.height = h;
					DOMS["tileset-canvas-container"].style.width = w + "px";
					DOMS["tileset-canvas-container"].style.height = h + "px";

					const ctx = c.getContext("2d");
					ctx.clearRect(0, 0, w, h);
					ctx.drawImage(data[name], 0, 0);
				}
			);
		};
		this._handleOnChange = (e) => {
			const value = e.target.value;
			this.setState({
				[e.target.id]: value,
			});

			//draw the tileset on the canvas
			if (e.target.id == "tilesetSelected") {
				this._renderTileset(value);
			}
		};
	}
	componentDidMount() {
		worker([{ type: "getKeyNames", group: "tilesets" }], (names) => {
			this.setState({
				tilesetOptionsElement: optionsGenerator(names),
			});
			this._renderTileset("Default 1");
		});
	}
	render() {
		return (
			<div id="mm-header">
				<select
					id="tilesetSelected"
					onChange={this._handleOnChange}
					value={this.state.tilesetSelected}
				>
					{this.state.tilesetOptionsElement}
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
const updateTransform = (id) => {
	DOMS[
		id
	].style.transform = `translate(${STYLES[id].translate[0]}px,${STYLES[id].translate[1]}px) scale(${STYLES[id].zoomScale})`;
};
const zoomFunction = (e) => {
	e.preventDefault();

	const id = e.target.id;
	const zoomValue = 0.2;
	const offs = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
	const containerSize = [
		parseInt(DOMS[id].style.width),
		parseInt(DOMS[id].style.height),
	];

	if (e.deltaY < 0) {
		//ZOOM IN
		if (parseFloat(STYLES[id].zoomScale.toFixed(1)) < 2) {
			STYLES[id].zoomScale += zoomValue;
			STYLES[id].translate = [
				STYLES[id].translate[0] + (containerSize[0] / 2 - offs[0]) * zoomValue,
				STYLES[id].translate[1] + (containerSize[1] / 2 - offs[1]) * zoomValue,
			];
		}
	} else {
		//ZOOM OUT
		if (parseFloat(STYLES[id].zoomScale.toFixed(1)) > 0.2) {
			STYLES[id].zoomScale -= zoomValue;
			STYLES[id].translate = [
				STYLES[id].translate[0] - (containerSize[0] / 2 - offs[0]) * zoomValue,
				STYLES[id].translate[1] - (containerSize[1] / 2 - offs[1]) * zoomValue,
			];
		}
	}

	updateTransform(id);
};

const dragDown = (e) => {
	e.preventDefault();
	const id = e.target.id;

	STYLES[id].dragInitial = [
		e.clientX - STYLES[id].translate[0],
		e.clientY - STYLES[id].translate[1],
	];

	updateTransform(id);
};

const dragMove = (e) => {
	const id = e.target.id;
	//right click or Drag function
	if (e.buttons == 2) {
		STYLES[id].translate = [
			e.clientX - STYLES[id].dragInitial[0],
			e.clientY - STYLES[id].dragInitial[1],
		];
	}
	updateTransform(id);
};
class LeftPane extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div id="mm-left-pane">
				<div
					id="tileset-canvas-container"
					onWheel={zoomFunction}
					onMouseMove={dragMove}
					onMouseDown={dragDown}
				>
					<canvas id="tileset-canvas" />
				</div>
			</div>
		);
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
		return (
			<div id="mm-right-pane">
				<div id="render-canvas-container">
					<canvas id="render-canvas" />
				</div>
			</div>
		);
	}
}
module.exports = MainComponents;
