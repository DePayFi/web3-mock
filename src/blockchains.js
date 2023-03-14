/*#if _EVM

let supported = ['ethereum', 'bsc', 'polygon', 'fantom', 'velas']
supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'velas']
supported.solana = []

/*#elif _SOLANA

let supported = ['solana']
supported.evm = []
supported.solana = ['solana']

//#else */

let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'velas']
supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'velas']
supported.solana = ['solana']

//#endif

export { supported }
