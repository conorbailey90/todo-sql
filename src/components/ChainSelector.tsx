import React from 'react'

type chain = {
  chainId: string, // Polygon Amoy Testnet (80002 in hex)
  name: string,
  rpcUrl: string
}

// Define the props interface
interface ChainSelectorProps {
  chains: chain[],
  selectedChain: string; // Type for selectedChain
  handleSelectChain: (chain: string) => void; // Type for setSelectedChain function
}

function ChainSelector({chains, selectedChain, handleSelectChain }: ChainSelectorProps) {
  // console.log(selectedChain)
  return (
    <div className='absolute top-[1rem] right-[1rem]'>
        <select
            value={selectedChain}
            onChange={(e) => handleSelectChain(e.target.value)}
            className="mb-4 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            {chains.map(chain => (
              <option key={chain.chainId} value={chain.chainId}>{chain.name}</option>
            ))}
         
          </select>
    </div>
  )
}

export default ChainSelector