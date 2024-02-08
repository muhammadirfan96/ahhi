import 'dotenv/config' 


let port;
process.env.NODE_ENV === 'production'
    ? (port = 5000)
    : (port = process.env.APP_PORT);
    
    export{port}