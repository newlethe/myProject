var xgridUrl = CONTEXT_PATH	+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
var sjType;
Ext.onReady(function(){
	var curDate=new Date();
	var curYear=curDate.getYear();
	var curMonth=curDate.getMonth();
	var curSjType= "201504";
	if(curMonth==0){//1月
		curSjType = (curYear-1)+"12"
	}else{
		curSjType = curYear+(curMonth+100+"").substring(1)
	}
	sjType=curSjType
	var sjStore=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: getYearMonthBySjType(null,curSjType)
	});
	var yearMonthCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				store :sjStore,
				valueField : 'k',
				displayField : 'v',
				editable:false,
				value : curSjType,
				width : 100,
				listeners:{
	       			'select':function(combo,record){
	       				sjType = record.get('k');
	       				showReport(sjType);
	       			}
	       		}
			});
	var label = new Ext.form.Label({
		text : '月度投资完成'
	});
	var mainPanel = new Ext.Panel({
		id : 'main-panel',
		tbar : [label, ' ','-', ' ',yearMonthCombo,'->','单位：万元'],
		html : '<iframe name="reportFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [mainPanel]
	});
	showReport();
	function showReport(){
		window.frames['reportFrame'].location = xgridUrl+getQueryStr();

	}
});
function getQueryStr(){
	var queryStr = "?";
	queryStr += 'sj_type=2012'; // 时间
	queryStr += '&unit_id='+defaultOrgRootID; // 取表头用
	//param.company_id = ''; // 取数据用（为空是全部单位）
	queryStr += '&keycol=uids';
	queryStr += '&headtype=INVEST_MONTH_REPORT_MULTIPRJ';	//类型
	queryStr += '&ordercol=pid';
	queryStr += '&hasSaveBtn=false';	//是否显示保存按钮，如果支持新增、编辑、删除的操作，此参数设置为true;
	queryStr += '&hasInsertBtn=false';	//grid是否可新增；
	queryStr += '&hasDelBtn=false';		//grid是否可删除；
	queryStr += '&lockCol=1';		//grid锁定列的序号，从1开始，如果为N，则锁定前N列；
	queryStr += '&searchFlag=false'; //是否显示表头检索框
	var filterStr="";
	if(USERBELONGUNITTYPEID=='0'){//集团用户登录
		filterStr = " and state_a<>'0' and state_2<>'0' and sj_type='"+sjType+"'";
	}else if(USERBELONGUNITTYPEID=='2'){//二级企业用户登录
		filterStr = " and state_a<>'0' and sj_type='"+sjType+"' and unit2id='"+USERBELONGUNITID+"'";
	}else if(USERBELONGUNITTYPEID=='3'){//三级企业用户登录
		filterStr = " and state_2<>'0' and sj_type='"+sjType+"' and unit3id='"+USERBELONGUNITID+"'";
	}else if(USERBELONGUNITTYPEID=='A'){//项目单位用户登录
		filterStr = " and state_2<>'0' and sj_type='"+sjType+"' and unit_id='"+USERBELONGUNITID+"'";
	}else{
		filterStr = " and 1=3";
	}
	return queryStr+"&filter="+ encodeURIComponent(filterStr);
}