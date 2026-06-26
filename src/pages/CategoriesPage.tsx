import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import type { Category } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/categories')
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    await apiClient.delete(`/admin/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Категории</h1>
        <Link to="/admin/categories/new" className="btn btn-primary">
          + Создать
        </Link>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Изображение</th>
                <th>Название</th>
                <th>Slug</th>
                <th>Заголовок</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    {cat.image ? (
                      <img
                        src={cat.image.url}
                        alt=""
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{cat.name}</td>
                  <td className="text-mono">{cat.slug}</td>
                  <td>{cat.title || '—'}</td>
                  <td>
                    <div className="actions">
                      <Link
                        to={`/admin/categories/${cat.id}/edit`}
                        className="btn btn-sm"
                      >
                        ✏️
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(cat.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted">
                    Нет категорий
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}