CREATE TABLE IF NOT EXISTS public.shields (
    shield_id     TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    age           INTEGER,
    gender        TEXT,
    blood_group   TEXT NOT NULL,
    allergies     TEXT[] DEFAULT '{}',
    conditions    TEXT[] DEFAULT '{}',
    organ_donor   BOOLEAN DEFAULT FALSE,
    ice_contacts  JSONB DEFAULT '[]',
    package_name  TEXT,
    price         NUMERIC(10, 2),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shields ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Read Access" ON public.shields;
CREATE POLICY "Allow Public Read Access" ON public.shields
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow Public Insert Access" ON public.shields;
CREATE POLICY "Allow Public Insert Access" ON public.shields
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Public Update Access" ON public.shields;
CREATE POLICY "Allow Public Update Access" ON public.shields
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

SELECT 'Supabase setup complete. You can now register and scan Sanjeevani Shields!' as status;
