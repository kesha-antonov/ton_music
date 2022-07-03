import './App.css'
import Dashboard from './user-dashboard'
import React, { useLayoutEffect, useState, useCallback } from 'react'
import { authNapster } from './user-dashboard/requests'
import AppContext from './app-context'
import { API_KEY } from './consts'
import StartPage from './startPage/startpage'
import HeaderNotAuthorized from './header/Header'
import payments, { EVENTS as PAYMENTS_EVENTS } from './utils/payments'

const { Napster } = window

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true')
  const [token, setToken] = useState()
  const [fetching, setFetching] = useState(false)

  const [isPaymentsApiLoaded, setIsPaymentsApiLoaded] = useState(false)
  const [isFundsDepositing, setIsFundsDepositing] = useState(false)
  const [funds, setFunds] = useState(payments.depositedFunds)
  const [isFundsWithdrawning, setIsFundsWithdrawning] = useState(false)

  const onAuth = useCallback(() => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
  }, [])

  const onSignOut = useCallback(() => {
    localStorage.setItem('isLoggedIn', 'false')
    setIsLoggedIn(false)
  }, [])

  const initNapster = useCallback(async () => {
    Napster.init({ consumerKey: API_KEY, isHTML5Compatible: true })

    if (token || fetching) return

    try {
      setFetching(true)

      const result = await authNapster()

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
    console.log('handlePaymentsStateChange', eventName)
    switch (eventName) {
      case PAYMENTS_EVENTS.LOADED:
        setIsPaymentsApiLoaded(true)
        break
      case PAYMENTS_EVENTS.CHANGE_FUNDS_DEPOSITING:
        setIsFundsDepositing(payments.isDepositing)
        break
      case PAYMENTS_EVENTS.FUNDS_CHANGED:
        setFunds(payments.depositedFunds)
        break
      case PAYMENTS_EVENTS.CHANGE_FUNDS_WITHDRAWING:
        setIsFundsWithdrawning(payments.isWithdrawning)
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

  if (isLoggedIn) {
    return (
      <AppContext.Provider
        value={{
          token,
          isPaymentsApiLoaded,
          isFundsDepositing,
          isFundsWithdrawning,
          funds,
          onSignOut
        }}
      >
        <Dashboard />
      </AppContext.Provider>
    )
  }

  return (
    <div>
      <HeaderNotAuthorized onAuth={onAuth} />
      <StartPage />
    </div>
  )
}

export default App
