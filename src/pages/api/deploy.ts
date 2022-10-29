// return a random 64-characters string
const deploy = async (req, res) => {
    try {
        const { userId, pubKey } = JSON.parse(req.body);

        let contractAddress;

        // TODO: simulate CREATE2 to have the address in a optimistic way

        // TODO: deploy an account contract using a admin signer
        // the userId and the pubKey must be passed to the constructor


        res.status(200).send(contractAddress);
    } catch (error) {
        res.status(500).send(error);
    }
};

export default deploy;
