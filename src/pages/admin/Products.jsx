import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from "../../redux/actions/productActions";
import ProductForm from "./ProductForm";
import ProductImage from "../../components/ProductImage";
import GradeBadge from "../../components/GradeBadge";
import { formatPrice } from "../../utils/formatPrice";

function Products() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.data);
  const loading = useSelector((state) => state.product.loading);
  const mutationError = useSelector((state) => state.product.mutationError);

  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingProduct(null);
    setOpenForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this product?")) return;
    dispatch(deleteProductRequest(id));
  };

  const handleSubmit = (data) => {
    if (editingProduct) {
      dispatch(updateProductRequest(editingProduct.id, data));
    } else {
      dispatch(createProductRequest(data));
    }
    setOpenForm(false);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Product Management</h1>
          <p className="text-gundam-muted text-sm mt-1">{products.length} products</p>
        </div>
        <button onClick={handleAdd} className="btn-primary text-sm">
          + Add Product
        </button>
      </div>

      {mutationError && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {mutationError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-gundam-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gundam-muted text-left">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Grade</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4 text-gundam-muted">{product.id}</td>
                    <td className="p-4">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-contain bg-gundam-surface rounded-lg"
                      />
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4"><GradeBadge grade={product.grade} /></td>
                    <td className="p-4">{formatPrice(product.price)}</td>
                    <td className="p-4">{product.quantity}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 rounded-lg bg-gundam-accent/20 text-gundam-accent text-xs hover:bg-gundam-accent/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {openForm && (
        <ProductForm
          key={editingProduct?.id ?? "new"}
          product={editingProduct}
          onSubmit={handleSubmit}
          onClose={() => setOpenForm(false)}
        />
      )}
    </div>
  );
}

export default Products;
