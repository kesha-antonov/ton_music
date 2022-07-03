// TonWeb is JavaScript SDK (Web and NodeJS) for TON

import { encode as base64Encode } from 'js-base64'
import constants from './constants.js'
import TonWeb from 'tonweb'
const tonMnemonic = require('tonweb-mnemonic')

console.log('TonWeb.payments.PaymentChannel.STATE_OPEN', TonWeb.payments.PaymentChannel.STATE_OPEN)
console.log('TonWeb.payments.PaymentChannel', TonWeb.payments.PaymentChannel)

// For calculations in the blockchain, we use BigNumber (BN.js). https://github.com/indutny/bn.js
// Don't use regular {Number} for coins, etc., it has not enough size and there will be loss of accuracy.

const BN = TonWeb.utils.BN

// Blockchain does not operate with fractional numbers like `0.5`.
// `toNano` function converts TON to nanoton - smallest unit.
// 1 TON = 10^9 nanoton 1 nanoton = 0.000000001 TON
// So 0.5 TON is 500000000 nanoton

const toNano = TonWeb.utils.toNano

const payments = {
  isInited: false,
  init: async () => {
    // const mn = await tonMnemonic.generateMnemonic()
    // console.log('mn', mn)
    // const res = await tonMnemonic.validateMnemonic([
    //   // 'wet',    'polar',  'exit',
    //   // 'armor',  'couple', 'brisk',
    //   // 'reform', 'cabin',  'figure',
    //   // 'clap',   'reduce', 'slow',
    //   // 'blue',   'pave',   'direct',
    //   // 'foil',   'head',   'scan',
    //   // 'uncle',  'ghost',  'adapt',
    //   // 'casino', 'style',  'genre',
    //   'client',
    //   '12345',
    //   'account',
    //   'lick',
    //   'breakable',
    //   'rabbits',
    //   'suggestion',
    //   'income',
    //   'jittery',
    //   'bumpy',
    //   'sophisticated',
    //   'bored',
    //   'growth',
    //   'snakes',
    //   'defeated',
    //   'brainy',
    //   'past',
    //   'high-pitched',
    //   'cook',
    //   'unlock',
    //   'spiders',
    //   'military',
    //   'glib',
    //   'can',
    // ])
    // console.log('res', res)

    // const mnemonic = [
    //   'client',
    //   '12345',
    //   'account',
    //   'lick',
    //   'breakable',
    //   'rabbits',
    //   'suggestion',
    //   'income',
    //   'jittery',
    //   'bumpy',
    //   'sophisticated',
    //   'bored',
    //   'growth',
    //   'snakes',
    //   'defeated',
    //   'brainy',
    //   'past',
    //   'high-pitched',
    //   'cook',
    //   'unlock',
    //   'spiders',
    //   'military',
    //   'glib',
    //   'can',
    // ]

    // let res = await tonMnemonic.mnemonicToSeed(mnemonic)
    // console.log('res-1', res)
    // res = base64Encode(mnemonic)
    // console.log('res-2', res)
    //
    // return

    if (payments.isInited) { return }


    payments.isInited = true
    const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC' // TON HTTP API url. Use payments url for testnet
    const apiKey = '548c689e9e921c80194a974bfcd015ffecba5dbf5493c4685bb93700d618dc7b' // Obtain your API key in https://t.me/tontestnetapibot
    payments.tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, { apiKey })) // Initialize TON SDK

    // ----------------------------------------------------------------------
    // PARTIES
    // The payment channel is established between two participants A and B.
    // Each has own secret key, which he does not reveal to the other.

    // New secret key can be generated by `tonweb.utils.newSeed()`
    payments.tonweb.utils.newSeed() // Uint8Array

    payments.clientId = localStorage.getItem('clientId')
    if (!payments.clientId) {
      payments.clientId = '12345'
      // TODO: USE LATER - FOR NOW LEAVE 2 SPECIFIC WALLETS.
      // payments.clientId = (new Date()).getTime().toString()
      localStorage.setItem('clientId', payments.clientId)
    }
    const seedClient = await tonMnemonic.mnemonicToSeed([
      'client',
      payments.clientId,
      'account',
      'lick',
      'breakable',
      'rabbits',
      'suggestion',
      'income',
      'jittery',
      'bumpy',
      'sophisticated',
      'bored',
      'growth',
      'snakes',
      'defeated',
      'brainy',
      'past',
      'high-pitched',
      'cook',
      'unlock',
      'spiders',
      'military',
      'glib',
      'can',
    ])

    // const seedClient = TonWeb.utils.base64ToBytes(seedClientBase64) // A's private (secret) key
    payments.keyPairClient = payments.tonweb.utils.keyPairFromSeed(seedClient) // Obtain key pair (public key and private key)

    // const seedService = TonWeb.utils.base64ToBytes(constants.seedServiceBase64) // B's private (secret) key
    const seedService = await tonMnemonic.mnemonicToSeed(constants.seedService)
    payments.keyPairService = payments.tonweb.utils.keyPairFromSeed(seedService) // Obtain key pair (public key and private key)

    // if you are new to cryptography then the public key is like a login, and the private key is like a password.
    // Login can be shared with anyone, password cannot be shared with anyone.

    // With a key pair, you can create a wallet.
    // Note that payments is just an object, we are not deploying anything to the blockchain yet.
    // Transfer some amount of test coins to payments wallet address (from your wallet app).
    // To check you can use blockchain explorer https://testnet.tonscan.org/address/<WALLET_ADDRESS>

    payments.walletClient = payments.tonweb.wallet.create({
      publicKey: payments.keyPairClient.publicKey
    })
    payments.walletAddressClient = await payments.walletClient.getAddress() // address of payments wallet in blockchain
    console.log('walletAddressClient = ', payments.walletAddressClient.toString(true, true, true))

    payments.walletSerice = payments.tonweb.wallet.create({
      publicKey: payments.keyPairService.publicKey
    })
    payments.walletAddressService = await payments.walletSerice.getAddress() // address of payments wallet in blockchain
    console.log('walletAddressService = ', payments.walletAddressService.toString(true, true, true))
  },
  // на вход принимает сколько хочешь внести тонов
  depositFunds: async tonsToDeposit => {
    // ----------------------------------------------------------------------
    // PREPARE PAYMENT CHANNEL

    // The parties agree on the configuration of the payment channel.
    // They share information about the payment channel ID, their public keys, their wallet addresses for withdrawing coins, initial balances.
    // They share payments information off-chain, for example via a websocket.

    const channelInitState = {
      balanceA: toNano(tonsToDeposit.toString()), // A's initial balance in Toncoins. Next A will need to make a top-up for payments amount
      balanceB: toNano('0'), // B's initial balance in Toncoins. Next B will need to make a top-up for payments amount
      seqnoA: new BN(0), // initially 0
      seqnoB: new BN(0) // initially 0
    }
    console.log('channelInitState-1', channelInitState)
    console.log('channelInitState-2', channelInitState.balanceA.toString())
    console.log('channelInitState-3', channelInitState.balanceB.toString())

    const channelConfig = {
      channelId: new BN(12345 + 9), // Channel ID, for each new channel there must be a new ID
      addressA: payments.walletAddressClient, // A's funds will be withdrawn to payments wallet address after the channel is closed
      addressB: payments.walletAddressService, // B's funds will be withdrawn to payments wallet address after the channel is closed
      initBalanceA: channelInitState.balanceA,
      initBalanceB: channelInitState.balanceB
    }
    console.log('channelConfig-1', channelConfig)
    console.log('channelConfig-2', channelConfig.initBalanceA.toString())
    console.log('channelConfig-3', channelConfig.initBalanceB.toString())
    console.log('channelConfig-4', channelConfig.channelId.toString())

    // Each on their side creates a payment channel object with payments configuration

    payments.channelClient = payments.tonweb.payments.createChannel({
      ...channelConfig,
      isA: true,
      myKeyPair: payments.keyPairClient,
      hisPublicKey: payments.keyPairService.publicKey
    })
    const channelAddress = await payments.channelClient.getAddress() // address of payments payment channel smart-contract in blockchain
    console.log('channelAddress=', channelAddress.toString(true, true, true))

    payments.channelService = payments.tonweb.payments.createChannel({
      ...channelConfig,
      isA: false,
      myKeyPair: payments.keyPairService,
      hisPublicKey: payments.keyPairClient.publicKey
    })

    if ((await payments.channelService.getAddress()).toString() !== channelAddress.toString()) {
      throw new Error('Channels address not same')
    }

    // Interaction with the smart contract of the payment channel is carried out by sending messages from the wallet to it.
    // So let's create helpers for such sends.

    payments.fromWalletClient = payments.channelClient.fromWallet({
      wallet: payments.walletClient,
      secretKey: payments.keyPairClient.secretKey
    })

    payments.fromWalletService = payments.channelService.fromWallet({
      wallet: payments.walletSerice,
      secretKey: payments.keyPairService.secretKey
    })

    // ----------------------------------------------------------------------
    // NOTE:
    // Further we will interact with the blockchain.
    // After each interaction with the blockchain, we need to wait for execution. In the TON blockchain, payments is usually about 5 seconds.
    // In payments example, the interaction code happens right after each other - that won't work.
    // To study the example, you can put a `return` after each send.
    // In a real application, you will need to check that the smart contract of the channel has changed
    // (for example, by calling its get-method and checking the `state`) and only then do the following action.

    async function waitToFinishTransaction () {
      // console.log('waitToFinishTransaction-1')
      // while (await payments.channelClient.getChannelState() === 0) {
      for (let i = 0; i < 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 10))
        // console.log('waitToFinishTransaction-2', new Date)

        console.log('waitToFinishTransaction-1', await payments.channelClient.getData())
        console.log('waitToFinishTransaction-2', await payments.channelService.getData())

        // let channelClient = payments.tonweb.payments.createChannel({
        //   ...channelConfig,
        //   isA: true,
        //   myKeyPair: payments.keyPairClient,
        //   hisPublicKey: payments.keyPairService.publicKey
        // })
        // console.log('channel-3', await channelClient.getChannelState())

        // console.log('channel-2', await payments.channelService.getChannelState())
        // const data = await payments.channelClient.getData()
        // console.log('data = ', data)
        // console.log('balanceA = ', data.balanceA.toString())
        // console.log('balanceB = ', data.balanceB.toString())
      }
    }

    // ----------------------------------------------------------------------
    // DEPLOY PAYMENT CHANNEL FROM WALLET A

    // Wallet A must have a balance.
    // 0.05 TON is the amount to execute payments transaction on the blockchain. The unused portion will be returned.
    // After payments action, a smart contract of our payment channel will be created in the blockchain.

    console.log('depositFunds-1')
    await payments.fromWalletClient.deploy().send(toNano('0.05'))
    console.log('depositFunds-2')

    let isChannelDeployed = false
    while (!isChannelDeployed) {
      await new Promise(resolve => setTimeout(resolve, 100))
      try {
        const data = await payments.channelClient.getData()
        isChannelDeployed = data.channelId?.toString() === channelConfig.channelId.toString()
      } catch (e) {
        console.log('check isChannelDeployed e', e)
      }
    }

    // await new Promise(resolve => setTimeout(resolve, 10 * 1000))
    // await waitToFinishTransaction()

    // To check you can use blockchain explorer https://testnet.tonscan.org/address/<CHANNEL_ADDRESS>
    // We can also call get methods on the channel (it's free) to get its current data.


    // TOP UP

    // Now each parties must send their initial balance from the wallet to the channel contract.

    console.log('depositFunds-3')
    await payments.fromWalletClient
      .topUp({ coinsA: channelInitState.balanceA, coinsB: toNano('0') })
      .send(channelInitState.balanceA.add(toNano('0.05'))) // +0.05 TON to network fees
    console.log('depositFunds-4')

    while ((await payments.channelClient.getData()).balanceA < channelInitState.balanceA) {
      console.log('depositFunds-4-1')
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // await waitToFinishTransaction()

    // NO NEED TO TOPUP SERVICE

    // await payments.fromWalletService
    //   .topUp({ coinsA: new BN(0), coinsB: channelInitState.balanceB })
    //   .send(channelInitState.balanceB.add(toNano('0.05'))) // +0.05 TON to network fees
    // await new Promise(resolve => setTimeout(resolve, 10 * 1000))

    // await waitToFinishTransaction()

    // to check, call the get method - the balances should change

    // INIT

    // After everyone has done top-up, we can initialize the channel from any wallet

    console.log('depositFunds-5')
    await payments.fromWalletClient.init(channelInitState).send(toNano('0.05'))
    // await payments.fromWalletService.init(channelInitState).send(toNano('0.05'))
    // await waitToFinishTransaction()

    console.log('depositFunds-6')
    while (await payments.channelClient.getChannelState() !== TonWeb.payments.PaymentChannel.STATE_OPEN) {
      await new Promise(resolve => setTimeout(resolve, 10))
      // console.log('waitToFinishTransaction-2', new Date)

      const data = await payments.channelClient.getData()
      console.log('channel-1', data)
      console.log('channel-1', data.balanceA.toString())
      console.log('channel-1', data.balanceB.toString())
      console.log('channel-1', data.channelId.toString())
      // console.log('channel-2', await payments.channelService.getChannelState())
    }

    return true
    // to check, call the get method - `state` should change to `TonWeb.payments.PaymentChannel.STATE_OPEN`
  },
  // рассчитывает сколько потрачено трафика в тонах: size * tonsPerKb и переводит тоны в смарт-контракте в сторону TM
  payForListening: async kb => {
    // ----------------------------------------------------------------------
    // FIRST OFFCHAIN TRANSFER - A sends 0.1 TON to B

    // A creates new state - subtracts 0.1 from A's balance, adds 0.1 to B's balance, increases A's seqno by 1

    payments.lastChannelState = {
      balanceA: toNano('0.9'),
      balanceB: toNano('2.1'),
      seqnoA: new BN(1),
      seqnoB: new BN(0)
    }

    // A signs payments state and send signed state to B (e.g. via websocket)

    const signatureA1 = await payments.channelClient.signState(payments.lastChannelState)

    // B checks that the state is changed according to the rules, signs payments state, send signed state to A (e.g. via websocket)

    if (!(await payments.channelService.verifyState(payments.lastChannelState, signatureA1))) {
      throw new Error('Invalid A signature')
    }
    const signatureB1 = await payments.channelService.signState(payments.lastChannelState)

    // ----------------------------------------------------------------------
    // SECOND OFFCHAIN TRANSFER - A sends 0.2 TON to B

    // A creates new state - subtracts 0.2 from A's balance, adds 0.2 to B's balance, increases A's seqno by 1

    payments.lastChannelState = {
      balanceA: toNano('0.7'),
      balanceB: toNano('2.3'),
      seqnoA: new BN(2),
      seqnoB: new BN(0)
    }

    // A signs payments state and send signed state to B (e.g. via websocket)

    const signatureA2 = await payments.channelClient.signState(payments.lastChannelState)

    // B checks that the state is changed according to the rules, signs payments state, send signed state to A (e.g. via websocket)

    if (!(await payments.channelService.verifyState(payments.lastChannelState, signatureA2))) {
      throw new Error('Invalid A signature')
    }
    const signatureB2 = await payments.channelService.signState(payments.lastChannelState)

    // ----------------------------------------------------------------------
    // THIRD OFFCHAIN TRANSFER - B sends 1.1 TON TO A

    // B creates new state - subtracts 1.1 from B's balance, adds 1.1 to A's balance, increases B's seqno by 1

    payments.lastChannelState = {
      balanceA: toNano('1.8'),
      balanceB: toNano('1.2'),
      seqnoA: new BN(2),
      seqnoB: new BN(1)
    }

    // B signs payments state and send signed state to A (e.g. via websocket)

    const signatureB3 = await payments.channelService.signState(payments.lastChannelState)

    // A checks that the state is changed according to the rules, signs payments state, send signed state to B (e.g. via websocket)

    if (!(await payments.channelClient.verifyState(payments.lastChannelState, signatureB3))) {
      throw new Error('Invalid B signature')
    }
    const signatureA3 = await payments.channelClient.signState(payments.lastChannelState)

    // ----------------------------------------------------------------------
    // So they can do payments endlessly.
    // Note that a party can make its transfers (from itself to another) asynchronously without waiting for the action of the other side.
    // Party must increase its seqno by 1 for each of its transfers and indicate the last seqno and balance of the other party that it knows.
  },
  // возвращает оставшиеся монеты на кошелек
  withdrawFunds: async () => {
    // ----------------------------------------------------------------------
    // CLOSE PAYMENT CHANNEL

    // The parties decide to end the transfer session.
    // If one of the parties disagrees or is not available, then the payment channel can be emergency terminated using the last signed state.
    // That is why the parties send signed states to each other off-chain.
    // But in our case, they do it by mutual agreement.

    // First B signs closing message with last state, B sends it to A (e.g. via websocket)

    const signatureCloseB = await payments.channelService.signClose(payments.lastChannelState)

    // A verifies and signs payments closing message and include B's signature

    // A sends closing message to blockchain, payments channel smart contract
    // Payment channel smart contract will send funds to participants according to the balances of the sent state.

    if (!(await payments.channelClient.verifyClose(payments.lastChannelState, signatureCloseB))) {
      throw new Error('Invalid B signature')
    }

    await payments.fromWalletClient.close({
      ...payments.lastChannelState,
      hisSignature: signatureCloseB
    }).send(toNano('0.05'))
  }
}

// USAGE
// await payments.init()

export default payments
