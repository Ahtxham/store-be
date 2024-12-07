const Contact = require('../Models/Contact');
const Response = require('../Services/Response');
const mongoose = require('mongoose');

exports.index = async (req, res) => {
  const results = await Contact.find({}).exec();
  return Response.sendResponse(res, [], results);
};

exports.store = async (req, res, next) => {
  let request = req.body;

  if (!request.username)
    return Response.sendError(res, 'The user name field is required.', [], 422);
  if (!request.email) return Response.sendError(res, 'The email field is required.', [], 422);
  if (!request.message) return Response.sendError(res, 'The message field is required.', [], 422);

  const contact = await new Contact({
    _id: new mongoose.Types.ObjectId(),
    username: request.username,
    email: request.email,
    message: request.message,
  });
  contact.save();

  return Response.sendResponse(res, 'Message sent.');
};
