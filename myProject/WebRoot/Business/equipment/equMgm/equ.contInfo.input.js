﻿var bean = "com.sgepit.pmis.equipment.hbm.EquContView"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"

var partBs= new Array();
var BillState = new Array();
var contSort2 = new Array();

var selectWin;
var ds;

Ext.onReady(function (){
    DWREngine.setAsync(false);
	//合同分类二
    appMgm.getCodeValue("设备合同", function(list){
    	for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			contSort2.push(temp);
		}
    });
    
	//获取乙方单位(供货厂家)
	conpartybMgm.getPartyB(function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });
	
    //获取合同状态
    appMgm.getCodeValue('合同状态',function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			BillState.push(temp);			
		}
    }); 
  	DWREngine.setAsync(true);		
    var contSort2Ds = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : contSort2
	})  
    var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true})

    var fc = {
         'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			anchor:'95%'
         }, 'conno': {
			name: 'conno',
			fieldLabel: '合同编号',
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称',
			anchor:'95%'
         },'sort' : {
         	name : 'sort',
         	fieldLabel : '合同分类二',
         	anchor:'95%'
         },'conmoney': {
			name: 'conmoney',
			fieldLabel: '合同总金额',
			anchor:'95%'
         }, 'partybno': {
			name: 'partybno',
			fieldLabel: '供货厂家',
			anchor:'95%'
         },'equnum': {
			name: 'equnum',
			fieldLabel: '设备数量',
			anchor:'95%'
         },'receivedate': {
			name: 'receivedate',
			fieldLabel: '合同接收日期',
			anchor:'95%'
         },'planuser': {
			name: 'planuser',
			fieldLabel: '责任计划员',
			anchor:'95%'
         },'storageuser': {
			name: 'storageuser',
			fieldLabel: '责任库管员',
			anchor:'95%'
         },'deliverylimit': {
			name: 'deliverylimit',
			fieldLabel: '交货期限',
			anchor:'95%'
         }
    }

    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true
        },{
           id:'conno',
           header: fc['conno'].fieldLabel,
           dataIndex: fc['conno'].name,
           width: 130,
           type:"string"
        },{
           id: 'conname',
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           renderer : function(v,m,r){
				var conid = r.get('conid');
				var output ="<a title='"+v+"' style='color:blue;' " +
						"href=Business/contract/cont.generalInfo.view.jsp?conid="+conid+"&query=true\>"+v+"</a>"		
				return output;           
           },
           width: 240,
           type:"string"
        },{
        	id : 'sort',
        	header: fc['sort'].fieldLabel,
           	dataIndex: fc['sort'].name,
           	store:contSort2Ds,
           	renderer : sortRender,
           	align: 'center',
           	width: 80,
           	type:"combo"
        },{
           id: 'partybno',
           header: fc['partybno'].fieldLabel,
           dataIndex: fc['partybno'].name,
           renderer: partbRender,
           width: 220
        },{
           id: 'conmoney',
           header: fc['conmoney'].fieldLabel,
           dataIndex: fc['conmoney'].name,
           renderer: cnMoney,
           align: 'right',
           width: 120
        },{
         id: 'equnum',
           header: fc['equnum'].fieldLabel,
           dataIndex: fc['equnum'].name,
           align: 'right',
           width: 70
        },{
        	 id: 'receivedate',
           header: fc['receivedate'].fieldLabel,
           dataIndex: fc['receivedate'].name,
           renderer : formatDate,
           align: 'center',
           width: 120
        },{
        	 id: 'planuser',
           header: fc['planuser'].fieldLabel,
           dataIndex: fc['planuser'].name,
           align: 'center',
           width: 120,
           type:"string"
        },{
        	 id: 'storageuser',
           header: fc['storageuser'].fieldLabel,
           dataIndex: fc['storageuser'].name,
           align: 'center',
           width: 120,
           type:"string"
        },{
        	 id: 'deliverylimit',
           header: fc['deliverylimit'].fieldLabel,
           dataIndex: fc['deliverylimit'].name,
           align: 'center',
           renderer : function(v,m,r){
           		if(v == "0"){
           			return "<a href='javascript:void(0)' style='color:gray;'>查看[0]</a>";
           		}else{
           			return "<a href='javascript:openJzTab(\""+r.get('conid')+"\",1)' style='color:blue;'>查看["+v+"]</a>";
           		}
           },
           width: 120
        }
    ]);
    cm.defaultSortable = true;

    var Columns = [
    	{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'conno', type: 'string'},    	
		{name: 'conname', type: 'string'},
		{name: 'sort', type: 'string'},
    	{name: 'partybno', type: 'string'},
		{name: 'conmoney', type: 'float'},
		{name: 'equnum', type: 'float'},
		{name: 'receivedate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'planuser', type: 'string'},
		{name: 'storageuser', type: 'string'},
		{name: 'deliverylimit', type: 'string'}
	];
    
    // 4. 创建数据源
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: "pid='"+CURRENTAPPID+"'"
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
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    
    var viewBtn = new Ext.Button({
    	id : 'viewBtn',
    	text : '查看',
    	iconCls : 'form',
    	handler : btnFun
    });
    
    var editBtn = new Ext.Button({
    	id : 'editBtn',
    	text : '信息维护',
    	iconCls : 'btn',
    	handler : btnFun
    })
    
    function btnFun(m){
		var record = sm.getSelected();
		if(record == null){
			Ext.Msg.alert('提示信息','请先选择一条合同信息');
	    	return ;
		}
		var btnId = this.id;
		var conid = record.get('conid');
		var url = BASE_PATH+"Business/contract/cont.generalInfo.view.jsp?conid="+conid+"&query=true";
		if(m == "dbl" || btnId == 'viewBtn'){
			window.location.href = url;
		}else if(btnId == 'editBtn'){
			openJzTab(conid,0);
		}
    }
    
    
    var contGridPanel = new Ext.grid.GridPanel({
	    ds: ds,
	    cm: cm,
	    sm: sm,
	    tbar : ['<font color=#15428b><B>设备合同信息<B></font>','-',viewBtn,'-',editBtn,'-'],
	    header: false,
	    border: false,
	    layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
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
        listeners : {
        	"dblclick" : function(){
        		//btnFun("dbl");
        	}
        }
	});

	// 10. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [contGridPanel]
    });
    contGridPanel.getTopToolbar().add({
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow_
	});
    ds.load({params:{start: 0,limit: PAGE_SIZE}});
    function showWindow_(){showWindow(contGridPanel)};
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };

   	//乙方单位
   	function partbRender(value){
   		var str = '';
   		for(var i=0; i<partBs.length; i++) {
   			if (partBs[i][0] == value) {
   				str = partBs[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	//合同分类二
	function sortRender(value){
   		var str = '';
   		for(var i=0; i<contSort2.length; i++) {
   			if (contSort2[i][0] == value) {
   				str = contSort2[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	// 合同状态
   	function BillStateRender(value){
   		var str = '';
   		for(var i=0; i<BillState.length; i++) {
   			if (BillState[i][0] == value) {
   				str = BillState[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
});

    function openJzTab(conid,view){
    	var url = BASE_PATH+"Business/equipment/equMgm/equ.contInfo.edit.jsp?conid="+conid+"&view="+view;
		//window.location.href = url;
		selectWin = new Ext.Window({
			width: 800,
			height: 460,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			html:"<iframe id='equContFrame' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(){
					ds.reload();
				},
				'show' : function(){
					equContFrame.location.href  = url;
				}
			}
	    });
		selectWin.show();
    }