const express           = require('express');
const taskController    = require('../controller/taskController');
const taskValidation    = require('../middleware/taskValidation'); 


const router            = express.Router();

//createTask
router.post('/',                taskValidation, taskController.createTask);
//updateTask
router.put('/:id',              taskValidation, taskController.updateTask);
//listAllTasks
router.get('/:macaddress',                      taskController.listAllTasks);
//listTaskById
router.get('/task/:id',                         taskController.listTaskById);
//listLateTasks
router.get('/late/:macaddress',                 taskController.listLateTasks);
//listTodayTasks
router.get('/today/:macaddress',                taskController.listTodayTasks);
//listWeekTasks
router.get('/week/:macaddress',                 taskController.listWeekTasks);
//listMonthTasks
router.get('/month/:macaddress',                taskController.listMonthTasks);
//listYearTasks
router.get('/year/:macaddress',                 taskController.listYearTasks);
//listPeriodTasks
router.get('/period/:macaddress/:start/:end',   taskController.listPeriodTasks);
//removeTaskById
router.delete('/:id',                           taskController.removeTaskById);
//updateTaskStatus
router.put('/:id/:done',                        taskController.updateTaskStatus);


module.exports = router;