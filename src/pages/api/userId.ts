import { createUserId } from "../../utils/crypto";

// @dev: Return a random 64-characters string
const challenge = async (req, res) => {
    const { username } = JSON.parse(req.body);
    const userId = createUserId(username, Date.now());
    res.status(200).json({ userId });
};

export default challenge;
