class createerr extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode;
    }
    
}
module.exports={createerr};


//error handler