var INS_ID = _insid;//当前流程实例  【注意：必须是全局变量(不允许修改变量名称)，因为上传附件子页面会访问此变量】
var uploadWindow=null;//文件上传窗口【注意：必须全局变量(不允许修改变量名称)，其他的页面用到】
//面板组件部分
var notePanel;//签署意见
var noteArea;//签署意见Area
var mainTabPanel;//流程处理+任务+业务数据tab 【注意：必须全局变量(不允许修改变量名称)，其他的业务页面用到】
var IS_FINISHED_TASK;//【注意：必须全局变量(不允许修改变量名称)，其他的业务页面用到】
var FlwButtons = {//按钮全局变量
	linkDataMenu : null,         //【关联数据】menu
	linkDataBtn  : null,	     //【关联数据】
	docMenu      : null,         //【查阅审批单】menu
	docBtn       : null,         //【查阅审批单】
	refreshBtn   : null,         //【刷新审批单】
	saveBtn      : null,		 //【保存】
	openBtn      : null,		 //【新建】
	adjunctBtn   : null,	     //【流程附件】
	printDocBtn  : null,		 //【打印】
	expandBtn    : null,		 //【展开】
	returnBtn    : null,		 //【返回】
	sendFileBtn  : null,		 //【抄送】
	signBtn      : null,		 //【签字】
	sendBtn      : null,		 //【下一步】
	resendBtn    : null,		 //【重新发送】
	delFlowBtn   : null,		 //【结束流程】
	backBtn      : null,		 //【退回】
	bkToBgBtn    : null,		 //【流程退回发起人】
	bkToNdBtn    : null,		 //【流程退回本业务发起人】
	bkToPvBtn    : null,		 //【流程退回上一步】
	viewLogBtn   : null,		 //【查看以前步骤】
	openHandler:function(){      //打开模板处理
		if (FlwControl.FILEID&&FlwControl.FILEID != ''){
			//displayOCX(true);
			//TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", FlwControl.FILEID);
			openFlwFile(_basePath+"/servlet/FlwServlet?ac=loadDoc", FlwControl.FILEID);
			FlwControl.isSaveModel = false;
			FlwControl.isModelOpen = true;
			FlwButtons.saveBtn.fileid   = null;
			FlwButtons.saveBtn.filename = null;
			FlwButtons.saveBtn.enable();
			if (haveSign()){
				FlwButtons.signBtn.enable();//激活打印按钮
				FlwControl.needSign = true;
			} 
		}
		var ocxBookMarks = TANGER_OCX_OBJ.activeDocument.BookMarks;
		if (FlwControl.isHaveFlwNO != null){
			for(var i =0;i<ocxBookMarks.Count;i++){
				var bookmark = ocxBookMarks(i+1).Name;
				if(bookmark == '文件编号'){
					TANGER_OCX_OBJ.SetBookmarkValue(bookmark,FlwControl.isHaveFlwNO);
				}
			}
		}			
	},
	saveHandler:function(){      //保存处理
		if(this.fileid){
			var url = _basePath+'/servlet/FlwServlet?ac=saveDoc';
			var fileid = this.fileid;
			var filename = this.filename;
			var params =  'fileid='+fileid;
			var outHTML = document.all("TANGER_OCX").SaveToURL(url,'EDITFILE',params,filename);
		}else{
			var url = _basePath + '/servlet/FlwServlet?ac=saveDoc';
			var params   =  'insid='+_insid+'&nodeid='+FlwNode.currentNodes[0]+'&userid='+_userid;
			var fileName = 	_title+'-'+FlwNode.currentNodes[1]+'.doc';
			var outHTML = document.all("TANGER_OCX").SaveToURL(url,'EDITFILE',params,fileName);
			FlwControl.isSaveModel = true;
		}
	},
	printDocHandler:function(){  //打印处理
		if (TANGER_OCX_bDocOpen){
			if(FlwControl.docReadOnly&&_ftype == "P"){
				TANGER_OCX_SetReadOnly(false)
			}
			TANGER_OCX_PrintRevisions(false);
			TANGER_OCX_PrintDoc();
			if(FlwControl.docReadOnly&&_ftype == "P"){
				TANGER_OCX_SetReadOnly(true)
			}
		} else {
			Ext.example.msg('提示', '请先打开文档！');
		}
	},
	expandHandler:function(){    //展开收缩处理
		if(this.text=='展开'){
			if(top&&top.collapsedWestAndNorth){
				top.collapsedWestAndNorth();
				this.setText('还原');
			}
		}else{
			if(top&&top.expandWestAndNorth){
				top.expandWestAndNorth();
				this.setText('展开');
			}
		}
	},
	returnHandler:function(){    //返回处理
		window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
	},
	showSendFileWin:function(){  //抄送处理
		if(!FlwWindow.sendFileWin){
			FlwWindow.sendFileWin = 
				new Flw.wait.WinOfSendFile({closeAction:'hide'});
		}
		FlwWindow.sendFileWin.show()
	},
	printHandler:function(btn,e){     //签字处理
		if (!TANGER_OCX_bDocOpen){
			Ext.example.msg('提示', '请先打开文档！');
			return;
		} else if (noteArea.getValue() == ""){
			Ext.example.msg('提示', '请先填写[签署意见],再进行操作!');
			return;
		} else {
			if (!FlwControl.isSaveModel) {
				Ext.example.msg('提示', '请先检查是否保存了模板!');
				return;
			}
			
			if(!(FlwWindow.signWin)){
				FlwWindow.signWin = new Flw.wait.WinOfSign({closeAction:'hide'});
			}
			FlwWindow.signWin.show();
		}
	},
	upAdjunctHandler:function(){ //附件上传
		FlwWindow.fileUploadWin = new Flw.wait.WinOfAdjunct({closeAction:'close'});
		uploadWindow = FlwWindow.fileUploadWin;
		FlwWindow.fileUploadWin.show();
	},
	viewLogHandler:function(){
		if(!(FlwWindow.logWin)){
			FlwWindow.logWin = new Flw.wait.WinOfLog({closeAction:'hide'});
		}
		FlwWindow.logWin.show();
	}
};
var FlwControl = {
	isStateNode : ("7"==_ftype||'7A'==_ftype||'7T'==_ftype),//当前节点是不是状态节点
	isSaveModel : true,                                     //模板是否已经保存
	isModelOpen : false,                                    //模板是否打开
	isSigned    : false,                                    //是否已经签名
	haveDoc     : false,                                    //是否有审批单
	haveTask    : false,                                    //该节点是否有任务
	haveModel   : false,                                    //是否有模板 
	needSign    : false,                                    //是否需要签名
	currFileID  : '-1',                                     //当前文件id 
	currFileName: '-1',                                     //当前文件名称
	isHaveFlwNO : null,                                     //流程编号
	FILEID      : null,                                     //模板文件ID
	DEFAULTNOTES: '',                                       //默认签署意见
	commFilter1 : "1=2",                                    //公共过滤条件
	commFilter2 : "1=2",                                    //公共过滤条件
	ISYP        : false,                                    //是否是质量验评流程
	defPassword : "",                                       //签名默认密码
	docReadOnly : true										//文档是否只读(默认只读)
};
var FlwWindow  = {
	sendToCnodeWin:null,//发送到普通节点窗口
	sendToNodeWin :null,//发送到状态点窗口
	sendFileWin   :null,//流程抄送窗口
	editFlwNoWin  :null,//修改流程编号窗口
	fileUploadWin :null,//附件上传窗口
	signWin       :null,//签字处理 
	logWin        :null //日志 
};
var FlwNode = { //当前节点及任务参数信息
	faceName      : "",                 //任务接口名称 
	faceDefParams : new Array(),   //接口参数
	faceOldKV     : new Array(),       //该流程实例下接口参数保存过的键值
	currentNodes  : new Array(),    //当前状态节点
	stateNodes    : new Array(),      //下一个或多个状态节点
	currentCnodes : new Array(),   //当前普通节点
	stateCnodes   : new Array()      //下一个或多个普通节点
}
var FlwLog = function(config){//日志对象构建
	this.logid    = null;
	this.insid    = null;
	this.fromnode = _userid;
	this.tonode   = _fromnode;
	this.ftime    = new Date();
	this.ftype    = null;
	this.notes    = null;
	this.flag     = null;
	this.nodename = null;
	this.nodeid   = null;
	Ext.apply(this,config);
};
var insObject;//当前流程实例信息(引入质量验评流程后添加此全局变量)

Ext.onReady(function(){
	/////////////按钮定义////////////////
	FlwButtons.linkDataMenu = new Ext.menu.Menu({items:['-']});//关联数据菜单
	FlwButtons.docMenu      = new Ext.menu.Menu({items:['-']});//流程文件菜单

	FlwButtons.openBtn      = new Ext.Button({text:'新建',iconCls: 'open',disabled: true,handler: FlwButtons.openHandler});//打开模板按钮
	FlwButtons.saveBtn      = new Ext.Button({text:'保存',iconCls:'save',disabled:true,handler: FlwButtons.saveHandler});//保存按钮
	FlwButtons.linkDataBtn  = new Ext.Button({text:'关联数据',iconCls:'download',disabled:true,menu: FlwButtons.linkDataMenu});//关联数据按钮
	FlwButtons.printDocBtn  = new Ext.Button({text:'打印',iconCls:'print',handler:FlwButtons.printDocHandler});//打印按钮
	FlwButtons.docBtn       = new Ext.Button({text:'查阅已审批的审批单',iconCls:'copyUser',disabled: true,menu: FlwButtons.docMenu});//流程附件按钮
	FlwButtons.refreshBtn   = new Ext.Button({text:'刷新审批单',iconCls:'refresh',disabled: true,handler: refreshDocHandler});//刷新审批单按钮
	FlwButtons.adjunctBtn   = new Ext.Button({text:'流程附件',iconCls:'upload',handler: FlwButtons.upAdjunctHandler});//上传附件按钮
	FlwButtons.returnBtn    = new Ext.Button({text:'返回',iconCls:'returnTo',handler:FlwButtons.returnHandler});//返回按钮
	FlwButtons.expandBtn    = new Ext.Button({text:'展开',iconCls:'add',handler:FlwButtons.expandHandler});//展开收缩按钮
	
	FlwButtons.signBtn      = new Ext.Button({text:'签字',iconCls:'btn',disabled:true, handler: FlwButtons.printHandler});//签字按钮
	FlwButtons.sendFileBtn  = new Ext.Button({text:'抄送',iconCls:'option',handler: FlwButtons.showSendFileWin});//抄送按钮
	FlwButtons.viewLogBtn   = new Ext.Button({text:'查看以前步骤',iconCls:'copyUser',handler: FlwButtons.viewLogHandler});//查看以前步骤
	
	
	FlwButtons.sendBtn      = new Ext.Button({text: FlwControl.isStateNode?'下一步':'发送',iconCls:'pageNext',handler: FlowSendHandler});//流程发送
	FlwButtons.resendBtn    = new Ext.Button({text:'重新发送',iconCls:'returnTo',handler: FlowResendHandler});//重新发送
	FlwButtons.delFlowBtn   = new Ext.Button({text:'结束流程',iconCls:'remove',handler:FlowDelete});//删除流程
	FlwButtons.bkToPvBtn    = new Ext.menu.Item({text:'退回上一步',id: 'backToPrev', iconCls: 'toPrevious', handler: FlowBackToPrevHandler});
	FlwButtons.bkToBgBtn    = new Ext.menu.Item({text:'退回流程发起人'  ,iconCls:'toBegin', handler:FlowBackToBeginHandler});
	FlwButtons.bkToNdBtn    = new Ext.menu.Item({text:'退回本业务发起人',iconCls:'toBegin', handler:FlowBackToNodeHandler});
	FlwButtons.backBtn      = new Ext.Button({text:'退回',iconCls:'pagePrev',menu:{items:[FlwButtons.bkToPvBtn,FlwButtons.bkToNdBtn,FlwButtons.bkToBgBtn]}});
	/////////////按钮定义完毕///////////
	//页面布局
	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false,
		items: [{xtype:"contentpanel"}]
	});
	//获取组件面板
	mainTabPanel = Ext.getCmp("maintab");//tab面板
	mainTabPanel.on("tabchange",function(){//如果"流程处理"和"查看流程数据"tab被禁用，则切换tab时启用"流程处理"和"查看流程数据"tab
		if(mainTabPanel.getItem('common').disabled&&mainTabPanel.getItem('module').disabled){
			mainTabPanel.getItem('common').enable();
			mainTabPanel.getItem('module').enable();
		}
	})
	notePanel 	 = Ext.getCmp('note-form');//签署意见form
	noteArea 	 = Ext.getCmp('note-area');//签署意见form
	Ext.getCmp("flowdocpanel").getTopToolbar().add({
					xtype:"tbbutton",text:"审批单：",iconCls: 'title',onMouseOver:Ext.emptyFn},
					"-",FlwButtons.openBtn,FlwButtons.saveBtn,FlwButtons.linkDataBtn,
					FlwButtons.printDocBtn,FlwButtons.refreshBtn,"->",FlwButtons.docBtn,FlwButtons.adjunctBtn,
					FlwButtons.returnBtn,FlwButtons.expandBtn);
	loadFlwNodes();   //实例化当前普通状态节点及后续节点
	loadFlwInfo();    //代办内容友好性提示加载
	loadButtons();    //根据流程状态加载页面中的按钮
	loadInsFiles();   //流程实例【文件】加载
	loadTaskFace();   //加载状态节点处的任务
});
//End of Ext.onReady
//获取状态节点和普通节点
function loadFlwNodes(){
	DWREngine.setAsync(false); 
	//获取当前流程实例信息
	baseDao.findById("com.sgepit.frame.flow.hbm.FlwInstance",_insid,function(obj){
		insObject = obj;
	});
	if(insObject&&(insObject.isyp)=="1") FlwControl.ISYP=true;
	//获得当前以及下一个或多个状态节点
	flwLogMgm.getNextFlowState(_insid, function(list){
		FlwNode.currentNodes.push(list[0].nodeid);
		FlwNode.currentNodes.push(list[0].name);
		for (var i = 1; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].nodeid);
			temp.push(list[i].name);
			FlwNode.stateNodes.push(temp);
		}
	});
	//获得当前以及下一个或多个普通节点
	if ("TA" != _ftype){//只要不是退回发起人
		flwLogMgm.getNextCommonState(_flowid, _insid,_logid, FlwNode.currentNodes[0], _userid, function(list){
			//list存放FlwCommonNode对象
			FlwNode.currentCnodes.push(list[0].cnodeid);//普通节点编码
			FlwNode.currentCnodes.push(list[0].name);//普通节点名称
			FlwNode.currentCnodes.push(list[0].bifurcate);//节点分裂特性
			FlwNode.currentCnodes.push(list[0].merge);//节点合并特性
			FlwNode.currentCnodes.push(list[0].istopromoter);//节点合并特性
			for (var i = 1; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].cnodeid);//普通节点编码
				temp.push(list[i].name);//普通节点名称
				temp.push(list[i].bifurcate);//节点分裂特性
				temp.push(list[i].merge);//节点合并特性
				temp.push(list[i].istopromoter);//节点发送类型
				FlwNode.stateCnodes.push(temp);
			}
		});
	}
	FlwControl.commFilter1 = "flowid='"+_flowid+"' and nodeid='"+FlwNode.currentNodes[0]+"'";//公共过滤条件
	FlwControl.commFilter2 = "insid='"+_insid+"' and nodeid='"+FlwNode.currentNodes[0]+"'";//公共过滤条件
	DWREngine.setAsync(true); 
}
//根据流程状态加载页面中的按钮
function loadButtons(){
	DWREngine.setAsync(false);
	var noteBbar = notePanel.getBottomToolbar();
	notePanel.getTopToolbar().add("->",FlwButtons.signBtn,FlwButtons.sendFileBtn,FlwButtons.viewLogBtn);
	if (FlwControl.isStateNode) {          //['7','关闭当前流程'],['7A','流程状态-发起'],['7T','状态退回']
		if("7T" == _ftype){                //普通节点退回到状态节点，需要显示【重新发送】按钮
			noteBbar.add(FlwButtons.backBtn,FlwButtons.sendBtn/*,FlwButtons.resendBtn*/);
		}else{
			noteBbar.add(FlwButtons.backBtn,FlwButtons.sendBtn);
		};
		if("7A" == _ftype)FlwButtons.bkToPvBtn.hide();   //状态节点，屏蔽【退回上一步】
		FlwButtons.bkToNdBtn.hide();   //状态节点，屏蔽【退回本业务发起人】
		
		if(FlwControl.ISYP){//验评流程,在开始节点关联配置的模板
			if(_ftype=="7A"){
				var file_id=insObject.fileid;
				if(file_id&&file_id!=""){
					FlwButtons.openBtn.enable();
					FlwControl.FILEID      = file_id;                 //模板文件ID
					FlwControl.haveModel   = true;                    //有模板定义
					FlwControl.isSaveModel = false;  				  //是否已保存模板
				}
			}
		}else{
			flwFileMgm.isOpenModel(_flowid, FlwNode.currentNodes[0], _insid, 
				_userid, function(file_id){
				if (file_id != "") {                                  //该节点有文件模板上传，且没有另存为实例文档【打开模板】按钮才会激活
					FlwButtons.openBtn.enable();                      //激活【新建】按钮
					FlwControl.FILEID      = file_id;                 //模板文件ID
					FlwControl.haveModel   = true;                    //有模板定义
					FlwControl.isSaveModel = false;  				  //是否已保存模板
				}
			});
		}
	}else if("TA" == _ftype){                                     //退回发起人
		notePanel.getBottomToolbar().add(FlwButtons.delFlowBtn);  //【结束流程】按钮
	}else{                                                        //普通节点
		if("T"==_ftype){
			notePanel.getBottomToolbar().add(FlwButtons.backBtn,FlwButtons.sendBtn/*,FlwButtons.resendBtn*/);
		}else{
			notePanel.getBottomToolbar().add(FlwButtons.backBtn,FlwButtons.sendBtn);
		}
	};
	//当流程发送页面刷新或发送完成后再返回到发送页面时，需要禁用发送相关的按钮，以免造成数据库数据重复
	baseMgm.findById(beanLog, _logid, function(obj){
		if(obj.flag=="1"){
			FlwButtons.backBtn.disable();
			FlwButtons.sendBtn.disable();
			//FlwButtons.resendBtn.disable();
			FlwButtons.delFlowBtn.disable();
		}
	})
	DWREngine.setAsync(true);
}
//代办内容友好性提示加载
function loadFlwInfo(){
    var viewPanel  = Ext.getCmp('viewpanel');
	DWREngine.setAsync(false);
	baseMgm.findById(beanLog, _logid, function(obj){
		var tempnotes="";
		if(obj.ftype=="T"||obj.ftype=="7T"||obj.ftype=="TA"){
			tempnotes+='<font color=red>【退回】</font>'+(obj.notes==null||obj.notes=="null"?"":obj.notes);
		}else{
			tempnotes+=(obj.notes==null||obj.notes=="null"?"":obj.notes);
		}
	  	var data = {
			FLW_TITLE: obj.flowtitle,
			TITLE: obj.title,
			FLW_NO: obj.flowno,
			COMMON_NODE: FlwControl.isStateNode?FlwNode.currentNodes[1]:FlwNode.currentCnodes[1],
			FROM_NAME: obj.fromname,
			FTIME: obj.ftime ? obj.ftime.dateFormat('Y-m-d H:i:s') : '',
			NOTES: tempnotes
		};
		var filter = "(select fromnodeid from com.sgepit.frame.flow.hbm.FlwLog where logid='"+_logid+"')";
		baseDao.findByWhere2(nodeBean,("nodeid="+filter),function(lt){
			if(lt&&lt.length>0){
				Ext.apply(data,{PEV_NODE:lt[0].name})
				FlwControl.isHaveFlwNO = obj.flowno;
				viewPanel.viewTpl.overwrite(viewPanel.body, data);
			}else{
				baseDao.findByWhere2(commonNodeBean,("cnodeid="+filter),function(lt2){
					Ext.apply(data,{PEV_NODE:(lt2.length>0?lt2[0].name:"")})
					FlwControl.isHaveFlwNO = obj.flowno;
					viewPanel.viewTpl.overwrite(viewPanel.body, data);
				});
			}
		});
	});
	DWREngine.setAsync(true);
}
//【审批单】加载
function loadInsFiles(){
	var filterFile=" filedate in( select filedate from com.sgepit.frame.flow.hbm.InsFileInfoMaxView where insid='"+_insid+"')"
	DWREngine.setAsync(false);
	baseDao.findByWhere2(insfileBean, "insid='"+_insid+"' and "+filterFile, function(list){
		if (list.length > 0){
			FlwButtons.docBtn.enable();
			if(FlwControl.haveModel!=true){
				FlwButtons.refreshBtn.enable();//当前节点无模版可以刷新审批单
				FlwControl.haveDoc=true;
			}
			for (var i = 0; i < list.length; i++) {
				if(list[i].fileid!=FlwControl.currFileID){
					//【查阅审批单】menu
					var item = new Ext.menu.Item({
							text: list[i].filename,
							iconCls: 'word',
							value: list[i],
							handler: function(){
								var _file = this.value;
								showInsFile(_file.fileid, _file.filename);
								/*
								if(FlwNode.currentNodes[0]== _file.nodeid){//只能保持当前节点模板
									FlwButtons.saveBtn.enable();
								}else{
									FlwButtons.saveBtn.disable();
								};
								displayOCX(true);
								TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
								FlwButtons.saveBtn.fileid   = _file.fileid;
								FlwButtons.saveBtn.filename = _file.filename;
								FlwControl.currFileID       = _file.fileid;//当前WORD文件ID
								FlwControl.currFileName     = _file.filename;//当前WORD文件名称
								if (haveSign()) {
									FlwButtons.signBtn.enable();
									FlwControl.needSign = true;
								}
								*/
							}
					});
					FlwButtons.docMenu.addItem(item);
				}
			};
		} else { FlwButtons.docBtn.disable();FlwButtons.refreshBtn.disable();}
	});
	DWREngine.setAsync(true);
}

//打开
function showInsFile(_fileid, _filename) {
	var _docUrl = BASE_PATH + "jsp/flow/flw.wait.process.flwDoc.jsp?fileid=" + _fileid + "&filename=" + _filename;
	window.showModalDialog(_docUrl, _filename + "","dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;status:no;center:yes;" +
							"resizable:yes;Minimize:no;Maximize:yes");
}

//加载【关联数据】menu+任务面板及查看业务数据面板数据
function loadBizData(){
	DWREngine.setAsync(false);
	/**
	 * 关联数据列表和流程数据查看中按钮的加载
	 */
	baseDao.findByWhere2(insDataBean, "insid='"+_insid+"'", function(list){
		var msgItem = null;
		var taskView     = Ext.getCmp("module");
		var taskViewTbar = taskView.getTopToolbar();
		if (list.length > 0){
			FlwButtons.linkDataMenu.removeAll();
			for (var i = 0; i < list.length; i++) {
				if (i != 0)	taskView.getTopToolbar().add('-'); 
				var tmpBtn = new Ext.Button({
					text: list[i].funname,
					iconCls: 'btn',
					value: list[i],
					handler: function(){
						var _data = this.value;
						taskView.load({
							url: BASE_PATH + 'jsp/flow/queryDispatcher.jsp',
							params: 'params='+_data.paramvalues+'&url='+_data.url+'&funname='+_data.funname
									+'&business='+_data.businessname+'&method='+_data.methodname+'&table='+_data.tablename+'&insid='+_insid,
							text: '<b>Loading...</b>'
						});
					}
				}); 
				taskViewTbar.add(tmpBtn);
				//关联数据menu
				var item = 	new Ext.menu.Item({
					text: list[i].funname,
					iconCls: 'btn',
					value: list[i],
					handler: function(){
						if (FlwControl.haveModel&&!(FlwControl.isModelOpen)){ Ext.example.msg('提示', '请先打开【模板】！');	return;	}
						if (!TANGER_OCX_bDocOpen){ Ext.example.msg('提示', '请先打开文档！');	return;	}
						var _data = this.value;
						var params = _data.paramvalues.split("`");
						var where = "";
						for (var x=0; x<params.length; x++){
							var param = params[x].split(":");
							if (x != 0) where += " and ";
							where += param[0]+"='"+param[1]+"'";
						}
						var table = _data.viewname;
						flwInstanceMgm.getTableColumns(table, where, function(obj){
							if (obj){
								if(obj["error"]){//抛出异常
									displayOCX(false);
									if(DEBUG===true){//全局调试标志,显示异常信息
										Ext.Msg.show({
											title: '数据提取失败，异常信息如下：',msg:obj["errormsg"],buttons: Ext.Msg.OK,
											icon: Ext.MessageBox.WARNING,fn: function(){displayOCX(true);}
										});
									}else{
										Ext.Msg.show({
											title: '提示',msg:'打印失败，请和管理员联系！',buttons: Ext.Msg.OK,
											icon: Ext.MessageBox.WARNING,fn: function(){displayOCX(true);}
										});
									}
								}else{
									printDataToFile(obj, table);
								}
							}else{
								Ext.example.msg('提示','打印失败，请和管理员联系！');
							};
						});
					}
				});
				FlwButtons.linkDataMenu.addItem(item);
			};
			msgItem = new Ext.Toolbar.TextItem({id:'msgbtn' ,text: '<font color=green><<<请选择要打开的业务数据</color>'});
			if (FlwControl.isStateNode) FlwButtons.linkDataBtn.enable();//激活【关联数据】按钮
		} else {
			msgItem = new Ext.Toolbar.TextItem({id:'msgbtn' ,text: '<font color=red>没有可查看的业务数据</color>'});
			FlwButtons.linkDataBtn.disable();//屏蔽【关联数据】按钮
		}
		taskViewTbar.add(msgItem);
	});
	/**
	 * 文档的加载
	 */
	if(FlwControl.haveModel!=true){
		//加载WORD编辑区域和相关按钮控制
		baseDao.findByWhere2(insfileBean, "insid='"+_insid+"' order by filedate desc", function(list){
			if (list.length > 0){
				var _file = list[0];
				//只有在当前状态节点和结束节点处才可以保存
				if (FlwNode.currentNodes[0]==_file.nodeid||FlwNode.stateNodes[0][1]=='0'){
					FlwButtons.saveBtn.enable();
				} else {
					FlwButtons.saveBtn.disable();
				}
                //== start == 针对津能项目施工进度流程的单独处理，开放保存按钮 zhangh 2013-10-28
                //判断以“施工进度”开头的流程
                baseDao.findById("com.sgepit.frame.flow.hbm.FlwDefinition", _flowid, function(obj){
	                if (obj['flowtitle'].indexOf('施工进度') == 0) {
	                   FlwButtons.saveBtn.enable();
	                }
	            });
				//== end == 
                if(_currentDocNode==_file.nodeid||_currentDocNode=="null"){
					//displayOCX(true);
				    //TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
				    openFlwFile(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
					FlwButtons.saveBtn.fileid   = _file.fileid;
					FlwButtons.saveBtn.filename = _file.filename;
					FlwControl.currFileID       = _file.fileid;
					FlwControl.currFileName     = _file.filename;
					FlwControl.isSaveModel      = true;//已保存关联模板
					if (haveSign()) {                  //判断该节点是否定义了书签的替换，有则激活【签字】按钮
						FlwButtons.signBtn.enable();
						FlwControl.needSign = true;
					}
				}else{
					displayOCX(false);
				}
			};
		});
	};
	//普通节点上设置文档的只读属性
	if (_ftype == "P"){
		var cnode = FlwNode.currentCnodes[0];//当前普通节点
		baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwCommonNodeFiles", "cnodeid = '"+cnode+"'", function(list){
			FlwControl.docReadOnly = (list.length==0 || list[0].readtype == "1") ? false : true;	//0-只读，1-可写
			if(FlwControl.docReadOnly){
				TANGER_OCX_SetReadOnly(true);//设置文档只读
			}else{
				TANGER_OCX_SetReadOnly(false);//设置文档可写
			}
		});
	}
	//当前为【任务节点】的时候
	if ("3" == _ftype) {
		mainTabPanel.getItem('task').enable();
		mainTabPanel.setActiveTab('task');
		var pParams, obj;
		baseDao.findByWhere2(faceParamsInsBean, FlwControl.commFilter2, function(list){
			pParams = list[0].paramvalues;
		});
		baseDao.findByWhere2(nodeFunModBean, FlwControl.commFilter1, function(list){
			obj = list[0];
		});
		//判断是否存在业务数据，如果不存在业务数据，则禁用"流程处理"和"查看流程数据"tab
		var params = pParams.split("`");
		var isexistwhere = "";
		for (var x=0; x<params.length; x++){
			var param = params[x].split(":");
			if (x != 0) isexistwhere += " and ";
			isexistwhere += param[0]+"='"+param[1]+"'";
		}
		var hasDataSql="select * from "+obj.viewname+" where "+isexistwhere;
		DWREngine.setAsync(false);
		baseDao.getData(hasDataSql,function(list){
			if(list.length<1){
				mainTabPanel.getItem('common').disable();
				mainTabPanel.getItem('module').disable();
			}
		})
		DWREngine.setAsync(true);
		Ext.getCmp("task").getTopToolbar().items.get(0).setText('<font color=#15428b><b>&nbsp;流程任务 - '+obj.funname+'</b></font>');
		loadTaskPanel(obj.url, pParams, obj.funname, obj.businessname, obj.methodname, obj.tablename, obj.faceid);
	}
	//当前为【完成任务节点】的时候
	if ("6" == _ftype) {
		mainTabPanel.getItem('task').enable();
	}
	DWREngine.setAsync(true);
}
//加载状态节点处的任务
function loadTaskFace(){
	if (FlwControl.isStateNode){
		DWREngine.setAsync(false);
		baseDao.findByWhere2(nodeBean, FlwControl.commFilter1, function(list){
			if (list[0].funid != '"null"') {//有任务
				FlwControl.haveTask = true;
				FlwControl.processType = [['3','任务']];
				baseDao.findByWhere2(faceParamsInsBean, "insid='"+_insid+"'", function(list){
					for (var i = 0; i < list.length; i++) {
						var paramsvalues = list[i].paramvalues;
						var params = paramsvalues.split("`");
						for(var j=0; j<params.length; j++){
							var param = params[j].split(":");
							var temp = new Array();
							temp.push(param[0],param[1]);
							FlwNode.faceOldKV.push(temp);
						}
					}
				});
				//加载接口定义的参数 【方法名】和【方法参数】
				baseMgm.findById(nodeBean, FlwNode.currentNodes[0],function(obj){
					if (obj.funid){
						baseMgm.findById(faceBean, obj.funid, function(o){
							FlwNode.faceName = o.funname;
							baseDao.findByWhere2(faceParamsBean, "faceid='"+obj.funid+"'", function(list){
								for (var i=0; i<list.length; i++) {
									FlwNode.faceDefParams.push(list[i]);
								}
							});
						});
					}
				});
				// 判断是否弹出任务参数输入窗口
				if (FlwNode.faceDefParams.length == 0){//任务不存在
					loadBizData();//加载【关联数据menu】+任务面板及查看业务数据面板数据
					ProcessTask();
				}else{//判断当前节点下的参数是否保存过
					flwFrameMgm.getFaceParamsIns(_insid, FlwNode.currentNodes[0], function(data) {
						if (data!=undefined && data!='') {
							loadBizData();
							ProcessTask();
						}else{
							if(FlwNode.faceName=="合同新增") {
								var v_currentNode = FlwNode.currentNodes[0]?FlwNode.currentNodes[0]:"";
								var v_paramValues = "conno::string";
								flwFrameMgm.insertFaceParamsIns(_insid, v_currentNode, v_paramValues, function(){
									ProcessTask();
								});
							} else {
								var faceWin = new Flw.wait.WinOfFaceParams({
									closeAction: 'hide',
									fields:FlwNode.faceDefParams,//定义的接口参数
									taskParams:FlwNode.faceOldKV,//保存过的接口参数
									faceName:FlwNode.faceName,//接口名称
									currentNode:FlwNode.currentNodes[0]?FlwNode.currentNodes[0]:"",//当前状态节点
									listeners:{	
									         beforehide:function(){loadBizData();},
									         show : function(){
									         	if(FlwNode.faceName=="合同修改"){
									         		var formSetDisables = faceWin.fieldSet.findByType("textfield");
									         		var formSetDisable = formSetDisables[0];
									         		formSetDisable.setDisabled(true);
									         	}
									         }
								    }
								});
								faceWin.show();
							}
						}
					});
				}
			}else{
				loadBizData();
			}
		})
	}else{
		loadBizData();
	};	
}
//任务面板load
function loadTaskPanel(url, params, funname, business, method, table, faceid){
	Ext.getCmp("task").load({
		url: BASE_PATH + 'jsp/flow/taskDispatcher.jsp',
		params: 'params='+params+'&url='+url+'&funname='+funname
				+'&business='+business+'&method='+method+'&table='+table+'&faceid='+faceid+'&insid='+_insid,
		text: '<b>Loading...</b>'
	});
}
//处理流转中的返回信息
function FlowProcess(ftype){
	var notes = noteArea.getValue();
	var obj_log = new FlwLog({
		ftype : ftype,	
		notes : notes,
		flag  : (ftype == '6' ? 0 : 1),//为完成任务时，本条日志为未完成；
		nodename : '普通节点'
	});
	flwLogMgm.insertFlwLog(obj_log, _logid, function(flag){
		if (flag){
			window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
		} else {
			if (ftype == '2'){
				Ext.Msg.show({
					title: '提示',
					msg: '抱歉，有其他人抢先一步处理了，您将不必处理此待办！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.WARNING,
					fn: function(value){
						if ('ok'==value) {
							window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
						}
					}
				});
			}
		}
	});
}
//退回本业务发起人
function FlowBackToNodeHandler(){
	displayOCX(false);
	DWREngine.setAsync(false);
	var validate = true;
	flwLogMgm.checkToBackNode(_logid,function(bean){
		if(!(bean.success)){
			Ext.Msg.show({
				title:'提示',
				msg:bean.errormsg,
				buttons:Ext.Msg.OK,
				fn:function(v){
					displayOCX(true);
				}
			});
			validate = false;
			return;
		}else if(!(bean.flag)){
			Ext.Msg.show({
				title:'提示',
				msg:bean.message,
				buttons:Ext.Msg.OK,
				fn:function(v){
					displayOCX(true);
				}
			});
			validate = false;
			return;
		}
	});
	if(!validate) return;
	if (noteArea.getValue() == ""){
		Ext.example.msg('提示', '请先填写[签署意见],再进行操作!');
		return;
	};
	Ext.Msg.show({
		title: '提示',
		msg: '确定要退回本业务发起人吗?</br><span style="color:red;">退回后流程发起人可进行业务数据及审批单修改操作，无法删除流程！</span>',
		buttons: Ext.Msg.YESNO,
		icon: Ext.MessageBox.WARNING,
		fn: function(value){
			if ('yes' == value) {
				var obj_log = new FlwLog({
					ftype: '7T',flag : '0',notes : noteArea.getValue()
				});
				flwLogMgm.toBackNode(_insid, FlwNode.currentNodes[0], _logid, obj_log, function(flagobj){
					if (flagobj.success){
						if(flagobj.flag){
							window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
						}else{
							Ext.Msg.alert("提示","退回失败,请和管理员联系！");
						}
					}else{
						Ext.Msg.alert("提示",flagobj.errormsg);
					}
				});	
			}else{
				displayOCX(true);
			}
		}
	});
	DWREngine.setAsync(true);
}
//退回发起人
function FlowBackToBeginHandler(){
	displayOCX(false);
	DWREngine.setAsync(false);
	var validate = true;
	flwLogMgm.checkToBackBegin(_logid,function(bean){
		if(!(bean.success)){
			Ext.Msg.show({
				title:'提示',
				msg:bean.errormsg,
				buttons:Ext.Msg.OK,
				fn:function(v){
					displayOCX(true);
				}
			});
			validate = false;
			return;
		}else if(!(bean.flag)){
			Ext.Msg.show({
				title:'提示',
				msg:bean.message,
				buttons:Ext.Msg.OK,
				fn:function(v){
					displayOCX(true);
				}
			});
			validate = false;
			return;
		}
	});
	if(!validate) return;
	Ext.Msg.show({
		title: '提示',
		msg: '确定要退回流程发起人吗?</br><span style="color:red">退回后流程发起人只能删除流程，无法修改业务数据及审批单！</span>',
		buttons: Ext.Msg.YESNO,
		icon: Ext.MessageBox.WARNING,
		fn: function(value){
			if ('yes' == value) {
				var obj_log = new FlwLog({
					ftype: 'TA',flag : '0',notes : noteArea.getValue(),
					nodename : '退回发起人'
				});
				flwLogMgm.insertFlwLog(obj_log, _logid, function(flag){
					if (flag){
						window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
					}
				});
			}else{
				displayOCX(true);
			} 
		}
	});
	DWREngine.setAsync(true);
};
//退回上一步操作
function FlowBackToPrevHandler(){
	DWREngine.setAsync(false);
	var validate = true;
	displayOCX(false);
    if(FlwControl.isStateNode){
        //状态节点退回的验证
    }else{
        //普通节点退回的验证
		flwLogMgm.checkToBackPrev(_logid,function(bean){
			if(!(bean.success)){
				Ext.Msg.show({
					title:'提示',
					msg:bean.errormsg,
					buttons:Ext.Msg.OK,
					fn:function(v){
						displayOCX(true);
					}
				});
				validate = false;
				return;
			}else if(!(bean.flag)){
				Ext.Msg.show({
					title:'提示',
					msg:bean.message,
					buttons:Ext.Msg.OK,
					fn:function(v){
						displayOCX(true);
					}
				});
				validate = false;
				return;
			}
		});
    }
	if(!validate) return;
	if (noteArea.getValue() == ""){
		Ext.example.msg('提示', '请先填写[签署意见],再进行操作!');
		displayOCX(true);
		return;
	};
	Ext.Msg.show({
		title: '提示',
		msg: '确定要退回上一步吗?</br><span style="color:red;">上一步处理人重新处理流程!</span>',
		buttons: Ext.Msg.YESNO,
		icon: Ext.MessageBox.WARNING,
		fn: function(value){
			if ('yes' == value) {
                if(FlwControl.isStateNode){
                    //状态节点退回上一步，只能退回到上一步的状态节点。zhangh 2013-10-15
                    var obj_log = new FlwLog({
                        fromnode : _userid,tonode : '',ftime: '',flag : '0',nodename : '',ftype:'7T',
                        notes : noteArea.getValue()
                    });
                    flwLogMgm.toBackStateNode(_flowid, _insid, FlwNode.currentNodes[0], FlwNode.currentCnodes[0], _logid, obj_log, function(flagobj){
                        if (flagobj.success){
                            if(flagobj.flag){
                                window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
                            }else{
                                Ext.Msg.show({
                                    title:'提示',
                                    msg:"退回失败,请和管理员联系！",
                                    buttons:Ext.Msg.OK,
                                    fn:function(v){
                                        displayOCX(true);
                                    }
                                });
                            }
                        }else{
                            Ext.Msg.show({
                                title:'提示',
                                msg:flagobj.errormsg,
                                buttons:Ext.Msg.OK,
                                fn:function(v){
                                    displayOCX(true);
                                }
                            });
                        }
                    });
                }else{
                    //普通节点退回上一步
					var obj_log = new FlwLog({
						fromnode : '',tonode : '',ftype: '',flag : '0',nodename : '',ftype:'T',
						notes : noteArea.getValue()
					});
					flwLogMgm.toBackCommon(_flowid, _insid, FlwNode.currentNodes[0], FlwNode.currentCnodes[0], _logid, obj_log, function(flagobj){
						if (flagobj.success){
							if(flagobj.flag){
								window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
							}else{
								Ext.Msg.show({
									title:'提示',
									msg:"退回失败,请和管理员联系！",
									buttons:Ext.Msg.OK,
									fn:function(v){
										displayOCX(true);
									}
								});
							}
						}else{
							Ext.Msg.show({
								title:'提示',
								msg:flagobj.errormsg,
								buttons:Ext.Msg.OK,
								fn:function(v){
									displayOCX(true);
								}
							});
						}
					}); 
                }
			}else{
				displayOCX(true);
            }
		}
	});
	DWREngine.setAsync(true);
};
//发送流程处理方法
function FlowSendHandler(){
	displayOCX(false);
	if (FlwControl.haveDoc&&!TANGER_OCX_bDocOpen){//当前节点的审批单是否打开
		Ext.example.msg('提示', '请先打开文档！');
		return;
	}
	if (FlwControl.needSign&& !FlwControl.isSigned){//是否需要签字
		Ext.example.msg('提示', '请先完成文档[签字],再进行下一步!');
		setTimeout("displayOCX(true)",1000);
		return;
	}
	if(noteArea.getValue()==""){
		Ext.example.msg('提示', '请先签署意见,再进行下一步!');
		setTimeout("displayOCX(true)",1000);
		return
	} 
	
	if ("7" == _ftype || '7A'==_ftype || '7T'==_ftype){//状态节点
		if (FlwControl.haveModel == true && FlwControl.isSaveModel != true){//模板是否保存
			Ext.example.msg('提示', '请先把[模板]存为[流程文档],再进行下一步!');
			setTimeout("displayOCX(true)",1000);
			return;
		};
		if (FlwNode.stateNodes[0][0] == '0') {//状态为结束,完成当前流程
			Ext.Msg.show({
				title: '提示',
				msg: '您确定要结束该流程吗？',
				buttons: Ext.Msg.OKCANCEL,
				icon: Ext.Msg.WARNING,
				fn: function(value){
					if ('ok' == value){
						flwLogMgm.finishFlow(_logid, function(flag){
							if (flag){
								if(top&&top.expandWestAndNorth){
									top.expandWestAndNorth();
								}
								window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
							}
						});
					}else{
						setTimeout("displayOCX(true)",1000);
					}
				}
			});
		} else {
			baseDao.findByWhere2(commonNodeBean, "flowid='"+_flowid+"' and nodeid='"+FlwNode.currentNodes[0]+"'", function(list){
				if (list.length > 0) {//定义就走普通节点
					ShowSend2CnodeWin();
				} else {//未定义就直接申请状态改变
					ShowSend2NodeWin();
				}
			});
		}
	} else if ("3" == _ftype) {				//任务
		if (IS_FINISHED_TASK != true) {
			Ext.example.msg('提示', '请先完成[流程任务],再进行下一步!');
			displayOCX(true);
			return;
		}
		FlowProcess('6');
	} else if ("6" == _ftype) {//完成任务，判断是否定义了普通节点
		baseDao.findByWhere2(commonNodeBean, "flowid='"+_flowid+"' and nodeid='"+FlwNode.currentNodes[0]+"'", function(list){
			if (list.length > 0) {//定义就走普通节点
				ShowSend2CnodeWin();
			} else {//未定义就直接申请状态改变
				ShowSend2NodeWin();
			}
		});
	} else if ("P" == _ftype || "T" == _ftype) {//普通节点
		if (noteArea.getValue() == ""){
			Ext.example.msg('提示', '请先填写[签署意见]!');
			return;
		}
		baseDao.findByWhere2(commonNodePathBean, "flowid='"+_flowid+"' and startid='"+FlwNode.currentCnodes[0]+"'", function(list){
			//判断下个节点是否是状态节点
			baseDao.findByWhere2(commonNodePathBean, "flowid='"+_flowid+"' and startid='"+list[0].endid+"'", function(list){
				if (list[0].endid == '0'){//下一节点为状态，申请状态改变
					ShowSend2NodeWin();
				} else {//下一节点为普通节点
					ShowSend2CnodeWin();
				}
			});
		});
	}
}
//被退回普通节点的重新发送
function FlowResendHandler(){
	displayOCX(false);
	if (FlwControl.needSign&& !FlwControl.isSigned){//是否需要签字
		Ext.example.msg('提示', '请先完成文档[签字],再进行下一步!');
		displayOCX(true);
		return;
	}
	var notes = noteArea.getValue();
	if ( notes== ""){
		Ext.example.msg('提示', '请先填写[签署意见],再进行操作!');
		displayOCX(true);
		return;
	};
	if(FlwControl.haveModel == true && FlwControl.isSaveModel != true){//模板是否保存
		Ext.example.msg('提示', '请先把[模板]另存为[流程文档],再进行下一步!');
		displayOCX(true);
		return;
	};
	Ext.Msg.show({
		title: '提示',
		msg: '将重新发送给上一步退回此流程的处理人，确定要重新发送吗?',
		buttons: Ext.Msg.YESNO,
		icon: Ext.MessageBox.WARNING,
		fn: function(value){
			if ('yes' == value) {
				var obj_log = new FlwLog({notes : notes});
				flwLogMgm.resendFlow(_logid, obj_log, function(flag){
					if (flag){
						window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
					}else{
						Ext.example.msg('提示','发送失败！');
					}
				}); 
			} else {
				displayOCX(true);
			}
		}
	});
}
//流程删除
function FlowDelete(){
	displayOCX(false);
	Ext.Msg.show({
		title: '提示',
		msg: '结束流程将删除所有相关文档、附件、数据和流程日志等信息！',
		buttons: Ext.Msg.YESNO,
		icon: Ext.MessageBox.WARNING,
		fn: function(value){
			if (value=='yes'){
				Ext.Msg.confirm('提示','是否删除业务数据?',function(v){
					var isDelBiz = (v=="yes"?true:false);
					flwInstanceMgm.deleteFlowIns(_insid, isDelBiz, function(flag){
						if (flag){
							window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
						}
					});
				});
			} else {
				displayOCX(true);
			}
		}
	});
}
//发送到普通节点窗口
function ShowSend2CnodeWin(){
	if(FlwNode.stateCnodes.length==1){
		var currentCnodes = FlwNode.currentCnodes?FlwNode.currentCnodes:new Array();
		var stateCnodes = FlwNode.stateCnodes?FlwNode.stateCnodes:new Array();
		var currentNodes = FlwNode.currentNodes?FlwNode.currentNodes:new Array();
		var sendTypeFlag=false;
		DWREngine.setAsync(false); 
		//判断当前节点是否是多节点汇总中的最后一个被处理的节点,如果不是则直接进入下一步流程，不需要选择下一步处理人
		flwLogMgm.isLastSender(_logid,_insid, currentNodes[0], currentCnodes[0], stateCnodes[0][0], function(flag){
				if (flag){
					sendTypeFlag=true;
				}
			});
		DWREngine.setAsync(true);
		if(sendTypeFlag){
			Ext.Msg.show({
				title: '提示',
				msg: '您确定要发送流程吗？',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.WARNING,
				fn: function(value){
					if ('yes' == value) {
						if(!noteArea) return;//签署意见的面板不存在
						var notes = noteArea.getValue();
						if(notes=="") {
							Ext.example.msg('提示','请先填签署意见?');
							return;
						};
						var logList = new Array();
						//是否发送即时短信
						var isSendMsg = false;
						DWREngine.setAsync(false);
                        //此时合并的节点，不是最后一个被处理的节点，也需要记录日志，
							baseDao.findByWhere2(commonNodeBean, "cnodeid='"+stateCnodes[0][0]+"' and flowid='"+_flowid+"'", function(list){
								var obj_log = new Object();
                                obj_log.fromnode = _userid;
                                obj_log.tonode = list[0].handler;
                                //如果下一个接收节点的处理人类型是："流程发起人（P）"，则默认处理人修改为流程发起人
                                if ("P"==list[0].istopromoter){
                                    flwLogMgm.getFlowActionPerson(_insid, function(user){
                                        obj_log.tonode = user.userid;
                                    });
                                }
								obj_log.ftime = new Date();
								obj_log.ftype = 'P';
								obj_log.notes = notes;
                                //如果都为未完成，就会同时出现多个待办，如果为完成，则日志中用户无法区分
								//因此状态新增-1，针对无条件合并，非最后一个节点时候的状态，区别于未完成和完成
                                //在待办中不会显示，在日志中显示为未完成
                                obj_log.flag = '-1';
								obj_log.nodename = list[0].name;
								obj_log.nodeid = list[0].cnodeid;
								logList.push(obj_log);
							});
							flwLogMgm.sendToCommonFlow(_logid,_insid, currentNodes[0], currentCnodes[0], Ext.encode(logList), function(flag){
								if (flag){
									isSendMsg = true;
									window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
								}
							});
						DWREngine.setAsync(true);
						if (isSendMsg){
							flwLogMgm.sendMsgNow(_insid, _logid, Ext.encode(logList), function(){});
						}
					}
				}
			})
		}else{
			if(!FlwWindow.sendToCnodeWin){
				FlwWindow.sendToCnodeWin = 
					new Flw.wait.WinOfSend2Cnode({
					id:'send2cnode',
					flwNode:FlwNode,
					closeAction:'hide'
				});
			}
			FlwWindow.sendToCnodeWin.show();
		}
	}else{
		if(!FlwWindow.sendToCnodeWin){
			FlwWindow.sendToCnodeWin = 
				new Flw.wait.WinOfSend2Cnode({
					id:'send2cnode',
					flwNode:FlwNode,
					closeAction:'hide'
				});
		}
		FlwWindow.sendToCnodeWin.show();
	}
}
//发送到状态节点窗口
function ShowSend2NodeWin(){
	if(!FlwWindow.sendToNodeWin){
		FlwWindow.sendToNodeWin = 
			new Flw.wait.WinOfSend2Node({
				id:'send2node',
				flwNode:FlwNode,
				closeAction:'hide'
			});
	}
	FlwWindow.sendToNodeWin.show();
}
//修改流程编号
function ShowEditFlwInsNoWin(){
	if(!FlwWindow.editFlwNoWin){
		FlwWindow.editFlwNoWin = 
			new Flw.wait.WinOfEditFlwNO({
				id:'editno',
				closeAction:'hide',
				logid:_logid,//必须属性
				hideHandler:loadFlwInfo?loadFlwInfo:Ext.emptyFn()
			})
	}
	FlwWindow.editFlwNoWin.show();
}

//跳转至业务面板
function ProcessTask(){
	mainTabPanel.getItem('task').enable();
	mainTabPanel.setActiveTab('task');
	var pParams, obj;
	DWREngine.setAsync(false); 
	baseDao.findByWhere2(faceParamsInsBean, FlwControl.commFilter2, function(list){
		pParams = (list.length > 0) ? list[0].paramvalues : '';
	});
	baseDao.findByWhere2(nodeFunModBean, FlwControl.commFilter1, function(list){
		obj = list[0];
	});
	DWREngine.setAsync(true);
	//判断是否存在业务数据，如果不存在业务数据，则禁用"流程处理"和"查看流程数据"tab
	var params = pParams.split("`");
	var where = "";
	for (var x=0; x<params.length; x++){
		var param = params[x].split(":");
		if (x != 0) where += " and ";
		where += param[0]+"='"+param[1]+"'";
	}
	var hasDataSql="select * from "+obj.viewname+" where "+where;
	DWREngine.setAsync(false);
	baseDao.getData(hasDataSql,function(list){
		if(list.length<1){
			mainTabPanel.getItem('common').disable();
			mainTabPanel.getItem('module').disable();
		}
	})
	DWREngine.setAsync(true);
	Ext.getCmp("task").getTopToolbar().items.get(0).setText('<font color=#15428b><b>&nbsp;流程任务 - '+obj.funname+'</b></font>');
	loadTaskPanel(obj.url, pParams, obj.funname, obj.businessname, obj.methodname, obj.tablename, obj.faceid);
}
//判断当前节点下是否有签名
function haveSign(){
	var bkList = new Array();
	var beanname = "";
	var filter = "";
	if (FlwControl.isStateNode){
		beanname = nodeBean;
		filter = "flowid='"+_flowid+"' and nodeid='"+FlwNode.currentNodes[0]+"'";
	} else {
		beanname = commonNodeBean;
		filter = "flowid='"+_flowid+"' and nodeid='"+FlwNode.currentNodes[0]+"'" +
				 " and cnodeid='"+FlwNode.currentCnodes[0]+"'";
	}	
	DWREngine.setAsync(false); 
	baseDao.findByWhere2(beanname, filter , function(list){
		if (list.length > 0){
			if (list[0].bookmark != '' && list[0].bookmark != null)
			bkList = list[0].bookmark.split(',');
		}
	});
	DWREngine.setAsync(true);
	if(bkList.length>0){
		return true;
	}else{
		if(FlwControl.ISYP&&(_ftype=="P"||_ftype=="T")){
			return true;
		}else{
			return false;
		}
	}
};
//重新打开当前审批单
function refreshDocHandler(){
	var filterFile=" filedate in( select max(filedate) from com.sgepit.frame.flow.hbm.InsFileInfoMaxView where insid='"+_insid+"')"
	DWREngine.setAsync(false);
	baseDao.findByWhere2(insfileBean, "insid='"+_insid+"' and "+filterFile, function(list){
		if (list.length > 0){
			//displayOCX(true);
			//TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", list[0].fileid);
			openFlwFile(_basePath+"/servlet/FlwServlet?ac=loadDoc", list[0].fileid);
			FlwButtons.saveBtn.fileid   = list[0].fileid;
			FlwButtons.saveBtn.filename = list[0].filename;
			FlwControl.currFileID       = list[0].fileid;
			FlwControl.currFileName     = list[0].filename;
			FlwControl.isSaveModel      = true;//已保存关联模板
			if (haveSign()) {
				FlwButtons.signBtn.enable();
				FlwControl.needSign = true;
			}
		}
	});
	DWREngine.setAsync(true);
	if(FlwControl.docReadOnly){
		TANGER_OCX_SetReadOnly(true);//设置文档只读
	}else{
		TANGER_OCX_SetReadOnly(false);//设置文档可写
	}
}
function updateParamValue(paramvalues) {
	DWREngine.setAsync(false);
	flwFrameMgm.updateFaceParamsIns(_insid, FlwNode.currentNodes[0], paramvalues, function(){
	});
	DWREngine.setAsync(true);
	if(!FlwButtons.openBtn.disabled)
		loadBizData();
}

Ext.ns("Flw","Flw.wait");
Flw.wait.ContentPanel=Ext.extend(Ext.Panel ,{
	layout:"fit",
	border:false,
	initComponent: function(){
		this.items=[{
			id:"maintab",
			xtype:"tabpanel",
			deferredRender:false,
			activeTab:0,
			items:[{
					id:'common',
					title:"流程处理",
					layout:"border",
					border:false,
					items:[{
						id:"flowdocpanel",region:"center",border:false,
						split: true,contentEl: 'ocxTab',
						tbar:[]
					},{
						id:"floweastpanel",
						region:"east",
						width:266,
						layout:"anchor",
						collapseMode: 'mini',
						collapsible: true,
						items:[{
							anchor:"100% 55%",
							title: '待办内容',iconCls: 'title',layout: 'fit',
		        			margins:'0 0 5 5',border: false,autoScroll: true,
							items: [{
								id:'viewpanel',border: false,autoScroll: false,
								viewTpl:new Ext.XTemplate(
									'<div class="div_lc">',
									'	<div class="div_inside">',
	  								'		<table width="100%" border="0" cellspacing="0" cellpadding="0">',
  									'			<tr><td align="left" valign="top" width=80><p class="STYLE1">主&nbsp;&nbsp;&nbsp;&nbsp;题：</p></td><td><p class="STYLE1">{TITLE}</p><br/></td></tr>',
  									'			<tr><td height="1" bgcolor="#cccccc" colspan=2></td></tr>',
 									'			<tr><td height="1" colspan=2></td></tr>',
 									'			<tr><td height="1" bgcolor="#cccccc"  colspan=2></td></tr>',
									'			<tr><td><p class="STYLE1">流程类型：</td><td align="left"><span class="STYLE2">{FLW_TITLE}</span></p></td></tr>',
 									'			<tr><td><p class="STYLE1">当前步骤：</p></td><td align="left"><span class="STYLE2">{COMMON_NODE}</span></td></tr>',
 									'			<tr><td height="1" bgcolor="#cccccc" colspan=2></td></tr>',
 									'			<tr><td><p class="STYLE1">上一步骤：</p></td><td align="left"><span class="STYLE2">{PEV_NODE}</span></td></tr>',
 									'			<tr><td><span class="STYLE2">【发 送 人】 </span></td><td align="left"><span class="STYLE2">{FROM_NAME}</span></td></tr>',
 									'			<tr><td><span class="STYLE2">【发送时间】</span></td><td align="left"><span class="STYLE2">{FTIME}</span></td></tr>',
 									'			<tr><td><span class="STYLE2">【处理意见】</span></td><td align="left"></td></tr>',
 									'			<tr><td colspan=2><span class="STYLE2">&nbsp;{NOTES}</span></td></tr>',
									'		</table>',
									'	</div>',
									'</div>'
								)
							}]
						},{
							id:"flowhdlpanel",
							title:"流程处理",
							iconCls: 'title',
							layout:"fit",
							border:false,
							anchor:"100% 45.1%",
							items:[{
								tbar:new Ext.Toolbar({height:25}),
								bbar:[{
									xtype:'combo',valueField: 'k', displayField: 'v',emptyText: '可选意见', width:73,
									mode:'local',triggerAction: 'all', editable: false,
									store: new Ext.data.SimpleStore({
										fields: ['k', 'v'],	data: [['同意。', '同意'],['不同意。', '不同意']]
									}),
									listeners:{
										select:function(combo, record, index){
											noteArea.setValue(record.get('k'));
										}
									}
								},'->'],
								id: 'note-form',header: false,border: false,layout: 'fit',
								items: [{
									name: 'notes',fieldLabel: '签署意见',	id:'note-area',
									allowBlank: false,xtype: 'textarea'
								}]
							}]
						}]
					}]
			},{
				id:"task",
				border:false,
				disabled: true,
				title:"任务",
				layout:'fit',
				autoScroll: true,
				tbar:[{text:'<font color=#15428b><b>&nbsp;流程任务</b></font>',iconCls: 'pasteUser1'}]
			},{
				id:"module",
				border:false,
				layout:'fit',
				title:"流程数据查看",
				header: false,
				tbar: ['-']
			}]
		}]
		Flw.wait.ContentPanel.superclass.initComponent.call(this);
	}
});
Ext.reg("contentpanel",Flw.wait.ContentPanel);