const express           = require('express');
const baseController    = require('../../controller/baseController');

const router = express.Router();


router.get('/all', async (req, res) => {
    await baseController.listAll(req, res, 'projectPlan');
});

router.get('/search/:field/:value', async (req, res) => {
    const { field, value } = req.params;
    await baseController.listByField(req, res, 'projectPlan', field, value);
});

router.post('/create', async (req, res) => {
    await baseController.create(req, res, 'projectPlan');
});

module.exports = router;