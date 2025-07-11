import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { readMarkdownFile } from '@/lib/storage';
import { redirect } from 'next/navigation';
import { EditPostForm } from '@/components/EditPostForm';

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true }
  });

  if (!post || post.authorId !== user.id) {
    redirect('/dashboard');
  }

  const content = await readMarkdownFile(user.username, post.slug);

  return (
    <EditPostForm 
      post={post} 
      initialContent={content || ''} 
      username={user.username}
    />
  );
}