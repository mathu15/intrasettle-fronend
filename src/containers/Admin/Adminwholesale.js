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
import Createpairname from "../../components/wblogin/Createpairname";
import Createassets from "../../components/login/Createassets";
import Transmitassets from "../../components/login/Transmitassets";
import TabMenubar from "../../components/tabmenubar/TabMenubar";
import Hero from "../../components/hero/Hero";
import { NavLink } from "react-router-dom";

//      <Hero />

const Adminwholesale = () => {
  const [activeone, setActiveone] = useState(0);
  const [activetwo, setActivetwo] = useState(0);

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
      label: "CREATE ASSETS ",
      // icon: "pi text-3xl pi-fw pi-sort-amount-up-alt",
    },
    {
      label: "TRANSMIT ASSETS",
      // icon: "pi text-3xl pi-fw pi-sort-amount-up-alt",
    },
  ];

  const wizardItems2 = [
    {
      label: "CONFIGURE CENTRALBANK",
      // icon: "pi text-3xl pi-fw pi-sort-amount-up-alt",
    },

    {
      label: "CONFIGURE ACCOUNTS",
    },
    {
      label: "CONFIGURE ATOMICSWAP ",
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
      return <Createassets />;
    }
    if (activeone === 3) {
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
      return <Wbconfigure />;
    }
    if (activetwo === 2) {
      return <Createpairname />;
    }
  };

  return (
    <>
<div>
        <NavLink to="/">
          <img
            className="h-8rem w-full"
            src={"images/intrasettle_White.svg"}
            alt="logo"
          />
        </NavLink>
      </div>

      <div className="grid p-fluid p-5">

        <div className="row-12  col-12 md:col-6 p-5">
          <div className="card card-w-title border-1 border-100 ">
            <TabMenu
              model={wizardItems2}
              activeIndex={activetwo}
              onTabChange={(e) => setActivetwo(e.index)}
              id={wizardItems2.id}
              style={{ fontSize: "1.2rem" }}
              className="text-xl"
            />

            {ToggleTwo()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminwholesale;
