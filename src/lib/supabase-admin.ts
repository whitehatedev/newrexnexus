import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

let serverClient: SupabaseClient | null = null;
let serviceRoleClient: SupabaseClient | null = null;

export function normalizeSupabaseUrl(rawUrl?: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    return parsed.origin;
  } catch {
    return trimmed.replace(/\/(rest|auth|storage|functions)\/v1\/?.*$/i, '').replace(/\/+$/, '');
  }
}

function resolveServerSupabaseEnv() {
  const url = normalizeSupabaseUrl(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const anonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  return { url, anonKey, serviceRoleKey };
}

export function getSupabasePublicConfig(): { url: string; anonKey: string; configured: boolean } {
  const { url, anonKey } = resolveServerSupabaseEnv();
  return {
    url,
    anonKey,
    configured: Boolean(url && anonKey),
  };
}

export function getServerSupabaseClient(): SupabaseClient | null {
  if (serverClient) return serverClient;
  const { url, anonKey, serviceRoleKey } = resolveServerSupabaseEnv();
  const key = serviceRoleKey || anonKey;
  if (!url || !key) return null;

  serverClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return serverClient;
}

export function getServiceRoleSupabaseClient(): SupabaseClient | null {
  if (serviceRoleClient) return serviceRoleClient;
  const { url, serviceRoleKey } = resolveServerSupabaseEnv();
  if (!url || !serviceRoleKey) return null;

  serviceRoleClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return serviceRoleClient;
}

export interface VerifiedSupabaseClaims {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  emailConfirmedAt: string;
  phoneConfirmedAt: string;
}

export async function verifySupabaseAccessToken(
  token: string
): Promise<VerifiedSupabaseClaims | null> {
  const client = getServerSupabaseClient();
  if (!client || !token) return null;

  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) {
    return null;
  }

  const u = data.user;
  const meta = u.user_metadata || {};
  return {
    uid: u.id,
    email: u.email || '',
    fullName: String(meta.full_name || meta.name || '').trim(),
    phone: String(u.phone || meta.phone || '').trim(),
    emailConfirmedAt: u.email_confirmed_at ? String(u.email_confirmed_at) : '',
    phoneConfirmedAt: u.phone_confirmed_at ? String(u.phone_confirmed_at) : '',
  };
}

export async function uploadProductImageToSupabase(params: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
}): Promise<{ publicUrl: string; storagePath: string } | null> {
  const client = getServiceRoleSupabaseClient() || getServerSupabaseClient();
  if (!client) return null;

  try {
    const ext = params.originalName.includes('.')
      ? params.originalName.slice(params.originalName.lastIndexOf('.')).toLowerCase()
      : '.jpg';
    const cleanFolder = String(params.folder || 'products').replace(/[^a-zA-Z0-9_-]/g, '');
    const fileKey = `${cleanFolder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;

    const { error } = await client.storage.from('product-images').upload(fileKey, params.buffer, {
      contentType: params.mimeType || 'image/jpeg',
      upsert: false,
    });
    if (error) {
      return null;
    }

    const { data: pubData } = client.storage.from('product-images').getPublicUrl(fileKey);
    if (!pubData?.publicUrl) return null;

    return {
      publicUrl: pubData.publicUrl,
      storagePath: fileKey,
    };
  } catch {
    return null;
  }
}

export async function uploadProjectFileToSupabase(params: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
}): Promise<{ storagePath: string } | null> {
  const client = getServiceRoleSupabaseClient() || getServerSupabaseClient();
  if (!client) return null;

  try {
    const ext = params.originalName.includes('.')
      ? params.originalName.slice(params.originalName.lastIndexOf('.')).toLowerCase()
      : '';
    const cleanFolder = String(params.folder || 'registrations').replace(/[^a-zA-Z0-9_-]/g, '');
    const fileKey = `${cleanFolder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;

    const { error } = await client.storage.from('project-files').upload(fileKey, params.buffer, {
      contentType: params.mimeType || 'application/octet-stream',
      upsert: false,
    });
    if (error) {
      return null;
    }
    return { storagePath: fileKey };
  } catch {
    return null;
  }
}

export async function getSignedProjectFileUrl(storagePath: string, expiresInSeconds = 300): Promise<string | null> {
  const client = getServiceRoleSupabaseClient() || getServerSupabaseClient();
  if (!client || !storagePath) return null;
  try {
    const { data, error } = await client.storage
      .from('project-files')
      .createSignedUrl(storagePath, expiresInSeconds);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

export async function uploadCmsMediaToSupabase(params: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
}): Promise<{ publicUrl: string; storagePath: string; bucket: string } | null> {
  const serviceClient = getServiceRoleSupabaseClient();
  const client = serviceClient || getServerSupabaseClient();
  if (!client) return null;

  const isVideoOrDoc =
    (params.mimeType || '').startsWith('video/') ||
    (params.mimeType || '').includes('pdf');
  const candidateBuckets = isVideoOrDoc
    ? ['media-library', 'product-images']
    : ['media-library', 'product-images'];

  try {
    const ext = params.originalName.includes('.')
      ? params.originalName.slice(params.originalName.lastIndexOf('.')).toLowerCase()
      : '.bin';
    const cleanFolder = String(params.folder || 'cms')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/^-|-$/g, '') || 'cms';
    const fileKey = `${cleanFolder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;

    if (serviceClient) {
      try {
        await serviceClient.storage.createBucket('media-library', {
          public: true,
          fileSizeLimit: 157286400, // 150 MB
        });
      } catch {
        // Bucket likely already exists
      }
    }

    for (const bucket of candidateBuckets) {
      const { error } = await client.storage.from(bucket).upload(fileKey, params.buffer, {
        contentType: params.mimeType || 'application/octet-stream',
        upsert: false,
      });
      if (!error) {
        const { data: pubData } = client.storage.from(bucket).getPublicUrl(fileKey);
        if (pubData?.publicUrl) {
          return {
            publicUrl: pubData.publicUrl,
            storagePath: fileKey,
            bucket,
          };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteCmsMediaFromSupabase(publicUrl: string): Promise<void> {
  if (!publicUrl || !publicUrl.includes('/storage/v1/object/public/')) return;
  const client = getServiceRoleSupabaseClient() || getServerSupabaseClient();
  if (!client) return;

  try {
    const marker = '/storage/v1/object/public/';
    const idx = publicUrl.indexOf(marker);
    if (idx < 0) return;
    const remainder = decodeURIComponent(publicUrl.slice(idx + marker.length).split('?')[0]);
    const slashIdx = remainder.indexOf('/');
    if (slashIdx <= 0) return;
    const bucket = remainder.slice(0, slashIdx);
    const objectPath = remainder.slice(slashIdx + 1);
    if (!bucket || !objectPath) return;
    await client.storage.from(bucket).remove([objectPath]);
  } catch {
    // Non-blocking storage cleanup
  }
}


