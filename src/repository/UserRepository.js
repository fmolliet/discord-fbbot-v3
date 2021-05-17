const low      = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter  = new FileAsync('./database/users.json');

class Accounts {
    
    constructor( instance ){
        this.db = instance;
    }
    
    static async getInstance(){
        const db = await low(adapter);
        db.defaults({ sessions: [], count: 0 }).write();
        return new Accounts(db);
    }
    
    async list(){
        return await this.db.get('sessions').value();
    }
    
    async find( id ){
        return await new Promise( (resolve, reject ) => {
            const session = this.db.get('sessions').find({ id }).value();
            resolve( session );
        });
    }
    
    async create( account ) {
        return await new Promise( (resolve, reject ) => {
            this.db.get('sessions').push(account).write();
            this.db.update('count', n => n + 1).write();
            resolve(true);
        });
    }
    
    async update( account ) {
        return await new Promise( (resolve, reject ) => {
            this.db.get('sessions')
                .find({ id: account.id })
                .assign( account )
                .write();
            resolve(true);
        });
    }
    
    async delete( id ){
        return await new Promise( (resolve, reject ) => {
            this.db.get('sessions').remove({ id }).write();
            this.db.update('count', n => n - 1).write();
            resolve(true);
        });
    }
    
    async deleteByEmail( email ){
        return await new Promise( (resolve, reject ) => {
            this.db.get('sessions').remove({ email }).write();
            this.db.update('count', n => n - 1).write();
            resolve(true);
        });
    }
    
}

module.exports = Accounts;