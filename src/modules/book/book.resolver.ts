import {Args, ID, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Book} from './entities/book.entity';
import {BookService} from './book.service';
import {BookInput} from "./dto/book.input";

@Resolver(of => Book)
export class BookResolver {
    constructor(private readonly booksService: BookService) {}

    /**
     * Возвращает книгу и null, если ничего не найдено
     * getBook(id: ID!): Book
     * */
    @Query(returns => Book, {nullable: true})
    async getBook(@Args('id', {type: () => ID!}) id: number): Promise<Book> | null {
        return await this.booksService.getBook(id);
    }

    /**
     * Ищет и возвращает все книги
     * getBooks(title: String): [Book!]!
     * * поиск нечувствительный к регистру, поддерживает like синтаксис
     * * getBooks() возвращает все книги
     * * getBooks(title: "Art of %") возвращает книги начинающиеся с 'Art of'
     */
    @Query(returns => [Book])
    async getBooks(@Args('title', {nullable: true}) title: string): Promise<Book[]> {
        return await this.booksService.getBooks(title);
    }

    /**
     * Создает книгу
     * createBook(book: BookInput!): Book!
     *  */
    @Mutation(returns => Book)
    async createBook(@Args('book') book: BookInput): Promise<Book> {
        return await this.booksService.createBook(book);
    }


    /**
     * Добавляет автора к книге
     * addAuthor(bookId: ID!, authorId: ID!): Book!
     * */
    @Mutation(returns => Book)
    async addAuthor(
        @Args('bookId', {type: () => ID!}) bookId: number,
        @Args('authorId', {type: () => ID!}) authorId: number
    ): Promise<Book> {
        return await this.booksService.addAuthor(bookId, authorId);
    }


    /**
     * Удаляет книгу и возвращает количество удаленных записей (0 или 1)
     * deleteBook(id: ID!): Int!
     * */
    @Mutation(returns => Int)
    async deleteBook(@Args('id', {type: () => Int!}) id: number): Promise<number> {
        return await this.booksService.deleteBook(id);
    }

}
