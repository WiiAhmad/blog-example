import { prisma } from '@/lib/prisma';
import { readMarkdownFile, markdownToHtml } from '@/lib/storage';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Home, ArrowLeft } from 'lucide-react';
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

  const markdown = await readMarkdownFile(params.username, params.slug);
  if (!markdown) {
    notFound();
  }

  const html = await markdownToHtml(markdown);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href={`/${params.username}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {params.username}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{post.slug}</Badge>
                  <Badge variant="outline">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <Link 
                      href={`/${post.author.username}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.author.username}
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {post.updatedAt.getTime() !== post.createdAt.getTime() && (
                    <span className="text-sm text-gray-500">
                      Updated {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Post Content */}
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-gray-900 prose-code:text-pink-600 prose-pre:bg-gray-100 prose-blockquote:border-blue-200 prose-blockquote:text-gray-700"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href={`/${params.username}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                More from {params.username}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}