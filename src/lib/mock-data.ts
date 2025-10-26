export const mockCollections = [
  {
    node: {
      id: 'gid://shopify/Collection/1',
      title: 'Narguiles Premium',
      handle: 'narguiles-premium',
      description: 'La mejor selección de narguiles de alta gama.',
      image: { url: 'https://images.pexels.com/photos/5631873/pexels-photo-5631873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Narguiles Premium' },
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/1',
              title: 'Narguile Alpha',
              description: 'Un narguile de diseño moderno y rendimiento excepcional.',
              handle: 'narguile-alpha',
              priceRange: { minVariantPrice: { amount: '150.00', currencyCode: 'USD' } },
              images: {
                edges: [
                  { node: { url: 'https://images.pexels.com/photos/1059607/pexels-photo-1059607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Narguile Alpha Negro' } },
                  { node: { url: 'https://images.pexels.com/photos/433203/pexels-photo-433203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Narguile Alpha Rojo' } },
                  { node: { url: 'https://images.pexels.com/photos/3802643/pexels-photo-3802643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Narguile Alpha Azul' } },
                ]
              },
              options: [{ name: 'Color', values: ['Negro', 'Rojo', 'Azul'] }],
              variants: {
                edges: [
                  {
                    node: {
                      id: 'gid://shopify/ProductVariant/1',
                      title: 'Negro',
                      price: { amount: '150.00', currencyCode: 'USD' },
                      availableForSale: true,
                      selectedOptions: [{ name: 'Color', value: 'Negro' }],
                      image: { url: 'https://images.pexels.com/photos/1059607/pexels-photo-1059607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1_1', altText: 'Narguile Alpha Negro' }
                    }
                  },
                  {
                    node: {
                      id: 'gid://shopify/ProductVariant/2',
                      title: 'Rojo',
                      price: { amount: '155.00', currencyCode: 'USD' },
                      availableForSale: true,
                      selectedOptions: [{ name: 'Color', value: 'Rojo' }],
                      image: { url: 'https://images.pexels.com/photos/433203/pexels-photo-433203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Narguile Alpha Rojo' }
                    }
                  },
                  {
                    node: {
                      id: 'gid://shopify/ProductVariant/3',
                      title: 'Azul',
                      price: { amount: '155.00', currencyCode: 'USD' },
                      availableForSale: true,
                      selectedOptions: [{ name: 'Color', value: 'Azul' }],
                      image: { url: 'https://images.pexels.com/photos/3802643/pexels-photo-3802643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Narguile Alpha Azul' }
                    }
                  }
                ]
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/2',
              title: 'Narguile Beta',
              description: 'Tradición y calidad en un solo producto.',
              handle: 'narguile-beta',
              priceRange: { minVariantPrice: { amount: '120.00', currencyCode: 'USD' } },
              images: { edges: [{ node: { url: 'https://images.pexels.com/photos/4110101/pexels-photo-4110101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Narguile Beta' } }] },
              variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/2', title: 'Default Title', price: { amount: '120.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [] } }] },
              options: [],
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/4',
              title: 'Narguile Gamma',
              description: 'Perfecto para iniciarse en el mundo de la hookah.',
              handle: 'narguile-gamma',
              priceRange: { minVariantPrice: { amount: '90.00', currencyCode: 'USD' } },
              images: { edges: [{ node: { url: 'https://images.pexels.com/photos/5967852/pexels-photo-5967852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Narguile Gamma' } }] },
              variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/4', title: 'Default Title', price: { amount: '90.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [] } }] },
              options: [],
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: 'gid://shopify/Collection/2',
      title: 'Accesorios Esenciales',
      handle: 'accesorios-esenciales',
      description: 'Todo lo que necesitas para tu sesión de hookah.',
      image: { url: 'https://images.pexels.com/photos/7292737/pexels-photo-7292737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Accesorios Esenciales' },
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/3',
              title: 'Carbones Naturales',
              description: 'Carbones de coco de alta duración.',
              handle: 'carbones-naturales',
              priceRange: { minVariantPrice: { amount: '15.00', currencyCode: 'USD' } },
              images: { edges: [{ node: { url: 'https://images.pexels.com/photos/952356/pexels-photo-952356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', altText: 'Carbones Naturales' } }] },
              variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/3', title: 'Default Title', price: { amount: '15.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [] } }] },
              options: [],
            },
          },
        ],
      },
    },
  },
];

export const mockProducts = mockCollections.flatMap(collection => collection.node.products.edges);
