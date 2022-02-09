const { sign } = require("jsonwebtoken");
require("dotenv").config();
const TOKEN_SECRET = process.env.TOKEN_SECRET? process.env.TOKEN_SECRET: "kjhfgdkjhfjdhkhsuhkjhksd";


// returns a jwt
function getToken(user) {
  return sign(
    {
      currentUser: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        status: user.status,
      }
    },
    TOKEN_SECRET,
    //{ expiresIn: '12h' }
  );
}


module.exports = {getToken};