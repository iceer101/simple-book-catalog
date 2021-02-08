import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppController} from "./app.controller";
import {AuthorModule} from "./modules/author/author.module";
import {BookModule} from "./modules/book/book.module";

@Module({
    imports: [
        AuthorModule,
        BookModule,
        TypeOrmModule.forRoot({
            autoLoadEntities: true
        }),
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.gql',
            playground: true,
            debug: false,
            introspection: true
        }),
    ],
    controllers: [AppController]
})
export class AppModule {}