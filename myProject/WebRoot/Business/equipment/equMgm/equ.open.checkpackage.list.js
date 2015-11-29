//设备开箱通知单弹出框
var beanNotice = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenbox";
var businessNotice = "baseMgm"
var listMethodNotice = "findWhereOrderby"
var primaryKeyNotice = "uids"
var orderColumnNotice = "uids"
var gridPanelNotice;
var getKxNotice = '';
var pid = CURRENTAPPID;
var dsNotice ;

Ext.onReady(function(){

			//TODO : ======选择开箱通知单======
   var fcNotice = {
				'uids' : {	name : 'uids',	fieldLabel : '主键'},
				'pid' : {	name : 'pid',	fieldLabel : 'PID'},
				'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
				'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
				'finished' : {name : 'finished',fieldLabel : '完结'},
				'isStorein' : {name : 'isStorein',fieldLabel : '是否入库'},
				'openNo' : {name : 'openNo',fieldLabel : '开箱单号'},
				'openDate' : {name : 'openDate',fieldLabel : '开箱日期'},
				'noticeId' : {name : 'noticeId',fieldLabel : '通知单主键'},
				'noticeNo' : {name : 'noticeNo',fieldLabel : '通知单号'},
				'openPlace' : {name : 'openPlace',fieldLabel : '开箱地点'},
				'openUser' : {name : 'openUser',fieldLabel : '开箱参加人员'},
				'ownerNo' : {name : 'ownerNo',fieldLabel : '业主单号'},
				'openDesc' : {name : 'openDesc',fieldLabel : '验收描述'},
				'remark' : {name : 'remark',fieldLabel : '备注'}
	}
	
	var smNotice = new Ext.grid.CheckboxSelectionModel({});
	
	var cmNotice = new Ext.grid.ColumnModel([
		smNotice,
		{
			id:'uids',
			header: fcNotice['uids'].fieldLabel,
			dataIndex: fcNotice['uids'].name,
			hidden: true
		},{
			id:'pid',
			header: fcNotice['pid'].fieldLabel,
			dataIndex: fcNotice['pid'].name,
			hidden: true
		},{
			id:'conid',
			header: fcNotice['conid'].fieldLabel,
			dataIndex: fcNotice['conid'].name,
			hidden: true
		},{
			id:'treeuids',
			header: fcNotice['treeuids'].fieldLabel,
			dataIndex: fcNotice['treeuids'].name,
			hidden: true
		},{
			id:'finished',
			header: fcNotice['finished'].fieldLabel,
			dataIndex: fcNotice['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isStorein");
				var str = "<input type='checkbox' "+(o==1?"disabled title='已入库，不能取消完结' ":"")
				          +" "+(v==1?"checked title='已完结' ":"title='未完结'")
				          +" onclick='finishOpenbox(\""+r.get("uids")+"\",this)'>"
				return str;
			},
			width : 40,
		    hidden: true
		},{
			id:'isStorein',
			header:fcNotice['isStorein'].fieldLabel,
			dataIndex: fcNotice['isStorein'].name,
			hidden: true
		},{
			id:'openNo',
			header: fcNotice['openNo'].fieldLabel,
			dataIndex: fcNotice['openNo'].name,
			width : 180
		},{
			id:'openDate',
			header: fcNotice['openDate'].fieldLabel,
			dataIndex: fcNotice['openDate'].name,
			renderer : formatDateTime,
			align : 'center',
			width : 80
		},{
			id:'noticeId',
			header: fcNotice['noticeId'].fieldLabel,
			dataIndex: fcNotice['noticeId'].name,
			hidden: true
		},{
			id:'noticeNo',
			header: fcNotice['noticeNo'].fieldLabel,
			dataIndex: fcNotice['noticeNo'].name,
			width : 180
		},{
			id:'openPlace',
			header: fcNotice['openPlace'].fieldLabel,
			dataIndex: fcNotice['openPlace'].name,
			width : 180
		},{
			id:'openUser',
			header: fcNotice['openUser'].fieldLabel,
			dataIndex: fcNotice['openUser'].name,
			width : 180
		},{
			id:'openDesc',
			header: fcNotice['openDesc'].fieldLabel,
			dataIndex: fcNotice['openDesc'].name,
			width : 180
		},{
			id:'ownerNo',
			header: fcNotice['ownerNo'].fieldLabel,
			dataIndex: fcNotice['ownerNo'].name,
			width : 160
		},{
			id:'remark',
			header: fcNotice['remark'].fieldLabel,
			dataIndex: fcNotice['remark'].name,
			width : 180
		}
	]);
	
	var ColumnsNotice = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isStorein', type : 'float'},
		{name : 'openNo', type : 'string'},
		{name : 'openDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'noticeId', type : 'string'},
		{name : 'noticeNo', type : 'string'},
		{name : 'openPlace', type : 'string'},
		{name : 'openUser', type : 'string'},
		{name : 'openDesc', type : 'string'},
		{name : 'ownerNo', type : 'string'},
		{name : 'remark', type : 'string'}
     ];

    dsNotice = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',
		    	bean: beanNotice,				
		    	business: businessNotice,
		    	method: listMethodNotice,
		    	//params: "conid='"+edit_conid+"'"
		    	params: "open_no not in (select noticeNo from EquGoodsStorein t " +
		    			"where pid='"+pid+"' and NOTICE_NO <>' ') " +
		    			"and finished='1' and isStorein <>1 and pid='"+pid+"'"
			},
	        proxy: new Ext.data.HttpProxy({
	            method: 'GET',
	            url: MAIN_SERVLET
	        }),
	        reader: new Ext.data.JsonReader({
	            root: 'topics',
	            totalProperty: 'totalCount',
	            id: primaryKeyNotice
	        }, ColumnsNotice),
	        remoteSort: true,
	        pruneModifiedRecords: true	
	    });
   dsNotice.setDefaultSort(orderColumnNotice, 'asc');
	
   gridPanelNotice = new Ext.grid.GridPanel({
		ds : dsNotice,
		sm : smNotice,
		cm : cmNotice,
		title : '开箱检验单',
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
            store: dsNotice,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
   dsNotice.load();
   
   function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
    };
})