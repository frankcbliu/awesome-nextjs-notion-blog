import React from 'react'
import Head from 'next/head'
import * as Fathom from 'fathom-client'

export function ClientRedirect({ url }) {
  const domain = new URL(url).hostname

  React.useEffect(() => {
    Fathom.trackPageview()
  }, [])

  return (
    <>
      <Head>
        <title>Redirecting {domain}…</title>
        <meta http-equiv='refresh' content={`0; URL=${url}`} />
        <link rel='canonical' href={`${url}`} />
      </Head>
      <div
        style={{
          color: '#383838',
          fontFamily: "'Menlo', 'Monaco', Courier, monospace",
          fontSize: '0.8em',
          display: 'flex',
          height: '90vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Redirecting to {domain}…
      </div>
    </>
  )
}
