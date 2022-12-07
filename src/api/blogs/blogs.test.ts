import request from 'supertest'

import app from '../../app'
import { client } from '../../db';
import { Blogs } from './blog.model'

beforeAll(async () => {
    try{
        await Blogs.drop();
    }catch (error) {}
})


describe('GET /api/posts', () => {
    it('Testing list blog posts endpoint',  async () =>
        request(app)
        .get('/api/posts')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.blogPosts).toHaveProperty('length');
            expect(response.body.blogPosts.length).toBe(3);
        })
    )
})


global.afterAll(async () => {
    await client.close();
  });