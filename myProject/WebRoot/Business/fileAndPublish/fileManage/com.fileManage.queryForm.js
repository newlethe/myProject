var treeInfo = new Object();
treeInfo.rootId = g_rootId;
treeInfo.rootName = g_rootName;

// 所选的文件分类id
var fileSortId;

var fileSortNameField = new Ext.form.ComboBox({
	store : new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			}),
	editable : false,
	shadow : false,
	id : 'fileSortName',
	name : 'fileSortName',
	mode : 'local',
	triggerAction : 'all',
	anchor : '98%',
	fieldLabel : "文件分类",
	tpl : '<tpl for="."><div style="height:200px"><div id="tree1"></div></div></tpl>',
	selectedClass : '',
	onSelect : Ext.emptyFn
});
var treeNodeUrl = CONTEXT_PATH
		+ "/servlet/ComFileSortServlet?method=buildAllTreeByDept&parentId="
		+ treeInfo.rootId + "&deptId=" + USERDEPTID
var tree1 = new Ext.tree.TreePanel({
			loader : new Ext.tree.TreeLoader({
						dataUrl : treeNodeUrl
					}),
			border : false,
			rootVisible : false,
			root : new Ext.tree.AsyncTreeNode({
						text : treeInfo.rootName,
						id : treeInfo.rootId
					})
		});
tree1.on('click', function(node) {
			fileSortNameField.setValue(node.text);
			fileSortId = node.id;
			fileSortNameField.collapse();
		});
fileSortNameField.on('expand', function() {
			tree1.render('tree1');
		});
var fileIdField = new Ext.form.TextField({
			fieldLabel : '文件编号',
			name : 'fileId'
		});
var fileNameField = new Ext.form.TextField({
			fieldLabel : '文件名称',
			name : 'fileName'
		});
var deptField = new Ext.form.TextField({
			fieldLabel : '部门',
			name : 'dept',
			disabled : true,
			value : UNITNAME
		});
var beginDateField = new Ext.form.DateField({
			id : 'beginDate',
			fieldLabel : '创建时间',
			format : 'Y-m-d',
			minValue : '2000-01-01',
			emptyText : '开始时间'
		});
var endDateField = new Ext.form.DateField({
			id : 'endDate',
			hideLabel : true,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			emptyText : '结束时间'
		});

var queryFormPanel = new Ext.form.FormPanel({
			id : 'file-publish-query-form',
			frame : true,
			labelAlign : 'left',
			title : '文件查询',
			width : 300,
			layout : 'border',
			items : [new Ext.form.FieldSet({
						region : 'center',

						border : false,
						layout : 'column',
						buttons : [{
							text : '查询',
							handler : function() {
								// var fileSort =
								// fileSortField.getValue();
								var fileId = fileIdField.getValue();
								var fileName = fileNameField.getValue();
								// var dept = deptField.getValue();
								var beginDate = beginDateField.getValue();
								var endDate = endDateField.getValue();

								if (beginDate && endDate) {
									if (beginDate > endDate) {
										Ext.Msg.alert("提示", "开始时间不能大于结束时间！");
										return;
									}
								}
								
								//保存原始条件字符串，保证在模糊查找完成后下一次查找还原为之前的条件
								var oriWhere = whereStr;

								if (whereStr.trim() == '') {

									whereStr = " 1 = 1";
								}

								if (fileSortId) {
									whereStr += " and FILE_SORT_ID = '"
											+ fileSortId + "'";
								}
								
								if ( fileId ){
									whereStr += " and FILE_ID like '%" + fileId + "%'";
								}

								if (fileName) {
									whereStr += " and FILE_TILE like '%"
											+ fileName + "%'";
								}

								if (beginDate) {
									whereStr += " and file_createtime >= to_date('"
											+ formatDate(beginDate)
											+ "','YYYY-MM-DD')'";
								}

								if (endDate) {
									whereStr += " and file_createtime <= to_date('"
											+ formatDate(endDate)
											+ "','YYYY-MM-DD')'";
								}

								
// dsResult.load({
								// params : {
								// start : 0,
								// limit : PAGE_SIZE
								// }, callback : function(){
								// //还原条件
								// whereStr = oriWhere;
								// formWin.hide();
								//											}
								//										});

							}
						}],
						items : [{// 文件分类、文件编号、文件名称、发布时间段、发布部门
							columnWidth : .5,
							layout : 'form',
							labelWidth : 70,
							defaults : {
								width : 120,
								border : false
							},

							autoHeight : true,
							bodyStyle : 'padding:0 0 5px 15px;',
							items : [fileSortNameField]

						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 70,
							defaults : {
								width : 120,
								border : false
							},

							autoHeight : true,
							bodyStyle : 'padding:0 0 5px 15px;',
							items : [fileIdField]

						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 70,
							defaults : {
								width : 120,
								border : false
							},

							autoHeight : true,
							bodyStyle : 'padding:0 0 5px 15px;',
							items : [fileNameField]

						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 70,
							defaults : {
								width : 120,
								border : false
							},

							autoHeight : true,
							bodyStyle : 'padding:0 0 5px 15px;',
							items : [deptField]

						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 70,
							defaults : {
								width : 120,
								border : false
							},

							autoHeight : true,
							bodyStyle : 'padding:0 0 5px 15px;',
							items : [beginDateField]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 70,
							defaults : {
								width : 120,
								border : false
							},

							autoHeight : true,
							bodyStyle : 'padding:0 0 5px 15px;',
							items : [endDateField]

						}]
					})]

		});

var formWin = new Ext.Window({
			width : 500,
			minWidth : 460,
			height : 200,
			layout : 'fit',
			iconCls : 'form',
			closeAction : 'hide',
			border : false,
			constrain : true,
			maximizable : false,
			modal : true,
			items : [queryFormPanel]
		});

function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
}
