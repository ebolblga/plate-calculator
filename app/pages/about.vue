<script setup lang="ts">
// @ts-ignore
import markdownIt from 'markdown-it'
import readmeRaw from '../README.md?raw'

useSeoMeta({
    title: 'About Plate Calculator',
    description:
        'Learn about the Plate Calculator tool - an advanced weight plate optimization calculator for home gyms.',
    keywords:
        'plate calculator about, weight plate optimization, gym equipment calculator, DIY gym, weight plate algorithms, 3D rendering, home gym setup',
    author: 'Plate Calculator',
    robots: 'index, follow',
    ogTitle: 'About Plate Calculator - Weight Plate Optimization Tool',
    ogDescription:
        'Learn about the Plate Calculator tool - an advanced weight plate optimization calculator for home gyms.',
    ogType: 'website',
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: 'About Plate Calculator - Weight Plate Optimization Tool',
    twitterDescription:
        'Learn about the Plate Calculator tool - an advanced weight plate optimization calculator for home gyms.',
})

useHead({
    script: [
        {
            type: 'application/ld+json',
        },
    ],
})

const md = markdownIt({
    html: true,
})

const html = md.render(readmeRaw)
</script>
<template>
    <BaseGitIcon />
    <main class="p-3 w-full max-w-[900px] mx-auto">
        <nav class="mt-3 text-accent">
            <NuxtLink to="/">{{ '<- Back to main page' }}</NuxtLink>
        </nav>
        <article class="markdown-body p-4 pt-10" v-html="html"></article>
    </main>
</template>
<style>
@import 'github-markdown-css/github-markdown.css';

.markdown-body {
    background-color: transparent;
}

.markdown-body img {
    display: none;
}
</style>
