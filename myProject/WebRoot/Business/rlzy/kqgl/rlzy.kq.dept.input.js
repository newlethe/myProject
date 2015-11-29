var nowDate = new Date();
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth()+1;
var nowSj = nowYear + ((nowMonth<10)?'0':'') + nowMonth
var nowSjDesc = nowYear+'年'+(((nowMonth<10)?'0':'') + nowMonth)+'月'
var months = new Array()
var data_sj = new Array()
var combox_month,combox_sj,reportIdTemp;
 var label_user_count
var spArr = [['1','未发送部门领导审批'],['-1','退回重新填报'],['2','等待部门领导审批'],['-2','退回部门领导重新审批'],['3','部门领导审批完成'],['4','公司领导审批完成']];

var deptId = ""
if(USERDEPTID!=null && USERDEPTID != ''){
	deptId = USERDEPTID
}else if(USERPOSID!=null && USERPOSID != ''){
	deptId = USERPOSID
}else{
	deptId = UNITID 
}
var kqDaysDeptZb
var upDeptName=(USERORG==""?UNITNAME:USERORG);

var myMask
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
    
    //考勤报表上报，接受报表领导
    var leadArr = new Array();
    var lead = '';
	DWREngine.setAsync(false);
	appMgm.getCodeValue('考勤报表上报',function(list){
		for(i = 0; i < list.length; i++) {
//			var temp = new Array();
//			var leads = list[i].propertyName;
//			temp.push(list[i].propertyCode);		
//			temp.push(leads.split(',')[0]);
//			temp.push(leads.split(',')[1]);
//			leadArr.push(temp);
			if(USERDEPTID == list[i].propertyCode){
				var leads = list[i].propertyName;
				lead = leads.split(",")[0]; 
			}
		}
	});
	DWREngine.setAsync(true);
	
	var label_bm = new Ext.Toolbar.TextItem({text:"部门："+(USERORG==""?UNITNAME:USERORG)});
	var label_month = new Ext.Toolbar.TextItem({text:"考勤月份："});
	var label_user = new Ext.Toolbar.TextItem({text:"填写人："+REALNAME});
	var label_state = new Ext.Toolbar.Item(document.all.toolbarStatus);
	var label_sp_state = new Ext.Toolbar.Item(document.all.toolbarSpStatus);
    label_user_count=new Ext.Toolbar.Item(document.all.usercount);
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
	    setSpStatus(kqDaysDeptZb.spStatus)
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
		text: '上报人资专工',
		tooltip: '上报本月部门考勤数据',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/application_get.png',
		hidden : true,
		handler: upload
	});
	//2011-5-6 zhangh
	var spBtn = new Ext.Toolbar.Button({
		text: '上报部门领导审批',
//		tooltip: '上报部门领导审批',
        iconCls: 'x-btn-text-icon',
        hidden : true,
		icon: CONTEXT_PATH + '/jsp/res/images/icons/application_get.png',
		handler: uploadToDept
	});
	
	var btn_create = new Ext.Toolbar.Button({
//		text: '',
		tooltip: '发起月考勤填报',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/add.png',
//		disabled: true,
		handler: create
	});
	
	var btn_createOvertime = new Ext.Toolbar.Button({
		text: '加班未打卡说明表',
		tooltip: '加班未打卡说明表',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/add.png',
//		disabled: true,
		handler: createOvertime
	});	
    var tbar = new Ext.Toolbar({
    	items:[
    		label_bm,'-',
    		label_month,combox_month,
    		btn_create,'-',
    		btn_createOvertime,'-',
    		label_user,'-',
    		label_state,'-',
    		label_sp_state,'->',
    		label_user_count,
    		spBtn,'-',
    		btn_upload
		]
	});

	
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
	myMask = new Ext.LoadMask(Ext.getBody(), {msg: "报表正在打开，请稍等！" });
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
		var rtn = true;
		DWREngine.setAsync(false);
        Ext.getBody().mask("报表数据准备中，请稍等！" );
		rlzyKqglMgm.findKqDeptZbByDeptIdAndSj(deptId,nowSj,function(obj){
            Ext.getBody().unmask();
			if(obj!=null && obj.lsh!=null){
				kqDaysDeptZb = obj
				setStatus(kqDaysDeptZb.status)
				setSpStatus(kqDaysDeptZb.spStatus)
				//checkButton()
				rtn = true;
			}else{
				rtn = false;
			}
		});
	    DWREngine.setAsync(true);
        myMask.show();
	    openCell()
	    return rtn
	}
	function upload(){
		if(kqDaysDeptZb.spStatus!='3'){
			Ext.example.msg('提示！', '请先上报部门领导审批！');
		}else{
			if(btn_upload.getText()=='上报人资专工'||btn_upload.getText()=='再次上报'){
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
			rlzyKqglMgm.updateKqDaysDeptZb(kqDaysDeptZb,function(rtn){
				if(rtn){
					setStatus(kqDaysDeptZb.status)
				}
			});
		    DWREngine.setAsync(true);
		}
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
					    setStatus(kqDaysDeptZb.status);
                        win.close();
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
	var statusDesc = '';
	function setStatus(status){
		checkButton(status)
		if(status==null||status=='0'){
			statusDesc = '未上报';
			btn_upload.setText('上报人资专工')
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
			btn_upload.setText('上报人资专工')
		}
		//document.all.toolbarStatus.innerText = '状态：' + statusDesc
		//document.all.toolbarSpStatus.innerText = spStasusText(kqDaysDeptZb.spStatus)
		try{
			window.frames["cellFrame"].document.all.cmdFileSave.style.display = status==null||status=='0'?'':'none'
		}catch(e){}
	}
	//2011-5-6 zhangh	
	function setSpStatus(status){
		if(status==null||status=='1'||status=='-1'){
			spBtn.enable();
			spBtn.setText('上报部门领导审批')
		}else{
			spBtn.disable();
		}
	}
	function selectLead(){
		
	}
	function uploadToDept(){
		DWREngine.setAsync(false);		
		rlzyKqglMgm.uploadToLead(kqDaysDeptZb.lsh,lead,'2',USERID,function(bool){
			if(bool){
				Ext.example.msg('提示！', '上报部门领导审批成功！');
				findKqDeptZb();
				//spBtn.disable();
				//document.all.toolbarSpStatus.innerText = spStasusText('2')
			}else{
				Ext.example.msg('提示！', '上报部门领导审批失败！');
			}
		})
		DWREngine.setAsync(true);
	}
	function spStasusText(sp){
		var spText = '';
		for(var i=0;i<spArr.length;i++){
			if(sp == spArr[i][0]){
				spText = spArr[i][1];
				break;
			}		
		}
		return spText;
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
		corp = (USERORGID==""?UNITID:USERORGID) + '/' + kqDaysDeptZb.deptId;
		GUIDELINEIDS = 'zb_seqno';
		cellSaveable = kqDaysDeptZb!=null&&(kqDaysDeptZb.status==null||kqDaysDeptZb.status==0||kqDaysDeptZb.status==4)?true:false
		cellSaveable = kqDaysDeptZb!=null&&(kqDaysDeptZb.spStatus=='1'||kqDaysDeptZb.spStatus=='-1')?true:false
		reportIdTemp = kqDaysDeptZb!=null?kqDaysDeptZb.lsh:''
		//alert(reportIdTemp);
		REMARKTABLE = ''
		REMARKCOL = ''
		cellUrl = "/"+ROOT_CELL+ "/cell/eReport.jsp?openCellType=iframe&p_type="
			+cellType+"&p_date=" + cellDate + "&p_corp=" + corp + "&p_inx="+GUIDELINEIDS
			+"&savable=" + cellSaveable + "&p_key_col=MASTERLSH&p_key_val=" + reportIdTemp
			+"&p_showVersion=none&p_showRemark=none&p_saveAsFile=false"
			+"&p_remarkTable="+REMARKTABLE+"&p_remarkCol="+REMARKCOL;
		document.all.cellFrame.src = cellUrl;
	}       
});
//加班情况说明表
function createOvertime(){
	var url=CONTEXT_PATH+"/Business/rlzy/kqgl/rlzy.kq.overtime.dept.input.jsp?nowSj="+nowSj+"&masterlsh="+reportIdTemp;
	var n = window.showModalDialog(url, "", "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;" )
}
function afterCellSaved(CellWeb,callback){
    DWREngine.setAsync(true);
	rlzyKqglMgm.calcKqDaysTjData(kqDaysDeptZb,function(rtn){
		if(rtn){
			for(i=0; i<CellWeb.GetTotalSheets(); i++) {
				var maxRow = CellWeb.GetRows(i);
				var maxCol = CellWeb.GetCols(i);
				for(row=0; row < maxRow; row++){
					for(col=0; col < maxCol; col++){
						if(CellWeb.GetCellString( col, row, i ).indexOf("table:")!=-1){
							//CellWeb.ClearArea(col+1, row+1, maxCol, maxRow, i, 1);
						}
					}
				}
			}
			var def = CellWeb.SaveToXML("")
            var obj = {
                p_type : '17',
		        p_dept : kqDaysDeptZb.deptId,
		        p_date : nowSj,
		        p_corp : (USERORGID==""?UNITID:USERORGID),
		        p_inx : 'zb_seqno',
		        p_where : '',
		        p_globalParam : ''
            }
//			cellXML.db2xml( def,'17', kqDaysDeptZb.deptId, nowSj, (USERORGID==""?UNITID:USERORGID), 'zb_seqno','',callback);
            cellXML.db2xml(def,obj);
		}
	});
	
	rlzyKqglMgm.updateKqUserCount(kqDaysDeptZb,function(rtn){
		kqDaysDeptZb.memo = rtn;
		//document.all.usercount.innerText="本月部门人数:"+kqDaysDeptZb.memo+"人";
	});
	DWREngine.setAsync(true);
}
	
function onCellOpened(){
	var thisXmlDoc = window.frames["cellFrame"].xmlDoc;
	var CellWeb1 = window.frames["cellFrame"].CellWeb1;
	var row,col;
	var maxCol = CellWeb1.GetCols(0)
	var maxRow = CellWeb1.GetRows(0)
	with(CellWeb1) {
		for( var c=1; c<maxCol; c++ ) {
			for( var r=1; r<maxRow; r++ ) {
				var cellStr = GetCellString(c, r, 0)
				if(cellStr.indexOf("table:")>-1) {
					col = c;
					row = r;
					break;
				}
			}
	    }
    }
	
    
    myMask.hide();
    if(col&&row){ //修改背景颜色
    	//判断本月的第一天是星期几
    	var cellSjtype = combox_month.getValue();
    	var kqYear = parseInt(cellSjtype.substr(0,4),10);
    	var kqMonth = parseInt(cellSjtype.substr(4,6),10) - 1;
        //判断当前月份的天数
	    var thisMonthDays = new Date(kqYear,kqMonth+1,0).getDate();
    	for(var i=1; i<=maxCol-col; i++) {
            if(i>(thisMonthDays+col)){
                CellWeb1.SetColHidden(i,i);
            }
            if(i>col){
	    		var date = new Date(kqYear, kqMonth, i-col);
	    		if(date.getDay()==0||date.getDay()==6) {
	    			CellWeb1.SetCellBackColor(i, row-1, 0, 14);
	    		} else {
	    			CellWeb1.SetCellBackColor(i, row-1, 0, -1);
	    		}
            }
    	}
    }
	var sheetNum = c.GetTotalSheets();
	//找出填写内容的标签
	var tagConfigElArr = thisXmlDoc.selectNodes("/Workbook/Worksheet/Table/Row/Cell[starts-with(Data,'#')]");

	DWREngine.setAsync(false);
	if (tagConfigElArr!=null && tagConfigElArr.length>0){
		for (i=0; i<tagConfigElArr.length; i++) {
			var tagEl = tagConfigElArr[i];
			var tag = tagEl.text;
			var col = tagEl.getAttribute("Index");
			var row = tagEl.parentNode.getAttribute("Index");
			var sheetName = tagEl.parentNode.parentNode.parentNode.getAttribute("Name");
			var sheet = c.GetSheetIndex(sheetName);
			var tagValueEl = thisXmlDoc.selectSingleNode("/Workbook/Worksheet[@Name = '"+sheetName+"']/Table/Row[@Index='" + (parseInt(row, 10)+1) + "']/Cell[@Index='" + col + "']");
			if(tag=="#USER"){
				c.S(col, (parseInt(row, 10)+1), sheet, kqDaysDeptZb.userName);
			} else if (tag=="#DEPTUSER" && (kqDaysDeptZb.spStatus=="3" || kqDaysDeptZb.spStatus=="4")) {
				c.S(col, (parseInt(row, 10)+1), sheet, kqDaysDeptZb.deptUserSpName);
			} else if (tag=="#COMPUSER" && kqDaysDeptZb.spStatus=="4") {
				c.S(col, (parseInt(row, 10)+1), sheet, kqDaysDeptZb.compUserSpName);
			}
			
		}
	}
	DWREngine.setAsync(true);
	if(kqDaysDeptZb && kqDaysDeptZb.memo){
		document.all.usercount.innerText="本月部门人数:"+kqDaysDeptZb.memo+"人";
	} else {
		document.all.usercount.innerText="";
	}
}

