import payments from './payments.js'

jest.setTimeout(120 * 1000)

describe('payments util', () => {
    it('should init payments api', async () => {
        await payments.init()
        expect(payments.isInited).toEqual(true)
    })

    it.only('should deposit funds', async () => {
        await payments.init()
        const res = await payments.depositFunds(2)

        expect(res).toEqual(true)
    })
})
