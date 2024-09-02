const User = require("../models/userModel");
const Right = require("../models/rightModel");

const roles = ["owner", "admin", "employee", "manager"];

const checkRight = (userId, companyId, role) => {
    const right = Right.findOne({
        where: {
            userId,
            companyId,
        }
    });

    if (!right) {
        return false;
    }

    if(roles.indexOf(right.role) <= roles.indexOf(role)) {
        return true;
    }

    return false;

}

module.exports = { checkRight };