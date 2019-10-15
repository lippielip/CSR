import React from 'react';

export default function loadingScreen () {
	return (
		<div className="lds" style={{ left: 'calc(50% - 32px)', top: 'calc(50% - 32px)', position: 'absolute' }}>
			<div />
			<div />
			<div />
		</div>
	);
}
