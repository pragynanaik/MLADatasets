var MongoUtil = require("mongoUtil");

const express = require("express");
const app = express();

__dirname = "/Users/pragynanaik/Desktop/MLWebsite/MLAthleteWebsite";
const filteringInput = {};

let converter = require("json-2-csv");
const fs = require("fs");

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

MongoUtil.connectToServer(function (err, client) {
  if (err) console.log(err);
  // start the rest of your app here

  app.listen(3000, () => {
    console.log(
      "connected to mongoDB successfully. now listening on port 3000 "
    );
  });

  dbo = MongoUtil.getDb();

  app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
    filteringInput = {};
  });

  app.post("/", function (request, response) {
    delete filteringInput["Gender"];
    delete filteringInput["Round Number"];
    delete filteringInput["MatchType"];
    delete filteringInput["Date"];
    delete filteringInput["$or"];
  });

  app.post("/clickedGender", function (request, response) {
    if (request.body.Gender == "Both") {
      delete filteringInput["Gender"];
    } else {
      filteringInput["Gender"] = request.body.Gender;
    }
    dbo
      .collection("allYear")
      .find(filteringInput)
      .toArray(function (err, result) {
        if (err) return console.log(err);
        response.send({ Gender: result.length });
      });
  });

  app.post("/clickedRound", function (request, response) {
    if (request.body["Round Number"] == "Any Round") {
      delete filteringInput["Round Number"];
    } else {
      filteringInput["Round Number"] = request.body["Round Number"];
    }
    dbo
      .collection("allYear")
      .find(filteringInput)
      .toArray(function (err, result) {
        if (err) return console.log(err);

        response.send({ "Round Number": result.length });
      });
  });

  app.post("/clickedMatch", function (request, response) {
    if (request.body["Match Type"] == "Any Match") {
      delete filteringInput["MatchType"];
    } else {
      filteringInput["MatchType"] = request.body["Match Type"];
    }

    dbo
      .collection("allYear")
      .find(filteringInput)
      .toArray(function (err, result) {
        if (err) return console.log(err);

        response.send({ "Match Type": result.length });
      });
  });

  app.post("/clickedDate", function (request, response) {
    const constraints = request.body["Date"];

    if (constraints.length == 0) {
      delete filteringInput["Date"];
    } else {
      const dateConstraint = {};
      dateConstraint["$in"] = constraints;
      filteringInput["Date"] = dateConstraint;
    }

    dbo
      .collection("allYear")
      .find(filteringInput)
      .toArray(function (err, result) {
        if (err) return console.log(err);
        response.send({ Date: result.length });
      });
  });

  app.post("/clickedPlayer", function (request, response) {
    const constraintsP = request.body["Player"];

    for (var i = 0; i < constraintsP.length; i++) {
      if (constraintsP[i].charAt(2) == ")") {
        length = constraintsP[i].length;
        constraintsP[i] =
          constraintsP[i].slice(0, 3) + constraintsP[i].slice(4, length);
      }
    }

    if (constraintsP.length == 0) {
      delete filteringInput["$or"];
    } else {
      const playerConstraint = {};
      const players = {};
      const players2 = {};

      playerConstraint["$in"] = constraintsP;
      players["Player/Team 1 Name"] = playerConstraint;
      players2["Player/Team 2 Name"] = playerConstraint;

      filteringInput["$or"] = [players, players2];
    }

    dbo
      .collection("allYear")
      .find(filteringInput)
      .toArray(function (err, result) {
        if (err) return console.log(err);
        response.send({ Player: result.length });
      });
  });

  app.post("/clickedDownload", function (request, response) {
    dbo
      .collection("allYear")
      .find(filteringInput)
      .toArray(function (err, result) {
        if (err) return console.log(err);

        const arrayObjects = JSON.parse(JSON.stringify(result));

        converter.json2csv(arrayObjects, (err, csv) => {
          if (err) {
            throw err;
          }

          response.send({ Download: csv });

          console.log("downloaded");
        });
      });
  });

  app.post("/clickedSubmit", function (request, response) {
    console.log(filteringInput);

    dbo
      .collection("allYear")
      .find(filteringInput)
      .toArray(function (err, result) {
        if (err) return console.log(err);
        response.send({ Submit: result.length });
      });
  });
});
