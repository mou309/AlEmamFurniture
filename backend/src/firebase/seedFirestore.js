/**
 * seedFirestore.js
 * Run: node src/firebase/seedFirestore.js
 * Uploads all categories + furniture items + portfolio projects to Firestore
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { initFirebase } = require('./admin');

const categories = [
  { category_id: 1, name: 'Living Room', slug: 'living-room', description: 'Sofas, coffee tables, TV units and more' },
  { category_id: 2, name: 'Bedroom', slug: 'bedroom', description: 'Beds, wardrobes, dressers and nightstands' },
  { category_id: 3, name: 'Dining Room', slug: 'dining-room', description: 'Dining tables, chairs and sideboards' },
  { category_id: 4, name: 'Office', slug: 'office', description: 'Desks, office chairs and storage' },
  { category_id: 5, name: 'Outdoor', slug: 'outdoor', description: 'Garden and patio furniture' },
];

const furnitureItems = [
  {
    item_id: 1, name: 'Oslo Sofa', description: 'Minimalist 3-seater sofa with solid wood legs',
    price: 1299, image_url: '/images/Living Room1.jpg', category_id: 1,
    category_name: 'Living Room', category_slug: 'living-room',
    style: 'Scandinavian', material: 'Fabric, Wood',
    dimensions: { width: 220, depth: 85, height: 75 },
    colors: ['Beige', 'Grey', 'Blue'], in_stock: true, stock_qty: 15,
  },
  {
    item_id: 2, name: 'Natura Coffee Table', description: 'Solid oak coffee table with shelf storage',
    price: 449, image_url: '/images/Living Room2.jpg', category_id: 1,
    category_name: 'Living Room', category_slug: 'living-room',
    style: 'Modern', material: 'Oak Wood',
    dimensions: { width: 120, depth: 60, height: 45 },
    colors: ['Natural', 'Walnut'], in_stock: true, stock_qty: 20,
  },
  {
    item_id: 3, name: 'Haven Bed Frame', description: 'King size upholstered bed frame with headboard',
    price: 899, image_url: '/images/br.jpg', category_id: 2,
    category_name: 'Bedroom', category_slug: 'bedroom',
    style: 'Contemporary', material: 'Fabric, Wood',
    dimensions: { width: 200, depth: 210, height: 120 },
    colors: ['Beige', 'Charcoal'], in_stock: true, stock_qty: 8,
  },
  {
    item_id: 4, name: 'Studio Desk', description: 'Spacious L-shaped home office desk',
    price: 599, image_url: '/images/oslo-sofa.jpg', category_id: 4,
    category_name: 'Office', category_slug: 'office',
    style: 'Modern', material: 'MDF, Steel',
    dimensions: { width: 160, depth: 80, height: 75 },
    colors: ['White', 'Black'], in_stock: true, stock_qty: 12,
  },
  {
    item_id: 5, name: 'Bloom Dining Set', description: '6-seater dining table with chairs',
    price: 1799, image_url: '/images/natura-table.jpg', category_id: 3,
    category_name: 'Dining Room', category_slug: 'dining-room',
    style: 'Classic', material: 'Solid Wood',
    dimensions: { width: 180, depth: 90, height: 76 },
    colors: ['Natural', 'Dark Walnut'], in_stock: true, stock_qty: 5,
  },
  {
    item_id: 6, name: 'Drift Armchair', description: 'Cozy accent armchair with wooden base',
    price: 549, image_url: '/images/Living Room1.jpg', category_id: 1,
    category_name: 'Living Room', category_slug: 'living-room',
    style: 'Bohemian', material: 'Bouclé, Wood',
    dimensions: { width: 80, depth: 82, height: 85 },
    colors: ['Cream', 'Terracotta'], in_stock: true, stock_qty: 18,
  },
  {
    item_id: 7, name: 'Peak Wardrobe', description: '4-door sliding wardrobe with mirror panels',
    price: 1199, image_url: '/images/br2.jpg', category_id: 2,
    category_name: 'Bedroom', category_slug: 'bedroom',
    style: 'Modern', material: 'MDF, Glass',
    dimensions: { width: 240, depth: 60, height: 220 },
    colors: ['White', 'Oak'], in_stock: true, stock_qty: 7,
  },
  {
    item_id: 8, name: 'Terra Bookshelf', description: 'Open bookshelf with metal frame',
    price: 349, image_url: '/images/Living Room2.jpg', category_id: 1,
    category_name: 'Living Room', category_slug: 'living-room',
    style: 'Industrial', material: 'Wood, Metal',
    dimensions: { width: 90, depth: 30, height: 180 },
    colors: ['Black', 'White'], in_stock: true, stock_qty: 25,
  },
  {
    item_id: 9, name: 'Smart Storage Bed', description: 'Modern smart storage bed with a lift-up mechanism revealing storage underneath',
    price: 8500, image_url: '/images/br1.jpg', category_id: 2,
    category_name: 'Bedroom', category_slug: 'bedroom',
    style: 'Modern', material: 'Wood, Fabric',
    dimensions: { width: 180, depth: 200, height: 110 },
    colors: ['Walnut', 'Oak'], in_stock: true, stock_qty: 10,
  },
  {
    item_id: 10, name: 'Modern Vanity Desk', description: 'Sleek modern vanity desk with an illuminated round LED mirror',
    price: 4200, image_url: '/images/br2.jpg', category_id: 2,
    category_name: 'Bedroom', category_slug: 'bedroom',
    style: 'Modern', material: 'MDF, Glass',
    dimensions: { width: 120, depth: 50, height: 140 },
    colors: ['White'], in_stock: true, stock_qty: 15,
  },
  {
    item_id: 11, name: 'Luxury Beige Vanity', description: 'Luxury beige vanity desk with an illuminated round LED mirror and fluted details',
    price: 5500, image_url: '/images/br3.jpg', category_id: 2,
    category_name: 'Bedroom', category_slug: 'bedroom',
    style: 'Luxury', material: 'Wood, Glass',
    dimensions: { width: 140, depth: 55, height: 145 },
    colors: ['Beige'], in_stock: true, stock_qty: 8,
  },
  {
    item_id: 12, name: 'Green Velvet Sectional', description: 'Premium green velvet L-shaped sectional sofa',
    price: 12500, image_url: '/images/Living Room3.jpg', category_id: 1,
    category_name: 'Living Room', category_slug: 'living-room',
    style: 'Contemporary', material: 'Velvet, Wood',
    dimensions: { width: 280, depth: 160, height: 85 },
    colors: ['Green'], in_stock: true, stock_qty: 5,
  },
  {
    item_id: 13, name: 'Beige Sectional Sofa', description: 'Spacious contemporary beige L-shaped sectional sofa',
    price: 14000, image_url: '/images/Living Room4.jpg', category_id: 1,
    category_name: 'Living Room', category_slug: 'living-room',
    style: 'Modern', material: 'Fabric, Wood',
    dimensions: { width: 300, depth: 180, height: 85 },
    colors: ['Beige', 'Grey'], in_stock: true, stock_qty: 6,
  },
  {
    item_id: 14, name: 'Classic Wooden Bed', description: 'Classic warm wood bed frame with a paneled headboard and footboard',
    price: 7500, image_url: '/images/br4.jpg', category_id: 2,
    category_name: 'Bedroom', category_slug: 'bedroom',
    style: 'Classic', material: 'Solid Wood',
    dimensions: { width: 190, depth: 210, height: 120 },
    colors: ['Walnut'], in_stock: true, stock_qty: 12,
  },
  {
    item_id: 15, name: 'Dark Grey Sectional', description: 'Modern dark grey sectional sofa with a sleek design',
    price: 13500, image_url: '/images/Living Room1.jpg', category_id: 1,
    category_name: 'Living Room', category_slug: 'living-room',
    style: 'Modern', material: 'Fabric, Wood',
    dimensions: { width: 290, depth: 170, height: 85 },
    colors: ['Dark Grey'], in_stock: true, stock_qty: 4,
  },
];

const portfolioProjects = [
  {
    title: 'Modern Minimalist Living Room',
    description: 'Complete living room redesign with Scandinavian influences.',
    images: ['/images/Living Room1.jpg'],
    tags: ['Minimalist', 'Scandinavian', 'Living Room'],
    client_name: 'Al-Rashid Family',
    completed_at: '2024-03-15',
  },
  {
    title: 'Luxury Master Bedroom',
    description: 'Bespoke bedroom design with custom upholstered bed.',
    images: ['/images/br.jpg'],
    tags: ['Luxury', 'Bedroom', 'Custom'],
    client_name: 'The Mahmoud Residence',
    completed_at: '2024-01-20',
  },
  {
    title: 'Contemporary Home Office',
    description: 'Functional and stylish home office setup.',
    images: ['/images/br2.jpg'],
    tags: ['Office', 'Contemporary', 'Ergonomic'],
    client_name: 'Ahmed Corp',
    completed_at: '2023-11-10',
  },
  {
    title: 'Open Plan Dining & Kitchen',
    description: 'Seamlessly integrated dining and kitchen area.',
    images: ['/images/Living Room2.jpg'],
    tags: ['Dining', 'Open Plan', 'Custom'],
    client_name: 'Hassan Villa',
    completed_at: '2023-09-05',
  },
];

async function seed() {
  const db = initFirebase();
  if (!db) {
    console.error('❌ Firebase not initialized. Check your .env FIREBASE_SERVICE_ACCOUNT_PATH');
    process.exit(1);
  }

  console.log('🔥 Seeding Firestore...\n');

  // Seed categories
  console.log('📂 Seeding categories...');
  for (const cat of categories) {
    await db.collection('categories').doc(String(cat.category_id)).set(cat);
    console.log(`  ✅ ${cat.name}`);
  }

  // Seed furniture items
  console.log('\n🛋️  Seeding furniture items...');
  for (const item of furnitureItems) {
    await db.collection('furniture_items').doc(String(item.item_id)).set({
      ...item,
      created_at: new Date().toISOString(),
    });
    console.log(`  ✅ ${item.name} — EGP ${item.price.toLocaleString()}`);
  }

  // Seed portfolio
  console.log('\n🖼️  Seeding portfolio projects...');
  for (const proj of portfolioProjects) {
    await db.collection('portfolio_projects').add(proj);
    console.log(`  ✅ ${proj.title}`);
  }

  console.log('\n🎉 Firestore seeded successfully!');
  console.log(`   📦 ${categories.length} categories`);
  console.log(`   🛋️  ${furnitureItems.length} furniture items`);
  console.log(`   🖼️  ${portfolioProjects.length} portfolio projects`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
