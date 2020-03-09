import * as React from 'react';
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import API_URL from '../variables';

class Attendance extends React.Component {
	async componentDidMount () {
		let token;
		token = new URLSearchParams(window.location.search).get('token');
		let answer;
		answer = new URLSearchParams(window.location.search).get('answer');
		fetch(API_URL + '/confirmattendance', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: token,
				answer: answer
			})
		});
	}
	render () {
		return (
			<div className="container">
				<Icon path={mdiCheck} size={10} color={'green'} />
				<h2>Thank you for voting.</h2>
			</div>
		);
	}
}

export default Attendance;
