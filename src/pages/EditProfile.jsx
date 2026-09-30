import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUpdateProfile } from "../hooks/useProfile";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser, updatePassword } = useAuth();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    const payload = new FormData();
    payload.append("name", name.trim());
    if (avatarFile) {
      payload.append("avatar", avatarFile);
    }

    try {
      const { data } = await updateProfile.mutateAsync(payload);
      updateUser(data.user);
      navigate("/profile");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't update your profile. Please try again.",
      );
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Enter your current password");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
          "Couldn't update your password. Please try again.",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8">
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-1.5 text-[#64748B] text-sm hover:text-[#1E293B] mb-6 transition-colors"
      >
        ← Back to Profile
      </button>

      <h1 className="font-display font-800 text-[#1E293B] text-2xl md:text-3xl mb-1">
        Edit Profile
      </h1>
      <p className="text-[#64748B] text-sm mb-7">
        Update your name and profile photo.
      </p>

      {error && (
        <div className="mb-5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow space-y-6">
        {/* Avatar */}
        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-3">
            Profile Photo
          </label>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="w-20 h-20 rounded-2xl bg-[#0F766E]/15 text-[#0F766E] font-display font-800 text-2xl flex items-center justify-center shrink-0 overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <label className="inline-block cursor-pointer bg-white border border-[#E2E8F0] text-[#1E293B] text-[13px] font-600 px-4 py-2 rounded-lg hover:border-[#0F766E]/30 hover:text-[#0F766E] transition-colors">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-[#94A3B8] mt-2">
                JPG or PNG, up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
        </div>

        {/* Read-only info */}
        <div className="pt-2 border-t border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-[#64748B]">Email</span>
            <span className="text-[13px] font-500 text-[#1E293B] break-all text-right">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-[#64748B]">Community</span>
            <span className="text-[13px] font-500 text-[#1E293B]">
              {user?.community?.name || "None"}
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            To change your email or community, visit your account settings or{" "}
            <button
              onClick={() => navigate("/change-community")}
              className="text-[#0F766E] hover:underline"
            >
              change community
            </button>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            onClick={() => navigate("/profile")}
            className="px-5 py-2.5 border border-[#E2E8F0] text-[#64748B] text-[13px] font-500 rounded-lg hover:border-[#0F766E]/30 hover:text-[#0F766E] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={updateProfile.isPending}
            className="flex-1 bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow mt-6">
        <h2 className="font-600 text-[#1E293B] text-[15px] mb-1">
          Change Password
        </h2>
        <p className="text-[13px] text-[#64748B] mb-5">
          Enter your current password, then choose a new one.
        </p>

        {passwordError && (
          <div className="mb-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-4 px-3.5 py-2.5 bg-green-50 border border-green-200 rounded-lg text-[13px] text-green-700">
            {passwordSuccess}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-5 mt-5 border-t border-[#E2E8F0]">
          <button
            onClick={handleUpdatePassword}
            disabled={passwordSaving}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
