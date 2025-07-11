import { prisma } from '@/lib/prisma';
import { readMarkdownFile } from '@/lib/storage';
import { markdownToHtml } from '@/lib/markdown';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, BookOpen, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    username: string;
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true }
  });

  if (!post || post.author.username !== params.username) {
    notFound();
  }

  const markdownContent = await readMarkdownFile(params.username, params.slug);
  
  if (!markdownContent) {
    notFound();
  }

  const htmlContent = await markdownToHtml(markdownContent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                MarkdownBlog
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link href={`/u/${params.username}`}>
                <Button variant="outline" className="hover:bg-blue-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {params.username}'s Blog
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="hover:bg-gray-50">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <Link 
                    href={`/u/${post.author.username}`}
                    className="font-medium hover:text-blue-600 transition-colors"
                  >
                    {post.author.username}
                  </Link>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <time dateTime={post.createdAt.toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                {post.updatedAt.getTime() !== post.createdAt.getTime() && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      Updated {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center">
                <Badge variant="outline" className="text-sm">
                  {post.slug}
                </Badge>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </CardContent>
          </Card>

          {/* Post Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Written by{' '}
                    <Link 
                      href={`/u/${post.author.username}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {post.author.username}
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">
                    Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <Link href={`/u/${post.author.username}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  View More Posts
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-semibold">MarkdownBlog</span>
          </div>
          <p className="text-gray-400">
            A modern blogging platform built with Next.js and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}