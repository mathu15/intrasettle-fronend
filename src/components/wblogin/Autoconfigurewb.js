import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Route, useHistory } from "react-router-dom";

import { useToken } from "../App/useToken";
import { LoginService } from "../devlogin/LoginService";

export default function Autoconfigurewb({ setToken }) {
  const Entityinfo = {
    email: "",
    username: "",
    urlname: "",
    role: "",
    organization: "",
    accountid: "",
    entityaccountnumber: "",
    centralaccountnumber: "",
    entityemail: "",
    entityname: "",
    systemid: "",
    issuerid: "",
    funderid: "",
    entityid: "",
    marker: "",
  };

  const [email, setEmail] = useState();
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
    getdata();

  }, [wholesalebank]);

  useEffect(() => {
    getwholesalebanks();
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
    loginservice.getcentralbanks().then((data) => {
      if (data) {
      if(Array.isArray(data))
        setCentralbanks(data);
      }
    });
  }, []);

   const getwholesalebanks = async () => {
    try {
      const tokendata = await loginservice.getwholesalebanks();
      console.log(tokendata);
      if(Array.isArray(tokendata))
         setWholesalebanks(tokendata);
    } catch (err) {
      setError("Update failed " + err);
    }
  };

  const login = async () => {
    try {
      const tokendata = await loginservice.loginUser({
        email,

        password,
      });

      if (tokendata.token) {
        usetoken.saveToken(tokendata);

        console.log("testing");
        console.log(tokendata.user);

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

      var cent = centralbanks.filter(xx=> {
	      if(xx.entityid == tokendata.user.entityid) return true;
      });

      if(cent[0]) {
	      setCentralbank(cent[0]);
      }

    }
  };

  const autoconfigure = async () => {
    try {
      console.log(entityinfo);
      if (!centralbank) alert("Select central bank");

      const tokendata = await loginservice.configurewbentity(
        entityinfo,
        centralbank
      );

      const accounts = await loginservice.wbconfigcentralaccounts();
      getdata();
    } catch (err) {
      setError("Update failed " + err);
    }
  };


  return (
    <div className="col-12 ">
      <div className="card p-fluid">
        <h5 className="text-3xl text-center">Choose Centrabank and configure </h5>

        <div className="field text-2xl">
          <label htmlFor="entityname">
            Entity name: {entityinfo.entityname}
          </label>

        </div>
        <div className="field text-2xl">
          <label htmlFor="organization">
            Organization: {entityinfo.organization}
          </label>

        </div>

        <div className="field text-2xl">
          <label htmlFor="role">Role: {entityinfo.role}</label>
        </div>
        <div className="field text-2xl">
          <label htmlFor="Connected">Connected central bank: {entityinfo.entityid}</label>
        </div>
        <div className="field text-2xl">
          <label htmlFor="role">Central Bank: {centralbank.organization} </label>

          <Dropdown
            optionLabel="entityname"
            value={centralbank}
            options={centralbanks}
            onChange={(e) => setCentralbank(e.target.value)}
            placeholder="Select centralbank"
            style={{ height: "4rem", fontSize: "2.0rem" }}
          />
        </div>
      </div>
      <div className="field text-2xl">
        {/* Status:  */}
        <span className="text-pink-500">{error}</span>
        <div className="flex  align-items-center  justify-content-between">
          {/* <label>  */}
          <Button
            label="Configure centralbank"
            onClick={() => autoconfigure()}
            className=" m-3 text-2xl"
	    disabled = {entityinfo.entityid != ''}
          />
          <Button
            label="Refresh"
            onClick={() => getdata()}
            className=" m-3 text-2xl"
          />

          {/* </label> */}
        </div>
      </div>
    </div>
  );
}
