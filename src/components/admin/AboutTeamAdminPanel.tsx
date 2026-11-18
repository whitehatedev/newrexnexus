import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  Users,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { TeamMemberProfile } from '../../types/platform';

const DEFAULT_TEAM_SEED: TeamMemberProfile[] = [
  {
    id: 'sahil-prakash-bhagat',
    name: 'Sahil Prakash Bhagat',
    designation: 'Founder & Chief Executive Officer',
    qualifications:
      'Bachelor of Engineering – YCCE, Nagpur · MBA – JD College of Engineering & Management',
    biography:
      'Sahil Prakash Bhagat is the Founder and CEO of NexusTekFusion Private Limited. He leads the company’s strategic vision, engineering innovation, product development, and business growth. His focus areas include indigenous agricultural drone manufacturing, nationwide Drone-as-a-Service expansion, AI-powered agriculture, robotics, embedded systems, and advanced engineering solutions.',
    responsibilities:
      'Corporate strategy and business development · Agricultural drone manufacturing · KRASHIVANTRI product development · Nationwide DaaS expansion · Technology commercialization · Strategic partnerships and investor relations · Research and innovation',
    photoUrl: '',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'anchal-joshi',
    name: 'Anchal Joshi',
    designation: 'Engineering & Innovation Team',
    qualifications: '',
    biography: '',
    responsibilities: '',
    photoUrl: '',
    displayOrder: 2,
    isActive: true,
  },
];

function getInitials(name: string): string {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'NT';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const AboutTeamAdminPanel: React.FC = () => {
  const { settings, apiFetch, refreshBootstrap, notify, navigate } = usePlatform();
  const [members, setMembers] = useState<TeamMemberProfile[]>(() =>
    settings.aboutTeam && settings.aboutTeam.length > 0
      ? [...settings.aboutTeam].sort((a, b) => a.displayOrder - b.displayOrder)
      : DEFAULT_TEAM_SEED
  );
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (settings.aboutTeam && settings.aboutTeam.length > 0) {
      setMembers([...settings.aboutTeam].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [settings.aboutTeam]);

  const updateMember = (id: string, patch: Partial<TeamMemberProfile>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const addMember = () => {
    const nextOrder = members.length > 0 ? Math.max(...members.map((m) => Number(m.displayOrder) || 0)) + 1 : 1;
    setMembers((prev) => [
      ...prev,
      {
        id: `team_${Date.now()}`,
        name: '',
        designation: '',
        qualifications: '',
        biography: '',
        responsibilities: '',
        photoUrl: '',
        displayOrder: nextOrder,
        isActive: true,
      },
    ]);
  };

  const moveMember = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= members.length) return;
    const copy = [...members];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setMembers(copy.map((m, idx) => ({ ...m, displayOrder: idx + 1 })));
  };

  const removeMember = (id: string) => {
    setMembers((prev) =>
      prev
        .filter((m) => m.id !== id)
        .map((m, idx) => ({ ...m, displayOrder: idx + 1 }))
    );
  };

  const handlePhotoUpload = async (memberId: string, file: File) => {
    setUploadingId(memberId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'team');
      fd.append('altText', `NexusTekFusion team member photograph`);
      const res = await apiFetch<{ asset: { url?: string; fileUrl?: string } }>('/api/admin/media/upload', {
        method: 'POST',
        body: fd,
      });
      const uploadedUrl = res.asset?.url || res.asset?.fileUrl || '';
      if (!uploadedUrl) {
        throw new Error('Upload succeeded without a public URL.');
      }
      updateMember(memberId, { photoUrl: uploadedUrl });
      notify('Photograph uploaded. Click "Save Team Profiles" to publish.', 'success');
    } catch (err: any) {
      notify(err?.message || 'Photograph upload failed.', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = members
      .map((m, idx) => ({
        ...m,
        id: m.id || `team_${idx + 1}`,
        name: m.name.trim(),
        designation: m.designation.trim(),
        qualifications: m.qualifications.trim(),
        biography: m.biography.trim(),
        responsibilities: m.responsibilities.trim(),
        photoUrl: m.photoUrl.trim(),
        displayOrder: Number(m.displayOrder) > 0 ? Number(m.displayOrder) : idx + 1,
        isActive: Boolean(m.isActive),
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);

    if (cleaned.some((m) => !m.name || !m.designation)) {
      notify('Every team profile requires a Name and Designation.', 'error');
      return;
    }

    setSaving(true);
    try {
      await apiFetch('/api/admin/settings/aboutTeam', {
        method: 'PUT',
        body: JSON.stringify({ value: cleaned }),
      });
      await refreshBootstrap();
      notify('About Us team profiles saved and published.', 'success');
    } catch (err: any) {
      notify(err?.message || 'Failed to save team profiles.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs">
      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-[#111417]">
            <Users className="w-5 h-5 text-[#15803D]" /> About Us — Founder &amp; Team Profiles
          </div>
          <p className="text-xs text-slate-600">
            Manage team portraits, names, designations, qualifications, biographies, responsibilities, display order, and active visibility shown on the About Us page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/about')}
            className="px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-lg font-semibold inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View About Us Page
          </button>
          <button
            type="button"
            onClick={addMember}
            className="px-3.5 py-2 border border-[#15803D] text-[#15803D] hover:bg-emerald-50 rounded-lg font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Team Profile
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-lg font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Team Profiles'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => (
          <div
            key={member.id}
            className={`rounded-xl border bg-white p-6 space-y-5 ${
              member.isActive ? 'border-slate-200' : 'border-slate-200 opacity-75 bg-slate-50/70'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#15803D] tabular-nums">
                  #{member.displayOrder}
                </span>
                <div className="font-display font-bold text-sm text-slate-950">
                  {member.name || 'New Team Member'}
                </div>
                <span className="text-xs text-slate-500">
                  {member.isActive ? 'Active on Website' : 'Hidden (Inactive)'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveMember(index, -1)}
                  title="Move up"
                  className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === members.length - 1}
                  onClick={() => moveMember(index, 1)}
                  title="Move down"
                  className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={member.isActive}
                    onChange={(e) => updateMember(member.id, { isActive: e.target.checked })}
                  />
                  Active Profile
                </label>
                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 font-semibold inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Photograph Upload / Placeholder */}
              <div className="lg:col-span-3 space-y-3">
                <div className="aspect-square max-w-[180px] rounded-xl border border-slate-200 bg-[#111417] text-white overflow-hidden flex items-center justify-center">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name || 'Team member'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-1.5 p-4">
                      <div className="w-12 h-12 mx-auto rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-display font-bold text-base tracking-wider">
                        {member.name ? getInitials(member.name) : <User className="w-5 h-5" />}
                      </div>
                      <div className="text-[11px] text-slate-400">Neutral Placeholder</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 max-w-[180px]">
                  <label className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>{uploadingId === member.id ? 'Uploading...' : member.photoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingId === member.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) handlePhotoUpload(member.id, file);
                      }}
                      className="sr-only"
                    />
                  </label>
                  {member.photoUrl && (
                    <button
                      type="button"
                      onClick={() => updateMember(member.id, { photoUrl: '' })}
                      className="w-full py-1.5 text-[11px] font-medium text-slate-600 hover:text-red-700 border border-slate-200 rounded-lg"
                    >
                      Use Neutral Placeholder
                    </button>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Full Name *</label>
                  <input
                    required
                    placeholder="e.g. Sahil Prakash Bhagat"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Designation *</label>
                  <input
                    required
                    placeholder="e.g. Founder & Chief Executive Officer"
                    value={member.designation}
                    onChange={(e) => updateMember(member.id, { designation: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Qualifications</label>
                  <input
                    placeholder="e.g. BE – YCCE, Nagpur · MBA – JD College of Engineering & Management"
                    value={member.qualifications}
                    onChange={(e) => updateMember(member.id, { qualifications: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={member.displayOrder}
                    onChange={(e) => updateMember(member.id, { displayOrder: Math.max(1, Number(e.target.value) || 1) })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700">Biography</label>
                  <textarea
                    rows={2}
                    placeholder="Concise professional background and domain expertise..."
                    value={member.biography}
                    onChange={(e) => updateMember(member.id, { biography: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700">Key Responsibilities</label>
                  <textarea
                    rows={2}
                    placeholder="Primary engineering, leadership, or operational responsibilities..."
                    value={member.responsibilities}
                    onChange={(e) => updateMember(member.id, { responsibilities: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> Photograph URL (Optional direct link / uploaded asset URL)
                  </label>
                  <input
                    placeholder="Uploaded automatically above or paste verified asset path..."
                    value={member.photoUrl}
                    onChange={(e) => updateMember(member.id, { photoUrl: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#111417]">
          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
          <span>
            Updates persist to Supabase / PostgreSQL site settings and appear immediately on <strong>/about</strong>.
          </span>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving Changes...' : 'Save & Publish Team Profiles'}
        </button>
      </div>
    </form>
  );
};
