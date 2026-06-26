import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import FileUpload from '../components/FileUpload';
import type { Category } from '../types';

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    title: '',
    description: '',
  });
  const [image, setImage] = useState<{ id: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    apiClient.get(`/api/categories/${id}`).then((res) => {
      const cat: Category = res.data;
      setForm({
        name: cat.name,
        slug: cat.slug,
        title: cat.title || '',
        description: cat.description || '',
      });
      if (cat.image) {
        setImage([{ id: cat.image.id, url: cat.image.url }]);
      }
    }).catch(console.error);
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        imageId: image[0]?.id || null,
      };

      if (isEdit) {
        await apiClient.put(`/admin/categories/${id}`, payload);
      } else {
        await apiClient.post('/admin/categories', payload);
      }
      navigate('/admin/categories');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="page">
      <h1 className="page-title">{isEdit ? 'Редактировать категорию' : 'Новая категория'}</h1>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название *</label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({
                  ...f,
                  name,
                  slug: isEdit ? f.slug : generateSlug(name),
                }));
              }}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Заголовок (title)</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Описание</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Изображение</label>
            <FileUpload
              images={image}
              onImagesChange={setImage}
              category="CATEGORY_IMAGE"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/admin/categories')}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}