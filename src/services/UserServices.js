
// Database
const Account         = require('../database/accounts');

class AccountServices {
    
    async indexSession( id ){
        const Accounts = await Account.getInstance();
        const result = await Accounts.find( id );
        if( !result ) {
            throw new Error('Sessão não encontrada.');
        }
        return result;
    }
}

module.exports = new AccountServices();