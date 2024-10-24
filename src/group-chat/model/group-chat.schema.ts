import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Message {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: mongoose.Schema.Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
    group: Types.ObjectId;

    @Prop({ required: true })
    content: string

    @Prop({ enum: ['text', 'video', 'image'], default: 'text' })
    type: string

    @Prop({ default: Date.now() })
    timestamp: Date
}