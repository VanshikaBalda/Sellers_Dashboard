import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "sellers_dashboard_products";

export default function App() {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Ignore storage quota errors
    }
  }, [products]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPrice = price.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedPrice) return;

    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
              ...item,
              name: trimmedName,
              price: trimmedPrice,
              description: trimmedDescription,
            }
            : item
        )
      );
      resetForm();
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: trimmedName,
      price: trimmedPrice,
      description: trimmedDescription,
    };

    setProducts((prev) => [...prev, newProduct]);
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Sellers Dashboard</h1>
        <p>Add, Edit and Manage Products</p>
      </header>

      <section className="card">
        <h2>{editingId !== null ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="product-name">Product Name</label>
            <input
              id="product-name"
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-price">Price (₹)</label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="any"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-description">Description</label>
            <input
              id="product-description"
              type="text"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId !== null ? "Update" : "Add"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Products List</h2>
        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No Products Found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>₹{product.price}</td>
                    <td>{product.description || "-"}</td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="btn btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}