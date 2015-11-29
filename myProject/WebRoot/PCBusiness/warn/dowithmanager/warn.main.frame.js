var searchGridPanel ;
var dowidthGridPanel ;
var searchWin;//查询填写意见
var unitType = new Array();//项目单位
var personArr = new Array();//人员列表
var rulesArr = new Array(); //规则列表
var modeArr = new Array(); //模块列表
var searchUids;
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
        temp.push(list[i].moduleid);
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
Ext.onReady(function (){
    //项目单位列表
    var simpleUnitStore = new Ext.data.SimpleStore({
        fields : ['unitid','unitname'],
        data : unitType
    })
    
    var simpleUserStore = new Ext.data.SimpleStore({
        fields : ['userid','realname'],
        data : personArr
    })
    var searchSelModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    })
    var searchColModel = new Ext.grid.ColumnModel([
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
            align : 'center',
            renderer : function (value){
                for(var i=0;i<modeArr.length;i++){
                    if(modeArr[i][0]==value){
                        return modeArr[i][1];
                    }
                }
            
            },
            width : 50
        },{
            header : '预警规则名称',
            width : 60,
            align : 'center',
            dataIndex : 'moduleid',
            renderer : function (value){
                for(var i=0;i<rulesArr.length;i++){
                    if(rulesArr[i][0]==value){
                        return rulesArr[i][1];
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
                    return "已完成"
                }
            }
        },{
            header : '预警生成时间',
            width : 30,
            dataIndex : 'warntime',
            renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
        }
    ])
    
    var searchStore = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnInfo',
            business : 'PcWarnService',
            method : 'getPcWarnInfoByUserid',
            params : "userid`"+USERID+";type`search;othertype`1"
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
                 name : 'uids', type : 'string'   
             },{
                 name : 'pid', type : 'string'
             },{
                 name : 'warntime', type : 'date',dateFormat: 'Y-m-d H:i:s'
             },{
                 name : 'moduleid', type : 'string'
             },{
                 name : 'warncontent' , type : 'string'
             },{
                 name : 'warnlevel' , type : 'string'
             },{
                 name : 'warnstatus', type : 'string'
             },{
                 name : 'warncompletion' , type : 'string'
             },{
                 name : 'detailinfo' , type : 'string'
             }
         ]
        )
    })
    var btn = new Ext.Button({
         text : '标记为已阅',
                id : 'look',
                iconCls : 'option',
                handler : searchWarnInfo
    })
    
    //设置查询条件
    var comSearch = new Ext.form.ComboBox({
         name : 'searchType',
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
	          	    btn.disable();
	          	}else {
	          	    btn.enable();
	          	}
	             searchStore.baseParams.params="userid`"+USERID+";type`search;othertype`"+rec.get('k');
	             searchStoreLoad();
	          }
	       }
    })
    comSearch.setValue('1');
    
    searchGridPanel = new Ext.grid.GridPanel({
        id : 'search-grid',
        region : 'center',
        height : 300,
        width : 1200,
        store : searchStore,
        sm : searchSelModel,
        cm : searchColModel,
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
	                p.body='<p style="color:red">'+rec.data.warncontent+"<a href='http://www.google.com'>详细功能模块地址</a>"+'</p>';
	                return 'x-grid3-row-expanded';
	            }
	            return 'x-grid3-row-collapsed';
	        }              
        },
        tbar :[
            btn,'-',comSearch
        ],
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: searchStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        listeners : {
        }
    })
    searchStoreLoad();
    function searchStoreLoad(){
        searchStore.load({params :{start : 0, limit :PAGE_SIZE}});
    }    
    var tabpanel = new Ext.TabPanel({
        activeTab : 0,
        deferredRender : true,
        height : 240,
        minSize : 100,
        maxSize : 460,
        plain : true,
        border : false,
        region : 'center',
        forceFit : true,
        items :[
           {
                title : '分派给我处理的事项',
                iconCls : 'option',
                layout : 'fit',
                autoLoad : {
                    url : BASE_PATH+"PCBusiness/warn/dowithmanager/dispather.jsp",
                    params: 'type=dowith',
                    text : 'loading...'
                }
            }, 
            	{
                title : '分派给我查阅的事项',
                iconCls: 'title',
                layout : 'fit',
                items : [searchGridPanel]
            },{
            	title :'我负责的事项',
            	iconCls :'option',
            	layout:'fit',
            	autoLoad:{
            		url:BASE_PATH+"PCBusiness/warn/dowithmanager/dispather.jsp",
            		params:"type=manager",
            		text:'loading'
            	}
            
            }
        ]
    })
    var viewport = new Ext.Viewport({
        layout : 'border',
        border : false,
        items :[tabpanel]
    })
    
    var searchpanel = new Ext.FormPanel({
        title : '填写查询意见',
        id : 'searchpanel',
        width : 400,
        height : 150,
        frame : true,
        items : [
            {
                xtype : 'textarea',
                name : 'comments',
                fieldLabel : '查询意见',
                allowBlank : false,
                width : 200,
                height : 100
            }
        ],
        buttons : [
            {
                text : '保存',
                handler : function (){
                    var form = searchpanel.getForm();
                    if(form.isValid()){
                        if(searchUids==''){
                            Ext.Msg.alert('提示信息','未知异常!请重新填写');
                            return ;
                        }
                        var obj = new Object();
                            obj.uids=searchUids;
                            obj.comments=form.findField('comments').getValue();
                            DWREngine.setAsync(false);
                            PcWarnService.searchCommentsBySelf(obj,function(rtn){
                            })
                            DWREngine.setAsync(true);
                            searchpanel.getForm().reset();
                            searchUids='';
                            searchpanel.hide();
                    }
                }
            },{
                text : '取消',
                handler : function (){
                    searchpanel.getForm().reset();
                    doWithWin.hide();
                }
            }
        ]
    })
    function searchWarnInfo(){
    	var recs=searchGridPanel.getSelectionModel().getSelections();
        if(recs.length==0){
        	Ext.Msg.alert('提示信息','请选择一条需要标记的记录')
        	return;
        }
        var str ='';
        for(var i=0;i<recs.length;i++){
            var rec = recs[i];
            str+=rec.get('uids');
            if(i<recs.length-1){
              str+=",";
            }
        }
        Ext.Msg.confirm('提示信息','是否确定标记已读?',function (ren){
         if(ren=='yes'){
        DWREngine.setAsync(false);
        PcWarnService.markRead(str,USERID,function (){
        });
        DWREngine.setAsync(true);
        searchStore.reload();
         }
        }, this);
//        var rec = searchGridPanel.getSelectionModel().getSelected();
//        if(typeof(rec)=='undefined'){
//            Ext.Msg.alert('提示信息','请选择预警信息');
//            return ;
//        }
//        if(rec.get('warnstatus')==3){
//            Ext.Msg.alert('提示信息','该预警信息已关闭!');
//            return ;
//        }
//        var searchtype='';
//        DWREngine.setAsync(false);
//        baseDao.findByWhere2("com.sgepit.pcmis.warn.hbm.PcWarnSearchInfo","warninfoid='"+rec.data.uids+"' and searchperson='"+USERID+"'",function(list){
//            for(var i=0;i<list.length;i++){
//                var info =list[i];
//                searchtype = info.searchtype;
//                searchUids = info.uids;
//                break;
//            }
//        })
//        DWREngine.setAsync(true);
//        if(searchtype!='1'){
//            Ext.Msg.alert('提示信息','您已经填写过查询意见');
//            return ;
//        }
//        if(!searchWin){
//            searchWin = new Ext.Window({
//                id : 'searchWin',
//                title : '处理查询意见',
//                iconCls : 'form',
//                closeAction : 'hide',
//                width : 400,
//                height : 200,
//                modal : true,
//                maximizable: true,
//                items : [searchpanel],
//                listeners : {
//                    hide : function (win){
//                        searchpanel.getForm().reset();
//                        win.hide();
//                    }
//                }              
//            })
//        }
//        searchWin.show();
        
    }
})