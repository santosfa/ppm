const db = require('../../config/database');

const projectPlanSchema = new db.Schema({
    ordem:{
        type: Number,
        required: true
    },
    DtPrevInMont:{
        type: Date,
        required: true
    },
    DtPrevEntrega:{
        type: Date,
        required: true
    }
}
);

const projectPlans = db.model('projectPlans',projectPlanSchema );

module.exports = projectPlans;