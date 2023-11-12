
class healthController {
    status(req, res){
        return res.status(200).json(
            {"message":"Server is running..."}
        );
    };
};
module.exports = new healthController();