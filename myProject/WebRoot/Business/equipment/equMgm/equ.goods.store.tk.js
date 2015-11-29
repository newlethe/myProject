var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreTk";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "tkDate";

var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreTkSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";

var selectTreeid = "";
var selectUuid = "";
var selectConid = "";
var selectParentid = "";
var fileWin;
var selectWin;
var equTypeArr = new Array();
var getEquidstore = new Array();
var ds;
var dsSub;
var jzArr = new Array();
var businessType='zlMaterial';//附件，SGCC_ATTACH_LIST表事务类型字段

Ext.onReady(function(){
	var formPanelName = CURRENTAPPID == "1031902"? "设备/材料退库单":"设备退库单";
	var fm = Ext.form;
	DWREngine.setAsync(false);
	//机组号
	appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			jzArr.push(temp);			
		}
	});		
	//设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			equTypeArr.push(temp);			
		}
	});
	//库存位置
	baseMgm.getData("select uids,equno from equ_warehouse where pid='" + CURRENTAPPID
					+ "' order by uids ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					getEquidstore.push(temp);
				}
			})
//	var sqlman = "select t.userid,t.realname from rock_user t where t.userid in (select r.userid from rock_role2user r where r.rolepk='4028814829fe2fc80129fe79a1b3003b')";
//	baseDao.getData(sqlman,function(list){
//		for(i = 0; i < list.length; i++) {
//			var temp = new Array();
//			temp.push(list[i][0]);			
//			temp.push(list[i][1]);			
//			stockmarr.push(temp);			
//		}
//	});
	//合同列表
	var conArr=new Array();
	var sql = "select c.conid,c.conname  from Equ_Cont_View c";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			conArr.push(temp);			
		}
	});
	DWREngine.setAsync(true);
	var addBtn = new Ext.Button({
		id : 'addBtn',
		text : '新增',
		iconCls : 'add',
		handler : addOrEditHandler
	});
	var editBtn = new Ext.Button({
		id : 'editBtn',
		text : '修改',
		iconCls : 'btn',
		handler : addOrEditHandler
	});
	var delBtn = new Ext.Button({
		text : '删除',
		iconCls : 'remove',
		handler : deleHandler
	});
	var sbtkPrintBtn = new Ext.Button({
		text : '设备退库单打印',
		iconCls : 'print',
		handler : function() {
			doPrint('EquGoodsStoreTkView', 'tkFileid');
		}
	});
	var sbysPrintBtn = new Ext.Button({
		text : '退库验收单打印',
		iconCls : 'print',
		handler : function() {
			doPrint('EquGoodsStoreTkYs', 'tkysFileid');
		}
	});

    var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同名称'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'tkNo' : {name : 'tkNo',fieldLabel : '退库单据号'},
		'tkDate' : {name : 'tkDate',fieldLabel : '退库日期'},
		'outId' : {name : 'outId',fieldLabel : '出库单主键'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号'},
		'stockManager' : {name : 'stockManager',fieldLabel : '库管员'},
		'makeUser' : {name : 'makeUser',fieldLabel : '制单人'},
		'remark' : {name : 'remark',fieldLabel : '退库备注'},
		'tkFileid' : {name : 'tkFileid',fieldLabel : '退库单单据文档'},
		'tkysFileid' : {name : 'tkysFileid',fieldLabel : '退库验收单单据文档'},
		'fileid' : {name : 'fileid',fieldLabel : '附件'}
	};

	sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});

	var cm = new Ext.grid.ColumnModel([
		{
			id:'uids',
			header: fc['uids'].fieldLabel,
			dataIndex: fc['uids'].name,
			hidden: true
		},{
			id:'pid',
			header: fc['pid'].fieldLabel,
			dataIndex: fc['pid'].name,
			hidden: true
		},{
			id:'treeuids',
			header: fc['treeuids'].fieldLabel,
			dataIndex: fc['treeuids'].name,
			hidden: true
		},{
			id:'finished',
			header: fc['finished'].fieldLabel,
			dataIndex: fc['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isInstallation");
				var str = "<input type='checkbox' "+(v==1?" disabled checked title='已完结' ":"title='未完结'")+" onclick='finishOut(\""+r.get("uids")+"\",this)'>"
				return str;
			},
			width : 40
		},{
			id:'tkNo',
			header: fc['tkNo'].fieldLabel,
			dataIndex: fc['tkNo'].name,
			width : 180,
			type : 'string'
		},{
			id:'tkDate',
			header: fc['tkDate'].fieldLabel,
			dataIndex: fc['tkDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'outId',
			header: fc['outId'].fieldLabel,
			dataIndex: fc['outId'].name,
			width : 180,
			hidden: true
		},{
			id:'outNo',
			header: fc['outNo'].fieldLabel,
			dataIndex: fc['outNo'].name,
			width : 160,
			type : 'string'
		},{
			id:'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
			width : 180,
			renderer : function(v,m,r){
				var conid = r.get('conid');
			    var conname;
				for(var i=0;i<conArr.length;i++){
					if(conid == conArr[i][0]){
						conname = conArr[i][1];
						break;
					}
				}
				var qtip = "qtip=" + conname;
  				return'<span ' + qtip + '>' + conname + '</span>';
//				var output ="<a title='"+conname+"' style='color:blue;' " +
//						"href=Business/contract/cont.generalInfo.view.jsp?conid="+conid+"&query=true\>"+conname+"</a>"		
//				return output;           
		},
			type : 'string',
			tab_col : 'ConOve|conid|conname'
		}, {
			id : 'tkFileid',
			header : fc['tkFileid'].fieldLabel,
			dataIndex : fc['tkFileid'].name,
			align : 'center',
			width : 90,
			renderer : function(v, m, r) {
				if (v != '') {
					return "<center><a href='" + BASE_PATH + "servlet/MainServlet?ac=downloadfile&fileid=" + v
							+ "'><img src='" + BASE_PATH + "jsp/res/images/word.gif'></img></a></center>";
				} else {
					return "<img src='" + BASE_PATH + "jsp/res/images/word_bw.gif'></img>";
				}
			}
		}, {
			id : 'tkysFileid',
			header : fc['tkysFileid'].fieldLabel,
			dataIndex : fc['tkysFileid'].name,
			align : 'center',
			width : 90,
			renderer : function(v, m, r) {
				if (v != '') {
					return "<center><a href='" + BASE_PATH + "servlet/MainServlet?ac=downloadfile&fileid=" + v
							+ "'><img src='" + BASE_PATH + "jsp/res/images/word.gif'></img></a></center>";
				} else {
					return "<img src='" + BASE_PATH
							+ "jsp/res/images/word_bw.gif'></img>";
				}
			}
		}, {
			id : 'fileid',
			header : fc['fileid'].fieldLabel,
			dataIndex : fc['fileid'].name,
			renderer : filelistFn,
			align : 'center',
			width : 100
		}, {
			id:'stockManager',
			header: fc['stockManager'].fieldLabel,
			dataIndex: fc['stockManager'].name,
			align : 'center',
			width : 160,
			type : 'string'
		},{
			id:'makeUser',
			header: fc['makeUser'].fieldLabel,
			dataIndex: fc['makeUser'].name,
			align : 'center',
			width : 160,
			type : 'string'
		},{
			id:'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width : 180
		}
	]);
	
	var Columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'tkNo', type : 'string'},
		{name : 'tkDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'outId', type : 'string'},
		{name : 'outNo', type : 'string'},
		{name : 'stockManager', type : 'string'},
		{name : 'makeUser', type : 'string'},
		{name : 'remark', type : 'string'},
		{name : 'tkFileid', type : 'string'},
		{name : 'tkysFileid', type : 'string'}
	];

	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: "pid='"+CURRENTAPPID+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    ds.setDefaultSort(orderColumn, 'desc');
	
	var gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		title : '设备退库单',
		tbar : ['<font color=#15428b><B>'+formPanelName+'<B></font>','-',addBtn,'-',editBtn,'-',delBtn,'-',sbtkPrintBtn,'-',sbysPrintBtn],
		header: false,
	    border: false,
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'jzNo' : {name : 'jzNo',fieldLabel : '机组号'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'stockId' : {name : 'stockId',fieldLabel : '设备库存主键'},
		'outSubId' : {name : 'outSubId',fieldLabel : '出库单明细中设备主键'},
		'tkId' : {name : 'tkId',fieldLabel : '退库单主键'},
		'tkNo' : {name : 'tkNo',fieldLabel : '退库单编号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'tkNum' : {name : 'tkNum',fieldLabel : '退库数量'},
		'storage' : {name : 'storage',fieldLabel : '退库存放库位'},
		'remark' : {name : 'remark',fieldLabel : '退库备注'}
	};
	var smSub = new Ext.grid.CheckboxSelectionModel();
	var cmSub = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcSub['uids'].fieldLabel,
			dataIndex : fcSub['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcSub['pid'].fieldLabel,
			dataIndex : fcSub['pid'].name,
			hidden : true
		},{
			id : 'stockId',
			header : fcSub['stockId'].fieldLabel,
			dataIndex : fcSub['stockId'].name,
			hidden : true
		},{
			id : 'outSubId',
			header : fcSub['outSubId'].fieldLabel,
			dataIndex : fcSub['outSubId'].name,
			hidden : true
		},{
			id : 'tkId',
			header : fcSub['tkId'].fieldLabel,
			dataIndex : fcSub['tkId'].name,
			hidden : true
		},{
			id : 'tkNo',
			header : fcSub['tkNo'].fieldLabel,
			dataIndex : fcSub['tkNo'].name,
			hidden : true
		},{
			id : 'boxNo',
			header : fcSub['boxNo'].fieldLabel,
			dataIndex : fcSub['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'equType',
			header : fcSub['equType'].fieldLabel,
			dataIndex : fcSub['equType'].name,
			renderer : function(v,m,r){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0])
						equ = equTypeArr[i][1];
				}
				return equ;
			},
			align : 'center',
			width : 100
		},{
			id : 'jzNo',
			header : fcSub['jzNo'].fieldLabel,
			dataIndex : fcSub['jzNo'].name,
			renderer : function(v,m,r){
				var jzNo = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jzNo = jzArr[i][1];
				}
				return jzNo;
			},
			align : 'center',
			width : 100
		},{
			id : 'equPartName',
			header : fcSub['equPartName'].fieldLabel,
			dataIndex : fcSub['equPartName'].name,
			align : 'center',
			width : 180
		},{
			id : 'ggxh',
			header : fcSub['ggxh'].fieldLabel,
			dataIndex : fcSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcSub['graphNo'].fieldLabel,
			dataIndex : fcSub['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcSub['unit'].fieldLabel,
			dataIndex : fcSub['unit'].name,
			width : 80
		},{
			id : 'tkNum',
			header : fcSub['tkNum'].fieldLabel,
			dataIndex : fcSub['tkNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'storage',
			header : fcSub['storage'].fieldLabel,
			dataIndex : fcSub['storage'].name,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<getEquidstore.length;i++){
					if(v == getEquidstore[i][0])
						storage = getEquidstore[i][1];
				}
				return storage;
			},
			align : 'center',
			width : 100
		},{
			id : 'remark',
			header : fcSub['remark'].fieldLabel,
			dataIndex : fcSub['remark'].name,
			align : 'center',
			width : 80
		}
	]);
	var ColumnsSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'stockId', type:'string'},
		{name:'outSubId', type:'string'},
		{name:'tkId', type:'string'},
		{name:'tkNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equType', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'tkNum', type:'float'},
		{name:'storage', type:'string'},
		{name:'remark', type:'string'},
		{name:'jzNo', type:'string'}
	];
	dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanSub,
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "pid='"+CURRENTAPPID+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeySub
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort(orderColumnSub, 'desc');	//设置默认排序列
    var gridPanelSub = new Ext.grid.GridPanel({
		ds: dsSub,
		cm: cmSub,
		sm:smSub,
		title:"退库单详细信息",
		border: false,
		region: 'south',
		header: false, 
		height : document.body.clientHeight*0.5,
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});

	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanel,gridPanelSub]
	});

	var view = new Ext.Viewport({
		layout:'border',
        items: [treePanel, contentPanel]
	});
	gridPanel.getTopToolbar().add('-',{
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow_
	});

	function showWindow_() {
		if(selectParentid == "0"){
		     fixedFilterPart = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )";
		}else{
			if(selectUuid != '' && selectConid != ''){
				//查询当前选中节点的所有子节点主键。
				var sql = "select a.uids from ( select t.* from equ_con_ove_tree_view t " +
						" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
						" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
						" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
				var treeuuidstr = "";
				DWREngine.setAsync(false);
				baseDao.getData(sql,function(list){
					for(i = 0; i < list.length; i++) {
						treeuuidstr += ",'"+list[i]+"'";		
					}
				});	
				DWREngine.setAsync(true);
				treeuuidstr = treeuuidstr.substring(1);
	            fixedFilterPart = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
			}
		}
		showWindow(gridPanel)
	};

	ds.load({params:{start:0,limit:PAGE_SIZE}});
	ds.on("load",function(){
    	setPermission();
    });
	sm.on('rowselect',function(){
		var record = sm.getSelected();
		if(record.get('finished') == 1){
			editBtn.setDisabled(true);
			delBtn.setDisabled(true);
		}else{
			if(ModuleLVL == '1' || ModuleLVL== '2'){
				editBtn.setDisabled(false);
				delBtn.setDisabled(false);
			}
		}
		dsSub.baseParams.params = "tkId = '"+record.get('uids')+"'";
		dsSub.load({params:{start:0,limit:PAGE_SIZE}});
	});

	//按钮权限设置
	function setPermission(){
		if(ModuleLVL != '1' && ModuleLVL != '2'){
			if(addBtn && editBtn && delBtn){
				addBtn.setDisabled(true);
				editBtn.setDisabled(true);
				delBtn.setDisabled(true);
			}
		}
	}

	function addOrEditHandler(){
	    var btnId = this.id;
		var record = sm.getSelected();
		var url = BASE_PATH+"Business/equipment/equMgm/equ.goods.store.tk.addorupdate.jsp"
		if(btnId == "addBtn"){
			if(selectUuid == "" && selectConid == ""){
				Ext.example.msg('提示信息','请先选择左边的合同分类树！');
		    	return ;			    
			}
			if(selectUuid != "" && selectConid == ""){
				Ext.example.msg('提示信息','请先选择该专业下的合同分类！');
		    	return ;
			}
			if(selectTreeid.indexOf("04") == 0){
				Ext.example.msg('提示信息','技术资料分类下不能添加退库单！');
		    	return ;
			}
			url += "?conid="+selectConid+"&treeuids="+selectUuid+"&treeid="+selectTreeid;
		}else if(btnId == "editBtn"){
			if(record == null){
				Ext.example.msg('提示信息','请先选择一条退库单！');
		    	return ;
			}		
			url += "?conid="+record.get("conid")+"&treeuids="+record.get("treeuids")+"&uids="+record.get("uids");
		}
		selectWin = new Ext.Window({
			width: 950,
			height: 500,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			html:"<iframe id='equtk' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(){
					ds.reload();
				},
				'show' : function(){
					equtk.location.href  = url;
				}
			}
	    });
		selectWin.show();
	};

	function deleHandler(){
		var record = sm.getSelected();
		Ext.Msg.show({
			title : '提示',
			msg : '是否删除该退库单及其退库详细信息？',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,
			fn : function(value) {
				if ("yes" == value) {
					gridPanel.getEl().mask("loading...");
					equMgm.deleteTkAndTkSub(record.get('uids'), function(flag) {
						if ("0" == flag) {
							Ext.example.msg('删除成功！',
									'您成功删除了该退库单信息！');
							ds.reload();
							if((ds.getTotalCount()-1)>0){
								sm.selectRow(0);
							}else{
								dsSub.removeAll();
							}
						} else{
							Ext.Msg.show({
								title : '提示',
								msg : '数据删除失败！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
						}
						gridPanel.getEl().unmask();
					});
				}
			}
		});
	};

	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

});

function finishOut(uids,finished){
	if(ModuleLVL != '1' && ModuleLVL !='2' ){
		finished.checked = !finished.checked;
		Ext.example.msg('提示信息', '此用户没有权限进行完结操作！');
		return;
	}
	Ext.Msg.show({
		title : '提示',
		msg : '完结后不可取消，不可编辑，确认要完结吗？',
		buttons : Ext.Msg.YESNO,
		icon : Ext.MessageBox.QUESTION,
		fn : function(value) {
			if ("yes" == value) {
				DWREngine.setAsync(false);
				equMgm.equTkFinished(uids,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','退库单完结操作成功！');
						finished.checked = true;
						ds.reload();
					}else{
						Ext.example.msg('提示信息','操作出错！');
						finished.checked = false;
					}
				});
				DWREngine.setAsync(true);
			}else{
			    finished.checked = false;
			}
		}
	});
}

function doPrint(filePrintType, fileField) {
	var fileid = "";
	var record = sm.getSelected();
	if (record == null || record == "") {
		Ext.example.msg('提示信息', '请先选择要打印的记录！');
		return;
	}
	var uids = record.get("uids");
	var finished = record.get("finished");
	var fileName = record.get('tkNo');
	var fileid = record.get(fileField);
	var hasfile = false;
	if (fileid == null || fileid == "") {
		// 模板参数，固定值，在 系统管理 -> office模板 中配置
		var sql = "select t.fileid,t.filename from APP_TEMPLATE t where t.templatecode='" + filePrintType + "'";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(list) {
			fileid = list[0][0];
			fileName += "-"+ list[0][1].substring(0, list[0][1].length);
		});
		DWREngine.setAsync(true);
	} else {
		hasfile = true;
	}
	
	if (fileid == null || fileid == "") {
		Ext.MessageBox.alert("文档打印错误", "文档打印模板不存在，请先在系统管理中添加！");
		return;
	} else {
		var docUrl = BASE_PATH + "Business/equipment/equMgm/equ.file.print.jsp?fileid=" + fileid + "&filetype="
			+ filePrintType + "&uids=" + uids + "&beanname=" + bean + "&hasfile=" + hasfile + "&save="
			+ (finished=="1"?false:true) + "&fileField=" + fileField + "&fileName=" + fileName + "&modetype=SBTK";
		docUrl = encodeURI(docUrl);
		window.showModalDialog(docUrl,"","dialogWidth:" + screen.availWidth + "px;dialogHeight:"
				+ screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
		ds.reload();
	}
}

// 附件
function filelistFn(value, metadata, record) {
	var uidsStr = record.get('uids')
	var downloadStr = "";
	var billstate = record.get('finished');
	var count = 0;
	var editable = true;
	DWREngine.setAsync(false);
	baseMgm.getData("select count(file_lsh) from sgcc_attach_list where transaction_id='"
			+ uidsStr + "' and transaction_type='" + businessType + "'", function(list) {
		if (list != null && list.length>0) {
			count = list[0];
		}
	});
	DWREngine.setAsync(true);
	downloadStr = "附件[" + count + "]";
	editable = true;
	return '<div id="sidebar"><a href="javascript:showUploadWin(\'' + businessType + '\', '
		+ editable + ', \'' + uidsStr + '\', \'' + '到货单附件' + '\')">' + downloadStr + '</a></div>';
}

// 显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
			title : '上传文件',
			msg : '请先保存记录再进行上传！',
			buttons : Ext.Msg.OK,
			icon : Ext.MessageBox.WARNING
		});
		return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH + "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
		+ businessType + "&editable=" + editable + "&businessId=" + businessId;
	var fileWin = new Ext.Window({
		title : title,
		width : 600,
		height : 400,
		minWidth : 300,
		minHeight : 200,
		layout : 'fit',
		closeAction : 'close',
		modal : true,
		html : "<iframe name='fileFrame' src='" + fileUploadUrl + "' frameborder=0 style='width:100%;height:100%;'></iframe>"
	});
	fileWin.show();
	fileWin.on("close", function() {
		ds.reload();
	});
}