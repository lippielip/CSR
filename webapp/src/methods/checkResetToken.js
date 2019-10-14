import API_URL from '../variables';

export default async function checkResetToken (token) {
	return new Promise(function (resolve, reject) {
		fetch(API_URL + '/checkResetToken', {
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
			if (response.status === 200) {
				resolve(response.status);
			} else {
				resolve(404);
			}
		});
	});
}
