import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class acceptOrRejectDto{
    @IsEmail()
    @IsNotEmpty()
    status:string

    @IsString()
    @IsNotEmpty()
    requestId: string;
  }