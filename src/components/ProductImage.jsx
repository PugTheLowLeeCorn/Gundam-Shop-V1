import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23161616' width='400' height='400'/%3E%3Ctext x='200' y='200' text-anchor='middle' dy='.3em' fill='%23e8943a' font-family='sans-serif' font-size='18'%3EGUNDAM%3C/text%3E%3C/svg%3E";

function ProductImage({ src, alt, className = "" }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc || FALLBACK}
      alt={alt}
      className={className}
      onError={() => setImgSrc(FALLBACK)}
    />
  );
}

export default ProductImage;
