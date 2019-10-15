import React from 'react';

export default function NoMatch ({ location }) {
	return (
		<div>
			<h3>
				<br />
				Error 404: <code>{location.pathname}</code> does not exist
			</h3>
		</div>
	);
}
