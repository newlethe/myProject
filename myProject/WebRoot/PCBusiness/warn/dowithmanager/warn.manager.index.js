var selectPersonWin;
var unitType =new Array();//设置项目单位列表
var doWidthFormPanel ;
var doWidthGrid ;
var doWidthGridWin;
var selectEd;
var lookdetailWin;
var personArr = new Array();//人员列表；
var modeArr = new Array();//模块列表
var rulesArr = new Array();//预警规则名称
var closeWarnWin;//关闭预警信息
DWREngine.setAsync(false);
baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.SgccIniUnit","unitTypeId ='A'",function(list){
    for(var i=0;i<list.length;i++){
        var temp = new Array();
        temp.push(list[i].unitid);
        temp.push(list[i].unitname);
        unitType.push(temp);
    }
})
DWREngine.setAsync(true);
DWREngine.setAsync(false);
baseDao.findByWhere2("com.sgepit.pcmis.warn.hbm.PcWarnRules","1=1",function(list){
    for(var i=0;i<list.length;i++){
        var temp = new Array();
        temp.push(list[i].moduleid);
        temp.push(list[i].warnrulename);
        rulesArr.push(temp);
    }
})
DWREngine.setAsync(true);
DWREngine.setAsync(false);
 baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.RockPower","1=1",function (list){
     for(var i=0;i<list.length;i++){
     	 var temp = new Array();
     	 temp.push(list[i].powerpk);
     	 temp.push(list[i].powername);
         modeArr.push(temp);
     }
 })
DWREngine.setAsync(true);
	 //获取人员信息
     DWREngine.setAsync(false);
     baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.RockUser",
	     "1=1",
		  function(list){
			  for(var i=0;i<list.length;i++){
			      var temp = new Array();
			      temp.push(list[i].userid);
			      temp.push(list[i].realname);
			      personArr.push(temp);
			  }
		 }
	 );
	 DWREngine.setAsync(true);
Ext.onReady(function(){ 
    var unitTypeStore = new Ext.data.SimpleStore({
        fields : ['unitid','unitname'],
        data :unitType
    })
    var  perStore = new Ext.data.SimpleStore({
        fields : ['userid','realname'],
        data : personArr
    })
    var root = new Ext.tree.AsyncTreeNode({
        text : '模块名称',
        id : '模块名称',
        expanded : true
    })
    var treeloader = new Ext.tree.TreeLoader({
        dataUrl :MAIN_SERVLET,
        requestMethod : 'GET',
        baseParams :{
            ac :'tree',
            parent : '01',
            treeName : 'ModuleTree',
            businessName: 'PcWarnService',
            leaf:'0'
        }
    })
    var treePanel = new Ext.tree.TreePanel({
        region : 'west',
        id : 'treePanel',
        frame : false,
        Height : true,
        width : 200,
        minSize : 200,
        maxSize : 500,
        margins : '5 0 5 5',
        cmargins : '0 0 0 0',
        rootVisible :true,
        line :false,
        autoScroll : true,
        collapsible : true,
        animCollapse : true,
        animate : false,
        collapseMode : 'mini',
        loader : treeloader,
        root : root,
        listeners :{
            click : function(n,e){
                if(n.id!=''){
                    if('模块名称'==n.id){
                    store.baseParams.params=" dutypersoninfo like '"+USERID+"%'";
                    }else {
                    store.baseParams.params=" moduleid='"+n.id+"' and dutypersoninfo like '"+USERID+"%'";
                    }
                    northReload();
                }
            }
        }
    })
    
        store = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url :MAIN_SERVLET,
            method : 'GET'
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty: 'totalCount',
            id : 'uids'
        },[
            {name : 'uids',type : 'string'},
            {name : 'pid', type : 'string'},
            {name : 'warntime', type : 'date',dateFormat: 'Y-m-d H:i:s'},
            {name :　'moduleid',type : 'string'},
            {name : 'warncontent', type : 'string'},
            {name : 'warnlevel', type : 'string'},
            {name : 'warnstatus', type : 'string'},
            {name : 'warncompletion', type : 'string'},
            {name : 'detailinfo', type : 'string' },
            {name :'dutypersoninfo',type :'string'}
        ]),
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnInfo',
            business :'baseMgm',
            method :'findwhereorderby',
            params : "dutypersoninfo like '"+USERID+"%'"
        }
        
    })
    var selModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect :true,
        header :'',
        listeners : {
            rowselect :function (sm,index,rec){
                selectUids = rec.get('uids');
                southStore.baseParams.params = " warninfoid ='"+selectUids+"'";
                southStoreReload();
            },
            rowdeselect : function (sm,index,rec){
                selectUids = '';
            }
        }
    })
    var columnModel = new Ext.grid.ColumnModel([
        {
            header : '主键',
            dataIndex:'uids',
            width:20,
            hidden:true
         },{
            header : '项目单位',
            dataIndex : 'pid',
            width :30,
            align : 'center',
            renderer : function (value){
               for(var i=0;i<unitTypeStore.getCount();i++){
                   if(value == unitTypeStore.getAt(i).get('unitid')){
                       return unitTypeStore.getAt(i).get('unitname');
                   }
               }
            }
         },{
         	
            header : '模块名称',
            width :50,
            dataIndex : 'moduleid',
            align : 'center',
            renderer : function (value){
            	for(var i=0;i<modeArr.length;i++){
            	    if(modeArr[i][0]==value){
            	        return modeArr[i][1]
            	    }
            	}
            }
         },{
            header : '预警规则名称',
            width : 30,
            dataIndex : 'moduleid',
            align : 'center',
            renderer : function (value){
                for(var m=0;m<rulesArr.length;m++){
                    if(rulesArr[m][0]==value){
                        return rulesArr[m][1];
                    }
                }
            }
         },{
            header :'处理状态',
            width : 30,
            dataIndex : 'warnstatus',
            align : 'center',
            renderer : function (value){
                if(value=='1'){
                   return '未开始';
                }else if(value =='2'){
                   return '处理中';
                }else if(value == '3'){
                   return '已完成';
                }
            }
         },{
            header : '预警生成时间',
            width : 20,
            dataIndex : 'warntime',
            align : 'center',
            renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
         }
    ]);
    var grid = new Ext.grid.GridPanel({
        title : '预警信息管理列表',
        id : 'north-grid',
        region : 'north',
        height : 300,
        width : 845,
	    store: store,
	    sm :selModel,
	    cm: columnModel,
	    iconCls: 'icon-show-all',
	    border: false,
	    layout: 'fit',
	    header: true,
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,			//加载时是否显示进度
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true,
	        enableRowBody:true,
	        showPreview:true,
	        getRowClass : function (rec,index,p,store){
	            if(this.showPreview){
	                p.body='<p style="color:red">'+rec.data.warncontent+"<a href='http://www.google.com'>详细功能模块地址</a>"+'</p>';
	                return 'x-grid3-row-expanded';
	            }
	            return 'x-grid3-row-collapsed';
	        }
	    },
	    tbar:[
	        {
	         text: '选择处理人',
	         iconCls:'add',
	         handler:PersonListView},'-',{
	         text :'关闭预警信息',
	         iconCls : 'select',
	         handler :closeWarnInfo
	        }
	    ],
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: store,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        listeners : {
            cellclick : function (grid,rowindex,columnIndex,e){
            		     var record = grid.getStore().getAt(rowindex);  // Get the Record
                         var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // Get field name
                         var data = record.get(fieldName);
                         if(typeof(data)!='undefined'){
                         var val=data.replace(/<br>/g, "\n");
                         if(fieldName=='warncontent'){
                         	lookDetail(val);
                         }
                         }

            }
        }
	});
	northReload();
	function northReload(){
	    store.load({params:{start : 0,limit : PAGE_SIZE}});
	}
	
	//查看预警信息详情
	function lookDetail(value){
			var win2 = new Ext.Window({
						width : 600,
						height : 300,
						layout : 'fit',
						modal : true,
						items : [new Ext.form.TextArea(
								{
									cls : 'codeField',
									readOnly : true,
									value : value

								})],
						buttonAlign : 'center',
						buttons : [{
									text : '关闭',
									handler : function() {
										win2
												.close();
									}
								}]
					});
			win2.show();		
	}
	
	var southSelModel =  new Ext.grid.CheckboxSelectionModel();
	var southColumnModel = new Ext.grid.ColumnModel([
	    {
	        id : 'uids',
	        header : '主键',
	        dataIndex : 'udis',
	        width : 30,
	        hidden : true
	    },{
	        id : 'senduserid',
	        header : '发送人',
	        dataIndex : 'senduserid',
	        width : 30,
	        renderer : function (val){
	            for(var i =0 ;i<perStore.getCount();i++){
	                if(val==perStore.getAt(i).get('userid')){
	                    return perStore.getAt(i).get('realname');
	                }
	            }
	        }
	    },{
	        id : 'sendtime',
	        header : '发送时间',
	        dataIndex : 'sendtime',
	        width : 30,
	        renderer : 
	            Ext.util.Format.dateRenderer('Y-m-d H:i:s')
	    },{
	        id : 'guidecomments',
	        header : '发送人意见',
	        dataIndex : 'guidecomments',
	        width : 30
	    },{
	        id : "dowithperson",
	        header : "接收人",
	        dataIndex : "dowithperson",
	        width : 30,
	        renderer : function (val){
	            for(var i =0 ;i<perStore.getCount();i++){
	                if(val==perStore.getAt(i).get('userid')){
	                    return perStore.getAt(i).get('realname');
	                }
	            }
	        }
	    },{
	        id : 'dowithtime',
	        header : "处理时间",
	        dataIndex : "dowithtime",
	        width : 30,
	        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
	    },{
	        id : 'comments',
	        header : '接收人处理意见',
	        dataIndex : 'comments',
	        width : 30
	    },{
	        id : "dowithtype",
	        header : "处理状态",
	        dataIndex : "dowithtype",
	        width : 30,
	        align : 'center',
	        hidden : false,
	        renderer : function (val){
	            if(val=='1'){
	                return "未处理"
	            }else {
	                return "已处理"
	            }
	        }
	    }
	])
	    southStore = new Ext.data.Store({
	    baseParams :{
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnDowithInfo',
            business :'baseMgm',
            method :'findwhereorderby',
            params : '1=1'
	        
	    },
	    proxy : new Ext.data.HttpProxy({
	        url : MAIN_SERVLET,
	        method : 'GET'
	    }),
	    reader : new Ext.data.JsonReader({
	        root : 'topics',
	        totalProperty : 'totalCount',
	        id : 'uids'
	     },[
	         {
	             name : 'uids' , type : 'string'
	         },{
	             name : 'pid' , type : 'string'
	         },{
	             name : 'warninfoid' , type : 'string'
	         },{
	             name : 'dowithtime' , type : 'date' , dateFormat : 'Y-m-d H:i:s'
	         },{
	             name : 'comments' , type : 'string'
	         },{
	             name : 'dowithperson', type : 'string'
	         },{
	             name : 'senduserid' , type : 'string'
	         },{
	             name : 'sendtime' , type : 'date' ,dateFormat: 'Y-m-d H:i:s'
	         },{
	             name : 'dowithtype', type : 'string'
	         },{ name : 'guidecomments' , type : 'string'}
	    ]),
	    remoteSort : true
	})
	southStore.setDefaultSort('sendtime','ASC');
	
	
    var southgrid = new Ext.grid.GridPanel({
        region : 'center',
        height :277,
        width :845,
	    store: southStore,
	    sm :southSelModel,
	    cm: southColumnModel,
        tbar: [],
        title: '预警处理流程记录',
        iconCls: 'icon-by-category',
        border: false,
        layout : 'fit', 
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: southStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
       
	});
	
	function southStoreReload(){
	    southStore.load({params:{start : 0,limit : PAGE_SIZE}});	
	}
	
	var panel = new Ext.Panel({
	    region :'center',
	    layout : 'border',
	    items :[grid,southgrid]
	})
	
    new Ext.Viewport({
        layout : 'border',
        border : false,
        items:[panel]
    })

    
    
    function buildWarnRules(){
        DWREngine.setAsync(false);
        PcWarnService.gengralWarnInfo(function(rtn){
            alert('成功进行预警生成');
        })
        DWREngine.setAsync(true);
        northReload();
    }
    //选择处理人及抄送人
    function selectPerson(){
        var rec = grid.getSelectionModel().getSelected();
        if(typeof(rec)=='undefined'){
            Ext.Msg.alert('提示信息','请选择需要分配的预警信息');
            return ;
        }
        //此处需要计算当前预警信息的责任人
        selectEd = rec.get('uids');
        if(!selectPersonWin){
            selectPersonWin = new Ext.Window({
                id : 'selectPersonWin',
                title : '分配处理人员',
                iconCls : 'form',
                width : 500,
                height : 350,
                modal : true,
                colseAction : 'hide',
                maximizable : false,
                resizable : true,
                autoScroll:true,
                plain: true,
                items: [doWidthFormPanel],
                listeners : {
                    hide : function (win){
                            win.hide();
                    }
                }
            })
        }
        selectPersonWin.show();
        doWidthFormPanel.getForm().findField('warninfoid').setValue(rec.get('uids'));
    }
 var personStore = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnDowithInfo',
            business : 'baseMgm',
            method :'findwhereorderby',
            params :  " warninfoid='"+selectEd+"'" 
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : 'uids'
        },[
            {name : 'uids', type : 'string'},
            {name : 'dowithperson', type : 'string'},
            {name : 'dowithunits', type : 'string'},
            {name : 'dowithtype' , type : 'string'},
            {name : 'comments', type : 'string'}
        ]),
        remoteSort : true
    });
    personStore.setDefaultSort('dowithtype',"ASC");
    
    var personSelModel = new Ext.grid.CheckboxSelectionModel({
    })
    var personColModel = new Ext.grid.ColumnModel([
        personSelModel,
        {
            id : 'uids',
            header : '主键',
            dataIndex : 'uids',
            width : 30,
            hidden : true
        },{
            id : 'dowithperson',
            header : '处理人',
            dataIndex : 'dowithperson',
            width : 30
        },{
            id : 'dowithunits',
            header : '处理人单位',
            dataIndex : 'dowithunits',
            width : 30
        },{
            id : 'dowithtype',
            header : '处理类型',
            dataIndex : 'dowithtype',
            width : 30,
            renderer : function (val){
              if(val=='1'){
                  return "处理权限";
              }
              if(val=='2'){
                  return "查询权限";
              }
              return val;
            }
        },{
            id : 'comments',
            header : '处理结果',
            dataIndex : 'comments',
            width : 30,
            renderer : function (val){
                if(val==''){
                    return "未处理";
                }else {
                    return "已处理";  
                }
            }
        }
    ])
    doWidthGrid = new Ext.grid.GridPanel({
        height : 300,
        width : 500,
        title : '已选择人员列表',
        sm : personSelModel,
        cm : personColModel,
        store : personStore,
        iconCls: 'icon-show-all',
        border: false,
        layout: 'fit',
        header: true,
        autoScroll: true,
        collapsible: false,	
        animCollapse: false,
        loadMask: true,	
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    tbar : [
	        {
	           text :'新增',
	           iconCls : 'add',
	           handler : selectPerson
	        },'-',{
	           text : '删除',
	           iconCls : 'remove',
	           handler : function (){
	           }
	        }
	    ],
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: personStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })	            
    })              
    personStore.load({params:{start : 0,limit : PAGE_SIZE}});
    //选择处理人
    function PersonListView(){
        var rec = grid.getSelectionModel().getSelected();
        if(typeof(rec)=='undefined'){
            Ext.Msg.alert('提示信息','请选择需要分配的预警信息');
            return ;
        }
        if(rec.get('warnstatus')=='3'){
            Ext.Msg.alert('提示信息','该预警信息已关闭!不能再分配责任人');
            return ;
        }
        var rtnStr=rec.get('dutypersoninfo');
        //DWREngine.setAsync(false);
       // PcWarnService.getDutyPersonAndTreeRootById(rec.get('uids'),function(rtn){
            //rtnStr=rtn;
       // })
        //DWREngine.setAsync(true);
        if(rtnStr==''){
            Ext.Msg.alert('提示信息','还没有分配责任人');
            return ;
        }
        var splitstr =rtnStr.split(',');
        if(splitstr[0]!=USERID){
            Ext.Msg.alert('提示信息','您不具备分配人员权限');
            return ;
        }
        cuserWindow.show(splitstr[2],splitstr[3],rec.get('pid'),rec.get('uids'),"", "", this);
    }
    var closeWarnPanel = new Ext.form.FormPanel({
        id :'closeWarnPanel',
        title : '填写预警关闭信息',
        width : 400,
        height : 250,
        frame : true,
        items : [
            {
                xtype : 'textfield',
                name : 'uids',
                fieldLabel : '主键',
                hidden : true,
                hideLabel : true
            },{
               xtype : 'textarea',
               name : 'warncompletion',
               fieldLabel : '填写结束意见',
               width : 250,
               height : 100
            }
        ],
        buttons : [
            {
                text : '保存',
                handler : function (){
                    var basicForm = closeWarnPanel.getForm();
                    var uids = basicForm.findField('uids').getValue();
                    if(uids==''){
                        Ext.Msg.alert('提示信息','未知异常!请重新选择');
                        return ;
                    }
                    var persons ='';
                    DWREngine.setAsync(false);
                    PcWarnService.checkNotDoWithPersons(uids,function(list){
                        persons = eval(list);
                    })
                    DWREngine.setAsync(true);
                    var saveFlag = false;//保存时的权
                    if(persons!=''){
                        Ext.MessageBox.show({
                            title:'Save Changes?',
                            msg: '以下人员未处理：'+persons+',确定关闭信息吗？',
                            buttons: Ext.MessageBox.YESNOCANCEL,
                            fn: function (btn){
                                if(btn=='yes'){
                                    var warncompletion = basicForm.findField('warncompletion').getValue();
                                    var obj = new Object();
                                    obj.uids=uids;
                                    obj.warncompletion = warncompletion;
                                    DWREngine.setAsync(false);
                                    PcWarnService.closePcWarnInfo(obj,function(rtn){
                                       // alert(rtn);
                                    })
                                    DWREngine.setAsync(true);
                                    closeWarnPanel.getForm().reset();
                                    closeWarnWin.hide();
                                    northReload();
                                    
                                }else{
                                    closeWarnPanel.getForm().reset();
                                     saveFlag = false;
                                    closeWarnWin.hide();
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    }else {
                       saveFlag = true;
                    }
                    if(saveFlag){
                        var warncompletion = basicForm.findField('warncompletion').getValue();
                        var obj = new Object();
                        obj.uids=uids;
                        obj.warncompletion = warncompletion;
                        DWREngine.setAsync(false);
                        PcWarnService.closePcWarnInfo(obj,function(rtn){
                        })
                        DWREngine.setAsync(true);
                        closeWarnPanel.getForm().reset();
                        closeWarnWin.hide();
                        northReload();
                    }
                }
            },{
               text : '取消',
               handler : function (){
                   closeWarnPanel.getForm().reset();
                   closeWarnWin.hide();
               }
            }
        ]
    })
    function closeWarnInfo(){
        var rec = grid.getSelectionModel().getSelected();
        if(typeof(rec)=='undefined'){
            Ext.Msg.alert('提示信息','请选择需要关闭的预警信息');
            return ;
        }
        if(rec.get('warnstatus')=='3'){
            Ext.Msg.alert('提示信息','该预警信息已关闭');
            return ;
        }
        var rtnStr=rec.get('dutypersoninfo');
        
        //DWREngine.setAsync(false);
        //PcWarnService.getDutyPersonAndTreeRootById(rec.get('uids'),function(rtn){
            //rtnStr=rtn;
        //})
        //DWREngine.setAsync(true);
        if(rtnStr==''){
            Ext.Msg.alert('提示信息','还没有分配责任人');
            return ;
        }
        var splitstr =rtnStr.split(',');
        if(splitstr[0]!=USERID){
            Ext.Msg.alert('提示信息','您不具备关闭该预警信息权限');
            return ;
        }
        if(!closeWarnWin){
            closeWarnWin = new Ext.Window({
                title : '关闭预警信息',
                id : 'closeWarnWin',
                iconCls : 'form',
                closeAction : 'hide',
                width : 400,
                height : 300,
                modal : true,
                maximizable: true,
                items : [closeWarnPanel],
                listeners : {
                    hide : function (win){
                        closeWarnPanel.getForm().reset();
                        win.hide();
                    }
                }
            });
        }
        closeWarnWin.show();
        closeWarnPanel.getForm().loadRecord(rec);        
    }            
})