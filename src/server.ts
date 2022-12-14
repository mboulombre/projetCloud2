import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

   //Mise en place dune restriction
   app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://image-filter-cloud.us-east-1.elasticbeanstalk.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });


  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get( "/filteredimage", async ( req, res ) => {
        const  image_url = req.query.image_url;
            if(!image_url){
                res.status(400).json({
                  message: "l'url is required"
                })
            }
              filterImageFromURL(image_url)
              .then((filteredpath)=>{
                res.sendFile(filteredpath, () => {
                 deleteLocalFiles([filteredpath])
                })
              }).catch(error => {
                res.status(422).json({
                  "error": "Erreur",
                  "message": error
                })
            })
    ///

  } );


  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    // res.send("try GET /filteredimage?image_url={{}}")
    res.status(200).send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `server running http://localhost:${ process.env.PORT }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();