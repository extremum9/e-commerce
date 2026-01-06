import { Product } from './models/product';

export const createMockProduct = (product: Partial<Product> = {}): Product => ({
  id: '1',
  name: 'Test name',
  description: 'Test description',
  category: 'test-category',
  price: 99.99,
  imageUrl: 'https://placehold.co/400x400/png',
  rating: 4.5,
  reviewCount: 10,
  inStock: true,
  favorite: false,
  ...product
});
