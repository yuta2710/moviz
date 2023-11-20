import { Document, Schema } from "mongoose";
export default interface Token extends Document {
    id: Schema.Types.ObjectId;
    expiresIn: number;
}
