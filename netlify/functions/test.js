exports.handler = async function () {
    let secret = process.env.FOO_SECRET
    if(!secret){
      secret = "secret wasn't found in process.env.FOO_SECRET"
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'FOO_SECRET was ' + secret }),
    };
  };