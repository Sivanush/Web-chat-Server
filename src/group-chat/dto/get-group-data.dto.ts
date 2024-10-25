import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetGroupData {  
    @IsMongoId()
    @IsNotEmpty()
    groupId: string;
  }