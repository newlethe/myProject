var bean = "com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "lsh"
var orderColumn = "sjType"

var statusArr = [['0','未上报'],['1','已上报'],['2','申请退回'],['3','已上报'],['4','已退回']]
var spArr = [['1','未发送部门领导审批'],['-1','<font color=red>退回填报人重新填报</font>'],['2','等待部门领导审批'],['-2','<font color=red>退回部门领导重新审批</font>'],['3','部门领导审批完成'],['4','公司领导审批完成']];
var spWin;
var nowSj,reportIdTemp;
Ext.onReady(function(){
	
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
	
	var fm = Ext.form;
	var fc = {
		'lsh':{name:'lsh',fieldLabel:'流水号',hidden:true,hideLabel:true},
		'sjType':{name:'sjType',fieldLabel:'报表周期',hidden:true,hideLabel:true},
		'unitId':{name:'unitId',fieldLabel:'单位',hidden:true,hideLabel:true},
		'deptId':{name:'deptId',fieldLabel:'发送部门'},
		'title':{name:'title',fieldLabel:'标题'},
		'userId':{name:'userId',fieldLabel:'填报人'},
		'createDate':{name:'createDate',fieldLabel:'创建时间',format: 'Y-m-d',hidden:true,hideLabel:true},
		'latestDate':{name:'latestDate',fieldLabel:'发送时间',format: 'Y-m-d'},
		'status':{name:'status',fieldLabel:'上报状态',hidden:true,hideLabel:true},
		'billStatus':{name:'billStatus',fieldLabel:'流程状态',hidden:true,hideLabel:true},
		'memo':{name:'memo',fieldLabel:'备注',hidden:true,hideLabel:true},
		'spStatus':{name:'spStatus',fieldLabel:'审批状态'},
		'deptUserSp':{name:'deptUserSp',fieldLabel:'部门领导',hidden:true,hideLabel:true},
		'compUserSp':{name:'compUserSp',fieldLabel:'公司领导',hidden:true,hideLabel:true}
	};
	
	var Columns = [
		{name:'lsh',type:'string'},
		{name:'sjType',type:'string'},
		{name:'unitId',type:'string'},
		{name:'deptId',type:'string'},
		{name:'title',type:'string'},
		{name:'userId',type:'string'},
		{name:'createDate',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'latestDate',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'status',type:'string'},
		{name:'billStatus',type:'string'},
		{name:'memo',type:'string'},
		{name:'spStatus',type:'string'},
		{name:'deptUserSp',type:'string'},
		{name:'compUserSp',type:'string'}
	];
	
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'lsh',header:fc['lsh'].fieldLabel,dataIndex:fc['lsh'].name,hidden:true},
		{id:'sjType',header:fc['sjType'].fieldLabel,dataIndex:fc['sjType'].name,hidden:true},
		{id:'unitId',header:fc['unitId'].fieldLabel,dataIndex:fc['unitId'].name,hidden:true},
		{id:'title',header:fc['title'].fieldLabel,dataIndex:fc['title'].name,width:180,
			renderer:function(value,cell,record){
				//return "<a href='javascript:void(0)' onclick='openSpWin("+record.get('lsh')+")' >"+value+"</a>"
				return value
			}
		},
		{id:'deptId',header:fc['deptId'].fieldLabel,dataIndex:fc['deptId'].name,width:90,
			renderer:function(value){
				for(var i=0;i<deptArray.length;i++){
					if(value == deptArray[i][0])
					return deptArray[i][1]; 
				}
			}
		},
		{id:'userId',header:fc['userId'].fieldLabel,dataIndex:fc['userId'].name,width:90,
			renderer:function(value){
				for(var i=0;i<userArray.length;i++){
					if(value == userArray[i][0])
					return userArray[i][1]; 
				}
			}
		},
		//查询发送人
		{header:'发送人',width:90,
			renderer:function(value,cell,record){
				var postUser = '';
				for(var i=0;i<userArray.length;i++){
					if(USERDEPTID == "00"){
						if(record.get("deptUserSp") == userArray[i][2])
						postUser = userArray[i][1];
					}else{
						if(record.get("userId") == userArray[i][0])
						postUser = userArray[i][1];
					}
				}
				return postUser;
			}
		},
		{id:'createDate',header:fc['createDate'].fieldLabel,dataIndex:fc['createDate'].name,width:90,hidden:true,
			renderer: formatDate
		},
		{id:'latestDate',header:fc['latestDate'].fieldLabel,dataIndex:fc['latestDate'].name,width:90,
			renderer: formatDate
		},
		{id:'status',header:fc['status'].fieldLabel,dataIndex:fc['status'].name,width:90,hidden:true,
			renderer:function(value){
				for(var i=0;i<statusArr.length;i++){
					if(value == statusArr[i][0])
					return statusArr[i][1]; 
				}
			}
		},
		{id:'billStatus',header:fc['billStatus'].fieldLabel,dataIndex:fc['billStatus'].name,hidden:true},
		{id:'memo',header:fc['memo'].fieldLabel,dataIndex:fc['memo'].name,hidden:true},
		{id:'spStatus',header:fc['spStatus'].fieldLabel,dataIndex:fc['spStatus'].name,width:150,
			renderer:function(value,cell,record){
				var status = record.get('spStatus');
				if(scptRole!=""&&scptRole=="deptLeaderApproval")
					{
					if(status == '3'||status=='4'){
						return '已审批'
					}else if(status == '-1'){
						return '已退回'
					}else if(status == '-2' || status == '2'){
						return '待审批'
					}
					
					}
				else if(scptRole!=""&&scptRole=="CompLeaderApproval"){	
   						if(status == '4'){
						return '已审批'
					}else if(status == '-1'){
						return '已退回'
					}else if(status == '3'){
						return '待审批'
					}
					}
			}
		},
		{id:'deptUserSp',header:fc['deptUserSp'].fieldLabel,dataIndex:fc['deptUserSp'].name,width:90,hidden:true,
			renderer:showUserName
		},
		{id:'compUserSp',header:fc['compUserSp'].fieldLabel,dataIndex:fc['compUserSp'].name,width:90,hidden:true,
			renderer:showUserName
		}
	]);
	
	cm.defaultSortable = true;//可排序
	
	var ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod,
			params:''
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns),
		remoteSort: true,
        pruneModifiedRecords: true
	});
	
	ds.setDefaultSort(orderColumn, 'desc');
	
	var spBtn = new Ext.Button({
		text: '处理',
		iconCls: 'x-btn-text-icon',
		icon: CONTEXT_PATH + '/jsp/res/images/icons/application_get.png',
		handler: openSpWin
	});
	var btn_createOvertime = new Ext.Toolbar.Button({
		text: '加班情况说明表',
		tooltip: '加班情况说明表',
        iconCls: 'x-btn-text-icon',
        icon: CONTEXT_PATH + '/jsp/res/images/icons/add.png',
//		disabled: true,
		handler: createOvertime
	});		
	
	
	var gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		region:'center',
		border : false,
		split:true,
		model: 'mini',
		stripeRows:true,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>考勤报表列表<B></font>','-',spBtn,'-',btn_createOvertime],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	});
	
//	ds.baseParams.params = "dept_user_sp = '"+USERNAME+"' and dept_id = '"+USERDEPTID+"'";
	//ds.baseParams.params = "dept_user_sp = '"+USERNAME+"' ";
	if(show) ds.baseParams.params += " and spStatus like '%2' ";
	if(USERDEPTID == "00"){
		ds.baseParams.params = "comp_user_sp = '"+USERNAME+"' ";
		if(show) ds.baseParams.params += " and spStatus = '3' ";
	}
   /*USERBELONGUNITID
    * --当前登录用户userBelongUnitid所管辖的所有部门考勤记录
    * */
 	//--
 	var deptStr ="";
 	DWREngine.setAsync(false);
 	baseMgm.getData("select t.unitid,t.unitname from sgcc_ini_unit t where t.unit_type_id = '8' start with upunit='"+USERBELONGUNITID+"'  connect by prior unitid = upunit",function(list){
 		if(list!=null){
 			for(i = 0; i < list.length; i++) {	
			deptStr+="'"+list[i][0]+"'"+",";
		}	
 	}
    });
 	DWREngine.setAsync(true);
 	deptStr+="'"+USERBELONGUNITID+"'"+",";
 	deptStr+="'"+USERDEPTID+"'"+",";
	if(deptStr!=""){
		deptStr=deptStr.substring(0,deptStr.length-1);
		ds.baseParams.params+= "dept_id in ("+deptStr+")";
	}
                                                                                       
	if(scptRole!=""&&scptRole=="deptLeaderApproval")
	{
		ds.baseParams.params+= "  and  (spStatus='2' or  spStatus='-2' or spStatus='3' or spStatus='4')";
	}
	else if(scptRole!=""&&scptRole=="CompLeaderApproval"){	
   		ds.baseParams.params+= "  and  (spStatus='3' or spStatus='4')";
	}
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	sm.on('rowselect', function(sm, rowIndex, record){
		if(record.get('deptUserSp') == USERNAME && (record.get('spStatus')=='2'||record.get('spStatus')=='-2')){
			spBtn.setText('处理')
		}else if(record.get('compUserSp') == USERNAME && record.get('spStatus')=='3'){
			spBtn.setText('处理')
		}else{
			spBtn.setText('查看')
		}
	})
	gridPanel.on('dblclick', openSpWin)
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel]
    });
	//加班情况说明表
	function createOvertime(){
	    var record = sm.getSelected();
    	if((record==null || record=="")){
    		Ext.example.msg('提示','请先选择考勤报表！')
    	}else{
    		reportIdTemp=record.get('lsh');
    		nowSj=record.get('sjType');
			var url=CONTEXT_PATH+"/Business/rlzy/kqgl/rlzy.kq.overtime.dept.input.jsp?nowSj="+nowSj+"&masterlsh="+reportIdTemp;		
			var n = window.showModalDialog(url, "", "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;" )    	
    	}
	}    
    function openSpWin(lsh){
    	var record = sm.getSelected();
    	if((record==null || record=="")){
    		Ext.example.msg('提示','请先选择考勤报表！')
    	}else{
    		lsh = record.get('lsh');
	    	spWin = new Ext.Window({
		    	title : '考勤报表审批',
				width: document.body.clientWidth*0.95,
				height: document.body.clientHeight*0.95,
				modal: true,
				plain: true,
				border: false,
				resizable: false,
				listeners: {
					hide: function(){
						ds.reload();
					}
				},		
				html:'<iframe width="100%" height="100%" src="'+BASE_PATH+'Business/rlzy/kqgl/rlzy.kq.dept.input.sp.jsp?lsh='+lsh+'"></iframe>'
		    });
			spWin.show();
    	}
    }
    
    function showUserName(value){
		var userName = '';
		for(var i=0;i<userArray.length;i++){
			if(value == userArray[i][2]){
				userName = userArray[i][1];
				break;
			}		
		}
		return userName;
	}
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    }; 
        
})