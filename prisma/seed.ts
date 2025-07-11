import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'ahmad' },
    update: {},
    create: {
      username: 'ahmad',
      password: hashedPassword
    }
  });

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 10);
  
  const editorUser = await prisma.user.upsert({
    where: { username: 'sarah' },
    update: {},
    create: {
      username: 'sarah',
      password: editorPassword
    }
  });

  console.log('Seeded users:', { adminUser, editorUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });