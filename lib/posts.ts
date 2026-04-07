import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return []
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .sort((a, b) => b.localeCompare(a))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      return { slug, content, ...data, date: data.date ? String(data.date).slice(0,10) : '' } as any
    })
}

export function getPostBySlug(slug: string) {
  if (!fs.existsSync(postsDirectory)) return null
  const exts = ['.mdx', '.md']
  
  // 完全一致で検索
  for (const ext of exts) {
    const fullPath = path.join(postsDirectory, `${slug}${ext}`)
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      return { slug, content, ...data, date: data.date ? String(data.date).slice(0,10) : '' } as any
    }
  }

  // ファイル名にslugが含まれる場合を検索
  const fileNames = fs.readdirSync(postsDirectory)
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) continue
    const fileSlug = fileName.replace(/\.mdx?$/, '')
    if (fileSlug === slug || fileSlug.endsWith(slug) || fileSlug.includes(slug)) {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      return { slug: fileSlug, content, ...data, date: data.date ? String(data.date).slice(0,10) : '' } as any
    }
  }

  return null
}
