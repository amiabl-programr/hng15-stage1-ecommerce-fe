import type {
  Category,
  CategoryListResponse,
  FeaturedListResponse,
  Product,
  ProductBySlugResponse,
  ProductListResponse,
} from '~/types/api';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'a0000000-0000-4000-8000-000000000001',
    name: 'Industrial & Longspan Sheets',
    slug: 'industrial-sheets',
    description:
      'Continuous length longspan and industrial box profiles for commercial warehouses, factories, and modern structures.',
    media: [
      {
        id: 'med-cat-ind',
        url: 'https://images.unsplash.com/photo-1602193289141-9605ad75d0a5?auto=format&fit=crop&w=800&q=80',
        alt: 'Industrial corrugated longspan roofing sheets',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L6PZfSi_.AyE_3t7t7Rj~qofofay',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'a0000000-0000-4000-8000-000000000002',
    name: 'Residential Step-Tile & Metcoppo',
    slug: 'residential-steeltile',
    description:
      'Architectural tile profiles, Italian Metcoppo, and classic stepped profiles designed for elegance and high weather resistance.',
    media: [
      {
        id: 'med-cat-res',
        url: 'https://images.unsplash.com/photo-1610056868457-e61d6f9eeb86?auto=format&fit=crop&w=800&q=80',
        alt: 'Residential architectural stepped metal roofing tiles',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'LKO2:N%MoffQ~qj[fQj[fQfQfQfQ',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'a0000000-0000-4000-8000-000000000003',
    name: 'Stone-Coated Shingle & Bond',
    slug: 'stone-coated',
    description:
      'Alu-zinc alloy coated with natural volcanic stone granules. 50-year durability, noise-dampening, and non-fading colour.',
    media: [
      {
        id: 'med-cat-stone',
        url: 'https://images.unsplash.com/photo-1647546656105-c6a9cfa6f0fd?auto=format&fit=crop&w=800&q=80',
        alt: 'Stone-coated architectural roof shingles and tiles',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L9AB2#t700Rj00WB~qof00ay00j[',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'a0000000-0000-4000-8000-000000000004',
    name: 'Flashings, Gutters & Trims',
    slug: 'flashings-gutters',
    description:
      'Custom fabricated ridge caps, parapet flashings, eaves trims, and seamless box gutters in matching gauges and colours.',
    media: [
      {
        id: 'med-cat-flash',
        url: 'https://images.unsplash.com/photo-1617459973560-33aea09d1c22?auto=format&fit=crop&w=800&q=80',
        alt: 'Roof ridge flashing, gutters and metal trims',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L8BzG$WB00of00j[~qof00j[00ay',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'a0000000-0000-4000-8000-000000000005',
    name: 'Fasteners & Installation Accessories',
    slug: 'fasteners-accessories',
    description:
      'Class 4 anti-corrosion self-drilling screws, EPDM bonded sealing washers, silicone sealants, and foam closure strips.',
    media: [
      {
        id: 'med-cat-fast',
        url: 'https://images.unsplash.com/photo-1647427060142-c18ea9536019?auto=format&fit=crop&w=800&q=80',
        alt: 'Roofing fasteners, hex-head self-drilling screws and washers',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L9Cs1gWB00of00j[~qof00j[00ay',
        isPrimary: true,
      },
    ],
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'b0000000-0000-4000-8000-000000000001',
    name: 'Aluminium Longspan Corrugated Sheet (0.55mm AZ150)',
    slug: 'aluminium-longspan-055mm',
    description:
      'Industrial-grade corrugated aluminium sheet. Roll-formed to custom lengths up to 18 metres with zero transverse joints to prevent leakage.',
    profileKind: 'longspan',
    productType: 'dimensioned',
    unitType: 'metre',
    basePrice: 5800,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[0],
    media: [
      {
        id: 'med-longspan-1',
        url: 'https://images.unsplash.com/photo-1602193289141-9605ad75d0a5?auto=format&fit=crop&w=800&q=80',
        alt: 'Aluminium longspan sheet profile',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L6PZfSi_.AyE_3t7t7Rj~qofofay',
        isPrimary: true,
      },
      {
        id: 'med-longspan-2',
        url: 'https://images.unsplash.com/photo-1518736346281-76873166a64a?auto=format&fit=crop&w=800&q=80',
        alt: 'Longspan roofing sheet bundle',
        role: 'profile',
        width: 800,
        height: 600,
        blurhash: 'L8BzG$WB00of00j[~qof00j[00ay',
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: 'c0000000-0000-4000-8000-000000000011',
        name: 'Standard 0.45mm Gauge',
        sku: 'LS-ALU-045',
        priceOverride: 4900,
        stockQuantity: 450,
        isActive: true,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000012',
        name: 'Heavy Duty 0.55mm Gauge (Recommended)',
        sku: 'LS-ALU-055',
        priceOverride: 5800,
        stockQuantity: 320,
        isActive: true,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000013',
        name: 'Industrial Extra Heavy 0.70mm Gauge',
        sku: 'LS-ALU-070',
        priceOverride: 7400,
        stockQuantity: 180,
        isActive: true,
      },
    ],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000002',
    name: 'Italian Metcoppo Steeltile Profile (0.55mm)',
    slug: 'italian-metcoppo-steeltile-055mm',
    description:
      'Classic Roman barrel tile aesthetics combined with the strength and lightweight benefits of high-tensile aluzinc steel.',
    profileKind: 'metcoppo',
    productType: 'dimensioned',
    unitType: 'metre',
    basePrice: 6500,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[1],
    media: [
      {
        id: 'med-metcoppo-1',
        url: 'https://images.unsplash.com/photo-1587061633437-187ac80e8e7a?auto=format&fit=crop&w=800&q=80',
        alt: 'Metcoppo profile roofing sheet',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'LKO2:N%MoffQ~qj[fQj[fQfQfQfQ',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'c0000000-0000-4000-8000-000000000021',
        name: '0.50mm Matte Coated',
        sku: 'MET-050-MATTE',
        priceOverride: 6100,
        stockQuantity: 210,
        isActive: true,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000022',
        name: '0.55mm Wrinkle Texture (Premium)',
        sku: 'MET-055-WRINKLE',
        priceOverride: 6500,
        stockQuantity: 140,
        isActive: true,
      },
    ],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000003',
    name: 'Modern Step-Tile Architectural Profile (0.55mm)',
    slug: 'modern-steptile-architectural-profile',
    description:
      'Modern stepped profile for contemporary residential architecture. Deep troughs offer superior storm drainage capacity.',
    profileKind: 'step-tile',
    productType: 'dimensioned',
    unitType: 'metre',
    basePrice: 6200,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[1],
    media: [
      {
        id: 'med-steptile-1',
        url: 'https://images.unsplash.com/photo-1610056868457-e61d6f9eeb86?auto=format&fit=crop&w=800&q=80',
        alt: 'Modern step-tile profile sheet',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L6PZfSi_.AyE_3t7t7Rj~qofofay',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'c0000000-0000-4000-8000-000000000031',
        name: '0.50mm Premium Texture',
        sku: 'ST-050-TEX',
        priceOverride: 5700,
        stockQuantity: 190,
        isActive: true,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000032',
        name: '0.55mm Heavy Gauge',
        sku: 'ST-055-TEX',
        priceOverride: 6200,
        stockQuantity: 110,
        isActive: true,
      },
    ],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000004',
    name: 'Stone-Coated Shingle Roofing Tile (0.45mm Zincalume)',
    slug: 'stone-coated-shingle-tile',
    description:
      'Volcanic basalt chip stone-coated shingle tiles. Exceptional acoustic dampening in heavy rains and certified 50-year UV durability.',
    profileKind: 'shingle',
    productType: 'standard',
    unitType: 'piece',
    basePrice: 4200,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[2],
    media: [
      {
        id: 'med-shingle-1',
        url: 'https://images.unsplash.com/photo-1647546656105-c6a9cfa6f0fd?auto=format&fit=crop&w=800&q=80',
        alt: 'Stone-coated shingle roofing tile',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L9AB2#t700Rj00WB~qof00ay00j[',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'c0000000-0000-4000-8000-000000000041',
        name: 'Charcoal Black Finish',
        sku: 'STN-SHING-BLK',
        priceOverride: 4200,
        stockQuantity: 500,
        isActive: true,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000042',
        name: 'Coffee Brown Finish',
        sku: 'STN-SHING-BRN',
        priceOverride: 4200,
        stockQuantity: 400,
        isActive: true,
      },
    ],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000005',
    name: 'Roll-Formed Circular Ridge Cap (1.2m Section)',
    slug: 'circular-ridge-cap-1-2m',
    description:
      'Precision bent ridge cap capping the apex of roof pitches. Manufactured in identical gauges and colour coatings as roofing sheets.',
    profileKind: 'ridge',
    productType: 'standard',
    unitType: 'piece',
    basePrice: 2800,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[3],
    media: [
      {
        id: 'med-ridge-1',
        url: 'https://images.unsplash.com/photo-1635958854453-214b7af60fb5?auto=format&fit=crop&w=800&q=80',
        alt: 'Circular ridge cap flashing',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L8BzG$WB00of00j[~qof00j[00ay',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'c0000000-0000-4000-8000-000000000051',
        name: '1.2m Section (0.55mm)',
        sku: 'RDG-12-055',
        priceOverride: 2800,
        stockQuantity: 250,
        isActive: true,
      },
    ],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000006',
    name: 'Heavy-Duty Industrial Box Gutter (3.0m Section)',
    slug: 'industrial-box-gutter-3m',
    description:
      'Custom pressed 0.70mm aluminium box gutter for large watershed catchment areas on factories and residential compounds.',
    profileKind: 'gutter',
    productType: 'standard',
    unitType: 'piece',
    basePrice: 8500,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[3],
    media: [
      {
        id: 'med-gutter-1',
        url: 'https://images.unsplash.com/photo-1617459973560-33aea09d1c22?auto=format&fit=crop&w=800&q=80',
        alt: 'Industrial box gutter section',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L8BzG$WB00of00j[~qof00j[00ay',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'c0000000-0000-4000-8000-000000000061',
        name: '0.70mm Mill Aluminium (3.0m)',
        sku: 'GUT-BOX-070',
        priceOverride: 8500,
        stockQuantity: 120,
        isActive: true,
      },
    ],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000007',
    name: 'Class 4 Self-Drilling Hex Head Roofing Screws (100-Pack)',
    slug: 'self-drilling-roofing-screws-100pk',
    description:
      '50mm hardened steel self-drilling screws with Ruspert anti-corrosion coating and bonded EPDM weather-seal washers.',
    profileKind: 'fastener',
    productType: 'standard',
    unitType: 'bundle',
    basePrice: 4500,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[4],
    media: [
      {
        id: 'med-screw-1',
        url: 'https://images.unsplash.com/photo-1647427060142-c18ea9536019?auto=format&fit=crop&w=800&q=80',
        alt: 'Self-drilling roofing screws pack',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L9Cs1gWB00of00j[~qof00j[00ay',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'c0000000-0000-4000-8000-000000000071',
        name: '50mm Screws (Pack of 100)',
        sku: 'SCR-50MM-100',
        priceOverride: 4500,
        stockQuantity: 400,
        isActive: true,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000072',
        name: '75mm Screws for Timber Purling (Pack of 100)',
        sku: 'SCR-75MM-100',
        priceOverride: 5800,
        stockQuantity: 300,
        isActive: true,
      },
    ],
  },
];

export function getSeedCategoriesResponse(): CategoryListResponse {
  return {
    success: true,
    items: SEED_CATEGORIES,
  };
}

export function getSeedProductsResponse(categorySlug?: string): ProductListResponse {
  const items = categorySlug
    ? SEED_PRODUCTS.filter((p) => p.category?.slug === categorySlug)
    : SEED_PRODUCTS;

  return {
    success: true,
    items,
    nextCursor: null,
  };
}

export function getSeedFeaturedResponse(): FeaturedListResponse {
  return {
    success: true,
    items: SEED_PRODUCTS.slice(0, 4),
  };
}

export function getSeedProductBySlug(slug: string): ProductBySlugResponse | null {
  const product = SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  if (!product) {
    // If not exact match, fall back to first product to prevent blank page
    return {
      success: true,
      product: SEED_PRODUCTS[0],
    };
  }
  return {
    success: true,
    product,
  };
}
