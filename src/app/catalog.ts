export type Category =
  | 'Creatina'
  | 'Proteína'
  | 'Pre-entreno'
  | 'Aminoácidos'
  | 'Ganador'
  | 'Accesorios'

export type Variant = {
  id: string
  label: string
  size: string
  flavor?: string
  price: number
  compareAt?: number
  inStock: boolean
}

export type Product = {
  id: string
  name: string
  brand: string
  category: Category
  description: string
  tags?: string[]
  image: {
    kind: 'gradient'
    a: string
    b: string
  }
  variants: Variant[]
}

const g = (a: string, b: string) => ({ kind: 'gradient' as const, a, b })

export const catalog: Product[] = [
  {
    id: 'p-crea-01',
    name: 'Creatina Monohidratada Micronizada',
    brand: 'MUÑEK LABS',
    category: 'Creatina',
    description:
      'Pura, sin rellenos. Fuerza, potencia y mejor rendimiento en series pesadas.',
    tags: ['monohidratada', 'micronizada', 'fuerza', 'volumen'],
    image: g('#d10b1c', '#0b0b0c'),
    variants: [
      {
        id: 'v-crea-250',
        label: '250 g • Sin sabor',
        size: '250 g',
        flavor: 'Sin sabor',
        price: 349,
        compareAt: 399,
        inStock: true,
      },
      {
        id: 'v-crea-500',
        label: '500 g • Sin sabor',
        size: '500 g',
        flavor: 'Sin sabor',
        price: 549,
        compareAt: 649,
        inStock: true,
      },
      {
        id: 'v-crea-1k',
        label: '1 kg • Sin sabor',
        size: '1 kg',
        flavor: 'Sin sabor',
        price: 899,
        compareAt: 999,
        inStock: true,
      },
    ],
  },
  {
    id: 'p-whey-01',
    name: 'Whey Protein Isolate 90',
    brand: 'MUÑEK LABS',
    category: 'Proteína',
    description:
      'Alta proteína por porción, textura limpia y sabores discretos, sin empalagar.',
    tags: ['whey', 'isolate', 'proteína', 'recuperación'],
    image: g('#0b0b0c', '#3a0b10'),
    variants: [
      {
        id: 'v-whey-1lb-van',
        label: '1 lb • Vainilla',
        size: '1 lb',
        flavor: 'Vainilla',
        price: 699,
        inStock: true,
      },
      {
        id: 'v-whey-2lb-choc',
        label: '2 lb • Chocolate',
        size: '2 lb',
        flavor: 'Chocolate',
        price: 999,
        compareAt: 1099,
        inStock: true,
      },
      {
        id: 'v-whey-5lb-fresa',
        label: '5 lb • Fresa',
        size: '5 lb',
        flavor: 'Fresa',
        price: 1999,
        compareAt: 2199,
        inStock: true,
      },
    ],
  },
  {
    id: 'p-pre-01',
    name: 'Pre-Entreno Clean Focus',
    brand: 'MUÑEK LABS',
    category: 'Pre-entreno',
    description:
      'Energía y enfoque con sensación limpia. Ideal para sesiones intensas.',
    tags: ['preworkout', 'energía', 'pump', 'focus'],
    image: g('#1b1b1d', '#d10b1c'),
    variants: [
      {
        id: 'v-pre-20-serv',
        label: '20 servicios • Sandía',
        size: '20 servicios',
        flavor: 'Sandía',
        price: 499,
        inStock: true,
      },
      {
        id: 'v-pre-30-serv',
        label: '30 servicios • Mango',
        size: '30 servicios',
        flavor: 'Mango',
        price: 649,
        inStock: true,
      },
      {
        id: 'v-pre-30-serv-u',
        label: '30 servicios • Sin sabor',
        size: '30 servicios',
        flavor: 'Sin sabor',
        price: 629,
        inStock: false,
      },
    ],
  },
  {
    id: 'p-bcaa-01',
    name: 'BCAA 2:1:1 + Electrolitos',
    brand: 'MUÑEK LABS',
    category: 'Aminoácidos',
    description:
      'Hidratación y aminoácidos para sesiones largas. Sabor ligero, cero pesadez.',
    tags: ['bcaa', 'electrolitos', 'hidratación'],
    image: g('#c8c3bb', '#0b0b0c'),
    variants: [
      {
        id: 'v-bcaa-30',
        label: '30 servicios • Limón',
        size: '30 servicios',
        flavor: 'Limón',
        price: 449,
        inStock: true,
      },
      {
        id: 'v-bcaa-30-frutos',
        label: '30 servicios • Frutos rojos',
        size: '30 servicios',
        flavor: 'Frutos rojos',
        price: 449,
        inStock: true,
      },
    ],
  },
  {
    id: 'p-mass-01',
    name: 'Mass Gainer Balance',
    brand: 'MUÑEK LABS',
    category: 'Ganador',
    description:
      'Calorías limpias para subir de peso con control. Ideal en volumen.',
    tags: ['gainer', 'volumen', 'calorías'],
    image: g('#0b0b0c', '#7a0b16'),
    variants: [
      {
        id: 'v-mass-3lb',
        label: '3 lb • Vainilla',
        size: '3 lb',
        flavor: 'Vainilla',
        price: 899,
        inStock: true,
      },
      {
        id: 'v-mass-6lb',
        label: '6 lb • Chocolate',
        size: '6 lb',
        flavor: 'Chocolate',
        price: 1499,
        compareAt: 1699,
        inStock: true,
      },
    ],
  },
]

export type CatalogLookup = {
  byVariantId: Record<string, { product: Product; variant: Variant }>
}

export const catalogLookup: CatalogLookup = {
  byVariantId: Object.fromEntries(
    catalog.flatMap((product) =>
      product.variants.map((variant) => [variant.id, { product, variant }]),
    ),
  ),
}
