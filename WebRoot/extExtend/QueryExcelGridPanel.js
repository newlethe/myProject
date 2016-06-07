/**
 * Ext.grid.QueryExcelGridPanel Extension Class
 * 
 * @author Xiaos
 * @version 1.0
 * 
 * @class Ext.grid.QueryExcelGridPanel
 * @extends Ext.grid.GridPanel
 * 
 */
var queStr="1=1";
var fixedFilterPart = "1=1";		//自定义的筛选参数
Ext.grid.QueryExcelGridPanel = Ext.extend(Ext.grid.GridPanel, {
	isSub: false,			//是否是从表grid; [true: 是从表; false: 是主表(default)], 可选
							//如果 isSub: true　就必须指定 pPk 和 pSm
	pPk: null,				//主表pk名称, 可选
	pSm: null,				//主表grid的selectionModel, 可选
	params: {},				//需要带上的特殊属性进行查询, 如合同号, 可选
/**
 *	This is the [params] template.
   
 *	params: {
		'conid': '123456789',
		'bdgid': '987654321'
	}
 */	
	// private
	onRender : function(ct, positon){
		Ext.grid.QueryExcelGridPanel.superclass.onRender.call(this, ct, positon);

		var queryFields = new Array(), selectFields = new Array();
		var formWin, formPanel, store, exportWin, params, isSub, pPk, pSm;
		
		if (this.getColumnModel()){
			var cm = this.getColumnModel();
			for (var i = 0; i < cm.getColumnCount(); i++) {
				var col = cm.getColumnById(cm.getColumnId(i));
				if (col.id != 'checker') selectFields.push(col);
				if (col.hidden || col.id == 'checker') continue;
				queryFields.push(col);
			}
		}
		
		if (this.getStore()) store = this.getStore();
		
		if (this.params) params = this.params;
		
		if (this.isSub) isSub = this.isSub;
		
		if (this.pPk) pPk = this.pPk;
		
		if (this.pSm) pSm = this.pSm;
		
		if (queryFields.length > 0){
			formPanel = new Ext.FormPanel({
			    header: false, border: false, autoScroll: true,
			    bodyStyle: 'padding:10px 10px;', iconCls: 'icon-detail-form', labelAlign: 'left',
				bbar: ['->',{
					id: 'query',
					text: '查询',
					tooltip: '查询',
					iconCls: 'btn',
					handler: execQuery
				}]
			});
			
			var fieldSet = new Ext.form.FieldSet({
				title: '字段查询',
		      	border: true,
		      	layout: 'table',
		      	layoutConfig: {columns: 1},
		      	defaults: {bodyStyle:'padding:1px 1px'}
			});
			
			/**
			 * 在 ColumnModel 中，添加 type、[store]属性 - (store属性只有在 type:'combo' 时才有)
			 * ColumnModel.type = {'string', 'float', 'combo', 'date'}
			 */
			for (var i = 0; i < queryFields.length; i++) {
				var addField;
				if ('string' == queryFields[i].type){
					addField = new Ext.form.TextField({
						id: queryFields[i].id,
						fieldLabel: queryFields[i].header,
						width: 183
					});
				} else if ('combo' == queryFields[i].type){
					addField = new Ext.form.ComboBox({
						id: queryFields[i].id,
						fieldLabel: queryFields[i].header,
						store: queryFields[i].store,
						valueField:'k', displayField: 'v', mode: 'local', triggerAction: 'all',
			            typeAhead: true, lazyRender: true, listClass: 'x-combo-list-small',
						width: 183
					});
				} else if ('comboTree' == queryFields[i].type){
					/**格式如下:
					 * id : 'bidtype', 
		                type : 'comboTree', // 加入此行，查询中会出现“招标批次”
		                header : fc['bidtype'].fieldLabel,
		                dataIndex : fc['bidtype'].name,
		                // disabled : true,
		                align : 'left',
		                width : 160,
		//                hidden : true,
		                comboTree:bidtypeCombo,//业务页面构造的下拉框树
		                renderer : bidtypeRender,
		                store : dsbidtype
					 */
					//2013-06-25 qiupy BUG4065 构造下拉框树的查询
					fieldSet.add(new Ext.Panel({
						layout: 'form',
						border: false,
						width: 400,
						items: [queryFields[i].comboTree]
					}));
					continue;
				} else if ('float' == queryFields[i].type){
					fieldSet.add(new Ext.Panel({
						layout: 'column',
						border: false,
						width: 400,
						items:[{
							layout: 'form', columnWidth: .5, bodyStyle: 'border: 0px;',
	   						items:[
								new Ext.form.NumberField({
									id: queryFields[i].id + '_begin',
									fieldLabel: queryFields[i].header,
									allowNegative: false,
									width: 92
								})
							]
						},{
							layout: 'form', columnWidth: .5, bodyStyle: 'border: 1px;',
	   						items:[
								new Ext.form.NumberField({
									id: queryFields[i].id + '_end',
									hideLabel: true,
									allowNegative: false,
									width: 92
								})
							]
						}]
					}));
					continue;
				} else if ('date' == queryFields[i].type){
					fieldSet.add(new Ext.Panel({
						layout: 'column',
						border: false,
						width: 500,
						items:[{
							layout: 'form', columnWidth: .5, bodyStyle: 'border: 0px;',
	   						items:[
		   						new Ext.form.DateField({
									id: queryFields[i].id + '_begin',
									fieldLabel: queryFields[i].header,
									format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
								})
							]
						},{
							layout: 'form', columnWidth: .5, bodyStyle: 'border: 1px;',
	   						items:[
		   						new Ext.form.DateField({
									id: queryFields[i].id + '_end',
									hideLabel: true,
									format: 'Y-m-d', minValue: '2000-01-01', emptyText: '结束时间'
								})
							]
						}]
					}));
					continue;
				}else{
					addField=null;
				}
				if (addField) {
					fieldSet.add(new Ext.Panel({
						layout: 'form',
						border: false,
						width: 400,
						items: [addField]
					}));
				}
			}
			formPanel.add(fieldSet);
			
		}
		
		var selList = new Array();
		for (var i = 0; i < selectFields.length; i++){
			var temp = new Array();
			temp.push(selectFields[i].id);
			temp.push(selectFields[i].header);
			temp.push(selectFields[i].type);
			selList.push(temp);
		}
		
		var smExport = new Ext.grid.CheckboxSelectionModel();

		var cmExport = new Ext.grid.ColumnModel([
			smExport,
			{header:'编码', dataIndex:'id', hidden: true},
			{header:'字段名称', dataIndex:'header'},
			{header:'类型', dataIndex:'type'}
		]);
		
		var dsExport = new Ext.data.Store({
	        proxy: new Ext.data.MemoryProxy(selList),
	        reader: new Ext.data.ArrayReader({}, [
	            {name: 'id'},
	            {name: 'header'},
	            {name: 'type'}
	        ])
	    });
		
		var gridExport = new Ext.grid.GridPanel({
	        ds: dsExport,
	        cm: cmExport,
	        sm: smExport,
	        iconCls: 'icon-show-all',
	        border: false,
	        viewConfig: {
		        forceFit: true,
		        ignoreAdd: true
		    },
		    bbar: ['->', {
		    	text: 'Excel导出',
		    	tooltip: '以Excel形式导出所选列的数据',
		    	iconCls: 'excel',
		    	handler: ExportXls,
		    	scope: this
		    }]
	    });
		
		
		if (this.getTopToolbar()){
			this.getTopToolbar().add({
				id: 'showQuery',
	            text: '高级查询',
	            tooltip: '高级查询',
	            cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/gjcx.png',
	            handler: showWindow,
	            scope: this
			},{
				id: 'exportXls',
				text: '导出',
				tooltip: '导出数据',
				iconCls: 'excel',
				handler: exportWindow,
				hidden: true,
				scope: this
			});
		}
		
		function showWindow(){
	 		if(!formWin){
				formWin = new Ext.Window({	               
					title: '查询数据',
					width: 600, minWidth: 460, height: 400,
					layout: 'fit', iconCls: 'form', closeAction: 'hide',
					border: false, constrain: true, maximizable: true, modal: true,
					items: [formPanel]
				});   
	     	}
	     	formPanel.getForm().reset();
	     	formWin.show();
	   	}
	   	
	   	function exportWindow(){
	   		if(!exportWin){
				exportWin = new Ext.Window({	               
					title: '数据导出',
					width: 260, minWidth: 260, height: 400,
					layout: 'fit', iconCls: 'form', closeAction: 'hide',
					border: false, constrain: true, maximizable: true, modal: true,
					items: [gridExport]
				});   
	     	}
	     	dsExport.load();
	     	exportWin.show();
	   	}
	   	
	   	/**
	   	 * 查询主方法 - Query_Main_Function
	   	 */
	   	function execQuery(){
	   		//zhangh 2010-10-18 每次调用查询方法前还原查询条件queStr
			queStr='1=1';
	   		var form = formPanel.getForm(), val = true;
	   		for (var i = 0; i < queryFields.length; i++) {
	   			if ('float' == queryFields[i].type){
	   				var pb = form.findField(queryFields[i].id+'_begin');
	   				var pe = form.findField(queryFields[i].id+'_end');
	   				if ('' == pb.getValue() && '' == pe.getValue()){
	   					continue;
	   				} else {
	   					if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
	   					if ('' == pb.getValue() && '' != pe.getValue()){
		   					queStr += queryFields[i].id + ' <= ' + pe.getValue();
		   				} else if ('' != pb.getValue() && "" == pe.getValue()){
		   					queStr += queryFields[i].id + ' >= ' + pb.getValue();
		   				} else if ('' != pb.getValue() && '' != pe.getValue()){
		   					if (pb.getValue() > pe.getValue()){
		   						Ext.example.msg('提示！', queryFields[i].header+'：开始应该小于等于结束！');
		   						val = false; break;
		   					} else {
		   						queStr += queryFields[i].id + ' between ' + pb.getValue() + ' and ' + pe.getValue(); 
		   					}
		   				}
	   				}
	   			} else if ('date' == queryFields[i].type){
	   				var pb = form.findField(queryFields[i].id+'_begin');
	   				var pe = form.findField(queryFields[i].id+'_end');
	   				if ('' == pb.getValue() && '' == pe.getValue()){
	   					continue;
	   				} else {
	   					//if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
	   					queStr += ' and ';
	   					if ('' == pb.getValue() && '' != pe.getValue()){
		   					queStr += queryFields[i].id + ' <= to_date(\'' + formatDate(pe.getValue()) + '\',\'YYYY-MM-DD\')';
		   				} else if ('' != pb.getValue() && "" == pe.getValue()){
		   					queStr += queryFields[i].id + ' >= to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')';
		   				} else if ('' != pb.getValue() && '' != pe.getValue()){
		   					if (pb.getValue() > pe.getValue()){
		   						Ext.example.msg('提示！', queryFields[i].header+'：开始时间应该小于等于结束时间！');
		   						val = false; break;
		   					} else {
		   						queStr += queryFields[i].id 
		   								+ ' between to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')' 
		   								+ ' and to_date(\'' + formatDate(pe.getValue())+ '\',\'YYYY-MM-DD\')'; 
		   					}
		   				}
	   				}
	   			} else if ('string' == queryFields[i].type){
	   				var field = form.findField(queryFields[i].id);
	   				if ('' == field.getValue()){
	   					continue;
	   				} else {
	   					if ('' != queStr) queStr += ' and ';
	   					//将用户输入内容转为大写，并将数据库数据大写化，再模糊查询
	   					//pengy 2013-05-30
   						queStr += "UPPER("+queryFields[i].id + ') like \'%' + field.getValue().toUpperCase() + '%\'';
	   				}
	   			} else if ('combo' == queryFields[i].type){
	   				var field = form.findField(queryFields[i].id);
	   				if ('' == field.getValue()){
	   					continue;
	   				} else {
	   					//if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
	   					//zhangh 2010-10-18 
	   					if ('' != queStr) queStr += ' and ';
	   					queStr += queryFields[i].id + ' = \'' + field.getValue() + '\'';
	   				}
	   			} else if ('comboTree' == queryFields[i].type){//2013-06-25 qiupy BUG4065构造下拉框树的查询
	   				var field = form.findField(queryFields[i].id);
	   				if ('' == field.getValue()){
	   					continue;
	   				} else {
	   					//if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
	   					if ('' != queStr) queStr += ' and ';
	   					queStr += queryFields[i].id + ' = \'' + field.getValue() + '\'';
	   				}
	   			}
	   			//var field = form.findField(queryFields[i].id);
	   			//if (field)
	   			//alert(field.constructor == Ext.form.TextField)
	   		}
	   		//附加的特殊查询参数
   			for (var a in params) {
   				if ('' != queStr) queStr += ' and ';
   				queStr += a + ' like \'%' + params[a] + '%\'';
   			}
   			
   			//如果是子表Grid, 查到主表被选中的那条记录, 并取出主键加入到查询条件
   			if (isSub){
   				if ('' != queStr) queStr += ' and ';
   				var pPkValue = pSm.getSelected().get(pPk);
   				queStr += pPk + ' = \'' + pPkValue + '\'';
   			}
//	   		alert(queStr);
	   		if (val){
	   			with (store){
	   				baseParams.business = 'baseMgm';
	   				baseParams.method = 'findWhereOrderBy';
	   				baseParams.params = fixedFilterPart  + " and " + queStr; 	
	   				//alert(baseParams.params)		
	   				load({
	   					params:{start: 0, limit: PAGE_SIZE },		//zhangh 2010-10-27 原始查询后未分页
	   					callback: function(){ formWin.hide(); }
	   				});
	   				if(typeof parent.dsparams != 'undefined' && parent.dsparams){
	   					parent.dsparams = queStr;
	   				}
	   				if(typeof paramsStr != 'undefined' && paramsStr){
	   					paramsStr = queStr;
	   				}
	   			}
	   		}
	   	}
	   	
	   	/**
	   	 * 导出主方法 - ExportXLS_Main_Function
	   	 */
	   	function ExportXls(){
	   		if (smExport.getCount() > 0){
		   		Ext.Msg.show({
					title: '提示', msg: '是否要导出所选数据?',
					buttons: Ext.Msg.YESNO, icon: Ext.MessageBox.QUESTION,
					fn: processHandler
				});
	   		} else {
	   			Ext.example.msg('操作错误！', '请您选择导出数据列之后再进行导出！');
	   		}
	   	}
	   	
	   	function processHandler(value){

   		   	with (store){
   				baseParams.business = 'baseMgm';
   				baseParams.method = 'findWhereOrderBy';
   				baseParams.params = queStr;
   				load();
   			}
	   	
	   		if ("yes" == value){
	   			var titleList = new Array();
	   			for (var i = 0; i < smExport.getCount(); i++) {
	   				var sr = smExport.getSelections()[i];
	   				titleList.push(sr.get('header'));
	   			}
				var exportList = new Array();
				
				for (var i = 0; i < store.getCount(); i++){
					var r = store.getAt(i);
					var oList = new Array();
					for (var j = 0; j < smExport.getCount(); j++){
						var sr = smExport.getSelections()[j];
						var temp = new Array();
						if ('date' == sr.get('type')) {
							var value = formatDate(r.get(sr.get('id')));
							temp.push(value.replace(/,/, ""));
						} else if ('combo' == sr.get('type')) {
							var value = comboValue(findDs(sr.get('id')), r.get(sr.get('id')));
							temp.push(value.replace(/,/, ""));
						} else if ('float' == sr.get('type')) {
							temp.push(r.get(sr.get('id')));
						} else {
							temp.push(r.get(sr.get('id')).replace(/,/, ""));
						}
						oList.push(temp);
					}
					exportList.push(oList);
				}
				
				Ext.Ajax.request({
					url: CONTEXT_PATH+'/servlet/MainServlet',
					params: {title: titleList, data: exportList, ac: 'opExcel'},
					success: function(response, params){
					//alert(response.responseText)
						window.open(response.responseText);
					}
				});
			}
	   	}
	   	
	   	function comboValue(cDs, cKey){
	   		for (var i = 0; i < cDs.getCount(); i++) {
	   			if (cDs.getAt(i).get('k') == cKey) return cDs.getAt(i).get('v');
	   		}return "";
	   	}
	   	
	   	function findDs(id){
	   		for (var i = 0; i < selectFields.length; i++) {
	   			if (selectFields[i].id == id) return selectFields[i].store;
	   		}
	   	}
	   	
	   	function formatDate(value){ return value ? value.dateFormat('Y-m-d') : ''; };
	   	
	}
})