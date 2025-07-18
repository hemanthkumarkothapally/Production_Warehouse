sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "pw/productionwarehouse/controller/BaseController",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], (Controller,Fragment,BaseController,Filter,FilterOperator) => {
    "use strict";

    return BaseController.extend("pw.productionwarehouse.controller.ProductionWarehouseComplaints", {
        onInit() {
            this.getRouter().getRoute("RouteProductionWarehouseComplaints").attachPatternMatched(this._onRouterProductionWarehouseComplaintsMatched,this)
        },
        _onRouterProductionWarehouseComplaintsMatched:function(oEvent){
            let oComplaints={
                "status":"DRAFT",
                "complaintDetails": {
                    "seriousness": null
                },
                "items": [],
                "attachments": []
            }
            this.getLocalModel("DetailsModel").setProperty("/Complaint",oComplaints);
            console.log(oEvent);
        },
        onGoBtnPress:function(oEvent){
            // let oFilteritems=oEvent.getParameters().selectionSet.map(item=> {
            //     return { "sproperty":item.getParent().getProperty("name"), "value":item._lastValue };
            //  })
            // console.log(oFilteritems)
            // let aFilters=oFilteritems.map(function (item) {
            //     return new Filter({
            //         path: ,
            //         operator: FilterOperator.Contains,
            //         value1: sSelectedKey
            //     });
            // });
              
            let oFilterbar = this.byId("idFilterBar") 
            let aFilterItems= oFilterbar.getAllFilterItems();
            let aFilters=[]
           
            aFilterItems.forEach((aFilterItem) => {
                let sPropertyName = aFilterItem.getName();
               let aSelectedKeys=aFilterItem.getControl().getSelectedKeys();
               if (aSelectedKeys) {
                aSelectedKeys.forEach(sValue=>{
                    if(sPropertyName==="ID"){
                        aFilters.push(new Filter(sPropertyName, "EQ", sValue));
                    }
                    else{
                        aFilters.push(new Filter(sPropertyName, "Contains", sValue));
                    }
                }
                )
            }
            });
            let oTable = this.byId("idComplaintsTable");
            let oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);

        },
        onNewComplaintBtnPress: function () {
            this.getRouter().navTo("RouteProductionWarehouseDetails",{ ID: 'NEW'});
        },
        onRowSelection: async function(oEvent){
            let oModel = this.getModel();
            let oData=oEvent.getSource().getBindingContext().getObject();
            let sPath="/Complaints('"+oData.ID+"')";
            let oContext = oModel.bindContext(sPath, undefined, { $expand: "complaintDetails,items,attachments" });
            let oDetail = await oContext.requestObject().then(function (oData) {
                console.log(oData);
              return oData;
            })
            this.getLocalModel("DetailsModel").setProperty("/Complaint",oDetail);
            this.getRouter().navTo("RouteProductionWarehouseDetails",{ ID: oData.ID});

        }
       
    });
});