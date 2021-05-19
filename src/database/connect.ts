import { connect } from 'mongoose';

import { Logger } from '../helpers';
import { DatabaseError } from '../errors/';
import { DatabaseConfig } from '../interfaces';

class Connect {
    public connect({ host, port = '27017', user, password, collection = 'discordbot'}: DatabaseConfig ): void {
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
                    throw new DatabaseError(err);
                } else {
                    Logger.info('Database is connected');
                }
            }
        );
    }
}
  
export default new Connect();