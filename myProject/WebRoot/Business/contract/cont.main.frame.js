var conid = "";
var conno = "";
var conmoney = "";
var conname = "";
var convalue = "";
var select = "";
var combox1="";//选择框1
var combox1value = "";//选择框1 的值
var combox2 = "";//选择框2
var combox3 = "" // 选择框3
var dsparams="";//ds 加载数据参数
var flowWindow;
var page = 1;
var isZb = "";
var zbXm = "";
var zbCont = "";
var bidType = "";
if(PID!=""&&PRONAME!=""){
    switchoverProj(PID,PRONAME);
}
var zbXmArr = new Array();
var zbContArr = new Array();
Ext.onReady(function() {
	DWREngine.setAsync(false);
	baseMgm.getData("select t.uids,t.zb_name from PC_BID_ZB_APPLY t",function(list){
		if(list){
			for(var i=0;i<list.length;i++){
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				zbXmArr.push(temp);
			}
		}
	});
	DWREngine.setAsync(true);
	//根据用户权限判断是否显示分摊、付款、变更等操作按钮
	var conBtnMod;
	DWREngine.setAsync(false);
	conoveMgm.getConRockPowerRole(USERNAME,function(rtn){
		conBtnMod = rtn;
	})
	DWREngine.setAsync(true);

	function doLoad() {
		var modName = "合同" + this.text;
		var url = "";
		var modid = null;
		DWREngine.setAsync(false);
		systemMgm.getModuleIdByName(modName, null, function(flag) {
					modid = flag
				})
		DWREngine.setAsync(true);
		if (conid != "" && conno != "" && conname != "")
			loadModule(modid, window.frames[0], "conid=" + conid + "&conname="
							+ encodeURIComponent(conname) + "&conno=" + conno
							+ "&convalue=" + convalue + "&select=" + conid+"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView+"&page="+page);
	}
	var btnConInfo = new Ext.Button({
				id : 'contract',
				text : '合同列表',
				tooltip : '合同列表',
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/liebiao.png',
				handler : function() {
	               var modName = "合同基本信息" ;
					window.location.href=CONTEXT_PATH+"/Business/contract/cont.main.frame.jsp?optype="+OPTYPE+"&pid="+PID+"&proname="+PRONAME+"&conids="+CONIDS+"&uids="+UIDS+"&dyView="+dyView;
				}
			});
	var btnConDetailInfo = new Ext.Button({
		id : 'contractDetail',
		text : '详细信息',
		tooltip : '详细信息',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/xxxx.png',
		handler : function() {   
           	if (conid != ""&&conid!=null){
           		window.frames[0].location.href=CONTEXT_PATH+"/Business/contract/cont.generalInfo.view.jsp?acc=con&&conid="+conid+"&query=false&conids="+CONIDS+"&uids="+UIDS+"&dyView="+dyView+"&optype="+OPTYPE+"&page="+page;
           	}else{
           		Ext.Msg.alert("提示","请选中一条记录");
           	}
		}
	});
	var btnConApprovalInfo = new Ext.Button({
		id : 'contractApproval',
		text : '审批信息',
		tooltip : '审批信息',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/sc.png',
		handler : function() {
			var _conno = conno;
			if(_conno!=""&&_conno!=null){
				baseDao.findByWhere2(
				"com.sgepit.frame.flow.hbm.InsDataInfoView",
				"paramvalues like '%conno:" + _conno
				+ "%' and modname ='合同登记'", function(list) {
				if (list.length > 0) {
					showFlow(list[0].insid);
					} else {
							Ext.example.msg('提示', '该合同没有走审批流程！');
						}
					});
			}else{
	           		Ext.Msg.alert("提示","请选中一条记录");
	           	}
		}
	});
	var btnPayInfo = new Ext.Button({
				id : 'pay',
				text : '付款',
				tooltip : '合同付款',
				disabled : true,
                cls:'x-btn-text-icon',
                icon : 'jsp/res/images/icons/payment.png',
                hidden :　conBtnMod['合同付款']=="false" ? false : true,
				handler : doLoad
			});
	var btnChange = new Ext.Button({
				id : 'change',
				text : '变更',
				tooltip : '合同变更',
                cls: 'x-btn-text-icon',
                icon : 'jsp/res/images/icons/Change.png',
				disabled : true,
				hidden :　conBtnMod['合同变更']=="false" ? false : true,
				handler : doLoad
			});
	var btnBreach = new Ext.Button({
				id : 'breach',
				text : '违约',
				tooltip : '合同违约',
                cls: 'x-btn-text-icon',
                icon : 'jsp/res/images/icons/breachOfContract.png',
				disabled : true,
				hidden :　conBtnMod['合同违约']=="false" ? false : true,
				handler : doLoad
			});
	var btnCompensate = new Ext.Button({
				id : 'compensate',
				text : '索赔',
				tooltip : '合同索赔',
                cls: 'x-btn-text-icon',
                icon : 'jsp/res/images/icons/claimant.png',
				disabled : true,
				hidden :　conBtnMod['合同索赔']=="false" ? false : true,
				handler : doLoad
			});
	var btnBalance = new Ext.Button({
				id : 'balance',
				text : '结算',
				tooltip : '合同结算',
                cls: 'x-btn-text-icon',
                icon : 'jsp/res/images/icons/settlement.png',
				disabled : true,
				hidden :　conBtnMod['合同结算']=="false" ? false : true,
				handler : doLoad
			});
	var btnRemove = new Ext.Button({
				id : 'remove',
				text : '移交',
				tooltip : '合同移交',
                cls: 'x-btn-text-icon',
                icon : 'jsp/res/images/icons/transfer.png',
				disabled : true,
				handler : doLoad
			});

	var btnUpload = new Ext.Button({
				id : 'upload',
				text : '附件',
				tooltip : '附件上传',
			    cls: 'x-btn-text-icon',
                icon : 'jsp/res/images/icons/attachment.png',
				disabled : true,
				hidden :　conBtnMod['合同附件']=="false" ? false : true,
				handler : doLoad
			});

	var btnExpress = new Ext.Button({
				id : 'express',
				text : '公式定义',
				tooltip : '公式定义',
                cls: 'btn',
				handler : function() {
					loadModule('公式定义', window.frames[0]);
				}
			});
	var btnMoney = new Ext.Button({
				id : 'money',
				text : '合同分摊',
				tooltip : '合同分摊',
                cls: 'x-btn-text-icon',
                icon : 'jsp/res/images/icons/ft.png',
				disabled : true,
				hidden :　conBtnMod['合同分摊']=="false" ? false : true,
				handler : function() {
		        var url = "";
		        var modid = null;
		        DWREngine.setAsync(false);
		        systemMgm.getModuleIdByName("合同分摊", null, function(flag) {
					modid = flag
				})
		        DWREngine.setAsync(true);
		        if (conid != "" && conno != "" && conname != "")
			        loadModule(modid, window.frames[0], "conid="
							+ conid + "&conname=" + encodeURIComponent(conname)
							+ "&conmoney=" + conmoney + "&conno=" + conno);			
				}
			});
   var backRtn = new Ext.Button({
         text : '返回',
         iconCls :'returnTo',
         handler : function (){
             history.back();
         }
   })
   //是否招标
   var zbFilter = "";
   var zbXmFilter = "";
   var zbContFilter = "";
   var dsZb = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : [['0','全部'],['1','通过招标'],['2','未通过招标']]
	});
   var zbCombo = new Ext.form.ComboBox({
		store : dsZb,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		//emptyText : '选择合同分类一....',
		selectOnFocus : true,
		maxHeight:220,
		hidden : DEPLOY_UNITTYPE == "0",
		width : 90
	});
	zbCombo.setValue('0');
	zbCombo.on('select',zbComboselect);
	//招标项目
	var dsZbXm = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : zbXmArr
	});
	var zbXmCombo = new Ext.form.ComboBox({
		store : dsZbXm,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		disabled : true,
		width : 100,
		listWidth:220,
		maxHeight:220,
		hidden : DEPLOY_UNITTYPE == "0"
	});
	zbXmCombo.on('select',zbXmComboselect);	
	//招标内容
	var dsZbCont = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : []
	});
	var zbContCombo = new Ext.form.ComboBox({
		store : dsZbCont,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		disabled : true,
		width : 100,
		listWidth:220,
		maxHeight:220,
		hidden : DEPLOY_UNITTYPE == "0"
	});
	zbContCombo.on('select',zbContComboselect);	
	//是否招标下拉框事件
	function zbComboselect(){
		isZb = "";
		isZb = zbCombo.getValue();
		var combo2 = mainFrame.combo2.getValue();
		if(isZb =='0'){
			zbFilter = mainFrame.filter1;
			zbXmCombo.setDisabled(false);
		}else if(isZb =='1'){
			zbFilter = mainFrame.filter1+" and bidtype is not null";
			zbXmCombo.setDisabled(false);
		}else if(isZb =='2'){
			zbXmCombo.clearValue();
			zbXmCombo.disable();
			zbContCombo.clearValue();
			zbContCombo.disable();
			zbFilter = mainFrame.filter1+" and bidtype is null";
		}
		if(combo2 !='' && combo2 !='-1' ){
			zbFilter +=" and sort = '" + combo2 + "'"
		}
		mainFrame.paramsStr = zbFilter;
		if(mainFrame.gridfiter != ''){
			mainFrame.paramsStr += " and "+mainFrame.gridfiter;
		}
		mainFrame.window.reload();
	}
	//招标项目
	function zbXmComboselect(){
		bidType = "";
		zbXm = zbXmCombo.getValue();
		zbContArr = [];
		DWREngine.setAsync(false);
		baseMgm.getData("select t.uids,t.contentes from Pc_Bid_Zb_Content t where t.zb_uids='"+zbXm+"'",function(list){
			if(list){
				for(var i=0;i<list.length;i++){
					var temp = new Array();
					temp.push(list[i][0]);
					baseMgm.getData("select t.BIDTYPE from v_con t where t.BIDTYPE='"+list[i][0]+"'",function(str){
						if(str == null || str == ''){
							temp.push("<font color=red>"+list[i][1]+"</font>");
						}else{
							temp.push(list[i][1]);
						}
					});
					zbContArr.push(temp);
				}
			}
		});
		DWREngine.setAsync(true);
		dsZbCont.loadData(zbContArr);
		zbContCombo.setDisabled(false);
		if(zbXm !=''){
			DWREngine.setAsync(false);
			baseMgm.getData("select t.uids from Pc_Bid_Zb_Content t where t.zb_uids='"+zbXm+"'",function(list){
				if(list){
					for(var i=0;i<list.length;i++){
						bidType +="'"+list[i]+"',"
					}
				}
			});
			DWREngine.setAsync(true);
			bidType = bidType.substring(0,bidType.length-1)
			zbXmFilter = " and bidtype in("+bidType+")"
			if(bidType !=''){
				mainFrame.paramsStr = zbFilter + zbXmFilter;
			}
		}
		mainFrame.window.reload();
	}
	//招标内容下拉框事件
	function zbContComboselect(){
		zbCont = '';
		zbCont = zbContCombo.getValue();
		if(zbCont !=""){
			baseMgm.getData("select t.contentes from Pc_Bid_Zb_Content t where t.uids='"+zbCont+"'",function(str){
				if(str){
					zbContCombo.setRawValue(str);//选择后去掉下拉选项上的样式
				}
			});
			zbContFilter = " and bidtype='"+zbCont+"'";
			mainFrame.paramsStr = zbFilter + zbXmFilter + zbContFilter;
		}
		mainFrame.window.reload();
	}
	
	mainPanel = new Ext.Panel({
				layout : 'fit',
				region : 'center',
				border : false,
				header : false,
				contentEl : 'mainDiv',
				tbar : []
			})

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [mainPanel]
			});

	var gridTopBar = mainPanel.getTopToolbar()
	with (gridTopBar) {
		add(btnConInfo, '-', btnConDetailInfo,'-',btnConApprovalInfo,'-',"是否招标&nbsp;&nbsp;",zbCombo,'-','招标项目&nbsp;&nbsp;',zbXmCombo,'-','招标内容',zbContCombo,'->', btnMoney, "-", btnUpload, btnPayInfo,btnBalance,
				 btnChange,btnCompensate
				, btnBreach);
	}
	window.frames[0].location.href = CONTEXT_PATH
			+ "/Business/contract/cont.generalInfo.input.jsp?conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
	function showFlow(_insid) {
		if (!flowWindow) {
			flowWindow = new Ext.Window({
						title : ' 流程信息',
						iconCls : 'form',
						width : 900,
						height : 500,
						modal : true,
						closeAction : 'hide',
						maximizable : false,
						resizable : false,
						plain : true,
						autoLoad : {
							url : BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
							params : 'type=flwInfo&insid=' + _insid,
							text : 'Loading...'
						}
					});
		} else {
			flowWindow.autoLoad.params = 'type=flwInfo&insid=' + _insid;
			flowWindow.doAutoLoad();
		}
		flowWindow.show();
	}
});