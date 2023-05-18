import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function WBOAtomicmarketDepth({ buy, sell }) {
  const bpriceBodyTemplate = (rowData) => {
    return <span className="text-green-400"> {rowData.buyprice} </span>;
  };

  const bamountBodyTemplate = (rowData) => {
    return rowData.buyamount;
  };

  const spriceBodyTemplate = (rowData) => {
    return (
      <span className="text-red-400 text-right"> {rowData.sellprice} </span>
    );
  };

  const samountBodyTemplate = (rowData) => {
    return rowData.sellamount;
  };
  return (
    <div className="grid table-demo">
      <div className="col-12">
        <div className="card border-1 border-100">
          <div className="flex ml-7">
            <DataTable
              value={sell}
              scrollable
              scrollHeight="350px"
              responsiveLayout="scroll"
              className="text-xl border-none"
            >
              <Column
                field="price"
                header="Volume"
                sortable
                style={{ width: "35%" }}
                body={samountBodyTemplate}
                className="text-xl border-none "
              />
              <Column
                field="price"
                header="Sell Price"
                sortable
                style={{ width: "35%" }}
                body={spriceBodyTemplate}
                className="text-xl border-none "
              />
            </DataTable>
            <DataTable
              value={buy}
              scrollable
              scrollHeight="350px"
              responsiveLayout="scroll"
              className="text-xl border-none"
            >
              <Column
                field="price"
                header="Buy Price"
                sortable
                style={{ width: "35%" }}
                body={bpriceBodyTemplate}
                rows={5}
                className="text-xl border-none"
              />
              <Column
                field="price"
                header="Volume"
                sortable
                style={{ width: "35%" }}
                body={bamountBodyTemplate}
                rows={5}
                className="text-xl border-none"
              />
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WBOAtomicmarketDepth;
