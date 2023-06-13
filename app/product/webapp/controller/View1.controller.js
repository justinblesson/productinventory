sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/NumberFormat",
    "sap/base/strings/formatMessage",
    "sap/ui/model/odata/v4/Context",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/odata/v4/ODataListBinding",
    "sap/f/library"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, NumberFormat, bindContext, bindList, bindProperty, requestContexts, fioriLibrary) {
        "use strict";

        return Controller.extend("product.product.controller.View1", {
            onInit: function () {
        
            },
            onOpenAddDialog: function()
			{
				var c = "UserInfo";
                this.getView().byId(c).open();
			},
			onCancelDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
                //this.resetForm();
			},
			onForgot: function()
			{
				var c = "ForgotPassword";
                this.getView().byId(c).open();
			},
			
            onLoginUser: function(){
                var username = this.getView().byId('usernameinput');
                var password = this.getView().byId('passwordinput');
                var userdetails,flag,email  ; 
                jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/productinventory/getUserDetails()",
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        console.log("User details fetch is successful " );                       
                        userdetails = data;
                        userdetails.forEach(user => { 
                            if(username.getValue() === user.username && 
                               password.getValue() === user.password){                       
                                flag = 1;
                                email = user.email;
                            }                        
                        })
                    
                    },
                    error: function (data, textStatus, jqXHR) {
                        MessageBox.error("Error occurred in getting user details ");
                    }
                });

                if(username.getValue() === ''){
                    MessageBox.error("Please enter Username!");
                    return;
                }else if(password.getValue() === ''){
                    MessageBox.error("Please enter Password!");
                    return;
                }else{
                    
                    if(flag === 1){   
                       
			this.getRouter().navTo("View2",{
				username: username.getValue() } );             
                        //this.getRouter().navTo("View2");
                        this.getView().byId('usernameinput').setValue("");
                        this.getView().byId('passwordinput').setValue("");
                        MessageBox.success("Login Successful!");
                    }else{
                        MessageBox.error("Invalid Credentials!");
                    }

                }
                },
                getRouter: function() {
                    return this.getOwnerComponent().getRouter();
                },
                onCreate: function () {
                    var password1 = this.getView().byId("rpasswordinput").getValue(),
                        password2 = this.getView().byId("rpasswordinputcon").getValue()

                    if (password1 === password2)

                    {
                    try {
                        var oModel = this.getOwnerComponent().getModel(),
                            oBinding = oModel.bindList("/usermaster");                         
                        // Create a new entry through the table's list binding
                        var oContext = oBinding.create({
                            "username": this.getView().byId("rusernameinput" ).getValue(),
                            "email": this.getView().byId("remailinput").getValue(),
                            "password": this.getView().byId("rpasswordinput").getValue(),
                        });
                                
                        oContext.created()
                            .then(() => {
                                MessageBox.success("Record Created !");
                                var c = "UserInfo";
                                this.getView().byId(c).close();     
                            });
                        
        
                    }
                    catch (err) {
                        MessageBox.error("Record Creation Failed !");
                    }
                    
                    }else{
                        MessageBox.error("Password Not Matching !"); 
                    }
                  
                },
                onCreate1: function (oEvent) {
                    var password1 = this.getView().byId("fpasswordinput").getValue(),
                        password2 = this.getView().byId("fpasswordinputcon").getValue(),
                        user= this.getView().byId("fusernameinput").getValue();

                    if (password1 === password2)

                    {
                        var userdetails,flag,email  ; 
                        jQuery.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "/productinventory/updateUserDetails(user='" + user + "',password='" + password1 + "')",
                            dataType: "json",
                            async: false,
                            success: function (data, textStatus, jqXHR) {
                                console.log("User details fetch is successful " );  
                                MessageBox.success("Password Updated !");
                                flag = 1;
                                //oEvent.getSource().getParent().close();
                                //this.getView().byId("ForgotPassword").close();                        
                                userdetails = data;
                            
                            },
                            error: function (data, textStatus, jqXHR) {
                                MessageBox.error("Error occurred in getting user details ");
                            }
                        });
        
                    
                    }else{
                        MessageBox.error("Password Not Matching !"); 
                    }
                  if(flag === 1){
                    this.getView().byId("ForgotPassword").close();  
                  }
                }
        
        
        });
    });
