import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema()
export class Request extends Document{
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: mongoose.Schema.Types.ObjectId;
  
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    receiver: mongoose.Schema.Types.ObjectId; 
  
    @Prop({ enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
    status: string;
  
    @Prop({ default: Date.now })
    createdAt: Date;
}

export const requestModal = SchemaFactory.createForClass(Request)