import React, { useState } from "react";

import { AppTopbar } from "../../components/Header/AppTopbar";
import { TabMenu } from "primereact/tabmenu";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "../../../src/assets/layout/layout.scss";
// import Login from "../../components/login/Login";
// import Wblogin from "../../components/wblogin/Wblogin";
import Wbconfigure from "../../components/wblogin/Wbconfigure";
import Centralbanksetup from "../../components/login/Centralbanksetup";
import Autoconfigure from "../../components/login/Autoconfigure";
import Autoconfigurewb from "../../components/wblogin/Autoconfigurewb";
import Createassets from "../../components/login/Createassets";
import Enableassets from "../../components/login/Enableassets";
import Transmitassets from "../../components/login/Transmitassets";
import { Menubar } from "primereact/menubar";
import { NavLink } from "react-router-dom";
import { BsGlobe2 } from "react-icons/bs";
import { useToken } from "../../components/App/useToken";

//      <Hero />

const Admincentral = () => {
  const [activeone, setActiveone] = useState(0);
  const [activetwo, setActivetwo] = useState(0);

  const usetoken = new useToken();
  const [user, setUser] = useState(usetoken.getUser());

  const wizardItems = [
    {
      label: "AUTO CONFIGURE ",
      // icon: "pi text-3xl pi-fw pi-sort-amount-up-alt",
    },

    {
      label: "CONFIGURE ",
      // icon: "pi text-3xl pi-fw pi-sort-amount-up-alt",
    },
    {
      label: "ASSETS DISABLE/ENABLE ",
    },
    {
      label: "CREATE ASSETS ",
    },
    {
      label: "TRANSMIT ASSETS",
      // icon: "pi text-3xl pi-fw pi-sort-amount-up-alt",
    },
  ];

  const wizardItems2 = [
    {
      label: "AUTO CONFIGURE ",
      // icon: "pi text-3xl pi-fw pi-sort-amount-up-alt",
    },

    {
      label: "CONFIGURE ",
      // icon: "pi text-3xl pi-fw pi-sort-amount-up-alt",
    },
  ];

  const ToggleOne = () => {
    if (activeone === 0) {
      return <Autoconfigure />;
    }
    if (activeone === 1) {
      return <Centralbanksetup />;
    }
    if (activeone === 2) {
      return <Enableassets />;
    }
    if (activeone === 3) {
      return <Createassets />;
    }
    if (activeone === 4) {
      return <Transmitassets />;
      //return <Createassets />
    }
  };

  const ToggleTwo = () => {
    if (activetwo === 0) {
      return <Autoconfigurewb />;
      //  return <Wbconfigure />
    }
    if (activetwo === 1) {
      //  return <Autoconfigurewb />
      return <Wbconfigure />;
    }
  };

  return (
    <>
      <div>
        <Menubar
          start={
            <NavLink to="/">
              <img
                src={"https://intrasettle.com/static/img/intrasettle_white.svg"}
                alt="logo"
                style={{ width: "12rem" }}
              />
            </NavLink>
          }
          // model={items.cbank}
          end={
            <>
              <NavLink to="/cb-login">
                <BsGlobe2 className="text-3xl mr-3 text-blue-500" />
                <span className="text-2xl text-white">
                  The {user.organization} , powered by Intrasettle
                </span>
              </NavLink>
            </>
          }
          // style={{ fontSize: "1.4rem" }}
          className="pt-4 pb-4 layout-topbar"
        />
      </div>

      <div className="grid p-fluid p-5">
        <div className="row-12  col-6 md:col-6 p-5">
          <div className="card card-w-title border-1 border-100 h-full">
            <TabMenu
              model={wizardItems}
              activeIndex={activeone}
              onTabChange={(e) => setActiveone(e.index)}
              id={wizardItems.id}
              style={{ fontSize: "1.2rem" }}
              className="text-xl"
            />

            {ToggleOne()}
          </div>
        </div>

        <div className="row-12  col-12 md:col-6 p-5"></div>
      </div>
    </>
  );
};

export default Admincentral;
