
-- Drop tables if they exist (for clean start during dev, be careful in prod)
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS services;

-- 1. Services Table (The "Moneymakers")
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    long_description TEXT, -- For the detailed landing page
    features TEXT[], -- Array of strings
    price_amount NUMERIC,
    price_unit TEXT,
    image_hero TEXT,
    image_card TEXT,
    gallery TEXT[],
    whatsapp_number TEXT DEFAULT '212690606068',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Articles Table (The "Traffic Magnets")
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT, -- Markdown format
    cover_image TEXT,
    category TEXT DEFAULT 'Guide',
    is_published BOOLEAN DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Leads Table (The "Conversions")
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id),
    service_name TEXT, -- Fallback if relation is deleted
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    travel_date DATE,
    details JSONB, -- Store all extra form fields here
    status TEXT DEFAULT 'new', -- new, contacted, booked, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Private Write is the default safe bet)
-- Everyone can read published services and articles
CREATE POLICY "Public services are viewable by everyone" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public articles are viewable by everyone" ON articles FOR SELECT USING (is_published = true);

-- Leads can be inserted by anyone (public booking form)
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins/n8n service role) can do everything else
-- Note: You will use the SERVICE_ROLE_KEY in n8n to bypass RLS, so specific policies for n8n aren't strictly needed if using that key.
-- But for dashboard usage:
-- 4. Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    author_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can insert reviews (public form)
CREATE POLICY "Anyone can insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Policy: Everyone can read approved reviews
CREATE POLICY "Public can read approved reviews" ON reviews FOR SELECT USING (status = 'approved');
