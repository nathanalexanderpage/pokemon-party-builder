// Require needed modules
let express = require('express')
var request = require('request')

// Declare an express router
let router = express.Router()

// Reference the models
let db = require('../models')

// Include our custom middleware to ensure that users are logged in
let adminLoggedIn = require('../middleware/adminLoggedIn')
let loggedIn = require('../middleware/loggedIn')

// GET /profile
router.get('/', loggedIn, (req, res) => {
  db.poke.findAll()
  .then((results) => {
    res.render('profile/index', {results: results})
  })
})

// GET /profile/admin
router.get('/admin', adminLoggedIn, (req, res) => {
  res.render('profile/admin')
})

// GET /profile/newpoke
router.get('/poke/new', loggedIn, (req, res) => {
  console.log(req);
  let passData = req.query
  let pokeapiUrl = `${process.env.API_BASE_URL}pokemon/${passData.id}`
  request(pokeapiUrl, (err, apiResp, body) => {
    let pokeData = JSON.parse(body)
    console.log(pokeData)
    res.render('profile/pokenew', { pokeData })
  })
})

router.post('/poke/new', loggedIn, (req, res) => {
  console.log(req.body);

  console.log(`
    userId: ${req.user.dataValues.id},
    pokeDex: ${req.body.pokeDex},
    profile_name: ${req.body.profile_name},
    name: ${req.body.name},
    ability: ${req.body.ability}`);
  // res.send('req received to console')
  // db.users_pokes.create({
  //   where: {
  //     userId: req.user.dataValues.id,
  //     pokeDex: ,
  //     name: name,
  //     profile_name: profile_name,
  //
  //   }
  // })
})

// GET /profile/:id
router.get('/:dex', loggedIn, (req, res) => {
  console.log(req.params); // {dex: 2}
  db.users_pokes.findAll({
    where: { pokeDex: req.params.dex }
  })
  .then((results) => {
    let pokeapiUrl = `${process.env.API_BASE_URL}pokemon/${req.params.dex}`
    request(pokeapiUrl, (err, apiResp, body) => {
      let pokeData = JSON.parse(body)
      console.log(pokeData);
      res.render('profile/pokeshow', {
        pokeData,
        results
      })
    })
  })
  .catch((err) => {
    console.log('err: ', err);
  })
})

// Export the routes from this file
module.exports = router
