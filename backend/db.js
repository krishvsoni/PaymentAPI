const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://krishsoni:2203031050659@paytm.aujjoys.mongodb.net/")


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
