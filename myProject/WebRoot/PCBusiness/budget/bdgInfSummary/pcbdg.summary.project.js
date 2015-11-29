function test(value, metadata, record) {
				var pid=record.get('pid');
		var pname=record.get('prjName');
		return "<a href=javascript:loadFirstModule('"+pid+"','"+pname+"')>"+value+"</a>"
	}
var str ="pid`"+USERBELONGUNITID;	
Ext.onReady(function (){
    var bdgDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pmis.budget.hbm.BdgInfo",				
	    	business: "pcBdgInfoMgm",
	    	method: "getBdgInfoGridStr",
	    	params:str
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount'
        }, [
        	{name: 'bdgTotalMoney', type: 'float'},		//Grid显示的列，必须包括主键(可隐藏)
	    	{name: 'pid', type: 'string'},	
			{name: 'conMoney', type: 'float'},
			{name : 'balMoney', type : 'float'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	bdgDS.load()
	var _columns = [{
           header: "概算总金额",
           align : 'center',
           dataIndex: "bdgTotalMoney",
           width: 120
        },{
        	header:'合同分摊总金额',
        	align : 'center',
        	dataIndex: "conMoney"
        },{
            header: '差值',
        	dataIndex: "conMoney",
        	align : 'center',
            renderer :function(value, cellmeta, record){
                var leftmoney =record.get('bdgTotalMoney')-record.get('conMoney');
                return '<span style="color:red;">' + leftmoney + '</span>';
            }
        },{
            header : '合同付款分摊总金额',
            dataIndex : 'balMoney',
            align : 'center',
            renderer : function(){
            },
            width : 120
        },{
           header : '合同付款分摊与合同分摊差值',
           dataIndex : 'balMoney',
           renderer : function (value,cellmeta,record) {
                              var leftmoney =record.get('conMoney')-record.get('balMoney');
                return '<span style="color:red;">' + leftmoney + '</span>';
           },
           width : 180
        },{
            header : '概算是否异常',
            dataIndex : 'conMoney',
            renderer : function (){
                return "";
            },
            width : 100
        },{
           header:'pid',
           dataIndex: 'pid',
           hidden : true,
           width: 180
        }
	]
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:test,
		title:'<center><b><font size=3>项目概算信息一览表</font></b></center>',
		ds:bdgDS,
		columns:_columns,
		searchHandler:function(store,unitid,projName){
			var sqlStr="";
			if(unitid!=""){
				sqlStr='pid`'+unitid;
			}
			if(projName!=''){
				sqlStr+=';proName`'+projName;
			}
			store.baseParams.params=sqlStr;
			store.load();
		}/*,
		bbar: new Ext.PagingToolbar({
		    pageSize : 10,
		    store : bdgDS,
		    displayInfo : true,
		    displayMsg : ' {0} - {1} / {2}',
		    emptyMsg: "无记录。"
		})*/
	})
	new Ext.Viewport({
		layout:'fit',
		items:[p]
	})
});