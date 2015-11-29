var bean = "com.sgepit.pmis.equipment.hbm.EquList"
var uuid;
var bean = "com.sgepit.pmis.equipment.hbm.EquList"
var business = "baseMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "sbId"
var orderColumn = "sbBm"
var gridfiter = "conid='"+conid+"'"
if(selectedSb !=")"){
	gridfiter += " and sb_id not in " + selectedSb
}
Ext.onReady(function (){
	var	btnConfirm = new Ext.Button({
		text: '确定',
		iconCls : 'save',
		handler: confirmChoose
	})
     
    var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			parent.selectWindow.hide();	
		}
	 });
    sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	
	
	var cm = new Ext.grid.ColumnModel([
		sm,{
			id:'sbId',
			header:"设备ID",
			dataIndex: "sbId",
			hidden:true
		},{
			id:'sbBm',
			header:"设备编码",
			dataIndex: "sbBm"
		},{
			id:'sbMc',
			header:"设备名称",
			dataIndex:"sbMc"
		},{
			id:'ggxh',
			header:"规格型号",
			dataIndex: "ggxh"
		}
	]);	
	// 3. 定义记录集
    var Columns = [
    	{name: 'sbId', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'sbBm', type: 'string'},
		{name: 'sbMc', type: 'string'},    	
		{name: 'ggxh', type: 'string'}]
	// 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: gridfiter
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'sbId'
        }, Columns),
        remoteSort: true
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
  	var grid = new Ext.grid.QueryExcelGridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    title: "test",
	    iconCls: 'icon-show-all',
	    border: false,
	    layout: 'fit',
	    region: 'center',
	    header: false,
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,			//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    tbar: [btnConfirm,btnReturn],
	    width:800,
	    height:300
	})
	 var viewport = new Ext.Viewport({
        layout:'border',
        items: [grid]
    });
    ds.load()
 });
	
function confirmChoose(){
	var recs = sm.getSelections()
	if(recs==null || recs.length==0){
		Ext.Msg.alert("提示","您未选择任何设备，请选择到货设备!")
		return;
	}
   	DWREngine.setAsync(false);  
   	var selectSbIds = new Array();
   	for(var i=0;i<recs.length;i++){
   		selectSbIds[i] = recs[i].data.sbId
   	}
   	equlistMgm.saveSelectEquArr(conid,ggid, selectSbIds,partB, function(){
		
	}); 	     
	DWREngine.setAsync(true);
	parent.selectWindow.hide();		
}