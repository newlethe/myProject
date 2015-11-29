var queStr = '';
function showWindow(grid){
	var formWin, formPanel,fieldSet,store,params, isSub, pPk, pSm;
	var queryFields = new Array();var selectFields = new Array();
	
	fieldSet = new Ext.form.FieldSet({
		title: '字段查询',
	  	border: true,
	  	layout: 'table',
	  	layoutConfig: {columns: 1},
	  	defaults: {bodyStyle:'padding:1px 1px'}
	});
	
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
		
	if(grid.getColumnModel()){
		var cm = grid.getColumnModel();
		for(var i = 0; i<cm.getColumnCount(); i++){
			var col = cm.getColumnById(cm.getColumnId(i));
				if (col.id != 'checker') selectFields.push(col);
				if (col.hidden || col.id == 'checker'||typeof(col.type)=='undefined') continue;
				queryFields.push(col);		
		}
	}
	if (grid.getStore()) store = grid.getStore();
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
				width: 430,
				items:[{
					layout: 'form', columnWidth: .6, bodyStyle: 'border: 0px;',
					items:[
						new Ext.form.DateField({
							id: queryFields[i].id + '_begin',
							fieldLabel: queryFields[i].header,
							format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
						})
					]
				},{
					layout: 'form', columnWidth: .4, bodyStyle: 'border: 1px;',
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
		}
		fieldSet.add(new Ext.Panel({
			layout: 'form',
			border: false,
			width: 400,
			items: [addField]
		}));
	}
	formPanel.add(fieldSet);
	if(!formWin){
		formWin = new Ext.Window({	               
			title: '查询数据',
			width: 500, minWidth: 460, height: 470,
			layout: 'fit', iconCls: 'form', closeAction: 'close',
			border: false, constrain: true, maximizable: true, modal: true,
			items : [formPanel]
		});   
	}
	
	formPanel.getForm().reset();
	formWin.show();
	function execQuery(){
		var form = formPanel.getForm(), val = true;
		queStr='';
		for (var i = 0; i < queryFields.length; i++) {
			if ('float' == queryFields[i].type){
				var pb = form.findField(queryFields[i].id+'_begin');
				var pe = form.findField(queryFields[i].id+'_end');
				if ('' == pb.getValue() && '' == pe.getValue()){
					continue;
				} else {
	//				if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
					if ('' != queStr) queStr += ' and ';
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
	//				if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
					if ('' != queStr) queStr += ' and ';
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
	//				if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
					if ('' != queStr) queStr += ' and ';
					if(queryFields[i].id=="conid"){
						var consSql = "select c.conid from CON_OVE c where c.conname like '%"+field.getValue()+"%'";
						var conidstr = "";
						DWREngine.setAsync(false);
						baseDao.getData(consSql,function(list){
							for(var j = 0; j < list.length; j++) {
								conidstr += ",'"+list[j]+"'";		
							}
						});	
						DWREngine.setAsync(true);
						conidstr = conidstr.substring(1);
						queStr += queryFields[i].id+" in("+conidstr+")";
						continue;
					}
					queStr += queryFields[i].id + ' like \'%' + field.getValue() + '%\'';
				}
			} else if ('combo' == queryFields[i].type){
				var field = form.findField(queryFields[i].id);
				if ('' == field.getValue()){
					continue;
				} else {
	//				if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
					if ('' != queStr) queStr += ' and ';
					queStr += queryFields[i].id + ' = \'' + field.getValue() + '\'';
				}
			}
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
		if ('' != queStr) queStr += ' and ';
		queStr += "pid='"+CURRENTAPPID+"'"
		if (val){
			with (store){
				baseParams.business = 'baseMgm';
				baseParams.method = 'findWhereOrderBy';
				baseParams.params = queStr;
				load({
					params : { start : 0, limit : PAGE_SIZE },//原高级查询未分页，速度极慢  pengy 2013-09-22
					callback: function(){ formWin.close(); }
				});
			
			}
		}
	}
	function formatDate(value)
			{ return value ? value.dateFormat('Y-m-d') : ''; };
}