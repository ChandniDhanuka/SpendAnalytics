module.exports=function(app,client,url){
var common = require("./commonscripts.js");
var path=common.listExpensesByCategoryMonthly;
app.get(path, function (req, res) {
var cif=req.query['cif'];
var year=req.query['year'];
var month=req.query['month'];
	res.setHeader('Access-Control-Allow-Origin', '*');
	var query="";
	var validated=false;
	var mandatoryAttributeMessage="Please enter cif,year and month";
	 if ((typeof cif !== "undefined") && (cif !== null)){
		if ((typeof year!== "undefined") && (year !== null)){
			 if ((typeof month!== "undefined") && (month !== null)){
				 validated=true;
				 query="select DAY1.MONTH_NO ,CAT.CATEGORY,sum(BCT.PAID_OUT) AS EXPENSES from hdfs.tmp.vw_mongo_transactions BCT JOIN hdfs.tmp.vw_mongo_category CAT ON CAT.DESCRIPTION=BCT.DESCRIPTION JOIN hdfs.tmp.vw_mongo_days DAY1 on BCT.BSNS_DATE=DAY1.BSNS_DATE where BCT.cif ="+cif+" AND DAY1.BSNS_YEAR="+year+" AND DAY1.MONTH_NO="+month+" AND BCT.PAID_OUT > 0 group by DAY1.MONTH_NO ,CAT.CATEGORY order by CAT.CATEGORY ASC";
			}
			else{
				res.send(mandatoryAttributeMessage);
			}	 
		 }
		 else{
			res.send(mandatoryAttributeMessage);
		 }	  
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