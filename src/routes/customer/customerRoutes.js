const express           = require('express');
const baseController    = require('../../controller/baseController');

const router = express.Router();



//list All Customers
router.get('/all', async (req, res) => {
    await baseController.listAll(req, res, 'customer');
});
//get document By id
router.get('/search/:field/:value', async (req, res) => {
    const { field, value } = req.params;
    await baseController.listByField(req, res, 'customer', field, value);
});
//create newContract
router.post('/create', async (req, res) => {
    await baseController.create(req, res, 'customer');
});

module.exports = router;