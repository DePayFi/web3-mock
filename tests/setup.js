import 'regenerator-runtime/runtime'
import { TextEncoder, TextDecoder } from 'util'

global.fetch = require('node-fetch')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
