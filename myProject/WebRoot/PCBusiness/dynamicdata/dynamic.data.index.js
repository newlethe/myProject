var searchStr;
var checkUnit;
var title;
var dateArray = new Array();
var defaultTime = SYS_DATE_STR.substring(0,4) + SYS_DATE_STR.substring(5,7);
var blockId;  //代码块标识
//定义模块审核状态
var auditState = [['1','完整'],['-1','不完整']];


Ext.onReady(function (){
	
	if(VIEW) {
		var month = SYS_DATE_STR.substring(5,7)-1;
		if(month<10) month = "0" + month
		defaultTime = SYS_DATE_STR.substring(0,4) + month;
	}
	
	Ext.QuickTips.init();
	var currentDate = new Date();
	var startYear=currentDate.getYear()-2;
	var endYear =currentDate.getYear();
	while(startYear<=endYear){
		for(var i=1;i<13;i++)
		{
			var temp;
			var tempArray = new Array();
			if(startYear == endYear)
			{
				if(currentDate.getMonth()+1>=i)
				{
					if(i.toString().length<2){
						temp ="0"+i.toString();
					}else {
					   temp=i.toString();
					}
					tempArray.push((startYear.toString()+temp));
					tempArray.push(startYear+"年"+temp+"月");
					dateArray.push(tempArray);
				}
			}
			else
			{
				if(i.toString().length<2){
					temp ="0"+i.toString();
				}else {
				   temp=i.toString();
				}
				tempArray.push((startYear.toString()+temp));
				tempArray.push(startYear+"年"+temp+"月");
				dateArray.push(tempArray);
			}
		}
		startYear++;
	}
	
	searchStr = (pid=='0' ? 'date' + SPLITB+defaultTime +";" + "unitid" + SPLITB + USERBELONGUNITID
						: 'date' + SPLITB+defaultTime +";" + "unitid" + SPLITB + pid);
	
	//审核状态数据源
	var auditDs = new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : auditState
				});
				
	//审核状态下拉框			
    var auditCombo = new Ext.form.ComboBox({
						renderTo: 'auditCombo',
						name : 'report-month',
						border: "1px",
						readOnly : true,
						valueField : 'k',
						displayField : 'v',
						mode : 'local',
						triggerAction : 'all',
						store : auditDs,
						lazyRender : true,
						allowBlank : true,
						listClass : 'x-combo-list-small',
						width : 60,
						value : '-1', //初始为"不完整"
						listeners : {
							'select': function(combo,record){
								//1. 隐藏下拉框
								hideCombo();
								//从选中的单元格得到行号和列号
								var cell = dygrid.getSelectionModel().getSelectedCell();
								var rec = dyStore.getAt(cell[0]);
								var dataIndex = dyCm.getDataIndex(cell[1]);
								var editDataIndex = getAuditIndexByDataIndex(dataIndex,"index");
								//2. 设置单元格的值
								rec.beginEdit()
								rec.set(editDataIndex, record.get('v'));
								rec.endEdit()
								//后台新增或者保存修改的模块审核状态值
								var modName = getAuditIndexByDataIndex(dataIndex,"modName");
								var cTime = timeComboBox.getValue();
								DWREngine.setAsync(false);
									pcDynamicDataService.saveOrUpdateAudit(rec.get('pid'),modName,rec.get(editDataIndex),cTime);
								DWREngine.setAsync(true);
								
								var flag = rec.get('basicState')=="未审核" || rec.get('bidState')=="未审核" ||
							              rec.get('bdgState')=="未审核" ||rec.get('conState')=="未审核" ||
							              rec.get('scheduleState')=="未审核" || rec.get('statementState')=="未审核" ||
							              rec.get('qualityState')=="未审核"; /* || rec.get('securityState')=="未审核"; */
								             
								if(!flag)
								{
									var s =
									(rec.data.basicState == "完整" ? 1 : 0 ) * parseInt(rec.data.basicValue) +
									(rec.data.bidState == "完整" ? 1 : 0 ) * parseInt(rec.data.bidValue) +
									(rec.data.bdgState == "完整" ? 1 : 0 ) * parseInt(rec.data.bdgValue) +
									(rec.data.conState == "完整" ? 1 : 0 ) * parseInt(rec.data.conValue) +
									(rec.data.scheduleState == "完整" ? 1 : 0 ) * parseInt(rec.data.scheduleValue) +
									(rec.data.statementState == "完整" ? 1 : 0 ) * parseInt(rec.data.statementValue) +
									(rec.data.qualityState == "完整" ? 1 : 0 ) * parseInt(rec.data.qualityValue) /*
									(rec.data.securityState == "完整" ? 1 : 0 ) * parseInt(rec.data.securityValue);
									*/
									rec.beginEdit()
									rec.set("totalScore", s);
									rec.endEdit()
									
									rec.commit();
									
									/*集团，集团二级公司可编辑用户在设定所有模块的审核状态后，系统将各模块审核状态和权重值发送到数据交互消息队列，之后某个时间点发送到项目单位
									 项目接收到数据后自动给该项目单位及进行审核评分 */
									DWREngine.setAsync(false);
										pcDynamicDataService.dateExchangeOfStateAndValue(cTime, rec.get('pid'), USERBELONGUNITID);
									DWREngine.setAsync(true);
								}
							}
						}
					})
					
	title ='<center><b><font size=3>基建项目业务数据完整性考核</font></b></center>'
	var dyCellSm = new Ext.grid.CellSelectionModel(); 
//	var dyRowSm = new Ext.grid.RowSelectionModel({singleSelect:true});
	
	var dyCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
	    {
	    	header: '项目名称', 
	    	align : 'left', 
	    	dataIndex : 'projectName', 
	    	width: 250
	    },{
	    	header: '总分', 
	    	align : 'center', 
	    	dataIndex : 'totalScore', 
	    	width: 80,
	    	renderer: function(v,meta,rec){
					   var flag = rec.get('basicState')=="未审核" || rec.get('bidState')=="未审核" ||
					              rec.get('bdgState')=="未审核" ||rec.get('conState')=="未审核" ||
					              rec.get('scheduleState')=="未审核" || rec.get('statementState')=="未审核" ||
					              rec.get('qualityState')=="未审核; "/* || rec.get('securityState')=="未审核"; */
								             
						if(!flag)
						{
							var s =
							(rec.data.basicState == "完整" ? 1 : 0 ) * parseInt(rec.data.basicValue) +
							(rec.data.bidState == "完整" ? 1 : 0 ) * parseInt(rec.data.bidValue) +
							(rec.data.bdgState == "完整" ? 1 : 0 ) * parseInt(rec.data.bdgValue) +
							(rec.data.conState == "完整" ? 1 : 0 ) * parseInt(rec.data.conValue) +
							(rec.data.scheduleState == "完整" ? 1 : 0 ) * parseInt(rec.data.scheduleValue) +
							(rec.data.statementState == "完整" ? 1 : 0 ) * parseInt(rec.data.statementValue) +
							(rec.data.qualityState == "完整" ? 1 : 0 ) * parseInt(rec.data.qualityValue); /*
							(rec.data.securityState == "完整" ? 1 : 0 ) * parseInt(rec.data.securityValue);
							*/
							
							return s;
						}
	    	    }		
	    },{
	    	header: '基本信息', 
	    	align : 'center', 
	    	dataIndex : 'projectInfo', 
	    	width: 160, 
	    	renderer :changeCol
	    },{
	    	header: '招投标', 
	    	align :'center', 
	    	dataIndex : 'bidData',
	    	width: 160,
	    	renderer :changeCol
	    },{
	    	header: '概算', 
	    	align :'center', 
	    	dataIndex :'bdgData', 
	    	width: 160 ,
	    	renderer :changeCol
	    },{
	    	header: '合同',
	    	align :'center',
	    	dataIndex :'conoveData',
	    	width: 160, 
	    	renderer :changeCol
	    },
	   /* {header: '投资',align :'center',dataIndex :'investData',renderer :changeCol},新需求去掉投资*/
	      {
	      	header: '进度',
	      	align :'center',
	      	dataIndex :'scheduleData',
	      	width: 160,
	      	renderer :changeCol
	    },{
	    	header: '质量',
	    	align :'center',
	    	dataIndex :'qualityData', 
	    	width: 160, 
	    	renderer :changeCol
	    },{
	    	header: '综合报表', 
	    	align: 'center', 
	    	dataIndex: 'statementsData', 
	    	width: 160, 
	    	renderer: changeCol
	    }
//	    {
//	    	header: '安全',
//	    	align :'center',
//	    	dataIndex :'securityData', 
//	    	width: 200, 
//	    	renderer :changeCol
//	    }
//	    {header: '批文',align : 'center',dataIndex: 'approvalData',hidden: true,renderer :changeCol}
	]);
	
	var dyStore = new Ext.data.Store({
	    baseParams : {
	        bean : 'com.sgepit.pcmis.dynamicview.hbm.PcDynamicIndex',
	        ac : 'list',
	        business: 'pcDynamicDataService',
	        method :'getDynamicDataByTimeAndPid',
	        params :searchStr
	    },
	    proxy : new Ext.data.HttpProxy({
	        method :'GET',
	        url: MAIN_SERVLET
	    }),
	    reader : new Ext.data.JsonReader({
	        root : 'topics',
	        totalProperty: 'totalCount'
	    },[
	        {name :'pid',type :'string'},
	        {name:'projectName',type:'string'},
	        
	        {name:'projectInfo',type:'string'},
	        {name:'basicState',type:'string'},
	        {name:'basicValue',type:'string'},
	        
	        {name:'approvalData',type:'string'},
	        
	        {name:'statementsData', type:'string'},
	        {name:'statementState', type:'string'},
	        {name:'statementValue', type:'string'},
	        
	        {name:'bidData',type:'string'},
	        {name:'bidState',type:'string'},
	        {name:'bidValue',type:'string'},
	        
	        {name:'conoveData',type:'string'},
	        {name:'conState',type:'string'},
	        {name:'conValue',type:'string'},
	        
	        {name:'bdgData',type:'string'},
	        {name:'bdgState',type:'string'},
	        {name:'bdgValue',type:'string'},
	        
//	        {name:'securityData',type:'string'},
//	        {name:'securityState',type:'string'},
//	        {name:'securityValue',type:'string'},
	        
	        {name:'qualityData',type:'string'},
	        {name:'qualityState',type:'string'},
	        {name:'qualityValue',type:'string'},
	        
	        {name:'scheduleData',type:'string'},
	        {name:'scheduleState',type:'string'},
	        {name:'scheduleValue',type:'string'},
	        
	        {name:'score',type:'string'},
	        
	        {name:'investData',type:'string'}
	    ]),
	    remoteSort: true,
	    pruneModifiedRecords: true
	})
//    dyStore.load({callback: function(){alert(Ext.encode(dyStore.getAt(7).data))}});
    dyStore.load();
    var timeField = new Ext.form.DateField({
        id : 'currenttime',
        name : 'currentTime',
		fieldLabel: '签订日期',
		format: 'Y-m-d',
		readOnly:true,
        listeners :{
        }
    })
     var timeStore= new Ext.data.SimpleStore({
            fields :['k','v']
        })
    timeStore.loadData(dateArray.reverse())
    
    var timeComboBox = new Ext.form.ComboBox({
        editable :false,
        fieldLabel:'年月',
        mode :'local',
        name :'yearmonth',
        readOnly :true,
        triggerAction :'all',
        displayField:'v',
        valueField :'k',
        store :timeStore
    })
    
    timeComboBox.setValue(defaultTime);
    
	var treeCombo = new Ext.ux.TreeCombo({
		resizable:true,
		width:280,
		loader:new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:USERBELONGUNITID,
				ac:"buildingUnitTree",
				baseWhere:"unitTypeId in ('0','1','2','3','4','5','A')"
			}
		}),
		value:USERBELONGUNITID,
		root:  new Ext.tree.AsyncTreeNode({
	       text: USERBELONGUNITNAME,
	       id: USERBELONGUNITID,
	       expanded:true
	    })
	});
	
	var treePanel = treeCombo.getTree(); 
	treePanel.on('beforeload',function(node){
		treePanel.loader.baseParams.parentId = node.id; 
	});
	
	treeCombo.on('select',function(tree, node){
//		title ='<center><b><font size=3>'+node.attributes.text+'业务数据动态概览</font></b></center>'
	    dygrid.setTitle(title);
	});
	
	var btn = new Ext.Button({
	    id : 'search',
	    text : '查询',
	    iconCls :'btn',
	    handler : function (){
	    var date = timeComboBox.getValue()=='' ? defaultTime : timeComboBox.getValue();
	    if(treeCombo.getValue()==null || treeCombo.getValue()==''){
	    	unitid = USERBELONGUNITID;
	    }else {
	        unitid = treeCombo.getValue();
	    }
	    searchStr = 'date' + SPLITB + date + ";" + "unitid" + SPLITB + unitid;
	    dyStore.baseParams.params = searchStr;
	    dyStore.load();
	    }
	})
	
	var auditBtn = new Ext.Button({
	    id : 'auditBtn',
	    text : '考核权重维护',
	    iconCls :'form',
	    hidden: VIEW ? true : (EDIT ? false : true),
	    handler : function(){
	     		  var loadRec = new FormRecord({
			    				basic : 0,
								bid : 0,
								bdg : 0,
								con : 0,
								schedule : 0,
								statement : 0,
								quality : 0
//								security : 0
	    	   		  });
	    	    
	    	    //查询后台, 获取最新权重数据(最接近当前日期的)
	    	    var sql = "select A.mod_name, A.weight_value from pc_audit_weight_distribute A where " +
	    	    						"A.sj_type=(select max(sj_type) from pc_audit_weight_distribute)"
	    	    DWREngine.setAsync(false);
	    	    	baseDao.getData(sql, function(list){
		    	    		for(var i=0; i<list.length; i++)
		    	    		{
		    	    			loadRec.set(list[i][0],list[i][1]);
		    	    		}
	    	    	})
	    	    DWREngine.setAsync(true);
				
				formPanel.getForm().loadRecord(loadRec);
				eastPanel.expand();
	    }
	})
	
	var tbarArray = VIEW ?　null : (EDIT ? ['年月', '-', timeComboBox,'-','单位:',treeCombo,'-',btn,'->',auditBtn]
										 : ['年月', '-', timeComboBox,'-','单位:',treeCombo,'-',btn])
    dygrid = new Ext.grid.GridPanel({
        id :'dyGrid',
        region: 'center',
        title: title,
        border: false,
        layout : 'fit',
        autoScroll: true,
        animCollapse: false,
        loadMask: true,	
        trackMouseOver:true,        
        store : dyStore,
        cm : dyCm,
        sm : dyCellSm,
        region:'center',
//        tbar:[{xtype:'tbspacer'}],
        tbar : tbarArray,
       	listeners: {
//       		'render': function(){
//		       	if(!VIEW){
//				    if(USERBELONGUNITTYPEID=='0'){
//				       dygrid.getTopToolbar().add('年月', '-', timeComboBox,'-','单位:',treeCombo,'-',btn,'->',auditBtn); 
//				    }else {
//				       dygrid.getTopToolbar().add('-',btn,'->',auditBtn); 
//				    }
//		    	}
//       		}
       	}
    })
    
    // 创建编辑域配置
	var fc = {
		'basic' : {
			name : 'basic',
			fieldLabel : '基本信息',
			anchor : '95%'
		}, 'bid' : {
			name : 'bid',
			fieldLabel : '招投标',
			anchor : '95%'
		}, 'bdg' : {
			name : 'bdg',
			fieldLabel : '概算',
			anchor : '95%'
		},	'con' : {
			name : 'con',
			fieldLabel : '合同',
			anchor : '95%'
		}, 'schedule' : {
			name : 'schedule',
			fieldLabel : '进度',
			anchor : '95%'
		}, 'quality' : {
			name : 'quality',
			fieldLabel : '质量',
			anchor : '95%'
		},'statement' : {
			name : 'statement',
			fieldLabel : '综合月报',
			anchor : '95%'
		}
//		'security' : {
//			name : 'security',
//			fieldLabel : '安全',
//			anchor : '95%'
//		}
	}
	
	/*formPanel结果集合*/
	var FormRecord = Ext.data.Record.create([{
						name : 'basic',
						type : 'string'
					}, {
						name : 'bid',
						type : 'string'
					}, {
						name : 'bdg',
						type : 'float' 
					}, {
						name : 'con',
						type : 'float'
					}, {
						name : 'schedule',
						type : 'float'
					},{
						name : 'statement',
						type : 'float'
					}, {
						name : 'quality',
						type : 'float'
					}, 
//						{
//						name : 'security',
//						type : 'float'
//					},
						{
						name : 'sjType',
						type : 'String'
					}
		]);
		 
    formPanel = new Ext.FormPanel({
				width : 250,
				height :200,
				title: '模块审核权重设定',
				border : false,
				frame: true,
				layout : 'column',
				bodyStyle : 'padding:10px 10px; border:0px dashed #F0F4F5',
				labelAlign : 'left',
				enable : true,
				items:[		
					{
						autoWidth:true,
		    			autoHight: true,
		                border: false,
		                labelWidth: 60,
		                layout: 'column',
						items : [{
							layout : 'form',
							border : false,
							columnWidth : 1,
							defaults : { 
								width : 120
							},
						    items:[
								new Ext.form.NumberField(fc['basic']),
								new Ext.form.NumberField(fc['bid']),
								new Ext.form.NumberField(fc['bdg']),
								new Ext.form.NumberField(fc['con']),
								new Ext.form.NumberField(fc['schedule']),
								new Ext.form.NumberField(fc['quality']),
								new Ext.form.NumberField(fc['statement']),
								//控制按钮和文本框的距离
								{
					    			xtype:'panel',
					    			baseCls:"x-plain",
					    			height:15
							    }
//								new Ext.form.NumberField(fc['security'])
							]
						}
							],
					buttonAlign : 'left',
					buttons : [{
								name : 'save',
								text : '保存',
								iconCls : 'save',
								handler : formSave
							},{
								name : 'cancle',
								text : '取消',
								iconCls : 'remove',
								align: 'right',
								handler: cancleFun
							}]
				}]
//				listeners : {
//					beforecollapse : function(p) {
//						var b = p.enable;
//						p.enable = false;
//						return b;
//					},
//					beforeexpand : function(p) {
//						var b = p.enable;
//						p.enable = false;
//						return b;
//					}
//				}
			});
	
	var eastPanel = new Ext.Panel({
		region: 'east',
		collapsible : true,
		collapseMode : 'mini',
		collapsed : true,
		enable: true,
		split : true,
		layout: 'fit',
		width: 260,
		height: 210,
		items:[formPanel]
	})
	
    var viewport = new Ext.Viewport({
        layout : 'border',
        border : false,
        items :[dygrid,eastPanel]
    })
    
    if(VIEW || !EDIT){
    	eastPanel.setVisible(false);
    }
    
    function formSave() {
		var obj = formPanel.getForm().getValues();
		var totalValue = 0;  //所有模块总得权重值之和
		for(var o in obj)
		{
			if(!isNaN(parseInt(obj[o])))
			{
				totalValue += parseInt(obj[o]);
			}
		}
		//判断总得权重值是否为100, 如果不等于100,提示用户数据输入有问题
		if(!(100==totalValue)){
			Ext.Msg.alert('提示信息','模块权重值之和不为100, 请重新设置!');
			return;
		}
		
		var flag;
		DWREngine.setAsync(false);
			pcDynamicDataService.saveOrUpdateWeights(obj,defaultTime, function(value){
				flag = value;
			});
		DWREngine.setAsync(false);
		
		if('0'==flag)
		{
			Ext.example.msg('提示', '修改成功!');
			eastPanel.collapse(true);
		}
		else if("1"==flag)
		{
			Ext.example.msg('提示', '添加成功!');
			eastPanel.collapse(true);
		}
		else
		{
			Ext.Msg.alert('提示','保存失败!');
		}
    	dyStore.load();
	}	

	//点formPanel的取消按钮执行下列函数
	function cancleFun()
	{
		eastPanel.enable = true;
		eastPanel.collapse(true);
	}
})

function openDialog(url, winName){
    var r = BASE_PATH + url;
	var h = screen.availHeight;
	var w = screen.availWidth;
    
    while(true){  
    	try{
    		var win = window.open(r,'动态数据展示',"width="+w+"px, height="+h+"px, status=no, center=yes," +
    				"resizable=no, alwaysRaised=yes, location=no, left=0px, titlebar=yes");
	        win.document.title =  winName;  
	        if(win.document.title ==  winName) {  
	        	win.focus();
	            break;
	        }else{
	        	win.close();
	        }   
    	}
    	catch(e){
//    		alert(e.description)
    	}
    }  
}

function showDiv(el){
	    var  obj = document.getElementById("bb");
		  if(el.innerHTML.indexOf('有更新')!=-1){
	      	var _width=document.body.clientWidth-event.clientX;
	      	var _height=document.body.clientHeight-event.clientY;
			var dataIndex = dygrid.getColumnModel().getDataIndex(el.colIndex);
	        obj.innerHTML =  dygrid.getStore().getAt(el.rowIndex).get(dataIndex);
	        var arrLe=obj.innerHTML.split('<LI>');
	        var dataHeight=(arrLe.length-1)*20;
	      	   if(_width<220){
			       obj.style.left =event.clientX -200//getX(event);
	      	   }else {
			       obj.style.left =event.clientX+10 //getX(event);
	      	   }
	      	   if(_height>dataHeight){
	           	   obj.style.top = event.clientY//getY(event)+100;
	      	   }else{
	      	   	   obj.style.top=event.clientY-dataHeight;
	      	   }
		       obj.style.display='block';
	      }else {
	          obj.style.display='none';
	      }
	      
	      clearTimeout(blockId);
}

function hideDiv(){
	blockId = setTimeout("hideDiv1()",5000);
}

function changeCol(val, meta, rec, rowIndex, colIndex, store){
	var str = '';
	var state = getStateBycolIndex(colIndex, rec);
	if(val.length>3){
		 str = "<div>"+
		  		 "<span style='float:right'><img src='jsp/res/images/pass2.png' onclick=\"showCombo(this);\" rowIndex="+rowIndex+" colIndex="+colIndex+"></span>"+
				 "<span onmouseover=\"showDiv(this);\" onmouseout=\"hideDiv();\" " +
					 	"style=\"color: red;\" rowIndex="+rowIndex+" colIndex="+colIndex+" >有更新("+state+")&nbsp;&nbsp;&nbsp;&nbsp</span>" +
			   "</div>";
	}else {
	     str = "<div>"+
	     		 "<span style='float:right'><img src='jsp/res/images/pass2.png' onclick=\"showCombo(this);\" rowIndex="+rowIndex+" colIndex="+colIndex+"></span>"+
				 "<span onmouseover=\"showDiv(this);\" onmouseout=\"hideDiv();\" " +
					 	"rowIndex="+rowIndex+" colIndex="+colIndex+" >无更新("+state+")&nbsp;&nbsp;&nbsp;&nbsp</span>" +
			   "</div>";
	}
    return str;
};

function hideDiv1(){
	document.getElementById('bb').style.display='none';
};

function showCombo(el){
	if(!EDIT || VIEW) return;     //只读用户不可以修改审核状态
	dygrid.getSelectionModel().select(el.rowIndex, el.colIndex, false, true);
	var  obj = document.getElementById("auditCombo");
	obj.style.left = event.clientX - 65; 
    obj.style.top = event.clientY + 5;
	obj.style.display='block';
}

function hideCombo(){
	document.getElementById("auditCombo").style.display='none';;
}

function getStateBycolIndex(colIndex,rec)
{
	var state = null;
	var dataIndex = dygrid.getColumnModel().getDataIndex(colIndex);
	var auditIndex = getAuditIndexByDataIndex(dataIndex,"index");
	state = rec.get(auditIndex);
	
	return state;
}

//type="index"或者modName,通过列的索引返回后台维护的模块名称
//type="modName"该列对应的审核状态索引名称
function getAuditIndexByDataIndex(dataIndex, type)
{
	var retValue = null;
	if(dataIndex=='projectInfo')
	{
		 retValue = (type=="index")?"basicState":"basic" ;
	}
	else if(dataIndex=='bidData')
	{
		 retValue = (type=="index")?"bidState":"bid" ;
	}
	else if(dataIndex=='bdgData')
	{
		 retValue = (type=="index")?"bdgState":"bdg" ;
	}
	else if(dataIndex=='conoveData')
	{
		 retValue = (type=="index")?"conState":"con" ;
	}
	else if(dataIndex=='scheduleData')
	{
		 retValue = (type=="index")?"scheduleState":"schedule" ;
	}
	else if(dataIndex=='statementsData')
	{
		 retValue = (type=="index")?"statementState":"statement" ;
	}
	else if(dataIndex=='qualityData')
	{
		 retValue = (type=="index")?"qualityState":"quality" ;
	}
//	else if(dataIndex=='securityData')
//	{
//		 retValue = (type=="index")?"securityState":"security" ;
//	}
	else
	; //do nothing
	
	return retValue;
}

