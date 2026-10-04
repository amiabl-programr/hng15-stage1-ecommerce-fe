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
    id: '0dd873d4-3a75-4663-9091-640dfa22c0ea',
    name: 'Roofing Sheets',
    slug: 'roofing-sheets',
    description:
      'Industrial and residential longspan roofing sheets available in custom lengths.',
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
    id: '70944f40-ece6-483a-ab67-73a2cbb21a23',
    name: 'Metcopo Roofing',
    slug: 'metcopo-roofing',
    description:
      'Tile-effect roofing sheets designed for architectural residential and commercial applications.',
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
    id: '45b17293-ef1a-4df3-b192-ed73f34df853',
    name: 'Step Tiles',
    slug: 'step-tiles',
    description:
      'Stepped architectural roofing panels with durable exterior finishes.',
    media: [
      {
        id: 'med-cat-steptile',
        url: 'https://images.unsplash.com/photo-1610056868457-e61d6f9eeb86?auto=format&fit=crop&w=800&q=80',
        alt: 'Architectural step tile roofing panels',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L6PZfSi_.AyE_3t7t7Rj~qofofay',
        isPrimary: true,
      },
    ],
  },
  {
    id: '254dc273-38a4-4a10-b188-edbc97205add',
    name: 'Roofing Shingles',
    slug: 'shingles',
    description:
      'Multi-layered stone-coated roofing shingles for premium residential and commercial roofs.',
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
    id: '26a8a0e6-8b7c-4562-9c19-e4aa336df4ae',
    name: 'Ridge Caps & Apex',
    slug: 'ridge-caps',
    description:
      'Roofing ridge and apex components for weatherproof roof junctions.',
    media: [
      {
        id: 'med-cat-ridge',
        url: 'https://images.unsplash.com/photo-1635958854453-214b7af60fb5?auto=format&fit=crop&w=800&q=80',
        alt: 'Roof ridge flashing and metal trims',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L8BzG$WB00of00j[~qof00j[00ay',
        isPrimary: true,
      },
    ],
  },
  {
    id: '4787e519-0320-4fcd-8e8e-f645fcb86ae3',
    name: 'Trimmers & Gutters',
    slug: 'trimmers-and-gutters',
    description:
      'Valley gutters, roof trimmers and associated drainage components.',
    media: [
      {
        id: 'med-cat-flash',
        url: 'https://images.unsplash.com/photo-1617459973560-33aea09d1c22?auto=format&fit=crop&w=800&q=80',
        alt: 'Roof gutters and valley drainage',
        role: 'main',
        width: 800,
        height: 600,
        blurhash: 'L8BzG$WB00of00j[~qof00j[00ay',
        isPrimary: true,
      },
    ],
  },
  {
    id: '19d1363d-9ba4-47ba-83ef-e0c2d7a3b9af',
    name: 'Accessories & Fasteners',
    slug: 'accessories',
    description:
      'Roofing screws, waterproofing tapes, sealants and related accessories.',
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
    id: 'c5e5efeb-65b2-4a2b-81c2-0fa5f6c42a3c',
    name: 'Premium Longspan Aluminium Roofing Sheet',
    slug: 'premium-longspan-aluminium-roofing-sheet',
    description:
      'Industrial-grade continuous longspan roofing sheet designed for residential, commercial and industrial applications. Available in multiple thicknesses, colours and custom lengths.',
    profileKind: 'longspan',
    productType: 'dimensioned',
    unitType: 'metre',
    basePrice: 5700,
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
    ],
    variants: [
      {
        id: 'f8618b5e-2395-4bfc-ab61-f2eccee7a53c',
        name: '0.45mm / Wine Red',
        sku: 'LS-045-WR',
        priceOverride: 5700,
        stockQuantity: 1999,
        isActive: true,
      },
      {
        id: 'e0a3facf-ffb7-4129-a310-d45d53c272f7',
        name: '0.50mm / Wine Red',
        sku: 'LS-050-WR',
        priceOverride: 6400,
        stockQuantity: 2000,
        isActive: true,
      },
      {
        id: '2145d4a8-fdab-46c4-adbd-27a55037ada1',
        name: '0.55mm / Slate Grey',
        sku: 'LS-055-SG',
        priceOverride: 7500,
        stockQuantity: 2000,
        isActive: true,
      },
      {
        id: '30ec742b-8c3b-410e-ba93-02972b07a062',
        name: '0.60mm / Charcoal',
        sku: 'LS-060-CH',
        priceOverride: 8900,
        stockQuantity: 1500,
        isActive: true,
      },
      {
        id: '085d30a3-42b6-4f8b-9f3e-56505dab5127',
        name: '0.70mm / Charcoal',
        sku: 'LS-070-CH',
        priceOverride: 12500,
        stockQuantity: 1000,
        isActive: true,
      },
    ],
  },
  {
    id: '4c89c859-32e4-445b-800d-090fa80b8271',
    name: 'Premium Metcopo Roofing Sheet',
    slug: 'premium-metcopo-roofing-sheet',
    description:
      'Tile-effect roofing sheet combining a traditional architectural appearance with lightweight profiled metal construction. Available in multiple thicknesses and colours.',
    profileKind: 'metcoppo',
    productType: 'dimensioned',
    unitType: 'sqm',
    basePrice: 6000,
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
        id: 'd0a99367-d769-4268-a2ba-99773d3e37c3',
        name: '0.45mm / Wine Red',
        sku: 'MC-045-WR',
        priceOverride: 6000,
        stockQuantity: 1500,
        isActive: true,
      },
      {
        id: 'cd266244-0ad4-4658-b653-e101415b67ab',
        name: '0.55mm / Charcoal',
        sku: 'MC-055-CH',
        priceOverride: 7200,
        stockQuantity: 1500,
        isActive: true,
      },
      {
        id: '96240f58-8be5-4675-9f68-ab04bd993ae5',
        name: '0.55mm / Forest Green',
        sku: 'MC-055-FG',
        priceOverride: 7200,
        stockQuantity: 1500,
        isActive: true,
      },
      {
        id: 'ddbed180-ba2d-497e-b341-6aadd934e4ff',
        name: '0.60mm / Slate Grey',
        sku: 'MC-060-SG',
        priceOverride: 9200,
        stockQuantity: 1000,
        isActive: true,
      },
    ],
  },
  {
    id: '5885065a-3c8a-42dd-a6f6-6b948202cdda',
    name: 'Premium Step Tile Roofing Sheet',
    slug: 'premium-step-tile-roofing-sheet',
    description:
      'Stepped architectural roofing panel designed for residential and commercial roofing applications, with multiple thickness and colour options.',
    profileKind: 'step-tile',
    productType: 'dimensioned',
    unitType: 'sqm',
    basePrice: 5800,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[2],
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
        id: '55dc18c5-2113-44a0-a324-2f483958ca3c',
        name: '0.45mm / Wine Red',
        sku: 'ST-045-WR',
        priceOverride: 5800,
        stockQuantity: 1500,
        isActive: true,
      },
    ],
  },
  {
    id: 'f78a3639-40c4-457f-9659-2b9f28f1ade7',
    name: 'Premium Stone-Coated Roofing Shingles',
    slug: 'premium-stone-coated-roofing-shingles',
    description:
      'Stone-coated roofing shingles designed for premium residential and commercial roof applications.',
    profileKind: 'shingle',
    productType: 'dimensioned',
    unitType: 'sqm',
    basePrice: 8500,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[3],
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
    variants: [],
  },
  {
    id: 'b22a47b0-d793-4143-8e9c-0b7e0c3f5415',
    name: 'Aluminium Ridge Cap',
    slug: 'aluminium-ridge-cap',
    description:
      'Roofing ridge and apex component for weatherproof roof junctions.',
    profileKind: 'ridge',
    productType: 'standard',
    unitType: 'piece',
    basePrice: 5500,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[4],
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
    variants: [],
  },
  {
    id: '73af6b8b-ec7f-448b-af7d-a2bf89b2ebaf',
    name: 'Aluminium Valley Gutter',
    slug: 'aluminium-valley-gutter',
    description:
      'Heavy-duty aluminium valley gutter channel designed for roof valley rainwater discharge.',
    profileKind: 'gutter',
    productType: 'standard',
    unitType: 'piece',
    basePrice: 6500,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[5],
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
    variants: [],
  },
  {
    id: '2b2a6d3f-ab72-4cd9-a685-c726b9b1fc39',
    name: 'EPDM Self-Drilling Roofing Screws',
    slug: 'epdm-self-drilling-roofing-screws',
    description:
      'High-tensile self-drilling hex fasteners with UV-stabilized EPDM sealing washers for leakproof fixing.',
    profileKind: 'fastener',
    productType: 'standard',
    unitType: 'bundle',
    basePrice: 12000,
    minOrderQuantity: 1,
    isActive: true,
    category: SEED_CATEGORIES[6],
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
    variants: [],
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
