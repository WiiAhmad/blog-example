import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeMarkdownFile } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, title, content } = await request.json();

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Slug, title, and content are required' },
        { status: 400 }
      );
    }

    // Find the post and verify ownership
    const post = await prisma.post.findUnique({
      where: { slug }
    });

    if (!post || post.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Post not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update post in database
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title,
        updatedAt: new Date()
      }
    });

    // Update markdown file
    await writeMarkdownFile(user.username, slug, content);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}