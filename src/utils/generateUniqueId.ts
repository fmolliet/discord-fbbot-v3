import crypto from 'crypto';

export default function generateUniqueId() : string {
    return crypto.randomBytes(16).toString('hex');
}