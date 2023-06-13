using { sap.cap.productinventory as my } from '../db/schema';
service productinventory {
    entity storemaster as projection on my.storemaster;
    entity usermaster as projection on my.usermaster;
    entity productmaster as projection on my.productmaster {
        *,
        cast (substring(createdAt,1,10) as Date) as created_on
  };
    entity productinvent as projection on my.productinvent{
        *,
           createdAt as added_on,
           //createdBy as added_by,
           //cast (substring(added_on,1,10) as Date) as created_on
    };
    entity producttransfer as projection on my.producttransfer;

    function getUserDetails() returns {};
    function updateUserDetails(user: String,password: String) returns {};      
    function getprodcatnumber() returns{};
    function getTransfer() returns{};
    function getStore() returns{};

    function getprodnames(prodcat: String) returns{}; 
    function getprodtrend() returns{};
    function getprodnamesqty() returns{}; 
    function getprodqty() returns{}; 
   


}