import { Product } from '../models/product';

export const PRODUCTS: Product[] = [
  // --- Electronics ---
  {
    id: '1',
    name: 'Noise-Cancelling Wireless Headphones',
    description:
      'Experience immersive sound with active noise cancellation and 30-hour battery life.',
    category: 'electronics',
    price: 249.99,
    imageUrl: 'https://placehold.co/600x400/png?text=Headphones',
    rating: 4.8,
    reviewCount: 12,
    inStock: true,
    favorite: false
  },
  {
    id: '2',
    name: 'Ultra-Slim 4K Smart TV',
    description: '55-inch 4K UHD Smart TV with vibrant colors and built-in streaming apps.',
    category: 'electronics',
    price: 499.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Smart+TV',
    rating: 4.6,
    reviewCount: 8,
    inStock: true,
    favorite: false
  },
  {
    id: '3',
    name: 'Pro Gaming Laptop 15',
    description: 'High-performance gaming laptop with latest GPU and 144Hz refresh rate display.',
    category: 'electronics',
    price: 1299.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Gaming+Laptop',
    rating: 4.9,
    reviewCount: 4,
    inStock: false,
    favorite: false
  },
  {
    id: '4',
    name: 'Compact Smart Speaker',
    description: 'Voice-controlled smart speaker with rich sound and smart home integration.',
    category: 'electronics',
    price: 49.99,
    imageUrl: 'https://placehold.co/600x400/png?text=Smart+Speaker',
    rating: 4.4,
    reviewCount: 19,
    inStock: true,
    favorite: false
  },
  {
    id: '5',
    name: 'Professional Mirrorless Camera',
    description: 'Capture stunning 24MP photos and 4K video with this compact mirrorless camera.',
    category: 'electronics',
    price: 850.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Camera',
    rating: 4.7,
    reviewCount: 7,
    inStock: true,
    favorite: false
  },

  // --- Clothing ---
  {
    id: '6',
    name: 'Classic Cotton Crew Neck T-Shirt',
    description: 'Soft, breathable 100% cotton t-shirt available in multiple colors.',
    category: 'clothing',
    price: 19.99,
    imageUrl: 'https://placehold.co/600x400/png?text=T-Shirt',
    rating: 4.3,
    reviewCount: 15,
    inStock: true,
    favorite: false
  },
  {
    id: '7',
    name: 'Slim-Fit Denim Jeans',
    description: 'Durable and stylish slim-fit jeans with a slight stretch for comfort.',
    category: 'clothing',
    price: 59.5,
    imageUrl: 'https://placehold.co/600x400/png?text=Jeans',
    rating: 4.5,
    reviewCount: 11,
    inStock: true,
    favorite: false
  },
  {
    id: '8',
    name: 'Waterproof Hiking Jacket',
    description: 'Lightweight, waterproof jacket designed for outdoor adventures and rainy days.',
    category: 'clothing',
    price: 89.99,
    imageUrl: 'https://placehold.co/600x400/png?text=Jacket',
    rating: 4.7,
    reviewCount: 6,
    inStock: true,
    favorite: false
  },
  {
    id: '9',
    name: 'Running Sneakers',
    description: 'Comfortable and supportive sneakers perfect for running or daily wear.',
    category: 'clothing',
    price: 75.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Sneakers',
    rating: 4.6,
    reviewCount: 18,
    inStock: false,
    favorite: false
  },
  {
    id: '10',
    name: 'Knitted Wool Sweater',
    description: 'Warm and cozy wool sweater with a classic cable knit pattern.',
    category: 'clothing',
    price: 45.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Sweater',
    rating: 4.8,
    reviewCount: 3,
    inStock: true,
    favorite: false
  },

  // --- Accessories ---
  {
    id: '11',
    name: 'Polarized Aviator Sunglasses',
    description: 'Timeless aviator style with polarized lenses for UV protection.',
    category: 'accessories',
    price: 120.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Sunglasses',
    rating: 4.5,
    reviewCount: 9,
    inStock: true,
    favorite: false
  },
  {
    id: '12',
    name: 'Genuine Leather Wallet',
    description: 'Minimalist bifold wallet made from premium full-grain leather.',
    category: 'accessories',
    price: 35.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Wallet',
    rating: 4.7,
    reviewCount: 14,
    inStock: true,
    favorite: false
  },
  {
    id: '13',
    name: 'Everyday Commuter Backpack',
    description: 'Water-resistant backpack with laptop compartment and ergonomic straps.',
    category: 'accessories',
    price: 65.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Backpack',
    rating: 4.8,
    reviewCount: 20,
    inStock: true,
    favorite: false
  },
  {
    id: '14',
    name: 'Stainless Steel Analog Watch',
    description: 'Elegant analog watch with a stainless steel band and scratch-resistant glass.',
    category: 'accessories',
    price: 150.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Watch',
    rating: 4.6,
    reviewCount: 2,
    inStock: false,
    favorite: false
  },
  {
    id: '15',
    name: 'Reversible Leather Belt',
    description:
      'Versatile belt with a reversible buckle, offering black and brown leather options.',
    category: 'accessories',
    price: 25.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Belt',
    rating: 4.4,
    reviewCount: 13,
    inStock: true,
    favorite: false
  },

  // --- Home Items ---
  {
    id: '16',
    name: 'Programmable Drip Coffee Maker',
    description: '12-cup coffee maker with programmable timer and auto-shutoff feature.',
    category: 'home',
    price: 55.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Coffee+Maker',
    rating: 4.5,
    reviewCount: 17,
    inStock: true,
    favorite: false
  },
  {
    id: '17',
    name: 'Modern LED Desk Lamp',
    description:
      'Adjustable desk lamp with wireless charging base and multiple color temperatures.',
    category: 'home',
    price: 39.99,
    imageUrl: 'https://placehold.co/600x400/png?text=Desk+Lamp',
    rating: 4.7,
    reviewCount: 5,
    inStock: true,
    favorite: false
  },
  {
    id: '18',
    name: 'Memory Foam Throw Pillow',
    description: 'Soft memory foam pillow with a velvet cover, perfect for sofas or beds.',
    category: 'home',
    price: 22.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Throw+Pillow',
    rating: 4.3,
    reviewCount: 10,
    inStock: true,
    favorite: false
  },
  {
    id: '19',
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 minimalist ceramic pots with drainage holes and bamboo saucers.',
    category: 'home',
    price: 29.99,
    imageUrl: 'https://placehold.co/600x400/png?text=Plant+Pots',
    rating: 4.8,
    reviewCount: 16,
    inStock: true,
    favorite: false
  },
  {
    id: '20',
    name: 'High-Speed Blender',
    description: 'Powerful blender for smoothies, soups, and crushing ice efficiently.',
    category: 'home',
    price: 89.0,
    imageUrl: 'https://placehold.co/600x400/png?text=Blender',
    rating: 4.6,
    reviewCount: 8,
    inStock: false,
    favorite: false
  }
];
