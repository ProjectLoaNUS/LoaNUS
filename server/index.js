const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const ItemListingsModel = require("./models/ItemListings");
const cors = require("cors");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messsages");
const PORT = process.env.PORT || 3001;

require("dotenv").config();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.json());
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
const user = require("./routes/user");
app.use("/api/user", user);

const items = require("./routes/items/index");
app.use("/api", items);

// Endpoints needed for Chat system
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

const server = app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

// Socket.io server
require("./routes/socket")(app, server);
