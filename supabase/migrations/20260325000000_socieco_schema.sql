-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    wallet_address VARCHAR(42), -- For ethers/blockchain integration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RECYCLING RECORDS
CREATE TABLE IF NOT EXISTS public.recycling_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    material_type VARCHAR(50) NOT NULL, -- e.g., 'plastic', 'glass', 'paper'
    weight_kg DECIMAL(10,2) NOT NULL,
    points_earned INTEGER NOT NULL,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TRACEABILITY / BLOCKCHAIN LOGS
CREATE TABLE IF NOT EXISTS public.traceability_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID NOT NULL REFERENCES public.recycling_records(id) ON DELETE CASCADE,
    tx_hash VARCHAR(66) NOT NULL, -- Ethereum transaction hash
    block_number BIGINT,
    contract_address VARCHAR(42),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Setup
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceability_logs ENABLE ROW LEVEL SECURITY;

-- Permissions
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view own recycling records" ON public.recycling_records FOR SELECT USING (auth.uid() = user_id);
