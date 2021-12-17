import React, { useState, useEffect, useRef } from 'react'
import format from 'comma-number'
import styles from './SimpleFeedback.module.css'

export function SimpleFeedback({ slug }) {
  const [helpful, setHelpful] = useState(null)
  const [count, setCount] = useState({ helpful: 0, unHelpful: 0 })

  const uuidRef = useRef(null)
  const mountedRef = useRef(null)
  const isDirtyRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true
    import('device-uuid').then((mod) => {
      const uuid = new mod.DeviceUUID().get()
      uuidRef.current = uuid
      syncFeedback(uuid)
    })

    return () => {
      mountedRef.current = false
    }
  }, [slug])

  function syncFeedback(uuid) {
    fetch(`/api/feedbacks/${slug}?uuid=${uuid}`)
      .then((res) => res.json())
      .then(
        ({ helpful: countHelpful, unHelpful: countNotHelpful, feedback }) => {
          if (!mountedRef.current) return

          const userFeedback =
            feedback === 'helpful'
              ? true
              : feedback === 'unHelpful'
              ? false
              : null

          if (userFeedback !== helpful) {
            setHelpful(userFeedback)
          }

          if (
            count.helpful !== countHelpful ||
            count.unHelpful !== countNotHelpful
          ) {
            setCount({ helpful: countHelpful, unHelpful: countNotHelpful })
          }
        }
      )
  }

  function sendFeedback(isHelpful) {
    // Do nothing if `sendFeedback` is still processing
    if (isDirtyRef.current) return

    // Add feedback or remove
    const prevState =
      helpful === true ? 'helpful' : helpful === false ? 'unHelpful' : null
    const newVal = helpful === isHelpful ? null : isHelpful

    setHelpful(newVal)

    // Optimistic update
    const newCount = { ...count }
    if (newVal === true) {
      newCount.helpful++
    } else if (newVal === false) {
      newCount.unHelpful++
    }

    if (prevState !== null) {
      newCount[prevState]--
    }
    setCount(newCount)

    isDirtyRef.current = true

    fetch(`/api/feedbacks/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: uuidRef.current,
        helpful: newVal,
        prevState: prevState
      })
    })
      .then(async () => {
        await syncFeedback(uuidRef.current)
      })
      .finally(() => {
        isDirtyRef.current = false
      })
  }

  return (
    <>
      <div className={styles.feedback}>
        <div className={styles['feedback-title']}>你觉得这篇文章怎么样？</div>
        <div className={styles['feedback-btns']}>
          <div
            className={styles['btn-item']}
            // onClick={() => sendFeedback(true)}
          >
            <img src='/feedback-awesome.gif' alt='' width='60px' />
            <div className={styles['btn-text']}>
              YYDS{' '}
              {helpful === null ||
                (count.helpful > 0 && `(${format(count.helpful)})`)}
            </div>
          </div>
          <div className={styles['btn-item']}>
            <img src='/feedback-fingerheart.gif' alt='' width='60px' />
            <div className={styles['btn-text']}>
              比心{' '}
              {helpful === null ||
                (count.helpful > 0 && `(${format(count.helpful)})`)}
            </div>
          </div>
          <div className={styles['btn-item']}>
            <img src='/feedback-cool.gif' alt='' width='60px' />
            <div className={styles['btn-text']}>
              酷{' '}
              {helpful === null ||
                (count.helpful > 0 && `(${format(count.helpful)})`)}
            </div>
          </div>

          <div
            className={styles['btn-item']}
            // onClick={() => sendFeedback(false)}
          >
            <img src='/feedback-comeon.gif' alt='' width='60px' />
            <div className={styles['btn-text']}>
              加油{' '}
              {helpful === null ||
                (count.unHelpful > 0 && `(${format(count.unHelpful)})`)}
            </div>
          </div>
          <div
            className={styles['btn-item']}
            // onClick={() => sendFeedback(false)}
          >
            <img src='/feedback-vegetabledog.gif' alt='' width='60px' />
            <div className={styles['btn-text']}>
              菜狗{' '}
              {helpful === null ||
                (count.unHelpful > 0 && `(${format(count.unHelpful)})`)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
