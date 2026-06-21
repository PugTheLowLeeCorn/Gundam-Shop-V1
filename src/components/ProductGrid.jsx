import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

function ProductGrid({ products, variant = "dark", emptyMessage = "No products found" }) {
  if (!products.length) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyMessage}
        description="Try adjusting your search or filter to find what you're looking for."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}

export default ProductGrid;
