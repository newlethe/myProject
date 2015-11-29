var nowDate = new Date();
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth()+1;
var nowSj = nowYear + ((nowMonth<10)?'0':'') + nowMonth
var nowSjDesc = nowYear+'年'+(((nowMonth<10)?'0':'') + nowMonth)+'月'
var months = new Array()
var data_sj = new Array()
var combox_month,combox_sj,store_month
var lsh = ""
var deptId = ""
if(USERDEPTID!=null && USERDEPTID != ''){
	deptId = USERDEPTID
}else if(USERPOSID!=null && USERPOSID != ''){
	deptId = USERPOSID
}else{
	deptId = UNITID 
}
var kqDaysDeptZb

var kqGridPanel
var treeLoaderURL = BASE_PATH+'servlet/RlzyServlet'+'?ac=getKqGridTree'+ '&sjType='+nowSj;
var treeLoader
var selectedTreeGridNode,selectedTreeGridParentNode

var selectedRoleId = "";
var selectedRoleName = "";
var selectedRoleType = "";
var SPLITB = "`";
var root;
var cssCheckOn= 'x-grid3-check-col-on';
var cssCheckOff= 'x-grid3-check-col';
var initUnit = UNITID;
var contentPanel,gridPanel,cellPanel
var btn_switch,btn_upload

Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);
	rlzyMgm.findSjListForKqDeptByDeptId(deptId,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].toString());
			temp.push(list[i].toString().substr(0,4)+'年'+list[i].toString().substr(4,6)+'月');
			months.push(temp);
		}
	});
    DWREngine.setAsync(true);
    
    //部门，填写人，也需要像状态那么处理，显示数据相应的部门、填写人、状态，待处理
	var label_bm = new Ext.Toolbar.Item(document.all.toolbarDeptName);//{text:"部门："+(USERORG==""?UNITNAME:USERORG)});
	var label_month = new Ext.Toolbar.TextItem({text:"考勤月份："});
	var label_user = new Ext.Toolbar.Item(document.all.toolbarUserName);//{text:"填写人："+REALNAME});
	var label_state = new Ext.Toolbar.Item(document.all.toolbarStatus);

	store_month = new Ext.data.SimpleStore({
		fields: ['value','text'],   
		data: months
	})
	combox_month = new Ext.form.ComboBox({
			name: 'selectMonth',
			hiddenName: 'selectMonth',
			fieldLabel: '考勤月份',
			valueField: 'value', 
			displayField: 'text',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            forceSelection:true,
	        selectOnFocus:true,
	        emptyText:'选择月份...',
            store: store_month,
            value: nowSj,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
	});
    combox_month.on('select', function(obj, record, idx ){
    	nowSj = record.data.value
	    if(!findKqDeptZb()){
	    	alert('没有数据')
	    }else{
			lsh = kqDaysDeptZb.lsh
			deptId = kqDaysDeptZb.deptId
	    	setStatus(kqDaysDeptZb.status)
	    	loadTreeGrid()
    		if(contentPanel.getActiveTab().getId()!='tab_list')
				openCell(kqDaysDeptZb.lsh,kqDaysDeptZb.deptId)
	    }
    });
	combox_month.setValue(nowSj);
	
	for(y = nowYear; y >= nowYear-1; y--) {
		for(m = 12; m >= 1; m--) {
			var temp = new Array();
			var flag = true;
			for(i = 0; i < months.length; i++){
				if(months[i][0].toString() == y+''+(((m<10)?'0':'') + m)){
					flag = false;
					break;
				}
			}
			if(flag){
				temp.push(y+''+(((m<10)?'0':'') + m));
				temp.push(y+'年'+(((m<10)?'0':'') + m)+'月');
				data_sj.push(temp);
			}
		}
	}
	
	btn_upload = new Ext.Toolbar.Button({
		text: '未上报',
		tooltip: '保存本月考勤数据',
        iconCls: 'icon-by-category',
		disabled: true,
		hidden: true,
		handler: uploadById
	});
	btn_switch = new Ext.Toolbar.Button({
		text: '返回',//'切换',
		tooltip: '返回列表查看',//'切换到部门列表或具体考勤数据',
        iconCls: 'icon-by-category',
//		disabled: true,
		handler: switchTab
	});
	
	var btn_create = new Ext.Toolbar.Button({
//		text: '',
		tooltip: '发起月考勤填报',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/add.png',
//		disabled: true,
		handler: create
	});
	
    var tbar = new Ext.Toolbar({
    	items:[
    		btn_switch,label_month,combox_month
    		,btn_create
//			,'&nbsp;&nbsp;&nbsp;&nbsp;','-',label_bm,'&nbsp;&nbsp;&nbsp;&nbsp;','-',label_user,'&nbsp;&nbsp;&nbsp;&nbsp;','-',label_state,'->',btn_upload
			,'&nbsp;&nbsp;&nbsp;&nbsp;',label_bm,'&nbsp;&nbsp;&nbsp;&nbsp;',label_user,'&nbsp;&nbsp;&nbsp;&nbsp;',label_state,'->',btn_upload
		]
	});
	
//--------------------------------------------------------------
	root = new Ext.tree.TreeNode({
            text:'root'
    })
	treeLoader = new Ext.tree.TreeLoader({
		url: treeLoaderURL,//selectedRoleId,
		clearOnLoad : true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	treePanel = new Ext.tree.ColumnTree({
        id:'modules-tree-panel',
        iconCls: 'icon-by-category',
        //region:'center',
        region:'treegrid',
        frame: false,
        border: false,
//        collapsed: true,
//        collapsible: true,
//        header:true,
//        title:'treePanelTitle',
//        lines:false,
//        autoScroll:true,
//        animCollapse:false,
//        animate: false,
//        collapseMode:'mini',
//        autoWidth: true,  
//        autoHeight: true,  
        height: 800,  
        autoScroll:true,
        rootVisible: false,
        tbar:[{
            iconCls: 'icon-expand-all',
			tooltip: 'Expand All',
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function(){ root.collapse(true); }
        }],
        columns:[{
            header:'单位名称',
            width:240,
            dataIndex:'unitname',
            search:true
        },{
            header:'单位ID',
            width:0,
            dataIndex:'id',
            search:true
        },{
            header:'考勤流水号',
            width:0,
            dataIndex:'lsh',
            search:true
        },{
            header:'标题',
            width:360,
            dataIndex:'title',
            search:true,
            renderer: function(vl, n, a){
            	//return "<a href='javascript:void(0)' title='" + vl + "' onclick=openProForm('"+ a['prjSerialnumber'] +"','"+a['singlePrjflag']+"','"+a['prjName']+"') style='color:blue;text-decoration:underline'>"+ vl +"</a>";
            	if(a['deptId'] != defaultOrgRootID && a['status'] != null && a['status'] != '1'){
            		return vl;
            	}else{
            		return "<u title='" + vl + "' onclick=openCell('"+ a['lsh'] +"','"+ a['deptId'] +"') style='color:blue;text-decoration:underline'>"+ vl +"</u>";
            	}
            }
        },{
            header:'单位部门',
            width:0,
            dataIndex:'deptId',
            align: 'center',
            search:true
        },{
            header:'状态',
            width:150,
            dataIndex:'status',
            align: 'center',
            search:true
            ,renderer:function(value, n, a){
				if(value == null || value == '0')
					//return '<font color=gray>未上报</font>&nbsp;&nbsp;<u onclick=openCell(\''+ a['lsh'] +'\',\''+ a['deptId'] +'\') style=\'color:green\'>直接编制</u>'
					return '<font color=gray>未上报</font>'
				else if(value == '1')
					return '<B><font color=green>已上报</font></B>&nbsp;&nbsp;<u onclick=uploadById(\''+ a['lsh'] +'\',\'4\')  style=\'color:red\'>退回</u>&nbsp;&nbsp;<u onclick=permit(\''+ a['lsh'] +'\',\'3\') style=\'color:blue\'>批准</u>'
				else if(value == '2')
					return '<B><font color=red>申请重报</font></B>&nbsp;&nbsp;<u onclick=uploadById(\''+ a['lsh'] +'\',\'4\')  style=\'color:red\'>退回</u>&nbsp;&nbsp;<u onclick=permit(\''+ a['lsh'] +'\',\'3\') style=\'color:blue\'>批准</u>'
				else if(value == '3')
					return '<B><font color=blue>已批准</font></B>'
				else if(value == '4')
					return '<B><font color=blue>已退回</font></B>'
			}
        },{
            header:'流程状态',
            width:0,
            dataIndex:'billStatus',
            align: 'center',
            search:true
            ,renderer:function(value){
				if(value == null || value == '0')
					return '<font color=gray>未开始</font>'
				else if(value == '1')
					return '<B><font color=green>已审批</font></B>'
				else if(value == '-1')
					return '<B><font color=red>流程中</font></B>'
			}
        },{
            header:'上报时间',
            width:175,
            dataIndex:'latestDate',
            align: 'center',
            search:true
        }],       
        loader: treeLoader,
        root: root
	});
	treePanel.on("click", nodeClick);
	function nodeClick(node, e){
		lsh = node.attributes['lsh']
		deptId = node.attributes['deptId']
		status = node.attributes['status']
		unitname = node.attributes['unitname']
		username = node.attributes['username']
		setLabels(unitname,username,status)
	    //checkButton(node)
	    //findKqDeptZb()
	}
	treePanel.on("beforeclick", nodeBeforeClick);
	function nodeBeforeClick(node, e){
		lsh = node.attributes['lsh']
		deptId = node.attributes['deptId']
		//status = node.attributes['status']
		//unitname = node.attributes['unitname']
		//username = node.attributes['username']
		//setLabels(unitname,username,status)
	    findKqDeptZb()
	}
//------------------------------------------------------------------------------
	gridPanel = new Ext.Panel({
		id: 'tab_list',
			layout: 'fit',
//			frame: true,
			items: treePanel
	});
	gridPanel.on('activate',onSwitchTabs)
	cellPanel = new Ext.Panel({
		id: 'tab_cell',
			layout: 'fit',
        //region:'center',
			frame: true,
			html: '<iframe name="cellFrame" src="'+CONTEXT_PATH+'/cell/eReport.jsp?openCellType=iframe" frameborder=0 style="width:100%;height:100%;"></iframe>'
			//renderTo: "center",
			//contentEl: "cell"
	});
	cellPanel.on('activate',onSwitchTabs)

	contentPanel = new Ext.TabPanel({
		id : 'content',
		renderTo: "center",
		region:'center',
        iconCls: 'icon-by-category',
        border: false,
        tbar: tbar,
        frame:true,
        tabPosition: 'buttom',
        defaults:{
        	autoScroll:true
        },
        activeTab: 0,
//        html: "cell填报"
        items: [gridPanel,cellPanel]
	});

//viewport--------------------------------------------------------------------------------------------------	
    var viewport = new Ext.Viewport({
    	//layout:'fit',
        layout:'border',
        items:[ contentPanel]
    });	
//viewport--------------------------------------------------------------------------------------------------	
	treePanel.render();
	treeLoader.on('load', function(){
		root.expand(true);
		root.collapse(true);
		root.expand(false, true, function()
			{
				
				for (var index=0; index<root.childNodes.length;index++)
				{
					root.childNodes[index].expand()
				}
				
			})
	})
	treePanel.expand()
	treeLoader.url = treeLoaderURL//selectedRoleId
	treeLoader.load(treePanel.getRootNode(), function(){
		while (root.childNodes.length > 1) {
			root.firstChild.remove()
		}    			
	})
	loadTreeGrid()
//加载数据--------------------------------------------------------------------------------------------------

//自定方法--------------------------------------------------------------------------------------------------
//	findKqDeptZb();
});	
//自定方法--------------------------------------------------------------------------------------------------
	function onSwitchTabs(tab){
		if(tab.id=='tab_list'){
			btn_switch.hide()
		}else{
			btn_switch.show()
//			openCell()
		}
	}
	function switchTab(){
		if(contentPanel.getActiveTab().getId()=='tab_list'){
			btn_switch.hide()
			contentPanel.setActiveTab(cellPanel)
//			openCell()
		}else{
			btn_switch.show()
			contentPanel.setActiveTab(gridPanel)
		}
	}
	function loadTreeGrid(){
		treeLoaderURL = BASE_PATH+'servlet/RlzyServlet'+'?ac=getKqGridTree'+ '&sjType='+nowSj;
		treeLoader.url = treeLoaderURL
		treeLoader.load(treePanel.getRootNode(), function(){
			while (root.childNodes.length > 1) {
				root.firstChild.remove()
			}    			
		})
	}
	function findKqDeptZb(){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyMgm.findKqDeptZbByDeptIdAndSj(deptId,nowSj,function(obj){
			if(obj!=null && obj.lsh!=null){
				kqDaysDeptZb = obj
				rtn = true;
			}else{
				rtn = false;
			}
		});
	    DWREngine.setAsync(true);
	    return rtn
	}
/*	function upload(lsh,status){
		DWREngine.setAsync(false);
		if(btn_upload.getText()=='退回重报'){
			kqDaysDeptZb.status = "0"
		}
		//kqDaysDeptZb.userId = USERID
		kqDaysDeptZb.latestDate = new Date()
		rlzyMgm.updateKqDaysDeptZb(kqDaysDeptZb,function(rtn){
			if(rtn){
				setStatus(kqDaysDeptZb.status)
				treeLoader.load(treePanel.getRootNode(), function(){
					while (root.childNodes.length > 1) {
						root.firstChild.remove()
					}    			
				})
			}
		});
	    DWREngine.setAsync(true);
	}*/
	function uploadById(lsh,status){
		DWREngine.setAsync(false);
		rlzyMgm.updateKqDaysDeptZbById(lsh,status,function(rtn){
			if(rtn){
				setStatus(status)
				treeLoader.load(treePanel.getRootNode(), function(){
					while (root.childNodes.length > 1) {
						root.firstChild.remove()
					}    			
				})
			}
		});
	    DWREngine.setAsync(true);
	}
	function permit(lsh,status){
		Ext.Msg.confirm('提示', '一旦批准无法修改，确认批准吗？', function(btn, text){
		    if (btn == 'ok' || btn == 'yes'){
				//xcBonus.userId = USERID
				kqDaysDeptZb.status = '3'
				kqDaysDeptZb.billStatus = '1'
				kqDaysDeptZb.latestDate = new Date()
				rlzyMgm.updateKqDaysDeptZb(kqDaysDeptZb,function(rtn){
					if(rtn){
						//将批准过的数据计算汇总数据
						//calcXcBonusTjData()
						setStatus(kqDaysDeptZb.status)
						treeLoader.load(treePanel.getRootNode(), function(){
							while (root.childNodes.length > 1) {
								root.firstChild.remove()
							}    			
						})
						rlzyMgm.makeKqAnnualleave(kqDaysDeptZb.sjType.substr(0, 4),kqDaysDeptZb.unitId,"unit",function(rtn){
							if(!rtn){
								alert('计算年休假有错误')
							}
						});
					}else{
						alert('有错误')
					}
				});
		    }
		});
	}
	
	var win
	function create(){
		var store_sj = new Ext.data.SimpleStore({
			fields: ['value','text'],   
			data: data_sj
		})
		var combox_sj = new Ext.form.ComboBox({
			name: 'selectSj',
			hiddenName: 'selectSj',
			fieldLabel: '考勤月份',
			valueField: 'value', 
			displayField: 'text',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            forceSelection:true,
	        selectOnFocus:true,
	        emptyText:'选择月份...',
            store: store_sj,
//            value: nowSj,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		});
		//if(!win){
			win = new Ext.Window({
				id:'sjChooseWin',
				title : '选择考勤时间',
				width : 250,
				height : 100,
				autoScroll : true,
				isTopContainer : true,
				modal : true,
				resizable : false,
				layout : 'form',
				buttons: [{
					text: '确定',
					handler: function() {
						nowSj = combox_sj.getValue()
						nowSjDesc = nowSj.substr(0,4)+'年'+nowSj.substr(4,6)+'月'
					    if(!findKqDeptZb()){
					    	alert('没有数据')
				    	}else{
				    		store_month.add(new Ext.data.Record({value:nowSj,text:nowSjDesc}))
				    		combox_month.setValue(nowSj)
				    		setStatus(kqDaysDeptZb.status)
							openCell(kqDaysDeptZb.lsh,kqDaysDeptZb.deptId)
				    	}
					    //checkButton()
					}
				}, {
					text: '取消',
					handler: function() {
						win.close();
					}
				}],
				
				items : [combox_sj]
			})
    	//}
    	win.show();
	}
	function checkButton(node){
		var status = node.attributes['status']
		var deptid = node.attributes['deptId']
		if(deptid == defaultOrgRootID || status==null || status=='0'){
			btn_upload.disable()
			btn_upload.setText('未上报')
		}else if(status=='1'){
			btn_upload.enable()
			btn_upload.setText('退回重报')
		}else if(status=='2'){
			btn_upload.disable()
			btn_upload.setText('退回重报')
		}
	}
	function setStatus(status){
		var statusDesc = '';
		if(status==null||status=='0'){
			statusDesc = '未上报/已退回';
			btn_upload.disable()
			btn_upload.setText('未上报')
		}else if(status=='1'){
			statusDesc = '已上报';
			btn_upload.enable()
			btn_upload.setText('退回重报')
		}else if(status=='2'){
			statusDesc = '申请重报';
			btn_upload.setText('退回重报')
		}else{
			statusDesc = '';
			btn_upload.disable()
			btn_upload.setText('未上报')
		}
		document.all.toolbarStatus.value = '状态：' + statusDesc
		try{
			window.frames["cellFrame"].document.all.cmdFileSave.style.display = status==null||status=='0'?'':'none'
		}catch(e){}
	}
	function setLabels(unitname,username,status){
		setStatus(status)
		document.all.toolbarDeptName.value = "部门：" + unitname
		document.all.toolbarUserName.value = "填写人：" + username
	}
	function openCell(_lsh,_deptId){
		lsh = _lsh
		deptId = _deptId
		/*
		p_type	报表类型	必选	无	属性表中定义了报表类型
		p_date	数据期别	必选 	无	必须符合系统的数据期别规则
		p_corp	数据及报表所属单位（部门）
		在报表中定义{CORP}时，替换成该参数对应的单位名称。 	必选 	无	可以为 单位ID/部门ID模式，此种模式下表示应用于同单位下多个部门情况，根据部门ID查找报表模板，根据单位ID进行数据的存储。如果为单位ID模式，则报表模板和报表数据均用同一个单位ID。
		p_inx	指标（产品ID）。在报表中定义{INX}时，替换成该参数对应的指标（产品）名称。	可选 	无	指标管理中的指标ID
		saveAsFile	是否将cell保存为文件	可选	False	布尔类型
		savable	是否具备保存权限	可选	False	布尔类型
		p_key_col	保存数据主表主键	有主从关系结构且需要保存时，必选	无	数据表列
		p_key_val	保存数据主表主键值	有主从关系结构且需要保存时，必选	无	主表主键值
		拓展的参数
		p_remarkTable	数据说明信息对应的数据表	需要填写数据说明时，必选	无	数据表
		p_remarkCol	数据说明信息对应的数据列	需要填写数据说明时，必选	无	数据列
		p_where	拓展的数据过滤条件。针对仅用于数据查询的报表，除了报表的基础过滤条件外增加了该参数。	可选	无	table1`whereStr1|table2`whereStr2
		p_showVersion	是否显示历史版本按钮	可选	“none”	字符串，none或block
		p_showRemark	是否显示数据说明按钮	可选	“none”	字符串，none或block
		*/
		cellType = '17'
		cellDate = nowSj
		corp = (USERORGID==""?UNITID:USERORGID) + '/' + deptId//(USERORGID==""?UNITID:USERORGID)
		GUIDELINEIDS = 'zb_seqno'
		cellSaveable = false//kqDaysDeptZb!=null&&(kqDaysDeptZb.status==null||kqDaysDeptZb.status==0)?true:false
		reportIdTemp = lsh//kqDaysDeptZb!=null?kqDaysDeptZb.lsh:''
		REMARKTABLE = ''
		REMARKCOL = ''
		cellUrl = CONTEXT_PATH + "/cell/eReport.jsp?openCellType=iframe&p_type="
			+cellType+"&p_date=" + cellDate + "&p_corp=" + corp + "&p_inx="+GUIDELINEIDS
			+"&savable=" + cellSaveable + "&p_key_col=MASTERLSH&p_key_val=" + reportIdTemp
			+"&p_showVersion=none&p_showRemark=none&p_saveAsFile=false"
			+"&p_remarkTable="+REMARKTABLE+"&p_remarkCol="+REMARKCOL;
			
		contentPanel.setActiveTab(cellPanel)
			
		document.all.cellFrame.src = cellUrl;
	}
	function afterCellSaved(CellWeb,callback){
	    DWREngine.setAsync(false);
			rlzyMgm.calcKqDaysTjDataByKey(lsh,function(rtn){
				if(rtn){
					for(i=0; i<CellWeb.GetTotalSheets(); i++) {
						var maxRow = CellWeb.GetRows(i);
						var maxCol = CellWeb.GetCols(i);
						for(row=0; row < maxRow; row++){
							for(col=0; col < maxCol; col++){
								if(CellWeb.GetCellString( col, row, i ).indexOf("table:")!=-1){
									CellWeb.ClearArea(col+1, row+1, maxCol, maxRow, i, 1);
								}
							}
						}
					}
					var def = CellWeb.SaveToXML("")
					cellXML.db2xml( def,'17', deptId, nowSj, (USERORGID==""?UNITID:USERORGID), 'zb_seqno','',callback);
				}
			}
		);
	    DWREngine.setAsync(true);
	}
	