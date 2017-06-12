const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive');

const mainCtrl = require('./mainCtrl');

const app = express();

app.use(bodyParser.json())
app.use(cors());

// You need to complete the information below to connect
// to the assessbox database on your postgres server.
massive({
  host: "localhost",
  port: 4000,
  database: "assessbox",
  user: "postgres",
  password: "Larios953"
}).then( db => {
  app.set('db', db);

  // Initialize user table and vehicle table.
  db.init_tables.user_create_seed().then( response => {
    console.log('User table init');
    db.init_tables.vehicle_create_seed().then( response => {
      console.log('Vehicle table init');
    })
  })

})


// ===== Build enpoints below ============


app.get("/api/users", (req, res) => {
  req.app.get('db').get_all_users().then(users => {
      res.status(200).send(users)
  }).catch(function(err) {
    console.log(err);
  })
})

app.get("/api/vehicles", (req, res) => {
  req.app.get('db').get_all_vehicles().then(vehicles => {
      res.status(200).send(vehicles)
  }).catch(function(err) {
    console.log(err);
  })
})

app.post("/api/users", (req, res) => {
  req.app.get('db').add_user([req.body.name, req.body.email]).then(users => {
      res.status(200).send(users)
  }).catch(function(err) {
    console.log(err);
  })
})

app.post("/api/vehicles", (req, res) => {
  req.app.get('db').add_vehicle([req.body.make, req.body.model, req.body.year, req.body.user_id]).then(vehicles => {
      res.status(200).send(vehicles)
  }).catch(function(err) {
    console.log(err);
  })
})

app.get("/api/user/:userId/vehiclecount", (req, res) => {
  req.app.get('db').get_vehicle_count(req.params.userId).then(count => {
      res.status(200).send(count)
  }).catch(function(err) {
    console.log(err);
  })
})

app.get("/api/user/:userId/vehicle", (req, res) => {
  req.app.get('db').get_vehicles_by_userId(req.params.userId).then(vehicles => {
      res.status(200).send(vehicles)
  }).catch(function(err) {
    console.log(err);
  })
})

app.get("/api/vehicle", (req, res) => {
  if(req.query.userEmail){
    console.log("email")
    req.app.get('db').get_vehicles_by_email(req.query.userEmail).then(user => {
        res.status(200).send(user)
    }).catch(function(err) {
      console.log(err);
    })
  } else if (req.query.userFirstStart){
    console.log("letters")
    req.app.get('db').get_vehicles_by_letters([req.query.userFirstStart + "%"]).then(user => {
        res.status(200).send(user)
    }).catch(function(err) {
      console.log(err);
    })
  }
  console.log("test")
})

app.get("/api/newervehiclesbyyear", (req, res) => {
  req.app.get('db').get_vehicles_by_year().then(vehicles => {
      res.status(200).send(vehicles)
  }).catch(function(err) {
    console.log(err);
  })
})

app.put("/api/vehicle/:vehicleId/user/:userId", (req, res) => {
  console.log(req.body)
  req.app.get('db').change_ownership([req.params.vehicleId, req.params.userId]).then(vehicles => {
      res.status(200).send(vehicles)
  }).catch(function(err) {
    console.log(err);
  })
})

app.delete("/api/user/:userId/vehicle/:vehicleId", (req, res) => {
  req.app.get('db').remove_ownership([req.params.vehicleId, req.params.userId]).then(vehicles => {
      res.status(200).send(vehicles)
  }).catch(function(err) {
    console.log(err);
  })
})

app.delete("/api/vehicle/:vehicleId", (req, res) => {
  req.app.get('db').remove_vehicle([req.params.vehicleId]).then(vehicles => {
      res.status(200).send(vehicles)
  }).catch(function(err) {
    console.log(err);
  })
})

// ===== Do not change port ===============
const port = 3000;
app.listen(port, () => {
  console.log('Listening on port: ', port);
})
