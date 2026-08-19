#!/usr/bin/env node
/**
 * Create a new blog post from a template.
 *
 * Usage:
 *   pnpm new:post "Post Title"                           # Non-interactive, other fields use defaults
 *   pnpm new:post "Post Title" --category Tech \
 *     --tags "VitePress,Frontend" --description "Summary" --slug my-post
 *   pnpm new:post                                       # Enter interactive prompt if no title
 *
 * Options:
 *   --category <category>  Post category (optional)
 *   --tags <a,b>           Tags, comma-separated (optional)
 *   --description <text>   Summary description (optional)
 *   --slug <name>          Filename (without .md), defaults to title-derived
 *   --date <YYYY-MM-DD>    Publish date, defaults to today
 *   -h, --help             Show help
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const postsDir = join(projectRoot, 'posts')
const templatePath = join(__dirname, 'templates', 'post.md')

const HELP = `Usage:
  pnpm new:post <title> [options]    # Non-interactive creation
  pnpm new:post                       # Interactive prompt creation

Options:
  --category <category>  Post category
  --tags <a,b>           Tags, comma-separated
  --description <text>   Summary description
  --slug <name>          Filename (without .md), defaults to title-derived
  --date <YYYY-MM-DD>    Publish date, defaults to today
  -h, --help             Show help`

/** Parse CLI args: --key value format, rest as positionals */
function parseArgs(argv) {
  const args = { title: undefined, category: undefined, tags: undefined, description: undefined, slug: undefined, date: undefined, help: false }
  const positionals = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') {
      args.help = true
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      args[key] = next && !next.startsWith('--') ? argv[++i] : ''
    } else {
      positionals.push(arg)
    }
  }
  if (!args.title && positionals.length) args.title = positionals.join(' ')
  return args
}

/** Today's date, YYYY-MM-DD */
function today() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Generate filename from title (keep Chinese, spaces to hyphens, remove punctuation) */
function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w一-龥-]/g, '')
    .replace(/-+/g, '-')
}

/** Tags: support English and Chinese commas, trim whitespace */
function parseTags(str) {
  return String(str ?? '')
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean)
}

/** Interactive prompt under TTY */
async function ask(rl, question, fallback = '') {
  const hint = fallback ? ` (default ${fallback})` : ''
  const answer = (await rl.question(`${question}${hint}: `)).trim()
  return answer || fallback
}

/**
 * Interactive prompt. Uses readline in real terminals (line-by-line);
 * under piped input (non-TTY) readline would hang, so read all lines at once.
 */
async function promptFields(provided) {
  const answers = { ...provided }
  if (process.stdin.isTTY) {
    const rl = createInterface({ input: stdin, output: stdout })
    answers.title = await ask(rl, 'Post title', answers.title)
    answers.category = await ask(rl, 'Category (optional)', answers.category || '')
    answers.tags = await ask(rl, 'Tags, comma-separated (optional)', answers.tags || '')
    answers.description = await ask(rl, 'Description (optional)', answers.description || '')
    rl.close()
    return answers
  }
  const lines = await new Promise((resolve) => {
    let data = ''
    stdin.setEncoding('utf8')
    stdin.on('data', (chunk) => (data += chunk))
    stdin.on('end', () => resolve(data.split(/\r?\n/)))
  })
  answers.title = answers.title || lines[0]?.trim()
  answers.category = answers.category || lines[1]?.trim()
  answers.tags = answers.tags || lines[2]?.trim()
  answers.description = answers.description || lines[3]?.trim()
  return answers
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(HELP)
    return
  }

  let { title, category, tags, description, slug, date } = args

  // No title provided → enter interactive prompt
  if (!title) {
    const answers = await promptFields({ title, category, tags, description })
      ; ({ title, category, tags, description } = answers)
  }

  if (!title) {
    console.error('❌ Title is required')
    process.exit(1)
  }

  // Normalize date
  if (date && !/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
    console.error(`❌ Invalid date format: ${date} (should be YYYY-MM-DD)`)
    process.exit(1)
  }
  const [, y, m, d] = String(date).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/) || []
  if (y) date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  date = date || today()

  const tagList = parseTags(tags)
  slug = slug || slugify(title)
  const filePath = join(postsDir, `${slug}.md`)

  // Validate template and target file
  if (!existsSync(templatePath)) {
    console.error(`❌ Template file not found: ${templatePath}`)
    process.exit(1)
  }
  if (existsSync(filePath)) {
    console.error(`❌ File already exists, not created: ${filePath}`)
    process.exit(1)
  }

  const body = readFileSync(templatePath, 'utf8').trim()

  // Assemble frontmatter (omit empty optional fields)
  const fmLines = [
    '---',
    `title: ${title}`,
    `date: ${date}`,
    category ? `category: ${category}` : '',
    tagList.length ? `tags:\n${tagList.map((t) => `  - ${t}`).join('\n')}` : '',
    description ? `description: ${description}` : '',
    '---',
  ].filter(Boolean)

  const content = `${fmLines.join('\n')}\n\n${body}\n`

  mkdirSync(postsDir, { recursive: true })
  writeFileSync(filePath, content, 'utf8')

  console.log(`✅ Post created: ${filePath}`)
  console.log('   Adjust category/tags/date in frontmatter; use <!-- more --> in body to truncate homepage summary.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
