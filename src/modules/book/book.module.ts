import {Module} from '@nestjs/common';
import {BookResolver} from './book.resolver';
import {BookService} from './book.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Book} from "./entities/book.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Book]),
    ],
    providers: [
        BookResolver,
        BookService
    ],
})
export class BookModule {}