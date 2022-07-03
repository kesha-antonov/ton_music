import payments from './payments.js'

jest.setTimeout(120 * 1000)

describe('payments util', () => {
    it('should init payments api', async () => {
        await payments.init()
        expect(payments.isInited).toEqual(true)
    })

    it('should deposit funds', async () => {
        await payments.init()
        const res = await payments.depositFunds(2)

        expect(res).toEqual(true)
    })

    it('should make payments', async () => {
        await payments.init()
        await payments.depositFunds(2)
        const res = await payments.payForListening(5)

        expect(res).toEqual(true)
    })

    it.only('should receive payments', async () => {
        await payments.init()
        await payments.depositFunds(2)
        await payments.payForListening(5)
        const res = await payments.withdrawFunds()

        expect(res).toEqual(true)
    })
})
