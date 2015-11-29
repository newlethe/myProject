var bean = "com.sgepit.pmis.finalAccounts.finance.hbm.FASubjectSort"
var business = "baseMgm"
var listMethod = "getBdgSubjects"
var primaryKey = "uids"
var orderColumn = "subNo"
var subjectTree;
var servletName = "servlet/FAFinanceServlet"

btnCancel = new Ext.Button({
			text : '取消对照关系',
			iconCls : 'remove',
			handler : function(){
				var selRecords = sm.getSelections();
				if ( selRecords.length == 0 )
					return;
				
				var subIds = new Array();
				Ext.each(selRecords, function(rec, idx){
		
					subIds.push(rec.data.uids);
				});
				delContrast(subIds);
			}
		})

var sm = new Ext.grid.CheckboxSelectionModel() // 创建选择模式
var fm = Ext.form; // 包名简写（缩写）

var fc = { // 创建编辑域配置
	'uids' : {
		name : 'uids',
		fieldLabel : '科目主键',
		hidden : true,
		hideLabel : true
	},
	'subNo' : {
		name : 'subNo',
		fieldLabel : '科目编号',
		anchor : '95%'
	},
	'subName' : {
		name : 'subName',
		fieldLabel : '科目名称',
		anchor : '95%'
	},
	'fullName' : {
		name : 'fullName',
		fieldLabel : '科目全称',
		anchor : '95%'
	}
}

// 3. 定义记录集
var Columns = [{
			name : 'uids',
			type : 'string'
		}, {
			name : 'subNo',
			type : 'string'
		}, // Grid显示的列，必须包括主键(可隐藏)
		{
			name : 'subName',
			type : 'string'
		}, {
			name : 'fullName',
			type : 'string'
		}];

var cm = new Ext.grid.ColumnModel([ // 创建列模型
sm, {
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		}, {
			id : 'subNo',
			header : fc['subNo'].fieldLabel,
			dataIndex : fc['subNo'].name,
			width : 100
		}, {
			header : fc['subName'].fieldLabel,
			dataIndex : fc['subName'].name,
			width : 100
		}, {
			header : fc['fullName'].fieldLabel,
			dataIndex : fc['fullName'].name,
			width : 120
		}]);
cm.defaultSortable = true; // 设置是否可排序

// 4. 创建数据源
var ds = new Ext.data.Store({
	baseParams : {
		ac : listMethod, // 表示取列表
		bdgid : ''
	},
	proxy : new Ext.data.HttpProxy({
				method : 'POST',
				url : servletName
			}),
	reader : new Ext.data.JsonReader({
				root : 'topics',
				totalProperty : 'totalCount',
				id : primaryKey
			}, Columns),
	remoteSort : true,
	pruneModifiedRecords : true
		// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
	});
ds.setDefaultSort(orderColumn, 'asc'); // 设置默认排序列

// 5. 创建可编辑的grid: grid-panel
var grid = new Ext.grid.GridPanel({
	// basic properties
	id : 'bdg-fin-ref-panel', // id,可选
	ds : ds, // 数据源
	cm : cm, // 列模型
	sm : sm, // 行选择模式
	tbar : ['<font color=#15428b><b>&nbsp;该概算项对应的科目</b></font>', '-', btnCancel], // 顶部工具栏，可选
	border : false, // 
	region : 'center',
	header : false, //
	frame : false, // 是否显示圆角边框
	autoScroll : true, // 自动出现滚动条
	split : true,
	animCollapse : false, // 折叠时显示动画
	loadMask : true, // 加载时是否显示进度
	stripeRows : true,
	viewConfig : {
		forceFit : true,
		ignoreAdd : true
	},
	bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
		pageSize : PAGE_SIZE,
		store : ds,
		displayInfo : true,
		displayMsg : ' {0} - {1} / {2}',
		emptyMsg : "无记录。"
	})
});

function delContrast(subIds) {
	Ext.Ajax.request({
				method : 'post',
				url : servletName,
				params : {
					ac : 'setSubjectRefBdg',
					bdgid : null,
					subIds : subIds
				},
				success : function(result, request) {

					reloadSubRefGrid(curBdgid);
					Ext.example.msg('保存成功！', '保存成功!');
				},
				failure : function(result, request) {
					Ext.Msg.show({
								title : '保存失败',
								msg : '保存失败',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});

}
