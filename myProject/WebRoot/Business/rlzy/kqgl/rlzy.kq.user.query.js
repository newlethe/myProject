var treePanel, gridPanel, userGridPanel, userInfoPanel, userInfoTabPanel, userSelectPanel;
var ds
var gridPanelTitle = "<font color=red><b>说明： 出勤：√ 出差：△  旷工：× 事假：+  病假：▲ 迟到、早退：※  年休假：○  探亲假：◎  产假：☆  婚假：★  工伤假：▽   丧假：□  晚班 ■</b></font>";
var months = new Array();
var nowDate = new Date();
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth()+1;
var nowSj = nowYear + ((nowMonth<10)?'0':'') + nowMonth;
var nowSjDesc = nowYear+'年'+(((nowMonth<10)?'0':'') + nowMonth)+'月';
var deptId = "";
if(USERDEPTID!=null && USERDEPTID != ''){
	deptId = USERDEPTID;
}else if(USERPOSID!=null && USERPOSID != ''){
	deptId = USERPOSID;
}else{
	deptId = UNITID;
}
Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);
	rlzyKqglMgm.findSjListForKqDeptByDeptId(deptId,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].toString());
			temp.push(list[i].toString().substr(0,4)+'年'+list[i].toString().substr(4,6)+'月');
			months.push(temp);
		}
	});
    DWREngine.setAsync(true);
    
	var label_bm = new Ext.Toolbar.TextItem({text:"部门："+(USERORG==""?UNITNAME:USERORG)});
	var label_month = new Ext.Toolbar.TextItem({text:"考勤月份："});
	var label_user = new Ext.Toolbar.TextItem({text:"被考勤人："+REALNAME});
	var label_state = new Ext.Toolbar.Item(document.all.toolbarStatus);

	var store_month = new Ext.data.SimpleStore({
		fields: ['value','text'],   
		data: months
	})
	var combox_month = new Ext.form.ComboBox({
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
	    //if(!findKqDeptZb())
	    //	alert('没有数据')
	    //checkButton()
	    loadGrid()
	    loadTitle()
    });
	combox_month.setValue(nowSj);
	
    var tbar = new Ext.Toolbar({
    	items:[
    		label_bm,'&nbsp;&nbsp;&nbsp;&nbsp;','-',label_month,combox_month
			,'&nbsp;&nbsp;&nbsp;&nbsp;','-',label_user,'&nbsp;&nbsp;&nbsp;&nbsp;','-','->',label_state
		]
	});
	
//--------------------------------------------------------------------------------------
    var fc = {		// 创建编辑域配置
    	'detail_id': {
			name: 'detail_id',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
       },  'sj_type': {
			name: 'sj_type',
			fieldLabel: '时间',
			readOnly:true,
			allowBlank: false,
			anchor:'95%'
       },  'morning': {
			name: 'morning',
			fieldLabel: '上午',
			readOnly:true,
			allowBlank: false,
			anchor:'95%'
       },  'afternoon': {
			name: 'afternoon',
			fieldLabel: '下午',
			readOnly:true,
			allowBlank: false,
			anchor:'95%'
       },  'night': {
			name: 'night',
			fieldLabel: '晚上',
			readOnly:true,
			allowBlank: false,
			anchor:'95%'
		}
	};
	
    var Columns = [
    	{name: 'detail_id', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'sj_type', type: 'string'},		
    	{name: 'morning', type: 'string'},		
		{name: 'afternoon', type: 'string'},
		{name: 'night', type: 'string'}
		];
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'detail_id',
           header: fc['detail_id'].fieldLabel,
           dataIndex: fc['detail_id'].name,
           hidden:true,
           width: 200
        }, {
           id:'sj_type',
           header: fc['sj_type'].fieldLabel,
           dataIndex: fc['sj_type'].name,
           renderer : dateRender,
           width: 120
        }, {
           id:'morning',
           header: fc['morning'].fieldLabel,
           dataIndex: fc['morning'].name,
           width: 120
        }, {
           id:'afternoon',
           header: fc['afternoon'].fieldLabel,
           dataIndex: fc['afternoon'].name,
           width: 120
        }, {
           id:'night',
           header: fc['night'].fieldLabel,
           dataIndex: fc['night'].name,
           width: 120
        }
	]);
    cm.defaultSortable = true;						//设置是否可排序

	var rs = Ext.data.Record.create(Columns);
	var reader = new Ext.data.JsonReader({},rs);
	ds = new Ext.data.Store({
		reader: reader
    });

	gridPanel = new Ext.grid.GridPanel({
    	id: 'kq-grid',
        ds: ds,
        cm: cm,
        //tbar: [],
        title: gridPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
	});
//-----------------------------------------------------------------------------------
	var contentPanel = new Ext.Panel({
		id : 'content',
		title : '个人考勤情况查询',
		renderTo: "center",
		layout:'fit',
        iconCls: 'icon-by-category',
        border: false,
        tbar: tbar,
        items: [gridPanel]
	});
	
//viewport--------------------------------------------------------------------------------------------------	
    var viewport = new Ext.Viewport({
        layout:'fit',
        items:[ contentPanel]
    });	
//viewport--------------------------------------------------------------------------------------------------	

	loadGrid()
	loadTitle()
});
function loadGrid() {
	var sql = "select min(detail_id) detail_id, sj_type"
      +" ,max(decode(zb_seqno,'上午',val1,'')) morning,max(decode(zb_seqno,'下午',val1,'')) afternoon"
      +" ,max(decode(zb_seqno,'晚上',val1,'')) night"
      +" from v_hr_kq_days_dept_xb where sj_type like '"+nowSj+"%' and unit_id = '"+USERID+"'"
      +" group by sj_type order by sj_type"
	db2Json.selectData(sql, function (jsonData) {
		var dss = Ext.getCmp('kq-grid').getStore()
		ds.loadData(eval(jsonData),false)
	});
}
function loadTitle() {
	var sql = "select detail_id, masterlsh, sj_type, zb_seqno, unit_id, val1, val2, val3, memo from kq_daystj_dept_xb"
		+ " where sj_type = '"+nowSj+"' and unit_id = '"+USERID+"'"
	db2Json.selectData(sql, function (jsonData) {
		var list = eval(jsonData)
		var stateDesc = ""
		for(i = 0; i < list.length; i++){
			hbm = list[i];
			if(hbm.zb_seqno == "事假")
				stateDesc += "    " + ("事假:"+hbm.val1)
			else if(hbm.zb_seqno == "病假")
				stateDesc += "    " + ("病假:"+hbm.val1)
			else if(hbm.zb_seqno == "年休")
				stateDesc += "    " + ("年休:"+hbm.val1)
			else if(hbm.zb_seqno == "产假")
				stateDesc += "    " + ("产假:"+hbm.val1)
			else if(hbm.zb_seqno == "旷工")
				stateDesc += "    " + ("旷工:"+hbm.val1)
			else if(hbm.zb_seqno == "其他")
				stateDesc += "    " + ("其他:"+hbm.val1)
			else if(hbm.zb_seqno == "加班")
				stateDesc += "    " + ("加班:"+hbm.val1)
			else if(hbm.zb_seqno == "出勤")
				stateDesc += "    " + ("出勤:"+hbm.val1)
		}
		document.all.toolbarStatus.value = stateDesc.trim()
	});
}

function dateRender(value) {
	var rtn = value
	if(value.length>7){
		rtn = value.substring(0,4) + "年" + value.substring(4,6) + "月" + value.substring(6,8) + "日"
	}else if(value.length>5){
		rtn = value.substring(0,4) + "年" + value.substring(4,6) + "月"
	}else if(value.length>3){
		rtn = value.substring(0,4) + "年"
	}
	return rtn
}

