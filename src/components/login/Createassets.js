import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Route, useHistory } from "react-router-dom";

import { useToken } from "../App/useToken";
import { LoginService } from "../devlogin/LoginService";

import { IssuanceService } from "../CBtabmenu/CBHome/IssuanceService";

export default function Createassets({ setToken }) {
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
  const [maxdisabled, setMaxdisabled] = useState(false);
  const [maximumessage, setMaximumessage] = useState('');

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
	  setTotalassets(zz.length);
	  if(zz.length > 0) {
	    setMaximumessage ("Maximum 1 type of asset (testnet)")
		  setMaxdisabled(true);
	  }else {
	    setMaximumessage ("")
		  setMaxdisabled(false);
	  }
    setAssets(zz);

  };

  const enteramount = async (amt) => {
	  if(amt > 10000) amt = 10000;
	  setAmount(amt);
  };


  const enterretaillimit = async (amt) => {
	  if(amt > 5000) amt = 5000;
	  setRetaillimit(amt);
  };



  const createasset = async () => {
    try {
      var data = {
        symbol: newsymbol,
	      decimal: decimal,
	      retaillimit: retaillimit,
	      supply: amount
      };
      const tokendata = await loginservice.createasset(data);
      setError("Success "); 
    } catch (err) {
      setError("Update failed " + err);
    }
  };



  return (
    <div className="col-12 ">
      <div className="card p-fluid">
        <h5 className="text-3xl text-center">Central bank create assets</h5>
	   <div className="field text-2xl">
	      Logged user: {entityinfo?entityinfo.email: 'Not logged in'}

          </div>
	    <div className="field text-2xl">
          <label>             Organization:  {entityinfo?entityinfo.organization: 'NA'} </label>
          </div>


       <div className="field text-2xl">
          <p>  Enabled assets with entity : {totalassets}</p>
        </div>


        <div className="field text-2xl">
          <label htmlFor="newasset">New asset: {newsymbol}</label>

          <InputText
            id="newasset"
            type="text"
            placeholder="Digital_sym"
            onChange={(e) => setNewsymbol(e.target.value)}
            style={{ height: "4rem", fontSize: "2.0rem" }}
          />
        </div>

        <div className="field text-2xl">
          <label htmlFor="amount">Total assets (Max 10000 in testnet) : {amount} </label>

          <InputText
            id="amount"
            type="number"
            placeholder="amount"
            onChange={(e) => enteramount(e.target.value)}
            style={{ height: "4rem", fontSize: "2.0rem" }}
          />
        </div>

	    <div className="field text-2xl">
          <label htmlFor="retaillimit">Limit/per bank: {retaillimit}  </label>

          <InputText
            id="retaillimit"
            type="number"
            placeholder="Limit per bank"
            onChange={(e) => enterretaillimit(e.target.value)}
            style={{ height: "4rem", fontSize: "2.0rem" }}
          />
        </div>


	   <div className="field text-2xl">
          <label htmlFor="decimals">Decimal:  {decimal}</label>

          <Dropdown
            value={decimal}
            options={decimals}
            onChange={(e) => setDecimal(e.target.value)}
            placeholder="Select the decimal "
            id="decimals"
            className="text-2xl"
            style={{ height: "4rem", fontSize: "2.0rem" }}
          />
        </div>





      </div>
      <div className="field text-2xl">
	  <span className="text-pink-500">{maximumessage}</span>
	  <span className="text-pink-500">{error}</span>
        <div className="flex  align-items-center  justify-content-between">
          {/* <label> */}
          <Button
            label="Create Asset"
            onClick={() => createasset()}
            className=" m-3 text-2xl"
	    disabled={maxdisabled}
          />

        </div>
      </div>
      <div className="field text-2xl">
        {/* Status: */}
        <span className="text-pink-500">{error}</span>
        <div className="flex  align-items-center  justify-content-between">
          {/* <label> */}
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
