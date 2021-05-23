import { connect } from 'mongoose';

import { Logger } from '../helpers';
import { DatabaseError } from '../errors/';
import { DatabaseConfig } from '../interfaces';

class Connect {
    public connect({ host, port = '27017', user, password, collection = 'discordbot'}: DatabaseConfig ): Promise<boolean|DatabaseError> {
        return new Promise( (resolve, reject) => {
            connect(
                `mongodb+srv://${host}`,
                {
                    user: user,
                    pass: password,
                    dbName: collection,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
                (err) => {
                    if (err) {
                        reject(new DatabaseError(err));
                    } else {
                        Logger.info('Base de dados GC está conectado.');
                        resolve(true);
                    }
                }
            );
        });
        
    }
}
  
export default new Connect();