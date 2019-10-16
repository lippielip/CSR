import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './routes/router';
import './assets/stylesheets/index.css';
import './assets/stylesheets/App.css';
require('bootstrap');
function App () {
	return (
		<div className="App">
			<Routes />
		</div>
	);
}
ReactDOM.render(App(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
