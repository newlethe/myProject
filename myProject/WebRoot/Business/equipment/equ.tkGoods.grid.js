var beanSub ="com.sgepit.pmis.equipment.hbm.EquSbdh";
var beanList ="com.sgepit.pmis.equipment.hbm.EquList";
var beanBdg = "com.sgepit.pmis.budget.hbm.BdgInfo"
var  businessSub ="baseMgm";
var listMethodSub ="findWhereOrderBy";
var primaryKeySub ="uuid";
var orderColumnSub = "sx";
var SPLITB = "`";
var selectedGgId ;
var sbId;
var getzs;
var getdj;
var types = [[-1,'--'], [1,'设备'],[2,'部件'],[3,'备品备件'],[4,'专用工具'],[6,'零件'], [5,'合同']];
var jzhType = [[5,'#1、#2机组'],[1,'#1机组'],[2,'#2机组']];
var selectWindow;

	function selectWin(_conid, _conname, _conno, _ggid){
    	if (!selectWindow){
   			selectWindow = new Ext.Window({
				title: '选择设备或部件',
				iconCls: 'btn',
				layout: 'fit',
				width: 850, height: 500,
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
			params: 'pid='+CURRENTAPPID+'&type=select&conid='+_conid+'&conno='+_conno+'&ggid='+_ggid+'&conname='+_conname+'&argments=tkgoods'
		});
    }

 	var smSub =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	

	var equSelect = new Ext.Button({
    	text: '选择设备或部件',
    	iconCls: 'add',
    	handler: function(){
    		if (sm.getSelections()){
    			if (sm.getSelections().length == 1){
//		    		window.location.href = BASE_PATH + "Business/equipment/equ.list.selectTree.jsp?ggid="
//		    		+ selectedGgId +  "&conid=" + conid + "&conno=" + conno + "&conname=" + conname;
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
    
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
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
			fieldLabel: '数量',
			anchor:'95%'
         },'dhsl': {
			name: 'dhsl',
			fieldLabel: '数量',
			anchor:'95%'
         },'dj': {
			name: 'dj',
			fieldLabel: '入库单价',
			anchor:'95%'
         },'zj': {
			name: 'zj',
			fieldLabel: '入库总价',
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
			fieldLabel: '开箱',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'kxdh': {
			name: 'kxdh',
			fieldLabel: '开箱单号',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		},'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算名称',
			anchor:'95%'
         },'fitPlace': {
			name: 'fitPlace',
			fieldLabel: '安装位置',
			anchor:'95%'
         },'gcbh':{
         	name:'gcbh',
         	fieldLabel:'单位工程编号',
         	anchor:'95%'
         },'bz':{
         	name:'bz',
         	fieldLabel:'备注',
         	anchor:'95%'
         },'wztype':{
         	name: 'wztype',
         	fieldLabel:'物资类型',
         	anchor:'95%'
         },'warehouseno':{
         	name: 'warehouseno',
         	fieldLabel:'仓库号',
         	anchor:'95%'
         },'libraryno':{
         	name: 'libraryno',
         	fieldLabel:'库位号',
         	anchor:'95%'
         }
    }
    
    var cmSub = new Ext.grid.ColumnModel([		// 创建列模型
    	smSub,//第0列，checkbox,行选择器
			 /*new Ext.grid.RowNumberer({
			 header : '到货批号',
			 width : 80
			 }),// 计算行数 */
		{
           id:'uuid',
           header: fcSub['uuid'].fieldLabel,
           dataIndex: fcSub['uuid'].name,
           renderer:function(){return sm.getSelecte},
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
           width: 90,
           renderer:wztypeRender
        },{
           id:'jzh',
           header: fcSub['jzh'].fieldLabel,
           dataIndex: fcSub['jzh'].name,
           editor: new Ext.form.ComboBox(fcSub['jzh']),
           renderer: jzhRender,
           width: 90
        },{
           id:'gcbh',
           header: fcSub['gcbh'].fieldLabel,
           dataIndex: fcSub['gcbh'].name,
           width: 90,
           editor : new fmSub.TextField(fcSub['gcbh'])
        },{
           id:'sbId',
           header: '物资编码',
           dataIndex: fcSub['sbId'].name,
           renderer: getSbBh,
           width: 90
        },{
           id:'sbId',
           header: '物资名称',
           dataIndex: fcSub['sbId'].name,
           renderer: getSbName,
           width: 90
        },{
           id:'ggxh',
           header: fcSub['ggxh'].fieldLabel,
           dataIndex: fcSub['ggxh'].name,
           width: 90
        },{
           id:'dw',
           header: fcSub['dw'].fieldLabel,
           dataIndex: fcSub['dw'].name,
           width: 60,
           editor : new fmSub.TextField(fcSub['dw'])
        },{
           id:'zs',
           header: fcSub['zs'].fieldLabel,
           dataIndex: fcSub['zs'].name,
           editor: new fmSub.NumberField(fcSub['zs']),
           width: 40
        },{
           id:'dj',
           header: fcSub['dj'].fieldLabel,
           dataIndex: fcSub['dj'].name,
           editor: new fmSub.NumberField(fcSub['dj']),
           width: 80
        },{
           id:'zj',
           header: fcSub['zj'].fieldLabel,
           dataIndex: fcSub['zj'].name,
           width: 80//,
          //renderer:sumzj
        },{
           id:'sccj',
           header: fcSub['sccj'].fieldLabel,
           dataIndex: fcSub['sccj'].name,
           editor: new fmSub.TextField(fcSub['sccj']),
           width: 70
        },{
           id:'warehouseno',
           header: fcSub['warehouseno'].fieldLabel,
           dataIndex: fcSub['warehouseno'].name,
           editor: new fmSub.TextField(fcSub['warehouseno']),
           width: 70
        },{
           id:'libraryno',
           header: fcSub['libraryno'].fieldLabel,
           dataIndex: fcSub['libraryno'].name,
           editor: new fmSub.TextField(fcSub['libraryno']),
           width: 70
        },{
           id:'bz',
           header: fcSub['bz'].fieldLabel,
           dataIndex: fcSub['bz'].name,
           editor: new fmSub.TextField(fcSub['bz']),
           width: 70
        },{
           id:'bdgid',
           header: fcSub['bdgid'].fieldLabel,
           dataIndex: fcSub['bdgid'].name,
           editor: comboxWithTree,
	       renderer: bdgName,
	       hidden: true,
           width: 120
        },{
           id:'fitPlace',
           header: fcSub['fitPlace'].fieldLabel,
           dataIndex: fcSub['fitPlace'].name,
           hidden: true
           
        },{
        id:'sx',
           header: fcSub['sx'].fieldLabel,
           dataIndex: fcSub['sx'].name,
           hidden: true
        }
        ,{
        id:'iskx',
           header: fcSub['iskx'].fieldLabel,
           dataIndex: fcSub['iskx'].name,
           hidden: true
        }
        ,{
        id:'dhsl',
           header: fcSub['dhsl'].fieldLabel,
           dataIndex: fcSub['dhsl'].name,
           hidden: true
        }
        ,{
        id:'kxdh',
           header: fcSub['kxdh'].fieldLabel,
           dataIndex: fcSub['kxdh'].name,
           hidden: true
        }
//           header: fcSub['iskx'].fieldLabel,
//           dataIndex: fcSub['iskx'].name,
//           renderer: function(value){
//				return ('0' == value) ? '否' : '是';
//			},
//			hidden: true,
//			width: 40
//        },{
//			id: 'kxdh',
//			header: fcSub['kxdh'].fieldLabel,
//			dataIndex: fcSub['kxdh'].name,
//			renderer: function(value){
//				if ("" != value){
//					var result;
//					DWREngine.setAsync(false); 
//					baseMgm.findById('com.sgepit.pmis.equipment.hbm.EquOpenBox', value, function(obj){
//						result = (obj.boxno == null) ? '开箱单号未填写' : obj.boxno;
//					});
//					DWREngine.setAsync(true);
//					return result;
//				}
//			},
//			 hidden: true
//		}
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
		{name: 'iskx', type: 'float'},
		{name: 'dw', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'fitPlace', type: 'string'},
		{name: 'kxdh', type: 'string'},
		{name: 'gcbh', type: 'string'},
		{name: 'bz', type: 'string'},
		{name: 'wztype',type: 'string'},
		{name: 'warehouseno',type: 'string'},
		{name: 'libraryno',type: 'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);			//定义记录集   	
    var PlantIntSub = {uuid:'',pid:CURRENTAPPID, dhId: '', conid:'', sbId:'',sx:'', sccj:'', ggxh:'',jzh:'', 
    				iskx:0,  dhsl:0, zs:0, dj:0, zj:'', dw:'', bdgid:'', fitPlace:'',kxdh:'',gcbh:'',
    				bz:'',wztype:'',warehouseno:'',libraryno:''}	

		// 4. 创建数据源
    var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanSub,				
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "wztype is not null"
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
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        tbar: [equSelect],					//顶部工具栏，可选
        width : 1000,				//宽
        height: 350,				//高
        region: 'south',
        split:true,
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        autoScroll: true,			//自动出现滚动条
        border: false,
        loadMask: true,
		viewConfig:{
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantSub,				
      	plantInt: PlantIntSub,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanSub,					
      	business: businessSub,	
      	primaryKey: primaryKeySub
   });
   
   gridSub.on('aftersave',function(){
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
   })
   
    

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
    
    function getSbBh(value){
    	var sbBh = "";
    	DWREngine.setAsync(false);   
    	baseMgm.findById(beanList, value, function(obj){
    		sbBh = obj.sbBm;
    	})
    	 DWREngine.setAsync(true); 
    	return sbBh;
    }    
   
	smSub.on('rowselect', function(){
		var record = smSub.getSelected();
		sbId = record.get('sbId');
		getzs=record.get('zs');
		getdj=record.get('dj');
		var getzj=getzs*getdj;
		record.set('zj',getzj);
	})
	
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
   
	/*  
	*    ForDight(Dight,How):数值格式化函数，Dight要  
	*    格式化的  数字，How要保留的小数位数。  
	*/  

	function  ForDight(Dight,How)  
	{  
           Dight  =  Math.round  (Dight*Math.pow(10,How))/Math.pow(10,How);  
           return  Dight;  
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
	
	function bdgName(value){
	   	var bdgName = '';
		if (value != ''){
			DWREngine.setAsync(false);
	       		baseMgm.findById(beanBdg, value, function(obj){
	       			bdgName =  obj.bdgname;
	       		})
	   		DWREngine.setAsync(true);	
	   	}
	   	return bdgName;
	}
	
	function wztypeRender(value){
		var result = '';
		if('2' == value)result='设备';
		else if('3' == value)result='备品备件';
		else if('4' == value)result='专用工具';
		else result = '';
		return result;
	}

