import React, { useState, useEffect, use } from "react";
import Highcharts, { setOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import { Button, Card, Space, TableProps, Table, Row, Col } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Swal from "sweetalert2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Admin() {
  const [usernamelogin, setUsernamelogin] = useState("");
  const [usernamerole, setRoleusernamelogin] = useState("");
  const [uuiduser, setUUIDuserlogin] = useState("");
  const [selectedDate, setSelectedDate] = useState("2023-09-03"); // Default date
  const [selectedTime, setSelectedTime] = useState("00:00"); // Default time
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [xAxisCategories, setXAxisCategories] = useState();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countuser, setUser] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("PRODUCT");
  const [datalog, setDatalog] = useState([]);
  const [DataClient, setClient] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [itemsPerPage] = useState(10); // จำนวนรายการต่อหน้า
  const [order, setOrder] = useState<Order[]>([]);
  const [Recentorder, setRecentOrder] = useState<RecentOrder[]>([]);

  const updateOrder = (newOrder: Order[]) => {
    setOrder(newOrder);
  };

  interface Product {
    id: number;
    pd_name: string;
    pd_detail: string;
    pd_price: number;
    pd_image: string;
    pd_quantity: number;
    pd_type: string;
  }

  interface User {
    id: string;
    username: string;
    role: string;
    email: string;
    createdDay: string;
  }

  interface Order {
    od_name: string;
    od_quan: number;
    od_price: number;
  }

  interface RecentOrder {
    od_id: number;
    od_username: string;
    od_name: string;
    od_quan: number;
    od_status: string;
    od_time: string;
    od_price: number;
  }

  // control add clients
  const [userId, setUserId] = useState<string>("");
  const [Products, setproducts] = useState<Product[]>([]);
  const [countcart, setcartcount] = useState(0);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("usernamelogin");
      const storedUsernameRole = localStorage.getItem("role");
      const storedUserUUID = localStorage.getItem("uuiduser");
      if (storedUsername) {
        setUsernamelogin(storedUsername);
      }

      if (storedUsernameRole) {
        setRoleusernamelogin(storedUsernameRole);
      }
      if (storedUserUUID) {
        setUUIDuserlogin(storedUserUUID);
      }
    }

    const Order = async () => {
      try {
        const respone = await axios.get("/api/order");
        const data = respone.data.result.rows;

        const productMap: { [productName: string]: Order } = {};

        data.forEach((order) => {
          const { od_name, od_quan, od_price } = order;
          const totalPrice = od_quan * od_price;

          if (productMap[od_name]) {
            productMap[od_name].od_quan += od_quan;
            productMap[od_name].od_price += totalPrice;
          } else {
            productMap[od_name] = {
              od_name,
              od_quan,
              od_price: totalPrice,
            };
          }
        });

        const orderDetails = Object.values(productMap);
        orderDetails.sort((a, b) => b.od_quan - a.od_quan);

        setOrder(orderDetails);
        setRecentOrder([]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    Order();

    const RecentOrder = async () => {
      const respone = await axios.get("/api/order");
      const data = respone.data.result.rows;

      data.sort(
        (a: any, b: any) =>
          new Date(b.od_time).getTime() - new Date(a.od_time).getTime()
      );

      const recentOrders = data.map((order) => {
        return {
          od_id: order.od_id,
          od_username: order.od_username,
          od_name: order.od_name,
          od_quan: order.od_quan,
          od_price: order.od_price,
          od_status: order.od_status,
          od_time: order.od_time,
        };
      });

      console.log(recentOrders);
      setRecentOrder(recentOrders);
    };
    RecentOrder();

    const fetchDataClients = async () => {
      try {
        const responseuser = await axios.get("/api/user");
        const datauser = responseuser.data.result.rows;

        setUser(datauser);
        console.log(datauser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataClients();
    setUserId(usernamelogin);

    const fetchproduct = async () => {
      try {
        const response = await axios.get("/api/product");
        const data = response.data.result.rows;

        console.log(data);

        setproducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchproduct();
  }, [usernamerole, usernamelogin, uuiduser]);

  const selectMenu = (menu) => {
    setSelectedMenu(menu);
  };

  const popup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleAddToCart = (id) => {
    Swal.fire({
      title: "Add To Cart Success",
      icon: "success",
    });

    const selectedItem = Products.find((product) => product.id === id);
    if (selectedItem) {
      const existingItemIndex = cartItems.findIndex((item) => item.id === id);
      if (existingItemIndex !== -1) {
        // สินค้ามีอยู่แล้วในตะกร้า
        const updatedCart = cartItems.map((item) => {
          if (item.id === id) {
            // เพิ่มจำนวนสินค้า
            return { ...item, pd_quantity: item.pd_quantity + 1 };
          }
          return item;
        });
        setCartItems(updatedCart);
      } else {
        const updatedCart = [...cartItems, { ...selectedItem, pd_quantity: 1 }];
        setCartItems(updatedCart);
      }
      setcartcount((prevCount) => prevCount + 1);
    }
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    setcartcount((prevCount) => prevCount - 1);
  };

  const RemoveUser = async (usernameDelete) => {
    const result = await axios({
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/user/delete",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: usernameDelete,
      },
    });
    Swal.fire({
      title: "Delete User Success",
      icon: "success",
    });
    window.location.reload();
  };

  const RemoveProduct = async (productId) => {
    console.log(productId);

    const result = await axios({
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/product/remove",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        id: productId,
      },
    });
    Swal.fire({
      title: "Delete Product Success",
      icon: "success",
    });
    window.location.reload();
  };

  const EditUser = async (id, username, role, email) => {
    Swal.fire({
      title: " Update User",
      html:
        '<input id="username" class="swal2-input" placeholder="Username" autocapitalize="off">' +
        '<input id="role" class="swal2-input" placeholder="Role"  >' +
        '<input id="email" class="swal2-input" placeholder="Email"  >',
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const usernameInput = document.getElementById(
          "username"
        ) as HTMLInputElement;

        const emailInput = document.getElementById("email") as HTMLInputElement;
        const roleInput = document.getElementById("role") as HTMLInputElement;

        const username = usernameInput.value;
        const email = emailInput.value;
        const role = roleInput.value;

        try {
          const response = await fetch("/api/user/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, username, email, role }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success",
          text: "User created successfully!",
          icon: "success",
        });
        window.location.reload();
      }
    });
  };

  const EditProduct = async (
    id,
    productname,
    productdetail,
    productprice,
    productimage,
    producttype
  ) => {
    console.log(id);
    Swal.fire({
      title: "Update Product",
      html:
        '<input id="pd_name" class="swal2-input" placeholder="ProductName" autocapitalize="off">' +
        '<input id="pd_detail"  class="swal2-input" placeholder="ProductDetail" >' +
        '<input id="pd_price" class="swal2-input" placeholder="ProductPrice" >' +
        '<input id="pd_image" class="swal2-input" placeholder="Url-Image" >' +
        '<input id="pd_type" class="swal2-input" placeholder="ProductType" >',
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const ProductnameInput = document.getElementById(
          "pd_name"
        ) as HTMLInputElement;
        const productdetailInput = document.getElementById(
          "pd_detail"
        ) as HTMLInputElement;
        const productpriceInput = document.getElementById(
          "pd_price"
        ) as HTMLInputElement;
        const productImageUrl = document.getElementById(
          "pd_image"
        ) as HTMLInputElement;
        const productType = document.getElementById(
          "pd_type"
        ) as HTMLInputElement;

        const pd_name = ProductnameInput.value;
        const pd_detail = productdetailInput.value;
        const pd_price = productpriceInput.value;
        const pd_image = productImageUrl.value;
        const pd_type = productType.value;

        try {
          const response = await fetch("/api/product/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              pd_name,
              pd_detail,
              pd_price,
              pd_image,
              pd_type,
            }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success",
          text: "Update Product successfully!",
          icon: "success",
        });
        window.location.reload();
      }
    });
  };

  const pendingorder = async (od_id, od_status) => {
    console.log(od_id);
    try {
      const response = await fetch("/api/order/pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          od_id,
          od_status,
        }),
      });
      Swal.fire({
        title: "Success",
        text: "Pending successfully!",
        icon: "success",
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const cancelorder = async (od_id, od_status) => {
    try {
      const response = await fetch("/api/order/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          od_id,
          od_status,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
    Swal.fire({
      title: "Success",
      text: "Cancel successfully!",
      icon: "success",
    });
    window.location.reload();
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.pd_price * item.pd_quantity,
      0
    );
  };

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Name",
      dataIndex: "pd_name",
    },
    {
      title: "Price",
      dataIndex: "pd_price",
    },
    {
      title: "quantity",
      dataIndex: "pd_quantity",
    },
    {
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleRemoveItem(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  const columnuser: TableProps<User>["columns"] = [
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created Day",
      dataIndex: "createdDay",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            key={`edit-${record.id}`} // Unique key for edit action
            onClick={() =>
              EditUser(record.id, record.username, record.role, record.email)
            }
          >
            Edit
          </a>
          <a
            key={`remove-${record.id}`} // Unique key for remove action
            onClick={() => RemoveUser(record.username)}
          >
            Remove
          </a>
        </Space>
      ),
    },
  ];

  const columnproduct: TableProps<Product>["columns"] = [
    {
      title: "ProductName",
      dataIndex: "pd_name",
    },
    {
      title: "ProductDetail",
      dataIndex: "pd_detail",
    },
    {
      title: "ProductPrice",
      dataIndex: "pd_price",
    },
    {
      title: "ProductType",
      dataIndex: "pd_type",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            key={`edit-${record.id}`} // Unique key for edit action
            onClick={() =>
              EditProduct(
                record.id,
                record.pd_name,
                record.pd_detail,
                record.pd_price,
                record.pd_image,
                record.pd_type
              )
            }
          >
            Edit
          </a>
          <a
            key={`remove-${record.id}`} // Unique key for remove action
            onClick={() => RemoveProduct(record.id)}
          >
            Remove
          </a>
        </Space>
      ),
    },
  ];

  const Signout = () => {
    window.localStorage.clear();
    window.location.href = "http://localhost:3000";
  };

  const columnsOrder: TableProps<Order>["columns"] = [
    {
      title: "ProductName",
      dataIndex: "od_name",
    },
    {
      title: "จำนวน",
      dataIndex: "od_quan",
    },
    {
      title: "ราคา",
      dataIndex: "od_price",
    },
  ];

  const coloumnsRecentOrder: TableProps<RecentOrder>["columns"] = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "od_name",
    },
    {
      title: "จำนวน",
      dataIndex: "od_quan",
    },
    {
      title: "ราคา",
      dataIndex: "od_price",
    },
    {
      title: "เวลา",
      dataIndex: "od_time",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            key={`edit-${record.od_id}`}
            onClick={() => pendingorder(record.od_id, record.od_status)}
          >
            Pending
          </a>
          <a
            key={`remove-${record.od_id}`}
            onClick={() => cancelorder(record.od_id, record.od_status)}
          >
            Cancel
          </a>
        </Space>
      ),
    },
  ];

  const columnsOrderStatus: TableProps<RecentOrder>["columns"] = [
    {
      title: "ผู้สั่ง",
      dataIndex: "od_username",
    },
    {
      title: "จำนวน",
      dataIndex: "od_quan",
    },
    {
      title: "ราคา",
      dataIndex: "od_price",
    },
    {
      title: "สถานะ",
      dataIndex: "od_status",
    },
  ];

  const sentOrder = async () => {
    Swal.fire({
      title: "Order Success",
      icon: "success",
    });
    for (const item of cartItems) {
      const result = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/order/create",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          od_username: usernamelogin,
          od_name: item.pd_name,
          od_price: item.pd_price,
          od_quan: item.pd_quantity,
          odpd_id: item.id,
        },
      });
    }
    window.location.reload();
  };

  const handleAdd = () => {
    Swal.fire({
      title: "Enter New User",
      html:
        '<input id="username" class="swal2-input" placeholder="Username" autocapitalize="off">' +
        '<input id="password"  type="password" class="swal2-input" placeholder="Password" >' +
        '<input id="email" class="swal2-input" placeholder="Email" >' +
        '<input id="role" class="swal2-input" placeholder="Role" >',
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const usernameInput = document.getElementById(
          "username"
        ) as HTMLInputElement;
        const passwordInput = document.getElementById(
          "password"
        ) as HTMLInputElement;
        const emailInput = document.getElementById("email") as HTMLInputElement;
        const roleInput = document.getElementById("role") as HTMLInputElement;

        const username = usernameInput.value;
        const password = passwordInput.value;
        const email = emailInput.value;
        const role = roleInput.value;

        try {
          const response = await fetch("/api/user/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email, role }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success",
          text: "User created successfully!",
          icon: "success",
        });
        window.location.reload();
      }
    });
  };

  const AddProduct = () => {
    Swal.fire({
      title: "Enter New User",
      html:
        '<input id="pd_name" class="swal2-input" placeholder="ProductName" autocapitalize="off">' +
        '<input id="pd_detail"  class="swal2-input" placeholder="ProductDetail" >' +
        '<input id="pd_price" class="swal2-input" placeholder="ProductPrice" >' +
        '<input id="pd_image" class="swal2-input" placeholder="Url-Image" >' +
        '<input id="pd_type" class="swal2-input" placeholder="ProductType" >',
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const ProductnameInput = document.getElementById(
          "pd_name"
        ) as HTMLInputElement;
        const productdetailInput = document.getElementById(
          "pd_detail"
        ) as HTMLInputElement;
        const productpriceInput = document.getElementById(
          "pd_price"
        ) as HTMLInputElement;
        const productImageUrl = document.getElementById(
          "pd_image"
        ) as HTMLInputElement;
        const productType = document.getElementById(
          "pd_type"
        ) as HTMLInputElement;

        const pd_name = ProductnameInput.value;
        const pd_detail = productdetailInput.value;
        const pd_price = productpriceInput.value;
        const pd_image = productImageUrl.value;
        const pd_type = productType.value;

        try {
          const response = await fetch("/api/product/addproduct", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pd_name,
              pd_detail,
              pd_price,
              pd_image,
              pd_type,
            }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success",
          text: "Add Product successfully!",
          icon: "success",
        });
        window.location.reload();
      }
    });
  };

  return (
    <div className="body">
      {/* Menu */}
      <div className="menu">
        <div
          className="icon "
          style={{ color: "white" }}
          onClick={() => window.location.reload()}
        >
          Home
        </div>
        <div
          className="icon "
          style={{ color: "white" }}
          onClick={() => selectMenu("PRODUCT")}
        >
          Product
        </div>

        {usernamerole === "admin" && (
          <>
            <div
              className="icon "
              onClick={() => selectMenu("DASHBOARD")}
              style={{ color: "white" }}
            >
              Dashboard
            </div>
            <div
              className="icon "
              style={{ color: "white" }}
              onClick={() => selectMenu("ADMIN")}
            >
              Admin
            </div>
          </>
        )}

        {usernamerole === "superadmin" && (
          <>
            <div
              className="icon "
              onClick={() => selectMenu("DASHBOARD")}
              style={{ color: "white" }}
            >
              Dashboard
            </div>
            <div
              className="icon "
              style={{ color: "white" }}
              onClick={() => selectMenu("ADMIN")}
            >
              Admin
            </div>
          </>
        )}

        <div className="icon" onClick={popup}>
          <ShoppingCartOutlined
            style={{ width: "70px", height: "90px", color: "white" }}
          />
          <div className="cartcount">{countcart !== 0 ? countcart : 0}</div>
        </div>

        <h3
          style={{
            textTransform: "uppercase",
            marginRight: "10px",
            marginLeft: "auto",
            textDecoration: "none",
            textShadow: " 0px 0px 10px skyblue",
          }}
        >
          WELCOME {usernamelogin}{" "}
          <Button
            onClick={Signout}
            style={{ marginTop: "-1px" }}
            type="primary"
          >
            Sign Out
          </Button>
        </h3>
      </div>

      {selectedMenu === "PRODUCT" && (
        <div className="CCard" style={{ display: "flex", flexWrap: "wrap" }}>
          {Products.map((product) => (
            <Card key={product.id} style={{ width: 300, margin: "10px" }}>
              <img
                src={product.pd_image}
                alt={product.pd_name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <div style={{ padding: "10px" }}>
                <p>
                  <strong>{product.pd_name}</strong>
                </p>
                <p>Price: ${product.pd_price}</p>
                <Button
                  type="primary"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {selectedMenu === "ADMIN" && usernamerole === "admin" && (
        <>
          <Button
            onClick={handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
              marginTop: "10px",
            }}
          >
            Add Product
          </Button>
          <Table
            columns={columnproduct}
            dataSource={Products}
            pagination={{ pageSize: 5 }}
          />
        </>
      )}
      {selectedMenu === "ADMIN" && usernamerole === "superadmin" && (
        <div key="admin-section" className="adminbg">
          <Button
            onClick={handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
              marginTop: "10px",
            }}
          >
            Add a User
          </Button>
          <Table
            columns={columnuser}
            dataSource={countuser}
            pagination={{ pageSize: 4 }}
          />

          <Button
            onClick={AddProduct}
            type="primary"
            style={{
              marginBottom: 16,
              marginTop: "10px",
            }}
          >
            Add Product
          </Button>
          <Table
            columns={columnproduct}
            dataSource={Products}
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}

      {selectedMenu === "DASHBOARD" && usernamerole != "user" && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <div style={{ flex: 1 }}>
              <h2>Top 10 Best Selling Products</h2>
              <div style={{ overflowY: "auto", maxHeight: "calc(100vh / 3)" }}>
                <Table
                  pagination={{ pageSize: 10 }}
                  columns={columnsOrder}
                  dataSource={order}
                  size="small"
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2>Order Status</h2>
              <div style={{ overflowY: "auto", maxHeight: "calc(100vh / 3)" }}>
                <Table
                  pagination={{ pageSize: 5 }}
                  columns={columnsOrderStatus}
                  dataSource={Recentorder}
                  size="small"
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2>Recent Order</h2>
              <div style={{ overflowY: "auto", maxHeight: "calc(100vh / 3)" }}>
                <Table
                  pagination={{ pageSize: 5 }}
                  columns={coloumnsRecentOrder}
                  dataSource={Recentorder}
                  size="small"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {isPopupVisible && usernamerole === "user" && (
        <div className="popupuser">
          <Table
            style={{ height: "100%" }}
            columns={columns}
            dataSource={cartItems}
            pagination={{ pageSize: 3 }}
          />
          <div className="Total">
            <h5>
              Total Price: ${getTotalPrice()}{" "}
              <Button type="primary" onClick={sentOrder}>
                สั่งซื้อ
              </Button>
            </h5>
          </div>
        </div>
      )}
      {isPopupVisible && usernamerole === "admin" && (
        <div className="popupadmin">
          <Table
            style={{ height: "100%" }}
            columns={columns}
            dataSource={cartItems}
            pagination={{ pageSize: 3 }}
          />
          <div className="Total">
            <h5>
              Total Price: ${getTotalPrice()}{" "}
              <Button type="primary" onClick={sentOrder}>
                สั่งซื้อ
              </Button>
            </h5>
          </div>
        </div>
      )}
      {isPopupVisible && usernamerole === "superadmin" && (
        <div className="popupsuper">
          <Table
            style={{ height: "100%" }}
            columns={columns}
            dataSource={cartItems}
            pagination={{ pageSize: 3 }}
          />
          <div className="Total">
            <h5>
              Total Price: ${getTotalPrice()}{" "}
              <Button type="primary" onClick={sentOrder}>
                สั่งซื้อ
              </Button>
            </h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
