using {
    managed,
    cuid
} from '@sap/cds/common';

namespace sap.cap.productinventory;

entity usermaster : managed {
    key username : String;
        email    : String;
        password : String
}

entity productmaster : managed {
    key prod_id         : String;
        prod_cat        : String;
        prod_type       : String;
        prod_name       : String;
        created_by      : String;
        created_on      : Date;
        uom             : String;
        active          : Boolean;
        toproductinvent : Association to many productinvent
                              on  toproductinvent.prod_id   = prod_id
                              and toproductinvent.prod_name = prod_name;
}

entity productinvent : managed {
    key prod_id         : String;
        prod_cat        : String;
        prod_name       : String;
        prod_type       : String;
        added_on        : Timestamp @cds.on.insert: $now;
        added_by        : String;
        qty             : Integer;
        uom             : String;
        expiry_date     : Date;
        batch_no        : Integer;
        stocks          : Integer;
        unit            : String;
        status          : String;
        status_text     : String;
        icon            : String;
        toproductmaster : Association to productmaster
                              on  toproductmaster.prod_id   = prod_id
                              and toproductmaster.prod_name = prod_name;
}

entity producttransfer : managed {
    key transfer_id : String;
    key item_no     : Integer;
        prod_id     : String;
        prod_name   : String;
        prod_cat    : String;
        prod_type   : String;
        store_id    : String;
        username    : String;
        stocks      : Integer;
        tostoremaster : Association to storemaster
                        on tostoremaster.store_id = store_id;
}

entity storemaster : managed {
    key store_id   : String;
        store_name : String;
        toproducttransfer : Association to many producttransfer
                            on toproducttransfer.store_id = store_id;
}

