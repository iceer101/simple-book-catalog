import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, EntityManager, getConnection, ILike, Repository} from "typeorm";
import {Author} from "../author/entities/author.entity";
import {Book} from "./entities/book.entity";
import {BookInput} from "./dto/book.input";

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        private connection: Connection
    ) {}

    /**
     * Получение книги по ID
     * */
    async getBook(id: number): Promise<Book> | null {
        return this.bookRepository.findOne({id}, {relations: ["authors"]});
    }

    /**
     * Получение книг по частичному вхождению
     * */
    async getBooks(title: string): Promise<Book[]> {
        let options = {
            relations: ["authors"],
            where: {}
        };
        if (title) options.where = {title: ILike(title)};
        return this.bookRepository.find(options);
    }


    /**
     * Создание книги
     * */
    async createBook(book: BookInput): Promise<Book> {
        return getConnection().transaction(
            async (manager: EntityManager) => {
                const newBook = <Book>await manager.save(Book, {title: book.title});
                await manager
                    .createQueryBuilder()
                    .relation(Author, "books")
                    .of(book.authorIds)
                    .add(newBook.id);

                return await manager.findOne(Book, {id: newBook.id}, {relations: ["authors"]});
            }
        ).catch(() => {
            throw new HttpException('Error, please check data', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }


    /**
     * Добавить в соавтороство книги
     * */
    async addAuthor(bookId: number, authorId: number): Promise<Book> {
        const book = await this.bookRepository.findOne({id: bookId});
        if (!book) throw new HttpException(`Book[${bookId}] not exist`, HttpStatus.UNPROCESSABLE_ENTITY);

        await this.bookRepository
            .createQueryBuilder()
            .relation(Author, "books")
            .of(authorId)
            .add(bookId)
            .catch(() => {
                throw new HttpException('The author is already a member of the authors', HttpStatus.UNPROCESSABLE_ENTITY);
            });

        return this.bookRepository.findOne({id: bookId}, {relations: ["authors"]});
    }

    /**
     * Удаление книги
     * */
    async deleteBook(id: number): Promise<number> {
        let deleteResult = await this.bookRepository.delete(id);
        return deleteResult.affected;
    }

}
