
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import Logo from "./logo.png";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Footer from "../pages/common/footer/Footer.jsx";
import IPAddress from "../pages/Utils/IPAddress.jsx";
import BatteryStatus from "../pages/Utils/BatteryStatus.jsx";
function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/")
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports")
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  ];

  const adminMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/")
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams")
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports")
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/admin/exams/edit") &&
        paths.includes("/admin/exams")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/user/write-exam") &&
        paths.includes("/user/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  const handleNavLinkClick = (item) => {
    if (item.onClick) {
      item.onClick(); // Execute the original onClick function if provided
    }
    setExpanded(false); // Close the menu
  };

  return (
    <div className="layout">
      <Navbar
        // bg="dark"
        variant="dark"
        expand="lg"
        expanded={expanded}
        className="header fixed-top space-between"
        style={{ background: "var(--light)" }}
      >
        <Container style={{ justifyContent: "space-between" }}>
          <Navbar.Brand onClick={() => navigate("/")}>
            <img src={Logo} alt="Logo" style={{ height: "50px" }} />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
            style={{ background: "black" }}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="menu-items "
            style={{ justifyContent: "right" }}
          >
            <Nav
              className="mr-auto"
              // style={{ boxShadow: "0px 0px 4px 3px black" }}
            >
              {menu.map((item, index) => (
                <Nav.Link
                  className="menu-item"
                  key={index}
                  active={getIsActiveOrNot(item.paths)}
                  onClick={() => handleNavLinkClick(item)}
                >
                  {item.icon}
                  {item.title}
                </Nav.Link>
              ))}
            </Nav>
            {/* <Nav>
              <NavDropdown
                title={`Name: ${user?.name}`}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item>
                  Role: {user?.isAdmin ? "Admin" : "User"}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                    setExpanded(false);
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="content-container">
        <div className="content">{children}</div>
      </div>
      <Footer />
      {/* <footer className="footer fixed-bottom bg-dark text-white text-center py-3">
        <Container>
          <span>
            &copy; {new Date().getFullYear()} Quiz Application. All Rights
            Reserved.
          </span>
        </Container>
      </footer> */}
    </div>
  );
}

export default ProtectedRoute;
