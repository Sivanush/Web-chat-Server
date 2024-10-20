import { IsNotEmpty, isNotEmpty, IsString } from "class-validator";


export class SearchUsersDto{
    @IsString()
    @IsNotEmpty()
    input : string
}