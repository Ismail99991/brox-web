import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import FileUpload from '../components/FileUpload';
import type { Category, Characteristic } from '../types';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    priceType: 'FIXED' as 'FIXED' | 'QUOTE',
    price: '',
    article: '',
    categoryId: '',
  });
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/api/categories').then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    apiClient.get(`/api/products/id/${id}`).then((res) => {
      const p = res.data;
      setForm({
        title: p.title,
        slug: p.slug,
        description: p.description || '',
        priceType: p.priceType || 'FIXED',
        price: p.price?.toString() || '',
        article: p.article || '',
        categoryId: p.categoryId,
      });
      setCharacteristics(p.characteristics || []);
      setImages(p.images?.map((img: any) => ({ id: img.id, url: img.url })) || []);
    }).catch(console.error);
  }, [id, isEdit]);

  // Если редактируем, slug не меняем автоматически
  const generateSlug = (title: string) => {
    if (isEdit) return form.slug;
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const addCharacteristic = () => {
    setCharacteristics([...characteristics, { key: '', value: '' }]);
  };

  const removeCharacteristic = (index: number) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index));
  };

  const updateCharacteristic = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...characteristics];
    updated[index] = { ...updated[index], [field]: val };
    setCharacteristics(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload: Record<string, any> = {
        title: form.title,
        slug: form.slug,
        description: form.description || undefined,
        priceType: form.priceType,
        price: form.priceType === 'FIXED' ? parseFloat(form.price) || 0 : null,
        article: form.article || undefined,
        categoryId: form.categoryId,
        characteristics: characteristics.filter((c) => c.key && c.value),
        imageIds: images.map((img) => img.id),
      };

      if (isEdit) {
        await apiClient.put(`/admin/products/${id}`, payload);
      } else {
        await apiClient.post('/admin/products', payload);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">{isEdit ? 'Редактировать товар' : 'Новый товар'}</h1>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название *</label>
            <input
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({ ...f, title, slug: generateSlug(title) }));
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
            <label>Описание</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Категория *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            >
              <option value="">— выберите категорию —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Артикул</label>
            <input
              value={form.article}
              onChange={(e) => setForm((f) => ({ ...f, article: e.target.value }))}
              placeholder="Например: BRX-001"
            />
          </div>

          {/* Price Type Toggle */}
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Тип цены</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <label
                className={`btn ${form.priceType === 'FIXED' ? 'btn-primary' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="priceType"
                  value="FIXED"
                  checked={form.priceType === 'FIXED'}
                  onChange={() => setForm((f) => ({ ...f, priceType: 'FIXED' }))}
                  hidden
                />
                Фиксированная цена
              </label>
              <label
                className={`btn ${form.priceType === 'QUOTE' ? 'btn-primary' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="priceType"
                  value="QUOTE"
                  checked={form.priceType === 'QUOTE'}
                  onChange={() => setForm((f) => ({ ...f, priceType: 'QUOTE', price: '' }))}
                  hidden
                />
                Запрос КП
              </label>
            </div>
          </div>

          {form.priceType === 'FIXED' && (
            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label>Цена (₽)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          )}

          {/* Характеристики */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Характеристики</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {characteristics.map((char, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    placeholder="Ключ"
                    value={char.key}
                    onChange={(e) => updateCharacteristic(i, 'key', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    placeholder="Значение"
                    value={char.value}
                    onChange={(e) => updateCharacteristic(i, 'value', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeCharacteristic(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm"
                onClick={addCharacteristic}
                style={{ alignSelf: 'flex-start' }}
              >
                + Добавить характеристику
              </button>
            </div>
          </div>

          {/* Изображения */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Изображения</label>
            <FileUpload
              images={images}
              onImagesChange={setImages}
              multiple
              category="PRODUCT_IMAGE"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/admin/products')}
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