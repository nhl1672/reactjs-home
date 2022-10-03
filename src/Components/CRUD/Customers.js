import React, { Component } from "react";
import config from "./config.json";
import HttpClient from "./HttpClient";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
export class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      filters: {
        status: "all",
        keyword: "",
      },
      paginate: {
        currentPage: 1,
        totalPage: 0,
      },
      show: true,
    };
    this.customerApi = config.SERVER_API + "/customers";
    this.perPage = config.PER_PAGE;
    this.client = new HttpClient();
  }
  getCustomers = async (filters = {}) => {
    const { currentPage } = this.state.paginate;

    let searchApi = `${this.customerApi}?_page=${currentPage}&_limit=${this.perPage}`;

    if (Object.keys(filters).length) {
      const params = new URLSearchParams(filters).toString();

      searchApi = `${this.customerApi}?_page=${currentPage}&_limit=${this.perPage}&${params}`;
    }
    console.log(searchApi);
    const clientResult = await this.client.get(searchApi);

    const totalCount = clientResult.headers.get("x-total-count");

    const totalPage = Math.ceil(totalCount / this.perPage);

    const paginate = { ...this.state.paginate };
    paginate.totalPage = totalPage;

    clientResult.json().then((customers) => {
      this.setState({
        customers: customers,
        paginate: paginate,
      });
    });
  };
  renderPaginate = () => {
    const { totalPage, currentPage } = this.state.paginate;

    let pageItemJsx = [];

    for (let i = 1; i < totalPage; i++) {
      pageItemJsx.push(
        <li
          key={i}
          className={`page-item${currentPage === i ? " active" : null}`}
        >
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              this.goPaginate(i);
            }}
          >
            {i}
          </a>
        </li>
      );
    }
    const jsx = (
      <nav className="d-flex justify-content-end">
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" href="#">
            Trước
          </a>
        </li>
        {pageItemJsx}
        <li className="page-item">
          <a className="page-link" href="#">
            Sau
          </a>
        </li>
      </ul>
    </nav>
    );
    if(totalPage - 1 > 1){
      return jsx;
    }
  };
  updateCurrentPage = (paginate) => {
    this.setState({
      paginate: paginate,
    });
  };

  // goPaginate = async (page) => {
  //   const paginate = {...this.state.paginate};
  //   paginate.currentPage = page;

  //   await this.updateCurrentPage(paginate);

  //   // await (() => {
  //   //   this.setState({
  //   //     paginate: paginate
  //   //   })
  //   // })()

  //   this.getCustomers();
  // }

  goPaginate = (page) => {
    const paginate = { ...this.state.paginate };
    paginate.currentPage = page;

    this.setState({
      paginate: paginate,
    });
  };

  componentDidMount = () => {
    const filtersObj = this.getFilterObj();
    this.getCustomers(filtersObj);
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { currentPage: prevCurrentPage } = prevState.paginate;

    const { currentPage } = this.state.paginate;

    if (currentPage != prevCurrentPage) {
      const filtersObj = this.getFilterObj();

      this.getCustomers(filtersObj);
    }
    // console.log('Update...');
    //Đặc biệt lưu ý phải check prevState và currentState => Nếu khác nhau thì sẽ gọi API
  };
  modalAddUser = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    )
  }
  getFilterObj = () => {
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

    return filtersObj;
  };

  handleFilter = (e) => {
    e.preventDefault();
    const filtersObj = this.getFilterObj();

    this.getCustomers(filtersObj);
  };

  handleChange = (e) => {
    const filters = { ...this.state.filters };
    filters[e.target.name] = e.target.value;

    this.setState({
      filters: filters,
    });
  };

  render() {
    // console.log("re-render 2");
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
        <a href="" className="btn btn-primary">Thêm mới</a>
        <hr/>
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
        {this.renderPaginate()}
      </div>
    );
  }
}


export default Customers;
