var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxNotice"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"

var beanSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxNoticeSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"


var selectTreeid = "";
var selectUuid = "";
var selectConid = "";
var selectParentid = "";
var selectWin;
var businessType = "zlMaterial";

var csnoArr = new Array();
var sendArr = new Array();
var packArr = new Array();
var dumpArr = new Array();
var boxArr = new Array();
var jzArr = new Array();
var profArr = new Array();
var unitArr = new Array();
var billStateArr = new Array();

var ds;
var dsSub;

Ext.onReady(function(){
	
// TODO : ======开箱通知单主表======
	DWREngine.setAsync(false);
	//供货厂家
	var sql = "select uids,csmc from sb_csb";
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
	//所属专业
	appMgm.getCodeValue("所属专业",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			profArr.push(temp);			
		}
	});
	//参加单位
	var sql = "select unitid,unitname from sgcc_ini_unit t where t.unit_type_id ='7'";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			unitArr.push(temp);			
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
		handler : addOrEditOpenboxNotice
	});
	var editBtn = new Ext.Button({
		id : 'editBtn',
		text : '修改',
		iconCls : 'btn',
		handler : addOrEditOpenboxNotice
	});
	var delBtn = new Ext.Button({
		text : '删除',
		iconCls : 'remove',
		handler : deleteOpenboxNotice
	});
	
	var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isCheck' : {name : 'isCheck',fieldLabel : '已检验'},
		'noticeNo' : {name : 'noticeNo',fieldLabel : '通知单号'},
		'noticeDate' : {name : 'noticeDate',fieldLabel : '下单日期'},
		'openDate' : {name : 'openDate',fieldLabel : '开箱时间'},
		'dhShi' : {name : 'dhShi',fieldLabel : '时'},
		'dhFen' : {name : 'dhFen',fieldLabel : '分'},
		'openPlace' : {name : 'openPlace',fieldLabel : '开箱地点'},
		'openUnit' : {name : 'openUnit',fieldLabel : '参与单位'},
		'equDesc' : {name : 'equDesc',fieldLabel : '检验主要设备描述'},
		'ownerNo' : {name : 'ownerNo',fieldLabel : '业主单号'},
		'professinal' : {name : 'professinal',fieldLabel : '所属专业'},
		'fileList' : {name : 'fileList',fieldLabel : '附件' },
		'remark' : {name : 'remark',fieldLabel : '备注'},
        'billState' : {name : 'billState',fieldLabel : '审批状态'},
        'flowid' : {name : 'flowid',fieldLabel : '流程编号'},
        'projectName' : {name : 'projectName',fieldLabel : '工程名称'}
        
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
            renderer : function(v){
                var bill = "";
                for(var i=0;i<billStateArr.length;i++){
                    if(v == billStateArr[i][0])
                        bill = billStateArr[i][1];
                }
                return bill;
            },
            align : 'center',
            width : 70,
            hidden: true
        },{
            id:'flowid',
            header: fc['flowid'].fieldLabel,
            dataIndex: fc['flowid'].name,
            width : 180,
            hidden: true
		},{
			id:'finished',
			header: fc['finished'].fieldLabel,
			dataIndex: fc['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isCheck");
                var c = r.get("createMan")
                if(c != USERID){
                    return "<input type='checkbox' "+(o==1?"disabled title='已检验，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结，但该单据不是您录入，您无权操作！'")+" disabled >";
                }else{
				    var str = "<input type='checkbox' "+(o==1?"disabled title='已检验，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结'")+" onclick='finishNotice(\""+r.get("uids")+"\",this)'>"
				    return str;
                }
			},
            align : 'center',
			width : 40
		},{
			id:'isCheck',
			header:fc['isCheck'].fieldLabel,
			dataIndex: fc['isCheck'].name,
			hidden: true
		},{
			id:'noticeNo',
			header: fc['noticeNo'].fieldLabel,
			dataIndex: fc['noticeNo'].name,
			width : 180
		},{
			id:'noticeDate',
			header: fc['noticeDate'].fieldLabel,
			dataIndex: fc['noticeDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'openDate',
			header: fc['openDate'].fieldLabel,
			dataIndex: fc['openDate'].name,
			renderer :  function(v, m, r) {
				var shi = r.get('dhShi');
				var fen = r.get('dhFen');
				var time = shi != null && shi != ""
						? " " + shi + ":" + fen + ":00"
						: ""
				return v ? v.dateFormat('Y-m-d') + time : '';
			},
			align : 'center',
			width : 130
		},{
			id:'openPlace',
			header: fc['openPlace'].fieldLabel,
			dataIndex: fc['openPlace'].name,
			width : 180
		},{
			id:'openUnit',
			header: fc['openUnit'].fieldLabel,
			dataIndex: fc['openUnit'].name,
			renderer : function(v){
				//var unit = "";
				//for(var i=0;i<unitArr.length;i++){
				//	if(v == unitArr[i][0])
				//		unit = unitArr[i][1];
				//}
				//return unit;
                return "<div title='"+v+"'>"+v+"</div>"
			},
			width : 280
		},{
			id:'equDesc',
			header: fc['equDesc'].fieldLabel,
			dataIndex: fc['equDesc'].name,
			width : 180
		},{
			id:'ownerNo',
			header: fc['ownerNo'].fieldLabel,
			dataIndex: fc['ownerNo'].name,
			width : 160
		},{
			id:'professinal',
			header: fc['professinal'].fieldLabel,
			dataIndex: fc['professinal'].name,
			renderer : function(v){
				var prof = "";
				for(var i=0;i<profArr.length;i++){
					if(v == profArr[i][0])
						prof = profArr[i][1];
				}
				return prof;
			},
			width : 80
        },{
            id:'projectName',
            header: fc['projectName'].fieldLabel,
            dataIndex: fc['projectName'].name,
            width : 160
		},{
		
		    id : 'fileList',
		    header : fc['fileList'].fieldLabel,
		    dataIndex : fc['fileList'].name,
		    align : 'center',
		    renderer : filelistFn
		}, {
			id:'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width : 180
		}
	]);
	
	var Columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isCheck', type : 'float'},
		{name : 'noticeNo', type : 'string'},
		{name : 'noticeDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'openDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'dhShi',type : 'string'},
		{name : 'dhFen',type : 'string'},
		{name : 'openPlace', type : 'string'},
		{name : 'openUnit', type : 'string'},
		{name : 'equDesc', type : 'string'},
		{name : 'ownerNo', type : 'string'},
		{name : 'professinal', type : 'string'},
		{name : 'remark', type : 'string'},
        
		{name : 'billState', type : 'string'},
        {name : 'flowid', type : 'string'},
		{name : 'projectName', type : 'string'}
        
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
	cm.defaultSortable = true;
	
	var gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		sm : sm,
		cm : cm,
		title : '材料开箱申请表',
		tbar : ['<font color=#15428b><B>材料开箱申请表<B></font>','-',addBtn,'-',editBtn,'-',delBtn],
		enableHdMenu : false,
		header: false,
	    border: false,
	    //layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: false
	    },
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	// TODO : ======开箱通知单明细======
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'noticeId' : {name : 'noticeId',fieldLabel : '开箱通知单主键'},
		'noticeNo' : {name : 'noticeNo',fieldLabel : '开箱通知单批次号'},
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
		'openNum' : {name : 'openNum',fieldLabel : '数量',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）',decimalPrecision:4},
		'arrivalSubId' : {name : 'arrivalSubId',fieldLabel : '到货明细设备主键'},
		'arrivalNo' : {name : 'arrivalNo',fieldLabel : '到货单批次号'}
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
			id : 'noticeId',
			header : fcSub['noticeId'].fieldLabel,
			dataIndex : fcSub['noticeId'].name,
			hidden : true
		},{
			id : 'noticeNo',
			header : fcSub['noticeNo'].fieldLabel,
			dataIndex : fcSub['noticeNo'].name,
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
			width : 100
		},{
			id : 'unit',
			header : fcSub['unit'].fieldLabel,
			dataIndex : fcSub['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'openNum',
			header : fcSub['openNum'].fieldLabel,
			dataIndex : fcSub['openNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'weight',
			header : fcSub['weight'].fieldLabel,
			dataIndex : fcSub['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'arrivalSubId',
			header : fcSub['arrivalSubId'].fieldLabel,
			dataIndex : fcSub['arrivalSubId'].name,
			hidden : true
		},{
			id : 'arrivalNo',
			header : fcSub['arrivalNo'].fieldLabel,
			dataIndex : fcSub['arrivalNo'].name,
			hidden : true
		}
	]);
	var ColumnsSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'noticeId', type:'string'},
		{name:'noticeNo', type:'string'},
		{name:'boxType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'boxName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'openNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'arrivalSubId', type:'string'},
		{name:'arrivalNo', type:'string'}
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
    
	var gridPanelSub = new Ext.grid.GridPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '开箱检验通知单详细信息',
		//tbar : [],
		header: false,
		height : document.body.clientHeight*0.5,
		enableHdMenu : false,
	    border: false,
	    //layout: 'fit',
	    region: 'south',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
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
        }
    });
    
	sm.on('rowselect',function(){
		var record = sm.getSelected();
        if (record == null || record == '') return;
        if(record.get('createMan') == USERID){
	        var billStateBool = record.get('billState')=='0' ? false : true;
			if(record.get('finished') == 1 ){//|| (!isFlwTask&&billStateBool)
				editBtn.setDisabled(true);
				delBtn.setDisabled(true);
			}else{
				editBtn.setDisabled(false);
				delBtn.setDisabled(false);
	            if(isFlwView == true){
	                addBtn.setDisabled(true);
	                editBtn.setDisabled(true);
	                delBtn.setDisabled(true);
	            }
			}
        }else{
            editBtn.setDisabled(true);
            delBtn.setDisabled(true);
        }
        if(competenceFlag==true){
            addBtn.setDisabled(false);
        }else{
            addBtn.setDisabled(true);
        }
		dsSub.baseParams.params = "noticeId = '"+record.get('uids')+"'";
		dsSub.load({params:{start:0,limit:PAGE_SIZE}});
	});
    if(competenceFlag==true){
        addBtn.setDisabled(false);
    }else{
        addBtn.setDisabled(true);
    }
	
	function addOrEditOpenboxNotice(){
		if(selectParentid == '0'){
				Ext.example.msg('提示信息','请选择该分类下的合同！');
		    	return ;		
		}
		var btnId = this.id;
		var record = sm.getSelected();
		var url = BASE_PATH+"Business/wzgl/baseinfo_wzgl/wz.goods.openbox.notice.addorupdate.jsp"
		if(btnId == "addBtn"){
			if(selectUuid == "" || selectConid == ""){
				Ext.example.msg('提示信息','请先选择左边的合同分类树！');
		    	return ;
			}
			url += "?conid="+selectConid+"&treeuids="+selectUuid+"&treeid="+selectTreeid;
		}else if(btnId == "editBtn"){
			if(record == null){
				Ext.example.msg('提示信息','请先选择一条通知单！');
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
	
	function deleteOpenboxNotice(){
		var record = sm.getSelected();
		if(record == null){
			Ext.example.msg('提示信息','请先选择一条开箱通知单！');
	    	return ;
		}
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
			if (btn == "yes") {
				var uids = record.get("uids");
				wzbaseinfoMgm.deleteWzOpenboxNotice(uids,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','开箱通知单删除成功！');
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
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    
    function filelistFn(value, metadata, record){
    	        var uidsStr = record.get('uids')
				var downloadStr="";
				var finished = record.get('finished');
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
				if(finished == 0){
				   downloadStr="附件["+count+"]";
				   editable = true;
				}else{
				   downloadStr="附件["+count+"]";
				   editable = false;
				}	
				return '<div id="sidebar"><a href="javascript:showUploadWin(\''
							+ businessType + '\', ' + editable + ', \''
							+ uidsStr
							+ '\', \''+'开箱通知单附件'+'\')">' + downloadStr +'</a></div>'
			
	}
});

function finishNotice(uids,finished){
    if(isFlwView == true){
        finished.checked = !finished.checked;
        return;
    }
	DWREngine.setAsync(false);
	wzbaseinfoMgm.wzNoticeFinished(uids,function(str){
		if(str == "1"){
			Ext.example.msg('提示信息','开箱检验通知单完结操作成功！');
			//finished.checked = true;
			ds.reload();
            if(finished.checked)
                finishTaskEdit();
		}else if(str == "2"){
			Ext.example.msg('提示信息','该开箱检验通知单已经开始检验，不能取消完结！');
			finished.checked = false;
		}else{
			Ext.example.msg('提示信息','操作出错！');
			finished.checked = false;
		}
	});
	DWREngine.setAsync(true);
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
