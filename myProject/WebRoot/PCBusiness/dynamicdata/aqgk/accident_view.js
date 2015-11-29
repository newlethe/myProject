var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkAccidenrInfo"
var businessType="PCAqgkAccidentAffix"
var accGrid=null;
var array_accidentType=new Array();

Ext.onReady(function() {
	DWREngine.setAsync(false);  
	DWREngine.beginBatch();
	appMgm.getCodeValue('事故类型',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_accidentType.push(temp);	
		}
    });
	DWREngine.endBatch();
  	DWREngine.setAsync(true);
	
	var accSm = new Ext.grid.CheckboxSelectionModel({singleSelect : true})
	var fm = Ext.form;
	var fc = { // 创建编辑域配置
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '项目编码',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'accidenttime' : {
			name : 'accidenttime',
			fieldLabel : '事故时间',
			anchor : '95%'
		},
		'accidentaddr' : {
			name : 'accidentaddr',
			fieldLabel : '事故地点',
			anchor : '95%'
		},
		'accidentreason' : {
			name : 'accidentreason',
			fieldLabel : '事故经过及原因',
			anchor : '95%'
		},
		'accidentType' : {
			name : 'accidentType',
			fieldLabel : '事故类型',
			anchor : '95%'
		},
		'dutyperson' : {
			name : 'dutyperson',
			fieldLabel : '责任人',
			anchor : '95%'
		},
		'reportStatus' : {
			name : 'reportStatus',
			fieldLabel : '状态',
			anchor : '95%'
		}
		
	}
	var accCm = new Ext.grid.ColumnModel([ // 创建列模型
			new Ext.grid.RowNumberer(), 
			{
				id : 'accidenttime',
				type : 'date',
				header : fc['accidenttime'].fieldLabel,
				dataIndex : fc['accidenttime'].name,
				align : 'center',
				width:80,
				renderer:function(value){if(value)return value.format('Y-m-d')}
			}, {
				id : 'accidentaddr',
				type : 'string',
				header : fc['accidentaddr'].fieldLabel,
				width:160,
				dataIndex : fc['accidentaddr'].name
			
			}, {
				id : 'accidentreason',
				type : 'string',
				width:300,
				header : fc['accidentreason'].fieldLabel,
				dataIndex : fc['accidentreason'].name,
				renderer:function(v,m,record){
					var uids=record.get('uids');
					var pid=record.get('pid');
					return "<a href='javascript:jumpTo(\""+uids+"\",\""+pid+"\")' title='"+v+"'>"+v+"</a>"}
			}, {
				id : 'accidentType',
				type : 'string',
				header : fc['accidentType'].fieldLabel,
				dataIndex : fc['accidentType'].name,
				align : 'center',
				width:90,
				renderer:function(k){
					for(var i = 0;i<array_accidentType.length;i++){
						if(k == array_accidentType[i][0]){
							return array_accidentType[i][1];
						}
					}
				}
			}, {
				id : 'dutyperson',
				type : 'string',
				width:70,
				align: 'center',
				header : fc['dutyperson'].fieldLabel,
				dataIndex : fc['dutyperson'].name
			}, {
				id : 'upload',
				type : 'string',
				header : "附件",
				dataIndex :"uids",
				width:50,
				align:'center',
				renderer:function(v){
							return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>查看</a>";
						}
			}
	]);
	accCm.defaultSortable = true; // 设置是否可排序
	var Columns = [{
			name : 'uids',type : 'string'
		},
		{
			name : 'pid',type : 'string'
		}, {
			name : 'accidentunit',type : 'string'
		}, {
			name : 'accidentType',type : 'string'
		}, {
			name : 'accidenttime',type : 'date',dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'accidentaddr',type : 'string'
		}, {
			name : 'parties',type : 'string'
		}, {
			name : 'accidentno',type : 'string'
		}, {
			name : 'accidentreason',type : 'string'
		}, {
			name : 'measure',type : 'string'
		},{
			name : 'recunit',type : 'string'
		},{
			name : 'dutyperson',type : 'string'
		},{
			name : 'reportStatus',type : 'float'
	}];
	var accDs= new Ext.data.Store({
		baseParams : {
			beanName : bean,
			primaryKey: 'uids',
			pid : PID,
			uids : UIDS
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : CONTEXT_PATH + "/servlet/DynamicServlet"
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'uids'
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	accDs.setDefaultSort("accidenttime", 'desc');
	accDs.load();
	
	accGrid = new Ext.grid.GridPanel({
		store : accDs,
		cm : accCm,
		sm : accSm,
		tbar :['->',new Ext.Button({
			text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				history.back();
			}
		})],
		border : false,
		layout : 'fit',
		region : 'center',
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		}
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [accGrid]
	});	
    
});

function uploadfile(uids,biztype){
	param = {
		businessId:uids,
		businessType:biztype
	};
	showMultiFileWin(param);
	
}

function jumpTo(uids,pid){
	baseWindow = new Ext.Window({
        width: 700,
        height:500,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain: true,
        closeAction: 'hide',
        modal: true,
        html: "<iframe name='accidentFrame' src='" + CONTEXT_PATH + 
        "/PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.accident.addOrUpdate.jsp?edit=false&edit_uids="+uids+"&edit_pid="+pid+"&hiddRest=true"+
        "' frameborder=0 width=100% height=100%></iframe>"
    });
    baseWindow.show();
};
		           	
	           		