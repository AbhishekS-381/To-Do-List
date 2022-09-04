var express = require("express");
var { v1: uuidv1 } = require('uuid');
var bodyParser = require("body-parser");
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "sqlTest"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.post("/addtask", function (req, res) {
  var sql = "INSERT INTO taskDB (ID,TASK,TASK_STATUS) VALUES (?,?,?)";
  con.query(sql, [uuidv1(), req.body.newtask, "pending"], function (err, result) {
    if (err) throw err;
  });
  res.redirect("/");
});

app.post("/edit/:id", function (req, res) {
  var sql = "UPDATE taskDB SET TASK = ? WHERE ID = ? ";
  con.query(sql, [req.body.check, req.params.id], function (err, result) {
    if (err) throw err;
  });
  res.redirect("/");
})

app.post("/removetask/:id", function (req, res) {
  var sql = "UPDATE taskDB SET TASK_STATUS = 'Completed' WHERE ID = ? ";
  con.query(sql, req.params.id, function (err, result) {
    if (err) throw err;
  });
  res.redirect("/");
});

app.post("/deletetask/:id", function (req, res) {
  var sql = "DELETE FROM taskDB WHERE ID = ? ";
  con.query(sql, req.params.id, function (err, result) {
    if (err) throw err;
  });
  res.redirect("/");
});

app.get("/", function (req, res) {
  var completedtask = [];
  var sql = "SELECT * FROM taskDB WHERE TASK_STATUS='Completed';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    completedtask = result;
  });
  con.query("SELECT * FROM taskDB WHERE TASK_STATUS='pending';", function (err, task) {
    if (err) throw err;
    res.render("index", { tasktocomplete: task, completedtask: completedtask });
  });
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});