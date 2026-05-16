export const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user.toObject ? user.toObject() : user;
  return sanitizedUser;
};
