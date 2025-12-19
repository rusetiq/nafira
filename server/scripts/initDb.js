import dotenv from 'dotenv';
import { initDatabase, userQueries, settingsQueries, badgeQueries, mealQueries } from '../config/database.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createUser = async (email, password, name, allergies, goals, onboardingCompleted) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = userQueries.create.run(
        email,
        hashedPassword,
        name,
        allergies,
        goals
    );
    const userId = result.lastInsertRowid;
    userQueries.update.run({ onboarding_completed: onboardingCompleted }, userId);
    console.log(`✅ Demo user created with ID: ${userId}`);
    return userId;
}

async function seedDatabase() {
  try {
    console.log('🌱 Initializing database...');
    initDatabase();
    
    // Create demo user
    try {
        let userId = userQueries.findByEmail.get('demo@nafira.app')?.id;
        if (userId) {
            console.log('ℹ️  Demo user already exists');
            userQueries.update.run({ onboarding_completed: true }, userId);
        } else {
            userId = await createUser(
                'demo@nafira.app',
                'demo123',
                'Aarush Diwakar',
                'Dairy',
                'Improve sleep quality',
                true
            );
        }

        // Create user settings if they don't exist
        if (!settingsQueries.findByUserId.get(userId)) {
            settingsQueries.create.run(userId, 1, 0, 1, 'auto');
            console.log('✅ User settings created');
        }

        // Create some demo badges
        const badges = [
            { type: 'streak', title: 'Streak Flux +7', description: '7 days logged with consistent macros.' },
            { type: 'omega', title: 'Omega Visionary', description: '3 meals hitting omega balance in a week.' },
            { type: 'hydration', title: 'Hydration Aura', description: 'Met daily hydration target for 5 days.' },
            { type: 'sleep', title: 'Sleep Master', description: 'Met daily sleep target for 5 days.' }
        ];

        badges.forEach(badge => {
            badgeQueries.create.run(userId, badge.type, badge.title, badge.description);
        });
        console.log('✅ Demo badges created');

    } catch (err) {
        console.error('Error during seeding:', err);
        throw err;
    }
    
    console.log('\n✨ Database setup complete!');
    console.log('\n📝 Demo credentials:');
    console.log('   Email: demo@nafira.app');
    console.log('   Password: demo123\n');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

seedDatabase();
