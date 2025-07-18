sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "pw/productionwarehouse/controller/BaseController",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/m/MessageToast"
], (Controller, BaseController, Fragment, Filter,MessageToast) => {
    "use strict";

    return BaseController.extend("pw.productionwarehouse.controller.ProductionWarehouseDetails", {
        onInit() {
            this.getRouter().getRoute("RouteProductionWarehouseDetails").attachPatternMatched(this._onRouterProductionWarehouseDetailsMatched, this)
        },
        _onRouterProductionWarehouseDetailsMatched: function (oEvent) {
            this.byId("idItemsVBox").destroyItems();
            let oArguments = oEvent.getParameter("arguments");
            let sStatus=this.getOwnerComponent().getModel("DetailsModel").getProperty("/Complaint/status");
            this._oID = oArguments.ID;
            if(this._oID!="NEW" && sStatus!="DRAFT"){
                this.getOwnerComponent().getModel("DetailsModel").setProperty("/editable",false);
            }
            else{
                this.getOwnerComponent().getModel("DetailsModel").setProperty("/editable",true);

            }
            let aItems=this.getOwnerComponent().getModel("DetailsModel").getProperty("/Complaint/items");
            if(this._oID!="NEW" && aItems.length > 0){
                this._buildItemDetailsForms(aItems);
            }
            console.log(this._oID);
        },
        _buildItemDetailsForms:function(aItems){
            let oItemsBox = this.byId("idItemsVBox");
            aItems.forEach(item=>{
                let oSimpleForm = new sap.ui.layout.form.SimpleForm({
                    layout: "ColumnLayout",
                    columnsM: 2,
                    editable: true,
                    toolbar: new sap.m.Toolbar({
                        content: [
                            new sap.m.Title({ text: item.product_ID, level: "H3" }),
                            new sap.m.ToolbarSpacer(),
                            new sap.m.Button({
                                icon: "sap-icon://delete",
                                type: "Reject",
                                enabled:"{DetailsModel>/editable}",
                                press: function (oEvent) {
                                    try {
                                        let sForm=oEvent.getSource().getParent().getParent().getParent();
                                        sForm.destroy();
                                        MessageToast.show("Form closed successfully");
                                    } catch (error) {
                                        MessageToast.show("Form not closed");
                                    }

                                }.bind(this)
                            })
                        ]
                    }),
                    content: [
                        new sap.m.Label({ text: "product_ID", required: true, visible: false }),
                        new sap.m.Input({ value: item.product_ID, visible: false }),
                        new sap.m.Label({ text: "Supplier", required: true }),
                        new sap.m.Input({value: item.supplier,editable:"{DetailsModel>/editable}"}),
                        new sap.m.Label({ text: "Batch No", required: true }),
                        new sap.m.Input({value: item.batchNo,editable:"{DetailsModel>/editable}"}),
                        new sap.m.Label({ text: "Production", required: true }),
                        new sap.m.DatePicker({ value: item.productionDate, displayFormat: 'dd/MM/y', valueFormat: 'yyyy-MM-dd',editable:"{DetailsModel>/editable}" }),
                        new sap.m.Label({ text: "Expiration", required: true }),
                        new sap.m.DatePicker({ value: item.expirationDate, displayFormat: 'dd/MM/y', valueFormat: 'yyyy-MM-dd',editable:"{DetailsModel>/editable}" }),
                        new sap.m.Label({ text: "lot code", required: true }),
                        new sap.m.Input({value: item.lotCode,editable:"{DetailsModel>/editable}"}),
                        new sap.m.Label({ text: "Received On", required: true }),
                        new sap.m.DatePicker({ value: item.receivedOn, displayFormat: 'dd/MM/y', valueFormat: 'yyyy-MM-dd' ,editable:"{DetailsModel>/editable}"}),
                        new sap.m.Label({ text: "Qty", required: true }),
                        new sap.m.Input({value: item.quantity,editable:"{DetailsModel>/editable}"}),
                        new sap.m.Label({ text: "Invoice Number", required: true }),
                        new sap.m.Input({value: item.invoiceNumber,editable:"{DetailsModel>/editable}"})
                    ]
                });
    
                oItemsBox.addItem(oSimpleForm)
            })
        },
        onDeclineBtnPress: function () {
            this.getRouter().navTo("RouteProductionWarehouseComplaints");
        },
        onAddItemBtnPress: function (oEvent) {
            if (!this._ItemsDialog) {
                this._ItemsDialog = this.loadFragment("pw.productionwarehouse.view.fragments.ItemsDialog")
            }
            this._ItemsDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onCancelDialogPress: function () {
            this._ItemsDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onItemsSearch: function (oEvent) {
            let sQuery = oEvent.getSource().getValue();
            let aFilters = [];
            if (sQuery && sQuery.length > 0) {
                let sFilter = new Filter("supplier", "Contains", sQuery);
                aFilters.push(sFilter);
            }
            let oItemsList = this.byId("idItemsList");
            let oBinding = oItemsList.getBinding("items");
            oBinding.filter(aFilters);
        },
        onItemSelection: function (oEvent) {
            let oProductData=oEvent.getSource().getBindingContext().getObject();
            let sProductId = oProductData.ID;
            let oItemsBox = this.byId("idItemsVBox");
            // let oId=jQuery.sap.uid("dynamicForm_");
            // console.log(oId);
            let oSimpleForm = new sap.ui.layout.form.SimpleForm({
                // id: oId,
                layout: "ColumnLayout",
                columnsM: 2,
                editable: true,
                toolbar: new sap.m.Toolbar({
                    content: [
                        new sap.m.Title({ text: oProductData.productName, level: "H3" }),
                        new sap.m.ToolbarSpacer(),
                        new sap.m.Button({
                            icon: "sap-icon://delete",
                            type: "Reject",
                            press: function (oEvent) {
                                try {
                                    let sForm=oEvent.getSource().getParent().getParent().getParent();
                                    sForm.destroy();
                                    MessageToast.show("Form closed successfully");
                                } catch (error) {
                                    MessageToast.show("Form not closed");
                                }
                            }.bind(this)
                        })
                    ]
                }),
                content: [
                    new sap.m.Label({ text: "product_ID", required: true, visible: false }),
                    new sap.m.Input({ value: sProductId, visible: false }),
                    new sap.m.Label({ text: "Supplier", required: true }),
                    new sap.m.Input(),
                    new sap.m.Label({ text: "Batch No", required: true }),
                    new sap.m.Input(),
                    new sap.m.Label({ text: "Production", required: true }),
                    new sap.m.DatePicker({ dateValue: new Date(), displayFormat: 'dd/MM/y', valueFormat: 'yyyy-MM-dd' }),
                    new sap.m.Label({ text: "Expiration", required: true }),
                    new sap.m.DatePicker({ dateValue: new Date(), displayFormat: 'dd/MM/y', valueFormat: 'yyyy-MM-dd' }),
                    new sap.m.Label({ text: "lot code", required: true }),
                    new sap.m.Input(),
                    new sap.m.Label({ text: "Received On", required: true }),
                    new sap.m.DatePicker({ dateValue: new Date(), displayFormat: 'dd/MM/y', valueFormat: 'yyyy-MM-dd' }),
                    new sap.m.Label({ text: "Qty", required: true }),
                    new sap.m.Input(),
                    new sap.m.Label({ text: "Invoice Number", required: true }),
                    new sap.m.Input()
                ]
            });

            oItemsBox.addItem(oSimpleForm)
            // console.log(this.byId(oId).getContent())
            this.onCancelDialogPress();
        },
        onUploadBtnPress: function () {
            if (!this._UploadDialog) {
                this._UploadDialog = this.loadFragment("pw.productionwarehouse.view.fragments.UploadDialog")
            }

            this._UploadDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onFileUploadPress: function () {
            let oFileUploader = this.byId("idFileUploader");
            let sFileName = oFileUploader.getProperty("value");
            if (sFileName) {
                let oAttachment = { fileName: sFileName, uploadedBy: "hemanth", uploadedAt: new Date() }
                this.getOwnerComponent().getModel("DetailsModel").getProperty("/Complaint/attachments").push(oAttachment);
                this.onCloseUploadDialogPress();
                this.byId("idAttachmentsTable").getBinding("items").refresh();
            }
            else {
                this.getWarningMessageBox("File is not selected.Please select.");
                oFileUploader.setValueState("Warning");
                oFileUploader.setValueStateText("No file selected");
            }
        },
        onFileChange: function () {
            let oFileUploader = this.byId("idFileUploader");
            oFileUploader.setValueState("None");

        },
        onCloseUploadDialogPress: function () {
            this.byId("idFileUploader").clear();
            this._UploadDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        _getItemFormDetails:function(){
            let oItemsBox = this.byId("idItemsVBox").getItems();
            console.log(oItemsBox)
            if (oItemsBox.length > 0) {
                let aItemsData = oItemsBox.map(element => {
                    let oFormElements = element._aElements;
                    let oItemFormData = {};
                    for (let i = 0; i < oFormElements.length; i += 2) {
                        let oLabel = oFormElements[i].getText();
                        let oField = oFormElements[i + 1].getValue();
                        switch (oLabel) {
                            case "product_ID": oItemFormData["product_ID"] = oField;
                                break;
                            case "Supplier": oItemFormData["supplier"] = oField;
                                break;
                            case "Batch No": oItemFormData["batchNo"] = oField;
                                break;
                            case "Production": oItemFormData["productionDate"] = oField;
                                break;
                            case "Expiration": oItemFormData["expirationDate"] = oField;
                                break;
                            case "lot code": oItemFormData["lotCode"] = oField;
                                break;
                            case "Received On": oItemFormData["receivedOn"] = oField;
                                break;
                            case "Qty": oItemFormData["quantity"] = oField;
                                break;
                            case "Invoice Number": oItemFormData["invoiceNumber"] = oField;
                                break;
                        }
                    }
                    return oItemFormData;
                });
                this.getOwnerComponent().getModel("DetailsModel").setProperty("/Complaint/items", aItemsData)
                console.log(aItemsData);
            }
        },
        onSubmitBtnPress: function () {
            this._getItemFormDetails();
            console.log(this.getOwnerComponent().getModel("DetailsModel").getProperty("/Complaint"));
            let payLoad = this.getOwnerComponent().getModel("DetailsModel").getProperty("/Complaint");
            payLoad["status"]="MANAGER_APPROVAL_PENDING"
            if(this._oID==="NEW"){
                this.ODataPost("/Complaints", payLoad);
            }
            else{
                $.ajax({
                    url: this.getBaseURL()+"/odata/v4/production-warehouse/Complaints('"+ this._oID +"')",
                    method:"PUT",
                    contentType:"application/json",
                    data:JSON.stringify(payLoad),
                    success: function(data) {
                        MessageToast.show("Successfully Updated");
                      },
                      error: function(error) {
                        MessageToast.show("Error submitting data");
                      }
                });
            }
            this.onDeclineBtnPress();
        },
        onCompleteLaterBtnPress:function(){
            this._getItemFormDetails();
            console.log(this.getOwnerComponent().getModel("DetailsModel").getProperty("/Complaint"));
            let payLoad = this.getOwnerComponent().getModel("DetailsModel").getProperty("/Complaint");
            payLoad["status"]="DRAFT";
            if(this._oID==="NEW"){
                this.ODataPost("/Complaints", payLoad);
            }
            else{
                $.ajax({
                    url: this.getBaseURL()+"/odata/v4/production-warehouse/Complaints('"+ this._oID +"')",
                    method:"PUT",
                    contentType:"application/json",
                    data:JSON.stringify(payLoad),
                    success: function(data) {
                        MessageToast.show("Successfully Updated");
                      },
                      error: function(error) {
                        MessageToast.show("Error submitting data");
                      }
                });
            }
            this.onDeclineBtnPress();
        }
    });
});