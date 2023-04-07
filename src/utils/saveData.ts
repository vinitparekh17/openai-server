import userSchema from "../models/userSchema";
import messageSchema from "../models/messageSchema";

export async function saveData(model, res, data) {
    try {
        switch (model) {
            case userSchema:
                let newUser = await userSchema.create(data)
                break;
            case messageSchema:
                messageSchema.create(data)
            default:
                console.log(`Invalid schema ${model}`);
                break;
        }
    } catch (error) {
        
    }
}