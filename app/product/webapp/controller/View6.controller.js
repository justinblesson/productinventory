
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
    return Controller.extend("product.product.controller.View6", {

		onInit: function () { 
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View6").attachMatched(this._onRouteMatched, this);
      
        },
		onNavBack: function(){
		                      
			this.getRouter().navTo("View5",{
				category: a });

		},
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
    _onRouteMatched: function(oEvent) {
        var name  = oEvent.getParameter("arguments").name;
        var category = oEvent.getParameter("arguments").category;

        a = category;

         var prodqty = [];

         var oData;

         jQuery.ajax({
             type: "GET",
             contentType: "application/json",
             url: "/productinventory/getprodqty(prodname='" + name + "')",
             dataType: "json",
             async: false,
             success: function (data, textStatus, jqXHR) {
                 console.log("User details fetch is successful ");
                 oData = data;
                 
                 oData.forEach(iData => { 
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "YYYY/MM/dd"
                    });
                    
                    iData.added_on =  oDateFormat.format(new Date(iData.added_on));
                   prodqty.push(iData);
                   
                 });
                 
             },
             error: function (data, textStatus, jqXHR) {
                 MessageBox.error("Error occurred in getting user details ");
             }
            
         });
         var oModel = new sap.ui.model.json.JSONModel({ product: prodqty });
         // Add model name in setter		              
         this.getView().setModel(oModel, 'product');       
    }

	});
});