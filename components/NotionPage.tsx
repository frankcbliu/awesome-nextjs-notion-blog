import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'
import useDarkMode from 'use-dark-mode'
import { PageBlock } from 'notion-types'
import { FiBarChart2 } from 'react-icons/fi'
import ColorThief from 'colorthief'

import { Tweet, TwitterContextProvider } from 'react-static-tweets'

// core notion renderer
import { NotionRenderer, Code, Collection, CollectionRow } from 'react-notion-x'

// utils
import { getBlockTitle } from 'notion-utils'
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { getPageDescription } from 'lib/get-page-description'
import { getPageTweet } from 'lib/get-page-tweet'
import { searchNotion } from 'lib/search-notion'
import * as types from 'lib/types'
import * as config from 'lib/config'

// components
import { CustomFont } from './CustomFont'
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageHead } from './PageHead'
import { PageActions } from './PageActions'
import { Footer } from './Footer'
import { PageSocial } from './PageSocial'
import { GitHubShareButton } from './GitHubShareButton'
import { ReactUtterances } from './ReactUtterances'
import { ViewCounter } from './ViewCounter'
import { SimpleFeedback } from './SimpleFeedback'

import styles from './styles.module.css'

// const Code = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.Code)
// )
//
// const Collection = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.Collection)
// )
//
// const CollectionRow = dynamic(
//   () => import('react-notion-x').then((notion) => notion.CollectionRow),
//   {
//     ssr: false
//   }
// )

const Equation = dynamic(() =>
  import('react-notion-x').then((notion) => notion.Equation)
)

// we're now using a much lighter-weight tweet renderer react-static-tweets
// instead of the official iframe-based embed widget from twitter
// const Tweet = dynamic(() => import('react-tweet-embed'))

const Modal = dynamic(
  () => import('react-notion-x').then((notion) => notion.Modal),
  { ssr: false }
)

function getEmojiUrl(emoji) {
  const hex = emoji.codePointAt(0).toString(16)
  return `https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/${hex}.svg`
}

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const router = useRouter()
  const lite = useSearchParam('lite')

  const params: any = {}
  if (lite) params.lite = lite

  // lite mode is for oembed
  const isLiteMode = lite === 'true'
  const searchParams = new URLSearchParams(params)

  const darkMode = useDarkMode(false, { classNameDark: 'dark-mode' })

  React.useEffect(() => {
    const breadcrumb = document.querySelector('.breadcrumb.active')
    if (!breadcrumb) return

    // Trigger scroll on breadcrumb click. Scroll to bottom if
    // window is at top. Else, scroll to top.
    breadcrumb.addEventListener('click', () => {
      if (window.scrollY === 0) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        ;(breadcrumb as any).setAttribute('title', 'Scroll to top')
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        ;(breadcrumb as any).setAttribute('title', 'Scroll to bottom')
      }
    })
    ;(breadcrumb as any).style.cursor = 'pointer'

    // Update background color for cover image
    matchBackgroundColorWithCover()
  }, [router.isFallback])

  function matchBackgroundColorWithCover() {
    const colorThief = new ColorThief()
    const img = document.querySelector(
      '.lazy-image-wrapper img:not([width="1500"]):not([src*="//images.unsplash.com"])'
    ) as any

    // Do nothing if page has no cover image
    if (!img) return

    function updateColor(color: string[]) {
      img.closest('div').style.backgroundColor = `rgb(${color.join(',')})`
    }

    if (img.complete) {
      updateColor(colorThief.getColor(img))
    } else {
      img.addEventListener('load', () => {
        updateColor(colorThief.getColor(img))
      })
    }
  }

  if (router.isFallback) {
    return <Loading />
  }

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  if (error || !site || !keys.length || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  // Uncomment to debug
  // console.log('notion page', {
  //   isDev: config.isDev,
  //   title,
  //   pageId,
  //   rootNotionPageId: site.rootNotionPageId,
  //   recordMap
  // })

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams)

  const pageUrl = getCanonicalPageUrl(site, recordMap)(pageId)
  const canonicalPageUrl = !config.isDev && pageUrl
  // const slug = new URL(pageUrl).pathname.substr(1).replace(`-${pageId}`, '')
  const slug = new URL(pageUrl).pathname.substring(1)

  // const isRootPage =
  //   parsePageId(block.id) === parsePageId(site.rootNotionPageId)
  // 对正常的页面和博客页面打开评论
  const isBlogPost =
    block.type === 'page' &&
    (block.parent_table === 'block' || block.parent_table === 'collection')
  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  let socialImage = mapNotionImageUrl(
    (block as PageBlock).format?.page_cover || config.defaultPageCover,
    block
  )

  // Use dynamic og image based on page title and icon
  if (!socialImage) {
    const text = router.asPath === '/' ? site.domain : encodeURIComponent(title)
    let pageIcon = (block.format as any).pageIcon || 'NO_IMAGE'
    if (pageIcon.startsWith('http')) {
      // Fallback to NO_IMAGE if pageIcon is not emoji
      pageIcon = 'NO_IMAGE'
    } else {
      // Convert emoji to svg url
      pageIcon = getEmojiUrl(pageIcon)
    }
    socialImage = `https://og-image.wzulfikar.com/i/**${text}**.png?theme=dark&md=1&fontSize=125px&images=${pageIcon}`
  }

  const socialDescription =
    getPageDescription(block, recordMap) ?? config.description

  let comments: React.ReactNode = null
  let pageAside: React.ReactChild = null

  // only display comments and page actions on blog post pages
  if (isBlogPost) {
    if (config.utterancesGitHubRepo) {
      comments = (
        <>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              marginTop: '2rem'
            }}
          >
            <SimpleFeedback slug={slug} />
          </div>

          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiBarChart2 style={{ marginRight: 3, marginBottom: 2 }} />
            <ViewCounter slug={slug} />
          </div>
          <ReactUtterances
            repo={config.utterancesGitHubRepo}
            label={config.utterancesGitHubLabel}
            issueMap='issue-term'
            issueTerm='title'
            theme={darkMode.value ? 'photon-dark' : 'github-light'}
          />
        </>
      )
    }

    const tweet = getPageTweet(block, recordMap)
    if (tweet) {
      pageAside = <PageActions tweet={tweet} />
    }
  } else {
    if (config.showPageAsideSocials) {
      pageAside = <PageSocial />
    }
  }

  return (
    <TwitterContextProvider
      value={{
        tweetAstMap: (recordMap as any).tweetAstMap || {},
        swrOptions: {
          fetcher: (id) =>
            fetch(`/api/get-tweet-ast/${id}`).then((r) => r.json())
        }
      }}
    >
      <PageHead site={site} />
      <Head>
        <meta property='og:title' content={title} />
        <meta property='og:site_name' content={site.name} />

        <meta name='twitter:title' content={title} />
        <meta property='twitter:domain' content={site.domain} />

        {config.twitter && (
          <meta name='twitter:creator' content={`@${config.twitter}`} />
        )}

        {socialDescription && (
          <>
            <meta name='description' content={socialDescription} />
            <meta property='og:description' content={socialDescription} />
            <meta name='twitter:description' content={socialDescription} />
          </>
        )}

        {socialImage ? (
          <>
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:image' content={socialImage} />
            <meta property='og:image' content={socialImage} />
          </>
        ) : (
          <meta name='twitter:card' content='summary' />
        )}

        {canonicalPageUrl && (
          <>
            <link rel='canonical' href={canonicalPageUrl} />
            <meta property='og:url' content={canonicalPageUrl} />
            <meta property='twitter:url' content={canonicalPageUrl} />
          </>
        )}

        <title>{title}</title>
      </Head>
      <CustomFont site={site} />
      {isLiteMode && <BodyClassName className='notion-lite' />}
      <NotionRenderer
        bodyClassName={cs(
          styles.notion,
          pageId === site.rootNotionPageId && 'index-page'
        )}
        components={{
          pageLink: ({
            href,
            as,
            passHref,
            prefetch,
            replace,
            scroll,
            shallow,
            locale,
            ...props
          }) => (
            <Link
              href={href}
              as={as}
              passHref={passHref}
              prefetch={prefetch}
              replace={replace}
              scroll={scroll}
              shallow={shallow}
              locale={locale}
            >
              <a {...props} />
            </Link>
          ),
          code: Code,
          collection: Collection,
          collectionRow: CollectionRow,
          tweet: Tweet,
          modal: Modal,
          equation: Equation
        }}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        fullPage={!isLiteMode}
        darkMode={darkMode.value}
        previewImages={site.previewImages !== false}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapNotionImageUrl}
        searchNotion={searchNotion}
        pageFooter={comments}
        pageAside={pageAside}
        footer={
          <Footer
            pageId={pageId}
            isDarkMode={darkMode.value}
            toggleDarkMode={darkMode.toggle}
          />
        }
      />
      {config.showGithubRibbon && <GitHubShareButton />}
    </TwitterContextProvider>
  )
}
