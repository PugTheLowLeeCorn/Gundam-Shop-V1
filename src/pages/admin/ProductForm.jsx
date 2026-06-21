import { useState, useEffect } from "react";

function ProductForm({ product, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    grade: "",
    price: "",
    quantity: "",
    image: "",
    description: "",
    scale: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        image: product.image.replace("/images/", ""),
        price: product.price,
        quantity: product.quantity,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  const fields = [
    { name: "name", label: "Product Name", placeholder: "RX-78-2 Gundam" },
    { name: "brand", label: "Brand", placeholder: "Bandai" },
    { name: "grade", label: "Grade", placeholder: "HG, RG, MG..." },
    { name: "scale", label: "Scale", placeholder: "1/144, 1/100..." },
    { name: "price", label: "Price (VND)", type: "number", placeholder: "850000" },
    { name: "quantity", label: "Stock Quantity", type: "number", placeholder: "15" },
    { name: "image", label: "Image Filename", placeholder: "gundam1.png" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gundam-card border border-white/10 rounded-2xl p-6 lg:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-display text-2xl font-bold mb-6">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-sm text-gundam-muted mb-1.5 block">{field.label}</label>
              <input
                name={field.name}
                type={field.type || "text"}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="input-field !rounded-xl"
                required={field.name !== "scale"}
              />
            </div>
          ))}

          <div>
            <label className="text-sm text-gundam-muted mb-1.5 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product description..."
              className="input-field !rounded-xl min-h-[100px] resize-y"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="submit" className="btn-primary flex-1">
            Save
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
