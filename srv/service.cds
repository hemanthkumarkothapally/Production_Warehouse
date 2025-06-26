using {db.cy.pw as pw} from '../db/schema';

service ProductionWarehouse {
    entity Complaints as projection on pw.Complaints;
    entity ComplaintCategory as projection on pw.ComplaintCategory;
    entity ProductCategory as projection on pw.ProductCategory;
    entity Brands as projection on pw.Brands;
    entity Status as projection on pw.Status;
}
