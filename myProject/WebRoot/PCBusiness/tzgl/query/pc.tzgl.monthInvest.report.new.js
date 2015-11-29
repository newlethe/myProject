var xgridUrl = CONTEXT_PATH
		+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
var queryStr = "?";
queryStr += 'sj_type=2014'; // 时间
queryStr += '&unit_id='+defaultOrgRootID; // 取表头用
//param.company_id = ''; // 取数据用（为空是全部单位）
queryStr += '&keycol=uids';
queryStr += '&headtype=INVEST_MONTH_REPORT_NEW';	//类型
queryStr += '&ordercol=sj_type desc';
queryStr += '&hasSaveBtn=false';	//是否显示保存按钮，如果支持新增、编辑、删除的操作，此参数设置为true;
queryStr += '&hasInsertBtn=false';	//grid是否可新增；
queryStr += '&hasDelBtn=false';		//grid是否可删除；
queryStr += '&hasFooter=false';    //grid下面的汇总行是否显示
queryStr += '&lockCol=1';       //grid锁定列的序号，从1开始，如果为N，则锁定前N列；
queryStr += '&searchFlag=false'; //是否显示表头检索框

Ext.onReady(function(){
	var mainPanel = new Ext.Panel({
		id : 'main-panel',
		title : '月度投资完成汇总',
		headerAsText :true,
		html : '<iframe name="reportFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [mainPanel]
	});
	showReport(CURRENTAPPID);
	function showReport( pid ){
		var curQueryStr="";
		if(USERBELONGUNITTYPEID=='0'){
			var filter= " and unit_id='"+pid+"' and state_a<>'0'";
			curQueryStr+="&filter="+encodeURIComponent(filter);		
		}else if(USERBELONGUNITTYPEID=='2'){
			var filter= " and unit_id='"+pid+"' and state_a<>'0' and unit2id='"+USERBELONGUNITID+"'";
			curQueryStr+="&filter="+encodeURIComponent(filter);		
		}else if(USERBELONGUNITTYPEID=='3'){
			var filter= " and unit_id='"+pid+"' and state_a<>'0' and unit3id='"+USERBELONGUNITID+"'";
			curQueryStr+="&filter="+encodeURIComponent(filter);		
		}else if(USERBELONGUNITTYPEID=='A'){
			var filter= " and unit_id='"+pid+"' and state_a<>'0'";
			curQueryStr+="&filter="+encodeURIComponent(filter);		
		}else{
			curQueryStr+="&filter="+encodeURIComponent("1=2");		
		}
		window.frames['reportFrame'].location = xgridUrl+queryStr+curQueryStr;
		//mainPanel.setTitle('<div style="float:left">'+CURRENTAPPNAME + ' - 月度投资完成汇总'+'</div>'+'<div style="float:right">单位：万元</div>');
		mainPanel.setTitle('<div style="float:left"> 月度投资完成汇总'+'</div>'+'<div style="float:right">单位：万元</div>');
	}
});