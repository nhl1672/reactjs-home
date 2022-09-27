import React, { Component } from 'react'
import config from './config.json'
export class Customers extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        customers: [],
        filters: {
          status: "all",
          keyword: "",
        },
      };
  
      this.customerApi = config.SERVER_API + "/customers";
    }
  
    getCustomers = (filters={}) => {
  
      let searchApi = this.customerApi;
  
      if (Object.keys(filters).length){
          const params = new URLSearchParams(filters).toString();
          
          searchApi = this.customerApi+'?'+params;
      }    
      
      fetch(searchApi)
        .then((response) => response.json())
        .then((customers) => {
          this.setState({
            customers: customers,
          });
        });
    };
  
    componentDidMount = () => {
      this.getCustomers();
    };
  
    handleFilter = (e) => {
      e.preventDefault();
  
      const {filters} = this.state;
  
      let {status, keyword} = filters;
      
      const filtersObj = {}
  
      if (status==='active' || status==='inactive'){
          status = status==='active'?1:0;
          
          filtersObj.status = status;
      }
  
      if (keyword!==''){
          filtersObj.q = keyword;
      }
  
      this.getCustomers(filtersObj);
    };
  
    handleChange = (e) => {
      const filters = {...this.state.filters}
      filters[e.target.name] = e.target.value;
      
      this.setState({
          filters: filters
      })
    };
  
    render() {
      const { customers } = this.state;
  
      const jsx = customers.map(({ id, name, email, phone, status }, index) => {
        const statusBtn = status ? (
          <button type="button" className="btn btn-success">
            Kích hoạt
          </button>
        ) : (
          <button type="button" className="btn btn-danger">
            Chưa kích hoạt
          </button>
        );
  
        const editBtn = (
          <a href="#" className="btn btn-warning">
            Sửa
          </a>
        );
  
        const deleteBtn = (
          <a href="#" className="btn btn-danger">
            Xoá
          </a>
        );
  
        return (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td>{phone}</td>
            <td>{statusBtn}</td>
            <td>{editBtn}</td>
            <td>{deleteBtn}</td>
          </tr>
        );
      });
  
      return (
        <div className="container">
          <h1>Danh sách khách hàng</h1>
          <form onSubmit={this.handleFilter}>
            <div className="row">
              <div className="col-3">
                <select
                  name="status"
                  onChange={this.handleChange}
                  className="form-select"
                >
                  <option value={"all"}>Tất cả trạng thái</option>
                  <option value={"active"}>Kích hoạt</option>
                  <option value={"inactive"}>Chưa kích hoạt</option>
                </select>
              </div>
  
              <div className="col-7">
                <input
                  type={"search"}
                  name="keyword"
                  className="form-control"
                  placeholder="Từ khoá tìm kiếm..."
                  onChange={this.handleChange}
                />
              </div>
  
              <div className="col-2 d-grid">
                <button type="submit" className="btn btn-primary">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </form>
          <hr />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th width="5%">STT</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Trạng thái</th>
                <th width="5%">Sửa</th>
                <th width="5%">Xoá</th>
              </tr>
            </thead>
            <tbody>{jsx}</tbody>
          </table>
        </div>
      );
    }
  }
  
  export default Customers;