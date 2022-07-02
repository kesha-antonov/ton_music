import payments from './payments.js'


describe('payments util', () => {
    it('should init payments api', async () => {
        await payments.init()
        expect(payments.isInited).toEqual(true)
    })
})
