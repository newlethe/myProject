/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
// 全局变量


var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.budget.hbm.BdgCorpBasic"
var business = "baseMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "corpbasicid"
var orderColumn = "corpbasicid"
var PAGE_SIZE = 5;

Ext.onReady(function (){ 
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）
  
	var fc = {		// 创建编辑域配置
    	 'corpbasicid': {
			name: 'corpbasicid',
			fieldLabel: '建设法人主键',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			allowBlank: false,
			anchor:'95%'
         }, 'month': {
			name: 'month',
			fieldLabel: '月份',
			anchor:'95%'
		 }, 'money': {
			name: 'money',
			fieldLabel: '金额',
			anchor:'95%'
         } ,'corpremark': {
			name: 'corpremark',
			fieldLabel: '备注',
			anchor:'95%'
         }
    }
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'corpbasicid',
           header: fc['corpbasicid'].fieldLabel,
           dataIndex: fc['corpbasicid'].name, 
           hidden:true,        
           width: 200
        },{
           id:'month',
           header: fc['month'].fieldLabel,
           dataIndex: fc['month'].name,
           width: 120
        },{
           id:'money',
           header: fc['money'].fieldLabel,
           dataIndex: fc['money'].name,
           align:'right',
           renderer: cnMoneyToPrec,
           width: 120
        },{
           id: 'corpremark',
           header: fc['corpremark'].fieldLabel,
           dataIndex: fc['corpremark'].name,
           width: 120
        }
    ]);
    cm.defaultSortable = true;						//设置是否可排序
	
    // 3. 定义记录集
    var Columns = [
    	{name: 'corpbasicid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'month', type: 'string'},
		{name: 'money', type: 'float'},
		{name: 'corpremark', type: 'string'}
	];
	
	/*
    var Plant = Ext.data.Record.create(Columns);//定义记录集
	var PlantInt = {month: '',corpremark: ''};
    */
	
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: ServletUrl
        }),
        
        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    var btnAdd = new Ext.Button({
		id: 'add',
		text: '新增',
		tooltip: '新增',
		iconCls: 'add',
		handler: function(){
			var url = BASE_PATH+"Business/budget/bdg.corp.edit.jsp";
			window.location.href = url;
		}
	});
	
	// 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.GridPanel({
        // basic properties
    	id: 'grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [btnAdd],					//顶部工具栏，可选
        height: 300,				//高
        title: '建设法人主表',		//面板标题
        iconCls: 'icon-show-all',	//面板样式
        border: false,				// 
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});

	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this);
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		gridMenu.removeAll();
		gridMenu.addMenuItem({
			id: 'menu_corp',
			text: '　建设法人信息',
			iconCls: 'form',
			value: record,
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_edit',
			text: '　修改',
			iconCls: 'btn',
			value: record,
			handler: toHandler
		});
		gridMenu.add('-');
		gridMenu.addMenuItem({
			id: 'menu_del',
			text: '　删除',
			iconCls: 'multiplication',
			value: record,
			handler: toHandler
		});
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}

	function toHandler(){
	    var state = this.id;
	    var menu_corpbasicid = this.value.get("corpbasicid");
		if ("" != state){
			Ext.get('loading-mask').show();
			Ext.get('loading').show();
			if ("menu_corp" == state){
				window.location.href = BASE_PATH + "Business/budget/bdg.corpInfo.apportion.jsp?corpbasicid=" + menu_corpbasicid;
			}else if ("menu_edit" == state){
				window.location.href = BASE_PATH + "Business/budget/bdg.corp.edit.jsp?corpbasicid="+menu_corpbasicid;
			}else if ("menu_del" == state){
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				Ext.Msg.show({
					title: '提示',
					msg: '是否要删除?　　　　',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							bdgCorpMgm.deleteBdgCorpBasic(menu_corpbasicid, function(flag){
								if ("0" == flag){
									Ext.example.msg('删除成功！', '您成功删除了一条建设法人管理基本信息！');
									reload();
								}else if ("1" == flag){
									Ext.Msg.show({
										title: '提示',
										msg: '数据删除失败！',
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
								}
							});
						}
					}
				});
			}else{ return; }
		}
	}
	
	
	// 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            autoHeight : true,
            items: [grid],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [grid]
        });
    }

  
    // 12. 加载数据
    reload();
    function reload(){
	    ds.load({
	    	params: {
		    	start: 0,
		    	limit: PAGE_SIZE
	    	}
	    });
    }
 
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };

});




