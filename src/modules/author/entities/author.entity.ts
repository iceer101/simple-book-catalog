import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';
import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Book} from "../../book/entities/book.entity";


@Entity({name: 'author'})
@ObjectType()
export class Author {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field(type => [Book], {defaultValue: []})
    @ManyToMany(() => Book, book => book.authors, {eager: true})
    @JoinTable()
    books: [Book?];
}