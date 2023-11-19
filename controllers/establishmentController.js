const knex = require('knex')(require('../knexfile'));

exports.addEstablishment = async (req, res) => {
  try {
    if (
      !req.body.id ||
      !req.body.name ||
      !req.body.status ||
      !req.body.address
    ) {
      return res.status(400).json({
        message: 'Please provide the required information in the request body',
      });
    }

    const { id, name, address, status, lat, lng } = req.body;

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

  if (searchTerm) {
    try {
      const searchResults = await knex('establishments')
        .select('id', 'name', 'address', 'status', 'lat', 'lng')
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
        .select('id', 'name', 'address', 'status', 'lat', 'lng')
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
      .select('id', 'name', 'address', 'status', 'lat', 'lng')
      .where({ id: req.params.establishmentId })
      .first();

    establishment
      ? res.json(establishment)
      : res.status(404).json({
          message: `No establishment with ID ${establishmentId}`,
        });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to fetch establishment with ID ${establishmentId} from database`,
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
        message: `Establishment with ID 
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

    rowsDeleted === 0
      ? res.status(404).json({
          message: `Establishment with id ${req.params.establishmentId} not found`,
        })
      : res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({
      message: `Unable to delete establishment with ID ${req.params.establishmentId} from database`,
      error: err,
    });
  }
};
