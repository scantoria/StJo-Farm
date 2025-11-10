// Script to seed Animal of the Month data
// Run with: node scripts/seed-animal-of-month.js

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedAnimalOfMonth() {
  try {
    const millie = {
      name: 'Millie',
      imageUrl: 'assets/dairy-cow-millie-2.jpg',
      description: 'Meet Millie, our beloved Jersey dairy cow! Millie is a show-quality dairy cow who has been with us for several years. She\'s known for her gentle temperament and excellent milk production. Millie loves attention and is always happy to greet visitors at the fence. Her rich, creamy milk is a staple for our family and helps nourish our young animals.',
      month: 'November',
      year: 2025,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('animalsOfMonth').add(millie);
    console.log('✅ Successfully added Millie with ID:', docRef.id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedAnimalOfMonth();
