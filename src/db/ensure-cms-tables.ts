import { createPool } from './index.ts';

let ensuredOnce = false;

export async function ensureCmsTablesExist(): Promise<void> {
  if (ensuredOnce) return;
  const pool = createPool();
  if (!pool) {
    ensuredOnce = true;
    return;
  }

  try {
    await pool.query(`
      ALTER TABLE IF EXISTS media_assets
        ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Company Branding',
        ADD COLUMN IF NOT EXISTS thumbnail_url text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS media_kind text NOT NULL DEFAULT 'image';

      CREATE TABLE IF NOT EXISTS team_members (
        id serial PRIMARY KEY,
        slug_key text NOT NULL UNIQUE,
        full_name text NOT NULL,
        designation text NOT NULL,
        department text NOT NULL DEFAULT 'Engineering & Innovation',
        professional_category text NOT NULL DEFAULT 'Engineering & Innovation',
        profile_photo_url text NOT NULL DEFAULT '',
        photo_alt text NOT NULL DEFAULT '',
        short_biography text NOT NULL DEFAULT '',
        detailed_biography text NOT NULL DEFAULT '',
        qualifications text NOT NULL DEFAULT '',
        experience text NOT NULL DEFAULT '',
        responsibilities text NOT NULL DEFAULT '',
        skills jsonb NOT NULL DEFAULT '[]'::jsonb,
        linkedin_url text NOT NULL DEFAULT '',
        display_order integer NOT NULL DEFAULT 1,
        status text NOT NULL DEFAULT 'published',
        is_featured boolean NOT NULL DEFAULT false,
        is_active boolean NOT NULL DEFAULT true,
        updated_by text NOT NULL DEFAULT '',
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS website_banners (
        id serial PRIMARY KEY,
        banner_key text NOT NULL UNIQUE,
        title text NOT NULL,
        subtitle text NOT NULL DEFAULT '',
        placement text NOT NULL DEFAULT 'homepage_promo',
        image_url text NOT NULL DEFAULT '',
        video_url text NOT NULL DEFAULT '',
        cta_label text NOT NULL DEFAULT 'Explore',
        cta_link text NOT NULL DEFAULT '/krashivantri',
        sort_order integer NOT NULL DEFAULT 1,
        is_active boolean NOT NULL DEFAULT true,
        status text NOT NULL DEFAULT 'published',
        updated_by text NOT NULL DEFAULT '',
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      );
    `);
    ensuredOnce = true;
  } catch (err) {
    console.warn('CMS DDL bootstrap check warning:', (err as Error).message);
  }
}
