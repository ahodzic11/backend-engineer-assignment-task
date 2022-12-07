import { Blogs } from "./blogs/blog.model"
import { BlogCommentsDB } from "./blogs/blogcomments.model"

const seedBlogs = [
    {
        "blogPost": {
            "slug": "augmented-reality-ios-application",
            "title": "Augmented Reality iOS Application",
            "description": "Rubicon Software Development and Gazzda furniture are proud to launch an augmented reality app.",
            "body": "The app is simple to use, and will help you decide on your best furniture fit.",
            "tagList": ["iOS", "AR"],
            "createdAt": "2018-05-18T03:22:56.637Z",
            "updatedAt": "2018-05-18T03:48:35.824Z"
            }
    },
    {
        "blogPost": {
            "slug": "building-razor-page-web-applications",
            "title": "Building Razor Page Web Applications",
            "description": "ASP.NET Core Razor pages and ASP.NET Core MVC are both server rendered/server based frameworks.",
            "body": "Both techniques use Razor template engine to create UI/view components and processing logic that runs on the server and servers the html content back.",
            "tagList": [".NET", ".NETCore", "ASP.NET", "C#"],
            "createdAt": "2018-05-19T03:22:56.637Z",
            "updatedAt": "2018-05-19T03:48:35.824Z"
            }
    },
    {
        "blogPost": {
            "slug": "containerization-with-docker",
            "title": "Containerization with Docker",
            "description": "Docker is one of the leading providers of containerization tools and technology platform.",
            "body": "Docker helps software developers to easily build, run and manage containerized applications/software, especially in a cloud environment.",
            "tagList": ["Containerization", "DevOps"],
            "createdAt": "2018-05-20T03:22:56.637Z",
            "updatedAt": "2018-05-20T03:48:35.824Z"
            }
    }    
]

const seedComments = [
    {
        "blogSlug": "augmented-reality-ios-application",
        "comments": [
            {
                "id": 1,
                "createdAt": "2022-12-06T19:27:40.900Z",
                "updatedAt": "2022-12-06T19:27:40.900Z",
                "body": "Very informative!"
            },
            {
                "id": 2,
                "createdAt": "2022-12-06T19:27:40.900Z",
                "updatedAt": "2022-12-06T19:27:40.900Z",
                "body": "Great blog!"
            }
        ]
    },
    {
        "blogSlug": "building-razor-page-web-applications",
        "comments": [
            {
                "id": 1,
                "createdAt": "2022-12-06T19:27:40.900Z",
                "updatedAt": "2022-12-06T19:27:40.900Z",
                "body": "Interesting."
            }
        ]
    },
    {
        "blogSlug": "containerization-with-docker",
        "comments": [
            {
                "id": 1,
                "createdAt": "2022-12-06T19:27:40.900Z",
                "updatedAt": "2022-12-06T19:27:40.900Z",
                "body": "Very informative!"
            },
            {
                "id": 2,
                "createdAt": "2022-12-06T19:27:40.900Z",
                "updatedAt": "2022-12-06T19:27:40.900Z",
                "body": "Interesting topic."
            },
            {
                "id": 3,
                "createdAt": "2022-12-06T19:27:40.900Z",
                "updatedAt": "2022-12-06T19:27:40.900Z",
                "body": "I like it!"
            },
            {
                "id": 4,
                "createdAt": "2022-12-06T19:27:40.900Z",
                "updatedAt": "2022-12-06T19:27:40.900Z",
                "body": "Good blog!"
            }
        ]
    }
]

const seedDB = async () => {
    await Blogs.deleteMany({})
    await Blogs.insertMany(seedBlogs)
    await BlogCommentsDB.deleteMany({})
    await BlogCommentsDB.insertMany(seedComments)
}

export default seedDB