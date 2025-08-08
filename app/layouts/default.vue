<script setup lang="ts">
useHead({
    htmlAttrs: {
        lang: 'en',
    },
    meta: [
        { charset: 'utf-8' },
    ],
    link: [
        {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
        // {
        //     rel: 'icon',
        //     href: '/favicon.ico',
        //     crossorigin: 'anonymous',
        // },
    ],
})
</script>
<template>
    <div class="m-0 p-3 bg-background text-text">
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
