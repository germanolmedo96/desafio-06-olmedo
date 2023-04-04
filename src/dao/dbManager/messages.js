import messagesModel from "../models/messages.js";

export default class Carts {
    constructor() {
        console.log("trabajando en la BD con messages");
    }

    getAll = async() => {
        let messages = await messagesModel.find().lean();
        return messages;
    }

    saveMessage = async(message) => {
        let result = await messagesModel.create(message);
        return result;
    }


}