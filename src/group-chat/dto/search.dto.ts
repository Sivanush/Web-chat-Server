import { IsEmpty, IsString } from "class-validator";

export class SearchDto{

    @IsString()
    input:string
}