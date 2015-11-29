var bean = "com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypReport";
var billstateArr = new Array();
var unitArr = new Array();
Ext.onReady(function(){
	    //审批状态
    appMgm.getCodeValue('审批状态',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			billstateArr.push(temp);			
		}
    });
	    //施工单位
    baseMgm.getData("select t.unitid,t.unitname from sgcc_ini_unit t",function(list){
       		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i][0]);	
			temp.push(list[i][1]);
			unitArr.push(temp);			
		}
    })
	DWREngine.setAsync(true);
    var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	
	var cm= new Ext.grid.ColumnModel([ // 创建列模型
			new Ext.grid.RowNumberer(),
			sm,
			{
				id : 'uuid',
				type : 'string',
				header :"主键",
				width:160,
				hidden:true,
				hideLabel:true,
				dataIndex :'uuid'
			}, {
				id : 'recordUuid',
				type : 'string',
				width:50,
				hidden:true,
				hideLabel:true,
				header :"记录主键",
				align:'center',
				dataIndex :'recordUuid'
			},  {
				id : 'unit',
				type : 'string',
				width:160,
				header :"单位",
				align:'center',
				renderer : function(v){
					for(var i = 0; i < unitArr.length; i ++){
					   if(v==unitArr[i][0]){
					       var qtip = "qtip=" + unitArr[i][1];
			                 return '<span ' + qtip + '>' + unitArr[i][1] + '</span>';
					   }
					}
				},
				dataIndex :'unit'
			}, {
				id : 'makeMan',
				type : 'string',
				width:80,
				header :"操作人",
				align:'center',
				dataIndex :'makeMan'
			}, {
				id:'makeDate',
				header:'操作时间',
				dataIndex:'makeDate',
				width:100,
				align:'center',
				renderer:Ext.util.Format.dateRenderer('Y-m-d')
			}, {
				id:'makeAction',
				header:'操作',
				type:'string',
				dataIndex:'makeAction',
				width:100,
				renderer : function(value){
					var renderStr  = "";
					if(value=="1") return "<font color=gray>上报</font>";
					if(value=="2") {
						renderStr="<font color=black>审批</font>";
					}
					if(value=="3") renderStr="<font color=red>退回</font>";
					if(value=="4") renderStr="<font color=blue>撤销审批</font>";
					return renderStr;
				},
				align:'center'
			}, {
				id:'message',
				header:'意见',
				type:'string',
				dataIndex:'message',
				editor:  new Ext.form.TextField({
					        name : 'message'
				}),
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width:160
			}, {
				id:'pid',
				header:'PID',
				type:'string',
				dataIndex:'pid',
				hidden:true,
				hideLabel:true
			}, {
			    id : 'makeOrder',
			    header : '上报次序',
				type:'string',
				dataIndex:'pid',
				hidden:true,
				hideLabel:true
			}
	]);
	var Columns = [
		{
			name : 'uuid',type : 'string'
		}, {
		    name : 'recordUuid'  , type : 'string'
		}, {
			name : 'unit',type : 'string'
		}, {
			name : 'makeMan',type : 'string'
		},{
			name : 'makeAction',type : 'string'
		},{
			name : 'message',type : 'string'
		},{
			name : 'makeDate',type : 'date', dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'pid',type : 'string'
		}, {
		    name : 'makeOrder', type : 'string'
		}
		];
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "recordUuid='"+edit_uids+"' and pid='"+edit_pid+"' order by makeDate asc"
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'uids'
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true,
		listeners:{
			
		}
	});
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
			uuid : '',
		    unit : '',
		    makeMan : '',
		    makeAction : '',
		    message : '',
		    makeDate : new Date(),
		    pid : '',
		    makeOrder : ''
    }
	var buttonArr = "";
    if(edit_flag == 'add'){
	   buttonArr = [{
		   name: 'save',
	       text: '保存',
	       iconCls: 'save',
		   handler: formSave
		 },{
		   name: 'remove',
	       text: '关闭',
	       iconCls: 'remove',
	       handler: function(){
	       	  window.close();
	       }					 
		 }
		]
    }else {
       buttonArr = [];
    }
	grid = new Ext.grid.EditorGridTbarPanel({		
		ds : ds,
		cm : cm,
		sm : sm,
		saveBtn : false,
		addBtn : false,
		delBtn : false,
		header: false,
	    border: false,
	    layout: 'fit',
	    region: 'center',
	    width : 800,
	    buttonAlign : 'center',
	    autoExpandColumn : 2,
        stripeRows:true,
        loadMask : true,
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
        }),
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : 'baseMgm',
		primaryKey : 'uuid',
	    buttons :buttonArr,
	    listeners:{ 
			'celldblclick':function(){
			      var record = grid.getSelectionModel().getSelected();
			      var flag = true;
			      if(edit_flag != 'add')  return false;
			      var  querySql = "select max(make_order) from pc_zlgk_zlyp_report where record_uuid='"+record.data.recordUuid+"'";
			      DWREngine.setAsync(false);
			      baseDao.getData(querySql,function(str){
		              if(record.data.makeOrder != str){
		              	    grid.stopEditing(false);
					        Ext.example.msg('提示信息',"该数据上报完成，不可编辑!");
					        flag = false;
		              }else{
			              if((record.data.makeMan != REALNAME)&& (record.data.unit != USERDEPTID)){
							       Ext.example.msg('提示信息',"非本人填写数据，不可编辑!");
							       grid.stopEditing(true);
							       flag =  false;      
						 }else{
						     flag =  true;   
						 }
		               }
		    	    })
		          DWREngine.setAsync(true);
		          return flag;
			}
		}
	});

	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [grid]
	});
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			} 
		});
    function formSave(){
         grid.defaultSaveHandler();
    }	
})