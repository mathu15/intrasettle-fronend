import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from 'primereact/tabview';

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Route, useHistory } from "react-router-dom";

import { useToken } from "../App/useToken";
import { LoginService } from "../devlogin/LoginService";

export default function Wbconfigure({ setToken }) {
  const Entityinfo = {
    email: "",
    username: "",
    urlname: "",
    role: "",
    organization: "",
    accountid: "",
    entityaccountnumber: "",
    centralaccountnumber: "",
    subcentralaccountnumber: "",
    subentityemail: "",
    subentityname: "",
    subentityid: "",
    subscriberid: "",
    subtraderid: "",
    entityemail: "",
    entityname: "",
    systemid: "",
    issuerid: "",
    funderid: "",
    entityid: "",
    marker: "",
  };

  const [email, setEmail] = useState();
  const [centralnotconfigured, setCentralnotconfigured] = useState('');
  const [disabletrader, setDisabletrader] = useState('Trader account already configured');
  const [disableaccount, setDisableaccount] = useState('Operation account already configured');
  const [password, setPassword] = useState();

  const [entryinfo, setEntryinfo] = useState(Entityinfo);
  const [entityinfo, setEntityinfo] = useState(Entityinfo);

  const [error, setError] = useState("");

  const [role, setRole] = useState("");

  const [organization, setOrganization] = useState("");
  const [centralbank, setCentralbank] = useState({});

  const [centralbanks, setCentralbanks] = useState([]);
  const [wholesalebanks, setWholesalebanks] = useState([]);
  const [wholesalebank, setWholesalebank] = useState({});


  const history = useHistory();

  const roles = ["Wholesale bank"];

  const loginservice = new LoginService();
  const usetoken = new useToken();


   useEffect(() => {
    setEmail(wholesalebank.email);
  }, [wholesalebank]);

  useEffect(() => {
    getwholesalebanks();
    getdata();
  }, []);

 useEffect(() => {
     gotoproperrole();
  }, [entityinfo.role]); //

 const gotoproperrole = async () => {

     if(entityinfo.role == "Central bank") {
             alert("Logged in as Central bank, going to central bank admin");
                history.push('/admincb')
     }
  };


  useEffect(() => {
  if(entityinfo.entityid == '') {
            setCentralnotconfigured('Configure the centralbank');
    }else {
            setCentralnotconfigured('');
    }
  if(entityinfo.subentityaddress == '') {
            setDisableaccount('');
  }else {
            setDisableaccount('Operation account already configured');
  }
  if(entityinfo.subtraderaddress == '') {
            setDisabletrader('');
  }else {
            setDisabletrader('Trader account already configured');
  }

  }, [entityinfo.entityid]);


   const getwholesalebanks = async () => {
    try {
      const tokendata = await loginservice.getallwholesalebanks();
      console.log(tokendata);
      setWholesalebanks(tokendata);
    } catch (err) {
      setError("Update failed " + err);
    }
  };


  useEffect(() => {
    loginservice.getcentralbanks().then((data) => {
      if (data) {
        setCentralbanks(data);
      }
    });
  }, []);

  const login = async () => {
    try {
      const tokendata = await loginservice.loginUser({
        email,

        password,
      });

      if (tokendata.token) {
        usetoken.saveToken(tokendata);
        setEntityinfo(tokendata.user);

        setError("Login success");
        //        history.push('/central-bank')
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("Login failed");
    }
  };
  const getdata = async () => {
    const tokendata = await loginservice.getlatestuser();
    if (tokendata.token) {
      usetoken.saveToken(tokendata);
      setEntityinfo(tokendata.user);
    }
  };

  const update = async () => {
    try {
      console.log(entityinfo);

      const tokendata = await loginservice.updateUserwb(
        entityinfo,
        usetoken.getToken()
      );
    } catch (err) {
      setError("Update failed " + err);
    }
  };

  const configaccount = async () => {
    try {
      const accounts = await loginservice.wbconfigcentralaccounts();
    } catch (err) {
      setError("config account failed " + err);
    }
  };

  const configtrader = async () => {
    try {
      const accounts = await loginservice.wbconfigtraderaccounts();
    } catch (err) {
      setError("config account failed " + err);
    }
  };

  const enablewb = async () => {
    const tokendata = await loginservice.enablewb();
}

const disablewb = async () => {
    const tokendata = await loginservice.disablewb();
}






  return (
    <div className="col-12 ">
      <div className="card p-fluid">
        <h5 className="text-3xl text-center">Wholesale Bank Configure</h5>
    <TabView>
    <TabPanel header="CONFIG OPERATION">
        <div className="formgrid grid">
          <div className="field text-2xl">
   <p className="m-0  text-xl ">
            The account for wholesale bank is configured using below button. Before using this ensure, applicable central bank is configured.
        </p>
  </div>

          <div className="field text-2xl">
	            <Button
              label="Config Accounts"
              onClick={() => configaccount()}
              className=" m-3 text-2xl"
	      disabled = {entityinfo.entityid == '' || disableaccount != ''}
            />

        </div>
        </div>
        <p className="m-0  text-xl ">
          <span className="text-pink-500">{centralnotconfigured}</span>
        </p>
        <p className="m-0  text-xl ">
          <span className="text-pink-500">{disableaccount}</span>
        </p>

    </TabPanel>
    <TabPanel header="CONFIG TRADER">
        <div className="formgrid grid">
        <p className="m-0  text-xl ">
            The account for atomic-swap needs trader account configuration. Use the button below to configure trader account.
        </p>


          <div className="field text-2xl">
            <Button
              label="Config Trader"
              onClick={() => configtrader()}
              className=" m-3 text-2xl"
	      disabled = {entityinfo.entityid == '' || disabletrader != ''}
            />
        </div>
        </div>
        <p className="m-0  text-xl ">
          <span className="text-pink-500">{centralnotconfigured}</span>
        </p>
        <p className="m-0  text-xl ">
          <span className="text-pink-500">{disabletrader}</span>
        </p>

    </TabPanel>
    <TabPanel header="ENABLE/DISABLE ">
	  <p className="m-0  text-xl ">
            The wholesale bank created can be disabled/enabled. The user should be loggedin as that user to enable/disable account.
        </p>
	  <p className="m-0  text-xl ">
        </p>
	      <div className="card">
         <div className="field grid">
          <div className="field text-2xl">
          <span className="text-pink-500">Logged in as : {entityinfo.email} </span>
          </div>
          </div>
         <div className="field grid">
          <div className="field text-2xl">
            <label htmlFor="cbank">Choose wholesale bank</label>

            <Dropdown
              id="wbank"
              optionLabel="organization"
              value={wholesalebank}
              options={wholesalebanks}
              onChange={(e) =>
                setWholesalebank(e.target.value)
              }
              placeholder="Select a bank to enable/disable"
              className="text-2xl"
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          </div>

         <div className="field grid">

          <div className="field text-2xl">
            <label htmlFor="email2">Email for bank : {wholesalebank.email}</label>
          </div>
         </div>

         <div className="field grid">
          <div className="field text-2xl">
   	<Button
              label="Enable"
              onClick={() => enablewb()}
              className=" m-3 text-2xl"
	      disabled = {!(wholesalebank.email == entityinfo.email)}
            />
           <Button
              label="Disable"
              onClick={() => disablewb()}
              className=" m-3 text-2xl"
	      disabled = {!(wholesalebank.email == entityinfo.email)}
            />
        </div>
        </div>
        </div>
        <p className="m-0  text-xl ">
          <span className="text-pink-500">The logged in user only can disable/enable his account </span>
        </p>

    </TabPanel>
    <TabPanel header="CONFIG ADVANCED">

        <div className="formgrid grid">


          <div className="field col text-2xl">
            <label htmlFor="subentityemail">
              Sub Entity Email: {entityinfo.subentityemail}
            </label>
            <InputText
              id="subentityemail"
              type="email"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, subentityemail: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="entityemail">
              Entity email: {entityinfo.entityemail}
            </label>
            <InputText
              id="entityemail"
              type="email"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, entityemail: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="urlname">URL name: {entityinfo.urlname}</label>
            <InputText
              id="urlname"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, urlname: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col text-2xl">
            <label htmlFor="entityid">Entity id {entityinfo.entityid}</label>
            <InputText
              id="entityid"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, entityid: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="subscriberid">
              Subscriber id: {entityinfo.subscriberid}
            </label>
            <InputText
              id="subscriberid"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, subscriberid: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="subtraderid">
              Subtrader id: {entityinfo.subtraderid}
            </label>
            <InputText
              id="subtraderid"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, subtraderid: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col text-2xl">
            <label htmlFor="subentityid">
              Sub Entity id: {entityinfo.subentityid}
            </label>
            <InputText
              id="subentityid"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, subentityid: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="enaccnumber">
              Entity account number {entityinfo.entityaccountnumber}
            </label>
            <InputText
              id="enaccnumber"
              type="text"
              onChange={(e) =>
                setEntityinfo({
                  ...entityinfo,
                  entityaccountnumber: e.target.value,
                })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="cenaccnumber">
              Central account number {entityinfo.centralaccountnumber}
            </label>
            <InputText
              id="cenaccnumber"
              type="text"
              onChange={(e) =>
                setEntityinfo({
                  ...entityinfo,
                  centralaccountnumber: e.target.value,
                })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col text-2xl">
            <label htmlFor="subcenaccnumber">
              Sub Central account number {entityinfo.subcentralaccountnumber}
            </label>
            <InputText
              id="subcenaccnumber"
              type="text"
              onChange={(e) =>
                setEntityinfo({
                  ...entityinfo,
                  subcentralaccountnumber: e.target.value,
                })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col text-2xl">
            <label htmlFor="issuerid">Issuerid : {entityinfo.issuerid}</label>
            <InputText
              id="issuerid"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, issuerid: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="funderid">Funderid : {entityinfo.funderid}</label>
            <InputText
              id="funderid"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, funderid: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col text-2xl">
            <label htmlFor="systemid">Systemid : {entityinfo.systemid}</label>
            <InputText
              id="systemid"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, systemid: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="entityname">
              Entity name : {entityinfo.entityname}
            </label>
            <InputText
              id="entityname"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, entityname: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="subentityname">
              Entity name : {entityinfo.subentityname}
            </label>
            <InputText
              id="subentityname"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, subentityname: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col text-2xl">
            <label htmlFor="marker">Marker : {entityinfo.marker}</label>
            <InputText
              id="marker"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, marker: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label htmlFor="organization">
              Organization : {entityinfo.organization}
            </label>
            <InputText
              id="organization"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, organization: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col text-2xl">
            <label htmlFor="role">Role : {entityinfo.role}</label>
            <Dropdown
              id="role"
              type="text"
              onChange={(e) =>
                setEntityinfo({ ...entityinfo, role: e.target.value })
              }
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
          <div className="field col text-2xl">
            <label>Central Bank</label>
            <Dropdown
              optionLabel="entityname"
              value={centralbank}
              options={centralbanks}
              onChange={(e) => setCentralbank(e.target.value)}
              placeholder="Select centralbank for configure"
              style={{ height: "4rem", fontSize: "2.0rem" }}
            />
          </div>
        </div>


        <div className="field text-2xl">
          {/* Status:  */}
          <span className="text-pink-500">{error}</span>
          <div className="flex  align-items-center  justify-content-between">
            {/* <label> */}
            <Button
              label="Update"
              onClick={() => update()}
              className=" m-3 text-2xl"
	      disabled
            />
            <Button
              label="Refresh"
              onClick={() => getdata()}
              className=" m-3 text-2xl"
            />


            {/* </label> */}
          </div>
        </div>
    </TabPanel>
    </TabView>
      </div>
    </div>
  );
}
