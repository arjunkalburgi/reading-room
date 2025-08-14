import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import fetch from 'node-fetch'
import { Client as NotionOfficial } from '@notionhq/client'
import { NotionAPI } from 'notion-client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const DATA_DIR = path.join(root, 'data')
const POSTS_DIR = path.join(DATA_DIR, 'posts')
const PUBLIC_NOTION_DIR = path.join(root, 'public', 'notion')

const notionOfficial = new NotionOfficial({ auth: process.env.NOTION_API_KEY })
const notionUnofficial = new NotionAPI()
const DB_ID = process.env.NOTION_DATABASE_ID

// ---------- Helpers ----------
function ensureDirs() {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.mkdirSync(POSTS_DIR, { recursive: true })
    fs.mkdirSync(PUBLIC_NOTION_DIR, { recursive: true })
}

function sha1(str) {
    return crypto.createHash('sha1').update(str).digest('hex').slice(0, 16)
}

async function download(url, destRel) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
        const dest = path.join(root, 'public', destRel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(dest, buf)
}

function collectAssetUrls(recordMap) {
    const urls = []
    const blocks = recordMap.block || {}
    for (const id in blocks) {
        const block = blocks[id]?.value
        if (!block) continue
        const type = block.type
        if (['image', 'file', 'video', 'pdf'].includes(type)) {
            const src = block?.properties?.source?.[0]?.[0]
            if (src && /^https?:\/\//.test(src)) {
                urls.push(src)
            }
        }
    }
    return urls
}

function rewriteAssets(recordMap, rewrites) {
    const blocks = recordMap.block || {}
    for (const id in blocks) {
        const block = blocks[id]?.value
        if (!block) continue
        const src = block?.properties?.source?.[0]?.[0]
        if (src && rewrites[src]) {
            block.properties.source[0][0] = rewrites[src]
        }
    }
}

function getProp(page, key) {
    const prop = page.properties?.[key]
    if (!prop) return ''
    if (prop.type === 'title') return prop.title.map(t => t.plain_text).join('')
        if (prop.type === 'rich_text') return prop.rich_text.map(t => t.plain_text).join('')
            if (prop.type === 'multi_select') return prop.multi_select.map(t => t.name)
                if (prop.type === 'date') return prop.date?.start || ''
    return ''
}

function estimateReadingTime(recordMap) {
    let text = ''
    for (const b of Object.values(recordMap.block)) {
        const block = b?.value
        if (block?.properties?.title) {
            text += block.properties.title.map(t => t[0]).join(' ') + ' '
        }
    }
    const words = text.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 200))
}

// ---------- Main ----------
async function main() {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
        throw new Error('Missing NOTION_API_KEY or NOTION_DATABASE_ID env vars')
    }
    
    ensureDirs()
    
    console.log('Querying Notion database...')
    const query = await notionOfficial.databases.query({
        database_id: DB_ID,
        filter: { property: 'Published', checkbox: { equals: true } },
        sorts: [{ property: 'Date', direction: 'descending' }]
    })
    
    const indexMeta = []
    
    for (const page of query.results) {
        const pageId = page.id
        const title = getProp(page, 'Name')
        const slug =
        getProp(page, 'Slug') ||
        title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const date = getProp(page, 'Date')
        const summary = getProp(page, 'Summary')
        const contentType = getProp(page, 'Content type');
        
        console.log(`Fetching recordMap for: ${title} (${slug})`)
        const recordMap = await notionUnofficial.getPage(pageId)
        
        const assetUrls = collectAssetUrls(recordMap)
        const rewrites = {}
        for (const url of assetUrls) {
            const ext = path.extname(new URL(url).pathname) || '.bin'
            const filename = `${sha1(url)}${ext}`
            const rel = path.join('notion', filename)
            await download(url, rel)
            const basePrefix = process.env.CUSTOM_DOMAIN
            ? ''
            : process.env.GITHUB_REPOSITORY?.split('/')?.[1]
            ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}`
            : ''
            rewrites[url] = `${basePrefix}/notion/${filename}`
        }
        rewriteAssets(recordMap, rewrites)
        
        const outPath = path.join(POSTS_DIR, `${slug}.json`)
        fs.writeFileSync(outPath, JSON.stringify(recordMap))
        
        const readingMinutes = estimateReadingTime(recordMap)
        
        const hero =
        Object.values(recordMap.block || {})
        .map(b => b?.value)
        .find(b => b?.type === 'image')?.properties?.source?.[0]?.[0] || null
        
        indexMeta.push({ title, slug, date, tags, summary, hero, contentType, readingMinutes })
    }
    
    fs.writeFileSync(path.join(DATA_DIR, 'index.json'), JSON.stringify(indexMeta, null, 2))
    console.log(`Wrote ${indexMeta.length} posts to data/`)
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
