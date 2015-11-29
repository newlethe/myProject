function test(){
	alert("可以根据不同的业务跳转到不同的页面，需要在构建PC.ProjectStatisGrid时设定prjRenderer属性，" +
			"如：function(value){return \"<a href=\'javascript:test()\'>\"+value+\"</a>\"}");
}
Ext.onReady(function (){
    var roleDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pmis.wzgl.hbm.WzBm",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params:"1=1"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "rolepk"
        }, [
        	{name: 'bm', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
	    	{name: 'pid', type: 'string'},	
			{name: 'jldw', type: 'string'},
			{name: 'roletype', type: 'int'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	
	var _columns = [{
           header: "名称",
           dataIndex: "bm",
           width: 120
        },{
        	header:'物质编码',
        	 dataIndex: "bm"
        }, {
           header:'计量单位',
           dataIndex: 'jldw',
           width: 80
        }, {
           header:'pid',
           dataIndex: 'pid',
           width: 180
        }
	]
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:function(value,r,s){return "<a href='javascript:test('a','b','c')'>"+value+"</a>"},
		title:'<center><b><font size=3>项目基本信息一览表</font></b></center>',
		ds:roleDS,
		columns:_columns,
		searchHandler:function(store,unitid,projName){
			var str="过滤函数设定，需要在PC.ProjectStatisGrid中设定searchHandler属性，该属性的值一个函数，该函数有3个参数，一个参数是Store，" +
					"第二个参数是选定的单位id，第三个参数是项目名称的关键字，编写自己的过滤方法，可以用store.baseParams.params改变过滤条件"
			alert(str)		
		}
	})
	roleDS.load()
	new Ext.Viewport({
		layout:'fit',
		items:[p]
	})
});