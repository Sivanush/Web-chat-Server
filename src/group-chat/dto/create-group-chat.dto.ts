import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateGroupChatDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name:string

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    description:string

    @IsString()
    @IsOptional()
    image:string
}