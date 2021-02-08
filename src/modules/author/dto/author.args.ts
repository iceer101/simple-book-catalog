import {ArgsType, Field, Int} from '@nestjs/graphql';
import {IsOptional} from 'class-validator';

@ArgsType()
export class AuthorSearchArgs {
    @Field(type => Int, {nullable: true, description: "Min count of books"})
    @IsOptional()
    minNumberOfBooks?: number;

    @Field(type => Int, {nullable: true, description: "Max count of books"})
    @IsOptional()
    maxNumberOfBooks?: number;
}
