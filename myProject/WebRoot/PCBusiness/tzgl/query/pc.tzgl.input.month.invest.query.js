var gridJit,grid2Qiy,gridXmdw;
var reportRecord;
var sendBackFlag='0';
var comBaseParams = {
	ac : 'list', // 表示取列表
	bean : 'com.sgepit.pcmis.tzgl.hbm.PcTzglMonthInvestM',
	business : 'baseMgm',
	method : 'findWhereOrderby'
};
var currDate = new Date();
var currMonth = (currDate.getMonth()+101+"").substring(1);
var curSjType = currDate.getFullYear() +currMonth;
var sjArr=getTimeStoreArr();

if(curSjType=="") {
	curSjType = currDate.getFullYear() +currMonth;
	sjArr.push([curSjType,currDate.getFullYear()+"年"+currMonth+"月"]);
}


var comProxy = new Ext.data.HttpProxy({
	method : 'GET',
	url : MAIN_SERVLET
});
var comMeta = {
	root : 'topics',
	totalProperty : 'totalCount',
	id : "uids"
};
var comColums = [
	{name : 'uids',type : 'string'}, 
	{name : 'pid',type : 'string'}, 
	{name : 'createperson',type : 'string'}, 
	{name : 'createDate',type : 'date', dateFormat : 'Y-m-d H:i:s'}, 
	{name : 'title',type : 'string'}, 
	{name : 'reportStatus',type : 'string'	}, 
	{name : 'sjType',type : 'string'}, 
	{name : 'unitUsername',type : 'string'}, 
	{name : 'countUsername',type : 'string'},
	{name : 'createpersonTel',type : 'string'}
]
Ext.onReady(function(){
		var viewPort = new Ext.Viewport({
			layout : 'border',
			items : [gridJit = createGridJit()]
		});
		if(pageType=='confirm'){
			gridJit.store.baseParams.params = "reportStatus =3  and sjType='"+curSjType+"' order by sjType desc"
		}else{
			gridJit.store.baseParams.params = "pid='"+CURRENTAPPID+"' and reportStatus in('1','2','3') order by sjType desc"
		}
		gridJit.store.load();
});

function createGridJit(config){
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
	var tmpGridJit = new Ext.grid.GridPanel(Ext.apply({
		region:'center',
		height:300,
		tbar:pageType=='confirm'?tbar:null,
		columns:[
			new Ext.grid.RowNumberer()
			, {header : '月度',dataIndex :'sjType',width:100,
				align:'center',
				renderer:sjTypeRender
			}, {header : '报表名称',dataIndex :'title',width:300,
				renderer:comRender
			},{
				header : '填报人', width:170, dataIndex :'createperson',
				align: 'center'
			},{
				header : '填报日期', width:90, dataIndex :'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d')},
				align: 'center'
			},{
				header : '状态/审核', width:90, align:'center',	dataIndex :'reportStatus',	renderer:stateRender
			},{
				header : '退回原因', hidden: true, width :400,dataIndex :'reason',renderer:reasonRender.createDelegate()
			}
		],
		sm:new Ext.grid.RowSelectionModel({}),
		store:new Ext.data.Store({
				baseParams : Ext.apply({params:"pid='"+CURRENTAPPID+"' and report_status in ('1','2','3') order by sj_type desc"},comBaseParams),
				proxy : comProxy,
				reader : new Ext.data.JsonReader(comMeta,comColums),
				remoteSort : true,
				pruneModifiedRecords : true
		}),
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			//forceFit : true,
			ignoreAdd : true
		}
	},config));
//	tmpGridJit.store.sort('sjType','DESC');
	return tmpGridJit;
};
function sjTypeRender(val,meta,rec,rInx,cInx,store){
	if(val.length==6){
		return val.substring(0,4)+"年"+val.substring(4,6)+"月";
	}else{
		return val;
	}
}

function stateRender(value,meta,record){
	var renderStr="";
	if(value=="0") return "<font color=gray>未上报</font>";
	if(value=="1") {
		var imgDel="";
		var imgOk="";
		if(ModuleLVL<3){
			imgDel="<img src='" + BASE_PATH +"/jsp/res/images/sendBack2.png' title='退回'  onclick='verifyBack()'>";
			imgOk="&nbsp;&nbsp;<img src='" + BASE_PATH +"/jsp/res/images/pass2.png' title='通过' onclick='verifyPass()'>&nbsp;&nbsp;";
		}
		renderStr="<font color=black>未审核</font>";
		return "<a title='点击查看详细信息' " +
			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>"+imgOk+imgDel;
	}
	if(value=="2") renderStr="<font color=red>退回重报</font>";
	if(value=="3") {
		if(sendBackFlag=='2'&&USERBELONGUNITTYPEID=="2"){
			var imgDel="";
			if(ModuleLVL<3){
				imgDel="&nbsp;&nbsp;<img src='" + BASE_PATH +"/jsp/res/images/sendBack2.png' title='退回'  onclick='verifyBack()'>";
			}
			renderStr="<font color=blue>审核通过</font>";
			return "<a title='点击查看详细信息' " +
			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>"+imgDel;
		}
		renderStr="<font color=blue>审核通过</font>";
	
	}
	return "<a title='点击查看详细信息' " +
			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
}
function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}
function verifyPass(){
	Ext.Msg.confirm('提示','您是否确认要"审核通过"此条记录？',function(txt){
		if(txt=='yes'){
			var record=null;
			record=gridJit.getSelectionModel().getSelected();
			var uids=record.get('uids');
			Ext.getBody().mask("提交中……");
			pcTzglService.updatePcTzglMonthInvestMState(uids,REALNAME,USERBELONGUNITNAME," ",USERBELONGUNITID,3, function(flag){
				Ext.getBody().unmask();
				if(flag=="1"){
					Ext.example.msg('提示','操作成功');													
				}else{
					Ext.example.msg('提示','操作失败',2);													
				}
				gridJit.getStore().reload();
			})
		}
	})
}

function verifyBack(){
	
	try{
		var rec = null;
		rec=gridJit.getSelectionModel().getSelected();
		if(rec){
			var winPanel = new BackWindow({
				doBack:function(reason){
					var mask = new Ext.LoadMask(Ext.getBody(), {msg : "退回中，请稍等..."});
					mask.show();
					pcTzglService.updatePcTzglMonthInvestMState(rec.get('uids'),REALNAME,USERBELONGUNITNAME,reason,USERBELONGUNITID,2, function(flag){
					mask.hide();
						if(flag=="1"){
							Ext.example.msg('提示','操作成功!');	
							win.hide();
						}else{
							Ext.example.msg('提示','操作失败!');										
						}
						gridJit.getStore().reload();
					})
				}
			});
			var win=new Ext.Window({
				id:'backWin',
				width: 700, minWidth: 460, height: 400,
				layout: 'border', closeAction: 'close',
				border: false, constrain: true, maximizable: true, modal: true,
				items: [winPanel,{
					region : 'south',
					height:240,
					title:'交互记录',
					xtype : 'panel',
//					autoScroll:true,
					html : '<iframe name="bidDetailFrame" src="'+CONTEXT_PATH+ 
					'/PCBusiness/bid/pc.businessBack.log.jsp?edit_pid='+rec.get('pid')+'&edit_uids='+rec.get('uids')
					+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
				}]
			});
			win.show();
		}
	}catch(e){
	}
					
}

function reasonRender(val,meta,rec,rInx,cInx,store){
	if(val!=""){
		meta.attr = 'title="' + val + '"';
	}
    return val;
}

function comRender(v, m, r)
{
	var repState=r.get('reportStatus');
	return "<a href='javascript:showEditWindow2()'>"+v+"</a>";
}	
var selectGrid=null;
function showEditWindow2(){
	var xgridUrl = CONTEXT_PATH
			+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
	var record = gridJit.getSelectionModel().getSelected();
		var param = new Object()
		param.sj_type = '2013'; // 时间
		param.unit_id = record.get('pid'); // 取表头用
		param.company_id = ''; // 取数据用（为空是全部单位）
		param.editable = false; // 是否能编辑，不传为不能编辑
		param.hasSaveBtn = false;
        param.headtype = 'PC_TZGL_MONTH_INVEST_REPORT';
		param.keycol = 'uids';
		param.xgridtype = 'grid';
		param.initInsertData = "pid`" + record.get('pid');
		param.filter = " and Pc_Tzgl_Month_Invest_d.pid='"+record.get('pid')+"' and Pc_Tzgl_Month_Invest_d.sj_type='"+record.get('sjType')+"'"
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window.showModelessDialog(xgridUrl, param,
						"dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
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
function resetCellFrm(){
	if(pageType=='confirm'){
		gridJit.store.baseParams.params = "reportStatus =3  and sjType='"+curSjType+"' order by sjType desc"
	}else{
		gridJit.store.baseParams.params = "pid='"+CURRENTAPPID+"' and reportStatus in('1','2','3') order by sjType desc"
	}
	gridJit.store.load();
}