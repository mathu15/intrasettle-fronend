import React , {useState, useEffect } from "react";
import { useToken } from "../../components/App/useToken";
import { BsBank } from "react-icons/bs";
import { NavLink, Route, useHistory } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import items from "../../components/Header/Items";

import { TabMenu } from "primereact/tabmenu";
import WBOHome from "../../components/WBOneTab/WBOHome";
import WBOCbdcManager from "../../components/WBOneTab/WBOCbdcManager";
import WBOAccessControls from "../../components/WBOneTab/WBOAccessControls";
import WBORequests from "../../components/WBOneTab/WBORequests";
import WBOTreasury from "../../components/WBOneTab/WBOTreasury";

import WBOMoneySwipeTrans from "../../components/WBOneTab/WBOMoneySwipetrans";
import WBOFxTrade from "../../components/WBOneTab/WBOFxTrade";
import WBOOrderBook from "../../components/WBOneTab/WBOOrderBook";
import WBOAtomicOrderBook from "../../components/WBOneTab/WBOAtomicOrderBook";
import PvpAtomic from "../../components/WBOneTab/PvpAtomic";
import { LoginService } from "../../components/devlogin/LoginService";


const WBankOne = () => {
  const history = useHistory();
const usetoken = new useToken();
  const [user, setUser] = useState(usetoken.getUser());
  const [rolemessaged, setRolemessaged] = useState(0);
  const [currentuser, setCurrentuser] = useState('');

 const Redirectnonconfigured = () => {
     if(!user || user.marker == ''){
             alert ("The system is not configured");
      history.push("/");
     }
  };

 const loginservice = new LoginService();
var alreadyused = false;

useEffect(() => {
	     setRolemessaged(0);
  }, []); //


useEffect(() => {

    if(alreadyused == false) {
    gotoproperrole();
     alreadyused= true;
    }
  
  }, [user.role]); //

 const gotoproperrole = () => {

     if(user.role == "Central bank") {
             alert("Logged in as Central bank, going to Central bank ");
             history.push('/central-bank')
     }
  };



 const reloadifneeded = (data) => {
    if(data.email != currentuser) {
	    window.location.reload(false);
    }
  };

  const getlatestdata = async () => {
    const tokendata = await loginservice.getlatestuser();
    if (tokendata.token) {
      usetoken.saveToken(tokendata);
//	    reloadifneeded(tokendata.user);
      setCurrentuser(tokendata.user.email);
    }
  }; 

  const wizardItems = [
    {
      label: "HOME",
      icon: "pi pi-fw  text-yellow-600 pi-th-large",
      command: () => history.push("/wholesale-bank-one"),
    },

     {
      label: "TRADE SETUP",
      icon: "pi pi-fw text-yellow-600  pi-desktop",
      command: () => history.push("/wholesale-bank-one/fx-trade"),
    },
{
      label: "BI SWAP ",
      icon: "pi pi-fw text-yellow-600  pi-desktop",
      command: () => history.push("/wholesale-bank-one/pvp-bi-swap"),
    },


    {
      label: "MEMBER ACCESS",
      icon: "pi pi-fw text-yellow-600  pi-cog",
      command: () => history.push("/wholesale-bank-one/access-controls"),
    },
    {
      label: "TREASURY DASHBOARD",
      icon: "pi pi-fw text-yellow-600  pi-chart-pie",
      command: () => history.push("/wholesale-bank-one/treasury-dashboard"),
    },
  ];
Redirectnonconfigured();

  return (
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
        // model={items.wbone}
        end={
          <>


     <NavLink to="/wb-login">
              <BsBank className="text-3xl mr-3 text-yellow-600" />
              <span className="text-2xl text-white">
                The {user.organization} , powered by Intrasettle
              </span>
            </NavLink>


          </>
        }
        className="pt-4 pb-4 layout-topbar"
      />
      <div className=" col-12  justify-content-around pt-8 pl-7 ">
        <TabMenu
          model={wizardItems}
          activeIndex={0}
          // setActiveIndex={(e) => e.index}
          end={<Button label="noifications" icon="pi pi-bell" />}
          style={{ fontSize: "1.3rem" }}
          className="pt-4 pb-1 card text-xl"
        />
      </div>
      <Route exact path={"/wholesale-bank-one"} component={WBOHome} />
      <Route
        path={"/wholesale-bank-one/cbdc-manager"}
        component={WBOCbdcManager}
      />
      <Route path={"/wholesale-bank-one/fx-trade"} component={WBOFxTrade} />
      <Route path={"/wholesale-bank-one/order-book"} component={WBOOrderBook} />
      <Route path={"/wholesale-bank-one/atomic-order-book"} component={WBOAtomicOrderBook} />
      <Route path={"/wholesale-bank-one/pvp-bi-swap"} component={PvpAtomic} />

      <Route
        path={"/wholesale-bank-one/access-controls"}
        component={WBOAccessControls}
      />
      <Route path={"/wholesale-bank-one/requests"} component={WBORequests} />
      <Route
        path={"/wholesale-bank-one/treasury-dashboard"}
        component={WBOTreasury}
      />

      <Route
        path={"/wholesale-bank-one/corda-dashboard"}
        component={WBOMoneySwipeTrans}
      />
    </div>
  );
};

export default WBankOne;
