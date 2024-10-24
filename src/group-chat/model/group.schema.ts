import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
  

  @Prop({ default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPkUoDULlymbgJm15QCBmPlpYh1YIKHo6jIA&s' })
  image: string;
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const GroupModel = SchemaFactory.createForClass(Group);
