const React = require("react");
const Context = require("../../helpers/context-profile");

const styles = {
	load: [
		`polygon(0% 0%, 75% 0%, 75% 25%, 100% 25%, 100% 100%,0% 100%)`,
		`polygon(100% 0%, 80% 0%,80% 20%,100% 20%, 100% 0%, 100% 0%)`,
		`rotateX(90deg)`,
		`none`,
		[`5%`, `5%`],
	],
	new: [
		`polygon(0% 0%, 15% 0%,15% 0%,15% 100%, 15% 100%,0% 100%)`,
		`polygon(100% 0%, 20% 0%,20% 0%,20% 100%, 20% 100%,100% 100%)`,
		`rotateZ(-90deg) translateY(-300%)`,
		`rotateY(90deg)`,
		[],
	],
};
class InitialComponents extends React.Component {
	static contextType = Context;

	render() {
		return (
			<div id="mapmaker-initial-components">
				<LoadProject />
				<NewProject />
				<div
					className="ic-text"
					id="ic-text_LOAD"
					style={{
						transform:
							this.context.loadOrNew && styles[this.context.loadOrNew][2],
					}}
				>
					load
				</div>
				<div
					className="ic-text"
					id="ic-text_NEW"
					style={(() => {
						//computed css style
						const s = styles[this.context.loadOrNew];
						return this.context.loadOrNew
							? {
									transform: s[3],
									right: s[4][0],
									top: s[4][1],
							  }
							: {};
					})()}
				>
					new
				</div>
			</div>
		);
	}
}
class LoadProject extends React.Component {
	constructor(props) {
		super(props);
		this._handleOnClick = () => {
			if (this.context.loadOrNew != "load") {
				this.context.reduxActionCallback("mapMakerLoadAndNew", "load");
			}
		};
	}
	static contextType = Context;

	render() {
		return (
			<div
				id="ic-child_LOAD"
				className="ic-child"
				style={{
					clipPath: this.context.loadOrNew && styles[this.context.loadOrNew][0],
					opacity:
						(this.context.loadOrNew == "load" && 1) ||
						(this.context.loadOrNew == "new" && 0),
				}}
				onClick={this._handleOnClick}
			></div>
		);
	}
}
class NewProject extends React.Component {
	constructor(props) {
		super(props);
		this._handleOnClick = () => {
			if (this.context.loadOrNew != "new") {
				this.context.reduxActionCallback("mapMakerLoadAndNew", "new");
			}
		};
	}
	static contextType = Context;
	render() {
		return (
			<div
				id="ic-child_NEW"
				className="ic-child"
				style={{
					clipPath: this.context.loadOrNew && styles[this.context.loadOrNew][1],
					opacity:
						(this.context.loadOrNew == "new" && 1) ||
						(this.context.loadOrNew == "load" && 0),
				}}
				onClick={this._handleOnClick}
			></div>
		);
	}
}

module.exports = InitialComponents;
