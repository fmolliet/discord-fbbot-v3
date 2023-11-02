import { Logger as LOG } from '../helpers';

export default class ErrorHandler{
    handle(error: Error){
        LOG.error("EVENT HANDLER: " +error.message, error.stack);
        throw new Error(error.message);
    }
}