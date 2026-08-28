import { join } from 'node:path'
import { existsSync, statSync } from 'node:fs'

const PORT = 3333
const ROOT = import.meta.dir

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

console.log(`\n🚀 Starting Surfex Website Server at http://localhost:${PORT}/\n`)

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url)
    let pathname = decodeURIComponent(url.pathname)

    // Default to index.html if root or directory
    let filePath = join(ROOT, pathname)

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html')
    } else if (!existsSync(filePath) && existsSync(join(ROOT, `${pathname}.html`))) {
      filePath = join(ROOT, `${pathname}.html`)
    } else if (!existsSync(filePath) && existsSync(join(filePath, 'index.html'))) {
      filePath = join(filePath, 'index.html')
    }

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = filePath.substring(filePath.lastIndexOf('.'))
      const contentType = mimeTypes[ext] || 'application/octet-stream'
      const file = Bun.file(filePath)
      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Fallback 404
    return new Response(`<!DOCTYPE html><html><body style="background:#141011;color:#fff;font-family:sans-serif;text-align:center;padding:4rem;"><h1>404 Not Found</h1><p>The page "${pathname}" does not exist.</p><a href="/" style="color:#ff5555;">Go to Surfex Home</a></body></html>`, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  },
})

console.log(`✓ Local server running: http://localhost:${PORT}`)
