<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>质量验评统计报表</title>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/zlgkMgm.js'></script>
	</head>
</html>
<script>
var bean = "com.sgepit.pcmis.zlgk.hbm.PcZlgkQuaInfo"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"

var pid = CURRENTAPPID;
var param = window.dialogArguments;
var hzSjType, hzTabsUids, hzStatus, hzJyxmlx;

var jyxmDs, initWin;
var tabs;

if(param) {
	hzSjType = param.hzSjType ;	//时间
	hzTabsUids = param.hzTabsUids ;
	hzStatus = param.hzStatus ;
}
Ext.onReady(function() {
	var panelDwgc = new Ext.Panel({
		id:'dwgc',
		title:'单位工程',
		region: 'center',
		layout: 'fit',
		border:false,
		collapsed: false,
        collapsible: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		html: '<iframe name="dwgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelFxgc = new Ext.Panel({
		id:'fxgc',
		title:'分项工程',
		region: 'center',
		layout: 'fit',
		border:false,
		collapsed: false,
        collapsible: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		html: '<iframe name="fxgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelFbgc = new Ext.Panel({
		id:'fbgc',
		title:'分部工程',
		border : false,
		region : 'center',
		layout: 'fit',
		html: '<iframe name="fbgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelJyp = new Ext.Panel({
		id:'jyp',
		title:'检验批',
		border : false,
		region : 'center',
		layout: 'fit',
		html: '<iframe name="jypFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	
	tabs = new Ext.TabPanel({
        activeTab: 0,
        deferredRender: false,
        split: true,
        plain: true,
        border: true,
        region: 'center',
        forceFit: true,
        items:[panelDwgc,panelFbgc,panelFxgc,panelJyp]
    });
    
    
	tabs.on('tabchange',function(value){
		var panelId = value.getActiveTab().id;
		var xgridUrl = CONTEXT_PATH+"/PCBusiness/zlgk/templateXgridView.jsp";
		var sj_type = '2011'; // 时间
		var unit_id = UNITID; // 取表头用
		var editable = true; // 是否能编辑，不传为不能编辑
		var headtype = 'PC_ZLGK_ZLPY';
		var keycol = 'uids';
		var ordercol = 'uids'
		var hasInsertBtn = false;
//		var hasSaveBtn = false; //更具上报状态隐藏xGrid中的保存按钮
		var hasDelBtn = true;
		var skin = 'light';		//设置皮肤外观
		var hasFooter = false;	//隐藏底部统计栏
		var hideAllBtn = hzStatus=="1";
		var filter = " and pid='"+pid+"' and sj_Type='"+hzSjType+"' and master_id='"+hzTabsUids+"'"
		xgridUrl = xgridUrl+"?unit_id="+unit_id+"&editable="+editable+"&headtype="+headtype+"&keycol="+keycol+"&ordercol="+ordercol+"&hasInsertBtn="+hasInsertBtn+"&hasDelBtn="+hasDelBtn+"&hideAllBtn="+hideAllBtn+"&hasFooter="+hasFooter+"&skin="+skin
		hzJyxmlx = 1;
		if(panelId=='dwgc'){
			hzJyxmlx = 1;
			filter = filter +' and jyxmlx=1';
			sj_type = '201101';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
			window.frames["dwgcFrame"].location.href = xgridUrl;
		}
    	if(panelId=='fxgc'){
    		hzJyxmlx = 2;
    		filter = filter +' and jyxmlx=2'
    		sj_type = '201102';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["fxgcFrame"].location.href = xgridUrl;
    	}
    	if(panelId=='fbgc'){
    		hzJyxmlx = 3;
    		filter = filter +' and jyxmlx=3'
    		sj_type = '201103';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["fbgcFrame"].location.href = xgridUrl;
    	}
    	if(panelId=='jyp'){
    		hzJyxmlx = 4;
    		filter = filter +' and jyxmlx=4'
    		sj_type = '201104';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["jypFrame"].location.href = xgridUrl;
    	}
    })
    
	var viewport = new Ext.Viewport({
		layout : 'border',
		items:[tabs]
	})
	
	//==========初始化报表============
	var jyxmColumns = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'xmbh',type : 'string'},
		{name : 'xmmc',type : 'string'},
		{name : 'gcType',type : 'string'}
	];

	jyxmDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : "com.sgepit.frame.flow.hbm.GczlJyxm",
			business : business,
			method : listMethod,
			params : "pid='"+pid+"' and gcType='1'"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "uids"
		}, jyxmColumns),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	jyxmDs.setDefaultSort('xmbh', 'desc');
	
	var jyxmSm = new Ext.grid.CheckboxSelectionModel({singleSelect : false});
	
	var jyxmCm = new Ext.grid.ColumnModel([
		jyxmSm,
		{id : 'uids',header : '主键',dataIndex : 'uids',	hidden : true},
		{id : 'pid',header : '编号',dataIndex : 'pid',hidden : true},
		{id : 'xmbh',header : '项目编号',dataIndex : 'xmbh',hidden : true},
		{id : 'xmmc',header : '项目名称',dataIndex : 'xmmc',width : 430}
	])
	
	var selectBtn = new Ext.Button({
    	text:'选择单位工程',
    	iconCls:'btn',
    	handler:selectDwgcFun
    })
    function selectDwgcFun(){
    	var records = jyxmSm.getSelections();
    	if(records.length == 0){
    		Ext.example.msg('出现错误！', '请先选择单位工程！');
			return;
    	}
    	var uidsArr = new Array();
    	for (var i = 0; i < records.length; i++) {
    		uidsArr.push(records[i].get('uids'));
    	}
    	var sj = hzSjType;
    	var id = hzTabsUids;
    	DWREngine.setAsync(false); 
    	zlgkMgm.initZlgkGczlJyxm(uidsArr,sj,id,pid,function(bool){
    		if(bool){
    			initWin.hide();
    			Ext.example.msg('操作成功！', '质量验评统计报表初始化成功！');
    			tabs.fireEvent("tabchange", tabs, tabs.getActiveTab())
    		}else{
    			Ext.example.msg('出现错误！', '请先选择单位工程！');
				return;
    		}
    	})
    	DWREngine.setAsync(true); 
    }
	
	var dwgcGridPanel = new Ext.grid.GridPanel({
		ds:jyxmDs,
		sm:jyxmSm,
		cm:jyxmCm,
		tbar : ['->',selectBtn],
		border : false,
		autoScroll : true,
		loadMask : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : jyxmDs,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	})
	jyxmDs.load({params:{start:0,limit:PAGE_SIZE}});
	
	initWin = new Ext.Window({
		title: '单位工程列表',
		width: 490,
		height: 400,
		modal: true,
		plain: true, 
		border: false, 
		resizable: false,
		closeAction: 'hide',
		layout: 'fit',
		items:[dwgcGridPanel]
	})
});

function cellOnEditFun(mygrid,rowid,cindex,stage){
	if (cindex==0||cindex==3||cindex==4||cindex==5||cindex==6)	{
		return false;
	}
	if((cindex==1 || cindex==2) && stage==2){
		var hg = mygrid.cellById(rowid,1).getValue();
		var bhg = mygrid.cellById(rowid,2).getValue();
		var hgl = (parseInt(hg)/(parseInt(hg)+parseInt(bhg)))
		mygrid.cellById(rowid,3).setValue(hgl);
		//写方法计算累计合格数，累计不合格数，累计合格率
		var ljhgs = hg;
		var ljbhgs = bhg;
		DWREngine.setAsync(false); 
		zlgkMgm.getLjhgsAndLjbhgs(pid,rowid,hzSjType,function(str){
			ljhgs = parseInt(hg) + parseInt(str.split(',')[0]);
			ljbhgs = parseInt(bhg) + parseInt(str.split(',')[1]);
		})
		DWREngine.setAsync(false); 
		mygrid.cellById(rowid,4).setValue(ljhgs);
		mygrid.cellById(rowid,5).setValue(ljbhgs);
		var ljhgl = (parseInt(ljhgs)/(parseInt(ljhgs)+parseInt(ljbhgs)))
		mygrid.cellById(rowid,6).setValue(ljhgl);
		return true;
	}
}

function afterSavexGrid(mygrid){
	DWREngine.setAsync(false);
	zlgkMgm.delDwgcFromQuaDetail(pid,hzSjType);
	zlgkMgm.updateLjhgsAndLjbhgs(pid,hzSjType,hzJyxmlx);
	DWREngine.setAsync(true);
}

function initBaoBiao(){
	var xmbhSql = "select jyxmbh from PcZlgkQuaDetail where masterId = '" + hzTabsUids + "' and pid = '"+pid+"' and sjType = '"+hzSjType+"'";
	jyxmDs.baseParams.params = "pid='"+pid+"' and gcType='1' and uids not in ("+xmbhSql+")";    		
	jyxmDs.reload();
	initWin.show();
}
</script>