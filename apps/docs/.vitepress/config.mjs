import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'DIABUOAI',
  description: 'Enterprise AI platform documentation',
  themeConfig: {
    nav: [
      { text: 'Architecture', link: '/architecture/' },
      { text: 'API', link: 'https://localhost:4000/docs' },
    ],
  },
});
