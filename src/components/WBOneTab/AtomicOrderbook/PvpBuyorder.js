import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { IssuanceServiceWBOB } from "./issuanceServiceWBOB";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputNumber } from "primereact/inputnumber";
import * as _ from "lodash";

const PvpBuyorder = ({
  user,
  price,
  fraction,
  firstcurrency,
  secondcurrency,
  chosenpair,
  setOrderplacedbuy,
}) => {
  const [displayBasic, setDisplayBasic] = useState(false);
  const [totalvalue, setTotalvalue] = useState(0);
  const [wholesalebanks, setWholesalebanks] = useState([]);
  const [wholesalebank, setWholesalebank] = useState({});
  const [organization, setOrganization] = useState("");
  //const [fraction, setFraction] = useState(1);

  const [data, setData] = useState({
    price: price,

    volume: 0,
    total: 0,
  });
  /*
  const [data1, setData1] = useState({
    price: price,

    volume: 0,
    total: 0,
  });
	*/

  //  const totalvalue = data.price * data.volume;

  console.log("data", data);

  const issuanceServiceWBOB = new IssuanceServiceWBOB();
  useEffect(() => {
    getwholesalebanks();
  }, []);

  const getwholesalebanks = async () => {
    try {
      const wbs = await issuanceServiceWBOB.getwholesalebanks();
      console.log(wbs);
      var rem = wbs.filter((xx) => {
        if (xx.subcentralaccountnumber != user.subcentralaccountnumber)
          return true;
      });
      // subcentralaccountnumber
      setWholesalebanks(rem);
    } catch (err) {}
  };

  const placeatombuyorder = async () => {
    if (!wholesalebank || !wholesalebank.subcentralaccountnumber) {
      alert("Select the bank to trade");
      return;
    }

    //    /atomicexchange/createmakeorder
    var ret = await issuanceServiceWBOB.placeatombuyorder(
      wholesalebank.subcentralaccountnumber,
      chosenpair,
      firstcurrency,
      secondcurrency,
      data.price,
      data.volume
    );
    console.log(ret);
    if (ret && ret.code == -1) {
      ret = await issuanceServiceWBOB.placeatombuyorder(
        wholesalebank.subcentralaccountnumber,
        chosenpair,
        firstcurrency,
        secondcurrency,
        data.price,
        data.volume
      );
    }

    if (ret && ret.code == -2) {
      alert("System error, contact support, error code " + ret.track);
      return;
    }

    if (ret && ret.code == -1) {
      alert(
        "Order failed : needed " +
          ret.needed +
          " " +
          ret.neededsymbol +
          " found " +
          ret.found +
          " error code " +
          ret.track
      );
      return;
    }

    if (_.has(ret, "error")) {
      /*
                 *
                "side": "atomicbuyside",
                "needed": 190,
                "neededsymbol": "Digital_INR",
                "error": "failed to prepare"
                 * */

      if (Number(ret.needed) < Number(ret.found)) {
        alert(
          "Merging in progress : needed " +
            ret.needed +
            " " +
            ret.neededsymbol +
            " found " +
            ret.found
        );
        alert("Try after some time");
        return;
      } else {
        alert(
          "Order failed : needed " +
            ret.needed +
            " " +
            ret.neededsymbol +
            " found " +
            ret.found
        );
        alert("Check balance ");
        return;
      }
    }

    if (_.has(ret, "transactionid")) {
      alert("Order success");
    }

    setOrderplacedbuy(true);
  };

  const showSuccess = () => {
    toast.success("Order placed ", {
      // position: "top-right",
      // autoClose: 5000,
      // hideProgressBar: false,
      // closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      // progress: undefined,
      // theme: "colored",
      // theme: "dark",
    });
  };

  const clickAtomBuy = () => {
    placeatombuyorder();

    setDisplayBasic(false);
    showSuccess();
    //setData1(data);
  };

  useEffect(() => {
    const tmpvalue = data.price * data.volume;
    setTotalvalue(tmpvalue);
    setData({ ...data, total: tmpvalue });
  }, [data.price, data.volume]);

  return (
    <div className="card border-2 border-green-400 grid p-fluid">
      <div className="col-12 text-center">
        <div className="flex justify-space-between gap-4 text-center card border-1 border-100 bg-gray-800 text-xl w-full">
          <label>
            <p>Choose bank to trade</p>
            <Dropdown
              optionLabel="organization"
              value={wholesalebank}
              options={wholesalebanks}
              onChange={(e) => {
                setWholesalebank(e.target.value);
              }}
              placeholder="Select bank to trade"
            />
          </label>
        </div>
        <div className="flex justify-space-between gap-4 text-center card border-1 border-100 bg-gray-800 text-xl w-full">
          <label style={{ fontSize: "1.2rem" }} htmlFor="amount">
            Price-{secondcurrency}
          </label>
          <InputNumber
            id="amount"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.value })}
            minFractionDigits={fraction.second}
            maxFractionDigits={fraction.second}
            showButtons
            mode="decimal"
            min={0}
            max={10000000}
            style={{ height: "3rem", fontSize: "1.5rem" }}
            className="p-inputnumber"
          ></InputNumber>
        </div>
        <div className="flex justify-space-between gap-4 text-center card border-1 border-100 bg-gray-800 text-xl w-full">
          <label style={{ fontSize: "1.2rem" }} htmlFor="amount">
            Volume-{firstcurrency}
          </label>
          <InputNumber
            id="amount"
            value={data.volume}
            onChange={(e) => setData({ ...data, volume: e.value })}
            showButtons
            minFractionDigits={fraction.first}
            maxFractionDigits={fraction.first}
            mode="decimal"
            min={0}
            max={10000000}
            style={{ height: "3rem", fontSize: "1.5rem" }}
            className="p-inputnumber"
          ></InputNumber>
        </div>
        <div className="flex justify-space-between gap-4 text-center card border-1 border-100 bg-gray-800 text-xl w-full">
          <label style={{ fontSize: "1.2rem" }} htmlFor="amount">
            Total-{secondcurrency}
          </label>
          <InputNumber
            id="amount"
            value={totalvalue}
            onChange={(e) => setData({ ...data, total: e.value })}
            minFractionDigits={fraction.second}
            maxFractionDigits={fraction.second}
            showButtons
            mode="decimal"
            min={0}
            max={10000000}
            style={{ height: "3rem", fontSize: "1.5rem" }}
            className="p-inputnumber"
          ></InputNumber>
        </div>
        <div className="p-5">
          <div className="flex align-items-center justify-content-between">
            <div className="w-6rem text-white font-bold flex align-items-center justify-content-center mr-3">
              <Dialog
                header={`Buy ${firstcurrency} for ${secondcurrency}`}
                visible={displayBasic}
                modal
                onHide={() => setDisplayBasic(false)}
              >
                <Card
                  style={{ marginBottom: "2rem" }}
                  className="transition-colors transition-duration-500 hover:bg-gray-900 "
                >
                  <div className="flex align-items-center ">
                    <div>
                      <p className="text-3xl border-bottom-1 surface-border p-2">
                        At Price {data.price}
                      </p>
                      <p className="text-2xl">Volume {data.volume}</p>
                      <p className="text-2xl">Total {data.total.toFixed(2)} </p>
                    </div>
                  </div>
                </Card>

                <div className="flex align-items-center ">
                  <Button
                    type="button"
                    // icon="pi pi-minus"

                    label=" CONFIRM BUY"
                    onClick={() => clickAtomBuy()}
                  />
                </div>
              </Dialog>
              <ToastContainer
                // position="top-right"
                // autoClose={5000}
                // hideProgressBar={false}
                // newestOnTop={false}
                // closeOnClick
                // rtl={false}
                // pauseOnFocusLoss
                // draggable
                // pauseOnHover
                // theme="colored"
                className="text-2xl"
                style={{ width: "70rem" }}
              />
              <div className="w-full p-button-success">
                <Button
                  onClick={() => setDisplayBasic(true)}
                  label="PROPOSE BUY"
                  className="font-bold p-button-success"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PvpBuyorder;
