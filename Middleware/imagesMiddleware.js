const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const pathToImages = path.resolve(__dirname, "../images");

cloudinary.config({
    cloud_name: "dxpnve5bv",
    api_key: "953999339682481",
    api_secret: process.env.CLOUDINARY_SECRET,
});

const generateUrl = (req, res, next) => {
    // const imageUrl = `http://localhost:8080/images/${req.file.filename}`;
    // console.log("Image URL: ", imageUrl);
    // req.body.picture = imageUrl;
    console.log(req.file.path);
    next();
};

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathToImages);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: cloudStorage });

module.exports = { upload, generateUrl };
