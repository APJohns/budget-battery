import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Budget Battery',
    short_name: 'Budget Battery',
    description: 'A weekly spending tracker to keep you budget in the green.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#34c85a',
    /* icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ], */
  };
}
