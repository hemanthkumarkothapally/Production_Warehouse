const cds = require('@sap/cds')
module.exports = (srv) => {
    const { Complaints } = srv.entities;
    // srv.on("READ", "Complaints", async (req) => {
    //     const user = req.user;
    //     if (!user) {
    //         return req.reject(403,"Not a Authenticated User");
    //     }
    //     if (user.is("ADMIN")) {
    //         return await cds.run(req.query);
    //     }
    //     else if (user.is("USER")) {
    //         req.query.where({ createdBy: user.attr.email })
    //         return await cds.run(req.query);
    //     }
    // });
    
}