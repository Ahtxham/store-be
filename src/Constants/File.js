function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
}

// Formats
define('PDF', 'application/pdf');
define('JPEG', 'image/jpeg');
define('JPG', 'image/jpg');
define('PNG', 'image/png');
