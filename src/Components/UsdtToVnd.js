import React, { Component } from 'react'

export class UsdtToVnd extends Component {
  constructor(props){
    super(props);

    const {num} = props;
    this.state = {
        dataVnd: num
    }
}
changeValue = (e) => {
  this.setState({
    vnd : e.target.value * 23500
  })
  }  
render() {
return (
    <div>
    <label>USD:</label>
    <input type={'number'} onChange={this.changeValue} placeholder={'VND...'} />
</div>
)
}
}

export default UsdtToVnd