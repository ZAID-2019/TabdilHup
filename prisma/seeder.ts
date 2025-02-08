import { PrismaClient, Gender, UserRoles } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🚀 Seeding default users...');

    // Hash passwords for all users
    const hashedPasswords = {
      superadmin: await bcrypt.hash('superadmin@123', 10),
      admin: await bcrypt.hash('admin@123', 10),
      moderator: await bcrypt.hash('moderator@123', 10),
      user: await bcrypt.hash('user@123', 10), // Your provided password
    };

    // Default users list (including your provided data)
    const users = [
      {
        first_name: 'Super Admin',
        last_name: 'Super Admin',
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: hashedPasswords.superadmin,
        gender: Gender.MALE,
        role: UserRoles.SUPER_ADMIN,
      },
      {
        first_name: 'Admin',
        last_name: 'Admin',
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPasswords.admin,
        gender: Gender.MALE,
        role: UserRoles.ADMIN,
      },
      {
        first_name: 'Moderator',
        last_name: 'Moderator',
        username: 'moderator',
        email: 'moderator@example.com',
        password: hashedPasswords.moderator,
        gender: Gender.MALE,
        role: UserRoles.MODERATOR,
      },
      // ✅ Your provided user data
      {
        first_name: 'user',
        last_name: 'user',
        username: 'user',
        email: 'user@example.com',
        password: hashedPasswords.user,
        gender: Gender.MALE,
        role: UserRoles.USER,
      },
      {
        first_name: 'user one',
        last_name: 'user one',
        username: 'userone',
        email: 'userone@example.com',
        password: hashedPasswords.user,
        gender: Gender.MALE,
        role: UserRoles.USER,
      },
    ];

    // Check and insert users if they don't exist
    for (const user of users) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: user.email }, { username: user.username }],
        },
      });

      if (!existingUser) {
        await prisma.user.create({ data: user });
        console.log(`✅ Created user: ${user.username} (${user.role})`);
      } else {
        console.log(`⚠️ User with email (${user.email}) or username (${user.username}) already exists, skipping...`);
      }
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seed();
