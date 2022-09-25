import React, { Component } from 'react'

export class VndToUsd extends Component {
    constructor(props){
        super(props);

        const {num} = props;
        this.state = {
            dataUsd: num
        }
    }
    changeValue = (e) => {

        this.setState({
            usd : e.target.value / 23500,
          })
          
          console.log(this.state.usd);
      }  
  render() {
    return (
        <div>
        <label>VND:</label>
        <input type={'number'} onChange={this.changeValue} placeholder={'VND...'} />
    </div>
    )
  }
}
export default VndToUsd