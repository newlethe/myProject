var queStr="1=1";
var fixedFilterPart = "1=1";		//自定义的筛选参数
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
	

function showWindow(grid){
	if(grid.getColumnModel()){
		var cm = grid.getColumnModel();
		for(var i = 0; i<cm.getColumnCount(); i++){
			var col = cm.getColumnById(cm.getColumnId(i));
				if (col.id != 'checker') selectFields.push(col);
				//alert(col.id+"="+col.id+"="+typeof(col.type)+"="+col.hidden)
				/**
				 * yanglh
				 * (col.hidden && typeof(col.type)=='undefined')
				 * 判断type存在并且隐藏的项
				 */
				if ((col.hidden && typeof(col.type)=='undefined') || col.id == 'checker'||typeof(col.type)=='undefined') continue;
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
				tab_col : typeof queryFields[i].tab_col,//增加该类型，作用在下面的string获取值中有详细介绍 yanglh 2013-11-13
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
		}else if ('comboTree' == queryFields[i].type){
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
	queStr=' 1=1 ';
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
				/**
				 * 改造查询中的string类型，增加tab_col配置，由于在一些场合下数据库中存放的是32位的主键或者数字字符串，页面显示的是中文，
				 * 在通用的查询时输入的是字符串，这样类型不匹配，导致查询不到数据，
				 * 该配置包含三个参数，配置类型为A|B|C，其中:
				 * A为table(数据来源的表名)，并且书写规范为bean中规范，如con_ove,配置时为ConOve;
				 * B为查询数据字段与数据来源的字段名想匹配的字段名,并且书写规范为bean中的规范，如tree_uids,配置时为treeUids;
				 * C为查询输入框中输入的内容与来源数据表明相对应的条件查询字段名,配置规范同B参数;
				 * yanglh 2013-11-13
				 */
				if(undefined != queryFields[i].tab_col){
				        queStr += ' and ';
				        var strS = queryFields[i].tab_col.split("|");
				        queStr += queryFields[i].id +" in (select "+strS[1]+" from "+strS[0]+" where "+strS[2]+" like '%"+field.getValue()+"%')";
				}else{
					//if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
					if ('' != queStr) queStr += ' and ';
					queStr += queryFields[i].id + ' like \'%' + field.getValue() + '%\'';
				}
			}
		} else if ('combo' == queryFields[i].type){
			var field = form.findField(queryFields[i].id);
			if ('' == field.getValue()){
				continue;
			} else {
				//if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
				//shuz 2014-08-18
				if ('' != queStr) queStr += ' and ';
				queStr += queryFields[i].id + ' = \'' + field.getValue() + '\'';
			}
		}else if ('comboTree' == queryFields[i].type){//2013-06-25 qiupy BUG4065构造下拉框树的查询
	   				var field = form.findField(queryFields[i].id);
	   				if ( undefined == field.getValue() ||  '' == field.getValue()){
	   					continue;
	   				} else {
	   					//if ('' != queStr && queryFields.length - 1 != i) queStr += ' and ';
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
	if (val){
		with (store){
			baseParams.business = 'baseMgm';
			baseParams.method = 'findWhereOrderBy';
			baseParams.params = fixedFilterPart +" and "+queStr
			load({
				params : { start : 0, limit : PAGE_SIZE },
				callback: function(){ formWin.hide(); }
			});
		
		}
}
}

function formatDate(value){
	return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
}