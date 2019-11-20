import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Context from './context/Context';
import reducer from './reducers/reducer';
import * as serviceWorker from './serviceWorker';

const MuiWrapper = () => {
    const initialState = useContext(Context);
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <MuiThemeProvider>
            <Context.Provider value={{ state, dispatch }}>
                <App />
            </Context.Provider>
        </MuiThemeProvider>
    )
};

ReactDOM.render(<MuiWrapper />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
