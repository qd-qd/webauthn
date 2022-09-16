import { generateChallenge } from "../../../utils/crypto";

// @dev: Return a random 64-characters string
const challenge = async (_, res) => {
  const challenge = generateChallenge();
  res.status(200).json({ challenge });
};

export default challenge;
