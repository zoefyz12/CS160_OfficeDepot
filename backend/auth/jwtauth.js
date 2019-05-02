const jwt = require('jsonwebtoken');
const config = require('./jwtconfig');

function generate(email) {
	return jwt.sign(email, config.secret, { expiresIn: '24h' });
};

function validate(req, res, next) {
	// let token = req.headers['x-access-token'] || req.headers['authorization'];
	let token = req.body['x-access-token'] || req.body['authorization'];
	if (token) {
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length);
		}
		jwt.verify(token, config.secret, (err, dec) => {
			if (err) {
				console.log(err);
				return res.status(404).json({
					success: false,
					message: 'Token is not valid'
				});
			} else {
				req.decoded = dec;
				next();
			}
		});
	} else {
		return res.status(404).json({
			success: false,
			message: 'Auth token is not supplied'
		});
	}
};

module.exports = {
	generate,
	validate
}