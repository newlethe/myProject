/*
 * Ext JS Library 2.0 RC 1 Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 * 
 */

/**
 * @class grid.EditorGridTbarPanel
 * @extends Ext.grid.EditorGridPanel 实现带有增、删、改、查等默认行为工具栏的可编辑EditorGridPanel.
 * @constructor
 * @param {Object}
 *            config The config object
 */

Ext.grid.EditorGridTbarPanel = Ext.extend(Ext.grid.EditorGridPanel, {
	trackMouseOver : true, //鼠标移动到行上，行高亮
	stripeRows : true, // 斑马线效果 
	border: false,
	plant : null, // 初始化记录集，必须
	plantInt : null, // 初始化记录集配置，必须
	servletUrl : '', // 服务器地址，必须
	bean : '', // bean类的名称，含包名，必须
	business : 'baseMgm', // business在context中的注册名称
	addBtn : true, // 是否显示新增按钮
	saveBtn : true, // 是否显示保存按钮
	delBtn : true, // 是否显示删除按钮
	refreshBtn : false, // 是否显示刷新按钮
	formBtn : false, // 是否包含表单
	separators : {},
	primaryKey : '', // 主键列名称，必须
	insertHandler : null, // 自定义新增方法，可选
	saveHandler : null, // 自定义保存方法，可选
	deleteHandler : null, // 自定义删除方法，可选
	formHandler : null, // 自定义表单方法，可选
	crudText : {}, // 自定义按钮文字，可选，可部分设置add/save/del中的一个
	notifyChanges : true, // 数据加载之前是否提示未保存
	saveMethod : 'save', // business接口中的默认更新方法名
	deleteMethod : 'delete', // business接口中的默认删除方法名
	insertMethod : 'insert', // business接口中的默认新增方法名

	// private
	initComponent : function() {
		Ext.grid.EditorGridTbarPanel.superclass.initComponent.call(this);
		this.addEvents('pageload', 'beforeinsert', 'afterinsert', 'aftersave',
				'afterdelete');
	},

	showHideTopToolbarItems : function(id, flag) {
		var btn = this.getTopToolbar().items.get(id)
		if (btn) {
			if (flag) {
				btn.show();
				if (this.separators[id]) {
					this.separators[id].show();
				}
			} else {
				btn.hide();
				if (this.separators[id]) {
					this.separators[id].hide();
				}
			}
		}
	},

	defaultInsertHandler : function() {
		if (this.fireEvent("beforeinsert", this) !== false) {
			var oNew = new Object();
			Ext.applyIf(oNew, this.plantInt);
			var p = new this.plant(oNew);
			p.isNew = true;
			this.stopEditing();
			this.getStore().insert(0, p);
			this.startEditing(0, 0);
			var td = this.getView().getCell(0, 0)
			//td.style.border = '1px solid red';
			var sm = this.getSelectionModel();
			sm.selectFirstRow();
			this.fireEvent("afterinsert", this)
		}
	},

	defaultSaveHandler : function() {
		var ds = this.getStore()
		var records = ds.getModifiedRecords();
		if (records.length == 0)
			return;

		var daInsert = [];
		var daUpdate = [];
		for (var i = 0; i < ds.getCount(); i++) {
			var record = ds.getAt(i);
			if(!record.dirty) continue;
			var recData = Ext.apply({}, record.data);
			// do not send calculated fields (sql expressions)
			for (var name in recData) {
				var field = record.store.recordType.getField(name);
			//	alert(name+"=="+field)
				if (typeof(field)!='undefined'&&!this.validateField(field, i, record)){
					Ext.MessageBox.show({
						title : '保存失败！',
						msg : field.invalidText,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
					return;
				}
				if (field && (field.isExpr || field.rs)) {
					delete(recData[name]);
				}
			}
			var jsonData = Ext.encode(recData);
			if (record.isNew) {
				daInsert.push(jsonData);
			} else {
				daUpdate.push(jsonData);
			}
		}
		var da = daInsert.concat(daUpdate)
		var mrc = da.length
		if (mrc > 0) {
			var dataArr = '[' + da.join(',') + ']';
			this.doSave(dataArr, mrc, daInsert.length, function(flag, n) {
				for (var i = 0; i < n; i++) {
					records[i].isNew = false;
				}
			});
		}

	},
	
	validateField: function(field, i,record){
		this.cm = this.getColumnModel();
		var colIndex = this.cm.getIndexById(field.name)
		if(colIndex<0) return true;
		var colHeader = this.cm.getColumnHeader(colIndex)
		if (this.cm.isCellEditable(colIndex, i)){
			var editor = this.cm.getCellEditor(colIndex, i)
			var fieldName = this.colModel.getDataIndex(colIndex);
			var editField = editor.field;
			var value  = record.data[fieldName]
			editField.setValue(value);
			if(!editField.isValid(true)){
				if((value.length < 1 || value === editField.emptyText)&&editField.allowBlank==false){ // if it's blank
	             	field.invalidText = "列：“"+colHeader+"”为必填字段！"
	                return false;
		        }else  if(value.length < editField.minLength){
		            field.invalidText = (String.format(editField.minLengthText, editField.minLength));
		            return false;
		        }else  if(value.length > editField.maxLength){
		            field.invalidText = (String.format(editField.maxLengthText, editField.maxLength));
		            return false;
		        }else  if(editField.vtype){
		            var vt = Ext.form.VTypes;
		            if(!vt[editField.vtype](value, editField)){
		                field.invalidText = (editField.vtypeText || vt[editField.vtype +'Text']);
		                return false;
		            }
		        }else  if(typeof this.validator == "function"){
		            var msg = editField.validator(value);
		            if(msg !== true){
		                field.invalidText = (msg);
		                return false;
		            }
		        }else  if(editField.regex && !editField.regex.test(value)){
		            field.invalidText = (editField.regexText);
		            return false;
		        }else{
					field.invalidText = "列：“"+colHeader+"”不合验证规则！"
					return false
		        }
			}
		}
		return true
	},

	doSave : function(dataArr, mrc, insertDiffer, handler) {
		var ds = this.getStore()
		var ac = insertDiffer > 0 ? "saveorinsert" : "save"
		var method = insertDiffer > 0 ? this.insertMethod + "|"
				+ this.saveMethod : this.saveMethod
		var grid = this;
		Ext.Ajax.request({
			waitMsg : 'Saving changes...',
			url : this.servletUrl,
			params : {
				ac : ac,
				bean : this.bean,
				business : this.business,
				method : method,
				insertDiffer : insertDiffer,
				primaryKey : this.primaryKey
			},
			method : "POST",
			xmlData : dataArr,
			success : function(response, params) {
				// ds.on("load", this.saveSuccessMsg, ds) //TODO 暂无法实现显式函数
				var rspXml = response.responseXML
				var sa = rspXml.documentElement.getElementsByTagName("done")
						.item(0).firstChild.nodeValue;
				var msg = rspXml.documentElement.getElementsByTagName("msg")
						.item(0).firstChild.nodeValue;
				var idsOfInsert = rspXml.documentElement.getElementsByTagName("insert")
						.item(0).firstChild.nodeValue;
				var idsOfUpdate = rspXml.documentElement.getElementsByTagName("update")
						.item(0).firstChild.nodeValue;
				if (msg == "ok") {
					Ext.example.msg('保存成功！', '您成功保存了 {0} 条记录。', mrc);
					if (insertDiffer > 0)
						ds.reload()
					else
						ds.commitChanges();
					ds.rejectChanges(); // TODO 方法作用待进一步理解
					if (typeof(handler) == "function") {
						handler(true, sa)
					}
					grid.fireEvent("aftersave", grid, idsOfInsert, idsOfUpdate, grid.primaryKey,  grid.bean);
				} else {
					var stackTrace = rspXml.documentElement
							.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
					var str = '第 ' + (sa * 1 + 1) + ' 条记录保存出错！<br>失败原因：' + msg;
					str += (sa * 1 > 0) ? '<br>本次操作保存成功 ' + sa + ' 条记录。' : "";

					Ext.MessageBox.show({
						title : '保存失败！',
						msg : str,
						width : 500,
						value : stackTrace,
						buttons : Ext.MessageBox.OK,
						multiline : true,
						icon : Ext.MessageBox.ERROR
					});
					if (typeof(handler) == "function") {
						handler(false, sa)
					}
				}
			},
			failure : function(response, params) {
				alert('Error: Save failed!');
				if (typeof(handler) == "function") {
					handler(false, 0)
				}
			}
		});

	},

	defaultDeleteHandler : function() {
		var sm = this.getSelectionModel();
		var ds = this.getStore();
		if (sm.getCount() > 0) {
			Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
					text) {
				if (btn == "yes") {
					var records = sm.getSelections()
					var codes = []
					for (var i = 0; i < records.length; i++) {
						var m = records[i].get(this.primaryKey)
						if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
							continue;
						}
						codes[codes.length] = m
					}
					var mrc = codes.length
					if (mrc > 0) {
						var ids = codes.join(",");
						this.doDelete(mrc, ids)
					} else {
						ds.reload();
					}
				}
			}, this);
		}
	},

	doDelete : function(mrc, ids) {
		var ds = this.getStore()
		var grid = this;
		Ext.Ajax.request({
			url : this.servletUrl,
			params : {
				ac : 'delete',
				ids : ids,
				bean : this.bean,
				method : this.deleteMethod,
				business : this.business
			},
			method : "GET",
			success : function(response, params) {
				// ds.on("load", this.saveSuccessMsg, ds) //TODO 暂无法实现显式函数
				var rspXml = response.responseXML
				var msg = rspXml.documentElement.getElementsByTagName("msg")
						.item(0).firstChild.nodeValue
				if (msg == "ok") {
					Ext.example.msg('删除成功！', '您成功删除了 {0} 条记录。', mrc);
					ds.reload();
					ds.rejectChanges(); // TODO 方法作用待进一步理解
					grid.fireEvent("afterdelete",  grid,ids,  grid.primaryKey,  grid.bean);
				} else {
					var sa = rspXml.documentElement
							.getElementsByTagName("done").item(0).firstChild.nodeValue;
					var stackTrace = rspXml.documentElement
							.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
					var str = '第 ' + (sa * 1 + 1) + ' 条记录删除出错！<br>失败原因：' + msg;
					str += (sa * 1 > 0) ? '<br>本次操作保存删除 ' + sa + ' 条记录。' : "";
					Ext.MessageBox.show({
						title : '删除失败！',
						msg : str,
						width : 500,
						value : stackTrace,
						buttons : Ext.MessageBox.OK,
						multiline : true,
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			failure : function(response, params) {
				alert('Error: Delete failed!');
			}
		});
	},

	refresh : function() {
		var records = this.getStore().getModifiedRecords();
		if (records.length > 0){
			Ext.MessageBox.show({
		 		title:'保存改动吗?', 
		 		msg: '在数据加载之前，您的修改是否保存？', 
		 		buttons: Ext.MessageBox.YESNOCANCEL, 
		 		icon: Ext.MessageBox.QUESTION, 
		 		fn: function(rtn){
		 				if (rtn == "yes"){
		 					//this.defaultSaveHandler(); 
	
		 				}else if (rtn == "no"){
		 					this.getStore().rejectChanges(); 

		 				}
		 			}
		 	})
		}
	},

	// private
	onRender : function(ct, position) {
		Ext.grid.EditorGridTbarPanel.superclass.onRender.call(this, ct,
				position);

		if (this.insertHandler == null
				|| typeof(this.insertHandler) != 'function') {
			this.insertHandler = this.defaultInsertHandler;
		}
		if (this.saveHandler == null || typeof(this.saveHandler) != 'function') {
			this.saveHandler = this.defaultSaveHandler;
		}
		if (this.deleteHandler == null
				|| typeof(this.deleteHandler) != 'function') {
			this.deleteHandler = this.defaultDeleteHandler;
		}
		var topToolbar = this.getTopToolbar()
		if (topToolbar) {
			if (ModuleLVL < 3) {
				topToolbar.add({
					id : 'add',
					text : typeof(this.crudText.add) != 'undefined'
							? this.crudText.add
							: '新增',
					tooltip : this.crudText.add ? this.crudText.add : '新增',
					iconCls : 'add',
					handler : this.insertHandler,
					scope : this,
					hidden : !this.addBtn
				});
				this.separators.add = topToolbar.addSeparator();
				if (!this.addBtn) {
					this.separators.add.hide()
				}

				topToolbar.add({
					id : 'save',
					text : typeof(this.crudText.save) != 'undefined'
							? this.crudText.save
							: '保存',
					tooltip : this.crudText.save ? this.crudText.save : '保存',
					iconCls : 'save',
					handler : this.saveHandler,
					scope : this,
					hidden : !this.saveBtn
				});
				this.separators.save = topToolbar.addSeparator();
				if (!this.saveBtn) {
					this.separators.save.hide()
				}

				topToolbar.add({
					id : 'del',
					text : typeof(this.crudText.del) != 'undefined'
							? this.crudText.del
							: '删除',
					tooltip : this.crudText.del ? this.crudText.del : '删除',
					iconCls : 'remove',
					handler : this.deleteHandler,
					scope : this,
					hidden : !this.delBtn
				});
				this.separators.del = topToolbar.addSeparator();
				if (!this.delBtn) {
					this.separators.del.hide()
				}
			}
			
			topToolbar.add({
				id : 'refresh',
				text : typeof(this.crudText.refresh) != 'undefined'
						? this.crudText.refresh
						: '刷新',
				tooltip : this.crudText.refresh
						? this.crudText.refresh
						: '刷新',
				iconCls : 'refresh',
				handler : this.refresh,
				scope : this,
				hidden : !this.refreshBtn
			});
			
			
			if (this.formBtn && this.refreshBtn) {
				this.separators.refresh = topToolbar.addSeparator();
			}
			topToolbar.add({
				id : 'form',
				text : typeof(this.crudText.form) != 'undefined'
						? this.crudText.form
						: '详细',
				tooltip : this.crudText.form ? this.crudText.form : '详细',
				iconCls : 'form',
				disabled : true,
				handler : this.formHandler,
				scope : this,
				hidden : !this.formBtn
			})
		
		}

		// TODO 有错，未能实现
		/*
		 * this.getStore().grid = this if (this.notifyChanges){
		 * this.getStore().on("beforeload", function(){ if
		 * (this.getModifiedRecords().length>0) {
		 * Ext.example.msg('未保存！','您的改动未保存。'); return false } else { return true } },
		 * this.getStore()) } this.on("sortchange", function(){ var store =
		 * this.getStore() store.rejectChanges(); return; if (this.notifyChanges &&
		 * store.getModifiedRecords().length>0) { Ext.MessageBox.show({
		 * title:'保存改动吗?', msg: '在数据加载之前，您的修改是否保存？', buttons:
		 * Ext.MessageBox.YESNOCANCEL, icon: Ext.MessageBox.QUESTION, fn:
		 * function(rtn){ if (rtn == "yes"){ this.saveHandler(); return true
		 * }else if (rtn == "no"){ store.rejectChanges(); return true }else{
		 * return false } } }); } else { store.rejectChanges(); return true } },
		 * this);
		 */

		// TODO 事件未触发
		this.fireEvent('pageload', this);
	}
})