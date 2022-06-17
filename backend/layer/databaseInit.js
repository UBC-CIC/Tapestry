const gremlin = require('gremlin');
const {getUrlAndHeaders} = require('gremlin-aws-sigv4/lib/utils');

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;

let conn = null;
let g = null;

const getConnectionDetails = (env) => {
  if (env['USE_IAM'] == 'true'){
     return getUrlAndHeaders(
       env['NEPTUNE_ENDPOINT'],
       env['NEPTUNE_PORT'],
       {},
       '/gremlin',
       'wss'); 
  } else {
    const database_url = 'wss://' + env['NEPTUNE_ENDPOINT'] + ':' + env['NEPTUNE_PORT'] + '/gremlin';
    return { url: database_url, headers: {}};
  }    
};

const createRemoteConnection = (env) => {
  const { url, headers } = getConnectionDetails(env);

  const c = new DriverRemoteConnection(
    url, 
    { 
      mimeType: 'application/vnd.gremlin-v2.0+json', 
      headers: headers 
    });  

   c._client._connection.on('close', (code, message) => {
       console.info(`close - ${code} ${message}`);
       if (code == 1006){
         console.error('Connection closed prematurely');
         throw new Error('Connection closed prematurely');
       }
     });  

    return c;     
};

const createGraphTraversalSource = (conn) => {
  return traversal().withRemote(conn);
};

const initDB = function(env){
    if (conn == null){
        console.info("Initializing connection")
        conn = createRemoteConnection(env);
        g = createGraphTraversalSource(conn);
    }
    return {
        g: g,
        conn: conn
    };
}

module.exports = {
    initDB: initDB
}