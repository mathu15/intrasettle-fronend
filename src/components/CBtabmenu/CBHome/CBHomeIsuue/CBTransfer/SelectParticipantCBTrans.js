import React from "react";
import { Dropdown } from "primereact/dropdown";

// page for select paricipant step
const SelectParticipantCBTrans = ({ data, setData, subscribers }) => {
/*
  const dropdownValues = [
    { label: "WHOLESALEONE" },
    { label: "WHOLESALETWO" },
    { label: "WHOLESALETHREE" },
  ];
*/

  return (
    <div className="grid p-fluid">
      <div className="col-12 ">
        <div className="text-center text-xl">
          <p className="text-center text-3xl">
            select available participant to transfer.
          </p>
          <Dropdown
            value={data.participant}
            onChange={(e) => setData({ ...data, participant: e.target.value })}
            options={subscribers}
            optionLabel="organization"
            placeholder="Select"
            style={{ height: "4rem", fontSize: "1.4rem" }}
            className="p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectParticipantCBTrans;
