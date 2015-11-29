Ext.ns("PC");
PC.Store = Ext.extend(Ext.data.Store,{
	isloadprojs:false,
	defaultProjInfo:{
		prjName:"",
		industryType:"",
		buildNature:"",
		investScale:"",
		prjType:"",
		prjRespond:""
	},
	loadRecords : function(o, options, success){
		if(o&&success!==false){
			this.initProjInfos();
			var r = o.records
			var m = this.projInfos;
			var obj = new Array();
			for(var i=0;i<r.length;i++){
				for(var j=0;j<m.length;j++){
					if(m[j].pid == r[i].get('pid')){	
						var projInfo = this.getProjInfo(r[i].get("pid"))
						for(var p in projInfo){
							r[i].set(p,projInfo[p]);
							obj.push(r[i]);
						}
					}
				}
			}
			o.records = obj;
		}
		PC.Store.superclass.loadRecords.call(this, o, options, success);
	},
	getProjInfo:function(pid){
		var projInfo = this.defaultProjInfo;
    	if(pid&&pid!=""){
    		for(var i=0;i<this.projInfos.length;i++){
    			if(this.projInfos[i].pid==pid){
    				projInfo = this.projInfos[i];
    				break;
    			}
    		}
    	}
		return projInfo;
    },
    initProjInfos:function(){
    	if(this.isloadprojs!==true){
	    	DWREngine.setAsync(false);
	    	var This = this;
			var projInfoBean = "com.sgepit.pcmis.zhxx.hbm.VPcZhxxPrjInfo";
			var where = " pid not in (select m.unitid from SgccUnitModule m where m.powerpk = '"+FUN_ID+"')"
			if(FUN_ID == 'null') where = ' 1=1 ';
	    	baseDao.findByWhere2(projInfoBean,where,function(list){
	    		This.projInfos = list;
	    	});
	    	DWREngine.setAsync(true);
	    	this.isloadprojs = true;
    	}
    },
    listeners:{
    	load :function(store){
    		store.remoteSort = false;
    		store.sort("pid","ASC");
    	}
    }
})
var summary = new Ext.ux.grid.GridSummary();

//集团需求，隐藏“项目类型、建设规模、投资规模” zhangh 2013-11-26
PC.ProjectStatisGrid=Ext.extend(Ext.grid.GridPanel ,{
	prjRenderer:null,
	searchHandler:Ext.emptyFn,
	plugins: [summary],
	stripeRows:true,
    border : false,
	fixedColumns:[
		new Ext.grid.RowNumberer(),
		{
			header:"项目名称",sortable:false,dataIndex:"prjName",width:380,
			summaryType:'count',summaryRenderer:function(v){return "<b>共 "+v+" 个项目</b>"}
		},{
			header:"项目类型",sortable:false,dataIndex:"prjTypeName",width:70,align:"center",hidden: true
		},{
			header:"建设性质",sortable:false,dataIndex:"buildNatureName",width:60,align:"center"
		},{
			header:"建设规模",sortable:false,dataIndex:"memoC2",width:100,align:"center",hidden:true,
			renderer:function(v,m,record){
				var t1 = record.get("memoC2")==null?"": record.get("memoC2");
				var t2 = record.get("memoC4")==null?"": record.get("memoC4");
				var t3 = record.get("guiMoDw")==null?"":record.get("guiMoDw");
				
				if(t1!=null&&t1!=""&&t1.length>0){
					t2 = "X"+t2;
				}
				return t1+t2+t3;
			}
		},{
			header:"投资规模",sortable:false,dataIndex:"investScale",width:100,align:"right",hidden:true,
			renderer:function (value){
			    return cnMoneyToPrec(value/10000,2);
			},summaryType:'custom',
			calculateFn:function(name,r,rs){
				var v=0;
				for(var i=0;i<rs.length;i++){
					var val = rs[i].get("investScale");
					var conMoney = parseInt(v);
					if(!isNaN(parseInt(val))){
						v+=parseFloat(parseInt(val));
					}
				}
				return (v)
			},
			summaryRenderer:function(v){
				var conMoney = parseInt(v);
				if(!isNaN(conMoney)){
					var conlength = conMoney.toString().length;
					var conM = '';
					if (conlength >= 9) {
						var res = parseFloat(conMoney) / parseFloat(100000000);
						conM = res.toFixed(2) + "亿元";
					} else if (conlength >= 5 && conlength < 9) {
						var res = parseFloat(conMoney) / parseFloat(10000);
						conM = res.toFixed(1) + "万元";
					} else {
						conM = conMoney + "元";
					}
					return conM;
				}
			}
		},{
			header:"产业类型",sortable:false,dataIndex:"industryTypeName",width:60,align:"center"
		},{
			header:"负责人",sortable:false,dataIndex:"prjRespond",width:70,align:"center"
		}
	],
	initComponent: function(){
		if(this.title)	delete this.title;
		this.adjustColumns();//调整列模型
		//集团调整，去掉工具条
        //this.adjustTopToolbar();//顶部工具条，单位过滤，项目关键字过滤
		
		//added by Liuay 如果是项目单位系统，隐藏产业类型、建设性质、建设规模字段；
		if(DEPLOY_UNITTYPE=="A") {
			this.getColumnModel().setHidden(3, true);      //隐藏建设性质
			this.getColumnModel().setHidden(4, true);      //建设规模  
			this.getColumnModel().setHidden(5, true);      //投资规模 
		}
		PC.ProjectStatisGrid.superclass.initComponent.call(this);
	},
	/**
	 * 单位选择树
	 */
	initUnitTreeCombo : function(){
		if(!this.treeCombo){
			var where = " unitid not in (select m.unitid from SgccUnitModule m where m.powerpk = '"+FUN_ID+"')"
			if(FUN_ID == 'null') where = ' 1=1 ';
			this.treeCombo = new Ext.ux.TreeCombo({
				resizable:true,
				width:280,
				loader:new Ext.tree.TreeLoader({
					dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
					requestMethod: "GET",
					baseParams:{
						parentId:USERBELONGUNITID,
						ac:"buildingUnitTree",
						baseWhere:"unitTypeId in ('0','1','2','3','4','5','A') and "+where
					}
				}),
				value:USERBELONGUNITID,
				root:  new Ext.tree.AsyncTreeNode({
			       text: USERBELONGUNITNAME,
			       id: USERBELONGUNITID,
			       expanded:true
			    })
			});
			var THIS = this;
			var treePanel = this.treeCombo.getTree(); 
			treePanel.on('beforeload',function(node){
				treePanel.loader.baseParams.parentId = node.id; 
			});
			this.treeCombo.on('select',function(tree, node){
				var serachFn = THIS.searchHandler;
 				if(serachFn&&typeof serachFn =='function'){
 					var ds      = THIS.getStore();
					var unitid  = THIS.treeCombo.getValue();
					var unitname  = THIS.treeCombo.getRawValue();
					var proName = THIS.nameField.getValue();
					THIS.searchHandler(ds,unitid,proName,unitname);
 				}
			});
		}
	},
	/**
	 * 项目名称查询
	 */
	initProjNameField : function(){
		var me = this;
		this.nameField = this.nameField?this.nameField:new Ext.form.TextField({width:150});
		this.nameField.on('specialkey',function(textField, event ){
 			if(event.getKey()==13){
 				var serachFn = me.searchHandler;
 				if(serachFn&&typeof serachFn =='function'){
 					var ds      = me.getStore();
					var unitid  = me.treeCombo.getValue();
					var unitname  = me.treeCombo.getRawValue();
					var proName = me.nameField.getValue();
					me.searchHandler(ds,unitid,proName,unitname);
 				}
 			}
 		});
	},
	/**
	 *  调整列模型 
	 */
	adjustColumns:function(){
		var me = this;
		for(var i=0;i<this.fixedColumns.length;i++){
			if(this.fixedColumns[i].dataIndex=="prjName"){
				this.fixedColumns[i].renderer= function(v,meta,rec,rInx,cInx,store){
					 var val = v;
					 if(me.prjRenderer){
					 	val = me.prjRenderer(v,meta,rec,rInx,cInx,store);
					 }
					 meta.attr = "title='"+v+"'";
					 return val;
				};
				//delete this.prjRenderer;
				break;
			}
		};
		if(Ext.isArray(this.columns)){
            this.colModel = new Ext.grid.ColumnModel(this.fixedColumns.concat(this.columns));
            delete this.columns;
        }
        if(this.cm){
        	var config = this.cm.config;
        	this.cm.setConfig(this.fixedColumns.concat(config))
            this.colModel = this.cm;
            delete this.cm;
        }
        if(!this.colModel){
        	 this.colModel = new Ext.grid.ColumnModel(this.fixedColumns);
        }
		delete this.fixedColumns;
	},
	/**
	 * 顶部工具条调整，增加单位选择下拉树和项目名称模糊查询
	 */
	adjustTopToolbar:function(){
		if(!this.tbar) 	this.tbar = [];
		
		this.initUnitTreeCombo();
		this.initProjNameField();
		var serachBtn = new Ext.Toolbar.Button({
			text:'查询',	scope:this,iconCls: 'form',
			handler:function(){
				var ds      = this.getStore();
				var unitid  = this.treeCombo.getValue();
				var unitname  = this.treeCombo.getRawValue();
				var proName = this.nameField.getValue();
				this.searchHandler(ds,unitid,proName,unitname);
			}
		});
		
		if(Ext.isArray(this.tbar)){
			this.tbar.push("单位：&nbsp;&nbsp;");
			this.tbar.push(this.treeCombo);
			this.tbar.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
			this.tbar.push("项目名称：&nbsp;&nbsp;");
			this.tbar.push(this.nameField);
			this.tbar.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
			this.tbar.push(serachBtn);
			this.tbar.push("->");
			this.tbar.push("计量单位：万元&nbsp;&nbsp;&nbsp;&nbsp;");
		}else{
			this.tbar.add("单位：&nbsp;&nbsp;");
			this.tbar.add(this.treeCombo);
			this.tbar.add("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
			this.tbar.add("项目名称：&nbsp;&nbsp;");
			this.tbar.add(this.nameField);
			this.tbar.add("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
			this.tbar.add(serachBtn);
			this.tbar.add("->");
			this.tbar.add("计量单位：元&nbsp;&nbsp;&nbsp;&nbsp;");
		}
        if(parent.CT_TOOL_DISPLAY){
            parent.CT_TOOL_DISPLAY(false);
        }
	}
});
        if(parent.wanyuan){
            parent.wanyuan.setText('<font color=#15428b><b>单位：万元</b></font>');
        }