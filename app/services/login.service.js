const { ObjectId } = require("mongodb");

class LoginService {
    constructor(client) {
        this.Account = client.db().collection("accounts");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(payload) {
        const account = {
            username: payload.username,
            password: payload.password,
            address: payload.address,
            phone: payload.phone,
        };
        // Remove undefined fields
        Object.keys(account).forEach(
            (key) => account[key] === undefined && delete account[key]
        );
        return account;
    }

    async create(payload) {
        const account = this.extractConactData(payload);
        const result = await this.Account.insertOne(
            account,
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Account.find(filter);
        return await cursor.toArray();
    }

    async findByUserName(username) {
        return await this.find({
            username: { $regex: new RegExp(username), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Account.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        console.log("filter ", id);
        const update = this.extractConactData(payload);
        const result = await this.Account.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Account.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

}

module.exports = LoginService;