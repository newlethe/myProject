var primaryKey = "uids";
// var propertyName = "sortUids"
var projInfo = {
	pid : '',
	pname : '',
	industryType : ''
};
var reportType = [['0','全部'],['1', '周报'], ['2', '月报']];
var reportStat = [['0', '未上报'], ['1', '已上报']];
var jlGrid = null;
var append='';
if(lvl != null && lvl != "") ModuleLVL = lvl;
var titleText="";
var RW= parseInt(ModuleLVL)<3?true:false;  //全局判断是否显示顶部工具栏按钮以及附件上传还是查看
append = RW?'':'and report_stat=1';
Ext.onReady(function() {
		    if (pid == null || pid == '') {
				titleText = "";
				pid = CURRENTAPPID;
			} else {
			    DWREngine.setAsync(false);
			    baseDao.getData("select t.prj_name from pc_zhxx_prj_info t where pid = '"+pid+"'",function(text){
		           titleText = [text+" - "+'监理报告信息查询'];
		         })
		       DWREngine.setAsync(true);
            }
			var jlColumns = [{
						name : 'pid',
						type : 'string'
					}, {
						name : 'uids',
						type : 'string'
					}, {
						name : 'createdate',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'createperson',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}, {
						name : 'reportname',
						type : 'string'
					}, {
						name : 'memo',
						type : 'string'
					}, {
						name : 'reportStat',
						type : 'string'
					}, {
						name : 'projectId',
						type : 'string'
					}, {
						name : 'supercompa',
						type : 'string'
					}]
					
					
			var jlDsWhere = "pid='" + pid + "'"+ append +" order by createdate desc";
			if(type == '1' || type == '2'){
                jlDsWhere = "pid='" + pid + "'"+ append +" and type = '"+type+"' order by createdate desc";
            }
			var jlDs = new Ext.data.Store({
				baseParams : {
					ac : 'list', // 表示取列表
					// com/sgepit/pcmis/zlgk/hbm/PcZlgkSuperreportInfo
					bean : 'com.sgepit.pcmis.zlgk.hbm.PcZlgkSuperreportInfo',
					business : 'baseMgm',
					method : 'findWhereOrderby',
					params : jlDsWhere,
					outFilter:outFilter
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : "uids"
						}, jlColumns),
				remoteSort : true,
				pruneModifiedRecords : true,
					// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
				
				//加载时判断办理状态，如果是已上报，该行设置为不可以编辑
				listeners:{load: function(){
					
				  }}
				});
			var fm = Ext.form;
			// 创建可编辑配置区域
			var fc = { // 创建编辑域配置
				'pid' : {
					name : 'pid',
					fieldLabel : '项目编号',
					hidden : true,
					hideLabel : true,
					anchor : '95%'
				},
				'uids' : {
					name : 'uids',
					fieldLabel : '唯一约束',
					hidden : true,
					hideLabel : true
				},
				'createdate' : {
					name : 'createdate',
					fieldLabel : '报告日期',
					hidden : false,
					hideLabel : false,
					format : 'Y-m-d',
					minValue : '2010-01-01',
					anchor : '95%'
				},
				'createperson' : {
					name : 'createperson',
					fieldLabel : '报告撰写人',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				},
				'type' : {
					name : 'type',
					fieldLabel : '报告类型',
					displayField : 'v',
					valueField : 'k',
					mode : 'local',
					triggerAction : 'all',
					lazyRender : false,
					listClass : 'x-combo-list-small',
					store : new Ext.data.SimpleStore({
								fields : ['k', 'v'],
								data : [['1', '周报'], ['2', '月报']]
							}),
					anchor : '95%'
				},
				'reportname' : {
					name : 'reportname',
					fieldLabel : '报告名称',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				},
				'memo' : {
					name : 'memo',
					fieldLabel : '备注',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				},
				'reportStat' : {
					name : 'reportStat',
					fieldLabel : '上报状态',
					displayField : 'v',
					valueField : 'k',
					mode : 'local',
					triggerAction : 'all',
					lazyRender : false,
					listClass : 'x-combo-list-small',
					store : new Ext.data.SimpleStore({
								fields : ['k', 'v'],
								data : [['0', '未上报'], ['1', '已上报']]
							}),
					anchor : '95%',
					align: 'center'
				},
				'projectId' : {
					name : 'projectId',
					fieldLabel : '验评信息表ID',
					hidden : true,
					hideLabel : true,
					anchor : '95%'
				},
				'supercompa' : {
					name : 'supercompa',
					fieldLabel : '报告单位',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				}
			}
			// 编辑区域配置完成-------------------------------------
			// 创建列模型
			var jlSm = new Ext.grid.CheckboxSelectionModel({
						header: '',
						singleSelect : true
					})
			var jlCm = new Ext.grid.ColumnModel([jlSm, {
						id : 'pid',
						header : fc['pid'].fieldLabel,
						dataIndex : fc['pid'].name,
						hidden : true
					}, {
						id : 'uids',
						header : fc['uids'].fieldLabel,
						dataIndex : fc['uids'].name,
						hidden : true
					}, {
						id : 'createdate',
						header : fc['createdate'].fieldLabel,
						dataIndex : fc['createdate'].name,
						hidden : false,
						width : 120,
						editor : (RW?new fm.DateField(fc['createdate']):null),
						renderer : formatDate,
						align: 'center'
					}, {
						id : 'createperson',
						header : fc['createperson'].fieldLabel,
						dataIndex : fc['createperson'].name,
						hidden : true,
						width : 140,
						editor : (RW?new fm.TextField(fc['createperson']):null)
					}, {
						id : 'type',
						header : fc['type'].fieldLabel,
						dataIndex : fc['type'].name,
						hidden : false,
						editor : (RW?new fm.ComboBox(fc['type']):null),
						renderer : typeShow,
						align: 'center'
					}, {
						id : 'reportname',
						header : fc['reportname'].fieldLabel,
						dataIndex : fc['reportname'].name,
						hidden : false,
						width : 180,
						editor : (RW?new fm.TextField(fc['reportname']):null),
						align: 'center'
					}, {
						id : 'memo',
						header : fc['memo'].fieldLabel,
						dataIndex : fc['memo'].name,
						width : 120,
						hidden : true,
						editor : (RW?new fm.TextField(fc['memo']):null),
						align: 'center'
					}, {
						id : 'projectId',
						header : fc['projectId'].fieldLabel,
						dataIndex : fc['projectId'].name,
						hidden : true
					}, {
						id : 'supercompa',
						header : fc['supercompa'].fieldLabel,
						dataIndex : fc['supercompa'].name,
						hidden : false,
						width: 240,
						align: 'center',
						editor : (RW?new fm.TextField(fc['supercompa']):null)
					}, {
						// 附件id使用uids
						id : 'uids',
						header : '附件',
						dataIndex : fc['uids'].name,
						hidden : false,
						align: 'center',
						width : 100,
						renderer : function(v,m,r) {
							if(r.isNew)
							{
								return '';
							}
							else 
							{
								var status = r.get("reportStat");
								var enable = '1';
								if(!RW||status=='1')
								{
									 enable = '';
								}
								return "<a href='javascript:uploadfile(\"" + v
										+ "\",\""+enable+"\")'>"+'附件'+"</a>"
							}
						}
					}, {
                        id : 'reportStat',
                        header : fc['reportStat'].fieldLabel,
                        dataIndex : fc['reportStat'].name,
                        hidden : !RW,
                        align: 'center',
//                      editor : (RW?new fm.ComboBox(fc['reportStat']):null),
                        renderer : statShow
                    }]);
			// 列模型创建完毕

			// 创建显示批文办理情况的grid
			 jlGrid = new Ext.grid.EditorGridTbarPanel({
						region : 'center',
						id: 'glGrid',
						ds : jlDs,
						cm : jlCm, // 列模型
						sm : jlSm,
//						title : '<center><b><font size=3>监理报告信息录入</font></b></center>',// 面板标题
						border : false, // 
						clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
						editable: false,
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						addBtn: RW,
						header: false,
						delBtn: RW,
						title:false,
						saveBtn: RW,
						viewConfig : {
							//forceFit : true,
							ignoreAdd : true
						},
						tbar : dydaView==false?(RW?['-']:['']):["->"],// 顶部工具栏，可选
						bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
							pageSize : PAGE_SIZE,
							store : jlDs,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录。"
						}),
						plant : Ext.data.Record.create(jlColumns),
						plantInt : {
							uids : '',
							pid : CURRENTAPPID,
							projectId : '',
							createdate : SYS_DATE_DATE,
							createperson : '',
							reportname : '',
							reportStat : '0',
							type : '1',
							supercompa : '',
							memo : ''
						},
						servletUrl : MAIN_SERVLET,
						bean : 'com.sgepit.pcmis.zlgk.hbm.PcZlgkSuperreportInfo',
						primaryKey : "uids",
						saveHandler: function() {
							var record = this.getSelectionModel().getSelected();
							
							if(record==null)
							{
								Ext.example.msg('', '请选中一条记录!');
								return ;
							}else if((record.get('reportname')==''||record.get('reportname')==null)){
								Ext.example.msg('', '请填写报告名称!');
								return;
							}else if(record.get('supercompa')==''||record.get('supercompa')==null){
								Ext.example.msg('', '请填写报告单位!');	
							}else {
								this.defaultSaveHandler();
							}
						},
						deleteHandler : function() {
							var record = this.getSelectionModel().getSelected();
							if(record==null)
							{
								Ext.example.msg('', '请选中一条记录!');
								return ;
							}
							var stat = record.get('reportStat');
							if (stat=='1') {
								Ext.example.msg('', '已上报的监理报告无法删除!');
								return;
							} else if(stat=='0'){
								var businessType = 'PCJianLiBaoGao';
								var whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID='"+record.get('uids')+"'";
								var fileLshs="";
								fileServiceImpl.geAttachListByWhere(whereSql,null,null,function(list){
									if(list.length>0){
										for(var j=0; j<list.length-1; j++){
											fileLshs+="'"+list[j].fileLsh+"',";
											
											//1.删除附件表的从表(sgcc_attach_blob)中对应将要删除附件的记录
											fileServiceImpl.deleteAttachBlob(list[j]);
										}
										fileLshs+="'"+list[list.length-1].fileLsh+"'";
											//2.删除附件(sgcc_attach_list)
											fileServiceImpl.deleteAttachList(fileLshs,null);
									}
								});
								
						    	this.defaultDeleteHandler();
							} else {
								Ext.example.msg('', '未知错误导致操作失效!');	
							}
						},
						listeners:{
							beforeedit:function(o){
								var rec = o.record;
								var unedit = rec.get('reportStat');
								if(unedit=='1'){
									return false
								}else{
									return true
								}
							},
							rowclick: function(){
								var record = jlGrid.getSelectionModel().getSelected();
								var able = record.get('reportStat');
								
								if(able=='1'&&RW){
									jlGrid.getTopToolbar().items.get('up').disable();
									jlGrid.getTopToolbar().items.get('del').disable();
									jlGrid.getTopToolbar().items.get('save').disable();
									
								}else if(able==0&&RW){
									jlGrid.getTopToolbar().items.get('up').enable();
									jlGrid.getTopToolbar().items.get('del').enable();
									jlGrid.getTopToolbar().items.get('save').enable();
								}else{
									return;
								}
							}
						}
					});

			 upBtn = new Ext.Button({
				id:'up',
				text: '上报',
				iconCls: 'upload',
				disabled : true,
				handler: ReportUp
			})
			
			
//布局的实现-----------------------------------------------------------------
   			var centerPanel =  new Ext.Panel({
                layout: 'fit',
                region: 'center',
                border : false,
                tbar : titleText,
                items : [jlGrid]
            })
			var viewPort = new Ext.Viewport({
						layout : 'border',
						items : [centerPanel]
					})
					
	jlDs.load({params:{start:0,limit:PAGE_SIZE}});
	
	
	if(RW)
	{
		jlGrid.getTopToolbar().add(upBtn);
		jlGrid.header = null;
		jlGrid.tbar  = null;
	}
    
    //周报，月报，全部的查询功能
    var reportTypeCombo = new Ext.form.ComboBox({
        fieldLabel : '报告类型',
        width : 60,
        displayField : 'v',
        valueField : 'k',
        mode : 'local',
        triggerAction : 'all',
        lazyRender : false,
        listClass : 'x-combo-list-small',
        value : (type||'0'),
        store : new Ext.data.SimpleStore({
            fields : ['k', 'v'],
            data : reportType
        }),
        listeners : {
            select : function(combo, record, index){
                if(combo.getValue() == '0'){
                    jlDs.baseParams.params="pid='" + pid + "'"+ append +" order by createdate desc";
                }else{
                    jlDs.baseParams.params="pid='" + pid + "'"+ append +" and type = '"+combo.getValue()+"' order by createdate desc";
                }
                jlDs.load({params:{start:0,limit:PAGE_SIZE}});
            }
        }
    });
    jlGrid.getTopToolbar().add('-');
    jlGrid.getTopToolbar().add('报告类型：');
    jlGrid.getTopToolbar().add(reportTypeCombo);
    
	
// 将选中的某条监理报告通过数据交互提交到集团二级公司或集团
	function ReportUp() {
		var record = jlGrid.getSelectionModel().getSelected();
		var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据上报中，请稍等'});		
		if(record==null||record==undefined||record==''){
			Ext.example.msg('提示', '请选择一条监理报告');
			return;
		}else {
			if(record.get('uids')==''||record.get('uids')==null)
			{
				Ext.example.msg('提示', '新增的监理报告请先保存后再上报!');
				return;
			} else {
				DWREngine.setAsync(false);
				Ext.MessageBox.confirm('确认','上报操作将不可恢复，上报后数据将不能修改，确认要上报吗？',function(btn,text){
					if(btn=='yes'){
						myMask.show();
						zlgkMgm.submitSuperReport(defaultOrgRootID, record.get('uids'), function(flag) {
							myMask.hide();
							if (flag=='success'||flag=='SUCESS') {
								Ext.example.msg('提示', '上报成功!');
								jlDs.load();
							} else {
								Ext.example.msg('提示', '上报失败!');
							}
						});
					}
			   })
			   DWREngine.setAsync(true);
		   }
      }
   }	
})
		
// Ext.onReady()结束

// 其他自定义函数(格式化)
function typeShow(value) {
	for (var i = 0; i < reportType.length; i++) {
		if (value == reportType[i][0]) {
			return reportType[i][1];
			break;
		}
	}
	return "";
}

function statShow(value) {
	for (var i = 0; i < reportStat.length; i++) {
		if (value == reportStat[i][0]) {
			return reportStat[i][1];
		}
	}
	return "";
}

function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
}

function uploadfile(val,enable) {
	var param = {
		businessId : val,
		businessType : 'PCJianLiBaoGao',
		editable : enable
	};
	showMultiFileWin(param);
}
