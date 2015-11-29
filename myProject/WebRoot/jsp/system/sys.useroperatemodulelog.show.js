var bean = "com.sgepit.frame.sysman.hbm.VUserOperatemoduleLog"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "thistime"
var ds;
Ext.onReady(function(){
	var fm = Ext.form;
    var fc = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'username' : {name : 'username',fieldLabel : '登录用户名'},
		'thistime' : {name : 'thistime',fieldLabel : '登录时间'},
		'thisip' : {name : 'thisip',fieldLabel : '登录IP'},
		'operatetime' : {name : 'operatetime',fieldLabel : '访问时间'},
		'modilename' : {name : 'modilename',fieldLabel : '访问模块'}
	};
	var cm = new Ext.grid.ColumnModel([
		{
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		},{
			id : 'username',
			header : fc['username'].fieldLabel,
			dataIndex : fc['username'].name,
			width : 150
		},{
			id : 'thistime',
			header : fc['thistime'].fieldLabel,
			dataIndex : fc['thistime'].name,
			renderer : formatDate,
			align:"center",
			width : 180
		},{
			id : 'thisip',
			header : fc['thisip'].fieldLabel,
			dataIndex : fc['thisip'].name,
			align:"center",
			width : 150
		},{
			id : 'operatetime',
			header : fc['operatetime'].fieldLabel,
			dataIndex : fc['operatetime'].name,
			renderer : formatDate,
			align:"center",
			width : 180
		},{
			id : 'modilename',
			header : fc['modilename'].fieldLabel,
			dataIndex : fc['modilename'].name,
			// 鼠标悬停时显示完整信息
            renderer :  function(data, metadata, record, rowIndex,
                    columnIndex, store) {
	            var qtip = "qtip=" + data;
	            return '<span ' + qtip + '>' + data + '</span>';
            },
			width : 380
		}
	]);
	var Columns = [
		{name:'uids', type:'string'},
		{name:'username', type:'string'},
		{name:'thistime', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'thisip', type:'string'},
		{name:'operatetime', type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'modilename', type:'string'}
	];
	ds = new Ext.data.GroupingStore({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: "operatetime between sysdate-10 and sysdate"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true,
        remoteGroup : true,
		groupField : orderColumn // 分组
    });
    cm.defaultSortable = true;
    var gridPanel = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		border: false, 
		region: 'center',
		header: false, 
		tbar:['<font color=#15428b><B>用户访问模块日志查询>><B></font>',
		"用户名：",new Ext.form.TextField({
				id: "username",
				fieldLabel: "用户名：",
				width: 120
			}),
		"访问模块：",new Ext.form.TextField({
				id: "modilename",
				fieldLabel: "访问模块：",
				width: 120
			}),
		"登录时间：",new Ext.form.DateField({id:'st_begin',emptyText:'开始时间',readOnly:true,width:85,format:'Y-m-d'}),
	    '至',new Ext.form.DateField({id:'st_end',emptyText:'结束时间',readOnly:true,width:85,format:'Y-m-d', value: new Date}),
	    '-',new Ext.Toolbar.Button({id : 'query',text : '查 询',cls : 'x-btn-text',icon : 'images/business/flowsend.png',handler : onItemClick}),
	    '-',new Ext.Toolbar.Button({id : 'reset',text : '重 置',cls : 'x-btn-text',icon : 'images/icons/clear.gif',handler : onItemClick})
	    ],
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: false,
			ignoreAdd: true
		},
		view : new Ext.grid.GroupingView({ // 分组
			forceFit : false,
			groupTextTpl : '{text}(共{[values.rs.length]}项)'
		}),
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var nowdate = new Date();
	var beginTimeMs=nowdate.getTime()-(10*24*60*60*1000);
	nowdate.setTime(beginTimeMs);
	Ext.getCmp("st_begin").setValue(nowdate);
	
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanel]
	});
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [contentPanel]
	});
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	function onItemClick(item) {
		switch(item.id) {
			case 'query':
				var qstr='';
				var username=Ext.getCmp('username').getValue();
				if (username=='') {
					qstr+=' and 1=1';
				} else {
					qstr+=" and username like \'%"+username+"%\'";
				}
				var modilename=Ext.getCmp('modilename').getValue();
				if (modilename=='') {
					qstr+=' and 1=1';
				} else {
					qstr+=" and modilename like \'%"+modilename+"%\'";
				}
				var st_begin=Ext.getCmp('st_begin').getValue();
				var st_end=Ext.getCmp('st_end').getValue();
		   		if(st_begin!='') {
		   			st_begin=st_begin.format('Y-m-d')+' 00:00:00';
		   		}
		   		if(st_end!='') {
		   			st_end=st_end.format('Y-m-d')+' 23:59:59';
		   		}
		   		if(st_end<st_begin&&st_begin!=''&&st_end!=''){
		   			alert("结束时间不能早于开始时间!");
		   			return;
		   		} else if (st_begin==''&&st_end=='') {
		   			qstr+=' and 1=1';
		   		} else if (st_begin!=''&&st_end=='') {
		   			qstr+=" and thistime>=to_date('"+st_begin+"','yyyy-MM-dd hh24:mi:ss')";
		   		} else if (st_begin==''&&st_end!='') {
		   			qstr+=" and thistime<= to_date('"+st_end+"','yyyy-MM-dd hh24:mi:ss')";
		   		} else if (st_begin!=''&&st_end!='') {
		   			qstr+=" and thistime>=to_date('"+st_begin+"','yyyy-MM-dd hh24:mi:ss') and operateTime<= to_date('"+st_end+"','yyyy-MM-dd hh24:mi:ss')";
		   		}
		   		if (qstr.substr(0, 4)==' and') {
		   			qstr=qstr.substr(4);
		   		}
		   		gridPanel.getStore().baseParams.params=qstr;
		   		gridPanel.getStore().load({params:{start:0,limit:PAGE_SIZE}});
				break;
			case 'reset':
				Ext.getCmp('username').setValue('');
				Ext.getCmp('modilename').setValue('');
				Ext.getCmp('st_begin').setValue('');
				Ext.getCmp('st_end').setValue('');
				gridPanel.getStore().baseParams.params="1=1";
		   		gridPanel.getStore().load({params:{start:0,limit:PAGE_SIZE}});
				break;
		}
	}
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d H:i:s') : '';
    };
});