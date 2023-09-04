/*#if _EVM

let supported = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base']
supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base']
supported.solana = []

/*#elif _SOLANA

let supported = ['solana']
supported.evm = []
supported.solana = ['solana']

//#else */

let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base']
supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base']
supported.solana = ['solana']

//#endif

export { supported }
