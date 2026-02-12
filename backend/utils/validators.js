// Email validation
exports.validateEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

// Password validation (min 6 chars)
exports.validatePassword = (password) => {
  return password && password.length >= 6;
};

// Required fields checker
exports.checkRequired = (fields) => {
  for (let key in fields) {
    if (!fields[key]) {
      return `${key} is required`;
    }
  }
  return null;
};