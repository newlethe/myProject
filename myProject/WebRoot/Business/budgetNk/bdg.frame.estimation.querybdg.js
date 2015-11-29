var gridPanelTitle = "该内控概算分摊情况查看"
var curBdgid;

var fcBdg = { // 创建编辑域配置
	'conname' : {
		name : 'CONNAME',
		fieldLabel : '合同名称',
		anchor : '95%'
	},
	'realmoney' : {
		name : 'REALMONEY',
		fieldLabel : '合同分摊金额',
		anchor : '95%'
	},
	'bdgmoney' : {
		name : 'BDGMONEY',
		fieldLabel : '概算金额',
		anchor : '95%'
	},
	'bdgname' : {
		name : 'BDGNAME',
		fieldLabel : '概算名称',
		anchor : '95%'
	}
}

// 定义记录集
var BdgColumns = [{
			name : 'CONNAME',
			type : 'string'
		}, {
			name : 'REALMONEY',
			type : 'float'
		}, {
			name : 'BDGNAME',
			type : 'string'
		}, {
			name : 'BDGMONEY',
			type : 'float'
		}];

// 创建列模型
var cmBdg = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
			id : 'conname',
			header : fcBdg['conname'].fieldLabel,
			dataIndex : fcBdg['conname'].name,
			width : 150
		}, {
			header : fcBdg['realmoney'].fieldLabel,
			dataIndex : fcBdg['realmoney'].name,
			align : 'right',
			renderer : cnMoneyToPrec,
			width : 90
		}, {
			header : fcBdg['bdgmoney'].fieldLabel,
			dataIndex : fcBdg['bdgmoney'].name,
			align : 'right',
			renderer : function(value) {
				return "<div align='right'>" + cnMoneyToPrec(value) + "</div>";
			},
			// renderer: cnMoneyToPrec,
			width : 90
		}, {
			header : fcBdg['bdgname'].fieldLabel,
			dataIndex : fcBdg['bdgname'].name,
			width : 90
		}]);

// 4. 创建数据源
var dsBdg = new Ext.data.Store({
			baseParams : {
				ac : 'queryBdg'
			},

			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : 'servlet/BudgetNkServlet'
					}),

			// 创建reader读取数据
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : 'conid' // 主键
					}, BdgColumns)

		});

dsBdg.on("beforeload", function(ds1) {
			Ext.apply(ds1.baseParams, {
						bdgid : curBdgid,
						ac : 'queryBdg'
					})
		})

var gridBdg = new Ext.grid.GridPanel({
			store : dsBdg,
			cm : cmBdg,
			header : false,
			viewConfig : {
				forceFit : true
			},
			// tbar: ['<font color=#15428b><b>&nbsp;'+
			// gridPanelTitle+'</b></font>'],
			width : 800,
			height : 300,
			iconCls : 'icon-show-all',
			border : false,
			region : 'center'
		});
