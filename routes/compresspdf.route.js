var shell = require('shelljs');
let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    router = express.Router();
const compressPdfRoute = express.Router();
const { exec } = require('child_process');
const User = require('../models/user.compress.model');

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});


compressPdfRoute.route('/').post(upload.single('avatar'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        avatar: url + '/public/' + req.file.filename,
        fileName: req.file.filename,
        title: req.body.title,
        link: req.body.link,
        note: req.body.note,
        pipeId: req.body.pipeId
    });
    user.save().then(result => {

        shell.exec('chmod +x shrinkpdf.sh')
        let inPath = __dirname;
        inPath = inPath.replace('/routes', '') + '/public/';
        outPath = inPath + 'converted';
        
        shell.exec(`./shrinkpdf.sh -o ${outPath}/_${result.pipeId}_${result.fileName} ${inPath}/${result.fileName}`)
        
        res.status(201).json({
            message: "User registered successfully!",
            userCreated: {
                _id: result._id,
                name: result.name,
                avatar: result.avatar,
                title: result.title,
                link: result.link,
                note: result.note,
                pipeId: result.pipeId,
                fileName: result.fileName
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})


compressPdfRoute.route('/:id').get((req, res, next) => {
    User.find({ pipeId: req.params.id }).then(data => {
        res.status(200).json({
            message: "Users retrieved successfully!",
            users: data
        });
    });
});


compressPdfRoute.route('/download/:id').get((req, res, next) => {
    let outPath = __dirname;
    outPath = outPath.replace('/routes', '') + '/public/converted/';
    res.download(outPath + req.params.id)
});

module.exports = compressPdfRoute;