const knex = require('knex')(require('../knexfile'));

exports.addInspectionDetails = async (req, res) => {
  try {
    if (!req.body.establishment_id) {
      return res.status(400).json({
        message: 'Please provide an establishment ID',
      });
    }

    const {
      inspection_id,
      establishment_id,
      inspection_date,
      status,
      inspection_details,
      severity,
      action,
      outcome,
      amount_fined,
      establishment_type,
    } = req.body;

    const [newInspectionId] = await knex('inspections').insert({
      inspection_id,
      establishment_id,
      inspection_date,
      status,
      inspection_details,
      severity,
      action,
      outcome,
      amount_fined,
      establishment_type,
    });

    const newInspectionDetails = await knex('inspections').where({
      id: newInspectionId,
    });

    return res.json({ message: 'OK', added: newInspectionDetails });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to add inspection details to database',
      error: err,
    });
  }
};

exports.getAllInspections = async (_req, res) => {
  try {
    const data = await knex('inspections').select();

    return res.json({ length: data.length, data: data });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to get all inspection details from database',
      error: err,
    });
  }
};

exports.getInspectionDetails = async (req, res) => {
  try {
    const inspections = await knex('inspections')
      .where({
        establishment_id: req.params.establishmentId,
      })
      .orderBy('inspection_date', 'desc');

    inspections
      ? res.json(inspections)
      : res.status(400).json({
          message: `No establishment with ID ${req.params.establishmentId}`,
        });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to fetch inspection details for establishment with ID ${req.params.establishmentId} from database`,
      error: err,
    });
  }
};

exports.updateInspectionDetails = async (req, res) => {
  try {
    const rowsUpdated = await knex('inspections')
      .where({ id: req.params.inspectionId })
      .update(req.body);

    if (rowsUpdated === 0) {
      return res.status(400).json({
        message: `No inspection with ID ${req.params.inspectionId} found`,
      });
    }

    const updatedInspection = await knex('inspections')
      .where({ id: req.params.inspectionId })
      .first();

    return res.json({ message: 'OK', updated: updatedInspection });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to update inspection with ID ${req.params.inspectionId}`,
      error: err,
    });
  }
};

exports.deleteInspectionDetails = async (req, res) => {
  try {
    const rowsDeleted = await knex('inspections')
      .where({ id: req.params.inspectionId })
      .delete();

    rowsDeleted === 0
      ? res.status(400).json({
          message: `No inspection with ID ${req.params.inspectionId} found`,
        })
      : res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({
      message: `Unable to delete inspection details with ID ${req.params.inspectionId} from database`,
      error: err,
    });
  }
};
