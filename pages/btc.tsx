import { useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import QRCode from 'qrcode.react'
import { useCopyToClipboard } from 'react-use'
import SnackbarProvider, { useSnackbar } from 'react-simple-snackbar'

import { domain, twitter } from 'lib/config'
import { subscribePaymentAtAddress } from 'lib/btc'

function Btc({ address }) {
  const ref = useRef(null)
  const [_, copyToClipboard] = useCopyToClipboard()

  const [openSnackbar] = useSnackbar({
    style: { backgroundColor: 'white', color: '#1b1e21' },
    closeStyle: {
      color: '#1b1e21'
    }
  })

  useEffect(() => {
    const snackbarDuration = 8000
    const ws = subscribePaymentAtAddress(address, (amount) => {
      openSnackbar('Payment received: ' + amount, snackbarDuration)
    })

    return () => {
      ws.close()
    }
  }, [])

  function onClick() {
    copyToClipboard(address)

    // Return early if user recently copied
    // the address to prevent multiple setTimeout
    if (ref.current.dataset.isCopying === 'true') return

    const originalText = ref.current.innerText

    setTimeout(() => {
      ref.current.innerText = originalText
      ref.current.dataset.isCopying = false
    }, 1500)

    ref.current.innerText = 'address copied!'
    ref.current.dataset.isCopying = true
  }

  const title = `Send BTC to ${twitter}`
  const pageUrl = `https://${domain}/btc`
  const socialImage =
    'https://og-image.wzulfikar.com/https%3A%2F%2Fwzulfikar.com%2Fbtc.png?&template=webshot'

  return (
    <>
      <Head>
        <meta property='og:title' content={title} />
        <meta property='og:site_name' content={domain} />

        <meta name='twitter:title' content={title} />
        <meta property='twitter:domain' content={domain} />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:image' content={socialImage} />
        <meta property='og:image' content={socialImage} />

        <link rel='canonical' href={pageUrl} />
        <meta property='og:url' content={pageUrl} />
        <meta property='twitter:url' content={pageUrl} />
      </Head>
      <style jsx>
        {`
          @media only screen and (max-width: 600px) {
            .container {
              padding-bottom: 4rem;
            }
          }
          .container {
            display: grid;
            place-content: center;
            background: #1b1e21;
            color: white;
            height: 100vh;
            font-family: monospace;
            touch-action: none;
          }
          .title {
            margin: auto;
            padding-bottom: 10px;
          }
          .qrcode {
            margin: auto;
            padding: 8px 8px 5px 8px;
            background: white;
            cursor: pointer;
          }
          .address {
            padding-top: 8px;
            font-size: 11px;
            cursor: pointer;
          }
          .button-primary {
            background: transparent;
            border: 1px solid white;
            margin-top: 1rem;
            padding: 3px;
            font-family: monospace;
            color: white;
            text-transform: uppercase;
            font-size: 11px;
            cursor: pointer;
          }
          .button-secondary {
            display: flex;
            background: transparent;
            margin-top: 0.5rem;
            margin-left: auto;
            margin-right: auto;
            font-family: monospace;
            color: white;
            text-decoration: underline;
            text-transform: uppercase;
            font-size: 11px;
          }
        `}
      </style>
      <div className='container'>
        <div className='title'>{title}</div>

        <div className='qrcode' onClick={onClick}>
          <QRCode size={210} value={address} />
        </div>
        <div className='address' onClick={onClick}>
          {address}
        </div>
        <button ref={ref} onClick={onClick} className='button-primary'>
          copy address
        </button>

        <Link href='/'>
          <a className='button-secondary'>&larr; back to home</a>
        </Link>
      </div>
    </>
  )
}

export default function BtcWithSnackbar(props) {
  return (
    <SnackbarProvider>
      <Btc {...props} />
    </SnackbarProvider>
  )
}

export function getStaticProps() {
  const btcAddresses = (process.env.BTC_ADDRESSES || '').split('-')
  const randomInt = Math.floor(Math.random() * btcAddresses.length + 0)

  // Get random address
  const address = btcAddresses.length ? btcAddresses[randomInt] : null

  return {
    props: {
      address: address
    },
    revalidate: 1
  }
}
