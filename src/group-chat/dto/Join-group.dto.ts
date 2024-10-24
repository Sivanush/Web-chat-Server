import { IsMongoId, IsNotEmpty } from "class-validator";

export class JoinGroupDto {  
    @IsMongoId()
    @IsNotEmpty()
    groupId: string;
  }