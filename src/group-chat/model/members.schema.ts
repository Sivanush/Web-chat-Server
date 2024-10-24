import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class GroupMember {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  groupId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['admin', 'moderator', 'member'], 
    default: 'member' 
  })
  role: string;

  @Prop({ default: true })
  isActive: boolean;
}


export const GroupMemberModel = SchemaFactory.createForClass(GroupMember);
