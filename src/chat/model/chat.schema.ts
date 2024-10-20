import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema()
export class Chat extends Document {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: mongoose.Schema.Types.ObjectId

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    receiver: mongoose.Schema.Types.ObjectId

    @Prop({ required: true })
    content: string

    @Prop({ enum: ['text', 'video', 'image'], default: 'text' })
    type: string

    @Prop({ default: Date.now() })
    timestamp: Date
}

export const chatModal = SchemaFactory.createForClass(Chat)