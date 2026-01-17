-- ==========================================
-- CALENDAR TESTING SEED DATA
-- ==========================================

-- 1. Create 5 Mock Customers
INSERT INTO public.customers (id, full_name, email, phone, country_code)
VALUES 
  (uuid_generate_v4(), 'Alice Voyager', 'alice@example.com', '123456789', '+1__US'),
  (uuid_generate_v4(), 'Bob Explorer', 'bob@example.com', '987654321', '+44__UK'),
  (uuid_generate_v4(), 'Charlie Foodie', 'charlie@example.com', '456123789', '+33__FR'),
  (uuid_generate_v4(), 'Diana Hiker', 'diana@example.com', '321654987', '+49__DE'),
  (uuid_generate_v4(), 'Eve Photographer', 'eve@example.com', '159753468', '+34__ES');

-- 2. Create Bookings (Simulate Capacity)
-- Need to fetch IDs dynamically or use the ones we just created? 
-- In pure SQL script without variables, we can use subqueries or hardcode UUIDs if we generated them nicely.
-- Let's use subqueries to pick customers.

-- SCENARIO 1: FULLY BOOKED DAY (Cooking Class)
-- Date: Tomorrow (CURRENT_DATE + 1)
-- Total 4 Participants (2 bookings of 2 people)
INSERT INTO public.bookings (customer_id, service_id, service_name, activity_date, participants, total_price, deposit_amount, status, payment_status)
VALUES 
  (
    (SELECT id FROM public.customers WHERE email = 'alice@example.com'), 
    'outdoor-cooking-adventure', 
    'Moroccan Cooking Class', 
    CURRENT_DATE + 1, 
    2, 
    90.00, 
    20.00, 
    'confirmed', 
    'deposit_paid'
  ),
  (
    (SELECT id FROM public.customers WHERE email = 'bob@example.com'), 
    'outdoor-cooking-adventure', 
    'Moroccan Cooking Class', 
    CURRENT_DATE + 1, 
    2, 
    90.00, 
    20.00, 
    'confirmed', 
    'deposit_paid'
  );

-- SCENARIO 2: PARTIALLY BOOKED DAY (Cooking Class)
-- Date: 3 Days from now
-- Total 2 Participants (1 booking of 2 people) -> Should show as Available (because 2 < 4)
INSERT INTO public.bookings (customer_id, service_id, service_name, activity_date, participants, total_price, deposit_amount, status, payment_status)
VALUES 
  (
    (SELECT id FROM public.customers WHERE email = 'charlie@example.com'), 
    'outdoor-cooking-adventure', 
    'Moroccan Cooking Class', 
    CURRENT_DATE + 3, 
    2, 
    90.00, 
    20.00, 
    'confirmed', 
    'deposit_paid'
  );

-- SCENARIO 3: FULLY BOOKED DAY (Pastry Class)
-- Date: 7 Days from now
-- Total 4 Participants (1 big family booking)
INSERT INTO public.bookings (customer_id, service_id, service_name, activity_date, participants, total_price, deposit_amount, status, payment_status)
VALUES 
  (
    (SELECT id FROM public.customers WHERE email = 'diana@example.com'), 
    'moroccan-petit-four-class', 
    'Moroccan Petit Four Class', 
    CURRENT_DATE + 7, 
    4, 
    216.00, 
    40.00, 
    'confirmed', 
    'deposit_paid'
  );

-- 3. Block Dates (Manual Closure)
-- SCENARIO 4: BLOCKED DAY (Holiday/Closed)
-- Date: 5 Days from now
INSERT INTO public.blocked_dates (service_slug, blocked_date, reason)
VALUES 
  ('outdoor-cooking-adventure', CURRENT_DATE + 5, 'Chef Vacation'),
  ('moroccan-petit-four-class', CURRENT_DATE + 5, 'Shop Renovation');

-- Summary for User:
-- Tomorrow: Cooking Class -> FULL (4/4)
-- T+3 days: Cooking Class -> AVAILABLE (2/4)
-- T+5 days: BOTH Classes -> BLOCKED (Manual)
-- T+7 days: Pastry Class -> FULL (4/4)

