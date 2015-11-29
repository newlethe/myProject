var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsArrival"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"

var beanSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsArrivalSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"

var selectTreeid = "";
var selectUuid = "";
var selectConid = "";
var selectParentid = "";
var selectWin;
var gridPanel;

var csnoArr = new Array();
var sendArr = new Array();
var packArr = new Array();
var dumpArr = new Array();
var boxArr = new Array();
var jzArr = new Array();
var equWareArr = new Array();
var billStateArr = new Array();
var businessType = "zlMaterial";

var ds;
var dsSub;

Ext.onReady(function(){
	
	var currentPid = CURRENTAPPID;
	DWREngine.setAsync(false);
	systemMgm.getUnitById(CURRENTAPPID, function(u) {
		if(u && u!=null && u!='null') {
			currentPid = u.upunit;
		}
	});
	
	//设备供货厂家，合同管理中乙方单位
	var sql = "select uids,csmc from sb_csb where isused = '1' union all " +
			" select t.cpid uids,t.partyb csmc from CON_PARTYB t where t.PID='"+currentPid+"'";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);		
			csnoArr.push(temp);			
		}
	});
	//运输方式
	appMgm.getCodeValue("运输方式",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			sendArr.push(temp);			
		}
	});
	//包装方式
	var sql = "select puuid,packstyle from Equ_Pack_Style";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			packArr.push(temp);			
		}
	});
	//卸车方式
	appMgm.getCodeValue("卸车方式",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			dumpArr.push(temp);			
		}
	});
	//箱件类别
	appMgm.getCodeValue("箱件类别",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			boxArr.push(temp);			
		}
	});
	//机组号
	appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			jzArr.push(temp);			
		}
	});
	//处理设备仓库下拉框
    var typeArr = new Array();
    baseMgm.getData("select wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
                    + "' and parent='01' order by equid ", function(list){
	         for (var i = 0; i < list.length; i++) {
	            var temp = new Array();
	            temp.push(list[i][0]);
	            temp.push(list[i][1]);
	            typeArr.push(temp);
	        }
	    }); 
	 baseMgm.getData("select uids,equid,wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
	                    + "' order by equid ", function(list) {
	        for (var i = 0; i < list.length; i++) {
	            var temp = new Array();
	            temp.push(list[i][0]);
	            temp.push(list[i][1]);
	            temp.push(list[i][2]);
	            for(var j=0;j<typeArr.length;j++){
	                if(list[i][3] == typeArr[j][1]){
	                    temp.push(typeArr[j][0]);
	                }
	            }
	//            if(list[i][3]=="SBCK")
	//                temp.push("设备仓库");
	//            else if(list[i][3]=="CLCK")
	//                temp.push("材料仓库")
	//            else if(list[i][3]=="JGCK")
	//                temp.push("建管仓库")
		          equWareArr.push(temp);
	           
	        }
	    });
    
    //流程审批状态
    appMgm.getCodeValue('流程状态',function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            billStateArr.push(temp);   
        }
    });
    DWREngine.setAsync(true);
	var csnoDs = new Ext.data.SimpleStore({
		fields: ['k', 'v'],   
		data: csnoArr
    });
    var sendDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: sendArr
    });
    var packDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: packArr
    });
    var dumpDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: dumpArr
    });
    var boxDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: boxArr
    });
    var jzDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: jzArr
    });
	
	var addBtn = new Ext.Button({
		id : 'addBtn',
		text : '新增',
		iconCls : 'add',
		handler : addOrEditArrival
	});
	var editBtn = new Ext.Button({
		id : 'editBtn',
		text : '修改',
		iconCls : 'btn',
		handler : addOrEditArrival
	});
	var delBtn = new Ext.Button({
		text : '删除',
		iconCls : 'remove',
		handler : deleteArrival
	});
    
    //TODO: ==设置短信接受人==
    //设置到货通知单短信接受人
    var beanUser = "com.sgepit.frame.sysman.hbm.RockUser"
	var businessUser = "baseMgm"
	var listMethodUser = "findWhereOrderby"
	var primaryKeyUser = "userid"
	var orderColumnUser = "realname"
    //按用户选择
    var selectUnitRoot = new Ext.tree.AsyncTreeNode({
          text: defaultOrgRootName,
          id: defaultOrgRootID,
          expanded: true
    })
    
    var selectUnitPanel =  new Ext.tree.TreePanel({
        id: 'selectUnitPanel',
        region: 'west',
        width : 260,
        autoScroll : true,
        lines : true,
        animate : false,
        rootVisible : true,
        border : false,
        frame: false,
        header: false, 
        tbar: [{
            iconCls: 'icon-expand-all',
            tooltip: '全部展开',
            handler: function(){ selectUnitRoot.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ selectUnitRoot.collapse(true); }
        }],
        loader:new Ext.tree.TreeLoader({
            dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
            requestMethod: "GET",
            baseParams:{
                parentId:defaultOrgRootID,
                ifcheck: true,
                ac:"buildingUnitTree",
                ifcheck : false,
                baseWhere:"unitTypeId is not null"
            },
            clearOnLoad: true,
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),
        root:selectUnitRoot,
        columns:[{
            header: CURRENTAPPNAME,
            width: 220,
            dataIndex: 'unitid',
            renderer: function(value){
                return "<div id='equno'>"+value+"</div>";  }
        },{
            header : '是否子节点',
            dataIndex: 'isleaf',
            width: 0,
            renderer: function(value){
                return "<div id='isleaf'>"+value+"</div>";  }
        },{
            header : '父节点',
            dataIndex: 'upunit',
            width: 0,
            renderer: function(value){
                return "<div id='upunit'>"+value+"</div>";  }
        }],  
        listeners:{
            beforeload:function(node){
                node.getOwnerTree().loader.baseParams.parentId = node.id; 
            },
            click : function(node){
                if(node.id == defaultOrgRootID){
                    dsUser.baseParams.params = "userstate = '1' and mobile is not null";
                }else{
                    dsUser.baseParams.params = "userstate = '1' and mobile is not null and deptId = '"+node.id+"'";
                }
                dsUser.load({params:{start:0,limit:10}})
            }
        }
    });
    
    var smUser = new Ext.grid.CheckboxSelectionModel({
        singleSelect : false
    });
    var fcUser = {
        'userid' : {name : 'userid', fieldLabel : '主键'},
        'realname' : {name : 'realname', fieldLabel : '姓名'}
    }

    var cmUser = new Ext.grid.ColumnModel([ // 创建列模型
        smUser,
        new Ext.grid.RowNumberer({
            header : '序号',
            width : 35
        }),
        {
            id : 'userid',
            header : fcUser['userid'].fieldLabel,
            dataIndex : fcUser['userid'].name,
            hidden : true
        }, {
            id : 'realname',
            header : fcUser['realname'].fieldLabel,
            dataIndex : fcUser['realname'].name,
            width : 180
        }
    ]);
    cmUser.defaultSortable = true;

    var ColumnsUser = [
        {name: 'userid', type: 'string'},
        {name: 'realname', type: 'string'}
    ];

    var dsUser = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : beanUser,
            business : businessUser,
            method : listMethodUser,
            params : "userstate = '1'"
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : primaryKeyUser
        }, ColumnsUser),
        remoteSort : true,
        pruneModifiedRecords : true
    });
    dsUser.setDefaultSort(orderColumnUser, 'asc');
    
    var userPanel = new Ext.grid.GridPanel({
        ds : dsUser,
        cm : cmUser,
        sm : smUser,
        tbar:['-',{
            text : '设置完成',
            iconCls: 'save',
            handler : function(){
                setSmsUserWin.hide();
            }
        }],
        header: false,
        border: false,
        region: 'center',
        stripeRows:true,
        loadMask : true,
        viewConfig: {
            forceFit: true,
            ignoreAdd: true
        },
        bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 10,
            store: dsUser,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
    });
    //function(SelectionModel this, Number rowIndex, Ext.data.Record r)
    function setSmsUserFun(s,i,r,t){
    	if(t != 1) return;
        var arrivalid = sm.getSelected().get("uids");
        var userid = r.get("userid");
        var bool = s.isSelected(r);
        DWREngine.setAsync(false);
        //勾选后立即设置
        wzbaseinfoMgm.setWzSmsUserFun(arrivalid,userid,bool,function(str){
            if(str == "1"){
                //Ext.example.msg('提示信息','短信提醒设置成功！');
            }else{
                Ext.example.msg('提示信息','操作出错！');
            }
        });
        DWREngine.setAsync(true);
    }
    smUser.on('rowselect',function(s,i,r){
    	var t = 0;
    	//setSmsUserWin显示出来的时候，才进行勾选后的设置
    	if(!setSmsUserWin.hidden)
    		t = 1;
    	setSmsUserFun(s,i,r,t);
    });
    smUser.on('rowdeselect',function(s,i,r){
    	var t = 0;
    	if(!setSmsUserWin.hidden)
    		t = 1;
    	setSmsUserFun(s,i,r,t);
    });
    
    dsUser.on('load', function(s, r, o) {
        if(sm.getSelected()!=null){
	        DWREngine.setAsync(false);
	        var arr = new Array();
		    var sql = "select userid from wz_goods_arrival_sms_user where arrivalid='"+sm.getSelected().get("uids")+"'";
		    baseDao.getData(sql,function(list){
		        for(i = 0; i < list.length; i++) {
		            var temp = new Array();
		            arr.push(list[i]);  
		        }
		    });
	        DWREngine.setAsync(true);
	        s.each(function(rec) {
                for (var i = 0; i < arr.length; i++) {
                    if (rec.get("userid")==arr[i]) {
	                    smUser.selectRecords([rec], true);
                        continue;
	                }
                }
	        });
        }
    })
    
    var setSmsUserWin;
    var smsUserBtn = new Ext.Button({
        text : '选择短信提醒人',
        iconCls : 'orangeUser',
        handler : function(){
            var record = sm.getSelected();
	        if(record == null){
	            Ext.example.msg('提示信息','请先选择一条到货信息！');
	            return ;
	        }
	        if(!setSmsUserWin){
	            setSmsUserWin = new Ext.Window({
	                width : 650,
	                height : 380,
	                modal: true, 
	                plain: true, 
	                border: false, 
                    closeAction : 'hide',
                    layout: 'border',
	                resizable: false,
	                items : [selectUnitPanel,userPanel],
	                listeners : {
	                    'hide' : function(){
	                    	smUser.clearSelections();
                            ds.load({params:{start:0,limit:PAGE_SIZE}})
	                    },
	                    'show' : function(){
                            dsUser.load({params:{start:0,limit:10}})
	                    }
	                }
	            });
	        }
	        setSmsUserWin.show();
        }
    });
    
    // TODO : ======到货单主表======
    var fm = Ext.form;
	var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isOpen' : {name : 'isOpen',fieldLabel : '是否开箱'},
		'dhNo' : {name : 'dhNo',	fieldLabel : '到货批号'},
		'dhDate' : {name : 'dhDate',fieldLabel : '到货日期'},
		'dhShi' : {name : 'dhShi',fieldLabel : '时'},
        'dhFen' : {name : 'dhFen',fieldLabel : '分'},
		'dhDesc' : {name : 'dhDesc',fieldLabel : '到货描述'},
		'csno' : {name : 'csno',fieldLabel : '供货厂家'},
		'receiveUser' : {name : 'receiveUser',fieldLabel : '接货人'},
		'boxNum' : {name : 'boxNum',fieldLabel : '箱件数量'},
		'totalWeight' : {name : 'totalWeight',fieldLabel : '总重量（KG）'},
		'sendType' : {name : 'sendType',fieldLabel : '运输方式'},
		'carNo' : {name : 'carNo',fieldLabel : '车牌号'},
		'dumpType' : {name : 'dumpType',fieldLabel : '卸车方式'},
		'dumpUnit' : {name : 'dumpUnit',fieldLabel : '卸车单位'},
		'recordUser' : {name : 'recordUser',fieldLabel : '录单人'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
        'fileList' : {name : 'fileList',fieldLabel : '附件'},
        'billState' : {name : 'billState',fieldLabel : '审批状态'},
        'flowid' : {name : 'flowid',fieldLabel : '流程编号'},
        'joinUnit' : {name : 'joinUnit',fieldLabel : '参与交接单位'},
        'joinPlace' : {name : 'joinPlace',fieldLabel : '交接地点'},
        'setUser' : {name : 'setUser',fieldLabel : '短信提醒'},
        
        'singleMaxWeight' : {name : 'singleMaxWeight',fieldLabel : '单体最重（吨）'},
        'volume' : {name : 'volume',fieldLabel : '体积'},
        'carrierPhoto' : {name : 'carrierPhoto',fieldLabel : '承运人电话'},
        'dhNoticeNo' : {name : 'dhNoticeNo',fieldLabel : '到货通知单编号'+requiredMark,allowBlank : false},
        'actualTime' : {name : 'actualTime' ,fieldLabel:'实际到货时间',readOnly : true,width : 200,format: 'Y-m-d'},
		'dhHandoverNo' : {name : 'dhHandoverNo',fieldLabel : '到货交接单编号'+requiredMark,allowBlank : false}
        
        ,'createMan':{name : 'createMan',fieldLabel : '创建人'}
        ,'createUnit':{name : 'createUnit',fieldLabel : '创建单位'}
	}
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		//sm,
		{
			id:'uids',
			header: fc['uids'].fieldLabel,
			dataIndex: fc['uids'].name,
			hidden: true
		},{
			id:'pid',
			header: fc['pid'].fieldLabel,
			dataIndex: fc['pid'].name,
			hidden: true
		},{
			id:'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
			hidden: true
		},{
			id:'treeuids',
			header: fc['treeuids'].fieldLabel,
			dataIndex: fc['treeuids'].name,
			hidden: true
		},{
            id:'billState',
            header: fc['billState'].fieldLabel,
            dataIndex: fc['billState'].name,
            hidden: true,
            renderer : function(v){
                var bill = "";
                for(var i=0;i<billStateArr.length;i++){
                    if(v == billStateArr[i][0])
                        bill = billStateArr[i][1];
                }
                return bill;
            },
            align : 'center',
            width : 70
        },{
			id:'finished',
			header: fc['finished'].fieldLabel,
			dataIndex: fc['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isOpen");
                var c = r.get("createMan")
                if(c != USERID){
                    return "<input type='checkbox' "+(o==1?"disabled title='已开箱，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结，但该单据不是您录入，您无权操作！'")+" disabled >";
                }else{
				var str = "<input type='checkbox' "+(o==1?"disabled title='已开箱，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结'")+" onclick='finishArrival(\""+r.get("uids")+"\",this,\""+r.get("setUser")+"\")'>"
				return str;
                }
			},
            align : 'center',
			width : 40
        },{
            id:'flowid',
            header: fc['flowid'].fieldLabel,
            dataIndex: fc['flowid'].name,
            hidden: true,
            width : 180
		},{
			id:'isOpen',
			header:fc['isOpen'].fieldLabel,
			dataIndex: fc['isOpen'].name,
			hidden: true
		},{
			id:'dhNo',
			header: fc['dhNo'].fieldLabel,
			dataIndex: fc['dhNo'].name,
			width : 200
		}, {
			id : 'dhNoticeNo',
			header : fc['dhNoticeNo'].fieldLabel,
			dataIndex : fc['dhNoticeNo'].name,
			editor : new fm.TextField(fc['dhNoticeNo']),
			width : 180,
			renderer : function(v, m, r) {
				m.attr = "style=background-color:#FBF8BF";
				return v;
			}
		}, {
			id : 'dhHandoverNo',
			header : fc['dhHandoverNo'].fieldLabel,
			dataIndex : fc['dhHandoverNo'].name,
	//		hidden : true,
			editor : new fm.TextField(fc['dhHandoverNo']),
			renderer : function(v, m, r) {
				m.attr = "style=background-color:#FBF8BF";
				return v ;
			},
			width : 180
		},{
			id:'dhDate',
			header: fc['dhDate'].fieldLabel,
			dataIndex: fc['dhDate'].name,
			renderer : function(v,m,r){
                var shi = r.get('dhShi');
                var fen = r.get('dhFen');
                var time = shi!=null&&shi!="" ? " "+shi+":"+fen+":00" : ""
                return v ? v.dateFormat('Y-m-d')+time : '';
            },			
			align : 'center',
			width : 150
		}, {
			id : 'actualTime',
			header : fc['actualTime'].fieldLabel,
			dataIndex : fc['actualTime'].name,
			editor : new fm.DateField(fc['actualTime']),
			renderer : function(v, m, r) {
				m.attr = "style=background-color:#FBF8BF";
				return v ? v.dateFormat('Y-m-d'): '';
			},
			align : 'center',
		    width : 140
	     },  {
			id:'dhDesc',
			header: fc['dhDesc'].fieldLabel,
			dataIndex: fc['dhDesc'].name,
			width : 220
		},{
			id:'csno',
			header: fc['csno'].fieldLabel,
			dataIndex: fc['csno'].name,
			renderer : function(v){
				var csmc = "";
				for(var i=0;i<csnoArr.length;i++){
					if(v == csnoArr[i][0])
						csmc = csnoArr[i][1];
				}
				return csmc;
			},
			width : 220
		},{
			id:'receiveUser',
			header: fc['receiveUser'].fieldLabel,
			dataIndex: fc['receiveUser'].name,
			align : 'center',
			width : 100
		},{
			id:'boxNum',
			header: fc['boxNum'].fieldLabel,
			dataIndex: fc['boxNum'].name,
			align : 'right',
			width : 80
		},{
			id:'totalWeight',
			header: fc['totalWeight'].fieldLabel,
			dataIndex: fc['totalWeight'].name,
			align : 'right',
			width : 100
		},{
			id:'singleMaxWeight',
			header: fc['singleMaxWeight'].fieldLabel,
			dataIndex: fc['singleMaxWeight'].name,
			align : 'right',
			width : 100
		},{
			id:'volume',
			header: fc['volume'].fieldLabel,
			dataIndex: fc['volume'].name,
			width : 100
		},{
			id:'carrierPhoto',
			header: fc['carrierPhoto'].fieldLabel,
			dataIndex: fc['carrierPhoto'].name,
			width : 100
		},{
			id:'sendType',
			header: fc['sendType'].fieldLabel,
			dataIndex: fc['sendType'].name,
			renderer : function(v){
				var send = "";
				for(var i=0;i<sendArr.length;i++){
					if(v == sendArr[i][0])
						send = sendArr[i][1];
				}
				return send;
			},
			align : 'center',
            hidden : true,
			width : 80
		},{
			id:'carNo',
			header: fc['carNo'].fieldLabel,
			dataIndex: fc['carNo'].name,
			width : 100
		},{
			id:'dumpType',
			header: fc['dumpType'].fieldLabel,
			dataIndex: fc['dumpType'].name,
			renderer : function(v){
				var send = "";
				for(var i=0;i<dumpArr.length;i++){
					if(v == dumpArr[i][0])
						send = dumpArr[i][1];
				}
				return send;
			},
            hidden : true,
			width : 100
		},{
			id:'dumpUnit',
			header: fc['dumpUnit'].fieldLabel,
			dataIndex: fc['dumpUnit'].name,
			width : 160
		},{
			id:'recordUser',
			header: fc['recordUser'].fieldLabel,
			dataIndex: fc['recordUser'].name,
			align : 'center',
			width : 120
        },{
            id:'joinUnit',
            header: fc['joinUnit'].fieldLabel,
            dataIndex: fc['joinUnit'].name,
            width : 160
        },{
            id:'joinPlace',
            header: fc['joinPlace'].fieldLabel,
            dataIndex: fc['joinPlace'].name,
            width : 160
        },{
            id:'setUser',
            header: fc['setUser'].fieldLabel,
            dataIndex: fc['setUser'].name,
            align : 'center',
            renderer : function(v){
                if(v=="1")
                    return "已设置";
                else
                    return "未设置";
            },
            width : 80
		}, {
		    id : 'fileList',
		    header : fc['fileList'].fieldLabel,
		    dataIndex : fc['fileList'].name,
		    align : 'center',
		    renderer : filelistFn
		}, {
			id:'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width : 160
		}
	]);
	
	var Columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isOpen', type : 'float'},
		{name : 'dhNo', type : 'string'},
		{name : 'dhNoticeNo',type : 'string'},
		{name : 'dhHandoverNo',type : 'string'},
		{name : 'dhDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'dhShi', type : 'string'},
		{name : 'dhFen', type : 'string'},
		{name : 'dhDesc', type : 'string'},
		{name : 'csno', type : 'string'},
		{name : 'receiveUser', type : 'string'},
		{name : 'boxNum', type : 'float'},
		{name : 'totalWeight', type : 'float'},
		{name : 'sendType', type : 'string'},
		{name : 'carNo', type : 'string'},
		{name : 'dumpType', type : 'string'},
		{name : 'dumpUnit', type : 'string'},
		{name : 'recordUser', type : 'string'},
		{name : 'remark', type : 'string'},

        {name : 'billState', type : 'string'},
		{name : 'flowid', type : 'string'},
		{name : 'joinUnit', type : 'string'},
		{name : 'joinPlace', type : 'string'},
		{name : 'setUser', type : 'string'},
        //singleMaxWeight,volume,carrierPhoto
		{name : 'singleMaxWeight', type : 'float'},
		{name : 'volume', type : 'string'},
		{name : 'carrierPhoto', type : 'string'},
		{name : 'actualTime' ,type : 'date',dateFormat : 'Y-m-d H:i:s'}
        
        ,{name : 'createMan', type : 'string'}
        ,{name : 'createUnit', type : 'string'}
	];

	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	//params: "conid='"+edit_conid+"'"
	    	params: viewSql   //默认根据电建公司过滤数据，条件在wz.cont.tree.js中获取
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    ds.setDefaultSort(orderColumn, 'asc');
	
    var printBtn = new Ext.Button({
        text : '打印',
        iconCls : 'print',
        handler : doPrint
    });
    
    function doPrint(){
        var fileid = "";
        var uids = ""
        var modetype = "NewCL";
        var record = sm.getSelected();
        if(record != null && record != ""){
            if(record.get('finished') == 1){
                uids = record.get("uids");
            }else{
                Ext.example.msg('提示信息', '只能打印已完结的单据！');
            }
        }else{
            Ext.example.msg('提示信息', '请先选择要打印的记录！');
            return;
        }
        //模板参数，固定值，在 系统管理  -> office模板 中配置
        var filePrintType = "WzGoodsArrivalView";
        var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='"+filePrintType+"'";
        DWREngine.setAsync(false);
        baseMgm.getData(sql,function(str){
            fileid = str;
        });
        DWREngine.setAsync(true);
        if(fileid == null || fileid == ""){
            Ext.MessageBox.alert("文档打印错误","文档打印模板不存在，请先在系统管理中添加！");
            return;
        }else{
            var docUrl = BASE_PATH + "Business/equipment/equMgm/equ.file.print.jsp?fileid="+fileid;
            docUrl += "&filetype="+filePrintType
            docUrl += "&uids="+uids
            docUrl += "&modetype="+modetype
//            window.open(docUrl)
            window.showModalDialog(docUrl,"","dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
        }
    }
    var cmArray = [['selectAll','全部']];
    var cmHide = new Array();
    
   	var store1 = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArray
	}); 
    var  chooseRow = new Ext.form.MultiSelect({
         id:   'chooserow',
         width:  150,
         store : store1,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanel.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRow.setValue(cmHide);
		            cmSelectById(colModel,cmHide);
		        }else{
		            this.selectAll();
		            cmSelectById(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRow.setValue(this.getCheckedValue());
                cmSelectById(colModel,this.getCheckedValue());
		    }
		}
  });
 
	function cmSelectById(cm,str){
    	var cmHide = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol+1; i<cm.getColumnCount();i++){
            for(var j=0;j<cmHide.length;j++){
                if(cm.getDataIndex(i) == cmHide[j]){
                    cm.setHidden(i,false);
                    break;
                }else{
                    cm.setHidden(i,true);
                }
            }
        }
	} 
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt ={
		uids : '',
		pid : '',
		conid  : '',
		treeuids  : '',
	    finished  : '',
	    isOpen  : '',
	    dhNo  : '',
	    dhDate  : new Date(),
	    dhShi  : '',
	    dhFen  : '',
	    dhDesc  : '',
	    csno  : '',
	    receiveUser  :  '',
	    boxNum  : '',
	    totalWeight  :  '',
	    sendType  : '',
	    carNo  : '',
	    dumpType  :  '',
	    dumpUnit  :  '',
	    recordUser  :  '',
	    remark  :  '',
	    fileList  : '',
	    billState  :  '',
	    flowid  :  '',
	    joinUnit  : '',
	    joinPlace  : '',
	    setUser  :  '',
	        
	    singleMaxWeight :  '',
	    volume : '',
	    carrierPhoto :'',
	    dhNoticeNo : '',
	    actualTime : new Date(),
	    dhHandoverNo : ''
        
        ,createMan : USERID
        ,createUnit : USERDEPTID
	}
	var saveBtn = new Ext.Button({
				id : 'save',
				text : '保存',
				iconCls : 'save',
				handler : saveFun
			});			
   gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		sm : sm,
		cm : cm,
		tbar : ['<font color=#15428b><B>到货单信息<B></font>','-',addBtn,'-',editBtn,'-',saveBtn,'-',delBtn,'-',/*printBtn,'-',*/smsUserBtn,'->',chooseRow],
		header: false,
	    border: false,
	    //layout: 'fit',
        addBtn : false,
        saveBtn : false,
        delBtn : false,
	    region: 'center',
        stripeRows:true,
        loadMask : true,
        enableHdMenu : false,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey 
	});
	
	// TODO : ======到货详细信息======
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'arrivalId' : {name : 'arrivalId',fieldLabel : '到货单主键'},
		'arrivalNo' : {name : 'arrivalNo',fieldLabel : '到货单批次号'},
		'boxType' : {
			name : 'boxType',
			fieldLabel : '箱件类型',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: boxDs
			},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: jzDs
		},
		'boxNo' : {name : 'boxNo',fieldLabel : '存货编码'},
		'boxName' : {name : 'boxName',fieldLabel : '存货名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'mustNum' : {name : 'mustNum',fieldLabel : '应到数',decimalPrecision:4},
		'realNum' : {name : 'realNum',fieldLabel : '实到数',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量',decimalPrecision:4},
		'packType' : {
			name : 'packType',
			fieldLabel : '包装方式',
			//readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: packDs
		},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
		'exception' : {name : 'exception',fieldLabel : '异常'},
		'exceptionDesc' : {name : 'exceptionDesc',fieldLabel : '异常描述'},
		'remark' : {name : 'remark',fieldLabel : '备注'}
	};
	var smSub = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cmSub = new Ext.grid.ColumnModel([
		//smSub,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcSub['uids'].fieldLabel,
			dataIndex : fcSub['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcSub['pid'].fieldLabel,
			dataIndex : fcSub['pid'].name,
			hidden : true
		},{
			id : 'arrivalId',
			header : fcSub['arrivalId'].fieldLabel,
			dataIndex : fcSub['arrivalId'].name,
			hidden : true
		},{
			id : 'arrivalNo',
			header : fcSub['arrivalNo'].fieldLabel,
			dataIndex : fcSub['arrivalNo'].name,
			hidden : true
		},{
			id : 'boxType',
			header : fcSub['boxType'].fieldLabel,
			dataIndex : fcSub['boxType'].name,
			renderer : function(v){
				var box = "";
				for(var i=0;i<boxArr.length;i++){
					if(v == boxArr[i][0])
						box = boxArr[i][1];
				}
				return box;
			},
			align : 'center',
			hidden : true,
			hidden : true,
			width : 80
		},{
			id : 'jzNo',
			header : fcSub['jzNo'].fieldLabel,
			dataIndex : fcSub['jzNo'].name,
			renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'boxNo',
			header : fcSub['boxNo'].fieldLabel,
			dataIndex : fcSub['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'boxName',
			header : fcSub['boxName'].fieldLabel,
			dataIndex : fcSub['boxName'].name,
			width : 180
		},{
			id : 'ggxh',
			header : fcSub['ggxh'].fieldLabel,
			dataIndex : fcSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcSub['graphNo'].fieldLabel,
			dataIndex : fcSub['graphNo'].name,
			align : 'center',
            hidden : true,
			width : 100
		},{
			id : 'unit',
			header : fcSub['unit'].fieldLabel,
			dataIndex : fcSub['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'mustNum',
			header : fcSub['mustNum'].fieldLabel,
			dataIndex : fcSub['mustNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'realNum',
			header : fcSub['realNum'].fieldLabel,
			dataIndex : fcSub['realNum'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
		    },
			editor : new fm.NumberField(fcSub['realNum']),			
			align : 'right',
			width : 80
		},{
			id : 'weight',
			header : fcSub['weight'].fieldLabel,
			dataIndex : fcSub['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'packType',
			header : fcSub['packType'].fieldLabel,
			dataIndex : fcSub['packType'].name,
//			renderer : function(v){
//				var pack = "";
//				for(var i=0;i<packArr.length;i++){
//					if(v == packArr[i][0])
//						pack = packArr[i][1];
//				}
//				return pack;
//			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'storage',
			header : fcSub['storage'].fieldLabel,
			dataIndex : fcSub['storage'].name,
			align : 'center',
			renderer : function(v){
                var storage = "";
                for(var i=0;i<equWareArr.length;i++){
                    if(v == equWareArr[i][0])
                        storage = equWareArr[i][3]+" - "+equWareArr[i][2];;
                }
                return storage;
            },
			width : 160
		},{
			id : 'exception',
			header : fcSub['exception'].fieldLabel,
			dataIndex : fcSub['exception'].name,
			renderer : function(v,m,r){
				return "<input type='checkbox'  "+(v==1?"checked":"")+" disabled >"
			},
			align : 'center',
			hidden : true,
			width : 80
		},{
			id : 'exceptionDesc',
			header : fcSub['exceptionDesc'].fieldLabel,
			dataIndex : fcSub['exceptionDesc'].name,
			hidden : true,
			width : 180
		},{
			id : 'remark',
			header : fcSub['remark'].fieldLabel,
			dataIndex : fcSub['remark'].name,
			width : 180
		}
	]);
	var ColumnsSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'arrivalId', type:'string'},
		{name:'arrivalNo', type:'string'},
		{name:'boxType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'boxName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'mustNum', type:'float'},
		{name:'realNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'packType', type:'string'},
		{name:'storage', type:'string'},
		{name:'exception', type:'float'},
		{name:'exceptionDesc', type:'string'},
		{name:'remark', type:'string'}
	];
	
	dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanSub,
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "1=2"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeySub
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort(orderColumnSub, 'desc');	//设置默认排序列
    var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {
		 uids : '',
		 pid : CURRENTAPPID,
		 arrivalId : '',
		 arrivalNo : '',
		 boxType : '',
		 jzNo : '',
		 boxNo : '',
		 boxName : '',
		 ggxh : '',
		 graphNo : '',
		 unit : '',
		 mustNum : '',
		 realNum : '',
		 weight : '',
		 packType : '',
		 storage : '',
		 exception : '',
		 exceptionDesc : '',
		 remark : ''
	 }
	var saveGridBtn = new Ext.Button({
			id : 'saveBtn',
			text : '保存',
			iconCls : 'save',
			handler : saveGridFun
		});    
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '到货单',
		tbar : ['->',saveGridBtn],
		enableHdMenu : false,
		header: false,
		height : document.body.clientHeight*0.5,
	    border: false,
	    //layout: 'fit',
	    region: 'south',
	    border: false,
		autoWidth : true,
	    addBtn : false, // 是否显示新增按钮
	    saveBtn : false, // 是否显示保存按钮
	    delBtn : false, // 是否显示删除按钮
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanSub,
		business : businessSub,
		primaryKey : primaryKeySub
	});
	
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanel,gridPanelSub]
	});
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [treePanel, contentPanel]
	});
	for(var o in fc){
        var name = fc[o];
        var temp = new Array();
        temp.push(fc[o].name);
        temp.push(fc[o].fieldLabel);
        var colModel = gridPanel.getColumnModel();
        //锁定列不在显示更多信息中出现
        if(colModel.getLockedCount()<=colModel.findColumnIndex(fc[o].name)){
	        cmArray.push(temp);
	        if(!colModel.isHidden(colModel.getIndexById(o))){
	            cmHide.push(o)
	        }
        }
    }
    store1.loadData(cmArray)
			
	chooseRow.setValue(cmHide);
    chooseRow.setRawValue("显示更多信息");	
	if(isFlwTask == true || isFlwView == true)
       ds.baseParams.params = " flowid = '"+flowid+"' "
    ds.load({params:{start:0,limit:PAGE_SIZE}});
	ds.on("load",function(){
        if(isFlwTask == true && ds.getCount() > 0 && ds.getCount() == 1){
	        addBtn.setDisabled(true);
        //}else if(isFlwTask != true){
	    //    addBtn.setDisabled(false);
        }
        if(isFlwView == true){
	        addBtn.setDisabled(true);
	        editBtn.setDisabled(true);
	        delBtn.setDisabled(true);
	        smsUserBtn.setDisabled(true);
            printBtn.setDisabled(false);
	    }
    });
   
     function saveGridFun(){
	       gridPanelSub.defaultSaveHandler();
	 } 
	sm.on('rowselect',function(){
		var record = sm.getSelected();
        if (record == null || record == '') return;
        if(record.get('createMan') == USERID){
	        var billStateBool = record.get('billState')=='0' ? false : true;
	        billStateBool = false;//到货通知单不需要审批流程
			if(record.get('finished') == 1 || (!isFlwTask&&billStateBool)){
				editBtn.setDisabled(true);
				delBtn.setDisabled(true);
				smsUserBtn.setDisabled(true);
                saveBtn.setDisabled(false);
                saveGridBtn.setDisabled(true);
	            printBtn.setDisabled(false);
			}else{
				editBtn.setDisabled(false);
				delBtn.setDisabled(false);
				smsUserBtn.setDisabled(false);
                saveBtn.setDisabled(false);
                saveGridBtn.setDisabled(false);
	            printBtn.setDisabled(true);
	            if(isFlwView == true){
			        addBtn.setDisabled(true);
			        editBtn.setDisabled(true);
			        delBtn.setDisabled(true);
			        smsUserBtn.setDisabled(true);
	                printBtn.setDisabled(true);
			    }
			}
			if(record.get('isOpen') == 1 || (!isFlwTask&&billStateBool)){
			  saveGridBtn.setDisabled(true);
			  saveBtn.setDisabled(true);
			}else{
			  saveGridBtn.setDisabled(false);
			  saveBtn.setDisabled(false);
			}
        }else{
        	if(record.get('isOpen') != 1 ){
		        editBtn.setDisabled(true);
		        delBtn.setDisabled(true)
		        smsUserBtn.setDisabled(true);
		        //saveGridBtn.setDisabled(true);       	
        	}else{
	            editBtn.setDisabled(false);
	            delBtn.setDisabled(false)
	            smsUserBtn.setDisabled(false);
	            //saveGridBtn.setDisabled(false);        	
        	}

        }
		dsSub.baseParams.params = "arrivalId = '"+record.get('uids')+"'";
		dsSub.load({params:{start:0,limit:PAGE_SIZE}});
	});
	
	function addOrEditArrival(){
		var btnId = this.id;
		var record = sm.getSelected();
		var url = BASE_PATH+"Business/wzgl/baseinfo_wzgl/wz.goods.arrival.addorupdate.jsp"
		if(selectParentid == '0'){
			Ext.example.msg('提示信息','请选择该分类下的的合同！');
	    	return ;
		}
		if(btnId == "addBtn"){
			if(selectUuid == "" || selectConid == ""){
				Ext.example.msg('提示信息','请先选择左边的合同分类树！');
		    	return ;
			}
			url += "?conid="+selectConid+"&treeuids="+selectUuid+"&treeid="+selectTreeid;
		}else if(btnId == "editBtn"){
			if(record == null){
				Ext.example.msg('提示信息','请先选择一条到货信息！');
		    	return ;
			}		
			url += "?conid="+record.get("conid")+"&treeuids="+record.get("treeuids")+"&uids="+record.get("uids");
		}
        if(isFlwTask == true){
            url += "&isTask=true";
            if(flowid!="")
                url += "&flowid="+flowid;
        }
		selectWin = new Ext.Window({
			width: 950,
			height: 500,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			html:"<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(){
					ds.reload();
				},
				'show' : function(){
					equArrival.location.href  = url;
				}
			}
	    });
		selectWin.show();
	}
	
	function deleteArrival(){
		var record = sm.getSelected();
		if(record == null){
			Ext.example.msg('提示信息','请先选择一条到货信息！');
	    	return ;
		}
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
			if (btn == "yes") {
				var uids = record.get("uids");
				wzbaseinfoMgm.deleteArrival(uids,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','到货单删除成功！');
						ds.reload();
                        if(isFlwTask == true) addBtn.setDisabled(false);
						dsSub.reload();
					}else{
						Ext.example.msg('提示信息','操作出错！');
					}
				});
			}
		});
	}
	
	function saveFun(){
	    gridPanel.defaultSaveHandler();
	}
    //附件 
    function filelistFn(value, metadata, record){
		    	        var uidsStr = record.get('uids')
						var downloadStr="";
						var billstate = record.get('isOpen');
						var count=0;
						var editable = true;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+uidsStr+
				                           "' and transaction_type='"+businessType+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
						if(billstate == 0){
						   downloadStr="附件["+count+"]";
						   editable = true;
						}else{
						   downloadStr="附件["+count+"]";
						   editable = false;
						}	
                        if(!(record.get('createMan') == USERID)){
                            editable = false;
                        }
						return '<div id="sidebar"><a href="javascript:showUploadWin(\''
									+ businessType + '\', ' + editable + ', \''
									+ uidsStr
									+ '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>'
					
			}
});

function finishArrival(uids,finished,setUser){
    if(isFlwView == true){
        finished.checked = !finished.checked;
        return;
    }
    if(finished.checked == true){
        //完结操作，需判断是否设置提醒人，取消操作则不判断
        if(setUser!="1"){
		    Ext.MessageBox.confirm('确认', '到货但还没有短信提醒人，需要设置短信提醒人吗？', function(btn,text) {
		        if (btn == "yes") {
	                //返回完结操作，设置短信提醒人
		            finished.checked = false;
		            return;
	            }else {
	            	Ext.MessageBox.confirm('确认', '确认执行完结操作吗？', function(btn,text){
	            	    if(btn=='yes'){
	            	       	 //不设置短信提醒人，直接完结操作，不发短信
	                         doFinishArrival(uids,finished,false);
	            	    }else{
	            	      finished.checked = false;
	            	      return;
	            	    }
	            	})

	            }
		    });
        }else{
        	Ext.MessageBox.confirm('确认', '确认执行完结操作吗？', function(btn,text){
        	    if(btn=='yes'){
        	       	 //不设置短信提醒人，直接完结操作，不发短信
                     doFinishArrival(uids,finished,true);
        	    }else{
        	      finished.checked = false;
        	      return;
        	    }
        	})
	     }
    }else{
        //取消完结操作，不发短信
        doFinishArrival(uids,finished,false);
    }
}

function doFinishArrival(uids,finished,bool){
    //后台处理，需要判断到货是否已经开箱验收
    var finStr;
    DWREngine.setAsync(false);
    wzbaseinfoMgm.WzArrivalFinished(uids,function(str){
        if(str == "1"){
            finStr = str;
            Ext.example.msg('提示信息','到货单完结操作成功！');
            //finished.checked = true;
            ds.reload();
            if(finished.checked){
                finishTaskEdit();
            }
        }else if(str == "2"){
            Ext.example.msg('提示信息','该到货单已经开箱，不能取消完结！');
            finished.checked = false;
        }else{
            Ext.example.msg('提示信息','操作出错！');
            finished.checked = false;
        }
    });
    DWREngine.setAsync(true);
    //完结操作成功，调用发送短信功能
    if(bool && finStr=="1")
        wzbaseinfoMgm.sendSmsByWzGoodsArrival(uids);
}

function viewTemplate(fileid){
	window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid)
}

function finishTaskEdit(){
    if(isFlwTask == true){
		Ext.MessageBox.confirm(
		    '操作完成！','点击“是”可以发送到流程下一步操作！<br><br>点击“否”继续在本页编辑内容！',
		    function(value){
		        if ('yes' == value){
		            parent.IS_FINISHED_TASK = true;
		            parent.mainTabPanel.setActiveTab('common');
		        }
		    }
		);
    }
}


//显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	fileWin.on("close",function(){
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and indexid in (select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	});
}