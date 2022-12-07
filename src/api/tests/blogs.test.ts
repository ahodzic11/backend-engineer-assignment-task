import request from 'supertest'

import app from '../../app'
import { client } from '../../db';
import { Blogs } from '../models/blog'

beforeAll(async () => {
    try{
        await Blogs.drop();
    }catch (error) {}
})

let slug = 'augmented-reality-ios-application';
describe('GET /api/posts/:slug', () => {
    it('Get Blog Post Endpoint test', async () => 
        request(app)
        .get(`/api/posts/${slug}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).toHaveProperty('blogPost');
            expect(response.body.blogPost).toHaveProperty('slug')
            expect(response.body.blogPost.slug).toBe('augmented-reality-ios-application')
            expect(response.body.blogPost).toHaveProperty('title')
            expect(response.body.blogPost.title).toBe('Augmented Reality iOS Application')
            expect(response.body.blogPost).toHaveProperty('description')
            expect(response.body.blogPost.description).toBe('Rubicon Software Development and Gazzda furniture are proud to launch an augmented reality app.')
            expect(response.body.blogPost).toHaveProperty('body')
            expect(response.body.blogPost.body).toBe('The app is simple to use, and will help you decide on your best furniture fit.')
            expect(response.body.blogPost).toHaveProperty('tagList')
            expect(response.body.blogPost.tagList).toHaveProperty('length');
            expect(response.body.blogPost.tagList.length).toBe(2);
            expect(response.body.blogPost).toHaveProperty('createdAt')
            expect(response.body.blogPost.createdAt).toBe('2018-05-18T03:22:56.637Z')
            expect(response.body.blogPost).toHaveProperty('updatedAt')
            expect(response.body.blogPost.updatedAt).toBe('2018-05-18T03:48:35.824Z')
        })
    )
})

describe('GET /api/posts', () => {
    it('List Blog Posts Endpoint test',  async () =>
        request(app)
        .get('/api/posts')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.blogPosts).toHaveProperty('length');
            expect(response.body.blogPosts.length).toBe(3);
            expect(response.body.postsCount).toBe(3);
        })
    )
})

describe('POST /api/posts', () => {
    it('Create Blog Post Endpoint test', async() => 
        request(app)
        .post('/api/posts')
        .set('Accept', 'application/json')
        .send({
            "blogPost": {
              "title": "Internet Trends 2018",
              "description": "Ever wonder how?",
              "body": "An opinionated commentary, of the most important presentation of the year",
              "tagList": ["trends", "innovation", "2018"]
            }
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
            expect(response.body).toHaveProperty('blogPost');
            expect(response.body.blogPost).toHaveProperty('slug')
            expect(response.body.blogPost.slug).toBe('internet-trends-2018')
            expect(response.body.blogPost).toHaveProperty('title')
            expect(response.body.blogPost.title).toBe('Internet Trends 2018')
            expect(response.body.blogPost).toHaveProperty('description')
            expect(response.body.blogPost.description).toBe('Ever wonder how?')
            expect(response.body.blogPost).toHaveProperty('body')
            expect(response.body.blogPost.body).toBe('An opinionated commentary, of the most important presentation of the year')
            expect(response.body.blogPost).toHaveProperty('tagList')
            expect(response.body.blogPost.tagList).toHaveProperty('length');
            expect(response.body.blogPost.tagList.length).toBe(3);
        })
    )
})

describe('PUT /api/posts/:slug', () => {
    it('Update Blog Post Endpoint test', async() => 
        request(app)
        .put(`/api/posts/${slug}`)
        .set('Accept', 'application/json')
        .send({
            "blogPost": {
              "description": "New updated blog description"
            }
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).toHaveProperty('blogPost');
            expect(response.body.blogPost).toHaveProperty('slug')
            expect(response.body.blogPost.slug).toBe('augmented-reality-ios-application')
            expect(response.body.blogPost).toHaveProperty('title')
            expect(response.body.blogPost.title).toBe('Augmented Reality iOS Application')
            expect(response.body.blogPost).toHaveProperty('description')
            expect(response.body.blogPost.description).toBe('New updated blog description')
            expect(response.body.blogPost).toHaveProperty('body')
            expect(response.body.blogPost.body).toBe('The app is simple to use, and will help you decide on your best furniture fit.')
            expect(response.body.blogPost).toHaveProperty('tagList')
            expect(response.body.blogPost.tagList).toHaveProperty('length');
            expect(response.body.blogPost.tagList.length).toBe(2);
        })
    )
})

describe('DELETE /api/posts/:slug', () => {
    it('Delete Blog Post Endpoint test', (done) => {
        request(app)
        .delete(`/api/posts/${slug}`)
        .expect(200, done)
    })
})

describe('GET /api/tags', () => {
    it('Get Tags Endpoint test',  async () =>
        request(app)
        .get('/api/tags')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.tags).toHaveProperty('length');
            expect(response.body.tags.length).toBe(9);
        })
    )
})


let secondSlug = "building-razor-page-web-applications"
describe('POST /api/posts/:slug/comments', () => {
    it('Add Comments to a blog post Endpoint test', async() => 
        request(app)
        .post(`/api/posts/${secondSlug}/comments`)
        .set('Accept', 'application/json')
        .send({
            "comment": {
                "body": "Nice explanation."
            }
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
            expect(response.body).toHaveProperty('comment');
            expect(response.body.comment).toHaveProperty('id')
            expect(response.body.comment.id).toBe(2)
            expect(response.body.comment).toHaveProperty('body')
            expect(response.body.comment.body).toBe('Nice explanation.')
        })
    )
})

describe('GET /api/posts/:slug/comments', () => {
    it('Get Comments from a blog post Endpoint test', async () => 
        request(app)
        .get(`/api/posts/${secondSlug}/comments`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => { 
            expect(response.body).toHaveProperty('comments');
            expect(response.body.comments.length).toBe(2);
        })
    )
})

let commentId = 2
describe('DELETE /api/posts/:slug/comments/:id', () => {
    it('Delete Comment Endpoint test', (done) => {
        request(app)
        .delete(`/api/posts/${slug}/comments/${commentId}`)
        .expect(200, done)
    })
})

global.afterAll(async () => {
    await client.close();
  });