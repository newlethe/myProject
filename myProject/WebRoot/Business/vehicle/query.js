var queStr = '';
var formWin, formPanel,fieldSet,store,params, isSub, pPk, pSm;
var queryFields = new Array(),selectFields = new Array();

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
	

function showWindow(){
	if(gridPanel.getColumnModel()){
		var cm = gridPanel.getColumnModel();
		for(var i = 0; i<cm.getColumnCount(); i++){
			var col = cm.getColumnById(cm.getColumnId(i));
				if (col.id != 'checker') selectFields.push(col);
				if (col.hidden || col.id == 'checker'||typeof(col.type)=='undefined') continue;
				queryFields.push(col);		
		}
	}
	
	if (gridPanel.getStore()) store = gridPanel.getStore();
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
				width: 450,
				items:[{
					layout: 'form', columnWidth: .6, bodyStyle: 'border: 0px;',
					items:[
   						new Ext.form.DateField({
							id: queryFields[i].id + '_begin',
							fieldLabel: queryFields[i].header,
							format: 'Y-m-d H:i', minValue: '2000-01-01 00:00', emptyText: '开始时间',menu : new DatetimeMenu()
						})
					]
				},{
					layout: 'form', columnWidth: .4, bodyStyle: 'border: 1px;',
					items:[
   						new Ext.form.DateField({
							id: queryFields[i].id + '_end',
							hideLabel: true,
							format: 'Y-m-d H:i', minValue: '2000-01-01 00:00', emptyText: '结束时间',menu : new DatetimeMenu()
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
			width: 570, minWidth: 460, height: 470,
			layout: 'fit', iconCls: 'form', closeAction: 'hide',
			border: false, constrain: true, maximizable: true, modal: true,
			items: [formPanel]
		});   
 	}
 	
 	formPanel.getForm().reset();
 	formWin.show();
}



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
				if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
				if ('' == pb.getValue() && '' != pe.getValue()){
					queStr += queryFields[i].id + ' <= to_date(\'' + formatDate(pe.getValue()) + '\',\'YYYY-MM-DD hh24:mi\')';
				} else if ('' != pb.getValue() && "" == pe.getValue()){
					queStr += queryFields[i].id + ' >= to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD hh24:mi\')';
				} else if ('' != pb.getValue() && '' != pe.getValue()){
					if (pb.getValue() > pe.getValue()){
						Ext.example.msg('提示！', queryFields[i].header+'：开始时间应该小于等于结束时间！');
						val = false; break;
					} else {
						queStr += queryFields[i].id 
								+ ' between to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD hh24:mi\')' 
								+ ' and to_date(\'' + formatDate(pe.getValue())+ '\',\'YYYY-MM-DD hh24:mi\')'; 
					}
				}
			}
		} else if ('string' == queryFields[i].type){
			var field = form.findField(queryFields[i].id);
			if ('' == field.getValue()){
				continue;
			} else {
				if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
				queStr += queryFields[i].id + ' like \'%' + field.getValue() + '%\'';
			}
		} else if ('combo' == queryFields[i].type){
			var field = form.findField(queryFields[i].id);
			if ('' == field.getValue()){
				continue;
			} else {
				//if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
				if ('' != queStr ) queStr += ' and ';
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
	if (val){
		with (store){
			baseParams.business = 'baseMgm';
			baseParams.method = 'findWhereOrderBy';
			if(queStr!=""){
				queStr+="and pid='"+CURRENTAPPID+"'"
			}else{
				queStr+="pid='"+CURRENTAPPID+"'"
			}
			baseParams.params = queStr;
			load({
				callback: function(){ formWin.hide(); }
			});
		
		}
}
}
function formatDate(value)
		{ return value ? value.dateFormat('Y-m-d H:i') : ''; };