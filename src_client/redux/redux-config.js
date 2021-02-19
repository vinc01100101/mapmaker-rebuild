const React = require("react");
const ReactDOM = require("react-dom");
const Redux = require("redux");
const ReactRedux = require("react-redux");

module.exports = (Component) => {
	//constant action types
	const ADD_MESSAGE = "ADD_MESSAGE";
	const CHANGE_MAIN_SCREEN = "CHANGE_MAIN_SCREEN";
	const MAPMAKER_LOAD_AND_NEW = "MAPMAKER_LOAD_AND_NEW";
	const MANAGE_LAYERS_LOAD = "MANAGE_LAYERS_LOAD";
	const MANAGE_LAYERS_ADD = "MANAGE_LAYERS_ADD";
	const MANAGE_LAYERS_MOVE = "MANAGE_LAYERS_MOVE";
	const MANAGE_LAYERS_DELETE = "MANAGE_LAYERS_DELETE";

	//actions
	const actAddMessage = (msgData) => {
		return { type: ADD_MESSAGE, msgData };
	};
	const actChangeMainScreen = (mainScreen) => {
		return { type: CHANGE_MAIN_SCREEN, mainScreen };
	};
	const actMapMakerLoadAndNew = (loadOrNew) => {
		return {
			type: MAPMAKER_LOAD_AND_NEW,
			loadOrNew,
		};
	};
	const actManageLayers_load = (layers) => {
		return {
			type: MANAGE_LAYERS_LOAD,
			layers,
		};
	};
	const actManageLayers_add = (layerName) => {
		return {
			type: MANAGE_LAYERS_ADD,
			layerName,
		};
	};
	const actManageLayers_move = (layerName) => {
		return {
			type: MANAGE_LAYERS_MOVE,
			layerName,
		};
	};
	const actManageLayers_delete = (layerName) => {
		return {
			type: MANAGE_LAYERS_DELETE,
			layerName,
		};
	};
	//reducers_____
	//for chat
	const defaultChatState = {
		msgData: [],
	};
	const chatReducer = (state = defaultChatState, action) => {
		switch (action.type) {
			case ADD_MESSAGE:
				//NEVER MUTATE STATES
				const clone = Object.assign({}, state, {
					msgData: [...state.msgData, action.msgData],
				});
				return clone;
				break;
			default:
				return state;
		}
	};
	//for ui states
	const defaultUiState = {
		currMainScreen: "posts",
		loadOrNew: "",
		layers: [],
	};
	const uiReducer = (state = defaultUiState, action) => {
		let clone;
		switch (action.type) {
			case CHANGE_MAIN_SCREEN:
				//NEVER MUTATE STATES
				clone = Object.assign({}, state, {
					currMainScreen: action.mainScreen,
				});
				return clone;
				break;
			case MAPMAKER_LOAD_AND_NEW:
				clone = Object.assign({}, state, {
					loadOrNew: action.loadOrNew,
				});
				return clone;
				break;
			case MANAGE_LAYERS_LOAD:
				clone = Object.assign({}, state, { layers: action.layers });
				return clone;
				break;
			default:
				return state;
		}
	};
	//and..for our MAP MAKER!!!!

	//root reducer for multiple reducers
	const rootReducer = Redux.combineReducers({
		chatReducer,
		uiReducer,
	});

	//our redux store
	const store = Redux.createStore(rootReducer);

	//map state and dispatch to props
	const mapStateToProps = (state) => ({
		msgData: state.chatReducer.msgData,
		currMainScreen: state.uiReducer.currMainScreen,
		loadOrNew: state.uiReducer.loadOrNew,
	});

	const mapDispatchToProps = (dispatch) => ({
		addMessage: (value) => {
			dispatch(actAddMessage(value));
		},
		changeMainScreen: (value) => {
			dispatch(actChangeMainScreen(value));
		},
		mapMakerLoadAndNew: (value) => {
			dispatch(actMapMakerLoadAndNew(value));
		},
	});

	//call provider and connect from react-redux
	const Provider = ReactRedux.Provider;
	const connect = ReactRedux.connect;

	const ConnectedComponent = connect(
		mapStateToProps,
		mapDispatchToProps
	)(Component);

	class AppWrapper extends React.Component {
		render() {
			return (
				<Provider store={store}>
					<ConnectedComponent />
				</Provider>
			);
		}
	}

	const node = document.querySelector("#root");
	ReactDOM.render(<AppWrapper />, node);
};
