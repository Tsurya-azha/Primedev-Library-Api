import express from 'express'
import router from './routes/index.route.js'
import PinoHttp, { pinoHttp } from 'pino-http'
import logger from './configs/pino.config.js'
const app = express()
const port = 3000
app.use(pinoHttp())
app.use(express.json())
app.use(router)


if (process.env.ENV !== 'production') {
  const port = process.env.PORT || 3000
app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`)
  logger.info(`Application started successfuly`)
})
}

export default app

import { v2 as cloudinary } from 'cloudinary';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dlj8oalnl', 
        api_key: '562316751699139', 
        api_secret: 'NO_WWMvmexSBQ1ns4sGP-F07cs4' // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();

