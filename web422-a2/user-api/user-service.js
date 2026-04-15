const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favourites: { type: [String], default: [] },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

let connected = false;

async function connect() {
  if (!connected) {
    await mongoose.connect(process.env.MONGO_URL);
    connected = true;
  }
}

module.exports.findUserById = async function findUserById(id) {
  await connect();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findById(id);
};

module.exports.checkUser = async function checkUser(userName, password) {
  await connect();
  const user = await User.findOne({ userName });
  if (!user) throw new Error("invalid user");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("invalid password");
  return user;
};

module.exports.registerUser = async function registerUser(
  userName,
  password,
  password2
) {
  await connect();
  if (password !== password2) {
    throw new Error("passwords do not match");
  }
  const existing = await User.findOne({ userName });
  if (existing) {
    throw new Error("user already exists");
  }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ userName, password: hash, favourites: [] });
};

module.exports.getFavourites = async function getFavourites(userId) {
  await connect();
  const user = await User.findById(userId).lean();
  if (!user) return [];
  return user.favourites || [];
};

module.exports.addToFavourites = async function addToFavourites(userId, workId) {
  await connect();
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favourites: workId } },
    { new: true }
  ).lean();
  return user ? user.favourites : [];
};

module.exports.removeFromFavourites = async function removeFromFavourites(
  userId,
  workId
) {
  await connect();
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favourites: workId } },
    { new: true }
  ).lean();
  return user ? user.favourites : [];
};
