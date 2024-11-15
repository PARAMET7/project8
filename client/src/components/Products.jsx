import { useEffect, useState } from 'react';
import productsData from '../../public/products.json';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Assuming productsData.items is the array of products you need to map
    const mappedProducts = productsData.items.map(item => {
      const { title, price } = item.fields;
      const { id } = item.sys;
      const image = item.fields.image.fields.file.url;
      return { title, price, id, image };
    });

    setProducts(mappedProducts);
  }, []);

  return (
    <div className="products-center">
      {products.map(product => (
        <article className="product" key={product.id}>
          <div className="img-container">
            <img src={product.image} alt="product" className="product-img" />
            <button className="bag-btn" data-id={product.id}>
              <i className="fas fa-shopping-cart"></i> add to bag
            </button>
          </div>
          <h3>{product.title}</h3>
          <h4>${product.price}</h4>
        </article>
      ))}
    </div>
  );
};

export default Products;
