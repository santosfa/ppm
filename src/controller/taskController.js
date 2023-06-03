const taskModel = require('../model/taskModel');
const msg = require('../utils/message');


class taskController {

    //Cria uma nova tarefa.
    async createTask(req, res){
        const task = new taskModel(req.body);
        await task
        .save()
        .then((response) =>{
            return res.status(200).json(
                msg.resp(response, "Tarefa cadastrada com sucesso.", 200)
            );
             
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao cadastrar a tarefa.", 500)
            );
        })
    };

    //Atualiza uma tarefa.
    async updateTask(req, res){
        await taskModel.findByIdAndUpdate({'_id':req.params.id}, req.body, {new:true})
        .then((response) =>{
            return res.status(200).json(
                msg.resp(response, "Tarefa atualizada com sucesso.", 200)
            );
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao atualizar a tarefa.", 500)
            );
        });
    };

    //Lista todas as tarefas de um usuário.
    async listAllTasks(req, res){
        console.log(req.params.macaddress);
        await taskModel.find({ macaddress: {'$in': req.params.macaddress} })
        .sort('when')
        .limit(10)
        .skip(0)
        .then((response) =>{

            if (response.length === 0){
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa cadastrada.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(response, "Tarefas listadas com sucesso.", 200) 
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao listar as tarefas.", 500)
            );
        });
    }

    //Lista uma tarera por ID.
    async listTaskById(req, res){
        await taskModel.findById(req.params.id)
        .then((response) =>{
            if (response){
                return res.status(200).json(
                    msg.resp(response, "Tarefa listada com sucesso.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa encontrada.", 200)
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao listar a tarefa.", 500)
            );
        });
    }

    //Lista as tarefas atrasadas.
    async listLateTasks(req, res){
        await taskModel.find({'when':{'$lt': new Date()}, 'macaddress': {'$in': req.params.macaddress}})
        .sort('when')
        .then((response) =>{
            if (response.length === 0){
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa atrasada.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(response, "Tarefas listadas com sucesso.", 200)
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao listar as tarefas.", 500)
            );
        });
    }

    //Lista as tarefas do dia.
    async listTodayTasks(req, res){
        await taskModel.find({'macaddress': {'$in': req.params.macaddress}, 'when':{'$gte': startOfDay(new Date()), '$lte': endOfDay(new Date())}})
        .sort('when')
        .then((response) =>{
            if (response.length === 0){
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa para hoje.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(response, "Tarefas listadas com sucesso.", 200)
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao listar as tarefas.", 500)
            );
        });
    }

    //Lista as tarefas da semana.
    async listWeekTasks(req, res){
        await taskModel.find({'macaddress': {'$in': req.params.macaddress}, 'when':{'$gte': startOfWeek(new Date()), '$lte': endOfWeek(new Date())}})
        .sort('when')
        .then((response) =>{
            if (response.length === 0){
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa para esta semana.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(response, "Tarefas listadas com sucesso.", 200)
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao listar as tarefas.", 500)
            );
        });
    }

    //Lista as tarefas do mês.
    async listMonthTasks(req, res){
        await taskModel.find({'macaddress': {'$in': req.params.macaddress}, 'when':{'$gte': startOfMonth(new Date()), '$lte': endOfMonth(new Date())}})
        .sort('when')
        .then((response) =>{
            if (response.length === 0){
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa para este mês.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(response, "Tarefas listadas com sucesso.", 200)
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao listar as tarefas.", 500)
            );
        });
    }

    //Lista as tarefas do ano.
    async listYearTasks(req, res){
        await taskModel.find({'macaddress': {'$in': req.params.macaddress}, 'when':{'$gte': startOfYear(new Date()), '$lte': endOfYear(new Date())}})
        .sort('when')
        .then((response) =>{
            if (response.length === 0){
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa para este ano.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(response, "Tarefas listadas com sucesso.", 200)
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao listar as tarefas.", 500)
            );
        });
    }

    //Lista tarefas por um período.
    async listPeriodTasks(req, res){    
        await taskModel.find({'macaddress': {'$in': req.params.macaddress}, 'when':{'$gte': req.params.start, '$lte': req.params.end}})
        .sort('when')
        .then((response) =>{
            if (response.length === 0){
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa para este período.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(response, "Tarefas listadas com sucesso.", 200)
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao listar as tarefas.", 500)
            );
        });
    }

        
    //Remove uma tarefa por ID.
    async removeTaskById(req, res){
        await taskModel.deleteOne({'_id':req.params.id})
        .then((response) =>{
            if (response.deletedCount === 1){
                return res.status(200).json(
                    msg.resp(null, "Tarefa removida com sucesso.", 200)
                );
            }else{
                return res.status(200).json(
                    msg.resp(null, "Nenhuma tarefa encontrada.", 200)
                );
            }
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao remover a tarefa.", 500)
            );
        });
    }

    //Atualiza o status de uma tarefa.
    async updateTaskStatus(req, res){   
        await taskModel.findByIdAndUpdate({'_id':req.params.id}, {'done':req.params.done}, {new:true})
        .then((response) =>{
            return res.status(200).json(
                msg.resp(response, "Tarefa atualizada com sucesso.", 200)
            );
        })
        .catch((error) =>{
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao atualizar a tarefa.", 500)
            );
        });
    };


       
}

module.exports = new taskController();