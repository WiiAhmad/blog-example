import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

const POSTS_DIR = path.join(process.cwd(), 'posts');

export async function ensurePostsDir(username: string) {
  const userDir = path.join(POSTS_DIR, username);
  try {
    await fs.mkdir(userDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

export async function writeMarkdownFile(username: string, slug: string, content: string) {
  await ensurePostsDir(username);
  const filePath = path.join(POSTS_DIR, username, `${slug}.md`);
  await fs.writeFile(filePath, content, 'utf8');
}

export async function readMarkdownFile(username: string, slug: string): Promise<string | null> {
  try {
    const filePath = path.join(POSTS_DIR, username, `${slug}.md`);
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    return null;
  }
}

export async function deleteMarkdownFile(username: string, slug: string) {
  try {
    const filePath = path.join(POSTS_DIR, username, `${slug}.md`);
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}