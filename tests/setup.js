import 'regenerator-runtime/runtime'
import { Crypto } from "@peculiar/webcrypto"

global.crypto = new Crypto()
