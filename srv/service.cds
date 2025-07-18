using {db.cy.pw as pw} from '../db/schema';
@(requires:'authenticated-user')
service ProductionWarehouse {
    // @(restrict:[
    //     { grant:['*'], to:'ADMIN'},    
    //     { grant:['*'], to:'USER', where:'createdBy = $user.email' }
    // ] )
    entity Complaints as projection on pw.Complaints;
    entity ComplaintDetails as projection on pw.ComplaintDetails;
    entity Items as projection on pw.Items;
    entity Attachments as projection on pw.Attachments;
    entity Products as projection on pw.Products;
    entity ComplaintCategory as projection on pw.ComplaintCategory;
    entity ProductCategory as projection on pw.ProductCategory;
    entity Brands as projection on pw.Brands;
    function getUser() returns String;
}
