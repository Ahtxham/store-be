function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
}

// Roles
define('SUPER_ADMIN', 'Super Admin');
define('RESTAURANT', 'Restaurant');
define('ACCOUNTANT', 'Accountant');
define('WAITER', 'Waiter');
define('CUSTOMER', 'Customer');
define('CHEF', 'Chef');
