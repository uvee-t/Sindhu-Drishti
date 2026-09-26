const userDataController = (req, res) => {
    res.status(200).json(req.user);
};

export { userDataController };
