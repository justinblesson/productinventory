const cds = require("@sap/cds");



module.exports = cds.service.impl(async function (srv) {

    srv.on("getUserDetails", async (req) => {

        var res = req._.req.res;
        var userdata = await getUser();

        res.send(userdata);

    });

    srv.on("getTransfer", async (req) => {

        var res = req._.req.res;
        var transferdata = await getTransferData();

        res.send(transferdata);

    });

    srv.on("getStore", async (req) => {

        var res = req._.req.res;
        var store = await getStoreName();

        res.send(store);

    });

    srv.on("getprodcatnumber", async (req) => {

        var res = req._.req.res;
        var prodcat = await getcatnumber();

        res.send(prodcat);

    });

    srv.on("getprodnames", async (req) => {

        var res = req._.req.res;
        var prodnames = await getproductname(req.data.prodcat);

        res.send(prodnames);

    });

    srv.on("getprodnamesqty", async (req) => {

        var res = req._.req.res;
        var prodnames = await getproductnameqty();

        res.send(prodnames);

    });

    srv.on("getprodqty", async (req) => {

        var res = req._.req.res;
        var prodqty = await getproductqty();

        res.send(prodqty);

    });


    srv.on("getprodtrend", async (req) => {

        var res = req._.req.res;
        var prodcattrend = await getprodcattrend();

        res.send(prodcattrend);

    });

    srv.on("updateUserDetails", async (req) => {

        var res = req._.req.res;
        var userdetails = await updateUser(req.data.user,req.data.password);
        res.send(userdetails);

    });



    function getUser() {

        return new Promise((resolve, reject) => {
            const { usermaster } = cds.entities;
            const userdetail = cds.run(SELECT.from(usermaster));
            resolve(userdetail);


        });
    }
    function getTransferData() {

        return new Promise((resolve, reject) => {
            const { productinvent } = cds.entities;
            const transfer = cds.run(SELECT.from(productinvent));
            resolve(transfer);


        });
    }
    function getStoreName() {

        return new Promise((resolve, reject) => {
            const { producttransfer } = cds.entities;
            const transfer = cds.run(SELECT.from(producttransfer).columns('SUM(stocks) as stocks', 'tostoremaster.store_name as store_name').groupBy('tostoremaster.store_name'));
            resolve(transfer);


        });
    }
    function updateUser(user,password) {

        return new Promise((resolve, reject) => {
            const { usermaster } = cds.entities;
            cds.run(UPDATE(usermaster).with({password:password}).where({username:user}));
            const userdetail = cds.run(SELECT.from(usermaster));
            resolve(userdetail);


        });
    }

    function getcatnumber() {

        return new Promise((resolve, reject) => {
            // const { productmaster, productinvent } = cds.entities;
            // //cds.run(SELECT.from(productmaster).where({ prod_cat : prodcat }));

            // const prodcat = cds.run(SELECT.from(productinvent).columns('prod_cat', 'COUNT(*) as count').groupBy('prod_cat'));

            const { productmaster, producttransfer} = cds.entities;
            const prodcat = cds.run(SELECT.from(producttransfer).columns('prod_cat', 'SUM(stocks) as stocks').groupBy('prod_cat'));




            resolve(prodcat);



        });
    }

    function getproductnameqty(prodcat) {

        return new Promise((resolve, reject) => {
            //const { productinvent } = cds.entities;
            //const prodnames = cds.run(SELECT.from(productinvent).columns('prod_name', 'SUM(stocks) as stocks').groupBy('prod_name'));
            const { producttransfer } = cds.entities;
            const prodnames = cds.run(SELECT.from(producttransfer).columns('prod_name', 'SUM(stocks) as stocks').groupBy('prod_name'));
            resolve(prodnames);


        });


    }


    function getproductname(prodcat) {

        return new Promise((resolve, reject) => {
            const { productinvent } = cds.entities;
            const prodnames =   cds.run(SELECT.from(productinvent).columns('prod_name', 'qty').where({prod_cat:prodcat}));
            resolve(prodnames);


        });


    }

    function getproductqty() {

        return new Promise((resolve, reject) => {

            const { producttransfer } = cds.entities;
            //const prodqty = cds.run(SELECT.from(productinvent).columns('qty','stocks','added_on') );
            const prodqty = cds.run(SELECT.from(producttransfer).columns('stocks','createdat').orderBy('createdat') );
            resolve(prodqty);


        });
    }
    
    function getprodcattrend(prodcat) {

        return new Promise((resolve, reject) => {

            // const { productinvent } = cds.entities;
            // const prodqty = cds.run(SELECT.from(productinvent).columns('prod_cat','qty','added_on').where({ prod_cat: prodcat }) );
            // resolve(prodqty);
            const { producttransfer } = cds.entities;
            const prodnames = cds.run(SELECT.from(producttransfer).columns('prod_type', 'SUM(stocks) as stocks').groupBy('prod_type'));
            resolve(prodnames);


        });
    }

})