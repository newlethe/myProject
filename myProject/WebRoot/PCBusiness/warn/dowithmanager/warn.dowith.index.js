var dowidthGridPanel ;
var doWithWin;//自己处理
var unitType = new Array();//项目单位
var personArr = new Array();//人员列表
var dowithUids='';//反馈意见的Id
var modeArr = new Array(); //模块名称
var rulesArr = new Array(); //获取组织结构
//获取组织机构
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
//获取预警规则名称
DWREngine.setAsync(false);
baseDao.findByWhere2("com.sgepit.pcmis.warn.hbm.PcWarnRules","1=1",function(list){
    for(var i=0;i<list.length;i++){
        var temp = new Array();
        temp.push(list[i].uids);
        temp.push(list[i].warnrulename);
        rulesArr.push(temp);
    }
})
DWREngine.setAsync(true);
//获取预警模块名称
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
    //项目单位列表
    var simpleUnitStore = new Ext.data.SimpleStore({
        fields : ['unitid','unitname'],
        data : unitType
    })
    
    var simpleUserStore = new Ext.data.SimpleStore({
        fields : ['userid','realname'],
        data : personArr
    })
    var dowithSelModel = new Ext.grid.CheckboxSelectionModel({
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
    var dowithColModel = new Ext.grid.ColumnModel([
        {
            header : '主键',
            width : 20,
            dataIndex : 'uids',
            hidden : true
        },{
            header : '项目单位',
            dataIndex : 'pid',
            width : 30,
            align : 'center',
            renderer : function (val){
                for(var i =0;i<simpleUnitStore.getCount();i++){
                    if(val == simpleUnitStore.getAt(i).get('unitid')){
                        return simpleUnitStore.getAt(i).get('unitname');
                    }
                }
            } 
        },{
            header : '模块名称',
            dataIndex : 'moduleid',
            width : 50,
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
            dataIndex : 'warnrulesid',
            align : 'center',
            renderer : function (value){
                for(var m=0; m<rulesArr.length; m++){
                    if(rulesArr[m][0]==value){
                        return rulesArr[m][1];
                    }
                }
            }
        },{
            header : '处理状态',
            dataIndex : 'warnstatus',
            width : 30,
            align : 'center',
            renderer : function (val){
                if('1'==val){
                    return "未开始"
                }else if('2'==val){
                    return "处理中"
                }else if('3'==val){
                    return "已处理"
                }
            }
        },{
            header : '预警生成时间',
            width : 30,
            dataIndex : 'warntime',
            align : 'center',
            renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
        }
    ])
    
        dowithStore = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnInfo',
            business : 'PcWarnService',
            method : 'getPcWarnInfoByUserid',
            params : "userid`"+USERID+";type`dowith;othertype`1"
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
             {name : 'uids', type : 'string'},
             {name : 'pid', type : 'string'},
             {name : 'warntime', type : 'date',dateFormat: 'Y-m-d H:i:s'},
             {name : 'moduleid', type : 'string'},
             {name : 'warncontent' , type : 'string'},
             {name : 'warnlevel' , type : 'string'},
             {name : 'warnstatus', type : 'string'},
			 {name : 'warncompletion' , type : 'string'},
			 {name : 'detailinfo' , type : 'string'},
			 {name : 'warnrulesid', type : 'string' },
             {name :'dutypersoninfo',type:'string'}
         ]
        )
    })
    
    var otherdo = new Ext.Button({
         text : '分配他人处理',
         iconCls : 'option',
         handler : sendPersonList
    });
    var doBtn = new Ext.Button({
        text : '填写处理意见处理',
        iconCls : 'option',
        handler : doWithWarnInfo
    })
    
    //设置查询条件
    var comSearch = new Ext.form.ComboBox({
         name : 'dowithType',
         fieldLabel : '查询状态',
	       anchor : '95%',
	       valueField : 'k',
	       displayField : 'v',
	       typeAhead : true,
	       allowBlank : false,
	       readOnly : true,
	       mode : 'local',
	       triggerAction : 'all',
	       lazyRender:true,
	       listClass : 'x-combo-list-small',
	       store : new Ext.data.SimpleStore({
	           fields : ['k','v'],
	           data : [['1','未处理'],['2','已处理'],['3','全部']]
	       }),
	       listeners : {
	          select : function (com, rec,index){
	          	if(rec.get('k')=='2'){
	          	    doBtn.disable();
	          	    otherdo.disable();
	          	    
	          	}else {
	          	    doBtn.enable();
	          	    otherdo.enable();
	          	}
	             dowithStore.baseParams.params="userid`"+USERID+";type`dowith;othertype`"+rec.get('k');
	             dowithStoreLoad();
	          }
	       }
    })
    comSearch.setValue('1');
    
    dowidthGridPanel = new Ext.grid.GridPanel({
        id : 'search-grid',
        region : 'north',
        height : 260,
        width : 1040,
        store : dowithStore,
        sm : dowithSelModel,
        cm : dowithColModel,
        iconCls: 'icon-show-all',
        border: false,
        layout : 'fit',
        header: false,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        loadMask: true,	
        trackMouseOver:true,
        viewConfig : {
            forceFit : true,
            ignoreAdd : true,
	        enableRowBody:true,
	        showPreview:true,
	        getRowClass : function (rec,index,p,store){
	            if(this.showPreview){
//	                p.body='<p style="color:red">'+rec.data.warncontent+"<a href='http://www.google.com'>详细功能模块地址</a>"+'</p>';
	            	p.body='<p style="color:red">'+rec.data.warncontent+'</p>'
	                return 'x-grid3-row-expanded';
	            }
	            return 'x-grid3-row-collapsed';
	        }            
        },
        tbar :[
            otherdo,'-',doBtn,'-',comSearch
        ],
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dowithStore,
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
    })
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
    dowithStoreLoad();
    function dowithStoreLoad(){
        dowithStore.load({params :{start : 0, limit :PAGE_SIZE}});
    }    
    
	var southSelModel =  new Ext.grid.CheckboxSelectionModel();
	var southColumnModel = new Ext.grid.ColumnModel([
	    {
	        id : 'uids',
	        header : '主键',
	        dataIndex : 'udis',
	        width : 30,
	        align : 'center',
	        hidden : true
	    },{
	        id : 'senduserid',
	        header : '发送人',
	        align : 'center',
	        dataIndex : 'senduserid',
	        width : 30,
	        renderer : function (val){
	            for(var i =0 ;i<simpleUserStore.getCount();i++){
	                if(val==simpleUserStore.getAt(i).get('userid')){
	                    return simpleUserStore.getAt(i).get('realname');
	                }
	            }
	        }
	    },{
	        id : 'sendtime',
	        header : '发送时间',
	        align : 'center',
	        dataIndex : 'sendtime',
	        width : 30,
	        renderer : 
	            Ext.util.Format.dateRenderer('Y-m-d H:i:s')
	    },{
	        id : 'guidecomments',
	        header : '发送人意见',
	        align : 'center',
	        dataIndex : 'guidecomments',
	        width : 30
	    },{
	        id : "dowithperson",
	        header : "接收人",
	        align : 'center',
	        dataIndex : "dowithperson",
	        width : 30,
	        renderer : function (val){
	            for(var i =0 ;i<simpleUserStore.getCount();i++){
	                if(val==simpleUserStore.getAt(i).get('userid')){
	                    return simpleUserStore.getAt(i).get('realname');
	                }
	            }
	        }
	    },{
	        id : 'dowithtime',
	        header : "处理时间",
	        align : 'center',
	        dataIndex : "dowithtime",
	        width : 30,
	        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
	    },{
	        id : 'comments',
	        header : '接收人处理意见',
	        align : 'center',
	        dataIndex : 'comments',
	        width : 30
	    },{
	        id : "dowithtype",
	        header : "处理状态",
	        align : 'center',
	        dataIndex : "dowithtype",
	        width : 30,
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
    
	
    new Ext.Viewport({
        layout : 'border',
        border : false,
        items:[dowidthGridPanel,southgrid]
    })    
    
    
    
    function sendPersonList(){
        var rec = dowidthGridPanel.getSelectionModel().getSelected();
        if(typeof(rec)=='undefined'){
            Ext.Msg.alert('提示信息','请选择要反馈的预警信息');
            return ;
        }
        if(rec.get('warnstatus')==3){
            Ext.Msg.alert('提示信息','该预警信息已关闭！');
            return ;
        }
        //查看该预警信息个人是否已经处理完毕
                var dowithtype='';
        DWREngine.setAsync(false);
        baseDao.findByWhere2("com.sgepit.pcmis.warn.hbm.PcWarnDowithInfo","warninfoid='"+rec.data.uids+"' and dowithperson='"+USERID+"'",function(list){
            for(var i=0;i<list.length;i++){
                var info =list[i];
                dowithtype = info.dowithtype;
                dowithUids = info.uids;
                break;
            }
        })
        DWREngine.setAsync(true);
        if(dowithtype=='2'){
            Ext.Msg.alert('提示信息','您已经处理过!不能重复处理');
            return ; 
        }
        //获取计算当前人员是否有下属单位
        var res='';
        var currnetUserUnitid='';
        var currentUserUnitName='';
        DWREngine.setAsync(false);
        PcWarnService.calSendUserdoWithInfo(USERID,function(rtn){
            res = rtn.split(',')[0];
            currnetUserUnitid = rtn.split(',')[1];
            currentUserUnitName = rtn.split(',')[2];
        })
        DWREngine.setAsync(true);
//      alert(currnetUserUnitid+"....."+currentUserUnitName);
        //if(res=='0'){
           // Ext.Msg.alert('提示信息','未知错误');
            //return ;
        //}
        cuserWindow.show(currnetUserUnitid,currentUserUnitName,rec.get('pid'),rec.get('uids'),"", "", this); 
    }
    var dowithFormPanel = new Ext.form.FormPanel({
        title : '填写处理意见',
        width : 400,
        height : 150,
        frame : true,
        items : [
            {
                xtype : 'textarea',
                name : 'comments',
                fieldLabel : '处理意见',
                allowBlank : false,
                width : 200,
                height : 100
            }
        ],
        buttons : [
            {
                text : '保存',
                handler : function (){
                    var form = dowithFormPanel.getForm();
                    if(form.isValid()){
                        if(dowithUids==''){
                            Ext.Msg.alert('提示信息','未知异常!请重新填写');
                            return ;
                        }
                        var obj = new Object();
                            obj.uids=dowithUids;
                            obj.comments=form.findField('comments').getValue();
                            DWREngine.setAsync(false);
                            PcWarnService.dowithCommentsBySelf(obj,function(rtn){
                                
                            })
                            DWREngine.setAsync(true);
                            dowithFormPanel.getForm().reset();
                            dowithUids='';
                             var rec = dowidthGridPanel.getSelectionModel().getSelected();
                             if(typeof(rec)=='undefined'){
                                 return ;
                             }
//                          dowithStore.baseParams.params="userid`"+USERID+";type`dowith;othertype`"+rec.get('k');
//	                        dowithStoreLoad();
                            southStore.baseParams.params = " warninfoid ='"+rec.get('uids')+"'";
                            southStore.load({params:{start : 0,limit :PAGE_SIZE}});
                            doWithWin.hide();
                    }
                }
            },{
                text : '取消',
                handler : function (){
                    dowithFormPanel.getForm().reset();
                    doWithWin.hide();
                }
            }
        ]
    })
    function doWithWarnInfo(){
        var rec = dowidthGridPanel.getSelectionModel().getSelected();
        if(typeof(rec)=='undefined'){
            Ext.Msg.alert('提示信息','请选择要反馈的预警信息');
            return ;
        }
        var dowithtype='';
        DWREngine.setAsync(false);
        baseDao.findByWhere2("com.sgepit.pcmis.warn.hbm.PcWarnDowithInfo","warninfoid='"+rec.data.uids+"' and dowithperson='"+USERID+"'",function(list){
            for(var i=0;i<list.length;i++){
                var info =list[i];
                dowithtype = info.dowithtype;
                dowithUids = info.uids;
                break;
            }
        })
        DWREngine.setAsync(true);
        if(dowithtype!='1'){
            Ext.Msg.alert('提示信息','您已经处理过!不能重复处理');
            return ; 
        }
        if(!doWithWin){
            doWithWin = new Ext.Window({
                title : '处理填写意见',
                iconCls : 'form',
                closeAction : 'hide',
                width : 400,
                height : 200,
                modal : true,
                maximizable: true,
                items : [dowithFormPanel],
                listeners : {
                    hide : function (win){
                        dowithFormPanel.getForm().reset();
                        win.hide();
                    }
                }
            })
        }
        doWithWin.show();
    }    
})	 