const taskModel = require('../model/taskModel');
const { isPast } = require('date-fns');
const msg = require('../utils/message');

const taskValidation = async (req, res, next) => {
    const { macaddress, type, title, description, when } = req.body;
    if (!macaddress)
        return res.status(400).json(
            msg.resp(null, "macaddress é obrigatório.", 400)
        );
        else if (!type)
            return res.status(400).json(
                msg.resp(null, "type é obrigatório.", 400)
            );
        else if (!title)
            return res.status(400).json(
                msg.resp(null, "title é obrigatório.", 400)
            );
        else if (!description)
            return res.status(400).json(
                msg.resp(null, "description é obrigatório.", 400)
            );
        else if (!when)
            return res.status(400).json(
                msg.resp(null, "when é obrigatório.", 400)  
            );
        else if (isPast(new Date(when)))
            return res.status(400).json(
                msg.resp(null, "Não é possível cadastrar uma tarefa para uma data passada.", 400)
            );
        else{
            let exists;
            if(req.params.id){
                try{
                    exists = await taskModel.findOne(
                        {   '_id': {'$ne': req.params.id.trim()},
                            'when': {'$eq': new Date(when)},
                            'macaddress': {'$in': macaddress}
                        }
                    );
                }
                catch(error){
                    return res.status(500).json(
                        msg.resp(null, "Ocorreu um erro ao validar a tarefa.", 500)
                    );
                }
            }else{
                try{
                    exists = await taskModel.findOne(
                        {
                            'when': {'$eq': new Date(when)},
                            'macaddress': {'$in': macaddress}
                        }
                    ); 
                    if (exists){
                        return res.status(400).json(
                            msg.resp(null, "Já existe uma tarefa cadastrada para esta data.", 400)
                        );
                    };
                }
                catch(error){
                    return res.status(500).json(
                        msg.resp(null, "Ocorreu um erro inesperado.", 500)
                    );
                };
            }
        next();
    };        
};
module.exports = taskValidation;


