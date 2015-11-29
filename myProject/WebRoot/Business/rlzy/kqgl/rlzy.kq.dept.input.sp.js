var nowDate = new Date();
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth()+1;
var nowSj = nowYear + ((nowMonth<10)?'0':'') + nowMonth
var nowSjDesc = nowYear+'年'+(((nowMonth<10)?'0':'') + nowMonth)+'月'
var months = new Array()
var data_sj = new Array()
//var combox_month,combox_sj

var spArr = [['1','未发送部门领导审批'],['-1','<font color=red>退回填报人重新填报</font>'],['2','等待部门领导审批'],['-2','<font color=red>退回部门领导重新审批</font>'],['3','部门领导审批完成'],['4','公司领导审批完成']];

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
	var fm = Ext.form;
    
    //考勤报表上报，接受报表领导
    var leadArr = new Array();
    var lead = '';
	DWREngine.setAsync(false);
	appMgm.getCodeValue('考勤报表上报',function(list){
		for(i = 0; i < list.length; i++) {
			if(USERDEPTID == list[i].propertyCode){
				var leads = list[i].propertyName;
				lead = leads.split(",")[1]; 
			}
		}
	});
	DWREngine.setAsync(true);
	
	//--用户
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname,useraccount from rock_user ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			temp.push(list[i][2]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
	//--部门
 	var deptArray = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select unitid,unitname from sgcc_ini_unit order by unitid",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			deptArray.push(temp);
		}
    });
 	DWREngine.setAsync(true);
 	

	var label_bm = new Ext.Toolbar.TextItem({text:"部门："});
	var label_month = new Ext.Toolbar.TextItem({text:"考勤月份："});
	var label_user = new Ext.Toolbar.TextItem({text:"填报人："});
	var label_sp_state = new Ext.Toolbar.TextItem({text:"状态："});

	
	var spBtn = new Ext.Toolbar.Button({
		text: '同意',
		tooltip: '发送到下一步',
        iconCls: 'x-btn-text-icon',
		icon: CONTEXT_PATH + '/jsp/res/images/icons/application_get.png',
		handler: uploadToDept
	});
	
	//----退回处理----
	var backBtn = new Ext.Toolbar.Button({
		text: '退回',
		iconCls: 'remove',
		handler: openBackWin
	})
	var closeBtn = new Ext.Toolbar.Button({
		text: '关闭',
		iconCls: 'remove',
		handler: function(){
			parent.spWin.hide();
		}
	})
	var toUserArray = new Array();
    var backFormPanel;
    var backWin;
	var fm = Ext.form;
    var fc = {
    	 'uuid': {name: 'uuid',fieldLabel: 'UUID',hideLabel:true,hidden:true},
         'fromUser': {name: 'fromUser',fieldLabel: '发送人',value:USERNAME,hideLabel:true,hidden:true},
         'toUser': {name: 'toUser',fieldLabel: '退回接收人'},
         'kqLsh': {name: 'kqLsh',fieldLabel: '考勤流水号',hideLabel:true,hidden:true},
         'postTime': {name: 'postTime',fieldLabel: '发送时间',hideLabel:true,hidden:true},
         'status': {name: 'status',fieldLabel: '状态',value:'0',hideLabel:true,hidden:true},
         'remark': {name: 'remark',fieldLabel: '意见',width: 300, allowBlank : false, height: 80}
    }
    
    var Columns = [
    	{name: 'uuid', type: 'string'},
		{name: 'fromUser', type: 'string'},
		{name: 'toUser', type: 'string'},
		{name: 'kqLsh', type: 'string'}, 	
		{name: 'postTime', type: 'date',dateFormat: 'Y-m-d H:i:s'},    	
		{name: 'status', type: 'string'},    	
		{name: 'remark', type: 'string'}
		]
	
	function openBackWin(){
		var formRecord = Ext.data.Record.create(Columns);
		loadFormRecord = new formRecord({
	    	uuid:'',
	    	fromUser:USERID,
	    	toUser: '',
	    	kqLsh:lsh,
	    	postTime:'',
	    	status: '0',
	    	remark: ''
	    });
		var status = kqDaysDeptZb.spStatus
		toUserArray = [[kqDaysDeptZb.userId+",-1","[发起人]"+showUserName(kqDaysDeptZb.userId)]];
		if(status=='3'){
			for(var i=0;i<userArray.length;i++){
				if(kqDaysDeptZb.deptUserSp == userArray[i][2]){
					toUserArray.push([userArray[i][0]+",-2","[部门领导]"+userArray[i][1]]);
				}
			}
		}
		var toUserDs = new Ext.data.SimpleStore({
	 		fields:['k','v'],
	 		data:toUserArray
	 	})  
	    var toUserCombo = new fm.ComboBox({
			name : fc['toUser'].name,
			fieldLabel : fc['toUser'].fieldLabel,
			allowBlank : false,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			triggerAction : 'all',
			store : toUserDs,
			readOnly : true
		})
		backFormPanel = new Ext.FormPanel({
	        id: 'form-panel',
	        header: false,
	        border: false,
	        region: 'center',
	        layout: 'border',
	        labelWidth :120,
	        bodyStyle: 'padding:10px;',
	    	labelAlign: 'left',
	    	items: [
	    	new Ext.form.FieldSet({
				title : '基本信息',
				autoWidth : true,
				border : true,
				layout : 'fit',
				items : [
					new fm.TextField(fc['uuid']),
					new fm.TextField(fc['fromUser']),
					new fm.TextField(fc['kqLsh']),
					new fm.TextField(fc['postTime']),
					new fm.TextField(fc['status']),
					{
						layout : 'form',
						columnWidth : .50,
						bodyStyle : 'border:0px;',
						items : [
							toUserCombo,
							new fm.TextArea(fc['remark'])
						]
					}
				]
			})],
			buttons: [{
				id: 'save',
	            text: '保存',
	            disabled: false,
	            handler: doFormSave
	        },{
				id: 'cancel',
	            text: '取消',
	            handler: function(){backWin.hide();}
	        }]
	    });
	    
		backWin = new Ext.Window({
	    	title : '考勤报表退回',
	    	width : 500,
	    	height : 240,
	    	closeAction : 'hide',
			modal:true,
			plain:true,
			border: false,
			resizable: false,
			layout: 'fit',
			items: [backFormPanel]
	    });

		backWin.show();
		backFormPanel.getForm().loadRecord(loadFormRecord);
	}
	function doFormSave(){
    	var form = backFormPanel.getForm()
    	if(form.findField('toUser').getValue()=="")return false;
    	if(form.findField('remark').getValue()=="")return false;
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	var userAndStatus = obj.toUser 
    	obj.toUser = userAndStatus.split(",")[0];
    	obj.status = userAndStatus.split(",")[1];

    	DWREngine.setAsync(false);
    	rlzyKqglMgm.backKqDeptZb(obj,obj.status,function(bool){
			if(bool){
				Ext.example.msg('提示！', '退回操作成功！');
				Ext.fly(label_sp_state.getEl()).update('状态：'+spStasusText(obj.status));
				setSpStatus(obj.status)
			}else{
				Ext.example.msg('提示！', '退回操作失败！');
			}
    	})
   		DWREngine.setAsync(true);
   		backWin.hide();
    }
    
    var tbar = new Ext.Toolbar({
    	items:[
    		label_bm,'-',
    		label_month,'-',//combox_month,
    		label_user,'-',
    		label_sp_state,'->',
    		spBtn,'-',backBtn,'-',closeBtn
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
        items: [cellPanel]
	});
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ contentPanel]
    });	

	findKqDeptZb();

	function findKqDeptZb(){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyKqglMgm.findKqDeptZbByLsh(lsh,function(obj){
//		rlzyMgm.findKqDeptZbByUserAndSj(USERNAME,nowSj,deptId,function(obj){
			if(obj!=null && obj.lsh!=null){
				kqDaysDeptZb = obj
				setSpStatus(kqDaysDeptZb.spStatus)
				rtn = true;
			}else{
				rtn = false;
			}
		});
	    DWREngine.setAsync(true);
	    var nowSjType = kqDaysDeptZb.sjType.toString().substr(0,4)+'年'+kqDaysDeptZb.sjType.toString().substr(4,6)+'月';
	    contentPanel.setTitle(kqDaysDeptZb.title);
	    Ext.fly(label_user.getEl()).update('填报人：'+showUserName(kqDaysDeptZb.userId));
	    Ext.fly(label_month.getEl()).update('考勤月份：'+nowSjType);
	    Ext.fly(label_bm.getEl()).update('部门：'+showDeptName(kqDaysDeptZb.deptId));
	    Ext.fly(label_sp_state.getEl()).update('状态：'+spStasusText(kqDaysDeptZb.spStatus));
	    
	    openCell()
	    return rtn
	}

	function setSpStatus(status){
		if((status=='2'||status=='-2')){
			spBtn.enable();
			backBtn.enable();
		}else if(status=='3'){
			spBtn.enable();
			backBtn.enable();
		}else{
			spBtn.disable();
			backBtn.disable();
		}
	}
	function selectLead(){
		
	}
	function uploadToDept(){
		var status = kqDaysDeptZb.spStatus
		if(status=='2'||status=='-2'){
			status = '3'
		}else if(status=='3'){
			status = '4'
		}else if(status=='4'){
		    status='5';
		}
		DWREngine.setAsync(false);		
		rlzyKqglMgm.uploadToLead(kqDaysDeptZb.lsh,lead,status,USERID,function(bool){
			if(bool){
				Ext.example.msg('提示！', '审批操作成功！');
				//Ext.fly(label_sp_state.getEl()).update('状态：'+spStasusText(status));
				//setSpStatus(status)
				findKqDeptZb();
			}else{
				Ext.example.msg('提示！', '审批操作失败！');
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
	function showUserName(user){
		var userName = '';
		for(var i=0;i<userArray.length;i++){
			if(user == userArray[i][0]){
				userName = userArray[i][1];
				break;
			}		
		}
		return userName;
	}
	function showDeptName(dept){
		var deptName = '';
		for(var i=0;i<deptArray.length;i++){
			if(dept == deptArray[i][0]){
				deptName = deptArray[i][1];
				break;
			}		
		}
		return deptName;
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
		cellDate = kqDaysDeptZb.sjType
		corp = (USERORGID==""?UNITID:USERORGID)
		corp = (USERORGID==""?UNITID:USERORGID) + '/' + kqDaysDeptZb.deptId
		GUIDELINEIDS = 'zb_seqno'
		cellSaveable = false;//kqDaysDeptZb!=null&&(kqDaysDeptZb.status==null||kqDaysDeptZb.status==0||kqDaysDeptZb.status==4)?true:false
		reportIdTemp = kqDaysDeptZb!=null?kqDaysDeptZb.lsh:''
		REMARKTABLE = ''
		REMARKCOL = ''
		cellUrl =  "/"+ROOT_CELL+ "/cell/eReport.jsp?openCellType=iframe&p_type="
			+cellType+"&p_date=" + cellDate + "&p_corp=" + corp + "&p_inx="+GUIDELINEIDS
			+"&savable=" + cellSaveable + "&p_key_col=MASTERLSH&p_key_val=" + reportIdTemp
			+"&p_showVersion=none&p_showRemark=none&p_saveAsFile=false"
			+"&p_remarkTable="+REMARKTABLE+"&p_remarkCol="+REMARKCOL;
		document.all.cellFrame.src = cellUrl;
	}
});
function afterCellSaved(CellWeb,callback){
	alert()
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

function onCellOpened(c){
	var thisXmlDoc = window.frames["cellFrame"].xmlDoc;
	var c = window.frames["cellFrame"].CellWeb1;
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
}

