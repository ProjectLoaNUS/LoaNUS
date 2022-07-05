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

// Search function
app.get("/api/search", async (request, response) => {
  try {
    const query = request.query;
    let results;
    if (query.name) {
      let resultData;
      if (query.isFullSearch === "true") {
        if (query.isImageOnly === "true") {
          resultData = {
            images: 1,
          };
        } else if (query.isTextOnly === "true") {
          resultData = {
            _id: 1,
            title: 1,
            category: 1,
            description: 1,
            location: 1,
            date: 1,
            listedBy: 1,
            deadline: 1,
            borrowedBy: 1,
          };
        } else {
          resultData = {
            _id: 1,
            title: 1,
            category: 1,
            description: 1,
            location: 1,
            date: 1,
            listedBy: 1,
            deadline: 1,
            images: 1,
            borrowedBy: 1,
          };
        }
      } else {
        resultData = {
          title: 1,
          borrowedBy: 1,
          _id: 1,
        };
      }
      results = await ItemListingsModel.aggregate([
        {
          $search: {
            index: "listings",
            autocomplete: {
              query: `${query.name}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
              },
              tokenOrder: "sequential",
            },
          },
        },
        {
          $limit: 15,
        },
        {
          $project: resultData,
        },
      ]);
      if (results) {
        return response.json({ status: "ok", results: results });
      }
    }
    response.json({ status: "error" });
  } catch (error) {
    console.log(error);
    response.json({ status: "error" });
  }
});
// Search function
app.get("/api/search-exact", async (request, response) => {
  try {
    const query = request.query;
    if (!query.id) {
      return response.json({ status: "error" });
    }
    const result = await ItemListingsModel.findOne({
      _id: query.id,
    });
    if (result) {
      return response.json({ status: "ok", result: result });
    }
    response.json({ status: "error" });
  } catch (error) {
    console.log(error);
    response.json({ status: "error" });
  }
});

// Endpoints needed for Chat system
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

const server = app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

// Socket.io server
require("./routes/socket")(app, server);
