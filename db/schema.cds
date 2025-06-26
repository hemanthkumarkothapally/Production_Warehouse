namespace db.cy.pw;
using { cuid } from '@sap/cds/common';

entity Complaints {
    key complaint_Id       : String(100);
    brand              : String(50);
    complaint_category : String(50);
    product_category   : String(50);
    seriousness        : String(20);
    status             : String(50);
}
entity ComplaintCategory:cuid{
    complaint_category : String(50);
}
entity ProductCategory : cuid {
    product_category: String(50);
}
entity Brands : cuid {
    brand_name:String(50);
}
entity Status : cuid {
    status_type:String(50);
}