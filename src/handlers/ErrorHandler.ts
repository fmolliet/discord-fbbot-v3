import { Logger as LOG } from '../helpers';

export default class ErrorHandler{
    handle(error: Error){
        LOG.error("CRITICAL ERROR: " +error.message);
        LOG.error( error.stack)
        //throw new Error(error.message);
    }
}