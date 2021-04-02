const check = (req, res, next) => {
  const { username, password } = req.body;
  const PASSWORD_PATERN = /^[a-zA-Z0-9]{5,}$/gm;
  const ACCOUNT_PATERN = /^[a-zA-Z0-9]{5,}$/gm;

  if (!ACCOUNT_PATERN.test(username)) {
    const msg = 'Username must be more than 5 characters. Please try again!!!';
    return res.redirect(`/auth/login?msg=${msg}`);
  }

  if (!PASSWORD_PATERN.test(password)) {
    const msg = 'Password is not valid. Please try again!!!';
    return res.redirect(`/auth/login?msg=${msg}`);
  }

  return next();
};

module.exports = { check };
