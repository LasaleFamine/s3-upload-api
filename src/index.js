'use strict';

const {join, resolve, extname} = require('path');
const AWS = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const dashify = require('dashify');

const uploadToS3 = (bucket, ACL, file, destFileName) => {
	const type = extname(destFileName).replace('.', '');
	const body = Buffer.from(file, 'binary');
	const upload = bucket.upload({
		ACL,
		Body: body,
		Key: destFileName,
		ContentType: `image/${type}`
	});
	// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
	// .on('httpUploadProgress', e => console.log(e))
	// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
	return upload.promise();
};

const {
	bucket,
	ACL = 'public-read',
	folder = '',
	accessKeyId,
	secretAccessKey
} = require(resolve('./s3-upload.config.js'));

AWS.config.update({
	accessKeyId: accessKeyId || process.env.AWS_ID,
	secretAccessKey: secretAccessKey || process.env.AWS_SECRET
});

const awsBucket = new AWS.S3({params: {Bucket: bucket}});
const app = express();

const multerUpload = multer({limits: {fileSize: 10 * 1024 * 1024}});

// Helper form to upload
app.get('/upload', (req, res) => {
	res.status(200)
			.send(`<form method="POST" enctype="multipart/form-data">
					<input type="file" name="files"/><input type="submit"/>
					</form>`)
			.end();
});

app.post('/upload', multerUpload.array('files'), (req, res) => {
	if (!req.files) {
		return res.status(403).send('expect 1 file upload named file1').end();
	}

	const files = Object.values(req.files);

	for (const file of files) {
		// TODO: improve
		if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
			return res.status(403).send('Expect image file').end();
		}
	}

	for (const file of files) {
		const ext = extname(file.originalname);
		const fileName = `${dashify(file.originalname)}-${parseInt(Math.random() * 10000000, 10)}`;
		const pid = `${fileName}${ext}`;

		uploadToS3(awsBucket, ACL, file.buffer, join(folder, pid.toString()))
			.then(data =>	res
					.status(200)
					.send({location: data.Location})
					.end())
			.catch(err => {
				console.log(err);
				return res.status(500).send('Failed to upload to s3').end();
			});
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Example Server listening at port ' + (process.env.PORT || 3000));
});
