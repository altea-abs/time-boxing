---
applyTo: '**'
---
# app.vue

> The app.vue file is the main component of your Nuxt application.

<tip>

If you have a `pages/` directory, the `app.vue` file is optional. Nuxt will automatically include a default `app.vue`, but you can still add your own to customize the structure and content as needed.

</tip>

## Usage

### Minimal Usage

With Nuxt, the [`pages/`](/docs/4.x/guide/directory-structure/pages) directory is optional. If it is not present, Nuxt will not include the [vue-router](https://router.vuejs.org) dependency. This is useful when building a landing page or an application that does not require routing.

```vue [app.vue]
<template>
  <h1>Hello World!</h1>
</template>
```

<link-example to="/docs/examples/hello-world">



</link-example>

### Usage with Pages

When you have a [`pages/`](/docs/4.x/guide/directory-structure/pages) directory, you need to use the [`<NuxtPage>`](/docs/4.x/api/components/nuxt-page) component to display the current page:

```vue [app.vue]
<template>
  <NuxtPage />
</template>
```

You can also define the common structure of your application directly in `app.vue`. This is useful when you want to include global elements such as a header or footer:

```vue [app.vue]
<template>
  <header>
    Header content
  </header>
  <NuxtPage />
  <footer>
    Footer content
  </footer>
</template>
```

<note>

Remember that `app.vue` acts as the main component of your Nuxt application. Anything you add to it (JS and CSS) will be global and included in every page.

</note>

<read-more to="/docs/guide/directory-structure/pages">

Learn more about how to structure your pages using the `pages/` directory.

</read-more>

### Usage with Layouts

When your application requires different layouts for different pages, you can use the `layouts/` directory with the [`<NuxtLayout>`](/docs/4.x/api/components/nuxt-layout) component. This allows you to define multiple layouts and apply them per page.

```vue [app.vue]
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

<read-more to="/docs/guide/directory-structure/layouts">

Learn more about how to structure your layouts using the `layouts/` directory.

</read-more>