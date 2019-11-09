var axios = require('axios');

var domain = "http://localhost" ; 
var Port = 3001 ; 
var walletId = "a8c564c6efcde5792b563710e0c5c9133809463b6af176fc7f67316e67a17377"; 
var walletAId = "3b0f0bd212dcb690d5f7fd2f2f1ae56b778f622bd109ce4ad016d5a0777cf6b0"; 


module.exports = 
{
getbalance : async function (AID) 
  {
    var url = domain +":"+Port + '/operator/' + AID + '/balance' ; 
    let result = await axios.get(url).then(response => {
        //console.log(response.data); 
        return response.data
      })
      .catch(error => {
        console.log(error)
      });
    return result; 
    
  },
getcoins : async function (AID , Amount) 
  {
    var url = domain +":"+Port + '/operator/wallets/'+walletId+'/transactions' ; 

    var post_data = JSON.stringify({
        "fromAddress": walletAId,
        "toAddress": AID,
        "amount": Amount,
        "changeAddress": walletAId
        }); 


      let result = await 
      axios.post(
            
            url , post_data , 
            {
                headers: {
                'Content-Type': 'application/json',
                'password' : 'string string string string string'
                }
            } 
          ).then(response => {
        //console.log(response.data); 
        return response.data
      })
      .catch(error => {
        console.log(error)
      });
    return result; 
  },
    createWid : async function (AccountPassword , AccountName)
  {
    var url = domain +":"+Port + '/operator/wallets/' ; 
    var post_data = JSON.stringify({
        "password": AccountPassword + " " + AccountName + " string string string"
        }); 

      let result = await 
      axios.post(
            
            url , post_data , 
            {
                headers: {
                'Content-Type': 'application/json'
                }
            } 
          ).then(response => {
        //console.log(response.data); 
        return response.data
      })
      .catch(error => {
        console.log(error)
      });
    return result; 
  },
  createAid : async function (WID  , AccountPassword , AccountName )
  {
    var url = domain +":"+Port + '/operator/wallets/'+ WID + '/addresses' ; 
    var post_data = JSON.stringify({
        "password": AccountPassword + " " + AccountName + " string string string" , 
        "walletId": WID 
        }); 

      let result = await 
      axios.post(
            
            url , post_data , 
            {
                headers: {
                'Content-Type': 'application/json',
                "password": AccountPassword + " " + AccountName + " string string string" , 
                "walletId": WID 
                }
            } 
          ).then(response => {
        //console.log(response.data); 
        return response.data
      })
      .catch(error => {
        console.log(error)
      });
    return result; 
  },
getinfo :  async function (WID) 
  {
    var url = domain +":"+Port + '/operator/wallets/'+ WID ; 

    var post_data = JSON.stringify({
        "walletId": WID 
        }); 

      let result = await 
      axios.get(
            
            url , 
            {
                headers: {
                'Content-Type': 'application/json',
                "walletId": WID 
                }
            } 
          ).then(response => {
        //console.log(response.data); 
        return response.data
      })
      .catch(error => {
        console.log(error)
      });
    return result; 
  },
  mine :  async function () 
  {
    var url = domain +":"+Port + '/miner/mine/' ; 

    var post_data = JSON.stringify({
      "rewardAddress": walletAId,
      "feeAddress": walletAId
    }); 

      let result = await 
      axios.post(
            
            url ,post_data  , 
            {
                headers: {
                'Content-Type': 'application/json'                }
            } 
          ).then(response => {
        //console.log(response.data); 
        return response.data
      })
      .catch(error => {
        console.log(error)
      });
    return result; 
  }
};
var coin = require('./coin');
/*
coin.getbalance("3b0f0bd212dcb690d5f7fd2f2f1ae56b778f622bd109ce4ad016d5a0777cf6b0")
.then(function(item) {
    console.log(item); 
});
coin.getcoins("ce8cdb31734c337d1ecdcff77dd2b8a7576dc02b70a50fd7445812252b109c7c" , 50 )
.then(function(item) {
    console.log(item); 
});

coin.createWid("password" , "password").then(function(item) {
    console.log(item); 
});
coin.createAid(walletId , "string" , "string").then(function(item) {
    console.log(item); 
});
coin.getinfo(walletId).then(function(item) {
    console.log(item); 
});*/

coin.createWid("string" , "string").then(function(item) {
    console.log(item); 
});
coin.createAid("string" , "string").then(function(item) {
  console.log(item); 
});

/*coin.mine().then(function(item) {
    console.log(item); 
});*/