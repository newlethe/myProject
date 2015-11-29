//var nowDate = new Date();
//var nowYear = nowDate.getYear();
//var nowMonth = nowDate.getMonth()+1;
var nowSj = '200001'//nowYear + ((nowMonth<10)?'0':'') + nowMonth
//var nowSjDesc = nowYear+'年'+((nowMonth<10)?'0':'' + nowMonth)+'月'
var months = new Array()
/*var deptId = ""
if(USERDEPTID!=null && USERDEPTID != ''){
	deptId = USERDEPTID
}else if(USERPOSID!=null && USERPOSID != ''){
	deptId = USERPOSID
}else{
	deptId = UNITID 
}*/
var xcBaseModel
var nowQh = '0371'
var combox_areacode,combox_sj
var store_areacode,store_sj

Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）
/*	DWREngine.setAsync(false);
	rlzyMgm.findSjListForXcBaseModelByUnitid(unitid,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].toString());
			temp.push(list[i].toString().substr(0,4)+'年'+list[i].toString().substr(4,6)+'月');
			months.push(temp);
		}
	});
    DWREngine.setAsync(true);*/
    
//	var label_bm = new Ext.Toolbar.TextItem({text:"部门："+(USERORG==""?UNITNAME:USERORG)});
	var label_areacode = new Ext.Toolbar.TextItem({text:"福利执行标准："});
//	var label_user = new Ext.Toolbar.TextItem({text:"填写人："+REALNAME});
//	var label_state = new Ext.Toolbar.Item(document.all.toolbarStatus);
	var label_sj = new Ext.Toolbar.TextItem({text:"时间："});

	store_areacode = new Ext.data.SimpleStore({
		fields: ['value','text'],   
		data: [['010', '北京'],['0371', '郑州'],['0512', '张家港']]
	})
	combox_areacode = new Ext.form.ComboBox({
			name: 'selectQh',
			hiddenName: 'selectQh',
			fieldLabel: '福利执行标准',
			valueField: 'value', 
			displayField: 'text',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            forceSelection:true,
	        selectOnFocus:true,
	        emptyText:'选择地区...',
            store: store_areacode,
            value: nowQh,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
	});
    combox_areacode.on('select', function(obj, record, idx ){
		nowQh = record.data.value
		openCell()
		loadSjCombox()
    });
    
	store_sj = new Ext.data.SimpleStore({
		fields: ['value','text'],   
		data: [['010', '北京'],['0371', '郑州'],['0512', '张家港']]
	})
	//loadSjCombox()
	combox_sj = new Ext.form.ComboBox({
			name: 'selectSj',
			hiddenName: 'selectSj',
			fieldLabel: '时间',
			valueField: 'value', 
			displayField: 'text',
			hidden: true,
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            forceSelection:true,
	        selectOnFocus:true,
	        emptyText:'选择时间...',
            store: store_sj,
            value: nowSj,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
	});
    combox_sj.on('select', function(obj, record, idx ){
		nowSj = record.data.value
		openCell()
    });
	
    var tbar = new Ext.Toolbar({
    	items:[
    		label_areacode,combox_areacode
    		//,'->',label_sj
    		,combox_sj
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
		title : '薪酬福利执行标准基数模板',
		renderTo: "center",
		layout:'border',
		region: 'center',
        iconCls: 'icon-by-category',
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

//加载数据--------------------------------------------------------------------------------------------------
	openCell()

});
//自定方法--------------------------------------------------------------------------------------------------
/*	function createFromCopyXcBaseModel(selQh,selSj,createSj){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyMgm.createFromCopyXcBaseModel(selQh,selSj,createSj,function(obj){
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
		cellType = '19'
		cellDate = nowSj
		corp = nowQh+'/'+defaultOrgRootId//(USERORGID==""?UNITID:USERORGID)
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

	function loadSjCombox(){
		var sql = "select distinct sj_type value,substr(sj_type,1,4)||'年'||substr(sj_type,5,6)||'月' text"
	      +" from HR_XC_BASE_MODEL where unit_id = '"+nowQh+"'"
	      +" order by sj_type desc"
		DWREngine.setAsync(false);
		db2Json.selectData(sql, function (jsonData) {
//		alert(jsonData)
			store_sj.loadData(eval(jsonData),false)
		});
	    DWREngine.setAsync(true);
	}