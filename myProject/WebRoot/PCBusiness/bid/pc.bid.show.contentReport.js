var bean = "com.sgepit.pcmis.bid.hbm.VPcZbReport"
var m_record = window.dialogArguments;
var edit_pid="",edit_sjType="";
if(m_record){
	edit_pid=m_record.edit_pid;
	edit_sjType=m_record.edit_sjType;
}
var grid;
Ext.onReady(function() {
	var sm= new Ext.grid.CheckboxSelectionModel({
		selectRow : function(index, keepExisting, preventViewNotify){
	       Ext.grid.CheckboxSelectionModel.superclass.selectRow.call(this,index,true,preventViewNotify);
	    }
	});
	var cm= new Ext.grid.ColumnModel([ // 创建列模型
			sm, 
			{
				id : 'zbnr',
				type : 'string',
				header :"招标内容",
				width:160,
				dataIndex :'zbnr'
			}, {
				id : 'zbdw',
				type : 'string',
				width:180,
				header :"中标单位",
				dataIndex :'zbdw'
			},{
				id:'startDate',
				header:'发放时间',
				dataIndex:'startDate',
				width:80,
				align:'center',
				renderer:Ext.util.Format.dateRenderer('Y-m-d')
			}
	]);
	var Columns = [{
			name : 'uids',type : 'string'
		},
		{
			name : 'unitId',type : 'string'
		}, {
			name : 'unitname',type : 'string'
		}, {
			name : 'sjType',type : 'string'
		},{
			name : 'zbSeqno',type : 'string'
		}, {
			name : 'xmmc',type : 'string'
		}, {
			name : 'zbnr',type : 'string'
		}, {
			name : 'zbdw',type : 'string'
		},{
			name : 'state',type : 'string'
		},{
			name : 'rateStatus',type : 'float'
		},{
			name : 'startDate',type : 'date', dateFormat : 'Y-m-d H:i:s'
		}];
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "unitId='"+CURRENTAPPID+"' and  rateStatus=100"
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
			load : function(store){
				var sql = "select zb_seqno from pc_bid_supervisereport_d where sj_type='"+edit_sjType+"' " +
					"and unit_id='"+CURRENTAPPID+"' and zb_seqno is not null"
				baseDao.getData(sql,function(lt){
					var selected = new Array();
					for(var i=0;i<lt.length;i++){
						store.each(function(rec){
							if(rec.get('uids')==lt[i]){
								selected.push(rec);
								
							}
						})
					}
					sm.selectRecords(selected);
				})	
			}
		}
	});
	grid = new Ext.grid.GridPanel({
		tbar:[{
			text:'确定',
			iconCls:'save',
			handler:saveZbIds2Cell},
			{
			text:'取消',
			iconCls:'remove',
			handler:cancel}		
			],
		store : ds,
		cm : cm,
		sm : sm,
		border : false,
		layout : 'fit',
		region : 'center',
		autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			forceFit : true
		}
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [grid]
	});
	ds.load({callback:function(){}});
});
function saveZbIds2Cell(){
	var records=grid.getSelectionModel().getSelections();
	if(records.length>0){
		var zbIds = new Array();
		for(var i=records.length-1;i>=0;i--){
			zbIds.push(records[i].get("uids"));
		}
		PCBidDWR.addZbNr2Report(zbIds,CURRENTAPPID,edit_sjType,function(flag){
			if(flag){
				Ext.example.msg('提示','操作成功');
			}else{
				Ext.example.msg('提示','操作失败');	
			}
		});
	}else{
		PCBidDWR.addZbNr2Report([],CURRENTAPPID,edit_sjType,function(flag){
			if(flag){
				Ext.example.msg('提示','操作成功');
			}else{
				Ext.example.msg('提示','操作失败');	
			}
		});
		//Ext.example.msg('提示','请先选择需要上报的招标内容');
	}
}
//取消按钮
function cancel(){
	var records=grid.getSelectionModel().getSelections();
	if(records.length>0){
		var zbIds = new Array();
		for(var i=records.length-1;i>=0;i--){
			zbIds.push(records[i].get("uids"));
		}
		PCBidDWR.addZbNr2Report(zbIds,CURRENTAPPID,edit_sjType,function(flag){
		});
	}else{
		PCBidDWR.addZbNr2Report([],CURRENTAPPID,edit_sjType,function(flag){
		});
	}	
	window.self.close();
}
	           		