
class healthController {
    status(req, res){
        return res.status(200).json(
            {"message":"Server is running on Docker...2.0"}
        );
    };
};
module.exports = new healthController();