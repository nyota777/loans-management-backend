-- =============================================================================
-- Loan Tracking Management System - Complete PostgreSQL Schema
-- Admin-Only Chama/Sacco system for ~50 members
-- Run in pgAdmin: connect to 'postgres', execute Step 1; then connect to
-- 'loan_tracking_management_system' and execute Steps 2–5.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Create database (run while connected to 'postgres')
-- -----------------------------------------------------------------------------
-- In pgAdmin: connect to default 'postgres' database, then run ONLY this:

/*
CREATE DATABASE loan_tracking_management_system;
*/

-- Then in pgAdmin: disconnect, connect to database 'loan_tracking_management_system',
-- and run everything below (from STEP 2 onward).


-- =============================================================================
-- STEP 2: Extensions
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =============================================================================
-- STEP 3: Drop existing objects (idempotent re-run)
-- Order: child tables first due to FKs
-- =============================================================================
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.loans CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;


-- =============================================================================
-- STEP 4: Table definitions
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: admins
-- Admin-only access. No member login. Store hashed passwords (e.g. bcrypt).
-- -----------------------------------------------------------------------------
CREATE TABLE public.admins (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE public.admins IS 'Admin users; credentials set separately by you.';


-- -----------------------------------------------------------------------------
-- Table: members
-- Chama/Sacco members. total_contributions tracks non-loan contributions.
-- -----------------------------------------------------------------------------
CREATE TABLE public.members (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name             VARCHAR(150) NOT NULL,
    phone_number         VARCHAR(20) UNIQUE NOT NULL,
    id_number            VARCHAR(50),
    total_contributions   NUMERIC(12,2) DEFAULT 0 CHECK (total_contributions >= 0),
    is_active            BOOLEAN DEFAULT TRUE,
    created_at            TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE public.members IS 'Chama/Sacco members (~50).';


-- -----------------------------------------------------------------------------
-- Table: loans
-- One loan per row. interest_rate fixed at 12.5%; max duration 48 months.
-- Backend computes interest_amount, total_payable, monthly_installment.
-- -----------------------------------------------------------------------------
CREATE TABLE public.loans (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id              UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    principal_amount      NUMERIC(12,2) NOT NULL CHECK (principal_amount > 0),
    interest_rate         NUMERIC(5,2) DEFAULT 12.50 CHECK (interest_rate >= 0),
    loan_duration_months   INTEGER NOT NULL CHECK (loan_duration_months >= 1 AND loan_duration_months <= 48),
    interest_amount       NUMERIC(12,2) CHECK (interest_amount >= 0),
    total_payable         NUMERIC(12,2) CHECK (total_payable >= 0),
    monthly_installment   NUMERIC(12,2) CHECK (monthly_installment >= 0),
    remaining_balance     NUMERIC(12,2) CHECK (remaining_balance >= 0),
    start_date            DATE,
    expected_end_date     DATE,
    status                VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'CLEARED', 'DEFAULTED')),
    created_at            TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE public.loans IS 'Member loans; 12.5% p.a., max 48 months.';


-- -----------------------------------------------------------------------------
-- Table: payments
-- Payments against a loan. remaining_balance = balance after this payment.
-- -----------------------------------------------------------------------------
CREATE TABLE public.payments (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id            UUID NOT NULL REFERENCES public.loans(id) ON DELETE CASCADE,
    amount_paid        NUMERIC(12,2) NOT NULL CHECK (amount_paid > 0),
    payment_date       DATE DEFAULT CURRENT_DATE,
    remaining_balance  NUMERIC(12,2) CHECK (remaining_balance >= 0),
    payment_number     INTEGER CHECK (payment_number >= 1),
    is_late            BOOLEAN DEFAULT FALSE,
    penalty_amount     NUMERIC(12,2) DEFAULT 0 CHECK (penalty_amount >= 0),
    created_at         TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS 'Loan payments; late penalties stored in penalty_amount.';


-- -----------------------------------------------------------------------------
-- Table: system_settings
-- Single-row config (e.g. penalty rate %). Backend reads from here.
-- -----------------------------------------------------------------------------
CREATE TABLE public.system_settings (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    penalty_rate NUMERIC(5,2) DEFAULT 2.00 CHECK (penalty_rate >= 0),
    created_at   TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE public.system_settings IS 'Global settings; one row, default penalty rate.';


-- =============================================================================
-- STEP 5: Indexes
-- =============================================================================
CREATE UNIQUE INDEX idx_members_phone_number ON public.members(phone_number);
CREATE INDEX idx_loans_member_id ON public.loans(member_id);
CREATE INDEX idx_loans_status ON public.loans(status);
CREATE INDEX idx_payments_loan_id ON public.payments(loan_id);
CREATE INDEX idx_payments_payment_date ON public.payments(payment_date);


-- =============================================================================
-- STEP 6: Seed data
-- =============================================================================

-- Admin: no seed row (you will set credentials later).
-- To add an admin after hashing password with bcrypt, run for example:
-- INSERT INTO public.admins (id, full_name, email, password_hash, is_active)
-- VALUES (uuid_generate_v4(), 'Your Name', 'your@email.com', '<bcrypt_hash>', true);

-- -----------------------------------------------------------------------------
-- Members: 50 members (Member 1 … Member 50), realistic East African-style phones
-- -----------------------------------------------------------------------------
INSERT INTO public.members (id, full_name, phone_number, id_number, total_contributions, is_active)
VALUES
    (uuid_generate_v4(), 'Member 1',  '+254700000001', 'ID00001', 2500.00, true),
    (uuid_generate_v4(), 'Member 2',  '+254700000002', 'ID00002', 3100.50, true),
    (uuid_generate_v4(), 'Member 3',  '+254700000003', 'ID00003', 1800.00, true),
    (uuid_generate_v4(), 'Member 4',  '+254700000004', 'ID00004', 4200.75, true),
    (uuid_generate_v4(), 'Member 5',  '+254700000005', 'ID00005', 2900.00, true),
    (uuid_generate_v4(), 'Member 6',  '+254700000006', 'ID00006', 3500.00, true),
    (uuid_generate_v4(), 'Member 7',  '+254700000007', 'ID00007', 2100.25, true),
    (uuid_generate_v4(), 'Member 8',  '+254700000008', 'ID00008', 4800.00, true),
    (uuid_generate_v4(), 'Member 9',  '+254700000009', 'ID00009', 2700.50, true),
    (uuid_generate_v4(), 'Member 10', '+254700000010', 'ID00010', 3900.00, true),
    (uuid_generate_v4(), 'Member 11', '+254700000011', 'ID00011', 3300.00, true),
    (uuid_generate_v4(), 'Member 12', '+254700000012', 'ID00012', 2200.75, true),
    (uuid_generate_v4(), 'Member 13', '+254700000013', 'ID00013', 4100.00, true),
    (uuid_generate_v4(), 'Member 14', '+254700000014', 'ID00014', 2600.50, true),
    (uuid_generate_v4(), 'Member 15', '+254700000015', 'ID00015', 3700.00, true),
    (uuid_generate_v4(), 'Member 16', '+254700000016', 'ID00016', 1900.00, true),
    (uuid_generate_v4(), 'Member 17', '+254700000017', 'ID00017', 4400.25, true),
    (uuid_generate_v4(), 'Member 18', '+254700000018', 'ID00018', 2800.00, true),
    (uuid_generate_v4(), 'Member 19', '+254700000019', 'ID00019', 3200.50, true),
    (uuid_generate_v4(), 'Member 20', '+254700000020', 'ID00020', 4600.00, true),
    (uuid_generate_v4(), 'Member 21', '+254700000021', 'ID00021', 2400.75, true),
    (uuid_generate_v4(), 'Member 22', '+254700000022', 'ID00022', 3800.00, true),
    (uuid_generate_v4(), 'Member 23', '+254700000023', 'ID00023', 3000.00, true),
    (uuid_generate_v4(), 'Member 24', '+254700000024', 'ID00024', 2300.25, true),
    (uuid_generate_v4(), 'Member 25', '+254700000025', 'ID00025', 4500.50, true),
    (uuid_generate_v4(), 'Member 26', '+254700000026', 'ID00026', 3400.00, true),
    (uuid_generate_v4(), 'Member 27', '+254700000027', 'ID00027', 2000.00, true),
    (uuid_generate_v4(), 'Member 28', '+254700000028', 'ID00028', 4300.75, true),
    (uuid_generate_v4(), 'Member 29', '+254700000029', 'ID00029', 2700.00, true),
    (uuid_generate_v4(), 'Member 30', '+254700000030', 'ID00030', 4000.00, true),
    (uuid_generate_v4(), 'Member 31', '+254700000031', 'ID00031', 3100.50, true),
    (uuid_generate_v4(), 'Member 32', '+254700000032', 'ID00032', 3600.00, true),
    (uuid_generate_v4(), 'Member 33', '+254700000033', 'ID00033', 2100.25, true),
    (uuid_generate_v4(), 'Member 34', '+254700000034', 'ID00034', 4900.00, true),
    (uuid_generate_v4(), 'Member 35', '+254700000035', 'ID00035', 2500.00, true),
    (uuid_generate_v4(), 'Member 36', '+254700000036', 'ID00036', 3900.50, true),
    (uuid_generate_v4(), 'Member 37', '+254700000037', 'ID00037', 2200.00, true),
    (uuid_generate_v4(), 'Member 38', '+254700000038', 'ID00038', 4700.75, true),
    (uuid_generate_v4(), 'Member 39', '+254700000039', 'ID00039', 2900.00, true),
    (uuid_generate_v4(), 'Member 40', '+254700000040', 'ID00040', 3500.00, true),
    (uuid_generate_v4(), 'Member 41', '+254700000041', 'ID00041', 2600.50, true),
    (uuid_generate_v4(), 'Member 42', '+254700000042', 'ID00042', 4200.00, true),
    (uuid_generate_v4(), 'Member 43', '+254700000043', 'ID00043', 3300.25, true),
    (uuid_generate_v4(), 'Member 44', '+254700000044', 'ID00044', 3800.00, true),
    (uuid_generate_v4(), 'Member 45', '+254700000045', 'ID00045', 2400.00, true),
    (uuid_generate_v4(), 'Member 46', '+254700000046', 'ID00046', 4400.50, true),
    (uuid_generate_v4(), 'Member 47', '+254700000047', 'ID00047', 3000.75, true),
    (uuid_generate_v4(), 'Member 48', '+254700000048', 'ID00048', 4100.00, true),
    (uuid_generate_v4(), 'Member 49', '+254700000049', 'ID00049', 2700.00, true),
    (uuid_generate_v4(), 'Member 50', '+254700000050', 'ID00050', 4600.00, true)
ON CONFLICT (phone_number) DO NOTHING;


-- -----------------------------------------------------------------------------
-- System settings: default penalty rate (one row, idempotent)
-- -----------------------------------------------------------------------------
INSERT INTO public.system_settings (id, penalty_rate)
SELECT uuid_generate_v4(), 2.00
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings LIMIT 1);


-- =============================================================================
-- Verification (run after script to confirm; optional)
-- =============================================================================
-- SELECT 'admins' AS tbl, count(*) FROM public.admins
-- UNION ALL SELECT 'members', count(*) FROM public.members
-- UNION ALL SELECT 'system_settings', count(*) FROM public.system_settings;
