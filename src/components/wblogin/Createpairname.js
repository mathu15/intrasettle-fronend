import React, {useEffect, useState } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from "primereact/button";

import { Dropdown } from 'primereact/dropdown';
import { Route, useHistory } from "react-router-dom";

import { InputNumber } from "primereact/inputnumber";
import { useToken }  from '../App/useToken';
import { LoginService }  from '../devlogin/LoginService';

import { IssuanceService } from '../CBtabmenu/CBHome/IssuanceService';




export default function Createpairname({ setToken }) {

const Entityinfo = {
        email: '', 
        username: '',
        urlname: '',
        role:  '', 
        organization: '', 
        accountid: '', 
	entityaccountnumber: '',
	centralaccountnumber: '',
	entityemail: '',
	entityname: '',
	systemid: '',
	issuerid: '',
	funderid: '',
	entityid: '',
	marker: '',
};


const Sendinfo = {
	systemid: '',
	toaccountnumber: '',
	symbol : '',
	amount : ''
};

const [email, setEmail] = useState();
const [password, setPassword] = useState();

const [sendinfo, setSendinfo] = useState(Sendinfo);
const [entityinfo, setEntityinfo] = useState(Entityinfo);

const [error, setError] = useState('');
const [symbol, setSymbol] = useState('');
const [selectedpair, setSelectedpair] = useState({});
const [pairname, setPairname] = useState('');
const [firstissuetype, setFirstissuetype] = useState('');
const [secondissuetype, setSecondissuetype] = useState('');
const [amount, setAmount] = useState('');

const [role, setRole] = useState('');
const [baseprice, setBaseprice] = useState(1.1);
const [fraction, setFraction] = useState(1);
const [assets, setAssets] = useState();
const [pairs, setPairs] = useState([]);

const loginservice = new LoginService();


const history = useHistory();

const roles = [
    'Central bank','Wholesale bank','Exchange'
];

const issuanceservice = new IssuanceService();
const usetoken = new useToken();

   useEffect(() => {

      var user = usetoken.getUser();
      setEntityinfo(user);
     var xx = async () => {
   var pairs = await issuanceservice.getpairs();
   setPairs(pairs);
	   }

	   xx();

  }, []); //

  useEffect(() => {
     gotoproperrole();
  }, [entityinfo.role]); //

 const gotoproperrole = async () => {

     if(entityinfo.role == "Central bank") {
	     alert("Logged in as Central bank, going to central bank admin");
                history.push('/admincb')
     }
  };

const getdata1 = async () => {
	 const tokendata = await loginservice.getlatestuser();
      if(tokendata.token) {
      usetoken.saveToken(tokendata);
      setEntityinfo(tokendata.user);
      }

}

const getpairs = async () => {
   var pairs = await issuanceservice.getpairs();
   setPairs(pairs);
}

const getassets1 = async () => {
   var assets = await issuanceservice.getassets();
   setAssets(assets);
}

const disablepair = async () => {

     var data = {
                   pairname: selectedpair.pairname
           };

	
   var assets = await loginservice.disablepairname(data);
}


const enablepair = async () => {
   var data = {
                   pairname: selectedpair.pairname
           };

   var assets = await loginservice.enablepairname(data);
}


const createpair = async () => {

    try {

	   var data = {
		   pairname: pairname,
		   firstissuetype: firstissuetype,
		   secondissuetype: secondissuetype,
		   baseprice: baseprice
	   };
    const tokendata = await loginservice.createpairname(data);
           setError("Success "+ tokendata)

    } catch(err) {

           setError("Update failed "+ err)
    }

  }

const setpairprice = async () => {

    try {

           var data = {
                   pairname: selectedpair.pairname,
                   baseprice: baseprice
           };
    const tokendata = await loginservice.setpairprice(data);
           setError("Success "+ tokendata)

    } catch(err) {

           setError("Update failed "+ err)
    }

  }


  return(

   <div className="login-wrapper">

  <TabView>
    <TabPanel header="CREATE PAIR ">

      <h1>Create pair for atomic swap</h1>

    <label>
          <p>Pairs : {selectedpair.pairname} </p>
          <Dropdown optionLabel="pairname"  
	  options={pairs} onChange={(e) => setSelectedpair(e.target.value)}   placeholder="Select a pair"/>

        </label>




	 <label>

          <p>New pairname {pairname}</p>

          <input type="text" placeholder="new pairname" onChange={e =>  setPairname( e.target.value) }/>

        </label>

        <label>

          <p>First symbol </p>

          <input type="text" placeholder="first" onChange={e =>  setFirstissuetype( e.target.value) }/>

        </label>


	      <label>

          <p>Second symbol </p>

          <input type="text" placeholder=" second" onChange={e =>  setSecondissuetype( e.target.value) }/>

        </label>

   <label>

          <p>Set approx price : {baseprice} </p>


          <InputNumber
            id="price"
            value={baseprice}
            minFractionDigits={fraction} maxFractionDigits={fraction}
            onChange={(e) => setBaseprice(e.value )}
            showButtons
            mode="decimal"
            min={0}
            style={{ height: "4rem", fontSize: "2.0rem" }}
          ></InputNumber>



        </label>




        <div>
        <label>
          <p>Status</p>
          {error}
        </label>

        </div>
        <div>

        <label>
          <button onClick={()=> createpair () } >Create pair </button>
          <button onClick={()=> getpairs()} >Refresh</button>
        </label>

        </div>
    </TabPanel>
    <TabPanel header="Enable/Disable">

    <label>
          <p>Pairs </p>
          <Dropdown optionLabel="pairname"  options={pairs} onChange={(e) => setSelectedpair(e.target.value)}   placeholder="Select a pair"/>

        </label>




    <label>

          <p>Selected pairname {selectedpair.pairname}</p>


        </label>

       <label>
          <button onClick={()=> disablepair()} >Disable pair</button>
          <button onClick={()=> enablepair()} >Enable  pair</button>
          <button onClick={()=> getpairs()} >Refresh</button>
        </label>

    </TabPanel>
    <TabPanel header="Base price">
        
    <label>
          <p>Pairs </p>
          <Dropdown optionLabel="pairname"  options={pairs} onChange={(e) => setSelectedpair(e.target.value)}   placeholder="Select a pair"/>

        </label>




    <label>

          <p>Selected pairname {selectedpair.pairname}</p>


        </label>


              <label>

          <p>Current set price : {selectedpair.baseprice} </p>
          <p>Set approx price : {baseprice} </p>

              </label>
              <label>

	  <InputNumber
            id="price"
	    value={baseprice}
            minFractionDigits={fraction} maxFractionDigits={fraction}
            onChange={(e) => setBaseprice(e.value )}
            showButtons
            mode="decimal"
            min={0}
            style={{ height: "4rem", fontSize: "2.0rem" }}
          ></InputNumber>



        </label>

    <div className="flex  align-items-center  justify-content-between">
            {/* <label> */}
            <Button
              label="Set approx price"
              onClick={() => setpairprice()}
              className=" m-3 text-2xl"
            />


            {/* </label> */}
          </div>


    </TabPanel>
  </TabView>


   </div>

  )

};
