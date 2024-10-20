import { IsNotEmpty, IsString } from "class-validator";


export class GetUserDataDto{

    @IsString()
    @IsNotEmpty()
    userId:string;
}