
/*
 * GET users listing.
 */

exports.list = function(req, res){
    console.log('exports.list is invoked and its going to call the response.send(respond with a resource)');
  res.send("respond with a resource");
};