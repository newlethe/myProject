var beanSub ="com.sgepit.pmis.equipment.hbm.EquSbdhArr";
var beanList ="com.sgepit.pmis.equipment.hbm.EquList";
var businessSub ="baseMgm";
var listMethodSub ="findWhereOrderBy";
var primaryKeySub ="uuid";
var orderColumnSub = "sx";
var SPLITB = "`";
var selectedGgId ;
var sbId;
var types = new Array();
var jzhType = new Array();
var jzhType2 = new Array();
var dhztType = [['-2','预发货'],['-1','发货'],['0','预到货'],['8','已到货未开箱'],[1,'开箱申请中'],[2,'已验收'],
				[5,'部分入库'],[6,'全部入库'],[7,'已出库']];
var wzType = new Array();
var stczcdjType = [['是','是'],['否','否']];
var queryWin2;

var selectWindow;
	DWREngine.setAsync(false);
	appMgm.getCodeValue('机组号',function(list){         //获取合同状态
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				jzhType.push(temp);	
				jzhType2.push(temp);		
			}
	    });
    appMgm.getCodeValue('设备类型',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);		
			wzType.push(temp);
			types.push(temp);		
		}
    });
    DWREngine.setAsync(true);
	function selectWin(_conid, _conname, _conno, _ggid){
    	if (!selectWindow){
   			selectWindow = new Ext.Window({
				title: '选择设备或部件',
				iconCls: 'btn',
				layout: 'fit',
				width: 850, height: document.body.clientHeight,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true,
				listeners: {
					hide: function(){
						dsSub.reload();
					}
				}
			});
   		}
   		selectWindow.show();
   		selectWindow.load({
			url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
			params: "pid="+CURRENTAPPID+"&type=select&conid="+_conid+"&conno="+_conno+"&ggid="+_ggid+"&conname="+_conname +"&argments=getgoodsarr"
		});
    }
    
	var dsDhzt = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : dhztType
    }); 
	var stczcdj = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : stczcdjType
    }); 
    
	  var dsJzh2 = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType2
    });
    
 	var smSub =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	

	var equSelect = new Ext.Button({
    	text: '选择设备或部件',
    	iconCls: 'add',
    	handler: function(){
    		if (sm.getSelections().length > 0){
    			if (sm.getSelections().length == 1){
//		    		window.location.href = BASE_PATH + "Business/equipment/equ.list.selectTree.jsp?ggid="
//		    		+ selectedGgId +  "&conid=" + conid + "&conname=" + conname;
    				selectWin(conid, conname, conno, selectedGgId);
	    		} else {
	    			Ext.Msg.show({
	    				title: '提示',
			            msg: '<br>请在一个设备到货批次下新增详细信息！',
			            icon: Ext.Msg.WARNING, 
			            width: 300,
			            buttons: Ext.MessageBox.OK
	    			})
	    		}
    		}
    	}
    });
    
     var combox_wztype = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : wzType
    });
     var btnQuery = new Ext.Button({
		text: '查询',
		iconCls: 'option',
		disabled: true,
		handler: doQueryAdjunct2
	});
	
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType2
    });        
     
    var fmSub = Ext.form;			// 包名简写（缩写）

    var fcSub = {		// 创建编辑域配置
    	 'uuid': {
			name: 'uuid',
			fieldLabel: '设备到货主键',
			hidden:true,
			hideLabel:true
         },'dhId': {
			name: 'dhId',
			fieldLabel: '批次主键' ,
			hidden:true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true
         },'conid': {
			name: 'conid',
			fieldLabel: '合同主键' ,
			hidden:true,
			hideLabel:true
         },'sbId': {
			name: 'sbId',
			fieldLabel: '设备名称',
			anchor:'95%'
         },'sx': {
			name: 'sx',
			fieldLabel: '属性',
			anchor:'95%'
         },'sccj': {
			name: 'sccj',
			fieldLabel: '生产厂家',
			anchor:'95%'
         }, 'ggxh': {
			name: 'ggxh',
			fieldLabel: '规格型号', 
			anchor:'95%'
         }, 'dw': {
			name: 'dw',
			fieldLabel: '单位',
			anchor:'95%'
         },'zs': {
			name: 'zs',
			fieldLabel: '总到货数量',
			anchor:'95%'
         },'dhsl': {
			name: 'dhsl',
			fieldLabel: '到货数量',
			anchor:'95%'
         },'dj': {
			name: 'dj',
			fieldLabel: '单价',
			anchor:'95%'
         },'zj': {
			name: 'dj',
			fieldLabel: '总价',
			anchor:'95%'
         } ,'jzh': {
			name: 'jzh',
			fieldLabel: '机组号',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsJzh,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         } ,'iskx': {
			name: 'iskx',
			fieldLabel: '是否开箱',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		 } ,'dhzt': {
			name: 'dhzt',
			fieldLabel: '到货状态',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsDhzt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         }, 'kxdh': {
			name: 'kxdh',
			fieldLabel: '通知单号',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		}, 'sbbm': {
			name: 'sbbm',
			fieldLabel: '设备编码',
			ancher: '95%',
			hideLabel: true
		}, 'sbmc': {
			name: 'sbmc',
			fieldLabel: '设备名称',
			ancher: '95%'
		}, 'wztype': {
			name: 'wztype',
			fieldLabel: '属性',//物质类别，从设备清单获取
			ancher: '95%'
		}, 'boxno': {
			name: 'boxno',
			fieldLabel: '箱件号',
			ancher: '95%'
		}, 'partno': {
			name: 'partno',
			fieldLabel: '部件号',
			ancher: '95%'
		}, 'parentid': {
			name: 'parentid',
			fieldLabel: '关联ID',
			hidden:true,
			hideLabel:true
		},
		
		'dz': {name: 'dz',fieldLabel: '单重(千克)',ancher: '95%'},
		'zz': {name: 'zz',fieldLabel: '总重(千克)',ancher: '95%'},
		'dhtj': {name: 'dhtj',fieldLabel: '到货体积',ancher: '95%'},
		'zcd': {name: 'zcd',fieldLabel: '总长度(米)',ancher: '95%'},
		'czcdj': {name: 'czcdj',fieldLabel: '超重大附件',ancher: '95%',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: stczcdj,
            lazyRender:true,
            listClass: 'x-combo-list-small'}
    }

    var cmSub = new Ext.grid.ColumnModel([		// 创建列模型
        new Ext.grid.RowNumberer(),
    	smSub, {
           id:'uuid',
           header: fcSub['uuid'].fieldLabel,
           dataIndex: fcSub['uuid'].name,
           hidden: true       
        },{
           id:'dhId',
           header: fcSub['dhId'].fieldLabel,
           dataIndex: fcSub['dhId'].name,  
           hidden: true 
        },{
           id:'pid',
           header: fcSub['pid'].fieldLabel,
           dataIndex: fcSub['pid'].name,
           hidden: true
        },{
           id:'conid',
           header: fcSub['conid'].fieldLabel,
           dataIndex: fcSub['conid'].name,
           hidden: true
        },{
           id:'wztype',
           header: fcSub['wztype'].fieldLabel,
           dataIndex: fcSub['wztype'].name,
           renderer:wztypeRender,
           width: 70
        },{
           id:'sbbm',
           header: fcSub['sbbm'].fieldLabel,
           dataIndex: fcSub['sbbm'].name,
           width: 120,
           hidden: true
//        },{
//           id:'sbId',
//           header: fcSub['sbId'].fieldLabel,
//           dataIndex: fcSub['sbId'].name,
//           renderer: getSbName,
//           width: 90
        },{
           id:'sbmc',
           header: fcSub['sbmc'].fieldLabel,
           dataIndex: fcSub['sbmc'].name,
           width: 150
        },{
           id:'sx',
           header: fcSub['sx'].fieldLabel,
           dataIndex: fcSub['sx'].name,
           renderer: sxRender,
           hidden:true
        },{
           header: fcSub['ggxh'].fieldLabel,
           dataIndex: fcSub['ggxh'].name,
           width: 90
        },{
           header: fcSub['zs'].fieldLabel,
           dataIndex: fcSub['zs'].name,
           
           renderer: function(value,cell,record){
           		var dhzsl=0;
           		DWREngine.setAsync(false);
           		baseMgm.getData("select dhzsl from equ_list where conid='"+record.get('conid')+"' and sb_id='"+record.get('sbId')+"'",function(str){
           			if(str!=null && str!="")dhzsl = str;
           		})
           		DWREngine.setAsync(true);
           		return dhzsl;
           },
           
           width: 80
        },{
           header: fcSub['dhsl'].fieldLabel,
           dataIndex: fcSub['dhsl'].name,
           editor: new fmSub.NumberField(fcSub['dhsl']),
           css : 'background: pink;', 
           width: 80
        },{
           header: fcSub['dj'].fieldLabel,
           dataIndex: fcSub['dj'].name,
           editor: new fmSub.NumberField(fcSub['dj']),
           hidden: true
        },{
           header: fcSub['zj'].fieldLabel,
           dataIndex: fcSub['zj'].name,
           editor: new fmSub.NumberField(fcSub['zj']),
           hidden: true
        },{
           header: fcSub['dw'].fieldLabel,
           dataIndex: fcSub['dw'].name,
           width: 50
        },{
           header: fcSub['jzh'].fieldLabel,
           dataIndex: fcSub['jzh'].name,
           renderer: jzhRender,
           //editor: new Ext.form.ComboBox(fcSub['jzh']),
           width: 90           
        },{
           header: fcSub['boxno'].fieldLabel,
           dataIndex: fcSub['boxno'].name,
           css : 'background: #FFFFCC;',
           editor: new fmSub.TextField(fcSub['boxno']),
           width: 80
        },{
           header: fcSub['partno'].fieldLabel,
           dataIndex: fcSub['partno'].name,
           css : 'background: #FFFFCC;',hidden:true,
           editor: new fmSub.TextField(fcSub['partno']),
           width: 80
        },{
			id: 'kxdh',
			header: fcSub['kxdh'].fieldLabel,
			dataIndex: fcSub['kxdh'].name,
			renderer: getStoreNum,hidden:true,
			width: 200
		},{
           header: fcSub['dhzt'].fieldLabel,
           dataIndex: fcSub['dhzt'].name,hidden:true,
          // editor: new fmSub.ComboBox(fcSub['dhzt']),
           renderer: dhztRender,
		   width: 100
        },{
           header: fcSub['parentid'].fieldLabel,
           dataIndex: fcSub['parentid'].name,
           hidden: true
        },
        {header: fcSub['dz'].fieldLabel,dataIndex: fcSub['dz'].name,width: 80, editor: new fmSub.NumberField(fcSub['dz']),css : 'background: #FFFFCC;'},
        {header: fcSub['zz'].fieldLabel,dataIndex: fcSub['zz'].name,width: 80, editor: new fmSub.NumberField(fcSub['zz']),css : 'background: #FFFFCC;'},
        {header: fcSub['dhtj'].fieldLabel,dataIndex: fcSub['dhtj'].name,width: 80, editor: new fmSub.NumberField(fcSub['dhtj']),css : 'background: #FFFFCC;'},
        {header: fcSub['zcd'].fieldLabel,dataIndex: fcSub['zcd'].name,width: 80, editor: new fmSub.NumberField(fcSub['zcd']),css : 'background: #FFFFCC;'},
        {header: fcSub['czcdj'].fieldLabel,dataIndex: fcSub['czcdj'].name,width: 80, editor: new fmSub.ComboBox(fcSub['czcdj']),css : 'background: #FFFFCC;'}
    ]);
    cmSub.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var ColumnsSub = [
    	{name: 'uuid', type: 'string'},
    	{name: 'pid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'dhId', type: 'string'},
		{name: 'conid', type: 'string'},    	
		{name: 'sbId', type: 'string' },
		{name: 'sx', type: 'string' },
		{name: 'sccj', type: 'string'},
		{name: 'ggxh', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'dhsl', type: 'float'},
		{name: 'zs', type: 'float'},
		{name: 'dj', type: 'float'},
		{name: 'zj', type: 'float'},
		//{name: 'iskx', type: 'float'},
		{name: 'dhzt', type: 'string'},
		{name: 'dw', type: 'string'},
		{name: 'kxdh', type: 'string'},
		{name: 'sbbm', type: 'string'},
		{name: 'sbmc', type: 'string'},
		{name: 'boxno', type: 'string'},
		{name: 'partno', type: 'string'},
		{name: 'wztype', type: 'string'},
		{name: 'parentid', type: 'string'},
		{name: 'dz', type: 'string'},
		{name: 'zz', type: 'string'},
		{name: 'dhtj', type: 'string'},
		{name: 'zcd', type: 'string'},
		{name: 'czcdj', type: 'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);			//定义记录集   	
    var PlantIntSub = {
	pid : CURRENTAPPID,
	dhId : '',
	conid : '',
	sbId : '',
	sx : '',
	sccj : '',
	ggxh : '',
	jzh : '',
	//iskx : 0,
	dhzt : '',
	dhsl : 0,
	zs : 0,
	dj : 0,
	zj : '',
	dw : '',
	dz: 0,zz: 0,dhtj: '',zcd: '',czcdj: ''
}	
  
		// 4. 创建数据源
    var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanSub,				
	    	business: businessSub,
	    	method: listMethodSub
//	    	params: propertyName+SPLITB+propertyValue
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
    dsSub.setDefaultSort(orderColumnSub, 'asc');	

    // 5. 创建可编辑的grid: grid-panel
    var gridSub = new Ext.grid.EditorGridTbarPanel({
    	id: 'grid-panel',			//id,可选
    	title:'到货详细',
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        tbar: [''],					//顶部工具栏，可选
        iconCls: 'icon-by-category',
        width : 1000,				//宽
        height: 400,				//高
        border: false,				// 
        addBtn: false,
        //region: 'south',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        frame: false,				//是否显示圆角边框
        autoScroll: true,			//自动出现滚动条
        split:true,
      //  animCollapse: false,		//折叠时显示动画
//        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
        collapsed: false,
        collapsible: true,
		viewConfig:{
			//forceFit: false,
			ignoreAdd: true
		},
	
        // expend properties
        plant: PlantSub,				
      	plantInt: PlantIntSub,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanSub,					
      	business: businessSub,	
      	primaryKey: primaryKeySub,
      	saveHandler:equSbdhSaveHandler,
      	deleteHandler:equsbdhDeleteHandler
   });

  var s_dhsl = 0; 
  gridSub.on('beforeedit',function(e){
  		s_dhsl = e.record.data.dhsl;
 		if('dhsl' == e.field){
 		if(e.record.data.dhsl=="0"){
 			e.record.set("dhsl","");}
 		}
   }) 
   
   gridSub.on('afteredit',function(e){
   })   
  
  
   
   function equSbdhSaveHandler(){
   		var records = dsSub.getModifiedRecords();
   		if(records.length == 0)return;
   		var sbdhArr = new Array();
   		for(var i = 0;i<records.length;i++){
   			sbdhArr.push(records[i].data)
   		}
   		DWREngine.setAsync(false);
   		equGetGoodsArrMgm.saveGetGoodsSub(sbdhArr,conid,function(str){
   			Ext.example.msg('提示','成功保存了该设备信息');
	   		dsSub.reload();
   		})
   		DWREngine.setAsync(true);
   		
   		if (isFlwTask == true){
			Ext.Msg.show({
				title: '您成功维护了设备到货信息！',
				msg: '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.INFO,
				fn: function(value){
			   		if ('yes' == value){
			   			parent.IS_FINISHED_TASK = true;
						parent.mainTabPanel.setActiveTab('common');
			   		}
				}
			});
		} 
   }
   
	function equsbdhDeleteHandler(){
		var records = smSub.getSelections();
		if(records.length == 0) return;
		Ext.MessageBox.confirm('确认','删除操作将不可恢复，确认要删除吗？',function(btn,text){
			if(btn == "yes"){
				var uuidArr = new Array();
				for(var i = 0;i<records.length;i++){
					uuidArr.push(records[i].data.uuid);
				}
				DWREngine.setAsync(false);
				equGetGoodsArrMgm.deleteGetGoodsSub(uuidArr,function(bool){
					if(bool){
						Ext.example.msg('删除成功！', '您成功删除了到货设备信息！');
						dsSub.reload();
					}else{
						
					}
				})
				DWREngine.setAsync(true);
			}
		});   			
	}
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
    
    function getSbName(value){
    	var sbName = "";
    	DWREngine.setAsync(false);   
    	baseMgm.findById(beanList, value, function(obj){
    		sbName = obj.sbMc;
    	})
    	 DWREngine.setAsync(true); 
    	return sbName;
    }
    
    smSub.on('rowselect', function(){
    });
    
	   // 属性值 
   function sxRender(value){
   		var str = types[5][1];
   		for(var i=0; i<types.length; i++) {
   			if (types[i][0] == value) {
   				str = types[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   
   function jzhRender(value){
   		var str = '';
   		for(var i=0; i<jzhType.length; i++) {
   			if (jzhType[i][0] == value) {
   				str = jzhType[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   
   function dhztRender(value){
   		var str = dhztType[0][1];
   		for(var i=0; i<dhztType.length; i++) {
   			if (dhztType[i][0] == value) {
   				str = dhztType[i][1]
   				break; 
   			}
   		}
   		return str;
   }
	
	
	function checkAllNotKx(records){
		for (var i = 0; i < records.length; i++) {
			if (records[i].get('iskx') == '1') return false;
		}
		return true;
	}

	function IsSameKx(records){
		if (checkAllIsKx(records)){
			var temp = records[0].get('kxdh');
			for (var i = 1; i < records.length; i++) {
				if (records[i].get('kxdh') != temp) return false;
			}
			return true;
		} else { return false }
	}
	
	function checkAllIsKx(records){
		for (var i = 0; i < records.length; i++) {
			if (records[i].get('iskx') == '0') return false;
		}
		return true;
	}
	
	function wztypeRender(value){
   		var str = wzType[5][1];
   		for(var i=0; i<wzType.length; i++) {
   			if (wzType[i][0] == value) {
   				str = wzType[i][1]
   				break; 
   			}
   		}
   		return str;		
	}	
	function getStoreNum(value,metadata,record){
					var result;
					DWREngine.setAsync(false); 
					baseMgm.getData("select BOXNO from equ_open_box t where gg_id = '"+record.data.dhId+"' and sbid ='"+record.data.sbId+"'",function(v){
						result = v;
					});
					DWREngine.setAsync(true);
					return result;
			};
////////////////////////////////////////////////////////////////////////////////////////////从表查询部分
	function doQueryAdjunct2(){
		if (!queryWin2) {
			queryWin2 = new Ext.Window({
				title: '查询数据',
				width: 450, height: 330,
				layout: 'fit',
				iconCls: 'option',
				closeAction: 'hide',
				border: true,
				constrain: true,
				maximizable: false,
				resizable: false,
				modal: false,
				items: [queryPanel2]
			});
		}
		queryPanel2.getForm().reset();
		queryWin2.show();
	}
	var queryPanel2 = new Ext.form.FormPanel({
        border: false, autoScroll: true,
		bodyStyle: 'padding: 10px 10px; border:0px;',
		labelAlign: 'right', layout: 'form',
	 	items: [
	 		new Ext.form.FieldSet({
	 			title: '关键字',
	 			layout: 'form',
	 			border: true,
	 			items: [
	 				new fmSub.TextField(fcSub['sbmc']),
	 				new fmSub.TextField(fcSub['sccj']),
	 				new fmSub.TextField(fcSub['ggxh']),
	 				new fmSub.TextField(fcSub['boxno']),
	 				new fmSub.TextField(fcSub['partno']),
	 				new fmSub.ComboBox({
	            		name: 'wztype',
						fieldLabel: '物资类别', emptyText : '请选择...',
						typeAhead: true, 
						valueField: 'k', displayField: 'v',
						mode: 'local', triggerAction: 'all',
			            store: combox_wztype,lazyRender: true, editable: false,
			            listClass: 'x-combo-list-small',
						anchor: '95%'
	            	}),new fmSub.ComboBox({
	            		name: 'jzh',
						fieldLabel: '机组号', emptyText : '请选择...',
						typeAhead: true,  
						valueField: 'k', displayField: 'v',
						mode: 'local', triggerAction: 'all',
			            store: dsJzh2,lazyRender: true, editable: false,
			            listClass: 'x-combo-list-small',
						anchor: '95%'
	            	})
	 				
				]
	 		})
	 	],
	 	bbar: ['->',{
			id: 'query',
			text: '查询',
			tooltip: '查询',
			iconCls: 'btn',
			handler: execQuery2
		},'-']
	});
	
function execQuery2(){
    	var val = true;
    	var strSql = propertyName + "='" +propertyValue +"'";
    	var form = queryPanel2.getForm();
    	var sbmc = form.findField('sbmc').getValue();
    	var ggxh = form.findField('ggxh').getValue();
    	var sccj = form.findField('sccj').getValue();
    	var boxno = form.findField('boxno').getValue();
    	var partno = form.findField('partno').getValue();
    	var wztype = form.findField('wztype').getValue();
    	var jzh = form.findField('jzh').getValue();
    	if (sbmc != '' && sbmc != null){
    		strSql += " and sbmc like '%"+sbmc+"%'";
    	}
    	if (ggxh != '' && ggxh != null){
    		strSql += " and ggxh like '%"+ggxh+"%'";
    	}
    	if (sccj != '' && sccj != null){
    		strSql += " and sccj like '%"+sccj+"%'";
    	}
    	if (boxno != '' && boxno != null){
    		strSql += " and box_no like '%"+box_no+"%'";
    	}
    	if (partno != '' && partno != null){
    		strSql += " and part_no like '%"+part_no+"%'";
    	}
    	if (wztype != '' && wztype != null){
    		strSql += " and wztype like '%"+wztype+"%'";
    	}
    	if (jzh != '' && jzh != null){
    		strSql += " and jzh like '%"+jzh+"%'";
    	}
    	if(selectedGgId!=''){
    	   strSql += " and dhId ='"+selectedGgId+"'";
    	}
	    if (val){
	    	with(dsSub){
	    		baseParams.params = strSql;
	    		load({
   					params : {
						start : 0,
						limit : 20
					},
   					callback: function(){ queryWin2.hide(); }
   				});
	    	}
	    }
    }
