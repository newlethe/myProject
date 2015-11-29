var currDate = new Date();
var currMonth = (currDate.getMonth()+101+"").substring(1);
var curSjType = currDate.getFullYear() +currMonth;
var sjArr=getTimeStoreArr();

if(curSjType=="") {
	curSjType = currDate.getFullYear() +currMonth;
	sjArr.push([curSjType,currDate.getFullYear()+"年"+currMonth+"月"]);
}

var param = new Object()
param.sj_type = '2013'; // 时间
param.unit_id = CURRENTAPPID; // 取表头用
param.company_id = ''; // 取数据用（为空是全部单位）
param.editable=false;
param.hasSaveBtn = false;
param.headtype = 'PC_TZGL_MONTH_INVEST_REPORT';
param.keycol = 'uids';
param.xgridtype = 'grid';
//param.initInsertData = "pid`" + CURRENTAPPID;
param.filter = " and Pc_Tzgl_Month_Invest_D.sj_type='"+curSjType+"'  and  Pc_Tzgl_Month_Invest_D.pid in(select sm.pid from Pc_Tzgl_Month_Invest_m sm where sm.report_status=3)";
param.hasInsertBtn = false;
param.hasDelBtn = false;
param.ordercol = "pid";
var baseUrl = CONTEXT_PATH
			+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
var xgridUrl=baseUrl+"?sj_type="+param.sj_type+"&unit_id="+param.unit_id+"&company_id="+param.company_id+"&editable="+param.editable+"&hasSaveBtn="+param.hasSaveBtn
	+"&headtype="+param.headtype+"&keycol="+param.keycol+"&xgridtype="+param.xgridtype+"&filter="+param.filter
	+"&hasInsertBtn="+param.hasInsertBtn+"&hasDelBtn="+param.hasDelBtn+"&ordercol="+param.ordercol;
Ext.onReady(function(){
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
		value :curSjType,
		width : 100,
    	listeners:{
    		select:function(cb,rec,inx){
					curSjType=rec.get('k');
					resetCellFrm();
			}
    	}
    });
    var tbar=['时间&nbsp;',timeCombo];
    new Ext.Viewport({
        layout : 'fit',
        border : false,
        items:[{
        	xtype:'panel',
        	tbar:tbar,
        	html: '<iframe name="cellFrm" src="'+xgridUrl+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
        }]
    });
});
function resetCellFrm(){
	param.filter = " and Pc_Tzgl_Month_Invest_D.sj_type='"+curSjType+"'  and  Pc_Tzgl_Month_Invest_D.pid in(select sm.pid from Pc_Tzgl_Month_Invest_m sm where sm.report_status=3)";
	xgridUrl=baseUrl+"?sj_type="+param.sj_type+"&unit_id="+param.unit_id+"&company_id="+param.company_id+"&editable="+param.editable+"&hasSaveBtn="+param.hasSaveBtn
		+"&headtype="+param.headtype+"&keycol="+param.keycol+"&xgridtype="+param.xgridtype+"&filter="+param.filter
		+"&hasInsertBtn="+param.hasInsertBtn+"&hasDelBtn="+param.hasDelBtn+"&ordercol="+param.ordercol;
	window.frames["cellFrm"].location.href=xgridUrl;
}
function getTimeStoreArr(){
	var sjArr=new Array();
	DWREngine.setAsync(false);
	var whereSql="report_status=3 order by sj_type asc";
     baseDao.getData("select distinct t.SJ_TYPE from Pc_Tzgl_Month_Invest_m t where "+whereSql, function(list){
		if(list.length > 0){   
			for(var i=list.length-1; i>=0; i--)
			{   
				if(i == list.length-1){
				  curSjType = list[i];
				}
				var temp = new Array();
				temp.push(list[i])
				temp.push(list[i].toString().substr(0,4)+"年"+list[i].toString().substr(4,6)+"月")
				sjArr.push(temp);
			}
		}
		if(list.length==0){
			curSjType="";
		   }
});
	DWREngine.setAsync(true);
	return sjArr;
}