var msgPublishPanel;
var userMsgWin;
var taskPanel;
var taskWin;
Ext.onReady(function(){
	
	 var menuPanel = new Ext.Panel({
	 	region : 'center',
    	html:'<iframe name="menuFrame" src="'+CONTEXT_PATH+'/servlet/SysServlet?ac=loadUserHome" frameborder="0" style="width:100%;height:100%;"></iframe>'
    });
   
    
    msgPublishPanel = new Ext.Panel({
    	html:'<iframe name="userMsgSearchFrame" src="'+CONTEXT_PATH+'/Business/fileAndPublish/search/com.fileSearch.publish.jsp" frameborder="0" style="width:100%;height:100%;"></iframe>'
    });
    
    /* 待办事项*/
	var FlowTask =Ext.extend(Ext.grid.QueryExcelGridPanel ,{
		region:'center',
        enableColumnMove: false,
        enableColumnHide: false,
        enableDragDrop : false,
        loadMask: true,
        pagesize:8,
        viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		initComponent: function(){
			var flowColumns = [
				{name: 'logid', type: 'string'},
				{name: 'flowid', type: 'string'},
				{name: 'insid', type: 'string'},
				{name: 'flowtitle', type: 'string'},
				{name: 'title', type: 'string'},
				{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
				{name: 'ftype', type: 'string'},
				{name: 'fromnode', type: 'string'},
				{name: 'tonode', type: 'string'},
				{name: 'notes', type: 'string'},
				{name: 'flag', type: 'string'},
				{name: 'nodename', type: 'string'},
				{name: 'fromname', type: 'string'},
				{name: 'toname', type: 'string'},
				{name: 'nodeid', type: 'string'}
			];
			this.ds = new Ext.data.Store({
				baseParams: {
					ac: 'list',
					bean: "com.sgepit.frame.flow.hbm.TaskView",
					business: "baseMgm",
					method: "findWhereOrderBy",
					params: "tonode='"+USERID+"' and flag=0"
				},
				proxy: new Ext.data.HttpProxy({
					method: 'GET',
					url: MAIN_SERVLET
				}),
				reader: new Ext.data.JsonReader({
					root: 'topics',
					totalProperty: 'totalCount',
					id: 'logid'
				}, flowColumns),
				remoteSort: true,
				pruneModifiedRecords: true
			});
			this.ds.setDefaultSort('ftime', 'desc');
			this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
			this.cm = new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer({
				}), {
					id: 'insid',
					type: 'string',
					header: '流程实例ID',
					dataIndex: 'insid',
					hidden: true,
					width: 100
				},{
					id: 'flowid',
					type: 'string',
					header: '流程ID',
					dataIndex: 'flowid',
					hidden: true,
					width: 0
				},{
					id: 'flowtitle',
					type: 'string',
					header: '流程类型',
					dataIndex: 'flowtitle',
					width: 150
				},{
					id: 'title',
					type: 'string',
					header: '主题',
					dataIndex: 'title',
					renderer : function(value,md,rec,rInx,cInx,ds1){
						return "<a title=【处理】"+value+" href=javascript:doFlow('"+rec.data.insid+"')>"+value+"</a>"
					},
					width: 320
				},{
					id: 'ftime',
					type: 'date',
					header: '发送时间',
					dataIndex: 'ftime',
					renderer: function(value){
				        return value ? value.dateFormat('Y-m-d H:i:s') : '';
				    },
				    //hidden : true,
				    width : 140
				},{
					id: 'fromname',
					type: 'string',
					type: 'string',
					header: '发送人',
					dataIndex: 'fromname',
					//hidden : true,
				    width : 60
				},{
					id: 'nodename',
					type: 'string',
					header: '处理说明',
					dataIndex: 'nodename',
					width: 130
				}
			]);
			this.cm.defaultSortable = true;
			var _self = this;
			this.bbar = new Ext.PagingToolbar({
	            pageSize: _self.pagesize,
	            store: _self.ds,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        });
	        this.on('render',function(){
		        _self.store.load({
					params: {
				    	start: 0,
				    	limit: _self.pagesize
			    	}
				});
	        });
			FlowTask.superclass.initComponent.call(this);
		}
	})
	taskPanel = new FlowTask();
    
    var viewport = new Ext.Viewport({
    	layout : 'border',
    	items:[menuPanel]
        
    });
    
	
});

function showMsgWin(){
		if ( !userMsgWin ){
			userMsgWin = new Ext.Window({
				header : false,
				layout : 'fit',
				width : 780,
				height : 355,
				title : '信息发布查询',
				modal : true,
				maximizable : true,
				closeAction : 'hide',
				plain : true,
				items : [msgPublishPanel]
			});
		}
		
		userMsgWin.show();
		return userMsgWin;
}

function showTaskWin(){
	if ( !taskWin ){
			taskWin = new Ext.Window({
				header : false,
				layout : 'fit',
				width : 780,
				height : 300,
				title : '待办事项',
				modal : true,
				maximizable : true,
				closeAction : 'hide',
				plain : true,
				items : [taskPanel]
			});
		}
		
		taskWin.show();
}

/*	处理进度条	*/
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);
	function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
    };
    function doFlow(flowInstantId){
	window.location.href = CONTEXT_PATH+"/jsp/flow/flw.main.frame.jsp?flowInstantId="+flowInstantId;
}