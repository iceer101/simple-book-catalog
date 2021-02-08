import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Author} from "./entities/author.entity";
import {AuthorResolver} from './author.resolver';
import {AuthorService} from './author.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Author]),
    ],
    providers: [
        AuthorResolver,
        AuthorService
    ],
})
export class AuthorModule {}