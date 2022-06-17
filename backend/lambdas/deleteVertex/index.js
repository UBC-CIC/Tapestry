/**
 * The following is the Lambda function set-up for the Gremlin-Lambda combination,
 * as recommended by AWS Documentation: https://docs.aws.amazon.com/neptune/latest/userguide/lambda-functions-examples.html
 * All changes involving interaction with gremlin should be done in the query async method.
 */

/**
 * DELETE Request
 * Required in request query string parameters:
 * id - id in Neptune of the vertex (of any label) to delete
 * Note: Also handles deletion of condition nodes in case their parent tapestry_node is deleted 
 */

const gremlin = require('gremlin');
const async = require('async');
const {initDB,errorHandler} = require('/opt/databaseInit');
const t = gremlin.process.t;
const __ = gremlin.process.statics;

let {g,conn} = initDB(process.env);

async function query(id) {
  if(id){
      await g.V(id).out('has_condition').drop().next(); // Executes only in case of deletion of tapestry_nodes with conditions
      return g.V(id).drop().next(); // Deletes the vertex
  }
}

async function doQuery(id) {
  let result = await query(id);
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
      var result = await doQuery(event.queryStringParameters.id);
      if(result){
          return {
              statusCode: 200,
              body: "Delete Successful"
          }
      }
      else{
          return {
              statusCode: 400,
              body: "Bad Request :("
          }
      }
    })
};