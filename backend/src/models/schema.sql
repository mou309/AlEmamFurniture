-- Furniture App Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id   SERIAL PRIMARY KEY,
  email     VARCHAR(255) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL,
  name      VARCHAR(255) NOT NULL,
  avatar    VARCHAR(500),
  role      VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url   VARCHAR(500)
);

-- Furniture items table
CREATE TABLE IF NOT EXISTS furniture_items (
  item_id     SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL,
  image_url   VARCHAR(500),
  images      TEXT[],
  category_id INTEGER REFERENCES categories(category_id),
  style       VARCHAR(100),
  material    VARCHAR(100),
  dimensions  JSONB,
  colors      TEXT[],
  in_stock    BOOLEAN DEFAULT TRUE,
  stock_qty   INTEGER DEFAULT 0,
  is_custom   BOOLEAN DEFAULT FALSE,
  model_3d_url VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  order_id     SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(user_id),
  status       VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB,
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  notes        TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id      INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
  item_id       INTEGER REFERENCES furniture_items(item_id),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_price    DECIMAL(10, 2) NOT NULL,
  custom_options JSONB
);

-- Portfolio projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  project_id  SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  images      TEXT[],
  tags        TEXT[],
  client_name VARCHAR(255),
  completed_at DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Virtual room saves
CREATE TABLE IF NOT EXISTS virtual_rooms (
  room_id    SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(user_id),
  name       VARCHAR(255) DEFAULT 'My Room',
  room_data  JSONB NOT NULL,
  share_token VARCHAR(64) UNIQUE,
  is_public  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom design requests
CREATE TABLE IF NOT EXISTS design_requests (
  request_id   SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(user_id),
  name         VARCHAR(255),
  email        VARCHAR(255) NOT NULL,
  description  TEXT NOT NULL,
  image_url    VARCHAR(500),
  status       VARCHAR(50) DEFAULT 'pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
  ('Living Room', 'living-room', 'Sofas, coffee tables, TV units and more'),
  ('Bedroom', 'bedroom', 'Beds, wardrobes, dressers and nightstands'),
  ('Dining Room', 'dining-room', 'Dining tables, chairs and sideboards'),
  ('Office', 'office', 'Desks, office chairs and storage'),
  ('Outdoor', 'outdoor', 'Garden and patio furniture')
ON CONFLICT (slug) DO NOTHING;

-- Seed furniture items
INSERT INTO furniture_items (name, description, price, image_url, category_id, style, material, dimensions, colors, in_stock, stock_qty) VALUES
  ('Oslo Sofa', 'Minimalist 3-seater sofa with solid wood legs', 1299.00, '/images/oslo-sofa.jpg', 1, 'Scandinavian', 'Fabric, Wood', '{"width": 220, "depth": 85, "height": 75}', ARRAY['Beige','Grey','Blue'], TRUE, 15),
  ('Natura Coffee Table', 'Solid oak coffee table with shelf storage', 449.00, '/images/natura-table.jpg', 1, 'Modern', 'Oak Wood', '{"width": 120, "depth": 60, "height": 45}', ARRAY['Natural','Walnut'], TRUE, 20),
  ('Haven Bed Frame', 'King size upholstered bed frame with headboard', 899.00, '/images/haven-bed.jpg', 2, 'Contemporary', 'Fabric, Wood', '{"width": 200, "depth": 210, "height": 120}', ARRAY['Beige','Charcoal'], TRUE, 8),
  ('Studio Desk', 'Spacious L-shaped home office desk', 599.00, '/images/studio-desk.jpg', 4, 'Modern', 'MDF, Steel', '{"width": 160, "depth": 80, "height": 75}', ARRAY['White','Black'], TRUE, 12),
  ('Bloom Dining Set', '6-seater dining table with chairs', 1799.00, '/images/bloom-dining.jpg', 3, 'Classic', 'Solid Wood', '{"width": 180, "depth": 90, "height": 76}', ARRAY['Natural','Dark Walnut'], TRUE, 5),
  ('Drift Armchair', 'Cozy accent armchair with wooden base', 549.00, '/images/drift-armchair.jpg', 1, 'Bohemian', 'Bouclé, Wood', '{"width": 80, "depth": 82, "height": 85}', ARRAY['Cream','Terracotta'], TRUE, 18),
  ('Peak Wardrobe', '4-door sliding wardrobe with mirror panels', 1199.00, '/images/peak-wardrobe.jpg', 2, 'Modern', 'MDF, Glass', '{"width": 240, "depth": 60, "height": 220}', ARRAY['White','Oak'], TRUE, 7),
  ('Terra Bookshelf', 'Open bookshelf with metal frame', 349.00, '/images/terra-bookshelf.jpg', 1, 'Industrial', 'Wood, Metal', '{"width": 90, "depth": 30, "height": 180}', ARRAY['Black','White'], TRUE, 25),
  ('Smart Storage Bed', 'Modern smart storage bed with a lift-up mechanism revealing storage underneath', 8500.00, '/images/smart-storage-bed.jpg', 2, 'Modern', 'Wood, Fabric', '{"width": 180, "depth": 200, "height": 110}', ARRAY['Walnut','Oak'], TRUE, 10),
  ('Modern Vanity Desk', 'Sleek modern vanity desk with an illuminated round LED mirror', 4200.00, '/images/modern-vanity.jpg', 2, 'Modern', 'MDF, Glass', '{"width": 120, "depth": 50, "height": 140}', ARRAY['White'], TRUE, 15),
  ('Luxury Beige Vanity', 'Luxury beige vanity desk with an illuminated round LED mirror and fluted details', 5500.00, '/images/beige-vanity.jpg', 2, 'Luxury', 'Wood, Glass', '{"width": 140, "depth": 55, "height": 145}', ARRAY['Beige'], TRUE, 8),
  ('Green Velvet Sectional', 'Premium green velvet L-shaped sectional sofa', 12500.00, '/images/green-velvet-sofa.jpg', 1, 'Contemporary', 'Velvet, Wood', '{"width": 280, "depth": 160, "height": 85}', ARRAY['Green'], TRUE, 5),
  ('Beige Sectional Sofa', 'Spacious contemporary beige L-shaped sectional sofa', 14000.00, '/images/beige-sectional.jpg', 1, 'Modern', 'Fabric, Wood', '{"width": 300, "depth": 180, "height": 85}', ARRAY['Beige','Grey'], TRUE, 6),
  ('Classic Wooden Bed', 'Classic warm wood bed frame with a paneled headboard and footboard', 7500.00, '/images/classic-wooden-bed.jpg', 2, 'Classic', 'Solid Wood', '{"width": 190, "depth": 210, "height": 120}', ARRAY['Walnut'], TRUE, 12),
  ('Dark Grey Sectional', 'Modern dark grey sectional sofa with a sleek design', 13500.00, '/images/dark-grey-sectional.jpg', 1, 'Modern', 'Fabric, Wood', '{"width": 290, "depth": 170, "height": 85}', ARRAY['Dark Grey'], TRUE, 4)
ON CONFLICT DO NOTHING;

-- Seed portfolio projects
INSERT INTO portfolio_projects (title, description, images, tags, client_name, completed_at) VALUES
  ('Modern Minimalist Living Room', 'Complete living room redesign with Scandinavian influences, featuring neutral tones and clean lines.', ARRAY['/images/portfolio-1.jpg'], ARRAY['Minimalist','Scandinavian','Living Room'], 'Al-Rashid Family', '2024-03-15'),
  ('Luxury Master Bedroom', 'Bespoke bedroom design with custom upholstered bed, built-in wardrobes and mood lighting.', ARRAY['/images/portfolio-2.jpg'], ARRAY['Luxury','Bedroom','Custom'], 'The Mahmoud Residence', '2024-01-20'),
  ('Contemporary Home Office', 'Functional and stylish home office setup with ergonomic furniture and ample storage.', ARRAY['/images/portfolio-3.jpg'], ARRAY['Office','Contemporary','Ergonomic'], 'Ahmed Corp', '2023-11-10'),
  ('Open Plan Dining & Kitchen', 'Seamlessly integrated dining and kitchen area with a 10-seater custom dining table.', ARRAY['/images/portfolio-4.jpg'], ARRAY['Dining','Open Plan','Custom'], 'Hassan Villa', '2023-09-05')
ON CONFLICT DO NOTHING;
