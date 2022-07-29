const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');

const PORT = process.env.PORT || 3001;

require("dotenv").config();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: "50mb" }));
//const client = new MongoClient(
// "mongodb+srv://loanus123:loanushyyb123@loanus-database.csjkq.mongodb.net/loanusdatabase?retryWrites=true&w=majority"
//);
//client.connect();
app.use(cors());

mongoose.connect(
  "mongodb+srv://loanus123:loanushyyb123@loanus-database.csjkq.mongodb.net/loanusdatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Start express server
const server = app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

// Socket.io server
const socketUtils = require("./routes/socket")(app, server);

const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

const conversationRoutes = require("./routes/conversations");
app.use("/api/conversations", conversationRoutes);

const messageRoutes = require("./routes/messsages");
app.use("/api/messages", messageRoutes);

const followingRoutes = require("./routes/following")(socketUtils);
app.use("/api/follow", followingRoutes);

const rewardRoutes = require("./routes/rewards");
app.use("/api/reward", rewardRoutes);

const itemsRoutes = require("./routes/items/index")(socketUtils);
app.use("/api", itemsRoutes);