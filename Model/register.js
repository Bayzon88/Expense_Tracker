function registerModel(req) {
  let registerObject = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };
  return registerObject;
}

module.exports = { registerModel: registerModel };
