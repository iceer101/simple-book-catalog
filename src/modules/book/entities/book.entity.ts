import {Entity, Column, PrimaryGeneratedColumn, ManyToMany} from 'typeorm';
import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Author} from "../../author/entities/author.entity";

@ObjectType()
@Entity({name: 'book'})
export class Book {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field(type => [Author], {defaultValue: []})
    @ManyToMany(() => Author, author => author.books)
    authors: [Author?];
}