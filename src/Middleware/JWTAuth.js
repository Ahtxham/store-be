//  JSON Web Token
const JWT = require('jsonwebtoken');

const response = require("../Services/Response.js");
const ResponseCode = require("../Constants/ResponseCode.js");

module.exports = (req, res, next) => {
	try 
	{
		const token = req.headers.authorization.split(" ")[1]
		const user = JWT.verify(token, process.env.JWT_SECRET);
		req.user = user;
		next();
	} 
	catch (error) 
	{   
		return response.sendError(res, 'Authentication failed. Token has been expired.', [], ResponseCode.TOKEN_EXPIRED);
	}
};