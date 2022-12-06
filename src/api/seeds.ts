import { Blogs } from "./blogs/blog.model"

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
            "slug": "",
            "title": "Augmented Reality iOS Application",
            "description": "Rubicon Software Development and Gazzda furniture are proud to launch an augmented reality app.",
            "body": "The app is simple to use, and will help you decide on your best furniture fit.",
            "tagList": ["iOS", "AR"],
            "createdAt": "2018-05-18T03:22:56.637Z",
            "updatedAt": "2018-05-18T03:48:35.824Z"
            }
    }      
]

const seedDB = async () => {
    await Blogs.deleteMany({})
    await Blogs.insertMany(seedBlogs)
}

export default seedDB