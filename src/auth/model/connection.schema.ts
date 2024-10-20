import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema()
export class Connection extends Document{
    @Prop({required:true,unique:true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId:mongoose.Schema.Types.ObjectId

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],default:[]})
    connections: mongoose.Schema.Types.ObjectId[];
}

export const connectionModal = SchemaFactory.createForClass(Connection)