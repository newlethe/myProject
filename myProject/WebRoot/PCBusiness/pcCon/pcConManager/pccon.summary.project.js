function test(value, metadata, record) {
		  var pid=record.get('pid');
		  var pname=record.get('prjName');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
			output += '\'"><a href="'+CONTEXT_PATH+'/PCBusiness/pcCon/pcConManager/pc.con.info.manager.view.jsp?PID='+pid+'&pname='+encodeURIComponent(pname)+'" >' + value + '</a></span>'
		return output;
	}
var str ="pid`"+USERBELONGUNITID;
Ext.onReady(function (){
    var conDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pcmis.contract.hbm.ConInfoBean",				
	    	business: "pcConMgm",
	    	method: "getConInfoManagerStr",
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
        	{name: 'conValue', type: 'float'},		//Grid显示的列，必须包括主键(可隐藏)
	    	{name: 'pid', type: 'string'},	
			{name: 'changeMoney', type: 'float'},
			{name : 'alreadyPay', type : 'float'},
			{name : 'claMoney', type : 'float'},
			{name : 'conMoney', type : 'float'},
			{name : 'breMoney', type : 'float'},
			{name : 'balAppMoney', type : 'float'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	conDS.load({params:{start :0,limit : 10}})
	var _columns = [{
           header: "合同总金额",
           dataIndex: "conValue",
           align : 'center',
           width: 100
        },{
        	header:'累计变更金额',
        	 dataIndex: "changeMoney",
        	 align : 'center',
        	 width : 150
        },{
            header: '累计索赔金额',
        	dataIndex: "claMoney",
        	align : 'center',
        	width : 110
        },{
            header : '结算金额',
            dataIndex : 'balAppMoney',
            align : 'center',
            width : 100
        },{
            header : '签订金额',
            dataIndex :'conMoney',
            align : 'center',
            width : 100
        },{
            header : '累计违约金额',
            dataIndex : 'breMoney',
            align : 'center',
            width : 100
        },{
            header :'累计已付款',
            dataIndex : 'alreadyPay',
            align : 'center',
            width : 100
        },{
            header : '合同执行是否异常',
            dataIndex : 'alreadyPay',
            align : 'center',
            width : 150
        },{
           header:'pid',
           dataIndex: 'pid',
           hidden : true
        }
	]
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:test,
		title:'<center><b><font size=3>项目合同信息一览表</font></b></center>',
		ds:conDS,
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
			store.load({params:{start : 0,limit : 10}});
		},
		bbar: new Ext.PagingToolbar({
		    pageSize : 10,
		    store : conDS,
		    displayInfo : true,
		    displayMsg : ' {0} - {1} / {2}',
		    emptyMsg: "无记录。"
		})
	})
	new Ext.Viewport({
		layout:'fit',
		items:[p]
	})
});