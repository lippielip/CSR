import * as React from 'react';
import checkToken from '../methods/checktoken';
import notAuthenticated from '../methods/notAuthenticated';
import loadingScreen from '../methods/loadingscreen';
import categories from '../images/categoryTable.png';
class Info extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isLoading : true
		};
	}
	async componentDidMount () {
		await checkToken();
		await this.setState({ isLoading: false });
	}
	render () {
		if (this.state.isLoading) {
			return loadingScreen();
		} else {
			if (sessionStorage.getItem('authenticated') !== 'true') {
				return notAuthenticated();
			}
			return (
				<div className="container-fluid">
					<h1 className="">How To Colloquium:</h1>
					<blockquote>
						<h2 className="" style={{ marginTop: '40px' }}>
							Categories
						</h2>
						<img src={categories} style={{ width: '60%', marginTop: '40px' }} alt="categories" />
					</blockquote>
					<blockquote>
						<h2>Moderation</h2>
						<br/>
						<h1>*WIP*</h1>
					</blockquote>
				</div>
			);
		}
	}
}

export default Info;
