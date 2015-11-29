/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
// 全局变量
var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.contract.hbm.ConCla"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "claid"
var orderColumn = "conid"
var formPanelTitle = "新增一条记录"
var pageSize = 5;
var propertyName = "conid"
var propertyValue = conid;
var SPLITB = "`"
var pid = CURRENTAPPID;
var billTypes = new Array();
var compensateTypes = new Array(); 
var headerTitle = "合同："+ conname + " , 编号：" + conno + " ,所有赔偿记录"
var whereStr =propertyName+"='"+propertyValue+"'";
var outFilter ="1=1";
if(UIDS!=""){
	var len=UIDS.split(',');
	var str ="";
	for(var i=0;i<len.length;i++){
	    str+="'"+len[i]+"'";
	    if(i<len.length-1){
	       str+=","
	    }
	}
   outFilter=" claid in ("+str+")";
}
//是否禁用新增/修改/删除按钮
var btnDisabled =dyView=='true'?true:(ModuleLVL != '1');

Ext.onReady(function (){
    DWREngine.setAsync(false);  
	appMgm.getCodeValue('合同索赔类型',function(list){         //获取索赔类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			compensateTypes.push(temp);			
		}
    });
    appMgm.getCodeValue('单据状态',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		billTypes.push(temp);
    	}
    });     
    DWREngine.setAsync(true);
    
    var dspenaltytype = new Ext.data.SimpleStore({
        fields: ['k', 'v'],     
        data: compensateTypes
    });	 

	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			var url = BASE_PATH+"Business/contract/cont.generalInfo.input.jsp?";
			window.location.href = url + "isBack=1&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView+"&page="+page;
		}
	});
	
	var btnAdd = new Ext.Button({
	id: 'add',
	text: '新增',
	tooltip: '新增',
	iconCls: 'add',
	disabled : btnDisabled,
	handler: function(){
		var url = BASE_PATH+"Business/contract/cont.compensate.input.addorupdate.jsp?";
		window.location.href = url+ "conid="+conid+ "&conname=" +conname + "&conno=" + conno+"&modid="+MODID;
	}
	});
	// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'claid': {
			name: 'claid',
			fieldLabel: '索赔流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'clano': {
			name: 'clano',
			fieldLabel: '索赔编号',
			anchor:'95%'
         }, 'clatext': {
			name: 'clatext',
			fieldLabel: '索赔情况', 
			height: 120,
			allowBlank: false,       
			anchor:'95%'
         }, 'clawork': {
			name: 'clawork',
			fieldLabel: '索赔处理',
			height:200,          
			anchor:'95%'
         }, 'clamoney': {
			name: 'clamoney',
			fieldLabel: '索赔金额', 
			allowNegative:false,  
			allowBlank: false,       
			anchor:'95%'
         }, 'clatype': {
			name: 'clatype',
			fieldLabel: '索赔类型',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选择违约类型...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dspenaltytype,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            maxValue: 100000000,   
            allowBlank: false,        
			anchor:'95%'
         },'cladate': {
			name: 'cladate',
			fieldLabel: '索赔日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            allowBlank: false,  
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '索赔附件流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
         }   
    }

    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true,
           width: 120
        },{
           id:'claid',
           header: fc['claid'].fieldLabel,
           dataIndex: fc['claid'].name,  
           hidden: true, 
           width: 110
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           header: fc['filelsh'].fieldLabel,
           dataIndex: fc['filelsh'].name,
           width: 90,
           hidden:true
           
        },{
           header: fc['clano'].fieldLabel,
           dataIndex: fc['clano'].name,
           align : 'center',
           width: 120,
           renderer: renderClano
        },{
           header: fc['cladate'].fieldLabel,
           dataIndex: fc['cladate'].name,
           width: 120,
           align : 'center',
           renderer: formatDate
        },{
           header: fc['clamoney'].fieldLabel,
           dataIndex: fc['clamoney'].name,
           width: 90,
           align:'right',
           allowNegative:false,
           renderer: cnMoneyToPrec
        },{
           header: fc['clatype'].fieldLabel,
           dataIndex: fc['clatype'].name,
           align : 'center',
           width: 120,
           renderer : function (v){
               for(var i=0;i<dspenaltytype.getCount();i++){
                   if(dspenaltytype.getAt(i).get('k')==v)
                   return dspenaltytype.getAt(i).get('v');
               }
           }
        },{
           header : fc['billstate'].fieldLabel,
           dataIndex :fc['billstate'].name,
           align : 'center',
           width: 120,
           renderer : function (v){
               for(var i=0;i<billTypes.length;i++){
                   if(v==billTypes[i][0]){
                       return billTypes[i][1]
                   }
               }
           }
        }
      
    ]);
    cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'claid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'clano', type: 'string'},    	
		{name: 'clamoney', type: 'float'},
		{name: 'clatype', type: 'string'},
		{name: 'cladate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'filelsh', type: 'string'},
		{name :'billstate',type:'string'}
		];
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {pid:pid, conid: conid,clano:'',clamoney:0,clatype:'',filelsh:''}	//设置初始值   
      
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: whereStr,
	    	outFilter :outFilter
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: ServletUrl
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.GridPanel({
        // basic properties
    	id: 'grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        height: 300,				//高
        iconCls: 'icon-show-all',	//面板样式
        border: false,				// 
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: pageSize,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
   });
    
  
    
  
  grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(grid, rowIndex, e){
		e.stopEvent();
		grid.getSelectionModel().selectRow(rowIndex);
		var record = grid.getStore().getAt(rowIndex);
		var data = record.get("conid");
		//alert(data)
		//alert(record.get("claid"))
	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
	        			id: 'menu_add',
		                text: '　新增',
		                value: record,
		                iconCls: 'add',
		                disabled: btnDisabled,
		                handler : toHandler
                    },{
                    	id: 'menu_edit',
		                text: '　修改',
		                value: record,
		                iconCls: 'btn',
		                disabled: btnDisabled,
		                handler : toHandler
                    },{
                    	id: 'menu_del',
		                text: '　删除',
		                value: record,
		                disabled: btnDisabled,
		                iconCls: 'multiplication',
		                handler : toHandler
                	}, '-', {
	        			id: 'menu_view',
		                text: '　查看',
		                value: record,
		                iconCls: 'form',
		                handler : toHandler
                    }]
	    });
	
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}

	function toHandler(){
		var state = this.id;
		var menu_conid = this.value;
		var url = BASE_PATH+"Business/contract/cont.compensate.input.addorupdate.jsp?";
		var processbar;
    	var timer;
		if ("" != state){
		    
		    if ("menu_view" == state){
		    	window.location.href = BASE_PATH+"Business/contract/cont.compensate.view.jsp?claid="  
		    		+ this.value.get("claid") + "&conid=" + this.value.get("conid") + "&conname=" + conname + "&conno=" + conno+"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;
			}else if ("menu_add" == state){
				window.location.href = url+ "conid="+this.value.get("conid")+ "&conname=" +conname + "&conno=" + conno+"&modid="+MODID;
			}else if ("menu_edit" == state){
				window.location.href = url + "claid="  + this.value.get("claid") + "&conid="+this.value.get("conid")
					+ "&conname=" +conname + "&conno=" + conno+"&modid="+MODID; 
				
			}else if ("menu_del" == state){

				Ext.Msg.show({
					title: '提示',
					msg: '是否要删除?　　　　',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							Ext.get('loading-mask').show();
							Ext.get('loading').show();
							conclaMgm.deleteConCla( menu_conid.get("claid"),MODID, function(flag){
								Ext.get('loading-mask').hide();
								Ext.get('loading').hide();
								if ("0" == flag){
									Ext.example.msg('删除成功！', '您成功删除了一条合同索赔信息！');
							   		reload()
								}else if ("1" == flag){
									Ext.Msg.show({
										title: '提示',
										msg: '数据删除失败！',
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
								}else{
									Ext.Msg.show({
										title: '提示',
										msg:flag,
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									})
								};
							});	
						}
					}
					  
				});
			
				
			}else{return}
		}
	}

	
   
    // 7. 创建内容面板content-panel，加入grid-panel和form-panel
    var contentPanel = new Ext.Panel({
        id:'content-panel',
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[grid]
    });
    
	// 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [contentPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [contentPanel]
        });
    }
    
    grid.getTopToolbar().add({
					text: '<font color=#15428b><b>&nbsp;'+headerTitle+'</b></font>',
					iconCls: 'title'
				})
    grid.getTopToolbar().add('->')
    grid.getTopToolbar().add(btnAdd);
    grid.getTopToolbar().add('-');
	grid.getTopToolbar().add(btnReturn);
    
	// 11. 事件绑定
	
   	
    // 12. 加载数据
  
	    ds.load();

    
    
    // 13. 其他自定义函数，如格式化，校验等
	function reload(){
		ds.load();
	}
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
     
    function renderClano(value, metadata, record){
	var getConid = record.get('conid');
	var getClaid = record.get('claid');
	var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
	output += 'onmouseout="this.style.cursor = \'default\';"'
	output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
	output += 'window.location.href=\''+BASE_PATH
	output += 'Business/contract/cont.compensate.view.jsp?conid='+getConid+'&claid='+getClaid+'&conname='+conname+'&conno='+conno+'&uids'+UIDS+'&conids='+CONIDS+'&optype='+OPTYPE+'&dyView='+dyView+'\'">'+ value+'</span>'
	return output;
	}
     
 	
});




