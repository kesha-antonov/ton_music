import './App.css'
import Dashboard from './user-dashboard'
import React, { useLayoutEffect, useState, useCallback } from 'react'
import { authNapster } from './user-dashboard/requests'
import AppContext from './app-context'
import { API_KEY } from './consts'

// import { Buffer } from 'buffer'
//
import payments, { EVENTS as PAYMENTS_EVENTS } from './utils/payments'
// window.Buffer = Buffer

const { Napster } = window

function App () {
  const [token, setToken] = useState()
  const [fetching, setFetching] = useState(false)

  const [isPaymentsApiLoaded, setIsPaymentsApiLoaded] = useState(false)
  const [isFundsDeposited, setIsFundsDeposited] = useState(false)
  const [funds, setFunds] = useState(payments.depositedFunds)
  const [isWithdrawn, setIsWithdrawn] = useState(true)

  const initNapster = useCallback(async () => {
    Napster.init({ consumerKey: API_KEY, isHTML5Compatible: true })

    if (token || fetching) return

    try {
      setFetching(true)

      const result = await authNapster()
      console.log(result)

      Napster.player.on('ready', () => {
        Napster.member.set({
          accessToken: result.access_token,
          refreshToken: result.refresh_token
        })
      })

      setToken(result.access_token)
      setFetching(false)
    } catch (e) {
      setFetching(false)
      console.warn('initNapster e', e)
    }
  }, [token, fetching])

  const handlePaymentsStateChange = useCallback(eventName => {
    switch (eventName) {
      case PAYMENTS_EVENTS.LOADED:
        setIsPaymentsApiLoaded(true)
        break
      case PAYMENTS_EVENTS.FUNDS_DEPOSITED:
        setIsFundsDeposited(true)
        break
      case PAYMENTS_EVENTS.FUNDS_CHANGED:
        setFunds(payments.depositedFunds)
        break
      case PAYMENTS_EVENTS.WITHDRAW_COMPLETED:
        setIsWithdrawn(true)
        break
    }
  }, [])

  useLayoutEffect(() => {
    initNapster()
    const removePaymentsEventListener = payments.addEventListener(handlePaymentsStateChange)

    return () => {
      removePaymentsEventListener()
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        token,
        isPaymentsApiLoaded,
        isFundsDeposited,
        funds,
        isWithdrawn
      }}
    >
      <Dashboard />
    </AppContext.Provider>
  )
}

export default App
