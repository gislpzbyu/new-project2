const getAll = async (req, res) => {
    res.status(200).json({
        message: 'Hello Users Controller'
    });
}


module.exports = {
    getAll
}
