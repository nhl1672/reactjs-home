import React, { Component } from "react";
import config from "./config.json";
export class Customers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      isLoading: true,
      filters: {
        status: "all",
        keyword: "",
      },
      paginate: {
        maxPage: 0,
        currentPage: 1,
      },
    };

    this.customerApi = config.SERVER_API + "/customers";
    this.perPage = 5;
  }

  getCustomers = (filters= {}) => {
    let searchApi = this.customerApi;

    if (Object.keys(filters).length) {
      const params = new URLSearchParams(filters).toString();
      searchApi = this.customerApi + `?_page=${this.state.paginate.currentPage}&_limit=${this.perPage}` +`&`+ params ;
      console.log(searchApi);
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
    this.setMaxPages();
  };

  handleFilter = (e) => {
    e.preventDefault();

    const { filters } = this.state;

    let { status, keyword } = filters;

    const filtersObj = {};

    if (status === "active" || status === "inactive") {
      status = status === "active" ? 1 : 0;

      filtersObj.status = status;
    }

    if (keyword !== "") {
      filtersObj.q = keyword;
    }

    this.getCustomers(filtersObj);
  };

  handleChange = (e) => {
    const filters = { ...this.state.filters };
    filters[e.target.name] = e.target.value;

    this.setState({
      filters: filters,
    });
  };
  setMaxPages = () => {
    let customerApi = this.customerApi;
    fetch(customerApi)
      .then((response) => response.json())
      .then((customers) => {
        const maxPage = Math.ceil(customers.length / this.perPage);
        const paginate = { ...this.state.paginate };
        paginate.maxPage = maxPage;
        this.setState({
          paginate: paginate,
        });
      });
  };
  paginateRender = () => {
    let paginateItem = [];
    let active;
    const currentPage = this.state.paginate.currentPage;
    for (let page = 1; page <= this.state.paginate.maxPage; page++) {
      active = parseInt(page) === parseInt(currentPage);
      paginateItem.push(
        <li
          key={page}
          onClick={(e) => {
            e.preventDefault();
            this.clickPaginate(page);
          }}
        >
          <p className="page-link">{page}</p>
        </li>
      );
    }
    return (
      <nav aria-label="...">
        <ul className="pagination">
          {this.state.paginate.currentPage > 1 ? (
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex={-1}>
                Previous
              </a>
            </li>
          ) : (
            false
          )}
          {paginateItem}
          {this.state.paginate.currentPage < this.state.paginate.maxPage ? (
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          ) : (
            false
          )}
        </ul>
      </nav>
    );
  };
  clickPaginate = (page) => {
    const paginate = { ...this.state.paginate };
    paginate.currentPage = page;
    this.setState({
      paginate: paginate,
      isLoading: true,
    });
    setTimeout(() => {
        this.getCustomers();
      }, 100);
    };
    prevPaginate = (e) => {
        e.preventDefault();
        let page = this.state.paginate.currentPage;
        page = page - 1;
        if (page < 0) {
          page = 1;
        }
        this.clickPaginate(page);
      };
      nextPaginate = (e) => {
        e.preventDefault();
        let page = this.state.paginate.currentPage;
        page = page + 1;
        if (page > this.state.paginate.maxPage) {
          page = this.state.paginate.maxPage;
        }
        this.clickPaginate(page);
      };
      customersRender = () => {
        if (this.state.isLoading) {
          return (
            <tr>
              <td colSpan={6}>
                <div className="alert alert-success text-center">
                  Đang tải dữ liệu...
                </div>
              </td>
            </tr>
          );
        }
        return this.state.customers.map((customer) => {
          return (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
            </tr>
          );
        });
      };
  render() {
    const { customers } = this.state;
    const page = customers.length / 5;
    const pageFixed = Math.round(page);
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
        {this.paginateRender()}
      </div>
    );
  }
}

export default Customers;
