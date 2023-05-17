//make a get request to api
function getDataFromServer(callback) {
  const http = require("http");

  http
    .get("http:/localhost:3000/", (res) => {
      let data;
      res.on("data", (dataPoint) => {
        data = dataPoint;
      });
      res.on("end", () => {
        console.log(JSON.parse(data));
        callback(null, message); //returning the data
      });
    })
    .on("error", (err) => {
      console.log(err.message);
    });
}

module.exports = { getDataFromServer };
