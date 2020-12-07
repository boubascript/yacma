import { Router, Request, Response } from 'express';

const router = Router();
const {Storage} = require('@google-cloud/storage');

console.log()

const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GOOGLE_CLOUD_PROJECT
});
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET);


router.post('/upload', async (req: Request, res:Response) => {
    const file = (req as any).file
    if (!file) {
        res.status(400).send('No files received.');
        return;
    }

    try {
        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err: any) => {
            console.log('There was error')
            res.status(400).send("There was an error uploading your file")
        });

        await blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            res.status(200).send(publicUrl)
        });

        blobStream.end(file.buffer);
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;