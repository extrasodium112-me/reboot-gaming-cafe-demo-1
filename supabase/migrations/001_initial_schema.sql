-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- 1. App Settings & Dynamic Configurations
create table public.app_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default dynamic configurations
insert into public.app_settings (key, value) values
('pricing', '{"ps4": 150, "ps5": 250, "pc": 200, "switch": 180}'::jsonb),
('business_hours', '{"open": "10:00", "close": "23:00"}'::jsonb),
('upi_config', '{"upi_id": "rebootmhow@upi", "qr_image_url": "/assets/upi-qr.png"}'::jsonb),
('cancellation_policy', '{"max_hours_before": 2, "refund_percentage": 100}'::jsonb);

-- 2. Users Table with Unique Case-Insensitive Usernames
create table public.users (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    username citext unique not null,
    phone text unique not null,
    password_hash text not null,
    role text check (role in ('customer', 'admin')) default 'customer' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Unique index for case-insensitive username enforcement
create unique index users_lower_username_idx on public.users (lower(username));

-- 3. Gaming Stations
create table public.stations (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    platform text check (platform in ('PS4', 'PS5', 'PC', 'Nintendo Switch')) not null,
    is_active boolean default true not null,
    hourly_rate decimal(10,2) not null
);

-- 4. Games Library
create table public.games (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    platform text not null,
    genre text not null,
    cover_image text not null,
    description text,
    multiplayer boolean default false,
    available boolean default true
);

-- 5. Bookings with Double-Booking Prevention (Exclusion Constraint via tsrange)
create table public.bookings (
    id uuid default uuid_generate_v4() primary key,
    booking_id text unique not null,
    user_id uuid references public.users(id) on delete cascade not null,
    station_id uuid references public.stations(id) on delete cascade not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    total_amount decimal(10,2) not null,
    status text check (status in ('confirmed', 'cancelled', 'completed')) default 'confirmed' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Prevent overlapping bookings for the same station
    constraint no_overlapping_bookings exclude using gist (
        station_id with =,
        tstzrange(start_time, end_time, '[)') with &&
    )
);

-- 6. Payments
create table public.payments (
    id uuid default uuid_generate_v4() primary key,
    booking_id uuid references public.bookings(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    amount decimal(10,2) not null,
    payment_method text check (payment_method in ('cash', 'upi')) not null,
    utr_number text,
    screenshot_url text,
    status text check (status in ('pending', 'submitted', 'verified', 'rejected')) default 'pending' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Reviews
create table public.reviews (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    rating int check (rating between 1 and 5) not null,
    comment text not null,
    status text check (status in ('pending', 'approved', 'rejected')) default 'pending' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Announcements
create table public.announcements (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    category text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can view own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users can insert own bookings" on public.bookings for insert with check (auth.uid() = user_id);
