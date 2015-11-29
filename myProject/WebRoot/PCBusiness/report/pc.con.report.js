var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
var currDate = new Date();
var currYear = (new Date()).getYear();
var currMonth = (((new Date()).getMonth()-1)+101+"").substring(1);
var cellURL = "/"+ROOT_CELL+"/cell/eReport.jsp?";
var curSjType = currDate.getFullYear() + months[currDate.getMonth()-1];
var projCombo;
var reportParams = {
	p_type:"CON_PERFORM",
	p_date:currYear+""+currMonth,
	p_corp:CURRENTAPPID+"/1",
	openCellType:'frame'
};
var projId = CURRENTAPPID,sjType=currYear+currMonth;
Ext.onReady(function(){
    
    var sjArr=getYearMonthBySjType(null,null);
    
    var timeStore = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : sjArr
    });
    timeCombo = new Ext.form.ComboBox({
    	store:timeStore,
    	typeAhead : true,
		triggerAction : 'all',
		mode : 'local',
		valueField : 'k',
		displayField : 'v',
		editable:false,
		value : curSjType,
		maxHeight:107,
		width : 100,
    	listeners:{
    		select:resetCellFrm
    	}
    });
    //项目单位列表
    var array_prjs=new Array();
    if(USERPIDS&&USERPNAMES){
    	var pidArr = USERPIDS.split(",");
    	var pnameArr = USERPNAMES.split(",");
    	for(var i=0;i<pidArr.length;i++){
    		array_prjs.push([pidArr[i],pnameArr[i]]);
    	}
    }
	var dsCombo_prjs=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: array_prjs
	});
	projCombo=new Ext.form.ComboBox({
		width : 180,
		store:dsCombo_prjs,
    	displayField:'v',
   		valueField:'k',
   		mode: 'local',
   		value:CURRENTAPPID,
    	triggerAction: 'all',
   		selectOnFocus:true,
   		editable:false,
    	listeners:{
    		select:resetCellFrm
    	}
	});
    
    
    var cellSrc = (cellURL+Ext.urlEncode(reportParams));
    new Ext.Viewport({
        layout : 'fit',
        border : false,
        items:[{
        	xtype:'panel',
        	tbar:['&nbsp;&nbsp;项目&nbsp;',projCombo,'&nbsp;&nbsp;时间&nbsp;',timeCombo],
        	html: '<iframe name="cellFrm" src="'+cellSrc+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
        }]
    });
});
function resetCellFrm(){
	if(timeCombo.getValue()!=""&&projCombo.getValue()!=""){
		sjType = timeCombo.getValue();
		projId = projCombo.getValue();
		reportParams.p_date = sjType;
		reportParams.p_corp = projId+"/1";
		window.frames["cellFrm"].location.href=(cellURL+Ext.urlEncode(reportParams));
	}
}
function onCellOpened(CellWeb1,p_date){
	var newconNum=0;
	var newconMoney =0;
	var monthbdgMon =0;
	var totalconNum=0;//累计合同数
	var totalconMon =0;//累计金额
	var totalbdgMon = 0;//累计概算金额
	
	DWREngine.setAsync(false);
	pcContractMgm.calculateMoneyByPid(projId,'yyyyMM',timeCombo.getValue(),function(rtn){
	    newconNum = rtn.newconNum;
	    newconMoney = rtn.newconMoney;
	    monthbdgMon = rtn.monthbdgMon;
	    totalconNum = rtn.totalconNum;
	    totalconMon = rtn.totalconMon;
	    totalbdgMon = rtn.totalbdgMon;
	})
	DWREngine.setAsync(true);
	var re = /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g;
	var xmlStr = CellWeb1.SaveToXML("");
	var values = {
		NUM:newconNum,
		TOTAL:newconMoney/10000,
		BDGTOTAL:monthbdgMon,
		TOTALNUM:totalconNum,
		TOTALCONMON :totalconMon/10000,
		TOTALBDGMON :totalbdgMon
	};
	
	xmlStr = xmlStr.replace(re, function(m,name,format,args){
		return values[name] !== undefined ? values[name] : "";
	})
	CellWeb1.ReadFromXML(xmlStr);
}