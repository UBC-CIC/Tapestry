/**
 * The following is the Lambda function set-up for the Gremlin-Lambda combination,
 * as recommended by AWS Documentation: https://docs.aws.amazon.com/neptune/latest/userguide/lambda-functions-examples.html
 * All changes involving interaction with gremlin should be done in the query async method.
 */

/**
 * POST Request
 * Required in request body:
 * - id: Tapestry's post id as a string
 * - author: Tapestry's author name
 * - rootId: Root id of tapestry, formatted as "node-x" where x is node->id
 * Note: Any primitive data types can be added as attributes to this tapestry node by passing them through
 * the request body.
 */

const gremlin = require('gremlin');
const async = require('async');
const {initDB,errorHandler} = require('/opt/databaseInit');
const t = gremlin.process.t;
const __ = gremlin.process.statics;

let {g,conn} = initDB(process.env);

async function query(request) {
  // Creating the query
  let query = 'g.addV(\'tapestry\').property(t.id,request.id)';
  let properties = Object.keys(request);
  for(let i in properties){
     if(properties[i] != "id"){
       // Adding all other properties
       query += `.property(\"${properties[i]}\",\"${request[properties[i]]}\")`;
     }
  }
  console.log(query);
  return eval(query + '.next()');
}

async function doQuery(requestJSON) {
  let request = JSON.parse(requestJSON);
  if(request){
      let result = await query(request);
      return result['value'];
  }
  return;
}


exports.handler = async (event, context) => {

  return async.retry(
    { 
      times: 5,
      interval: 1000,
      errorFilter: function (err) { 
        errorHandler(err,process.env);
      }

    }, 
    async ()=>{
      console.log(event);
      var result = await doQuery(event.body);
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    })
};