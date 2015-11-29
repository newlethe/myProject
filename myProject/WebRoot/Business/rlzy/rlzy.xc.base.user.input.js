var nowDate = new Date();
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth()+1;
var nowSj = nowYear + ((nowMonth<10)?'0':'') + nowMonth
var nowSjDesc = nowYear+'年'+(((nowMonth<10)?'0':'') + nowMonth)+'月'
var months = new Array()
var data_sj = new Array()
var combox_month,combox_sj
var deptId = ""
if(USERDEPTID!=null && USERDEPTID != ''){
	deptId = USERDEPTID
}else if(USERPOSID!=null && USERPOSID != ''){
	deptId = USERPOSID
}else{
	deptId = UNITID 
}
var xcBaseUser
//var nowQh = '0371'
var store_month,store_sj

Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);
	rlzyMgm.findSjListForXcBaseUserByDeptId(defaultOrgRootId,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].toString());
			temp.push(list[i].toString().substr(0,4)+'年'+list[i].toString().substr(4,6)+'月');
			months.push(temp);
		}
	});
    DWREngine.setAsync(true);
    
//	var label_bm = new Ext.Toolbar.TextItem({text:"部门："+(USERORG==""?UNITNAME:USERORG)});
//	var label_user = new Ext.Toolbar.TextItem({text:"填写人："+REALNAME});
//	var label_state = new Ext.Toolbar.Item(document.all.toolbarStatus);
	var label_month = new Ext.Toolbar.TextItem({text:"时间："});

	store_month = new Ext.data.SimpleStore({
		fields: ['value','text'],   
		data: months
	})
	
	combox_month = new Ext.form.ComboBox({
			name: 'selectSj',
			hiddenName: 'selectSj',
			fieldLabel: '时间',
			valueField: 'value', 
			displayField: 'text',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            forceSelection:true,
	        selectOnFocus:true,
	        emptyText:'选择时间...',
            store: store_month,
            value: nowSj,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
	});
    combox_month.on('select', function(obj, record, idx ){
		nowSj = record.data.value
		if(findUserXcBaseDefine("query"))
			openCell()
    });
	
	var btn_create = new Ext.Toolbar.Button({
//		text: '',
		tooltip: '生成员工基数模板数据',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/add.png',
//		disabled: true,
		handler: create
	});
	
	btn_update = new Ext.Toolbar.Button({
		text: '重复生成',
		tooltip: '根据员工信息及基数重新生成员工基数',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/arrow_undo.png',
//		disabled: true,
		handler: update
	});

	var btn_delete = new Ext.Toolbar.Button({
		text: '删除离职员工数据',
		tooltip: '删除离职员工基数模板数据',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/delete.png',
//		disabled: true,
		handler: deleteNotOnJob
	});
	
    var tbar = new Ext.Toolbar({
    	items:[
			label_month
    		,combox_month
    		,btn_create
    		,'-',btn_update
    		//,'-'
    		//,btn_delete
		]
	});
	
	var cellPanel = new Ext.Panel({
		region: 'center',
			layout: 'fit',
			frame: true,
			html: '<iframe name="cellFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});

	var contentPanel = new Ext.Panel({
		id : 'content',
		title : '员工福利管理',
		renderTo: "center",
		layout:'border',
		region: 'center',
        border: false,
        tbar: tbar,
        items: [cellPanel]
	});
	
//viewport--------------------------------------------------------------------------------------------------	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ contentPanel]
    });	
//viewport--------------------------------------------------------------------------------------------------	
	var win
	function create(){
		data_sj = new Array()
		for(y = nowYear; y >= nowYear-1; y--) {
			for(m = 12; m >= 1; m--) {
				var temp = new Array();
				var flag = true;
				for(i = 0; i < store_month.getCount(); i++){
					if(store_month.getAt(i).get("value") == y+''+(((m<10)?'0':'') + m)){
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
		
		store_sj = new Ext.data.SimpleStore({
			fields: ['value','text'],   
			data: data_sj
		})
		var combox_sj = new Ext.form.ComboBox({
			name: 'selectSj',
			hiddenName: 'selectSj',
			fieldLabel: '月份',
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
				title : '选择时间',
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
					    if(!findUserXcBaseDefine("create")){
					    	alert('没有正确生成或找到数据')
				    	}else{
				    		store_month.add(new Ext.data.Record({value:nowSj,text:nowSjDesc}))
				    		combox_month.setValue(nowSj)
				    		//store_sj.remove(store_sj.getAt(store_sj.find('value',nowSj)))
					    	win.close();
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
	
//加载数据--------------------------------------------------------------------------------------------------
	//loadMonthCombox()
	//openCell()
	findUserXcBaseDefine("query")
});
//自定方法--------------------------------------------------------------------------------------------------
/*	function createFromCopyXcBaseUser(selQh,selSj,createSj){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyMgm.createFromCopyXcBaseUser(selQh,selSj,createSj,function(obj){
		});
	    DWREngine.setAsync(true);
	    openCell()
	    return rtn
	}
*/
	
	function openCell(){
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
		cellType = '20'
		cellDate = nowSj
		corp = UNITID+'/'+defaultOrgRootId//(USERORGID==""?UNITID:USERORGID)
		GUIDELINEIDS = 'zb_seqno'
		cellSaveable = true
		reportIdTemp = ''//kqDaysDeptZb!=null?kqDaysDeptZb.lsh:''
		REMARKTABLE = ''
		REMARKCOL = ''
		cellUrl = CONTEXT_PATH + "/cell/eReport.jsp?openCellType=iframe&p_type="
			+cellType+"&p_date=" + cellDate + "&p_corp=" + corp + "&p_inx="+GUIDELINEIDS
			+"&savable=" + cellSaveable + "&p_key_col=&p_key_val=" + reportIdTemp
			+"&p_showVersion=none&p_showRemark=none&p_saveAsFile=false"
			+"&p_remarkTable="+REMARKTABLE+"&p_remarkCol="+REMARKCOL;
		document.all.cellFrame.src = cellUrl;
	}

/*	function loadMonthCombox(){
		var sql = "select distinct sj_type value,substr(sj_type,1,4)||'年'||substr(sj_type,5,6)||'月' text"
	      +" from HR_XC_BASE_DEFINE where unit_id = '"+UNITID+"'"
	      +" order by sj_type desc"
		DWREngine.setAsync(false);
		db2Json.selectData(sql, function (jsonData) {
//		alert(jsonData)
			store_month.loadData(eval(jsonData),false)
		});
	    DWREngine.setAsync(true);
	}
	*/
	function findUserXcBaseDefine(type){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyMgm.makeUserXcBaseDefine(nowSj,type,function(obj){
			if(obj){
			    openCell()
				rtn = true
			}else{
				rtn = false
			}
		});
	    DWREngine.setAsync(true);
	    return rtn
	}
	
	function update(){
		if(!findUserXcBaseDefine("update")){
	    	alert('重新生成员工数据时发生错误！')
	    }
	}
	
	function deleteNotOnJob(){
		DWREngine.setAsync(false);
		rlzyMgm.deleteUserXcBaseDefineNotOnJob(nowSj,function(obj){
			if(obj){
			    openCell()
			}
		});
	    DWREngine.setAsync(true);
	}