import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class GroupMessage {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: mongoose.Schema.Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
    groupId: Types.ObjectId;

    @Prop({ required: true })
    content: string

    @Prop({ enum: ['text', 'video', 'image'], default: 'text' })
    type: string

    @Prop({ default: Date.now() })
    timestamp: Date
}

export const GroupMessageModel = SchemaFactory.createForClass(GroupMessage);