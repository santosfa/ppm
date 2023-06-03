
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

const User = require('../model/userModel');
const authConfig = require('../config/auth.json');
const msg = require('../utils/message');

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
};

class authController {

    //Registra novo usuário
    async register(req, res){
        const { email } = req.body;
        console.log("Consultando se o usuário já existe");
        try{
            if (await User.findOne({ email })){
                console.log("O usuário já existe");
                return res.status(400).json(
                    msg.resp(null, "Este usuário já está cadastrado.2", 400)
                );
            }else{
                console.log("Criando novo usuário");

                const user = await User.create(req.body);
                user.password = undefined;
                const newUser = {
                    user,
                    token: generateToken({ id: user.id }),
                };
            
                return res.status(200).json(
                    msg.resp(newUser, "Usuário cadastrado com sucesso", 200)
                );
            };
        }catch (err){
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao cadastrar o usuário.", 500)
            );
        }
    };


    //Autentica usuário
    async authenticate(req, res){
        const { companyCode, email, password} = req.body;
        
        //busca o usuário pelo email e traz a senha junto
        try{
            const user = await User.findOne({ email, companyCode }).select('+password');
            if (!user){
                return res.status(400).json(
                    msg.resp(null, "Usuário não encontrado.", 400)
                );
            }else{
                console.log("O usuário existe");
                if (!await bcrypt.compare(password, user.password)){
                    return res.status(400).json(
                        msg.resp(null, "Senha incorreta.", 400)
                    );
                }else{
                    user.password = undefined;
                    const newUser = {
                        user,
                        token: generateToken({ id: user.id }),
                    };
                    return res.status(200).json(
                        msg.resp(newUser, "Usuário autenticado com sucesso.", 200)
                    );
                };
            }
        }
        catch (err){
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao autenticar o usuário.", 500)
            );
        }
    };


    //Esqueci minha senha
    async forgotPassword(req, res){
        const { email , companyCode} = req.body;
        try{
            const user = await User.findOne({ email , companyCode});
            if (!user){
                return res.status(400).json(
                    msg.resp(null, "Usuário não encontrado.", 400)
                );
            }else{
                const token = crypto.randomBytes(20).toString('hex');
                const now = new Date();
                now.setHours(now.getHours() + 1);

                await User.findByIdAndUpdate(user.id, {
                    '$set': {
                        token: token,
                        tokenExpires: now,
                    }
                });
           
                mailer.sendMail({
                    to: email,
                    from: 'teste@bkoffice.com',
                    template: 'auth/forgot_password',   
                    context: { token }, 
                }, (err) => {
                    if (err){
                 
                        return res.status(500).json(
                            msg.resp(null, "Não foi possível enviar o email de recuperação de senha 22.", 500)
                        );
                    }else{
                        return res.status(200).json(
                            msg.resp(null, "Email enviado com sucesso.", 200)
                        );
                    }
                });
            };
        }catch (err){
      
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao recuperar a senha.", 500)
            );
        }
    };

    //Redefinir senha
    async resetPassword(req, res){
        const {email, token, novaSenha } = req.body;
        try{
            const user = await User.findOne({ email})
            .select('+token tokenExpires');

            if (!user){
                return res.status(400).json(
                    msg.resp(null, "Usuário não encontrado.", 400)
                );
            }else{
                if (token !== user.token){
                    return res.status(400).json(
                        msg.resp(null, "Token inválido.", 400)
                    );
                }else{
                    const now = new Date();
                    if (now > user.passwordResetExpires){
                        return res.status(400).json(
                            msg.resp(null, "Token expirado, gere um novo token.", 400)
                        );
                    }else{
                        user.password = novaSenha;
                        await user.save();
                        return res.status(200).json(
                            msg.resp(null, "Senha alterada com sucesso.", 200)
                        );
                    };
                };
            }
        }catch (err){
            return res.status(500).json(
                msg.resp(null, "Ocorreu um erro ao alterar a senha.", 500)
            );
        }
    };














}

module.exports = new authController();