import * as React from 'react';
import { Switch, Route } from 'react-router';
import Home from './homepage';
import Table from './table';
import Info from './info';
import Calendar from './calendar';
import User from './profile';
import adminPanel from './adminPanel';
import forgotPassword from './forgotPassword';

function NoMatch ({ location }) {
	return (
		<div>
			<h3>
				<br />
				Error 404: <code>{location.pathname}</code> does not exist
			</h3>
		</div>
	);
}

class ContentPane extends React.Component {
	render () {
		return (
			<Switch>
				<Route exact={true} path={'/'} component={Home} />
				<Route exact={true} path={'/table/'} component={Table} />
				<Route exact={true} path={'/Info/'} component={Info} />
				<Route exact={true} path={'/Calendar/'} component={Calendar} />
				<Route exact={true} path={'/adminPanel/'} component={adminPanel} />
				<Route exact={true} path={'/User/'} component={User} />
				<Route path={'/forgot'} component={forgotPassword} />
				<Route component={NoMatch} />
			</Switch>
		);
	}
}
export default ContentPane;
