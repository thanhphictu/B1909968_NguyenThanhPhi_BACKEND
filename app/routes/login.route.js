const express = require("express");
const login = require("../controllers/login.controller");

const router = express.Router();

router.route("/signup")
    .post(login.create)
router.route("/handle")
    .post(login.check)
    .put(login.update)
    .delete(login.delete)


module.exports = router;