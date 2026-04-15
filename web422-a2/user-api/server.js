require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");

const userService = require("./user-service");

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, next) => {
      try {
        const user = await userService.findUserById(jwt_payload._id);
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      } catch (err) {
        next(err, false);
      }
    }
  )
);

const app = express();
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.post("/api/user/register", async (req, res) => {
  try {
    await userService.registerUser(
      req.body.userName,
      req.body.password,
      req.body.password2
    );
    res.status(200).json({ message: "registered" });
  } catch (err) {
    res.status(422).json({ message: err.message || "registration failed" });
  }
});

app.post("/api/user/login", async (req, res) => {
  try {
    const user = await userService.checkUser(
      req.body.userName,
      req.body.password
    );
    const payload = {
      _id: user._id,
      userName: user.userName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({
      message: { token },
    });
  } catch (err) {
    res.status(422).json({ message: err.message || "login failed" });
  }
});

app.get(
  "/api/user/favourites",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const list = await userService.getFavourites(req.user._id);
      res.status(200).json(list);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

app.put(
  "/api/user/favourites/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const list = await userService.addToFavourites(req.user._id, req.params.id);
      res.status(200).json(list);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

app.delete(
  "/api/user/favourites/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const list = await userService.removeFromFavourites(
        req.user._id,
        req.params.id
      );
      res.status(200).json(list);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`User API listening on ${port}`);
  });
}

module.exports = app;
