import React, { Component } from 'react'
import config from "./config.json"
export class Lifecycle extends Component {
    constructor() {
        super();
        this.state = {
            product: [],
            customers: []
        };
    }
    componentDidMount = () => {
        const {SEVER_API} = config;
        fetch(`${SEVER_API}/customers`)
            .then((response) => response.json())
            .then((customers) => {
                this.setState({
                    customers: customers,
                    isLoading: false
                });
            });
    };
    handleUpdateProducts = () =>{
        this.setState({
            product: ["San pham 1", "san pham 2"]
        })
    }
  render() {
    const { customers, isLoading } = this.state;
    return (
        <>
     <div width="80%" margin="10%">
        <table className='table table-bordered'>
            <tr>
                <th width='10%'>STT</th>
                <th>Tên</th>
                <th>Email</th>
                <th width="15%">Số điện thoại</th>
                <th width="10%">Sửa</th>
                <th width="10%">Xoá</th>
            </tr>
        </table>
      {
        isLoading?
        <p>Dang tai ...</p>
        :
        customers.length?
        customers.map(({id, name, email, phone, status}) => (
            <table>
                <tr>
                <td>{id}</td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{phone}</td>
                <td>
                    <button class="btn btn-success btn-sm">{status === 1 ? "Kích hoạt" : "Chưa kích hoạt"}</button>
                </td>
                <td>
                    <a href="http" class="btn btn-warning">Sửa</a>
                </td>
                <td>
                    <a href="http" class="btn btn-danger">Xoá</a>
                </td>
        </tr>
            </table>
        ))
        :
        <p>Khong co khach hang</p>
      }
      </div>
      </>
    )
  }
}

export default Lifecycle
/*
Thứ tự chạy:
1. Contructor
2.render
3.componentDidmount
4. componentDidmout => chạy từ lần thứ 2 render trở đi
5. componentWillUnmout() => Sau khi component được loại bỏ khỏi DOM
*/