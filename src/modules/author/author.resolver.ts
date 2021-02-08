import {Args, ID, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Author} from './entities/author.entity';
import {AuthorService} from './author.service';
import {AuthorSearchArgs} from "./dto/author.args";
import {AuthorInput} from "./dto/author.input";


@Resolver(of => Author)
export class AuthorResolver {
    constructor(private readonly authorsService: AuthorService) {}

    /**
     * Возвращает автора по ID, если ничего не нашло - null
     * getAuthor(id: ID!): Author
     * */
    @Query(returns => Author, {nullable: true})
    async getAuthor(@Args('id', {type: () => ID!}) id: number): Promise<Author> | null {
        return await this.authorsService.getAuthor(id);
    }

    /**
     * Возвращает авторов
     * getAuthors(minNumberOfBooks: Int, maxNumberOfBooks: Int): [Author!]!
     # * getAuthors() возвращает всех авторов
     # * getAuthors(minNumberOfBooks: 3) возвращает авторов у которых 3 и более книг
     # * getAuthors(maxNumberOfBooks: 10) возвращает авторов у которых не больше 10 книг
     # * getAuthors(minNumberOfBooks: 3, maxNumberOfBooks: 6) возвращает авторов у которых 3, 4, 5 или 6 книг
     * */
    @Query(returns => [Author])
    async getAuthors(@Args() params: AuthorSearchArgs): Promise<Author[]> {
        return await this.authorsService.getAuthors(params);
    }

    /**
     * Создает и возвращает нового автора
     * createAuthor(author: AuthorInput!): Author!
     * */
    @Mutation(returns => Author)
    async createAuthor(@Args('author') author: AuthorInput): Promise<Author> {
        return await this.authorsService.createAuthor(author);
    }

    /**
     * Удаляет автора и возвращает количество удаленных записей (0 или 1)
     * deleteAuthor(id: ID!): Int!
     * */
    @Mutation(returns => Int)
    async deleteAuthor(@Args('id', {type: () => Int}) id: number): Promise<number> {
        return await this.authorsService.deleteAuthor(id);
    }

    /**
     * Удаляет автора и все его книги без соавторов
     * deleteAuthorWithBooks(id: ID!): Int!
     * * для книг в соавторстве удаляет автора из списка авторов
     * * возвращает количество удаленных и измененных записей (автор + книги без соавторов + книги в соавторстве или 0)
     * */
    @Mutation(returns => Int)
    async deleteAuthorWithBooks(@Args('id', {type: () => Int}) id: number): Promise<number> {
        return await this.authorsService.deleteAuthorWithBooks(id);
    }

}
