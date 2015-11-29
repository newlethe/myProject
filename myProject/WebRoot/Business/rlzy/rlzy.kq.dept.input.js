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
var kqDaysDeptZb

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
    
	var label_bm = new Ext.Toolbar.TextItem({text:"部门："+(USERORG==""?UNITNAME:USERORG)});
	var label_month = new Ext.Toolbar.TextItem({text:"考勤月份："});
	var label_user = new Ext.Toolbar.TextItem({text:"填写人："+REALNAME});
	var label_state = new Ext.Toolbar.Item(document.all.toolbarStatus);

	var store_month = new Ext.data.SimpleStore({
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
	    if(!findKqDeptZb())
	    	alert('没有数据')
	    //checkButton()
	    setStatus(kqDaysDeptZb.status)
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
	
	var btn_upload = new Ext.Toolbar.Button({
		text: '上报',
		tooltip: '上报本月部门考勤数据',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/application_get.png',
//		disabled: true,
		handler: upload
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
    		label_bm,'&nbsp;&nbsp;&nbsp;&nbsp;','-',label_month,combox_month
    		,btn_create
			,'-',label_user,'&nbsp;&nbsp;&nbsp;&nbsp;','-',label_state,'->',btn_upload
		]
	});
/*    tbar.render('toolbar');
    tbar.add(label_bm);
    tbar.add('-');
    tbar.add(label_month);
    tbar.add('-');
    tbar.add(combox_month);
    tbar.add('-');
    tbar.add(label_user);
    tbar.add('-');
    tbar.add(label_state);
    tbar.add('->');
    tbar.add('-');
    tbar.add(btn_upload);*/
	
	var cellPanel = new Ext.Panel({
		region: 'center',
//		layout: 'fit',
		frame: true,
		html: '<iframe name="cellFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});

	var contentPanel = new Ext.Panel({
		id : 'content',
        title: '部门考勤',
		renderTo: "center",
		layout: 'border',
		region: 'center',
        iconCls: 'icon-by-category',
        border: false,
        tbar: tbar,
//        html: "cell填报"
        items: [cellPanel]
	});
	
//viewport--------------------------------------------------------------------------------------------------	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ contentPanel]
    });	
//viewport--------------------------------------------------------------------------------------------------	

//加载数据--------------------------------------------------------------------------------------------------
	findKqDeptZb();

//自定方法--------------------------------------------------------------------------------------------------
	function findKqDeptZb(){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyMgm.findKqDeptZbByDeptIdAndSj(deptId,nowSj,function(obj){
			if(obj!=null && obj.lsh!=null){
				kqDaysDeptZb = obj
				setStatus(kqDaysDeptZb.status)
				//checkButton()
				rtn = true;
			}else{
				rtn = false;
			}
		});
	    DWREngine.setAsync(true);
	    openCell()
	    return rtn
	}
	function upload(){
		if(btn_upload.getText()=='上报'||btn_upload.getText()=='再次上报'){
			kqDaysDeptZb.status = "1"
		}else if(btn_upload.getText()=='申请退回'){
			kqDaysDeptZb.status = "2"
		}else if(btn_upload.getText()=='取消退回'){
			kqDaysDeptZb.status = "1"
		}else if(btn_upload.getText()=='已批准'){
			kqDaysDeptZb.status = "3"
		}
		kqDaysDeptZb.userId = USERID
		kqDaysDeptZb.latestDate = new Date()
		DWREngine.setAsync(false);
		rlzyMgm.updateKqDaysDeptZb(kqDaysDeptZb,function(rtn){
			if(rtn){
				setStatus(kqDaysDeptZb.status)
			}
		});
	    DWREngine.setAsync(true);
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
				    	}
					    //checkButton()
					    setStatus(kqDaysDeptZb.status)
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
/*	function checkButton(){
		if(kqDaysDeptZb.status==null||kqDaysDeptZb.status=='0'){
			//btn_upload.enable()
			btn_upload.setText('上报')
		}else if(kqDaysDeptZb.status=='1'){
			//btn_upload.disable()
			btn_upload.setText('申请退回')
		}else if(kqDaysDeptZb.status=='2'){
			//btn_upload.disable()
			btn_upload.setText('再次上报')
		}
	}*/
	function checkButton(status){
		if(status==null)
			status = kqDaysDeptZb.status
		if((status!=null&&status!='1'&&status!='3')){
//			btn_grant.enable()
//			btn_update.enable()
//			btn_delete.enable()
		}else{
//			btn_grant.disable()
//			btn_update.disable()
//			btn_delete.disable()
		}
		if(status!='3'){
			btn_upload.enable()
		}else{
			btn_upload.disable()
		}
	}
	function setStatus(status){
		checkButton(status)
		var statusDesc = '';
		if(status==null||status=='0'){
			statusDesc = '未上报';
			btn_upload.setText('上报')
		}else if(status=='1'){
			statusDesc = '已上报';
			btn_upload.setText('申请退回')
		}else if(status=='2'){
			statusDesc = '申请退回';
			btn_upload.setText('取消退回')
		}else if(status=='3'){
			statusDesc = '已上报';
			btn_upload.setText('已批准')
		}else if(status=='4'){
			statusDesc = '已退回';
			btn_upload.setText('再次上报')
		}else{
			statusDesc = status;
			btn_upload.setText('上报')
		}
		document.all.toolbarStatus.value = '状态：' + statusDesc
		try{
			window.frames["cellFrame"].document.all.cmdFileSave.style.display = status==null||status=='0'?'':'none'
		}catch(e){}
	}
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
		cellType = '17'
		cellDate = nowSj
		corp = (USERORGID==""?UNITID:USERORGID)
		corp = (USERORGID==""?UNITID:USERORGID) + '/' + kqDaysDeptZb.deptId
		GUIDELINEIDS = 'zb_seqno'
		cellSaveable = kqDaysDeptZb!=null&&(kqDaysDeptZb.status==null||kqDaysDeptZb.status==0||kqDaysDeptZb.status==4)?true:false
		reportIdTemp = kqDaysDeptZb!=null?kqDaysDeptZb.lsh:''
		REMARKTABLE = ''
		REMARKCOL = ''
		cellUrl = CONTEXT_PATH + "/cell/eReport.jsp?openCellType=iframe&p_type="
			+cellType+"&p_date=" + cellDate + "&p_corp=" + corp + "&p_inx="+GUIDELINEIDS
			+"&savable=" + cellSaveable + "&p_key_col=MASTERLSH&p_key_val=" + reportIdTemp
			+"&p_showVersion=none&p_showRemark=none&p_saveAsFile=false"
			+"&p_remarkTable="+REMARKTABLE+"&p_remarkCol="+REMARKCOL;
		document.all.cellFrame.src = cellUrl;
	}
});
function afterCellSaved(CellWeb,callback){
    DWREngine.setAsync(true);
	rlzyMgm.calcKqDaysTjData(kqDaysDeptZb,function(rtn){
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
			cellXML.db2xml( def,'17', kqDaysDeptZb.deptId, nowSj, (USERORGID==""?UNITID:USERORGID), 'zb_seqno','',callback);
		}
	});
}
