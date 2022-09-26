import React, { Component } from "react";
import config from "./config.json";
export class Lifecycle extends Component {
  constructor() {
    super();
    this.state = {
      product: [],
      customers: [],
    };
  }
  componentDidMount = () => {
    const { SEVER_API } = config;
    const CUSTOMER_API = `${SEVER_API}/customers`;
    fetch(`${SEVER_API}/customers`)
      .then((response) => response.json())
      .then((customers) => {
        this.setState({
          customers: customers,
          isLoading: false,
        });
      });
  };
  // handleFormSubmit = (e) => {
  //   this.setFormData({
  //     name:"",
  //     email:"",
  //     phone:"",
  //     status: 0,    
  //   })
  // }
  handleUpdateProducts = () => {
    this.setState({
      product: ["San pham 1", "san pham 2"],
    });
  };
  handleDelete = (index) => {
    const choice = window.confirm('Bạn có chắc chắn xoá không');
    if (choice === true) {
        fetch(window.CUSTOMER_API+'/1',{
          method:'DELETE'
        })
        .then((response) => response.json())
        .then((customers) => {
          this.render()
        });
    }
  }
  render() {
    const { customers, isLoading } = this.state;
    return (
      <>
        <div width="80%" margin="10%">
        <a href="#add_user" className="btn btn-primary" data-bs-toggle="modal">Thêm mới</a>
        <hr></hr>
        <div className="modal fade" id="add_user" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" >Thêm người dùng</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form action="" className="form-add">
                    <div className="mb-3">
                        <label>Tên</label>
                        <input name="name" type="text" className="form-control" placeholder="Tên..." required/>
                    </div>
                    
                    <div className="mb-3">
                        <label>Email</label>
                        <input name="email" type="email" className="form-control" placeholder="Email..." required/>
                    </div>
                    <div className="mb-3">
                        <label>Phone</label>
                        <input name="phone" type="phone" className="form-control" placeholder="Phone..." required/>
                    </div>
                    <div className="mb-3">
                        <label>Trạng thái</label>
                        <select name="status" className="form-control">
                            <option value="0">Chưa kích hoạt</option>
                            <option value="1">Kích hoạt</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">Thêm mới</button>
                </form>
            </div>
          </div>
        </div>
      </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th width="10%">STT</th>
                <th>Tên</th>
                <th>Email</th>
                <th width="15%">Số điện thoại</th>
                <th width="10%">Sửa</th>
                <th width="10%">Xoá</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
              <td colSpan={6}>Dang tai ...</td>
            ) : customers.length ? (
              customers.map(({ id, name, email, phone, status },index,handleDelete) => (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{phone}</td>
                    <td>
                      <button className="btn btn-success btn-sm">
                        {status === 1 ? "Kích hoạt" : "Chưa kích hoạt"}
                      </button>
                    </td>
                    <td>
                      <a href="" className="btn btn-warning btn-sm">
                        Sửa
                      </a>
                    </td>
                    <td>
                      <a href="" className="btn btn-danger btn-sm" onClick={handleDelete(index)}>
                        Xoá
                      </a>
                    </td>
                  </tr>
              ))
            ) : (
              <td colSpan={6}>Khong co khach hang</td>
            )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default Lifecycle;
/*
Thứ tự chạy:
1. Contructor
2.render
3.componentDidmount
4. componentDidmout => chạy từ lần thứ 2 render trở đi
5. componentWillUnmout() => Sau khi component được loại bỏ khỏi DOM
*/
