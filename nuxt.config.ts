// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    modules: [
        '@nuxtjs/tailwindcss',
        '@vueuse/nuxt',
        '@nuxtjs/robots',
        '@nuxtjs/sitemap'
    ],
    tailwindcss: {
        cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
        configPath: 'tailwind.config',
        exposeConfig: {
            level: 2,
        },
        config: {},
        viewer: true,
    },
    alias: {
        '@types': resolve(__dirname, './types/types.ts'),
    },
    app: {
        head: {
            title: 'Plate Calculator - Weight Plate Optimization Tool',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool.' },
                { name: 'keywords', content: 'weight plates, gym equipment, plate calculator, home gym, barbell weights, fitness calculator, weight optimization' },
                { name: 'author', content: 'Plate Calculator' },
                { name: 'robots', content: 'index, follow' },
                { property: 'og:type', content: 'website' },
                { property: 'og:title', content: 'Plate Calculator - Weight Plate Optimization Tool' },
                { property: 'og:description', content: 'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool.' },
                { property: 'og:url', content: 'https://plate-calculator.vercel.app/' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'Plate Calculator - Weight Plate Optimization Tool' },
                { name: 'twitter:description', content: 'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool.' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'canonical', href: 'https://plate-calculator.vercel.app/' }
            ]
        }
    },
    // Runtime config for SEO modules
    runtimeConfig: {
        public: {
            siteUrl: 'https://plate-calculator.vercel.app/'
        }
    },
    nitro: {
        prerender: {
            routes: ['/sitemap.xml', '/robots.txt', '/llms.txt']
        }
    }
})