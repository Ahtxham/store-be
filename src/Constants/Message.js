function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
}

// General Messages
define('REQUEST_SUCCESSFUL', 'Request successful.');
define('INVALID_PASSWORD', 'Invalid password.');
define('LOGIN_SUCCESS', 'You are successfully logged in.');
define('WENT_WRONG', 'Something went wrong!');
define('EMAIL_RECEIVED_SHORTLY', 'You will receive an email shortly.');
define('MISSING_PARAMETER', 'Missing Parameter.');
define('AUTHENTICATION_FAILED', 'Authentication Failed!');
define('PERMISSION_DENIED', "You don't have perrmission for this operation!");
define('VERIFICATION_PENDING', "Verification is pending for this account!");
define('ALREADY_EXIST', 'Already exist!');
define('INVALID_TOKEN', 'Invalid Token!');
define('INVALID_USER', 'Invalid User!');
define('TOKEN_EXPIRED', 'Token Expired!');
define('APPROVED', 'Approved!');

// User Messages
define('USER_NOT_EXIST', 'User does not exist.');
define(
  'USER_NOT_EXIST_SOCIAL',
  'User does not exist. Please contact your admin to create an account.'
);
define('USER_ADDED_SUCCESS', 'User was added successfully.');
define('EMAIL_EXIST', 'Oops - email already exists.');
define('EMAIL_NOT_EXIST', 'Email does not exist.');
define('DUPLICATE_USERNAME_EMAIL', 'Duplicate Username or Emails');

// Image Messages
define('IMAGE_UPDATE_SUCCESS', 'Image was updated successfully.');
define('IMAGE_UPLOAD_SUCCESS', 'Image was uploaded successfully.');
define('IMAGE_REMOVED_SUCCESS', 'Image was removed successfully.');

// File Messages
define('FILE_REQUIRED', 'File required.');
define('FILE_UPDATE_SUCCESS', 'File was updated successfully.');
define('FILE_UPLOAD_SUCCESS', 'File was uploaded successfully.');
define('FILE_REMOVED_SUCCESS', 'File was removed successfully.');

// Email Subjects
define('REGISTER_SUCCESS', 'Registration Successful!');
define('RESET_PASSWORD', 'Reset Password!');
