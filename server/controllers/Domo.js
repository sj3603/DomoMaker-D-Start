const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.gender) {
    return res.status(400).json({ error: 'RAWR! Name, age, and gender are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ domos: docs });
  });
};

//DeleteCode
const deleteDomo = (request, response) => {
  const req = request;
  const res = response;
  if (!req.body.name) {
    return res.status(400).json({ error: 'RAWR! Name is required' });
  }
  const name = `${req.body.name}`;
  Domo.DomoModel.findByName(req.body.name, (err, doc) => {
    if (!doc) { //check if it exists

      return res.status(400).json({ error: 'RAWR! Domo does not exist!' }); //aborts if it does not exist
    }
    else { //Continue on otherwise 
      const callback = (err, doc) => {
        if (err) {
          return res.status(500).json({ err }); //if error, return
        }

        //return success 
        return res.json(doc);
      };

      Domo.DomoModel.delete(req.body.name, callback);
    }
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.delete = deleteDomo;
