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
            $.ajax({
                url: this.getBaseURL()+"/odata/v4/production-warehouse/getUser()", // Replace with your URL
                type: "GET",
                dataType: "json", // Expected response format
                success: function (response) {
                  console.log("Success:", response);
                },
                error: function (xhr, status, error) {
                  console.error("Error:", error);
                }
              });
        },
        onGoPress:function(oEvent){
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
                    if(sPropertyName==="complaint_Id"){
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
        onNewComplaintPress: function () {
            let oView = this.getView();

            if (!this._NewComplaintDialog) {
                this._NewComplaintDialog = Fragment.load({
                    id: oView.getId(),
                    name: "pw.productionwarehouse.view.fragments.NewComplaintDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._NewComplaintDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onSubmitPress:function(){
            let oForm=this.getOwnerComponent().getModel("Formmodel").getProperty("/NewComplaintForm");
            this.ODataPost("/Complaints",oForm);
            this.onCancelPress();
        },
        onCancelPress:function(){
            this._NewComplaintDialog.then(function (oDialog) {
                oDialog.close();
            });
        }
    });
});