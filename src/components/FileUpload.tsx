import { useCallback } from 'react';
import apiClient from '../api/client';

interface Props {
  images: { id: string; url: string }[];
  onImagesChange: (images: { id: string; url: string }[]) => void;
  multiple?: boolean;
  category?: 'PRODUCT_IMAGE' | 'CATEGORY_IMAGE' | 'AVATAR';
}

export default function FileUpload({
  images,
  onImagesChange,
  multiple = false,
  category = 'PRODUCT_IMAGE',
}: Props) {
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      const uploaded: { id: string; url: string }[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const { data } = await apiClient.post('/upload/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploaded.push({ id: data.id, url: data.url });
      }

      if (multiple) {
        onImagesChange([...images, ...uploaded]);
      } else {
        onImagesChange(uploaded.slice(0, 1));
      }
    },
    [images, onImagesChange, multiple, category]
  );

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="file-upload">
      <div className="file-upload-previews">
        {images.map((img) => (
          <div key={img.id} className="file-upload-preview">
            <img src={img.url} alt="preview" />
            <button
              type="button"
              className="file-upload-remove"
              onClick={() => removeImage(img.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="btn btn-sm btn-outline-primary">
        {images.length > 0 ? 'Добавить ещё' : 'Загрузить изображение'}
        <input
          type="file"
          accept="image/*"
          hidden
          multiple={multiple}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}