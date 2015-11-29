var beanName = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxExceView"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uuid"
var orderColumn = "uuid"

var gridPanelAdnoral;

var boxArr = new Array();
var jzArr = new Array();
var profArr = new Array();
var unitArr = new Array();
var equTypeArr = new Array();
var exceTypeArr = new Array();

Ext.onReady(function(){

   var fm = Ext.form;
	DWREngine.setAsync(false);

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
	
	//设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			equTypeArr.push(temp);			
		}
	});
	
	//异常类型exceTypeArr
	appMgm.getCodeValue("异常类型",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			exceTypeArr.push(temp);			
		}
	});
	
    DWREngine.setAsync(true);

	var fc = {
			'uuid' : {name : 'uuid',fieldLabel : '设备开箱主键结果主键'},
			'uids' : {name : 'uids',fieldLabel : '异常设备主键'},
			'pid' : {name : 'pid',fieldLabel : 'PID'},
			'equType' : {name : 'equType',fieldLabel : '设备类型'},
			'jzNo' : {name : 'jzNo',fieldLabel : '机组号'},
			'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
			'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
			'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
			'unit' : {name : 'unit',fieldLabel : '单位'},
			'boxinNum' : {name : 'boxinNum',fieldLabel : '装箱单数量'},
			'realNum' : {name : 'realNum',fieldLabel : '实到数量'},
			'passNum' : {name : 'passNum',fieldLabel : '合格数量'},
			'exceNum' : {name : 'exceNum',fieldLabel : '异常数量'},
			'exception' : {name : 'exception',fieldLabel : '异常'},
			'exceType' : {name : 'exceType',fieldLabel : '异常类型'},
			'exceptionDesc' : {name : 'exceptionDesc',fieldLabel : '异常描述'},
			'excePassNum' : {name : 'excePassNum',fieldLabel : '异常处理数量'},
			'applyInNum' : {name : 'applyInNum',fieldLabel : '申请入库数量'},
			'weight' : {name : 'weight',fieldLabel : '重量'},
			'excePassDate' : {
				name : 'excePassDate',
				fieldLabel : '异常处理日期',
				format: 'Y-m-d',
				width : 125
				},
			'handleUser' : {name : 'handleUser',fieldLabel : '异常处理人'},
			'handleProcess' : {
				name : 'handleProcess',
				fieldLabel : '异常处理过程',
				width : 380
				},
			'remark' : {
				name : 'remark',
				fieldLabel : '备注',
				width :380
				}
	};
	
	var smAdnoral = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var cmAdnoral = new Ext.grid.ColumnModel([
		smAdnoral,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),{
			id : 'uuid',
			header : fc['uuid'].fieldLabel,
			dataIndex : fc['uuid'].name,
			hidden : true
		},{ 
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true		
		   
		},{
			id : 'pid',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true
		},{
			id : 'equType',
			header : fc['equType'].fieldLabel,
			dataIndex : fc['equType'].name,
			renderer : function(v){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0])
						equ = equTypeArr[i][1];
				}
				return equ;
			},
			align : 'center',
			width : 100
		},{
			id : 'jzNo',
			header : fc['jzNo'].fieldLabel,
			dataIndex : fc['jzNo'].name,
			renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			},
			align : 'center',
			width : 80
		},{
			id : 'boxNo',
			header : fc['boxNo'].fieldLabel,
			dataIndex : fc['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'equPartName',
			header : fc['equPartName'].fieldLabel,
			dataIndex : fc['equPartName'].name,
			width : 180
		},{
			id : 'ggxh',
			header : fc['ggxh'].fieldLabel,
			dataIndex : fc['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fc['unit'].fieldLabel,
			dataIndex : fc['unit'].name,
			width : 180
		},{
			id : 'boxinNum',
			header : fc['boxinNum'].fieldLabel,
			dataIndex : fc['boxinNum'].name,
			align : 'center',
			width : 80
		},{
			id : 'realNum',
			header : fc['realNum'].fieldLabel,
			dataIndex : fc['realNum'].name,
			align : 'center',
			width : 80
		},{
			id : 'passNum',
			header : fc['passNum'].fieldLabel,
			dataIndex : fc['passNum'].name,
			align : 'center',
			width : 80
		},{
			id : 'exceNum',
			header : fc['exceNum'].fieldLabel,
			dataIndex : fc['exceNum'].name,
			align : 'center',
			width : 80
		},{
            id : 'weight',
			header : fc['weight'].fieldLabel,
			dataIndex : fc['weight'].name,
			align : 'right',
			width : 80           
		},{
			id : 'exception',
			header : fc['exception'].fieldLabel,
			dataIndex : fc['exception'].name,
			renderer : function(v,m,r){
				return "<input type='checkbox' "+(v==1?"checked":"")+" disabled>"
			},
			align : 'center',
			width : 80
		},{
			id : 'exceType',
			header : fc['exceType'].fieldLabel,
			dataIndex : fc['exceType'].name,
			renderer : function(v,m,r){
				var  exce = "";
				for(var i=0;i<exceTypeArr.length;i++){
					if(v == exceTypeArr[i][0])
						exce = exceTypeArr[i][1];
				}
				return exce;
			},
			align : 'center',
			width : 100
		},{
			id : 'exceptionDesc',
			header : fc['exceptionDesc'].fieldLabel,
			dataIndex : fc['exceptionDesc'].name,
			width : 180
		},{	
			id : 'excePassNum',
			header : fc['excePassNum'].fieldLabel,
			dataIndex : fc['excePassNum'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'center',
			width : 100
		},{
			id : 'applyInNum',
			header : fc['applyInNum'].fieldLabel,
			dataIndex : fc['applyInNum'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'center',
			width : 100
		},{
			id : 'excePassDate',
			header : fc['excePassDate'].fieldLabel,
			dataIndex : fc['excePassDate'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v ? v.dateFormat('Y-m-d') : '';
			},
			align : 'center',
			width : 100
		},{
			id : 'handleUser',
			header : fc['handleUser'].fieldLabel,
			dataIndex : fc['handleUser'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v == "" ? REALNAME : v;
			},
			align : 'center',
			width : 100
		},{
			id : 'handleProcess',
			header : fc['handleProcess'].fieldLabel,
			dataIndex : fc['handleProcess'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			width : 180
		},{
			id : 'remark',
			header : fc['remark'].fieldLabel,
			dataIndex : fc['remark'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			width : 180
		}
	]);
	var Columns = [
		{name:'uuid', type:'string'},
		{name:'uids',type: 'string'},
		{name:'pid', type:'string'},
		{name:'equType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'unit', type:'string'},
		{name:'boxinNum', type:'float'},
		{name:'realNum', type:'float'},
		{name:'passNum', type:'float'},
		{name:'exceNum', type:'float'},
		{name:'exception', type:'float'},
		{name:'exceType', type:'string'},
		{name:'exceptionDesc', type:'string'},
		{name:'excePassNum', type:'float'},
		{name:'weight', type:"float"},
		{name:'applyInNum', type:'float'},
		{name:'excePassDate', type:'date',dateFormat: 'Y-m-d H:i:s'},
		{name:'handleUser', type:'string'},
		{name:'handleProcess', type:'string'},
		{name:'remark', type:'string'}
	];
	
	dsAdnoral = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanName,
	    	business: business,
	    	method: listMethod,
	    	params: "uids not in(select boxSubId from EquGoodsStoreinSub  where pid='"+pid+"' and boxSubId<> ' ')" +
	    			" and exception ='1' and isStorein <> 1 and finished = '1' and pid='"+pid+"'"
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
    dsAdnoral.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    
    gridPanelAdnoral = new Ext.grid.GridPanel({
	    	ds : dsAdnoral,
			sm : smAdnoral,
			cm : cmAdnoral,
			header: false,
		    border: false,
		    region: 'center',
	        stripeRows:true,
	        loadMask : true,
		    viewConfig: {
		        forceFit: false,
		        ignoreAdd: true
		    },
			bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: PAGE_SIZE,
	            store: dsAdnoral,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	       })
    })
    dsAdnoral.load();
})