import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import type { Product } from '../types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/products')
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить товар?')) return;
    await apiClient.delete(`/admin/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Товары</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
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
                <th>Категория</th>
                <th>Цена</th>
                <th>Тип цены</th>
                <th>Артикул</th>
                <th>Активен</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0].url}
                        alt=""
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{p.title}</td>
                  <td>{p.category?.name || '—'}</td>
                  <td>{p.priceType === 'FIXED' ? `${p.price} ₽` : '—'}</td>
                  <td>
                    <span className={`status-badge ${p.priceType === 'FIXED' ? '' : 'status-badge-warning'}`}
                      style={{ background: p.priceType === 'FIXED' ? '#10b981' : '#f59e0b' }}
                    >
                      {p.priceType === 'FIXED' ? 'Фикс.' : 'КП'}
                    </span>
                  </td>
                  <td>{p.article || '—'}</td>
                  <td>
                    <span
                      className="status-dot"
                      style={{ background: p.isActive ? '#10b981' : '#ef4444' }}
                    />
                  </td>
                  <td>
                    <div className="actions">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="btn btn-sm"
                      >
                        ✏️
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-muted">
                    Нет товаров
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