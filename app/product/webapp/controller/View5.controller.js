
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/type/Boolean",
	"sap/ui/model/SimpleType"
], function (Controller, MessageBox, MessageToast, JSONModel, Sorter, Filter, FilterOperator, FilterType) {
	"use strict";
    var a;
    return Controller.extend("product.product.controller.View5", {
        
        
		onInit: function () { 
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View5").attachMatched(this._onRouteMatched, this);
      
        },
		onNavBack: function(){
		                      
			this.getRouter().navTo("View4");

		},
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
    _onRouteMatched: function(oEvent) {
        var category  = oEvent.getParameter("arguments").category;
        a = category;
         var prodname = [];

         var oData;

      

         jQuery.ajax({
             type: "GET",
             contentType: "application/json",
             url: "/productinventory/getprodnames(prodcat='" + category + "')",
             dataType: "json",
             async: false,
             success: function (data, textStatus, jqXHR) {
                 console.log("User details fetch is successful ");
                 oData = data;
                 
                 oData.forEach(iData => { 
                   
                   prodname.push(iData);
                   
                 });
                 
             },
             error: function (data, textStatus, jqXHR) {
                 MessageBox.error("Error occurred in getting user details ");
             }
            
         });
         var oModel = new sap.ui.model.json.JSONModel({ product: prodname });
         // Add model name in setter		              
         this.getView().setModel(oModel, 'product');

        
    },
    OnClickHandler:function(oEvent) {
        
        var clickedData = oEvent.getParameter("data")[0].data;
        this.getRouter().navTo("View6",{
            name: clickedData.Product_Name,
            category: a 
        });
        
    }

	});
});