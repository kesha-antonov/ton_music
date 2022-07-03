import './App.css'
import Dashboard from './user-dashboard'
import React, { useLayoutEffect, useState, useCallback } from 'react'
import { authNapster } from './user-dashboard/requests'
import AppContext from './app-context'
import { API_KEY } from './consts'
import payments, { EVENTS as PAYMENTS_EVENTS } from 'utils/payments'

const { Napster } = window

function App () {
  const [token, setToken] = useState({ token: null })
  const [fetching, setFetching] = useState(false)

  const [isPaymentsApiLoaded, setIsPaymentsApiLoaded] = useState(false)
  const [isFundsDeposited, setIsFundsDeposited] = useState(false)
  const [funds, setFunds] = useState(payments.depositedFunds)
  const [isWithdrawn, setIsWithdrawn] = useState(true)

  const initNapster = useCallback(() => {
    Napster.init({ consumerKey: API_KEY, isHTML5Compatible: true })

    if (token || fetching) return

    setFetching(true)
    authNapster().then((result) => {
      console.log(result)

      Napster.player.on('ready', () => {
        Napster.member.set({
          accessToken: result.access_token,
          refreshToken: result.refresh_token
        })
      })

      setToken({ token: result.access_token })
      setFetching(false)
    })
      .catch(() => setFetching(false))
  }, [token, fetching])

  const handlePaymentsStateChange = useCallback(eventName => {
    switch (eventName) {
      case PAYMENTS_EVENTS.LOADED:
        setIsPaymentsApiLoaded(true)
        return
      case PAYMENTS_EVENTS.FUNDS_DEPOSITED:
        setIsFundsDeposited(true)
        return
      case PAYMENTS_EVENTS.FUNDS_CHANGED:
        setFunds(payments.depositedFunds)
        return
      case PAYMENTS_EVENTS.WITHDRAW_COMPLETED:
        setIsWithdrawn(true)
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
