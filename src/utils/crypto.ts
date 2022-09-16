import { randomBytes, createHash } from 'node:crypto';

export const generateChallenge = (): string => randomBytes(64).toString('base64');

export const createUserId = (username: string, salt: number): string => {
    const hash = createHash('sha256');
    hash.update(username);
    hash.update(`${salt}`);
    return hash.copy().digest('hex');
};
