const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        const format = req.body.format;
        const inputPath = req.file.path;
        const outputPath = `uploads/${req.file.filename}.${format}`;

        await sharp(inputPath)
            .toFormat(format)
            .toFile(outputPath);

        fs.unlinkSync(inputPath);
        const downloadURL = `${req.protocol}://${req.get('host')}/${outputPath}`;
        res.json({ downloadURL });
    } catch (error) {
        res.status(500).json({ message: 'Image conversion failed', error: error.message });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
