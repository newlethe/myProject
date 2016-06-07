/**
扩展的Panel,集成GridPanel、FormPanel,主要用于展现和编辑实体表数据,主意特征及功能有：
->可在配置中指定是否可编辑，相应的Grid面板的实现为EditorGridPanel,实现增删改;
->可在配置中指定是否支持表单形式的编辑，相应的实现为FormPanel;
->默认的查询为指定的列过滤功能或组合查询表单;
->简单定义，默认规约，快速开发;
->可扩展;
->依赖性：系统框架golobalJs.jsp;
*/

Ext.ux.GridComboPanel = Ext.extend(Ext.Panel, {
	//title: 'title',
	region: 'center',
	layout: 'border',
	border: false,
	
    closable: false,
    autoScroll: true,
    servletUrl: MAIN_SERVLET,
    
    gridPanel : {},
    gridRegion: 'center',
    formPanel : {},
    formRegion: 'east',
    propertiesRecord:[],
    
    bean: "",
    columns: [],
    fields: [],
    where: "",
    identifier: "",
    orderBy: "",
    editRow: false,
    form: false,
    formSections:[],
    formFields:[],
    
    gridHeight: 200,
    pageSize: 10,
    dateFormat: "Y-m-d H:i:s",
    properties:{},
    initRecord:{},
    initValue:{},
    initialised: false,
    columnProperties:[],
    editColumnProperties:[],
    formFieldSet: [],
     
    _cm:{},
    _sm:{},
    _ds:{},
    
    UDF:"undefined",
    cont:{},
    actionTitles:{
    	formInsert:"表单新增记录保存",
    	formUpdate:"表单当前记录更新",
    	formUpdate:"表单当前记录删除"
    },
   
    //ColumnModel, SelectionModel, Reader, Store
    initComponent : function(){

        Ext.ux.GridComboPanel.superclass.initComponent.call(this);

    	//获取实体及属性（字段）信息
    	Ext.Ajax.request({
    	
			url : this.servletUrl,
			params : {
				ac: "getPropertyInfo",
				bean: this.bean
			},
			method : "POST",
			success : function(response, action) {
				var rtn = Ext.decode(response.responseText);
				this.identifier = rtn.identifier;
				this.properties = rtn.properties;
				this.initialise()
			},
			scope: this,
			failure : function(response, params) {
				//TODO
			}
		});
		
        
    },
    
    initialise : function(){
    	//配置列模型，Reader
    	var c = new Array();
    	var r = new Array();
    	if(this.editRow){
    		this._sm = new Ext.grid.CheckboxSelectionModel();
    		//TODO
    		//c.push(this._sm);
    	} else {
    		this._sm = new Ext.grid.RowSelectionModel();
    	}
    		
    	if (this.columns.length>0) {
	    	for(var i=0; i<this.columns.length; i++){
	    		var cm = this.columns[i];
	    		if (typeof(cm) == "object") {
	    			var po = this.properties[cm.id]
	    			if (typeof(cm.dataIndex)==this.UDF){
	    				cm.dataIndex = cm.id
	    			}
	    			if (typeof(cm.type)==this.UDF){
	    				cm.type = this.getType(po.javatype)
	    			}
	    			var rd = {name: cm.id, type: cm.type, mapping: cm.dataIndex}
	    			if (cm.type == "date"){
	    				rd.dateFormat = cm.dateFormat ? cm.dateFormat : this.dateFormat
	    				if (typeof(cm.renderer)==this.UDF){
	    					cm.renderer = this.formatDateTime
	    				}
	    			}
					c.push(cm);
	    			r.push(rd);			
	    		} else if (typeof(cm) == "string") {
	    			var t = cm.split(",");
	    			var po,id,header,tp
	    			if (t.length == 2){
		    			po = this.properties[t[0]]
		    			id = t[0]
		    			header = t[1]
	    			} else {
	    				po = this.properties[cm]
	    				id = cm
	    				header = (po && po.comment!="null") ? po.comment : cm;
	    			}
	    			tp = this.getType(po.javatype)
	    			c.push({id:id, header:header, type: tp, dataIndex:id});
	    			r.push({name:id, type: tp});
	    		}
	    		
    		}
    	} else {
    		for(var o in this.properties){
    			var id = o;
    			var header = o.comment!="null" ? o.comment : o;
    			var tp = this.getType(po.type);
    			var _c = {id:o, header:header, type:tp}
    			var _r = {name:o, type:tp}
    			if (tp == "date") {
    				Ext.applyIf(_c, {dateFormat:this.dateFormat})
    				Ext.applyIf(_r, {dateFormat:this.dateFormat})
    			}
    			c.push(_c);
    			r.push(_r);
    		}
    	}
    	//选择模型
    	if(this.editRow){
	    	for(var i=0; i<this.fields.length; i++){
	    		var f = this.fields[i];
	    		var idx = 0;
	    		var blank = true;
	    		var _name = "";
	    		if (typeof(f) == "string") {
	    			_name = f.split(",")[0]
	    			idx = this.findIdxByProperty(c, "id", _name)
	    		} else {
	    			_name = f.id
	    			idx = this.findIdxByProperty(c, "id", _name)
	    			blank = eval(f.allowBlank) ? f.allowBlank : false;
	    			if (typeof(f.init)!=this.UDF) {
	    				Ext.applyIf(this.initValue,{_name: f.init});
	    			}
	    		}
	   			if (idx<0) {
	    			//TODO
	    		} else {
		    		if (r[idx].type == "int") {
		    			Ext.applyIf(c[idx], {editor: new Ext.form.NumberField({id: _name, allowBlank: blank})});
		    		} else if (r[idx].type == "date") {
		    			var _df = f.format ? f.format : this.dateFormat
		    			Ext.applyIf(c[idx], {editor: new Ext.form.DateField({id: _name, allowBlank: blank, format: _df})});
		    		} else {
		    			Ext.applyIf(c[idx], {editor: new Ext.form.TextField({id: _name, allowBlank: blank})});
		    		}
	    		}
	    	}
	    	
	    	for(var o in this.properties){
    			var id = o;
    			var tp = this.getType(po.type);
    			var _r = {name:o, type:tp}
    			if (tp == "date") {
    				_r.dateFormat = this.dateFormat
    			}
    			this.propertiesRecord.push(_r)
    		}
    		
    		
    		if (this.form){
				for (var i=0; i<this.formSections.length; i++){
    				this.formFieldSet[i] = new Array();
					for(var j=0; j<this.formFields[i].length; j++){
			    		var f = this.formFields[i][j];
			    		var blank = true;
			    		var _name = "";
			    		var fo = {};
			    		if (typeof(f) == "string") {
			    			_name = f.split(",")[0]
			    			fo.name = _name
							var po = this.properties[_name]
			    			fo.type = this.getType(po.javatype)
			    			fo.xtype = 'textfield'
			    			fo.xtype = (fo.type) && "int,float".indexOf(fo.type)>-1 ? "numberfield" : fo.xtype
			    			fo.xtype = (fo.type) && "date".indexOf(fo.type)>-1 ? "datefield" : fo.xtype
			    			if (fo.xtype == "datefield") {
			    				fo.format = this.dateFormat
			    			}
			    			fo.fieldLabel = (f.split(",").length>1) ? f.split(",")[1] : (po.comment!="null"? po.comment:_name)
			    		} else {
			    			_name = f.id
			    			fo.name = _name
			    			fo.xtype = "textfield";
		    				var po = this.properties[_name]	    				
			    			if(typeof(fo.type)==this.UDF) {
			    				fo.type = this.getType(po.javatype)
			    			}
			    			fo.xtype = (f.type) && "int,float".indexOf(f.type)>-1 ? "numberfield" : fo.xtype
			    			fo.xtype = (f.type) && "date".indexOf(f.type)>-1 ? "datefield" : fo.xtype
			    			fo.fieldLabel = (typeof(f.label)==this.UDF) && po.comment!="null"? po.comment:_name;
			    			fo.allowBlank = f.allowBlank ? f.allowBlank : false;
			    			fo.hidden = f.hidden ? f.hidden : false;
			    			fo.readOnly = f.readOnly ? f.readOnly : false;
			    			
			    			if (typeof(f.init)!=this.UDF) {
			    				Ext.applyIf(this.initValue,{_name: f.init});
			    			}
			    		}
			    		this.formFieldSet[i].push(fo)
					}
				}    		
    		}
	    }
    	this._cm = new Ext.grid.ColumnModel(c);
    	this.initRecord = Ext.data.Record.create(r);
    	
    	//配置Store
    	var remoteSort = this.where.toLowerCase().indexOf("order by")==-1
    	this._ds = new Ext.data.Store({
			reader: new Ext.data.JsonReader({
	            root: 'topics',
	            totalProperty: 'totalCount',
	            id: this.pk
        	}, r),
			baseParams: {
				ac: 'list',
				bean: this.bean,
				business: "baseMgm",
	    		method: "findwhereorderby",
	    		params: this.where
			},
			proxy: new Ext.data.HttpProxy({
	            method: 'GET',
	            url: MAIN_SERVLET
			}),
			remoteSort: remoteSort,
        	pruneModifiedRecords: true
        });
        if (remoteSort && this.orderBy!=""){
        	this._ds.setDefaultSort(this.orderBy.split(" ")[0], this.orderBy.split(" ")[1].toUpperCase())
        }
        
        //初始化配置完毕,准备加载
        this.initialised = true;
        
        this.assignColumnModel();
        
        this.assignFieldConfig();
        
        this.loadPanel();
    },
    
    assignColumnModel: function(){
    	for(var i=0; i<this.columnProperties.length; i++){
    		var c = this.columnProperties[i]
	    	var idx = this._cm.getIndexById(c[0]);
	    	if (idx<0)
				continue
			var a = c[1].split(":")
			if (a.length>1){
				var v = a[1].trim();
				switch(a[0]){
					case "hidden":
						this._cm.setHidden(idx, eval(v));
						break;
					case "readOnly":
						this._cm.setEditable(idx, !eval(v));
						break;
					case "width":
						this._cm.setColumnWidth(idx, v*1);
						break;
					case "header":
						this._cm.setColumnHeader(idx, v);
						break;
					case "editor":
						this._cm.setEditor(idx, eval(v));
						break;
					case "renderer":
						if (v == "upload"){
							this._cm.setRenderer(idx, this.makeUpload);
						} else {
							if (typeof(eval("window."+v)) == "function")
								this._cm.setRenderer(idx, eval("window."+v));
						}
						break;
				}
			}
		}
    },
    
    assignFieldConfig: function(){
		for(var i=0; i<this.editColumnProperties.length; i++){
    		var c = this.editColumnProperties[i]
	    	var field = this.findFieldById(c[0]);
	    	if (!field)
				continue
			var a = c[1].split(":")
			if (a.length>1){
				var v = a[1].trim();
				switch(a[0]){
					case "value":
						field.value = v;
						break;
					case "hidden":
						field.hidden = v;
						field.hideLabel = v;
						field.hideParent = v;
						break;
				}
			}
		}
	},
    
    findFieldById: function(id){
    	var field = null;
		for(var i=0; i<this.formFieldSet.length; i++){
			for(var j=0; j<this.formFieldSet[i].length; j++){
				if (this.formFieldSet[i][j].name == id){
					return this.formFieldSet[i][j];
				}
			}
		}
    	return field;
    },
    
    setColumnProperty : function(c, s){
    	this.columnProperties.push([c,s])
    },
    
    setEditColumnProperty : function(c, s){
    	this.editColumnProperties.push([c,s])
    },
    
    loadPanel: function(){
    	this.gridPanel = this.gridConstruction();
    	this.add(this.gridPanel);
    	if (this.form) {
    		this.formPanel = this.formConstruction();
	    	this.add(this.formPanel);
    	}
		
		var viewport = new Ext.Viewport({
            layout:'border',
			items: [this]			
        });

    	this.loadData();
    },
    
    loadData: function(){
    	this._ds.load({ params: {start: 0, limit: this.pageSize} });
    	
    	if (this.form){
	    	this._ds.on('load', function(){
	    			this.formPanel.getForm().reset();
	    	}, this)
			this._ds.on('update', function(){
	    			this.formPanel.getForm().loadRecord(this._sm.getSelected());
	    	}, this)
    		this.gridPanel.formHandler = this.loadForm
    	}    
    },
    
    gridConstruction: function(){
        var grid
        if (this.editRow) {
	    	grid = new Ext.grid.EditorGridTbarPanel({
	    		id: 'grid-panel',
	    		cm: this._cm,
	    		ds: this._ds,
	    		sm: this._sm,
	    		tbar: [],
		        border: false,
		        region: this.gridRegion,
		        clicksToEdit: 1,
		        height: this.gridHeight,
		        autoScroll: true,
                collapsible: true,
                split:true,
                layout:'fit',	
		        formBtn: this.form,
		        loadMask: true,
				viewConfig:{
					ignoreAdd: true
				},
				bbar: new Ext.PagingToolbar({
		            pageSize: this.pageSize,
		            store: this._ds,
		            displayInfo: true,
		            displayMsg: ' {0} - {1} / {2}',
		            emptyMsg: "无记录。"
		        }),
		        // expend properties
		        plant: this.initRecord,				
		      	PlantInt: this.initValue,			
		      	servletUrl: MAIN_SERVLET,		
		      	bean: this.bean,					
		      	business: "baseMgm",	
		      	primaryKey: this.identifier,
				insertMethod: 'insert',
				saveMethod: 'save',
				deleteMethod: 'delete'
	    	});
    	} else {
    		grid = new Ext.grid.GridPanel({
	    		cm: this._cm,
	    		ds: this._ds,
	    		sm: this._sm,
	    		tbar: ['-'],
	    		iconCls: 'icon-by-category',
		        border: false,
		        region: 'center',
		        autoScroll: true,
		        loadMask: true,
		        autoHeight: true,
				viewConfig:{
					ignoreAdd: true
				},
				bbar: new Ext.PagingToolbar({
		            pageSize: this.pageSize,
		            store: this._ds,
		            displayInfo: true,
		            displayMsg: ' {0} - {1} / {2}',
		            emptyMsg: "无记录。"
		        })
	    	});
    	}
    	this._sm.on('rowselect', this.gridRowSelected, this);
    	return grid;
    },
    
    gridRowSelected: function(){
    	if (this.form){
	    	var record = this._sm.getSelected();
	    	if (record.isNew) {
	    		this.formPanel.getForm().reset();
	    	} else {
		    	var v = record.get(this.identifier);
		    	this.formLoad(v);
	    	}
		}
    },
    
    formLoad: function(v){
    	this.formPanel.load({
    		url: MAIN_SERVLET, 
    		params:{
    			ac:'retrieve',
    			method:'findById',
    			business:'baseMgm',
    			bean:this.bean,
    			id:v
    		}, waitMsg:'Loading'});
    },
    
    formConstruction: function(){
    	var formItems = [];
    	for (var i=0; i<this.formSections.length; i++){
	    	var fieldSet = {
	            xtype: 'fieldset',
	            checkboxToggle: true,
	            title: this.formSections[i],
	            autoHeight: true,
	            defaults: {width: 210},
	            defaultType: 'textfield',
	            collapsed: false,
	            items: []
            }
	    	for(var j=0; j<this.formFieldSet[i].length; j++){
	    		fieldSet.items.push(this.formFieldSet[i][j])
			}
			formItems.push(fieldSet)
		}
    	return new Ext.form.FormPanel({
			tbar: [{text:'详细信息'},'-',{text:'新增',handler:this.formInsert, scope:this},{text:'保存',handler:this.formSave, scope:this},{text:'删除',handler:this.formDelete, scope:this}],
			border: false,
			bodyStyle:'padding:5px 5px 0',
			collapsible: true,
			split:true,
			width: 425,
			layout:'fit',
			autoScroll:true,
	        region: this.formRegion,
	        labelWidth: 70,
	        waitMsgTarget: true,
	        reader : new Ext.data.JsonReader({
				    totalProperty: "results",
				    root: "rows",
				    id: this.identifier
				}, this.propertiesRecord),
			items:formItems
    	})
    },
    
    formInsert: function(){
    	this.formPanel.getForm().reset();
    	this._sm.clearSelections();
    },
    formSave: function(){
		var form = this.formPanel.getForm();
		if (!form.isDirty()){
			return
		}
		if (form.isValid()){
			var temp = form.getValues()
			var data = {};
			var c = 0;
			for(var o in temp){
				if (o.indexOf("ext-")<0){
					data[o] = temp[o];
				}
			}

			var jsonData = Ext.encode(data);
			//alert(jsonData);return;

			var mode = this._sm.getSelected() ? "update" : "insert";
			var mt = this._sm.getSelected() ? this.actionTitles.formUpdate : this.actionTitles.formInsert;
			
			Ext.Ajax.request({
				waitMsg : '正在保存... ...',
				url : MAIN_SERVLET,
				params : {
					ac : "form-"+mode,
					bean : this.bean 
				},
				method : "POST",
				xmlData : jsonData,
				success : function(response, params) {
					var rtn = {}
					try{
						rtn = Ext.decode(response.responseText);
					}catch(e){
						this.messageBox("保存失败！", mt, "返回数据出错: "+response.responseText, "error");
						return;
					}
					if (rtn.success){
						this.messageBox("保存成功！", mt, "您成功新增了 1 条记录。","info");
					} else {
						this.messageBox("保存失败！", mt, rtn.msg, "error");
					}
				},
				failure : function(response, params) {
					this.messageBox("系统出错！", mt, response.responseText, "error");
				},
				scope: this
			});

	    	if (mode == "update") {
		    	this.formPanel.getForm().updateRecord(this._sm.getSelected());
		    	this._ds.commitChanges();
	    	} else {
				this.formPanel.getForm().updateRecord(this._sm.getSelected());
		    	this._ds.commitChanges();
			}
		} else {
			this.messageBox("校验失败！", mt, "输入不符合规则，请检查表单！", "warning");
		}
    },
    
    formDelete: function(){
    	this.gridPanel.defaultDeleteHandler();
    },    
    findIdxByProperty: function(a, p, v){
    	for(var i=0; i<a.length; i++){
    		var t = a[i]
    		if (t[p] == v){
    			return i
    		}
    	}
    	return -1
    },
    
    messageBox: function(t, s, v, f){
		Ext.MessageBox.show({
			title : t,
			msg : s,
			width : 500,
			value: v,
			buttons : Ext.MessageBox.OK,
			multiline : true,
			icon : eval("Ext.MessageBox."+f.toUpperCase())
		});    
    },
    
    getType: function(t){
    	switch(t){
    		case 'java.lang.String': 
    			return "string"
    			break;
    		case "java.util.Date" :
    			return "date"
    			break;
    		case "java.lang.Byte":
    		case "java.lang.Short":
    		case "java.lang.Integer":
    		case "java.lang.Long":
    			return "int"
    			break;
    		case "java.lang.Double":
    		case "java.lang.Float":
    		case "java.math.BigDecimal":
    			return "float"
    			break;
    		default: 
    			return "string"
    			break;
    	}
    },
    
    formatDateTime: function(value){
        var str = (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
        return str
    },
    
    printObject: function(obj){
    	var str = "{"
    	for(var o in obj){
    		str += o + ":" + obj[o] + "\n"
    	}
    	return str+"}";
    },
		
	makeUpload: function(vl){
		if (vl != this.UDF && vl != ""){
			return "<a href='javascript: download()' title='下载'>"+vl+"</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript: upload(true)' title='重新上传'>上传</a>"
		} else {
			return "<a href='javascript: upload()' title='上传'>上传</a>"
		}
	}
    
});