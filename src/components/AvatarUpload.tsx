import { useCallback } from 'react';
import apiClient from '../api/client';

interface Props {
  currentAvatarUrl?: string | null;
  onAvatarChange: (url: string) => void;
}

export default function AvatarUpload({ currentAvatarUrl, onAvatarChange }: Props) {
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    onAvatarChange(data.avatar?.url || '');
  }, [onAvatarChange]);

  return (
    <div className="avatar-upload">
      {currentAvatarUrl && (
        <img
          src={currentAvatarUrl}
          alt="avatar"
          className="avatar-preview"
          style={{ width: 128, height: 128, borderRadius: '50%', objectFit: 'cover' }}
        />
      )}
      <label className="btn btn-sm btn-outline-primary mt-2">
        {currentAvatarUrl ? 'Изменить аватар' : 'Загрузить аватар'}
        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
      </label>
    </div>
  );
}