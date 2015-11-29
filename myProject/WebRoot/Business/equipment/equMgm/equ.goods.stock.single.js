var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStock";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

var selectTreeid = "";
var selectUuid = "";
var selectConid = "";
var selectParentid = "";
var fileWin;
var equTypeArr = new Array();
var getEquidstore = new Array();
var ds;
var dsSub;
var jzArr = new Array();
Ext.onReady(function(){
	var fm = Ext.form;
	DWREngine.setAsync(false);
	//机组号
	appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			jzArr.push(temp);			
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
	baseMgm.getData("select uids,equno from equ_warehouse where pid='" + CURRENTAPPID
					+ "' order by uids ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					getEquidstore.push(temp);
				}
			})
	//合同列表
	var conArr=new Array();
	var sql = "select c.conid,c.conname  from Equ_Cont_View c";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			conArr.push(temp);			
		}
	});
	DWREngine.setAsync(true);
	var equTypeDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: equTypeArr
    });
    //查询表单
    var boxNo = new Ext.form.TextField({
		id: 'boxNo', name: 'boxNo'
	});
	var equPartName = new Ext.form.TextField({
		id: 'equPartName', name: 'equPartName'
	});
	var ggxh = new Ext.form.TextField({
		id: 'ggxh', name: 'ggxh'
	});
	var doSelect = new Ext.Button({
		text: '查询',
		iconCls: 'btn',
		handler: selHandler
	});

	function selHandler(){
		var querywheres="";
		var qboxNo = boxNo.getValue();
		var qequPartName = equPartName.getValue();
		var qggxh = ggxh.getValue();
		if ('' != qboxNo){
			querywheres += " and boxNo like '%"+qboxNo+"%'";
		}
		if ('' != qequPartName){
			querywheres += " and equPartName like '%"+qequPartName+"%'";
		}
		if ('' != qggxh){
			querywheres += " and ggxh like '%"+qggxh+"%'";
		}
		if(selectParentid!=null&&selectParentid!=""){
			if(selectParentid == "0"){
				ds.baseParams.params = "pid='"+CURRENTAPPID+"' and treeuids not in (" + notreeuuidstr +
						") and conid='"+selectConid+"'"+querywheres;
				ds.reload();
			}else{
				//以04开头的为技术资料
				if(selectTreeid.indexOf("04")== 0){
					var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
							"?uuid="+selectUuid+"&conid="+selectConid+"&edit=false";
					fileWin = new Ext.Window({
						width: 950,
						height: 500,
						modal: true, 
						plain: true, 
						border: false, 
						resizable: false,
						layout : 'fit',
						html:"<iframe id='fileWinFrame' src='' width='100%' height='100%' frameborder='0'></iframe>",
						listeners : {
							'show' : function(){
								fileWinFrame.location.href  = url;
							}
						}
				    });
					fileWin.show();
				}else{
					//查询当前选中节点的所有子节点主键。
					var sql = "select a.uuid from (select t.* from equ_type_tree t" +
							" where t.conid = '"+selectConid+"' and t.uids not in ("+notreeuuidstr+")) a start with a.treeid ="+
							" (SELECT t.treeid from equ_type_tree t where t.uuid = '"+selectUuid+"')" +
							" connect by PRIOR  a.treeid =  a.parentid";
					var treeuuidstr = "";
					DWREngine.setAsync(false);
					baseDao.getData(sql,function(list){
						for(i = 0; i < list.length; i++) {
							treeuuidstr += ",'"+list[i]+"'";		
						}
					});	
					DWREngine.setAsync(true);
					treeuuidstr = treeuuidstr.substring(1);
					ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+
						"' and treeuids in ("+treeuuidstr+")"+querywheres;
					ds.reload();
				}
			}
		}else{
			ds.baseParams.params = "pid='"+CURRENTAPPID+"' and treeuids not in (" +  notreeuuidstr + ")" + querywheres;
		    ds.reload();
		}
	}
	
    var fc = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号'
		},
		'warehouseName' : {
			name : 'warehouseName',
			fieldLabel : '设备部件名称'
		},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'conid' : {name : 'conid',fieldLabel : '合同名称'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equType' : {
			name : 'equType',
			fieldLabel : '设备类型',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: equTypeDs
		},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'stockNum' : {name : 'stockNum',fieldLabel : '库存数量'},
		'weight' : {name : 'weight',fieldLabel : '重量（kg）',decimalPrecision : 3},
		'storage' : {name : 'storage',fieldLabel : '存放库位'}
	};
	var cm = new Ext.grid.ColumnModel([
		{
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
			id : 'treeuids',
			header : fc['treeuids'].fieldLabel,
			dataIndex : fc['treeuids'].name,
			hidden : true
		},{
			id : 'boxNo',
			header : fc['boxNo'].fieldLabel,
			dataIndex : fc['boxNo'].name,
			align : 'center',
			width : 100,
			type : 'string'
		},{
			id : 'equType',
			header : fc['equType'].fieldLabel,
			dataIndex : fc['equType'].name,
			renderer : function(v,m,r){
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
			id : 'conid',
			header : fc['conid'].fieldLabel,
			dataIndex : fc['conid'].name,
			width : 180,
			renderer : function(v,m,r){
				var conid = r.get('conid');
			    var conname;
				for(var i=0;i<conArr.length;i++){
					if(conid == conArr[i][0]){
						conname = conArr[i][1];
						break;
					}
				}
				var qtip = "qtip=" + conname;
  				return'<span ' + qtip + '>' + conname + '</span>';
//				var output ="<a title='"+conname+"' style='color:blue;' " +
//						"href=Business/contract/cont.generalInfo.view.jsp?conid="+conid+"&query=true\>"+conname+"</a>"		
//				return output;           
           },
           type : 'string'
		}, {
			id : 'jzNo',
			header : fc['jzNo'].fieldLabel,
			dataIndex : fc['jzNo'].name,
			align : 'center',
			width : 100	,
			renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			}
		},{
			id : 'equPartName',
			header : fc['equPartName'].fieldLabel,
			dataIndex : fc['equPartName'].name,
			align : 'center',
			width : 180,
			type : 'string'
		},{
			id : 'ggxh',
			header : fc['ggxh'].fieldLabel,
			dataIndex : fc['ggxh'].name,
			align : 'center',
			width : 100,
			type : 'string'
		},{
			id : 'graphNo',
			header : fc['graphNo'].fieldLabel,
			dataIndex : fc['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fc['unit'].fieldLabel,
			dataIndex : fc['unit'].name,
			width : 80
		},{
			id : 'stockNum',
			header : fc['stockNum'].fieldLabel,
			dataIndex : fc['stockNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'weight',
			header : fc['weight'].fieldLabel,
			dataIndex : fc['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'storage',
			header : fc['storage'].fieldLabel,
			dataIndex : fc['storage'].name,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<getEquidstore.length;i++){
					if(v == getEquidstore[i][0])
						storage = getEquidstore[i][1];
				}
				return storage;
			},
			align : 'center',
			width : 80
		}
	]);
	var Columns = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'conid', type:'string'},
		{name:'treeuids', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equType', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'stockNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'storage', type:'string'},
		{name:'jzNo', type:'string'}
	];
	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: "pid='"+CURRENTAPPID+"' and treeuids not in (" + notreeuuidstr + ")"
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
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    ds.on("beforeload", function() {
		if (ds.baseParams.params != "") {// 过滤出库单已经选中的设备
			ds.baseParams.params += " and stockNum>0 and (judgment='equ' or judgment is null)";
		} else {
			ds.baseParams.params = "pid='" + CURRENTAPPID + "' and treeuids not in ("
					+ notreeuuidstr + ") and stockNum>0  and (judgment='equ' or judgment is null)";
		}
	});

    var gridPanel = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		border: false, 
		region: 'center',
		header: false, 
		tbar:['<font color=#15428b><B>设备库存(专用工具及备品备件)<B></font>','-'],
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanel]
	});
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [treePanel, contentPanel]
	});
	gridPanel.getTopToolbar().add({
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow_
	});
	function showWindow_(){showWindow(gridPanel)};
	ds.load({params:{start:0,limit:PAGE_SIZE}});
});