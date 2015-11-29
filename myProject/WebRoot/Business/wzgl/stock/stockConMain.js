var selectedConName
var selectedConNo
var selectedConId

var bean = "com.sgepit.pmis.contract.hbm.ConOveView"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var propertyName = "condivno"
var partBs= new Array();

var BillState = new Array();
var flowWindow;
var gridPanelCon

var smMain
var  dsMain
var btnAdd;

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function (){
	btnAdd = new Ext.Button({
		id: 'add',
		text: '新增',
		iconCls: 'add',
		handler: toHandler
	});
	
	
	var contFilterId = "";				//合同一级分类属性代码，格式如('SB','GC','CL')
	var contractType = new Array();		//合同一级分类
	//根据属性代码中对应“合同划分类型”中查询出材料合同，“详细设置”列包含CL
	var clSql = "select c.property_code,c.property_name from property_code c " +
			"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
			"and c.detail_type like '%CL%'";
	DWREngine.setAsync(false);
	baseMgm.getData(clSql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			contractType.push(temp);			
			contFilterId+="'"+list[i][0]+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length-1);
	})
	//搜索过滤条件
	if(ModuleLVL == '1'){
		fixedFilterPart = "condivno in ("+contFilterId+") and pid='" + CURRENTAPPID+"'";
	}else{
		fixedFilterPart = "condivno in ("+contFilterId+") and pid='" + CURRENTAPPID+"' and conadmin like '" + USERNAME + "%'";
	}
	DWREngine.setAsync(true);
	
	
	
	
	
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

    appMgm.getCodeValue('合同状态',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			BillState.push(temp);			
		}
    }); 
    
    DWREngine.endBatch();
  	DWREngine.setAsync(true);	
   
	var dsPartB = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: partBs
    });
   
    var dsBillState = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:BillState
    });
      
	// 1. 创建选择模式
    smMain =  new Ext.grid.RowSelectionModel({singleSelect:true})
    // 2. 创建列模型
    var fm = Ext.form;			

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
			value: CURRENTAPPID,
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
           width: 60/*,
           renderer: renderConno*/
        },{
           id: 'conname',
           type: 'string',
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           width: 180
        },{
           id: 'partybno',
           type: 'combo',
           header: fc['partybno'].fieldLabel,
           dataIndex: fc['partybno'].name,
           width: 120,
           renderer: partbRender,
           store:dsPartB
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
           width: 40,
           renderer: formatDate
        },{
           id: 'billstate',
           type:'combo',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           disabled : true,
           width: 40,
           renderer: BillStateRender,
           store:dsBillState
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
    dsMain = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: fixedFilterPart +" and "+pidWhereString
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'cpid'
        }, Columns),
		//sortInfo:{field:'conid',direction:'DESC'},
        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsMain.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    dsMain.on('load',function(ds1){
	  	smMain.selectFirstRow(); 	  	   
   		/*if(selectedConId ==null || selectedConId==""){
  			gridPanelMat.getTopToolbar().disable()
   		} else{				
	   		gridPanelMat.getTopToolbar().enable()				
   		}	*/
	 });
	 //zhangh 2010-10-19 合同列表显示
    gridPanelCon = new Ext.grid.QueryExcelGridPanel({
	    store: dsMain,
	    cm: cm,
	    sm: smMain,
	    title: "合同列表",
	    tbar: [],
	   // iconCls: 'icon-show-all',
	    border: true,
	    layout: 'fit',
	    region: 'center',
	    split:true,
	    header: false,
	    autoScroll: true,			//自动出现滚动条
        collapsible: true,			//是否可折叠
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
            store: dsMain,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	//zhangh 2010-10-19 数据行的右键菜单
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	if (ModuleLVL < 3){
		gridPanelCon.on('rowcontextmenu', contextmenu, this); 
	}
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("conid");
		var conno = record.get("conno");
		gridMenu.removeAll();
	    gridMenu.addMenuItem({
	    	id: 'menu_add',
            text: '　新增',
            value: data,
            iconCls: 'add',
            handler : toHandler
	    })
	    gridMenu.addMenuItem({
	    	id: 'menu_edit',
            text: '　修改',
            value: data,
            iconCls: 'btn',   
            handler : toHandler
	    })
	    gridMenu.addMenuItem({
	    	id: 'menu_del',
            text: '　删除',
            value: data,
            iconCls: 'multiplication',
            handler : toHandler
	    })
	    gridMenu.add('-');
		gridMenu.addMenuItem({
	    	id: 'menu_view',
            text: '　查看',
            value: data,
            iconCls: 'form',
            hidden:true,
            handler : toHandler
	    });
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
		var url = basePath + "Business/wzgl/stock/stockCon.addorupdate.jsp?";
			
		var obj = new Object()
		obj.conid = menu_conid;
		obj.conno = "";
		
		if ("" != state){
		
		     /*if ("menu_view" == state){
		    	window.location.href = BASE_PATH+"Business/contract/cont.generalInfo.view.jsp?conid="+menu_conid;
		    	window.showModalDialog(url,obj,"dialogWidth:960px;dialogHeight:400px;center:yes;resizable:yes;")
			}*/
			if ("menu_add" == state || "add" == state){
				window.location.href = url; 
				//var rtn = window.showModalDialog(url,null,"dialogWidth:960px;dialogHeight:400px;center:yes;resizable:yes;")
				//if(rtn){
				//	 reload();
				//}
				
			}
			if ("menu_edit" == state){
				window.location.href = url + "conid="+menu_conid;
				//var rtn = window.showModalDialog(url,obj,"dialogWidth:960px;dialogHeight:400px;center:yes;resizable:yes;")
				//if(rtn){
				//	 reload();
				//}
				
			}
			if ("menu_del" == state){
				
				Ext.Msg.show({
					title: '提示',
					msg: '是否要删除?　　　　',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							//Ext.get('loading-mask').show();
							//Ext.get('loading').show();
							conoveMgm.deleteConove(menu_conid, function(flag){
								//Ext.get('loading-mask').hide();
								//Ext.get('loading').hide();
				    			if ("0" == flag){
									Ext.example.msg('删除成功！', '您成功删除了一条合同信息！');
							   		reload()
							   		equlistMgm.deleteConAll(menu_conid);
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
			}else if ("menu_flow" == state){

				var _conno = this.conno;
				baseDao.findByWhere2("com.sgepit.frame.flow.hbm.InsDataInfoView", "paramvalues like '%conno:"+_conno+"%' and modname ='合同登记' and "+pidWhereString+" ", function(list){
					if (list.length > 0){
						showFlow(list[0].insid);
					} else {
						Ext.example.msg('提示', '该合同没有走审批流程！');
					}
				});
			}else{return}
		}
	}



   var notesTip = new Ext.ToolTip({
	    	autoHeight : true, 
	    	autowidth : true,
	    	target: gridPanelCon.getEl()
	    });

	
    reload();
    function reload(){
	    dsMain.load({ params: {start: 0,limit: PAGE_SIZE}  });
    }
    smMain.on('rowselect', function(sm, rowIndex, record){
  		selectedConNo = record.get('conno');
   		selectedConId = record.get('conid');
   		selectedConName = record.get('conname');
   		var dsDoc = gridPanelDoc.getStore();
		dsParams = " modtabid='"+selectedConId+"'";
		dsDoc.baseParams.params = dsParams
		dsDoc.load({
			params: {
				start: 0,
				limit: PAGE_SIZE
			}
		});

		dsB.baseParams.params = " hth ='" + selectedConId + "'";
		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })

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
		//output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'Business/contract/cont.generalInfo.view.jsp?conid='+getConid+'\'">'+ value+'</span>'
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
  
  /*
  function doContractFilter(){
   		var _type = this.id;
   		if ('con-apply' == _type){
   		dsMain.baseParams.params =" billstate=0";
		} else if ('con-process' == _type){
   		dsMain.baseParams.params =" billstate=1";
		}else if ('con-finish' == _type){
   		dsMain.baseParams.params =" billstate=2";
		}else if ('con-payProcess' == _type){
   		dsMain.baseParams.params =" billstate=3";
		}else if ('con-changeProcess' == _type){
   		dsMain.baseParams.params =" isChange = '是'";
		}else if ('con-payFinsh' == _type){
   		dsMain.baseParams.params =" billstate=4";
		}else if ('con-all' == _type){
   		dsMain.baseParams.params =gridfiter;
		}
	 dsMain.load({
	    	params:{start: 0, limit: PAGE_SIZE }
	    })
   	}
   	*/
   	
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
});