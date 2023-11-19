const knex = require('knex')(require('../knexfile'));
const axios = require('axios');

fetchEstablishments = () => {
  const alphabets = [...Array(26).keys()].map((n) =>
    String.fromCharCode(97 + n).toUpperCase()
  );

  ['0', ...alphabets].forEach(async (alphabet) => {
    try {
      console.log(`fetching ${alphabet}`);
      const { data } = await axios.get(
        `${process.env.BASE_API_URL}${alphabet}`
      );

      try {
        console.log(`populating ${alphabet}`);
        await populateEstablishmentsDatabase(data);
      } catch (err) {
        console.log({
          message: `Unable to populate database with index ${alphabet}`,
          error: err,
        });
      }
    } catch (err) {
      console.log({
        message: `Unable to fetch index ${alphabet}`,
        error: err,
      });
    }
  });
};
fetchEstablishments();

const populateEstablishmentsDatabase = async (establishments) => {
  establishments.forEach(async (establishment) => {
    const {
      estId: id,
      estName: name,
      addrFull: address,
      insStatus: status,
      lat,
      lon: lng,
    } = establishment;

    await knex('establishments').insert({
      id,
      name,
      address,
      status,
      lat,
      lng,
    });
  });
};
