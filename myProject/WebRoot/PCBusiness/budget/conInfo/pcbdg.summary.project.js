function test(value, metadata, record) {
		var pid=record.get('pid');
		var pname=record.get('prjName');
		return "<a href=javascript:loadFirstModule('"+pid+"','"+pname+"')>"+value+"</a>"
	}
var str ="pid`"+USERBELONGUNITID;
Ext.onReady(function (){
    var roleDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pmis.budget.hbm.BdgInfo",				
	    	business: "pcBdgInfoMgm",
	    	method: "getBdgMainGridStr",
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
			{name: 'conMoney', type: 'float'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	roleDS.load({params:{start :0,limit : 10}})
	var _columns = [{
           header: "概算总金额",
           dataIndex: "bdgTotalMoney",
           width: 120
        },{
        	header:'合同分摊总金额',
        	 dataIndex: "conMoney"
        },{
            header: '差值',
        	dataIndex: "conMoney",
            renderer :function(value, cellmeta, record){
                var leftmoney =record.get('bdgTotalMoney')-record.get('conMoney');
                return '<span style="color:red;">' + leftmoney + '</span>';
            }
        },{
           header:'pid',
           dataIndex: 'pid',
           hidden : true,
           width: 180
        }
	]
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:test,
		title:'<center><b><font size=3>项目概算基本信息一览表</font></b></center>',
		ds:roleDS,
		columns:_columns,
		searchHandler:function(store,unitid,projName){
			var st="过滤函数设定，需要在PC.ProjectStatisGrid中设定searchHandler属性，该属性的值一个函数，该函数有3个参数，一个参数是Store，" +
					"第二个参数是选定的单位id，第三个参数是项目名称的关键字，编写自己的过滤方法，可以用store.baseParams.params改变过滤条件"
			var sqlStr="";
			if(unitid!=""){
			sqlStr='pid`'+unitid;
			}
			if(projName!=''){
			sqlStr+=';proName`'+projName;
			}
			store.baseParams.params=sqlStr;
			store.load({params:{start : 0,limit : 10}});
		},
		bbar: new Ext.PagingToolbar({
		    pageSize : 10,
		    store : roleDS,
		    displayInfo : true,
		    displayMsg : ' {0} - {1} / {2}',
		    emptyMsg: "无记录。"
		})
	})
	//roleDS.load()
	new Ext.Viewport({
		layout:'fit',
		items:[p]
	})
});