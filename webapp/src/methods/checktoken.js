import API_URL from '../variables';

export default async function checkToken () {
	await fetch(API_URL + '/checkToken', {
		method  : 'POST',
		headers : {
			'Content-Type' : 'application/json'
		},
		body    : JSON.stringify({
			username : sessionStorage.getItem('username'),
			token    : sessionStorage.getItem('token')
		})
	})
		.then((response) => response.json())
		.then((res) => {
			const response = res;
			sessionStorage.setItem('authenticated', response.authenticated);
			sessionStorage.setItem('Authentication_Level', response.Authentication_Level);
			sessionStorage.setItem('Pending_Presentation', response.Pending_Presentation);
		});
}
