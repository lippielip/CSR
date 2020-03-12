import * as React from 'react';
import API_URL from '../variables';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Redirect } from 'react-router';

const MySwal = withReactContent(Swal);

class Attendance extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			redirect: false
		};
	}

	sendData (token, answer) {
		MySwal.fire({
			title: 'Submitting your vote...',
			showCancelButton: false,
			showConfirmButton: false,
			allowOutsideClick: false,
			timerProgressBar: false,
			customClass: 'loadingSize',
			onBeforeOpen: () => {
				Swal.showLoading();
			},
			onOpen: () => {
				setTimeout(() => {
					return fetch(API_URL + '/confirmattendance', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							token: token,
							answer: answer
						})
					})
						.then((response) => {
							if (response.status !== 200) {
								return MySwal.fire({
									icon: 'error',
									title: 'Oops...',
									text: 'Something went wrong!',
									customClass: 'loadingSize',
									showConfirmButton: false,
									onOpen: () => {
										setTimeout(() => {
											MySwal.clickConfirm();
										}, 3000);
									},
									onClose: () => {
										this.setState({ redirect: true });
									}
								});
							}
							return MySwal.fire({
								icon: 'success',
								title: 'Success!',
								text: 'Thank you for voting',
								customClass: 'loadingSize',
								showConfirmButton: false,
								onOpen: () => {
									setTimeout(() => {
										MySwal.clickConfirm();
									}, 2000);
								},
								onClose: () => {
									this.setState({ redirect: true });
								}
							});
						})
						.catch((error) => {
							Swal.showValidationMessage(`Request failed: ${error}`);
						});
				}, 1000);
			}
		});
	}

	async componentDidMount () {
		let token = new URLSearchParams(window.location.search).get('token');
		let answer = new URLSearchParams(window.location.search).get('answer');
		this.sendData(token, answer);
	}
	render () {
		if (this.state.redirect) return <Redirect to="/" />;
		return <div />;
	}
}

export default Attendance;
