import React, { useEffect, useState } from 'react';
import { Card, Button, List, Skeleton, Avatar, Table, Space, Tag, TableProps } from 'antd';
import { AppstoreFilled, ControlFilled, DatabaseFilled, FireFilled, ShoppingCartOutlined, TeamOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  pd_name: string;
  pd_price: number;
  pd_image: string;
  pd_quantity: number
}


const ProductPage = () => {

  const [Products, setproducts] = useState<Product[]>([]);
  const [countcart, setcartcount] = useState(0)
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState(4); // แสดง 4 รายการแรกเท่านั้น


  const popup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
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
    const sentOrder = async () => {
      const reponse  = await axios.post("/api/order/add") 
    }
  }, [])

  const OrderStatus = () => {
    Swal.fire({
      icon: "error",
      text: "Plese Sign in first",
    });
  }

  const handleViewMore = () => {
    setVisibleItems(prevItems => prevItems + 4); // เพิ่มจำนวนรายการที่แสดงเพิ่มขึ้น 4 รายการ
  };
  const displayedItems = cartItems.slice(0, visibleItems);

  // Function to add a product to the cart
  const handleAddToCart = (id) => {
    Swal.fire({
      title: "Add To Cart Success",
      icon: "success"
    });

    // const selectedItem = Products.find(product => product.id === id);
    // if (selectedItem) {
    //   const updatedCart = [...cartItems, selectedItem];
    //   setCartItems(updatedCart)
    //   console.log(updatedCart);

    //   setcartcount(prevCount => prevCount + 1)
    // }

    const selectedItem = Products.find(product => product.id === id);
    if (selectedItem) {
      const existingItemIndex = cartItems.findIndex(item => item.id === id);
      if (existingItemIndex !== -1) {
        // สินค้ามีอยู่แล้วในตะกร้า
        const updatedCart = cartItems.map(item => {
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
      setcartcount(prevCount => prevCount + 1);
    }
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    setcartcount(prevCount => prevCount - 1);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.pd_price) * (item.pd_quantity), 0);
  };

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'pd_name',
    },
    {
      title: 'Price',
      dataIndex: 'pd_price',
    },
    {
      title: 'quantity',
      dataIndex: 'pd_quantity',
    },
    {
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleRemoveItem(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];


  return (
    <div className='body'>
      {/* Menu */}
      <div className="menu">
        <div className="icon " style={{ color: "white" }} onClick={() => window.location.reload()}>
          Home
        </div>

        <div className="icon" onClick={popup}>
          <ShoppingCartOutlined style={{ width: "70px", height: "90px", color: "white" }} />
          <div className='cartcount'>{countcart !== 0 ? countcart : 0}</div>
        </div>


        <a style={{ marginRight: "10px", marginLeft: "auto", textDecoration: "none", color: "white" }} className="s" href='/register'>Sign Up</a>
        <a style={{ marginRight: "20px", textDecoration: "none", color: "white" }} className="su " href='/login'>Sign In</a>

      </div>

    
      {/* Product Cards */}
      <div className='CCard' style={{ display: 'flex', flexWrap: 'wrap' }}>
        {Products.map(product => (
          <Card key={product.id} style={{ width: 300, margin: '10px' }}>
            <img src={product.pd_image} alt={product.pd_name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <p><strong>{product.pd_name}</strong></p>
              <p>Price: ${product.pd_price}</p>
              <Button type="primary" onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Cart Section */}
      {isPopupVisible && (
        <div className="popup">
          <Table style={{ height: "100%" }} columns={columns} dataSource={cartItems} pagination={{ pageSize: 3 }} />
          <div className='Total'>
            <h5>Total Price: ${getTotalPrice()} <Button type='primary' onClick={OrderStatus}>สั่งซื้อ</Button></h5>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductPage;
