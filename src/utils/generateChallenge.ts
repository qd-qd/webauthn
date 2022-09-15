import { randomBytes } from 'node:crypto';

const generateChallenge = (): string => randomBytes(64).toString('base64');

export default generateChallenge;
