/**
 * The following is the Lambda function set-up for the Gremlin-Lambda combination,
 * as recommended by AWS Documentation: https://docs.aws.amazon.com/neptune/latest/userguide/lambda-functions-examples.html
 * All changes involving interaction with gremlin should be done in the query async method.
 */

/**
 * GET Request
 * Required in request query string parameters
 * - nodeId: id of the node, formatted as "node-x" where x is node->id
 * - tapestryId: id of the tapestry to check
 */
const gremlin = require('gremlin');
const async = require('async');
const {initDB,errorHandler} = require('/opt/databaseInit');
const t = gremlin.process.t;
const __ = gremlin.process.statics;

let {g,conn} = initDB(process.env);

async function query(node,tapestry) {
  // check if a node with the given id exists in the tapestry
  return g.V(tapestry).out('contains').has(t.id,node).next();
}

async function doQuery(node,tapestry) {
  let result = await query(node,tapestry);
  return result;
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
      var result = await doQuery(event.queryStringParameters.nodeId,event.queryStringParameters.tapestryId);
      // Check if the query returned anything
      if(result.value){
        return {
          statusCode: 200,
          body: JSON.stringify("true")
        }
      }
      return {
        statusCode: 404,
        body: JSON.stringify("false")
      }
    })
};