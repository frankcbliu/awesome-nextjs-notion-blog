import * as React from 'react'
import { SiGithub, SiWechat, SiNotion } from 'react-icons/si'
import { IoSunnyOutline, IoMoonSharp } from 'react-icons/io5'
import { RiCopyrightFill } from 'react-icons/ri'
import * as config from 'lib/config'
import { rootNotionPageId, copyRightFromYear } from 'site.config'
import { ViewCounter } from './ViewCounter'
import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const Footer: React.FC<{
  pageId: string
  isDarkMode: boolean
  toggleDarkMode: () => void
}> = ({ pageId, isDarkMode, toggleDarkMode }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const toggleDarkModeCb = React.useCallback(
    (e) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )
  const isRootPage = pageId === rootNotionPageId

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const author = `${config.author}`

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        <RiCopyrightFill /> {copyRightFromYear ? copyRightFromYear + ' - ' : ''}
        {new Date().getFullYear()} {'· ' + author + ' '}
        {isRootPage ? '· ' : ''}
        {isRootPage ? <ViewCounter slug={pageId} /> : ''}
      </div>

      {hasMounted ? (
        <div className={styles.settings}>
          <a
            className={styles.toggleDarkMode}
            onClick={toggleDarkModeCb}
            title='Tottle dark mode'
          >
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        </div>
      ) : null}

      <div className={styles.social}>
        {config.github && (
          <a
            className={styles.github}
            href={`https://github.com/${config.github}`}
            title={`GitHub @${config.github}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <span className={styles.tooltiptext}>@{config.github}</span>
            <SiGithub />
          </a>
        )}
        {config.wechatPublicName && (
          <a
            className={styles.wechatPublicName}
            href={`${config.wechatPublicURL}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <SiWechat />
            <span className={styles.tooltiptext}>
              公众号: {config.wechatPublicName}
            </span>
          </a>
        )}
        {config.notionPublic && (
          <a
            className={styles.notionPublic}
            href={`${config.notionPublic}`}
            title='通过 Notion 打开'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SiNotion />
            <span className={styles.tooltiptext}>从 Notion 打开</span>
          </a>
        )}
      </div>
    </footer>
  )
}
