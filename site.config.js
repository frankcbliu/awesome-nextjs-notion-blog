module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '4dd6b43e01e34265ac05a97b8da6bc95',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: '王云子',
  domain: 'index.wangyunzi.com',
  author: '王云子',

  // open graph metadata (optional)
  description: '此路山高路远，我只剩玫瑰一片',
  socialImageTitle: '长街短梦',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  twitter: 'YunziWang',
  github: 'wangyunzi',
  wechatPublicName: '王云子',
  // wechatPublicURL: 'https://mp.weixin.qq.com/s?__biz=MzkxMzIyOTI1Mg==&mid=2247486027&idx=1&sn=2840f0b8cfdc982b9095dd18ec9892e5',
  notionPublic: 'https://www.notion.so/wangyunzi/Yunzi-Wang-s-Home-4dd6b43e01e34265ac05a97b8da6bc95?pvs=4',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  // imageCDNHost: 'https://blog.wangyunzi.com',

  // Utteranc.es comments via GitHub issue comments (optional)
  utterancesGitHubRepo: 'frankcbliu/awesome-nextjs-notion-blog',
  utterancesGitHubLabel: '博客评论',

  // whether or not to enable support for LQIP preview images (optional)
  // NOTE: this requires you to set up Google Firebase and add the environment
  // variables specified in .env.example
  isPreviewImageSupportEnabled: false,

  // set null to remove from year
  copyRightFromYear: 2022,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  pageUrlOverrides: {
    '/os': 'ff8a4877c04f42eda0d050547c117ea5',
    '/os-introduction': '68390e1112d749debb748387a82ebd9f',
    '/create-notion-blog': 'Notion-40362e4b8973491bbbc147237f1e9227',
    '/create-vuepress-blog': 'vuepress-github-pagegitee-e4c85fe845104c5aa004a19df445f29e',
    '/c++': 'c-6cfc812927c44a688e874d6212265b30',
    '/java': 'java-a0975c0ad4fb473ca8c2a803a7813a4d',
    '/i-am-cai-bing-tong-xue': '8f65e44b7a5a47788fdcc8dde9522bfa',
    '/redis': 'redis-df0a05f97c9a462e83a3ecf5d0066578',
    '/common-question': '8ea9f59839d04750b08fa7e13045ab08',
    '/how-git-work': 'Git-c3260ebf0ad04d9d8d2081bf1f3bf2b8',
    '/algorithm-sort': '7f7769466b5847dab94716dc0d9c1ac4',
    '/algorithm-sort-js' : 'JavaScript-f5b50f39a66645ec97dcd409497ed2a9',
    '/algorithm-binary-tree-traversal' :'07df0ddf43664a758fb4725070b71854',
    '/network': '926b875211b44f978d39200f8d39ef1d',
    '/database': '337b1694b9344af9a424136b87827ad3',
    '/advanced-algorithm': '854a54c0567944488842e3f01faf6ab3',
    '/frontend': '83dc1ec0083a4bdfbe7d3ac6a5b07664',
    '/post-list': '651765de6a0f4a729f9186f26381aef3',
    '/one-year-review': 'c6461186bea149eb9a83c0d7284f2921',
  },
  showPageAsideSocials: true,
  footCounterList: [
    '6a76fdd9ec6d4ae2855aa790d620eec4',
    '651765de-6a0f-4a72-9f91-86f26381aef3'
  ]
}
