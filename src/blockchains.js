/*#if _EVM

let supported = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base', 'worldchain', 'celo']
supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base', 'worldchain', 'celo']
supported.svm = []

/*#elif _SVM

let supported = ['solana']
supported.evm = []
supported.svm = ['solana']

//#else */

let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base', 'worldchain', 'celo']
supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base', 'worldchain', 'celo']
supported.svm = ['solana']

//#endif

export { supported }
