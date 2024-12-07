function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
}

define('NOT_FOUND', 404);
define('NOT_SUCCESS', 400);
define('SUCCESS', 200);
define('EXCEPTION', 500);
define('TOKEN_EXPIRED', 401);
define('VALIDATION_ERROR', 422);
