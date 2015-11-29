var bean = "com.sgepit.pmis.contract.hbm.ConOveView"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var gridPanelTitle = "所有记录"
var propertyName = "condivno"
var propertyValue = "1"
var SPLITB = "`"
var partBs= new Array();
//var contractType = [['-1','所有合同'],['GC','工程合同分类'],['SB','设备合同分类'],['QT','其它合同分类']];
var contractType = new Array();
var contarctType2 = new Array();
var BillState = new Array();
//var contractType= [['01', '工程合同'],['02', '其他合同'],['03', '总承包合同'],['04', '设备(自营)合同'],['05','前期合同'],['06', '设备(总包)合同'],['-1', '所有合同']];
//var BillState = [[1,'合同签订'],[2,'合同执行'],[3,'付款完成'],[4,'合同结算'],[5,'终止合同']];
var dsCombo2 = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: [['','']]
});
var contSort2_gc = new Array();
var contSort2_sb = new Array();
var contSort2_qt = new Array();
var flowWindow;
var gridfliter = "",paramsStr="";
var currentPid = CURRENTAPPID;
var dsflag=false; //默认没有选择触发
Ext.onReady(function (){
	contractType.push(['-1','所有合同']);
	contSort2_gc.push(['-1','所有合同']);
	contSort2_sb.push(['-1','所有合同'])	;
	contSort2_qt.push(['-1','所有合同'])	;
	
	//根据PID过滤合同
	gridfilter = "pid = '" + currentPid +  "'";
	
	DWREngine.setAsync(false);  
	DWREngine.beginBatch(); 
	conpartybMgm.getPartyB(function(list){         //获取乙方单位
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });
	appMgm.getCodeValue('合同划分类型',function(list){         //获取合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contractType.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同状态',function(list){         //获取合同状态
    	if(list!=null&&list.length>0){
		var temp = new Array();
		temp.push('-1');
	     temp.push('所有状态');
	     BillState.push(temp);
		} 
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			BillState.push(temp);			
		}
    }); 
    
    appMgm.getCodeValue('工程合同分类',function(list){         //获取工程合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contSort2_gc.push(temp);			
		}
    });     
    
    appMgm.getCodeValue('设备合同分类',function(list){         //获取设备合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contSort2_sb.push(temp);			
		}
    });      
    appMgm.getCodeValue('其它合同分类',function(list){         //获取设备合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contSort2_qt.push(temp);			
		}
    });      
    
    DWREngine.endBatch();
  	DWREngine.setAsync(true);	
    
	var dsPartB = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: partBs
    });
    
    var dsContractType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:contractType
    });
    
    var dsBillState = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:BillState
    });
      
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

   var fc = {		// 创建编辑域配置
    	 	'conid': {
			name: 'conid',
			fieldLabel: '主键',
			anchor:'95%',
			hidden: true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			hidden: true,
			hideLabel:true,
			anchor:'95%'
         }, 'conno': {
			name: 'conno',
			fieldLabel: '合同编号',
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称',
			anchor:'95%'
         },'signdate': {
			name: 'signdate',
			fieldLabel: '签订日期',
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         },'conmoney': {
			name: 'conmoney',
			fieldLabel: '合同签定金额',
			anchor:'95%'
         },'convaluemoney': {
			name: 'convaluemoney',
			fieldLabel: '合同总金额',
			anchor:'95%'
         }, 'partybno': {
			name: 'partybno',
			fieldLabel: '乙方单位',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsPartB,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         },'billstate': {
			name: 'billstate',
			fieldLabel: '合同状态',
			readOnly : true,
			valueField:'k',
			displayField: 'v',
			emptyText:'合同审定', 
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsBillState,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            hidden: true,
			hideLabel:true,
			anchor:'95%'
         },'isChange': {
			name: 'isChange',
			fieldLabel: '是否变更',
			hidden: true,
			hideLabel:true,
			anchor:'95%'
         }
    }
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'conid',
           type: 'string',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true
        },{
           id:'pid',
           type: 'string',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true
        },{
           id:'conno',
           type: 'string',
           header: fc['conno'].fieldLabel,
           dataIndex: fc['conno'].name,
           width: 60,
           renderer: renderConno
        },{
           id: 'conname',
           type: 'string',
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           width: 120
        },{
           id: 'partybno',
           type: 'combo',
           header: fc['partybno'].fieldLabel,
           dataIndex: fc['partybno'].name,
           width: 120,
           renderer: partbRender,
           store: dsPartB
        },{
           id: 'conmoney',
           type: 'float',
           header: fc['conmoney'].fieldLabel,
           dataIndex: fc['conmoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoney
        },{
           id: 'convaluemoney',
           type: 'float',
           header: fc['convaluemoney'].fieldLabel,
           dataIndex: fc['convaluemoney'].name,
           width: 70,
           align: 'right',
           renderer: isChange
        },{
           id: 'signdate',
           type: 'date',
           header: fc['signdate'].fieldLabel,
           dataIndex: fc['signdate'].name,
           width: 90,
           renderer: formatDate
        },{
           id: 'billstate',
           type: 'combo',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           disabled : true,
           width: 40,
           renderer: BillStateRender,
           store: dsBillState
        },{
           id: 'isChange',
           header: fc['isChange'].fieldLabel,
           dataIndex: fc['isChange'].name,
           hidden: true
        }
      
    ]);
    cm.defaultSortable = true;   						//设置是否可排序

    // 3. 定义记录集
     var Columns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conno', type: 'string'},    	
		{name: 'conname', type: 'string'},
    	{name: 'partybno', type: 'string'},
		{name: 'conmoney', type: 'float'},
		{name: 'convaluemoney', type: 'float'},
		{name: 'billstate', type: 'string'},
		{name: 'isChange', type: 'string'},
		{name: 'signdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
	
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: gridfilter
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'cpid'
        }, Columns),
		//sortInfo:{field:'conid',direction:'DESC'},
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    // 在grid的tbar上增加 ComboBox
    var combo = new Ext.form.ComboBox({
        store: dsContractType,
        displayField:'v',
        valueField:'k',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'选择合同分类....',
        selectOnFocus:true,
        width:135
    });
	combo.on('select',comboselect);   

    var combo2 = new Ext.form.ComboBox({
	    store: dsCombo2,
	    displayField:'v',
	    valueField:'k',
	    typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    emptyText:'选择合同分类二....',
	    selectOnFocus:true,
	    disabled:true,
	    width:135
    });	
	combo2.on('select',comboselect2); 
	
    function comboselect(){
    	dsflag=true;
    	combo2.clearValue();
    	combo2.setDisabled(true);       	
    	var conDiv = combo.getValue();
    	var conDivDesc = combo.getRawValue();
    	var state=" and 1=1";
    	var conDiv3 = combo3.getValue();
    	if(conDiv3!="-1"&&conDiv3!=""){
		state= " and "+"billstate='" + conDiv3 + "'";
		} 
	     if (conDiv == "-1") {
	    	ds.baseParams.params = gridfilter+state;
	    } else {
	    	ds.baseParams.params = gridfilter + " and " +propertyName+"='"+conDiv+"'"+state;
	    	
	    	DWREngine.setAsync(false);	
	    	contarctType2 = new Array();
	    	contarctType2.push(['-1','所有合同'])
	    	appMgm.getCodeValue(conDivDesc,function(list){         //获取工程合同划分类型	    	
				for(i = 0; i < list.length; i++) {
					var temp = new Array();	
					temp.push(list[i].propertyCode);		
					temp.push(list[i].propertyName);	
					contarctType2.push(temp);			
				}
		    }); 
		    if(conDiv != "-1" && contarctType2.length>0){
		    	dsCombo2.loadData(contarctType2);
			    combo2.setDisabled(false)		
		    }
	    	DWREngine.setAsync(true);
	    	/*
			if(conDiv == 'GC'&&contSort2_gc.length>0){
				dsCombo2.loadData(contSort2_gc);
			    combo2.setDisabled(false)	
			}else if(conDiv == 'SB'&&contSort2_sb.length>0){
				dsCombo2.loadData(contSort2_sb);
			    combo2.setDisabled(false)		 				
			}else if(conDiv == 'QT'&&contSort2_qt.length>0){
				dsCombo2.loadData(contSort2_qt);
			    combo2.setDisabled(false)		 				
			}*/	 	    	
	    }
	    ds.load({
	    	params:{
		    	start: 0,
		    	limit: PAGE_SIZE
	    	}
	    })
		
    }
    
    function comboselect2(){
    	dsflag=true;
    	var state=" and 1=1";
    	var conDiv3 = combo3.getValue();
    	if(conDiv3!="-1"&&conDiv3!=""){
		state= " and "+"billstate='" + conDiv3 + "'";
		} 
		var value = combo2.getValue();
		if(value != '-1'){
			ds.baseParams.params = gridfilter + " and " + propertyName+"='"+combo.getValue()+ "' and sort = '"+ value +"'"+state;
		}else{
			ds.baseParams.params = gridfilter + " and " + propertyName+"='"+combo.getValue()+ "'"+state;
		}
		
	    ds.load({
	    	params:{start: 0, limit: PAGE_SIZE }
	    })		
    }    
    	var combo3 = new Ext.form.ComboBox({
				store : dsBillState,
				width : 135,
				displayField : 'v',
				valueField : 'k',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '合同状态',
				selectOnFocus : true
			});
	// 合同状态下拉事件
	combo3.on('select', function() {
		dsflag=true;
		var conDiv = combo.getValue();
		var value = combo2.getValue();
		       var filter1="",filter2="";   
		        if(conDiv!="-1"&&conDiv!=""){
		        	filter1=propertyName+"='"+conDiv+"'";
		        }
		        if(value!="-1"&&value!=""){
		        	filter2 = "sort = '" + value + "'";
		        }  
				var conDiv3 = combo3.getValue();
				var filter3 ="1=1";  
				if(conDiv3!=""&&conDiv3!="-1")  
				filter3="billstate='" + conDiv3 + "'";
				if (filter2 != "") { 
					paramsStr = filter1 + " and " + filter2
							+ " and " + filter3;
				} else{ 
					if(filter1!=""){
						paramsStr = filter1 + " and " + filter3;
					}else{
					paramsStr =filter3; 
					}
				}
				if (gridfilter != '')
					paramsStr += " and " + gridfilter;
 
				// 重载数据     

				reload();
			});

    var grid = new Ext.grid.QueryExcelGridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    tbar: [combo,'-',combo2,'-',combo3],
	    title: gridPanelTitle,
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
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	//    width:800,
	//    height:300
	});
	
    var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("conid");
		var conno = record.get("conno");
		gridMenu.removeAll();
	    gridMenu.addMenuItem({
	    	id: 'menu_flow',
            text: '　流程信息',
            value: data,
            conno: conno,
            iconCls: 'flow',
            handler : toHandler
	    });
	    gridMenu.showAt(e.getXY());
	}
	
     
    
	function toHandler(){
		var state = this.id;
		var menu_conid = this.value;
		if ("" != state){
			Ext.get('loading-mask').show();
			Ext.get('loading').show();
		    if ("menu_flow" == state){
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				var _conno = this.conno;
				baseDao.findByWhere2("com.sgepit.frame.flow.hbm.InsDataInfoView", "paramvalues like '%conno:"+_conno+"%' and modname ='合同登记'", function(list){
					if (list.length > 0){
						showFlow(list[0].insid);
					} else {
						Ext.example.msg('提示', '该合同没有走审批流程！');
					}
				});
			}else{return}
		}
	}

	// 10. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [grid],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [grid]
        });
    }
    grid.getTopToolbar().add('->','计量单位： 元');
    // 12. 加载数据
    reload();
    function reload(){
	    if(dsflag==true){ 
	        ds.baseParams.params=paramsStr;   
	    }     
	    dsflag=false; 
	    ds.load({
	    	params: {
		    	start: 0,
		    	limit: PAGE_SIZE
	    	}
	    });
    }
 grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("3" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('conname')
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	});

   var notesTip = new Ext.ToolTip({
	    	autoHeight : true, 
	    	autowidth : true,
	    	target: grid.getEl()
	    });
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };


	function renderConno(value, metadata, record){
		var getConid = record.get('conid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'Business/contract/cont.generalInfo.pageview.jsp?conid='+getConid+'\'">'+ value+'</span>'
		return output;
	}

   	
   	// 下拉列表中 k v 的mapping 
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

   // 如果变更了 就颜色区分
   	function isChange(value, cellMeta, record){
   		if (record.get('isChange') == "是"){
   			value = '<font color=#0000ff>'+cnMoney(value)+'</font>';
   		}else{
   			value = cnMoney(value);
   		}
   		return value;
   	}
   	 
   	 function showFlow(_insid){
		if(!flowWindow){
			flowWindow = new Ext.Window({	               
				title: ' 流程信息',
				iconCls: 'form',
				width: 900,
				height: 500,
				modal: true,
				closeAction: 'hide',
				maximizable: false,
				resizable: false,
				plain: true,
				autoLoad: {
					url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
					params: 'type=flwInfo&insid='+_insid,
					text: 'Loading...'
				}
			});
		} else {
			flowWindow.autoLoad.params = 'type=flwInfo&insid='+_insid;
			flowWindow.doAutoLoad();
		}
		flowWindow.show();
	}
	fixedFilterPart=" pid='"+CURRENTAPPID+"'";
});