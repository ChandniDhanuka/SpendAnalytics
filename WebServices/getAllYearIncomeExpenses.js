module.exports=function(app,client,url){
var common = require("./commonscripts.js");
var path=common.getAllYearIncomeExpenses;
app.get(path, function (req, res) {
var cif=req.query['cif'];

	
	var query="";
	var validated=false;
	var mandatoryAttributeMessage="Please enter cif";
	 if ((typeof cif !== "undefined") && (cif !== null)){
				
				 validated=true;
				 query="select DAY1.BSNS_YEAR,sum(BCT.PAID_IN) AS INCOME,sum(BCT.PAID_OUT) AS EXPENSES from hdfs.tmp.vw_mongo_transactions BCT JOIN hdfs.tmp.vw_mongo_days DAY1 on BCT.BSNS_DATE=DAY1.BSNS_DATE where BCT.CIF ="+cif+" group by DAY1.BSNS_YEAR order by DAY1.BSNS_YEAR ASC";
	 
	  }
	  else{
		res.send(mandatoryAttributeMessage);
		
	  }
	 //console.log("query is "+query);
	 
	var args1_js = {
	data:{"queryType": "SQL",
	"query": query},
	headers: { "Content-Type": "application/json" }
};
if(validated){	
var req2=client.post(url, args1_js, function (data1, response) {
    // parsed response body as js object
	
   //console.log(data1);
   res.json(data1);
	
});
}

req.on('requestTimeout', function (req) {
	console.log('request has expired');
	res.send('request has expired');
	req.abort();
});
 
req.on('responseTimeout', function (res) {
	console.log('response has expired');
 res.send('response has expired');
});
 
//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
req.on('error', function (err) {
	console.log('request error', err);
res.send(err);
});

});
}