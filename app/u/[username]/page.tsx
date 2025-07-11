import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface UserPageProps {
  params: {
    username: string;
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const user = await prisma.user.findUnique({
    where: { username: (await params).username },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    notFound();
  }

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
            <Link href="/">
              <Button variant="outline" className="hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* User Profile Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.username}</h1>
            <p className="text-xl text-gray-600 mb-4">
              Personal Blog & Thoughts
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {user.posts.length} {user.posts.length === 1 ? 'Post' : 'Posts'}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
              <Badge variant="secondary" className="text-sm">
                {user.posts.length} {user.posts.length === 1 ? 'post' : 'posts'}
              </Badge>
            </div>

            {user.posts.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  {user.username} hasn't published any posts yet. Check back later!
                </p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {user.posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 hover:text-blue-600 transition-colors">
                            <Link href={`/u/${user.username}/post/${post.slug}`}>
                              {post.title}
                            </Link>
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {post.slug}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">
                          Last updated {new Date(post.updatedAt).toLocaleDateString()}
                        </p>
                        <Link href={`/u/${user.username}/post/${post.slug}`}>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
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