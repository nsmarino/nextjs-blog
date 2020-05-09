import fs from 'fs'
import path from 'path'
import matter from 'gray-matter' // parses front-matter from markdown
import remark from 'remark'
import html from 'remark-html'

// These are helper functions that help us build pages from the data
// stored in the /pages/posts/ directory. We are accessing this
// using node's fs (for filesystem) but it could also come from 
// a CMS or a database.

// connect to directory -- node's path tool is used to join
// the Current Working Directory with the 'posts' directory
const postsDirectory = path.join(process.cwd(), 'posts')

// used to display list of blog posts
export function getSortedPostsData() {
  // Get file names under /posts...readdirSync returns array with file names
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id (making a slug)
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// used in [id].js to statically render posts (returns path of post to be rendered)
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
  
    // Returns an array of objects:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
      return {
        params: {
          id: fileName.replace(/\.md$/, '')
        }
      }
    })
}

// used in [id].js to populate props for static page
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

// Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

// Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

// Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}
