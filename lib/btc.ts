// Based on https://stackoverflow.com/questions/45667415/how-to-receive-bitcoin-payments-using-bitcoinjs-lib-in-node-js
export function subscribePaymentAtAddress(
  address: string,
  onPayment,
  onError = (err) => {}
) {
  const btcWS = new WebSocket('wss://ws.blockchain.info/inv')

  // NOTIFY ON ADDRESS UPDATE
  btcWS.onopen = () => {
    btcWS.send(JSON.stringify({ op: 'addr_sub', addr: address }))
    console.log('[INFO] btc connection opened')
  }

  // WE GOT AN UPDATE
  btcWS.onmessage = (msg) => {
    const response = JSON.parse(msg.data)
    const getOuts = response.x.out

    // LET'S CHECK THE OUTPUTS
    getOuts.map(function (out, i) {
      if (address == out.addr) {
        const amount = out.value
        const calAmount = amount / 100000000
        console.log('[INFO] amount received:', calAmount + ' BTC')
        onPayment(calAmount)
      }
    })
  }

  btcWS.onerror = (error) => {
    console.log('connection.onerror', error)
    onError(error)
  }

  return btcWS
}
