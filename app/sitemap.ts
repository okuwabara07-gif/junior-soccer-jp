import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.vercel.app'
  let posts: MetadataRoute.Sitemap = []
  try {
    const allPosts = getAllPosts()
    posts = allPosts.map((post: any) => {
      let lastMod = new Date()
      try {
        const d = new Date(String(post.date || '').trim())
        if (!isNaN(d.getTime())) lastMod = d
      } catch {}
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })
  } catch {}
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...posts,
  ]
}
