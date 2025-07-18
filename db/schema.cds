namespace db.cy.pw;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity ComplaintCategory : cuid {
    complaint_category : String(50);
}

entity ProductCategory : cuid {
    product_category : String(50);
}

entity Brands : cuid {
    brand_name : String(50);
}


type StatusType  : String enum {
    DRAFT = 'DRAFT';
    MANAGER_APPROVAL_PENDING = 'MANAGER_APPROVAL_PENDING';
    HR_APPROVAL_PENDING = 'HR_APPROVAL_PENDING';
    APPROVED = 'APPROVED';
    REJECTED = 'REJECTED';
}

type Seriousness : String enum {
    MINOR = 'MINOR';
    MODERATE = 'MODERATE';
    MAJOR = 'MAJOR';
    CRITICAL = 'CRITICAL';
}

entity Complaints : cuid, managed {
    complaintId       : String(100);
    brand              : String(50);
    complaintCategory : String(50);
    productCategory   : String(50);
    insurance_Required:Boolean;
    status             : StatusType not null default 'DRAFT';
    items              : Composition of many Items
                             on items.complaint = $self;
    complaintDetails   : Composition of one ComplaintDetails;
    attachments        : Association to many Attachments
                             on attachments.complaint = $self;
}

entity ComplaintDetails : cuid {
    seriousness     : Seriousness not null;
    complaintDetail : String(2000);
    temperature     : Decimal;
    interimAction   : String;
}

entity Items : cuid {
    complaint      : Association to one Complaints;
    product        : Association to one Products not null;
    supplier       : String;
    batchNo        : String;
    productionDate : Date;
    expirationDate : Date;
    lotCode        : String;
    receivedOn     : Date;
    quantity       : Decimal;
    invoiceNumber  : String;
}

entity Attachments : cuid {
    complaint  : Association to one Complaints;
    fileName   : String;
    uploadedBy : String;
    uploadedAt : DateTime;

}

entity Products : cuid {
    item: Association to many Items on item.product=$self;
    productName : String;
    description : String;
}
