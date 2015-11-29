var centerPanel
var whereStr = " 1=1 ";
//var sjType=201111;
//var dydaView=false;
if(dydaView){
	whereStr="to_char(file_createtime,'YYYYMM')='"+sjType+"'";
}
var showType = '0-0';
var pathLabel;
Ext.onReady(function() {
			// 详细信息 附件 下载 标记已读
			var updateInfoBtn = new Ext.Toolbar.Button({
						id : 'update-info',
						text : '详细信息',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/toolbar/toolbar_item_edit.png",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

			var attachmentBtn = new Ext.Toolbar.Button({
						id : 'attachment',
						text : '附件',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icons/attach.png",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

			var downloadBtn = new Ext.Toolbar.Button({
						id : 'download',
						text : '下载',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/file-download.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

			pathLabel = new Ext.form.Label({text : '当前分类:'});
			// 第二行工具栏，显示当前选择的分类
			var sortPathBar = new Ext.Toolbar([pathLabel]);

			var filterArr = new Array();
			if ( g_canReport && DEPLOY_UNITTYPE == '0'){
				//filterArr.push( new Array('sort-all', '所有文件'));
				filterArr.push( new Array('reported', '所有的文件'));
			}
			
			filterArr.push( new Array('ALL', '部门所有文件'));
			filterArr.push(  new Array('person', '我起草(上传)的文件'));
			filterArr.push(  new Array('other', '部门其他文件'));

			var queryDt = new Ext.data.SimpleStore({
						fields : ['val', 'text'],
						data : filterArr
					});
			var searchCombo = new Ext.form.ComboBox({
						id : 'search',
						allowBlank : false,
						store : queryDt,
						fieldLabel : '查询',
						displayField : 'text',
						valueField : 'val',
						typeAhead : true,
						mode : 'local',
						triggerAction : 'all',
						width : 130,
						editable : false,
						selectOnFocus : true
					});
			if ( g_canReport && DEPLOY_UNITTYPE == '0'){
				searchCombo.setValue('reported');
				showType = '1-1';
				whereStr = " report_status = 1";
				if(dydaView){
					whereStr="to_char(file_createtime,'YYYYMM')='"+sjType+"' and "+whereStr;
				}
				searchCombo.setDisabled(true);
			}
			else{
				searchCombo.setValue('ALL');
			}
			
			searchCombo.on('select', function(c, rec, i) {
						showType = '0-0';
						whereStr = " 1=1 ";
						var val = rec.data["val"]
						if (val == 'ALL') {
							
						} else if (val == 'person') {
							whereStr = " file_auther = '" + USERID + "' ";
						} else if (val == 'other') {
							whereStr = " file_auther <> '" + USERID + "' ";
						} else if ( val == 'sort-all' ){
							showType = '0-1';
						} else if (val == 'reported') {
						 showType = '0-3';
						}
						if(dydaView){
							whereStr="to_char(file_createtime,'YYYYMM')='"+sjType+"' and "+whereStr;
						}
						dsResult.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									}
								});
					});
			var dataGridRs = Ext.data.Record.create([{
						name : 'uids',
						type : 'string'
					}, {
						name : 'fileLsh',
						type : 'string'
					}, {
						name : 'fileId',
						type : 'string'
					}, {
						name : 'fileTile',
						type : 'string'
					}, {
						name : 'fileSortId',
						type : 'string'
					}, {
						name : 'fileSortName',
						type : 'string'
					}, {
						name : 'fileContent',
						type : 'string'
					}, {
						name : 'fileAuther',
						type : 'string'
					}, {
						name : 'fileAutherName',
						type : 'string'
					}, {
						name : 'fileCreatetime',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'billState',
						type : 'int'
					}, {
						name : 'billStateName',
						type : 'string'
					}, {
						name : 'fileDept',
						type : 'string'
					}, {
						name : 'statePublish',
						type : 'int'
					}, {
						name : 'publisStateName',
						type : 'string'
					}, {
						name : 'fileDeptName',
						type : 'string'
					}]);
			var dataGridDsReader = new Ext.data.JsonReader({
						id : "uids",
						root : 'topics',
						totalProperty : 'totalCount'
					}, dataGridRs)

			dsResult = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : CONTEXT_PATH
											+ '/servlet/ComFileManageServlet'
								}),
						reader : dataGridDsReader
					});
			dsResult.on("beforeload", function(ds1) {
						Ext.apply(ds1.baseParams, {
									method : 'getComFileInfoBySortId',
									sortId : selectNode.id,
									whereStr : whereStr,
									orderby : "file_createtime asc",
									showType : showType,
									deptIds : USERDEPTID,
									pid:pid
								})
					})
			/*
			 * var fileNameShow = ""; if(parent.fromModule &&
			 * parent.fromModule=="editDoc") { fileNameShow = '<u
			 * style="cursor:hand;"><a
			 * onclick=openThisDocAtEast("{fileid}");return false;><font
			 * color=blue>{filename}</font></a></u>' } else { fileNameShow = '<a
			 * href=' + CONTEXT_PATH + '{url} >{filename}</a>'; }
			 */

			var imgs = "<img src='" + CONTEXT_PATH
					+ "/jsp/res/images/white_word.png'>"

			// 创建选择模型
			var sm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					});

			// 创建列模型

			// 编号 名称 部门 作者 时间 状态
			var columnModel = new Ext.grid.ColumnModel([sm, {
						header : '文件编号',
						dataIndex : 'fileId',
						width : 80
					}, {
						header : '文件名称',
						dataIndex : 'fileTile',
						width : 160,
						renderer : function(value, metaData, record, rowIndex,
								colIndex, store) {
							return '<a class="downloadLink" title="下载'
									+ value + '" onclick=downloadFile("'
									+ record.data.fileLsh + '")>' + value
									+ '</a>';
						}
					}, {
						header : '部门',
						dataIndex : 'fileDeptName',
						width : 80
					}, {
						header : '作者',
						dataIndex : 'fileAutherName',
						width : 50
					}, {
						header : '创建时间',
						dataIndex : 'fileCreatetime',
						renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'), // Ext内置日期renderer
						width : 80
					}, {
						header : '文件分类',
						dataIndex : 'fileSortName'
					}, {
						header : '发布状态',
						dataIndex : 'publisStateName',
						width : 50
					}]);

			pageToolbar = new Ext.PagingToolbar({
						pageSize : PAGE_SIZE,
						beforePageText : "第",
						afterPageText : "页,共{0}页",
						store : dsResult,
						displayInfo : true,
						firstText : '第一页',
						prevText : '前一页',
						nextText : '后一页',
						lastText : '最后一页',
						refreshText : '刷新',
						displayMsg : '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
						emptyMsg : "无记录。"
					});
			
			if (g_canReport ) {

				columnModel.setHidden(7, true);
				
			}
			var tbar ="";
			if(flag =="unBtn"){
               	tbar =[updateInfoBtn,downloadBtn,
					  attachmentBtn,'->',searchCombo];
			}else{
			    tbar =[updateInfoBtn,downloadBtn,
					  attachmentBtn,'->',searchCombo,dydaView?'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;':"",
					  dydaView?"":{text: '返回',iconCls: 'returnTo',handler: function(){history.back();}}];
			}
			// 创建Grid
			grid = new Ext.grid.GridPanel({

						ds : dsResult,
						cm : columnModel,
						sm : sm,
						region : 'center',
						layout : 'anchor',
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						loadMask : true, // 加载时是否显示进度
						stripeRows : true,
						viewConfig : {
							forceFit : true
						},
						bbar : pageToolbar,
						tbar : new Ext.Toolbar({
									items : tbar
								}),
						listeners : {
							'render' : function() {
								sortPathBar.render(this.tbar);
								
							}
							
						}
								

					});
            if(dydaView){
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
					});
            }else {
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [treePanel, grid]
					});
            }
			dsResult.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
		});
function onItemClick(item) {
	switch (item.id) {

		case 'update-info' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			showPropertyWin(selRecords[0].data.uids, 'update');
			break;
		case 'download' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			downloadFile(selRecords[0].data.fileLsh);
			break;

		case 'attachment' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			showAttachWin(selRecords[0].data.uids);
			break;

	}

}
function downloadFile(fileLsh) {
	if (fileLsh != "") {
        //根据文件流水号，查询文件类型，只有office类型文件才能在线打开
        var filename;
        var suffix;
        var _office = false;
        var sql="select file_lsh,file_name from Sgcc_Attach_List where file_lsh='"+fileLsh+"'";
        DWREngine.setAsync(false);
        db2Json.selectData(sql, function(jsonData) {
            var list = eval(jsonData);
            if (list != null && list && list[0]) {
                filename = list[0].file_name;
            }
        });
        DWREngine.setAsync(true);
        if(filename){
            suffix=filename.substring(filename.lastIndexOf(".")+1,filename.length);  
            if(suffix=="doc"||suffix=="xls"||suffix=="ppt"||suffix=="docx"||suffix=="xlsx"||suffix=="pptx"){
                _office = true;
            }
        }
        if((NTKOWAY!=null&&NTKOWAY==1)&&(_office)){
            var docUrl = BASE_PATH + "jsp/common/open.file.online.jsp" +
                    "?fileid="+fileLsh+"" +
                    "&filetype=sgccfile" +
                    "&ModuleLVL="+ModuleLVL;
                window.showModalDialog(docUrl,"","dialogWidth:"
                    + screen.availWidth + "px;dialogHeight:"
                    + screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
        }else{
            //文件管理的发布直接打开文件，因为文件管理发布的只有一个附件
            var openUrl = CONTEXT_PATH + "/servlet/BlobCrossDomainServlet" +
                    "?ac=sgccfile" +
                    "&fileid="+fileLsh+"" +
                    "&pid="+CURRENTAPPID;
            document.all.formAc.action = openUrl;
            document.all.formAc.submit();
        }
    } else {
		Ext.Msg.alert("提示", "该文件不存在!")
	}
}
function uploadFile(filePk) {
	var record = dsResult.getById(filePk);
	if (record.get("billState") != 0 || record.get("statePublish") != 0) {
		Ext.Msg.alert("提示", "不能更新该文件，请检查文件审批状态和发布状态!")
	} else {
		var param = new Object()
		param.allowableFileType = ".doc`.docx`.wps`.ppt`.pptx`.rtf`.dps";
		param.businessId = filePk;
		param.businessType = "FAPDocument";
		param.fileSource = "blob";
		param.compressFlag = "0";
		param.fileId = record.get("fileLsh");
		upWin = showBlobFileWin(param)
	}

}
function showAttachWin(filePk) {
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable=false&businessId="
			+ filePk;

	templateWin = new Ext.Window({
				title : "附件",
				width : 600,
				height : 230,
				minWidth : 300,
				minHeight : 150,
				layout : 'fit',
				plain : true,
				closeAction : 'hide',
				modal : true,
				html : "<iframe name='frmAttachPanel' src='" + fileUploadUrl
						+ "' frameborder=0 width=100% height=100%></iframe>"
			});
	templateWin.show();
}

function showPropertyWin(filePk, eM) {
	var record = dsResult.getById(filePk);
	var obj = new Object();
	obj.rec = record;
	obj.editMode = eM;
	obj.editEnable = false;
//	if (record) {
//		if (record.get("billState") != 0 || record.get("statePublish") != 0
//				|| record.get("fileAuther") != USERID) {
//			obj.editEnable = false;
//		}
//	}
	obj.selectedNode = selectNode;
	var treeInfo = new Object();
	treeInfo.rootId = g_rootId;
	treeInfo.rootName = g_rootName;
	obj.treeInfo = treeInfo
	obj.gridStore = dsResult;
	var style = "dialogWidth:800px;dialogHeight:500px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	if (filePk == null) {
		style = "dialogWidth:800px;dialogHeight:300px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	}
	window
			.showModalDialog(
					CONTEXT_PATH
							+ "/Business/fileAndPublish/fileManage/com.fileManage.property.jsp",
					obj, style);
}
