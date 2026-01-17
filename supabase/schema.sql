-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. CORE BOOKING SYSTEM
-- ==========================================

-- Customers Table
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text,
  country_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create unique index customers_email_idx on public.customers (email);

-- Bookings Table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  reference_number text unique,
  customer_id uuid references public.customers(id) not null,
  service_id text not null, 
  service_name text not null, 
  activity_date date not null,
  start_time text,
  participants integer not null default 1,
  currency text default 'EUR',
  total_price numeric(10,2) not null, 
  deposit_amount numeric(10,2) not null, 
  status text not null default 'pending_payment' check (status in ('pending_payment', 'confirmed', 'cancelled', 'completed', 'refunded', 'cancellation_requested')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'deposit_paid', 'fully_paid', 'refunded')),
  details jsonb default '{}'::jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments Table
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) not null,
  provider text not null check (provider in ('paypal', 'stripe', 'cash')),
  transaction_id text, 
  amount numeric(10,2) not null,
  currency text default 'EUR',
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  metadata jsonb default '{}'::jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 2. REVIEWS SYSTEM
-- ==========================================

create table public.reviews (
    id uuid primary key default uuid_generate_v4(),
    author_name text not null,
    rating integer check (rating >= 1 and rating <= 5),
    review_text text,
    status text default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. CALENDAR & AVAILABILITY
-- ==========================================

create table public.blocked_dates (
    id uuid primary key default uuid_generate_v4(),
    service_slug text not null,
    blocked_date date not null,
    reason text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create unique index blocked_dates_unique on public.blocked_dates (service_slug, blocked_date);

-- ==========================================
-- 4. SECURITY (RLS)
-- ==========================================

alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.blocked_dates enable row level security;

-- Policies
create policy "Enable insert for everyone" on public.customers for insert with check (true);
create policy "Enable read for everyone" on public.customers for select using (true);

create policy "Enable insert for everyone" on public.bookings for insert with check (true);
create policy "Enable read for everyone" on public.bookings for select using (true);
create policy "Enable update for everyone" on public.bookings for update using (true);

create policy "Enable insert for everyone" on public.payments for insert with check (true);
create policy "Enable read for everyone" on public.payments for select using (true);

create policy "Anyone can insert reviews" on public.reviews for insert with check (true);
create policy "Public can read approved reviews" on public.reviews for select using (status = 'approved');

create policy "Public read blocked dates" on public.blocked_dates for select using (true);
create policy "Admin insert blocked dates" on public.blocked_dates for insert with check (auth.jwt()->>'role' = 'service_role');
create policy "Admin update blocked dates" on public.blocked_dates for update using (auth.jwt()->>'role' = 'service_role');
create policy "Admin delete blocked dates" on public.blocked_dates for delete using (auth.jwt()->>'role' = 'service_role');

-- ==========================================
-- 5. PERFORMANCE INDEXES
-- ==========================================

-- Booking query optimization
create index if not exists idx_bookings_service_date on public.bookings(service_id, activity_date);
create index if not exists idx_bookings_customer on public.bookings(customer_id);
create index if not exists idx_bookings_status on public.bookings(status) where status in ('pending_payment', 'confirmed');
create index if not exists idx_bookings_reference on public.bookings(reference_number) where reference_number is not null;

-- Payment lookup optimization
create index if not exists idx_payments_booking on public.payments(booking_id);
create index if not exists idx_payments_transaction on public.payments(transaction_id) where transaction_id is not null;

-- ==========================================
-- 6. UTILITIES
-- ==========================================

create or replace function public.handle_updated_at()
returns trigger
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_customer_updated before update on public.customers for each row execute procedure public.handle_updated_at();
create trigger on_booking_updated before update on public.bookings for each row execute procedure public.handle_updated_at();
