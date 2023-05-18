import React, { useEffect, useState } from "react";
//import { ConsoleLogger } from '../Log/Logger';
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Route, useHistory } from "react-router-dom";

import { useToken } from "../App/useToken";
import { LoginService } from "../devlogin/LoginService";

import { IssuanceService } from "../CBtabmenu/CBHome/IssuanceService";

export default function Transmitassets({ setToken }) {
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

  const Sendinfo = {
    systemid: "",
    toaccountnumber: "",
    symbol: "",
    amount: "",
  };

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [available, setAvailable] = useState(0);

  const [sendinfo, setSendinfo] = useState(Sendinfo);
  const [entityinfo, setEntityinfo] = useState(Entityinfo);

  const [error, setError] = useState("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");

  const [role, setRole] = useState("");
  const [assets, setAssets] = useState();

  const loginservice = new LoginService();

  const history = useHistory();

  const roles = ["Central bank", "Wholesale bank", "Exchange"];

  const issuanceservice = new IssuanceService();
  const usetoken = new useToken();
//  const consolelogger = new ConsoleLogger();

  useEffect(() => {
    var user = usetoken.getUser();
    setEntityinfo(user);
	  getassets1();
  }, []); //

   useEffect(() => {
     gotoproperrole();
  }, [entityinfo.role]); //

   useEffect(() => {
    availableformint();
  }, [symbol.issuetype]); //
 const gotoproperrole = async () => {

     if(entityinfo.role == "Wholesale bank") {
             alert("Logged in as Wholesale bank, going to Wholesale bank admin");
                history.push('/adminwb')
     }
  };


  const getdata1 = async () => {
    const tokendata = await loginservice.getlatestuser();
    if (tokendata.token) {
      usetoken.saveToken(tokendata);
      setEntityinfo(tokendata.user);
    }
	  getassets1();
  };

  const getassets1 = async () => {
    var assets = await issuanceservice.getassets();
    var yy = assets.map(kk => {
        var { disabled, ...newResponse } = kk;
              newResponse.disable = kk.disabled;
              return  newResponse;
      });
    var zz = yy.filter(pp => {
	    if(pp.disable != 'yes')
		    return true;
    });
    setAssets(zz);
  };

  const sendtoentity = async () => {
    try {
      var data = {
        systemid: entityinfo.systemid,
        toaccountnumber: entityinfo.entityaccountnumber,
        symbol: symbol.issuetype,
        amount: Number(symbol.satspertoken * amount),
      };

      const tokendata = await loginservice.sendfromsource(data);
      setError("Success " + tokendata.txid);
    } catch (err) {
      setError("Update failed " + err);
    }
  };

  const availableformint = async () => {
      var data = {
        symbol: symbol.issuetype
      };
      const tokendata = await loginservice.availableformint(data);

      console.log(tokendata);
      setAvailable(tokendata.balance);
  };

  const sendtocentral = async () => {
    try {
      var data = {
        systemid: entityinfo.systemid,
        toaccountnumber: entityinfo.centralaccountnumber,
        symbol: symbol.issuetype,
        amount: Number(symbol.satspertoken * amount),
      };

      const tokendata = await loginservice.sendfromsource(data);
      setError("Success " + tokendata.txid);
    } catch (err) {
      setError("Update failed " + err);
    }
  };

  return (
    <div className="col-12 ">
      <div className="card p-fluid">
        <h5 className="text-3xl text-center">CENTRAL BANK</h5>
	   <div className="field text-2xl">
          <label>	      Logged user:  {entityinfo?entityinfo.email: 'Not logged in'} </label>

          </div>
	   <div className="field text-2xl">
          <label>	      Organization:  {entityinfo?entityinfo.organization: 'NA'} </label>
          </div>

        <div className="field text-2xl">
          <label htmlFor="assets">Assets</label>

          <Dropdown
            value={symbol}
            options={assets}
            optionLabel="issuetype"
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Select a Asset"
            id="assets"
            className="text-2xl"
            style={{ height: "4rem", fontSize: "2.0rem" }}
          />
        </div>
        <div className="field text-2xl">
          <label htmlFor="amount">Amount</label>

          <InputText
            id="amount"
            type="number"
            placeholder="amount"
            onChange={(e) => setAmount(e.target.value)}
            style={{ height: "4rem", fontSize: "2.0rem" }}
          />
        </div>
       <div className="field text-2xl">
          <label htmlFor="maximum">Max: {symbol.amount}</label>
        </div>

       <div className="field text-2xl">
          <label htmlFor="satspertoken">SPT: {symbol.satspertoken}</label>
        </div>
       <div className="field text-2xl">
          <label htmlFor="available">Available: {available}</label>
        </div>

        <div className="field text-2xl">
          <label htmlFor="entiityid">Entity id: {entityinfo.entityid}</label>

        </div>
        <div className="field text-2xl">
          <label htmlFor="entityaccno">
            Entity account : {entityinfo.entityaccountnumber}
          </label>

        </div>
        <div className="field text-2xl">
          <label htmlFor="centralaccno">
            Central account : {entityinfo.centralaccountnumber}
          </label>

        </div>
      </div>
      <div className="field text-2xl">
        {/* Status: */}
        <span className="text-pink-500">{error}</span>
        <div className="flex  align-items-center  justify-content-between">
          {/* <label> */}
          <Button
            label="Transmit to central entity"
            onClick={() => sendtoentity()}
            className=" m-3 text-2xl"
          />
          <Button
            label="Refresh"
            onClick={() => getdata1()}
            className=" m-3 text-2xl"
          />

          {/* </label> */}
        </div>
      </div>
    </div>
  );
}
