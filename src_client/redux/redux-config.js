const React = require("react");
const ReactDOM = require("react-dom");
const Redux = require("redux");
const ReactRedux = require("react-redux");

module.exports = (Component) => {
	//constant action types
	const ADD_MESSAGE = "ADD_MESSAGE";
	const CHANGE_MAIN_SCREEN = "CHANGE_MAIN_SCREEN";
	//actions
	const actAddMessage = (msgData) => {
		return { type: ADD_MESSAGE, msgData };
	};
	const actChangeMainScreen = (mainScreen) => {
		return { type: CHANGE_MAIN_SCREEN, mainScreen };
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
		currMainScreen: "",
	};
	const uiReducer = (state = defaultUiState, action) => {
		switch (action.type) {
			case CHANGE_MAIN_SCREEN:
				//NEVER MUTATE STATES
				const clone = Object.assign({}, state, {
					currMainScreen: action.mainScreen,
				});
				return clone;
				break;
			default:
				return state;
		}
	};

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
	});

	const mapDispatchToProps = (dispatch) => ({
		addMessage: (msgData) => {
			dispatch(actAddMessage(msgData));
		},
		changeMainScreen: (mainScreen) => {
			dispatch(actChangeMainScreen(mainScreen));
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
