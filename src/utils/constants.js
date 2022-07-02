import { encode } from 'js-base64'

export default {
  seedServiceBase64: encode(['ton', 'music', 'for', 'contenst', '2022'].join('')),
}
