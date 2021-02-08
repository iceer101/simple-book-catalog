import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from "../app.module";

describe('App E2E test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });
    afterAll(() => app.close());


    let author: any = {
        firstName: 'TestFirstName' + Math.random().toString(),
        lastName: 'TestLastName' + Math.random().toString()
    };
    it('createAuthor', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                operationName: 'createAuthor',
                variables: {"createAuthor": author},
                query: `mutation createAuthor($createAuthor: AuthorInput!) {
                            createAuthor (author: $createAuthor){
                                id
                                firstName
                                lastName
                            }
                        }`,
            })
            .expect(({body}) => {
                const data = body.data.createAuthor;
                author.id = data.id;
                expect(data).toEqual(author);
            })
            .expect(200)
    });
    it('getAuthor', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                operationName: 'getAuthor',
                query: `query getAuthor {
                            getAuthor(id: ${author.id}){
                                id
                                firstName
                                lastName
                            }
                        }`,
            })
            .expect(({body}) => {
                const data = body.data.getAuthor;
                expect(data).toEqual(author);
            })
            .expect(200)
    });
    it('deleteAuthor', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                operationName: 'deleteAuthor',
                variables: {"id": +author.id},
                query: `mutation deleteAuthor($id: Int!) {
                            deleteAuthor (id: $id)
                        }`,
            })
            .expect(({body}) => {
                const data = body.data.deleteAuthor;
                expect(data).toEqual(1);
            })
            .expect(200)
    });
    it('getAuthor', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                operationName: 'getAuthor',
                query: `query getAuthor {
                            getAuthor(id: ${author.id}){
                                id
                                firstName
                                lastName
                            }
                        }`,
            })
            .expect(({body}) => {
                const data = body.data.getAuthor;
                expect(data).toBe(null);
            })
            .expect(200)
    });

});