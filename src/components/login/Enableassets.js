import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Route, useHistory } from "react-router-dom";

import { useToken } from "../App/useToken";
import { LoginService } from "../devlogin/LoginService";

import { IssuanceService } from "../CBtabmenu/CBHome/IssuanceService";

export default function Enableassets({ setToken }) {
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

  const [sendinfo, setSendinfo] = useState(Sendinfo);
  const [entityinfo, setEntityinfo] = useState(Entityinfo);

  const [error, setError] = useState("");
  const [symbol, setSymbol] = useState("");
  const [newsymbol, setNewsymbol] = useState("");
  const [amount, setAmount] = useState(10000);

  const [role, setRole] = useState("");
  const [decimal, setDecimal] = useState(1);
  const [retaillimit, setRetaillimit] = useState(1000);
  const [assets, setAssets] = useState();
  const [totalassets, setTotalassets] = useState(0);

  const loginservice = new LoginService();

  const history = useHistory();

  const roles = ["Central bank", "Wholesale bank", "Exchange"];
  const decimals = [0, 1, 2];

  const issuanceservice = new IssuanceService();
  const usetoken = new useToken();

  useEffect(() => {
    var user = usetoken.getUser();
    setEntityinfo(user);
	 getassets1();
  }, []); //

  useEffect(() => {
     gotoproperrole();
  }, [entityinfo.role]); //

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
  };

  const getassets1 = async () => {
    var assets = await issuanceservice.getassets();

      var yy = assets.map(kk => {
        var { disabled, ...newResponse } = kk;
              newResponse.disable = kk.disabled;
              return  newResponse;
      });
	  console.log(yy.length);
	  setTotalassets(yy.length);
      setAssets(yy);

  };

  const enteramount = async (amt) => {
	  if(amt > 10000) amt = 10000;
	  setAmount(amt);
  };


  const enterretaillimit = async (amt) => {
	  if(amt > 5000) amt = 5000;
	  setRetaillimit(amt);
  };



  const disableasset = async () => {
    try {
      var data = {
        asset: symbol,
      };
      const tokendata = await loginservice.disableasset(data);
	    getassets1();
      setError("Success "); 
    } catch (err) {
//      setError("Update failed " + err);
    }
  };

  const enableasset = async () => {
    try {
      var data = {
        asset: symbol,
      };
      const tokendata = await loginservice.enableasset(data);
	    getassets1();
      setError("Success ");
    } catch (err) {
 //     setError("Update failed " + err);
    }
  };




  return (
    <div className="col-12 ">
      <div className="card p-fluid">
        <h5 className="text-3xl text-center">Enable/Disable  assets</h5>
	   <div className="field text-2xl">
	      Logged user:  {entityinfo?entityinfo.email: 'Not logged in'}

          </div>
	    <div className="field text-2xl">
          <label>             Organization:  {entityinfo?entityinfo.organization: 'NA'} </label>
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
	  <p>  Total assets : {totalassets}</p>
	  <p>  Asset : {symbol.issuetype}</p>
	  <p>  Disabled : {symbol.disable}</p>
        </div>

      <div className="field text-2xl">
        {/* Status: */}
        <span className="text-pink-500">{error}</span>
        <div className="flex  align-items-center  justify-content-between">
          {/* <label> */}
          <Button
            label="Enable asset"
            onClick={() => enableasset()}
            className=" m-3 text-2xl"
          />
          <Button
            label="Disable asset"
            onClick={() => disableasset()}
            className=" m-3 text-2xl"
          />
          {/* </label> */}
        </div>

      </div>
      </div>
    </div>
  );
}
