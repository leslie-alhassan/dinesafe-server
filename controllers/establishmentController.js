const knex = require('knex')(require('../knexfile'));

exports.addEstablishment = async (req, res) => {
  try {
    if (
      !req.body.id ||
      !req.body.name ||
      !req.body.status ||
      !req.body.address
    ) {
      return res
        .status(400)
        .json({ message: 'Please provide the required information' });
    }

    const id = req.body.id;
    const name = req.body.name;
    const address = req.body.address;
    const status = req.body.status;
    const lat = req.body.lat;
    const lng = req.body.lng;

    await knex('establishments').insert({
      id,
      name,
      address,
      status,
      lat,
      lng,
    });

    const newEstablishment = await knex('establishments').where({
      id: req.body.id,
    });

    return res.json({ message: 'OK', added: newEstablishment });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Unable to add establishment to database', error: err });
  }
};

exports.getAllEstablishments = async (req, res) => {
  const searchTerm = req.query.search;
  const order = req.query.order;
  const sort = req.query.sort;

  // handle queries
  if (searchTerm) {
    try {
      const searchResults = await knex('establishments')
        .select('name', 'address', 'status')
        .whereILike('name', `%${searchTerm}%`)
        .orWhereILike('address', `%${searchTerm}%`)
        .orWhereILike('status', `%${searchTerm}%`)
        .orderBy(`${order || 'name'}`, `${sort || 'asc'}`);

      searchResults.length === 0
        ? res.sendStatus(204)
        : res.json({ matches: searchResults.length, data: searchResults });
    } catch (err) {
      return res.status(500).json({
        message: 'Unable to get establishments from database',
        error: err,
      });
    }
  } else {
    try {
      const data = await knex('establishments')
        .select('name', 'address', 'status')
        .orderBy(`${order || 'name'}`, `${sort || 'asc'}`);

      return res.json({ length: data.length, data: data });
    } catch (err) {
      return res.status(500).json({
        message: 'Unable to get establishments from database',
        error: err,
      });
    }
  }
};

exports.getEstablishment = async (req, res) => {
  try {
    const establishment = await knex('establishments')
      .select('name', 'address', 'status')
      .where({ id: req.params.establishmentId })
      .first();

    establishment
      ? res.json(establishment)
      : res.status(404).json({ message: 'Establishment not found' });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to fetch establishment from database',
      error: err,
    });
  }
};

exports.updateEstablishment = async (req, res) => {
  try {
    const rowsUpdated = await knex('establishments')
      .where({ id: req.params.establishmentId })
      .update(req.body);

    if (rowsUpdated === 0) {
      return res.status(400).json({
        message: `Establishment with id 
    ${req.params.establishmentId} not found`,
      });
    }

    const updatedEstablishment = await knex('establishments')
      .where({
        id: req.params.establishmentId,
      })
      .first();

    return res.json({
      message: 'OK',
      updated: updatedEstablishment,
      body: req.body,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Unable to update warehouse in database', error: err });
  }
};

exports.deleteEstablishment = async (req, res) => {
  try {
    const rowsDeleted = await knex('establishments')
      .where({ id: req.params.establishmentId })
      .delete();

    if (rowsDeleted === 0) {
      return res.status(404).json({
        message: `Establishment with id ${req.params.establishmentId} not found`,
      });
    }

    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({
      message: `Unable to delete establishment with id ${req.params.establishmentId} from database`,
      error: err,
    });
  }
};
