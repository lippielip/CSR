import API_URL from '../variables';

export default async function checkResetToken (token) {
	await fetch(API_URL + '/checkResetToken', {
		method  : 'POST',
		headers : {
			'Content-Type' : 'application/json'
		},
		body    : JSON.stringify({
			username : sessionStorage.getItem('username'),
			token    : token
		})
	}).then((res) => {
		const response = res;
		return response;
	});
}
