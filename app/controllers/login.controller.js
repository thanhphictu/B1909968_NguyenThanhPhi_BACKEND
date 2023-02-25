const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const LoginService = require("../services/login.service");
var bcrypt = require('bcrypt');
const { findOne } = require("./contact.controller");

exports.create = async (req, res, next) => {
    if (!req.body?.username && !req.body?.password) {
        return next(new ApiError(400, "username and password can not be empty"));
    }

    try {
        const loginService = new LoginService(MongoDB.client);
        var hashedPassword = "";
        bcrypt.genSalt(10, function (err, Salt) {
            bcrypt.hash(req.body.password, Salt, function (err, hash) {
                if (err) {
                    return console.log('Cannot encrypt');
                }
                hashedPassword = hash;
            })
        });
        setTimeout(async () => {
            let account = {
                username: req.body.username,
                password: hashedPassword ? hashedPassword : "none",
                address: req.body.address,
                phone: req.body.phone,
            }
            await loginService.create(account);
        }, 1000);

        return res.send("ok");

    } catch (error) {
        return next(
            new ApiError(500, error)
        );
    }
};

exports.check = async (req, res, next) => {
    if (!req.body?.username && !req.body?.password) {
        return next(new ApiError(400, "username and password can not be empty"));
    }

    try {
        const loginService = new LoginService(MongoDB.client);
        let password = req.body.password;
        let findOneUser = await loginService.findByUserName(req.body.username);
        if (findOneUser.length > 0) {
            let passCheck = findOneUser[0]?.password;
            bcrypt.compare(password, passCheck,
                async function (err, isMatch) {

                    // Comparing the original password to
                    // encrypted password   
                    if (isMatch) {
                        return res.json({
                            mess: "dang nhap thanh cong"
                        });
                    }

                    if (!isMatch) {

                        // If password doesn't match the following
                        // message will be sent
                        return res.json({
                            mess: "sai mat khau"
                        });
                    }
                })
        } else {
            return res.json({
                mess: "khong co nguoi dung nay"
            });
        }
    } catch (error) {
        return next(
            new ApiError(500, error)
        );
    }
};


exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const loginService = new LoginService(MongoDB.client);

        var hashedPassword = "";
        bcrypt.genSalt(10, function (err, Salt) {
            bcrypt.hash(req.body.password, Salt, function (err, hash) {
                if (err) {
                    return console.log('Cannot encrypt');
                }
                hashedPassword = hash;
            })
        });
        setTimeout(async () => {
            let account = {
                username: req.body.username,
                password: hashedPassword ? hashedPassword : "none",
                address: req.body.address,
                phone: req.body.phone,
            }
            const document = await loginService.update(req.body.id, account);
            if (!document) {
                return next(new ApiError(404, "account not found"));
            }
        }, 1000);

        return res.send({ message: "account was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving account with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {

    try {
        const loginService = new LoginService(MongoDB.client);
        const document = await loginService.delete(req.body.id);
        if (!document) {
            return next(new ApiError(404, "account not found"));
        }
        return res.send({ message: "account was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete account with id=${req.body.id}`)
        );
    }
};