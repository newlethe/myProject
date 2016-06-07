var business = "baseMgm"
var listMethod = "findWhereOrderby"
var jzhType = [[1,'#1'],[2,'#2'],[3,'公共'],[-1,'  ']];
var equBean = "com.sgepit.pmis.equipment.hbm.EquList";

Ext.onReady(function(){
	var equList = new Equ.equList({});
	var equUrgeList = new Equ.equUrge({});
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [equList,equUrgeList]
	});
	equList.sm.on("rowselect", function(){
		var sbId = equList.sm.getSelected().get('sbId');
		equUrgeList.grid.setSbId(sbId);
		equUrgeList.ds.baseParams.params = " sbId = '" +  sbId + "'" ;
		equUrgeList.ds.load({params:{start: 0,limit: PAGE_SIZE}});
	});
});
////////////////////////////End of Ext.onReady function
Ext.namespace('Equ');
Equ.equList = function(config) {
	Ext.applyIf(this, config);
	this.initUIComponents();
	Equ.equList.superclass.constructor.call(this);
};
Ext.extend(Equ.equList, Ext.Panel, {
	initUIComponents : function() {
		this.bean = "com.sgepit.pmis.equipment.hbm.EquList";
		this.primaryKey = "sbId";//设备主键
		this.orderColumn = "sbBm";
		this.gridfiter = "conid='"+conid+"'";
		this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
		this.Columns = Columns = [
	    	{name: 'bdgid', type: 'string'},
			{name: 'jhsl', type: 'float'},
			{name: 'azsl', type: 'float'},		
	    	{name: 'sbId', type: 'string'},
	    	{name: 'pid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
			{name: 'sbBm', type: 'string'},    	
			{name: 'sbMc', type: 'string' },
			{name: 'sx', type: 'string'},
			{name: 'ggxh', type: 'string'},
			{name: 'jzh', type: 'string'},
			{name: 'dw', type: 'string'},
			{name: 'zs', type: 'float'},
			{name: 'kcsl', type: 'string'},
			{name: 'dj', type: 'float'},
			{name: 'zj', type: 'float'},
			{name: 'sccj', type: 'string'},
			{name: 'conid', type: 'string'},
			{name: 'returnDate', type: 'date',dateFormat: 'Y-m-d H:i:s'}
		];
		this.cm = new Ext.grid.ColumnModel([		// 创建列模型
	    	this.sm,
	    	new Ext.grid.RowNumberer({header:'序号',width:33}) ,
	        {
	        	id:'sbMc',header: '设备名称',dataIndex: 'sbMc',width: 150
	        },{
	        	id:'sccj',header: '设备供货商',dataIndex: 'sccj',width: 200
	        },{
	        	id:'ggxh',header: "规格型号",dataIndex: 'ggxh',width: 100
	        },{
	        	id:'dw',header: '单位',dataIndex: 'dw',width: 35 
	        },{
	        	id:'jhsl',header: '数量',dataIndex: 'jhsl',width: 80
	        },{
	        	id:'returnDate',header: '合同交货日期',dataIndex: 'returnDate',width:100, renderer:renderUtils.formatDate   
	        }  
		]);
		this.ds = new Ext.data.Store({
		  	baseParams: {
		    	ac: 'list',				//表示取列表
		    	bean: this.bean,				
		    	business: business,
		    	method: listMethod,
		    	params: this.gridfiter
			},
		    proxy: new Ext.data.HttpProxy({
		        method: 'GET',
		        url: MAIN_SERVLET
		    }),
		    reader: new Ext.data.JsonReader({
		        root: 'topics',
		        totalProperty: 'totalCount',
		        id: this.primaryKey
		    }, this.Columns),
		    remoteSort: true,
		    pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
		this.cm.defaultSortable = true;//设置是否可排序
		this.ds.setDefaultSort(this.orderColumn, 'asc');	//设置默认排序列
		this.ds.on('load',function(_store,_records,_obj){
			DWREngine.setAsync(false);
			for(var i=0;i<_records.length;i++){
				baseMgm.getData("select * from equ_rec_sub where EQUID ='"+ _records[i].data.sbId +"' and recid is not null",function(_list){
					if(_list.length > 0) Ext.DomHelper.applyStyles(this.grid.getView().getRow(i),"background-color:red") ;
				})
			}
			DWREngine.setAsync(true);
		});
		this.grid = new Ext.grid.GridPanel({
		    title : this.gridTilte,
		    title :"<b>"+conname + "&nbsp;&nbsp;&nbsp;&nbsp;设备清单</b>",
			id: 'grffid-panel',	//id,可选
		    ds: this.ds,		//数据源
		    cm: this.cm,		//列模型
		    sm: this.sm,		//行选择模式
		    border: false,				// 
		    region: 'center',
		    iconCls: 'icon-by-category',
		    header: true,				//
		    frame: false,				//是否显示圆角边框
		    autoScroll: true,			//自动出现滚动条
		    collapsible: false,			//是否可折叠
		    animCollapse: false,		//折叠时显示动画
		    loadMask: true,				//加载时是否显示进度
		    stripeRows: true,
			viewConfig:{
				forceFit: true,
				ignoreAdd: true
			},
			bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
		        pageSize: PAGE_SIZE,
		        store: this.ds,
		        displayInfo: true,
		        displayMsg: ' {0} - {1} / {2}',
		        emptyMsg: "无记录。"
		    })
		});
		this.region = "center";
		Ext.apply(this, {
			layout : 'fit',
			items : [this.grid]
		});
	},
	onRender : function(ct, position) {
		Equ.equUrge.superclass.onRender.call(this, ct,position);
		this.ds.load({params:{start: 0,limit: PAGE_SIZE}});
	}
});
//设备催交
Equ.equUrge = function(config) {
	Ext.applyIf(this, config);
	this.initUIComponents();
	Equ.equUrge.superclass.constructor.call(this);
};
Ext.extend(Equ.equUrge, Ext.Panel, {
	insertCodevalue : function(){
   		if (this.sbId){
   			this.plantInt.sbId = this.sbId;
   			this.defaultInsertHandler();
   		}else{
   			Ext.Msg.show({
				title: '提示',
	            msg: '请选择一条主记录',
	            icon: Ext.Msg.WARNING, 
	            width:300,
	            buttons: Ext.MessageBox.OK
			})
   		}
   },
	initUIComponents : function() {
		this.region = "south";
		this.height = 300,
		this.bean = "com.sgepit.pmis.equipment.hbm.EquUrge";
		this.Columns = [
			{name: 'urgeid', type: 'string'},
			{name: 'sbId', type: 'string'},
			{name: 'pid', type: 'string'},
			{name: 'yjdhrq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'sjdhrq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'ycjhyy', type: 'string'},
			{name: 'fzr', type: 'string'},
			{name: 'bak1', type: 'string'},
			{name: 'bak2', type: 'string'},
			{name: 'bak3', type: 'string'}
		];
		this.Plant = Ext.data.Record.create(this.Columns);
		this.PlantInt = {
			urgeid: '',sbId: '',pid: CURRENTAPPID,ycjhyy: '',fzr : REALNAME
		};
		this.ds = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',
		    	bean: this.bean,				
		    	business: "baseMgm",
		    	method: listMethod,
		    	params: "1=2"
			},
		    proxy: new Ext.data.HttpProxy({
		        method: 'GET',
		        url: MAIN_SERVLET
		    }),
		    reader: new Ext.data.JsonReader({
		        root: 'topics',
		        totalProperty: 'totalCount',
		        id: 'urgesubid'
		    }, this.Columns),
		    remoteSort: true,
		    pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
		this.sm = new Ext.grid.CheckboxSelectionModel({});
		this.cm = new Ext.grid.ColumnModel([this.sm, 
			{
		       id:'urgeid',header: '催交主表ID',dataIndex: 'urgeid',hidden:true,width: 120
		    }, {
		       id:'sbId',header: '设备名称',dataIndex: 'sbId',hidden:false,width: 120,
		       renderer: function(value){
		       		var obj = renderUtils.findById(equBean,value);
		       		if(obj.sbMc){
		       			return obj.sbMc
		       		}else{
			       		return value
		       		}
		       }
		    }, {
		       id:'pid',header: '工程项目编号',dataIndex: 'pid',hidden:true,width: 120
		    }, {
		       id:'yjdhrq',header: '预计到货日期',dataIndex: 'yjdhrq',hidden:false,width: 120,
		       renderer: renderUtils.formatDate,
		   	   editor: new Ext.form.DateField({
		      	 	name: 'yjdhrq',
		      		 format: 'Y-m-d',
		      		 minValue: '2000-01-01',
		      		 allowBlank: false
		   		})
		    },{
			   id: 'sjdhrq',header: '实际到货日期',dataIndex: 'sjdhrq',width: 100,
			   renderer: renderUtils.formatDate,
			   editor: new Ext.form.DateField({
			       name: 'sjdhrq',
			       format: 'Y-m-d',
			       minValue: '2000-01-01',
			       allowBlank: false
			   })
		    }, {
		       id:'ycjhyy',
		       header: '延迟交货原因',
		       dataIndex: 'ycjhyy',
		       width: 220,
		       editor: new Ext.form.TextField({
					name: 'ycjhyy'
		       })
		    }, {
		       id:'fzr',
		       header: '负责人',
		       dataIndex: 'fzr',
		       width: 100
		    }, {
		       id:'bak1',
		       header: 'bak1',
		       dataIndex: 'bak1',
		       hidden:true,
		       width: 100
		    }, {
		       id:'bak2',
		       header: 'bak2',
		       dataIndex: 'bak2',
		       hidden:true,
		       width: 100
		    }, {
		       id:'bak3',
		       header: 'bak3',
		       dataIndex: 'bak3',
		       hidden:true,
		       width: 100
		    }
		]);
		this.ds.setDefaultSort('urgeid', 'asc');	//设置默认排序列
		this.cm.defaultSortable = true;
		this.grid = new Ext.grid.EditorGridTbarPanel({
		    ds: this.ds,
		    cm: this.cm,
		    sm: this.sm,
		    title :"<b>"+conname + "&nbsp;&nbsp;&nbsp;&nbsp;设备催交</b>",
		    tbar: [{
		    	text:'全部',
		    	scope:this,
		    	handler:function(){
		    		this.ds.removeAll();
		    		this.ds.baseParams.bean = "com.sgepit.pmis.equipment.hbm.EquUrgeView"; ;
		    		this.ds.baseParams.params = "conid = '"+conid+"'";
		    		this.ds.load({params:{start: 0,limit: 30}});
		    	}
		    }],
		    iconCls: 'icon-by-category',
		    border: false, 
		    clicksToEdit: 2,
		    autoScroll: true,
		    split: true,
		    animCollapse: false,
		    loadMask: true,
			viewConfig:{
				forceFit: true,
				ignoreAdd: true
			},
			bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: 10,
	            store: this.ds,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        }),
		    // expend properties
		    plant: this.Plant,				
		  	plantInt: this.PlantInt,			
		  	servletUrl: MAIN_SERVLET,		
		  	bean: this.bean,					
		  	business: "baseMgm",	
		  	primaryKey: "urgeid",
		  	insertHandler: this.insertCodevalue,
		  	sbId:null,
		  	setSbId:function(id){
		  		this.sbId = id;
		  	}
		});
		Ext.apply(this, {
			layout : 'fit',
			items : [this.grid]
		});
	}		
});
//renderer转换函数集
var renderUtils = {
	formatDate : function(value){ 
    	return value ? value.dateFormat('Y-m-d') : '';
	},
	formatDateTime : function(value){
    	return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
	},
	renderConno : function(value, metadata, record){
		var getConid = record.get('conid');
		if(getConid && getConid!="" && record.get('parentid')){
			var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
			output += 'onmouseout="this.style.cursor = \'default\';"'
			output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
			output += 'window.location.href=\''+BASE_PATH
			output += 'Business/contract/cont.generalInfo.view.jsp?conid='+getConid+'\'">'+ value+'</span>'
			return output;
		}else{
			return value;
		}
	},
	findById : function(beanName,id){
		var o = new Object();
		if(id){
			DWREngine.setAsync(false); 
			baseMgm.findById(beanName,id,function(obj){
				o = obj;
			})
			DWREngine.setAsync(true); 
		}
		return o;
	},
	strToInt : function(str){
		if (str[0] == '0') {
			str = str.substring(1, str.length);
			strToInt(str);
		} else {
			return str;
		}
	},
	dsTypeRender : function(value){
		var str = "";
		for(var i=0; i<types_sbqd.length; i++) {
			if (types_sbqd[i][0] == value) {
				str = types_sbqd[i][1]
				break; 
			}
		}
		return str;
	},
	dsJzhRender : function(value){
		var str = '';
		for(var i=0; i<jzhType_sbqd.length; i++) {
			if (jzhType_sbqd[i][0] == value) {
				str = jzhType_sbqd[i][1]
				break; 
			}
		}
		return str;
	},
	getStoreNum : function(value,metadata,record){
		var result = 0;
		if(record.data.sbId){
			DWREngine.setAsync(false); 
			equRecMgm.storeNum(record.data.sbId,function(num){
				result = num;
			})
			DWREngine.setAsync(true); 		
		}
		return result;
	},
	getStoreNum2 : function(value,metadata,record){
		var result = 0;
		if(record.data.sbId){
			DWREngine.setAsync(false); 
			equRecMgm.storeNum2(record.data.sbId,function(num){
				result = num;
			})
			DWREngine.setAsync(true); 		
		}
		return result;
	},
	getStoreNum3 : function(value,metadata,record){
		var result = 0;
		if(record.data.sbId){
			DWREngine.setAsync(false); 
			equRecMgm.storeNum3(record.data.sbId,function(num){
				result = num;
			})
			DWREngine.setAsync(true); 		
		}
		return result;
	},
	zjRender : function(value,metadata,record){
		var result = 0;
		result = record.data.dj * record.data.jhsl
		return result;
	}
};