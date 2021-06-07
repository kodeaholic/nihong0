const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');
const svgSourceFolder = path.join(__dirname, '../../svg');

const directories = [
    "svgsJa", "svgsJaSpecial", "svgsKana",
    "svgsZhHans", "svgsZhHansSpecial", "svgsZhHant"
]

const getSvg = catchAsync(async (req, res) => {
    const svgCode = req.params.svgCode
    const fileName = `${svgCode}.svg`
    let found = false;
    directories.every((dir) => {
        let files = fs.readdirSync(path.join(svgSourceFolder, dir))
        if (files.includes(fileName)) {
            found = { path: '/svg/' + dir + '/' + fileName, subDir: dir }
            return true
        }
    })
    if (found) {
        res.send(found);
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'SVG not found');
    }
});

module.exports = {
    getSvg
};
