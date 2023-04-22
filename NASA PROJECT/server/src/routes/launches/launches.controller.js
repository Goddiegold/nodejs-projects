const { getLaunch } = require('../../models/launches.model');

function httpGetLaunches(req, res) {
    res.status(200).json(getLaunch());
}

function httpSubmitLaunch() {

}

function httpAbortLaunch() {

}

module.exports = {
    httpGetLaunches,
    httpSubmitLaunch,
    httpAbortLaunch
}