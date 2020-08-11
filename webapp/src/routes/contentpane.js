import * as React from 'react';
import { Switch, Route } from 'react-router';
import Home from './homepage';
import Table from './table';
import Info from './info';
import Calendar from './calendar';
import User from './profile';
import adminPanel from './adminPanel';
import NoMatch from '../methods/noMatch';
import notAuthenticated from '../methods/notAuthenticated';
import UserTable from './adminRoutes/userPanel';
import confirmattendance from '../routes/attendance';
class ContentPane extends React.Component {
	render () {
		return (
			<Switch>
				<Route exact={true} path={'/'} component={Home} />
				<Route exact={true} path={'/table/'} component={Table} />
				<Route exact={true} path={'/Info/'} component={Info} />
				<Route exact={true} path={'/Calendar/'} component={Calendar} />
				<Route exact={true} path={'/adminPanel/'} component={adminPanel} />
				<Route exact={true} path={'/adminPanel/users'} component={UserTable} />
				<Route exact={true} path={'/User/'} component={User} />
				<Route exact={false} path={'/confirmattendance'} component={confirmattendance} />
				<Route exact={true} path={'/NoAuth'} component={notAuthenticated} />
				<Route component={NoMatch} />
			</Switch>
		);
	}
}
export default ContentPane;
