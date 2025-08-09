<script setup lang="ts">
useHead({
    htmlAttrs: {
        lang: 'en',
    },
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
            name: 'description',
            content:
                'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool.',
        },
        {
            name: 'keywords',
            content:
                'weight plates, gym equipment, plate calculator, home gym, barbell weights, fitness calculator, weight optimization',
        },
        { name: 'author', content: 'Plate Calculator' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        {
            property: 'og:title',
            content: 'Plate Calculator - Weight Plate Optimization Tool',
        },
        {
            property: 'og:description',
            content:
                'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool.',
        },
        {
            name: 'twitter:title',
            content: 'Plate Calculator - Weight Plate Optimization Tool',
        },
        {
            name: 'twitter:description',
            content:
                'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool.',
        },
    ],
    link: [
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: [
        {
            type: 'application/ld+json',
        },
    ],
})
</script>
<template>
    <div class="m-0 bg-background text-text text-xs lg:text-sm">
        <slot />
    </div>
</template>
<style>
body {
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    background-color: #282828;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    box-shadow: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
    border-radius: 4px;
}

::-webkit-scrollbar-corner {
    background: transparent;
}
</style>
