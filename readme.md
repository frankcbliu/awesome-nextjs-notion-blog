<p align="center">
  <a href="https://nextjs-notion-starter-kit-frankcbliu.vercel.app">
    <img alt="Example article page" src="https://user-images.githubusercontent.com/36353894/145680596-8a06e81c-65c7-4ec9-9101-ded668c9a3eb.png">
  </a>
</p>


# Awesome Next.js-Notion Blog

本项目基于 [nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit) 项目修改而成。

完整教程见：[如何用Notion搭建自己的博客](https://nextjs-notion-starter-kit-frankcbliu.vercel.app/notion)

## New Features

- 目录放置于左边
- 增加公众号跳转
- 修复代码展示 BUG
- 增加图片放大功能
- 增加 Google Analytics 分析功能
- 补全中文教程
- 支持简单表格
- 支持文章级别的效果反馈

## Setup

**All config is defined in [site.config.js](./site.config.js).**

1. Fork / clone this repo
2. Change a few values in [site.config.js](./site.config.js)
3. `yarn`
4. `yarn dev` to test locally
5. `npm run deploy` to deploy to vercel 💪

## URL Paths

The app defaults to slightly different pathnames in dev and prod (though pasting any dev pathname into prod will work and vice-versa).

In development, it will use `/nextjs-notion-blog-d1b5dcf8b9ff425b8aef5ce6f0730202` which is a slugified version of the page's title suffixed with its Notion ID. I've found that it's really useful to always have the Notion Page ID front and center during local development.

In production, it will use `/nextjs-notion-blog` which is a bit nicer as it gets rid of the extra ID clutter.

The mapping of Notion ID to slugified page titles is done automatically for you as part of the build process. Just keep in mind that if you plan on changing page titles over time, you probably want to make sure old links will still work, and we don't currently provide a solution for detecting old links aside from Next.js built-in [support for redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects).

See [mapPageUrl](./lib/map-page-url.ts) and [getCanonicalPageId](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-canonical-page-id.ts) from for more details.

NOTE: if you have multiple pages in your workspace with the same slugified name, the app will throw an error letting you know that there are duplicate URL pathnames.

## Notes

- 修改`node_modules/`进行`patch`后，`vercel`需要重新`deploy`一下，否则会使用默认的依赖包，导致`patch`失败。

## License

MIT © 

This project based on [transitivebullsh.it](https://transitivebullsh.it).
