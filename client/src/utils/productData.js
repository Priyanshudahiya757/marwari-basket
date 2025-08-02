// Comprehensive Product Catalog for Marwari Basket
// 12+ SKUs across 3 categories with realistic Rajasthani products

export const products = [
  // Category 1: Traditional Clothing (5 products)
  {
    id: 1,
    name: "Rajasthani Bandhani Saree",
    price: 2499,
    originalPrice: 3499,
    category: "clothing",
    description: "Handcrafted Bandhani saree from Jaipur, featuring traditional tie-dye patterns in vibrant colors. Perfect for festivals and special occasions.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 15,
    rating: 4.8,
    reviews: 127,
    tags: ["saree", "bandhani", "traditional", "festival"],
    specifications: {
      material: "Silk",
      length: "5.5 meters",
      blouse: "Included",
      care: "Dry clean only"
    }
  },
  {
    id: 2,
    name: "Men's Jodhpuri Suit",
    price: 3999,
    originalPrice: 5499,
    category: "clothing",
    description: "Elegant Jodhpuri suit with traditional embroidery and modern fit. Perfect for weddings and formal occasions.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 8,
    rating: 4.9,
    reviews: 89,
    tags: ["suit", "formal", "wedding", "men"],
    specifications: {
      material: "Cotton Silk",
      fit: "Regular",
      jacket: "Included",
      pants: "Included"
    }
  },
  {
    id: 3,
    name: "Lehenga Choli Set",
    price: 1899,
    originalPrice: 2499,
    category: "clothing",
    description: "Beautiful lehenga choli set with mirror work and embroidery. Ideal for dance performances and celebrations.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 22,
    rating: 4.7,
    reviews: 156,
    tags: ["lehenga", "choli", "dance", "celebration"],
    specifications: {
      material: "Georgette",
      work: "Mirror & Embroidery",
      dupatta: "Included",
      blouse: "Included"
    }
  },
  {
    id: 4,
    name: "Kurta Pajama Set",
    price: 1299,
    originalPrice: 1799,
    category: "clothing",
    description: "Comfortable cotton kurta pajama set with traditional prints. Perfect for daily wear and casual occasions.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 35,
    rating: 4.6,
    reviews: 203,
    tags: ["kurta", "pajama", "casual", "cotton"],
    specifications: {
      material: "Cotton",
      fit: "Regular",
      care: "Machine washable"
    }
  },
  {
    id: 5,
    name: "Dupatta with Embroidery",
    price: 799,
    originalPrice: 999,
    category: "clothing",
    description: "Elegant dupatta with intricate embroidery work. Can be paired with any ethnic outfit.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 45,
    rating: 4.5,
    reviews: 178,
    tags: ["dupatta", "embroidery", "accessory"],
    specifications: {
      material: "Silk",
      length: "2.5 meters",
      work: "Hand embroidery"
    }
  },

  // Category 2: Jewelry & Accessories (4 products)
  {
    id: 6,
    name: "Silver Kundan Necklace",
    price: 2499,
    originalPrice: 3299,
    category: "jewelry",
    description: "Stunning silver kundan necklace with traditional Rajasthani design. Perfect for bridal wear.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 12,
    rating: 4.9,
    reviews: 67,
    tags: ["necklace", "kundan", "silver", "bridal"],
    specifications: {
      material: "Silver",
      stones: "Kundan",
      weight: "45 grams",
      length: "18 inches"
    }
  },
  {
    id: 7,
    name: "Meenakari Bangles Set",
    price: 899,
    originalPrice: 1199,
    category: "jewelry",
    description: "Beautiful meenakari bangles set with traditional enamel work. Set of 6 bangles.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 28,
    rating: 4.7,
    reviews: 134,
    tags: ["bangles", "meenakari", "enamel", "set"],
    specifications: {
      material: "Brass",
      work: "Meenakari",
      pieces: "6 bangles",
      size: "Adjustable"
    }
  },
  {
    id: 8,
    name: "Jhumka Earrings",
    price: 599,
    originalPrice: 799,
    category: "jewelry",
    description: "Traditional jhumka earrings with pearl and stone work. Perfect for ethnic wear.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 40,
    rating: 4.6,
    reviews: 89,
    tags: ["earrings", "jhumka", "pearl", "traditional"],
    specifications: {
      material: "Silver plated",
      stones: "Pearl & Stones",
      weight: "12 grams",
      type: "Drop earrings"
    }
  },
  {
    id: 9,
    name: "Stone Studded Ring",
    price: 399,
    originalPrice: 599,
    category: "jewelry",
    description: "Elegant stone studded ring with traditional Rajasthani design. Available in multiple sizes.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 55,
    rating: 4.4,
    reviews: 156,
    tags: ["ring", "stone", "traditional"],
    specifications: {
      material: "Brass",
      stones: "Semi-precious",
      sizes: "16-22",
      weight: "8 grams"
    }
  },

  // Category 3: Home Decor (4 products)
  {
    id: 10,
    name: "Blue Pottery Vase",
    price: 1899,
    originalPrice: 2499,
    category: "home-decor",
    description: "Handcrafted blue pottery vase from Jaipur with traditional designs. Perfect for home decoration.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 18,
    rating: 4.8,
    reviews: 92,
    tags: ["vase", "blue pottery", "handcrafted", "decoration"],
    specifications: {
      material: "Blue Pottery",
      height: "12 inches",
      diameter: "6 inches",
      care: "Hand wash only"
    }
  },
  {
    id: 11,
    name: "Block Print Cushion Covers",
    price: 699,
    originalPrice: 899,
    category: "home-decor",
    description: "Set of 4 cushion covers with traditional block print designs. Adds ethnic charm to your home.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 25,
    rating: 4.6,
    reviews: 78,
    tags: ["cushion", "block print", "set", "home"],
    specifications: {
      material: "Cotton",
      size: "18x18 inches",
      pieces: "4 covers",
      care: "Machine washable"
    }
  },
  {
    id: 12,
    name: "Brass Wall Hanging",
    price: 1299,
    originalPrice: 1699,
    category: "home-decor",
    description: "Traditional brass wall hanging with intricate designs. Perfect for living room decoration.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 10,
    rating: 4.9,
    reviews: 45,
    tags: ["wall hanging", "brass", "traditional", "decoration"],
    specifications: {
      material: "Brass",
      size: "24x18 inches",
      weight: "2.5 kg",
      finish: "Antique"
    }
  },
  {
    id: 13,
    name: "Handwoven Rug",
    price: 3499,
    originalPrice: 4499,
    category: "home-decor",
    description: "Beautiful handwoven rug with traditional Rajasthani patterns. Adds warmth and style to any room.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    stock: 8,
    rating: 4.7,
    reviews: 34,
    tags: ["rug", "handwoven", "traditional", "floor"],
    specifications: {
      material: "Wool",
      size: "6x4 feet",
      thickness: "1 inch",
      care: "Professional cleaning"
    }
  }
];

export const categories = [
  {
    id: "clothing",
    name: "Traditional Clothing",
    description: "Elegant ethnic wear from Rajasthan",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    productCount: 5
  },
  {
    id: "jewelry",
    name: "Jewelry & Accessories",
    description: "Handcrafted traditional jewelry",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    productCount: 4
  },
  {
    id: "home-decor",
    name: "Home Decor",
    description: "Beautiful home decoration items",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    productCount: 4
  }
];

// Helper functions
export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

export const getCategoryById = (id) => {
  return categories.find(category => category.id === id);
};

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}; 