export default defineSitemapEventHandler(async () => {
  const { items } = await readPublicBlogList()
  return items.map(post => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.publishedAt || undefined,
  }))
})
