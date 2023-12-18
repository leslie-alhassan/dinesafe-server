const knex = require('knex')(require('../knexfile'));
const fs = require('fs');
const { setInterval } = require('timers/promises');

const data = JSON.parse(
  fs.readFileSync(
    '/Users/leslie/Documents/brainstation/capstone/dinesafe-v1/client/src/data/dinesafe.json'
  )
);

const populateDetails = () => {
  data.forEach(async (inspection) => {
    const {
      'Inspection ID': inspection_id,
      'Establishment ID': establishment_id,
      'Inspection Date': inspection_date,
      'Establishment Status': status,
      'Infraction Details': inspection_details,
      Severity: severity,
      Action: action,
      Outcome: outcome,
      'Amount Fined': amount_fined,
      'Establishment Type': establishment_type,
    } = inspection;

    try {
      console.log('Populating');
      await knex('inspections').insert({
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
    } catch (error) {
      console.error({
        message: `Unable to populate DB with inspection details for ${establishment_name}`,
        error: error,
      });
    }
  });
};

populateDetails();
