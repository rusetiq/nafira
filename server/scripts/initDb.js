import dotenv from 'dotenv';
import { initDatabase, userQueries, settingsQueries, badgeQueries } from '../config/database.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seedDatabase() {
  try {
    console.log('🌱 Initializing database...');
    initDatabase();
    
    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    try {
      const result = userQueries.create.run(
        'demo@nafira.app',
        hashedPassword,
        'Aarush Diwakar',
        'Dairy',
        'Improve sleep quality'
      );
      
      const userId = result.lastInsertRowid;
      console.log(`✅ Demo user created with ID: ${userId}`);
      
      // Create user settings
      settingsQueries.create.run(userId, 1, 0, 1, 'auto');
      console.log('✅ User settings created');
      
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
      if (err.message.includes('UNIQUE constraint failed')) {
        console.log('ℹ️  Demo user already exists');
      } else {
        throw err;
      }
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
