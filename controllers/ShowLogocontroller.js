const knex = require('../db');

const showLogo = async (req, res) => {
    try {
        const logo = await knex('preferences').select('*');
        console.log(logo);
        res.send({ status: 1, logo })
    } catch (error) {
        console.log(error)
        res.send({ status: 0 })
    }
}


module.exports = { showLogo };