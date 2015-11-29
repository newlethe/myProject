var dsSubrk;
Ext.onReady(function(){
	var beanSub ="com.sgepit.pmis.equipment.hbm.EquSbdh";
	//2010-12-19 取消出库与入库的关联，直接与该合同的设备清单关联
	beanSub = "com.sgepit.pmis.equipment.hbm.EquList";
	var  businessSub ="baseMgm";
	var listMethodSub ="findWhereOrderBy";
	var primaryKeySub ="uuid";
	var orderColumnSub = "sx";
    var fmSub = Ext.form;			// 包名简写（缩写）
	var types = [[-1,'--'], [1,'设备'],[2,'部件'],[3,'备品备件'],[4,'专用工具'],[6,'零件'], [5,'合同']];
	
	var jzhType = new Array()
	DWREngine.setAsync(false);
	appMgm.getCodeValue('机组号', function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			jzhType.push(temp);
		}
	});
	DWREngine.setAsync(true);
	function dsJzhRender(value) {
		var str = '';
		for (var i = 0; i < jzhType.length; i++) {
			if (jzhType[i][0] == value) {
				str = jzhType[i][1]
				break;
			}
		}
		return str;
	}
	
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
         },
         
         //'sbno': {name: 'sbno',fieldLabel: '设备编号',anchor:'95%' },
         //'sbmc': {name: 'sbmc',fieldLabel: '设备名称',anchor:'95%' },
         'sbBm': {name: 'sbBm',fieldLabel: '设备编号',anchor:'95%' },
         'sbMc': {name: 'sbMc',fieldLabel: '设备名称',anchor:'95%' },
         'rksl': {name: 'rksl',fieldLabel: '入库数量',anchor:'95%' },
         'fitPlace': {
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
    var smSub =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	
    var cmSub = new Ext.grid.ColumnModel([		// 创建列模型
    	smSub, 
		{
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
        //},{
        //   id:'wztype',
        //   header: fcSub['wztype'].fieldLabel,
        //   dataIndex: fcSub['wztype'].name,
        //   width: 90,
        //   renderer:wztypeRender
        },{
           id:'jzh',
           header: fcSub['jzh'].fieldLabel,
           dataIndex: fcSub['jzh'].name,
           //editor: new Ext.form.ComboBox(fcSub['jzh']),
           renderer: dsJzhRender,
           width: 60
        //},{
        //   id:'gcbh',
        //   header: fcSub['gcbh'].fieldLabel,
        //   dataIndex: fcSub['gcbh'].name,
        //   width: 90,
        //   editor : new fmSub.TextField(fcSub['gcbh'])
        },{
           id:'sbId',
           header: '物资编码',hidden:true,
           dataIndex: fcSub['sbId'].name,
           width: 90
        }, 
        
        //{id:'sbno',header: fcSub['sbno'].fieldLabel,dataIndex: fcSub['sbno'].name,width: 90},	
        //{id:'sbmc',header: fcSub['sbmc'].fieldLabel,dataIndex: fcSub['sbmc'].name,width: 90},
        {id:'sbBm',header: fcSub['sbBm'].fieldLabel,dataIndex: fcSub['sbBm'].name,width: 90},	
        {id:'sbMc',header: fcSub['sbMc'].fieldLabel,dataIndex: fcSub['sbMc'].name,width: 90},	
        {id:'rksl',header: fcSub['rksl'].fieldLabel,dataIndex: fcSub['rksl'].name,width: 90},	
        {
           id:'ggxh',
           header: fcSub['ggxh'].fieldLabel,
           dataIndex: fcSub['ggxh'].name,
           width: 90
        },{
           id:'dw',
           header: fcSub['dw'].fieldLabel,
           dataIndex: fcSub['dw'].name,
           width: 60
          // editor : new fmSub.TextField(fcSub['dw'])
        },{
           id:'zs',
           header: fcSub['zs'].fieldLabel,
           dataIndex: fcSub['zs'].name,hidden:true,
          // editor: new fmSub.NumberField(fcSub['zs']),
           width: 40
        },{
           id:'dj',
           header: fcSub['dj'].fieldLabel,
           dataIndex: fcSub['dj'].name,
          // editor: new fmSub.NumberField(fcSub['dj']),
           width: 80
        },{
           id:'zj',
           header: fcSub['zj'].fieldLabel,
           dataIndex: fcSub['zj'].name,
           width: 80 
        },{
           id:'sccj',
           header: fcSub['sccj'].fieldLabel,
           dataIndex: fcSub['sccj'].name,
         //  editor: new fmSub.TextField(fcSub['sccj']),
           width: 70
        },{
           id:'warehouseno',
           header: fcSub['warehouseno'].fieldLabel,
           dataIndex: fcSub['warehouseno'].name,
          // editor: new fmSub.TextField(fcSub['warehouseno']),
           width: 70
        },{
           id:'libraryno',
           header: fcSub['libraryno'].fieldLabel,
           dataIndex: fcSub['libraryno'].name,
         //  editor: new fmSub.TextField(fcSub['libraryno']),
           width: 70
        },{
           id:'bz',
           header: fcSub['bz'].fieldLabel,
           dataIndex: fcSub['bz'].name,
         //  editor: new fmSub.TextField(fcSub['bz']),
           width: 70
        },{
           id:'bdgid',
           header: fcSub['bdgid'].fieldLabel,
           dataIndex: fcSub['bdgid'].name,
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
		//{name: 'sbno', type: 'string'},
		//{name: 'sbmc', type: 'string'},
		{name: 'sbBm', type: 'string'},
		{name: 'sbMc', type: 'string'},
		{name: 'rksl', type: 'float'},
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
		// 4. 创建数据源
    dsSubrk = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanSub,				
	    	business: businessSub,
	    	method: listMethodSub,
	    	//params: "wztype is not null"
	    	//params:"conid = '"+conid+"' and kczsl>0 "
	    	params:''
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
    dsSubrk.setDefaultSort(orderColumnSub, 'asc');	
	dsSubrk.load({params:{start:0,limit:PAGE_SIZE}});
    // 5. 创建可编辑的grid: grid-panel
    var gridSubrk = new Ext.grid.EditorGridTbarPanel({
    	id: 'grid-panel',			//id,可选
        ds: dsSubrk,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        tbar: [''],					//顶部工具栏，可选
        region: 'center',
        split:true,
        addBtn:false,saveBtn:false,delBtn:false,
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        autoScroll: true,			//自动出现滚动条
        border: false,
        loadMask: true,
		viewConfig:{
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsSubrk,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
      	servletUrl: MAIN_SERVLET,		
      	bean: beanSub,					
      	business: businessSub,	
      	primaryKey: primaryKeySub
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
 	function wztypeRender(value){
		var result = '';
		if('2' == value)result='设备';
		else if('3' == value)result='备品备件';
		else if('4' == value)result='专用工具';
		else result = '';
		return result;
	}	

  var addBtn_sb = new Ext.Button({
    	text:'选择',
    	iconCls : 'add',
    	handler:addSB_
    })
    
	allEqu = new Ext.Window({	               
		header: false,
		layout:'fit',
		tbar: [{text:'合同设备清单'},addBtn_sb,'->'],
		width: document.body.clientWidth*0.9,
		height: document.body.clientHeight*0.9,
		modal : true,
		closeAction:'hide',
		plain: true,	                 
		items: gridSubrk
	});
	
	
	function addSB_(){
		var records = smSub.getSelections();
		if(records.length==0)return ;
		for(var i=0;i<records.length;i++){
			gridSub.defaultInsertHandler()
			//var recordrk = gridSubrk.getSelectionModel().getSelected();
			var recordrk = records[i]
			//if(!recordrk)return ;
			var record = gridSub.getSelectionModel().getSelected();
			var num_h = gridSub.getStore().indexOf(record);
			gridSub.getStore().getAt(num_h).set("equid",recordrk.get('sbId'))
			//gridSub.getStore().getAt(num_h).set("equid",recordrk.get('dhId'))
			
			gridSub.getStore().getAt(num_h).set("inSubid",recordrk.get('uuid'))
			
			//gridSub.getStore().getAt(num_h).set("sbno",recordrk.get('sbno'))
			//gridSub.getStore().getAt(num_h).set("sbmc",recordrk.get('sbmc'))
			gridSub.getStore().getAt(num_h).set("sbno",recordrk.get('sbBm'))
			gridSub.getStore().getAt(num_h).set("sbmc",recordrk.get('sbMc'))
			
			gridSub.getStore().getAt(num_h).set("cksl",recordrk.get('rksl'))
			gridSub.getStore().getAt(num_h).set("wztype",recordrk.get('ggxh'))
			gridSub.getStore().getAt(num_h).set("jzh",recordrk.get('jzh'))
			gridSub.getStore().getAt(num_h).set("gcbh",recordrk.get('gcbh'))
			gridSub.getStore().getAt(num_h).set("dw",recordrk.get('dw'))
			gridSub.getStore().getAt(num_h).set("dj",recordrk.get('dj'))
			gridSub.getStore().getAt(num_h).set("zj",recordrk.get('zj'))
			gridSub.getStore().getAt(num_h).set("sccj",recordrk.get('sccj'))
			gridSub.getStore().getAt(num_h).set("warehouseno",recordrk.get('warehouseno'))
			gridSub.getStore().getAt(num_h).set("libraryno",recordrk.get('libraryno'))
			gridSub.getStore().getAt(num_h).set("conid",recordrk.get('conid'))
		}	
		gridSub.defaultSaveHandler();		
		allEqu.hide();
	}
})