import {Injectable} from '@nestjs/common';
import {createQueryBuilder, In, Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {Author} from './entities/author.entity';
import {AuthorSearchArgs} from './dto/author.args';
import {AuthorInput} from "./dto/author.input";

@Injectable()
export class AuthorService {
    constructor(@InjectRepository(Author) private authorRepository: Repository<Author>) {}

    /**
     * Создание нового автора
     * */
    async getAuthor(id: number): Promise<Author> {
        return this.authorRepository.findOne(id);
    }

    /**
     * Получение авторов с фильтрами
     * */
    async getAuthors(params: AuthorSearchArgs): Promise<Author[]> {
        let options = {where: {}, relations: ["books"]};

        if (params.minNumberOfBooks != undefined || params.maxNumberOfBooks != undefined) {
            let authorList = this.authorRepository.createQueryBuilder()
                .select('Author.id', 'author_id')
                .leftJoin('author_books_book', 'abb', 'Author.id = abb.authorId')
                .groupBy('Author.id');
            if (params.minNumberOfBooks != undefined) authorList = authorList
                .having('sum(abb.authorId is not null) >= :minNumberOfBooks', {minNumberOfBooks: params.minNumberOfBooks});
            if (params.maxNumberOfBooks != undefined) authorList = authorList
                .andHaving('sum(abb.authorId is not null) <= :maxNumberOfBooks', {maxNumberOfBooks: params.maxNumberOfBooks});
            options.where = {
                id: In((await authorList.execute()).map(author => +author.author_id))
            }
        }

        return this.authorRepository.find(options);
    }

    /**
     * Создание нового автора
     * */
    async createAuthor(author: AuthorInput): Promise<Author> {
        return this.authorRepository.save(author);
    }

    /**
     * Удаляет автора и все его книги без соавторов
     * */
    async deleteAuthorWithBooks(id: number): Promise<number> {
        let booksOfAuthor = await createQueryBuilder()
            .select('b.id', 'book_id')
            .from('book', 'b')
            .innerJoin('author_books_book', 'abb', 'b.id = abb.bookId')
            .where('authorId= :id', {id})
            .execute();
        booksOfAuthor = booksOfAuthor
            .map(book => book.book_id);

        const deleteAuthor = await this.authorRepository.delete({id});
        if (!booksOfAuthor.length) return deleteAuthor.affected;

        let remainingBooksToDelete = await createQueryBuilder()
            .select('book.id', 'book_id')
            .from('book', 'book')
            .leftJoin('author_books_book', 'abb', 'book.id = abb.bookId')
            .where({id: In(booksOfAuthor)})
            .groupBy('id')
            .having('sum(abb.authorId is not null) = 0')
            .execute();
        remainingBooksToDelete = remainingBooksToDelete
            .map(book => book.book_id);

        if (!remainingBooksToDelete.length) return deleteAuthor.affected;

        const deleteRemainingBooks = await createQueryBuilder()
            .delete()
            .from('book')
            .where({id: In(remainingBooksToDelete)})
            .execute();

        return deleteAuthor.affected + deleteRemainingBooks.affected;
    }

    /**
     * Удаляет автора
     * */
    async deleteAuthor(id: number): Promise<number> {
        let deleteResult = await this.authorRepository.delete(id);
        return deleteResult.affected;
    }
}
