import React from 'react'
import UsdtToVnd from './UsdtToVnd'
import VndToUsd from './VndToUsd'
export default function ConvertCurrency() {
    const handleDataVnd = (number, currency) => {
        
    }
    const handleDataUsd = (number, currency) => {
        
    }
  return (
    <div style={{margin: '3%'}}>
    <UsdtToVnd onDataVnd={handleDataVnd}/>
    <VndToUsd onDataUsd={handleDataUsd}/>
</div>
  )
}
