using {db.cy.pw as pw} from '../db/schema';
@(requires:'authenticated-user')
service ProductionWarehouse {
    entity Complaints @(restrict:[
        { grant:['*'], to:'ADMIN'},    
        { grant:['*'], to:'USER', where:'createdBy = $user.email' }
    ] )as projection on pw.Complaints;
    entity ComplaintCategory as projection on pw.ComplaintCategory;
    entity ProductCategory as projection on pw.ProductCategory;
    entity Brands as projection on pw.Brands;
    entity Status as projection on pw.Status;

    function getUser() returns String;
}
