var bean = "com.sgepit.pmis.equipment.hbm.EquList"
var treePanel
var data;
var indexid;
var idS = new Array();
var win; 
var viewport;
var dsSub;
var conid;
var parentList="";
var rootText = "设备开箱清单";
var tbarTitle = '<font color=#15428b><b>&nbsp; 合同：' + conname + '，编号：' + conno + '</b></font>'
var tmpNode;  
var treeid;
var onpparent;
var onsbBm;
var loadFormRecord;
var menu_id;
Ext.onReady(function (){
	DWREngine.setAsync(false);  
	if("openbox" == argments){
		var sql="";
		if("undefined"==kxsbid){
			sql="select PID,DH_ID,CONID,SB_ID,SCCJ,GGXH,DW,ZS,DHSL,DJ,ZJ,JZH,ISKX,UUID,KXDH,SX,PARENTID,DHZT,SBBM,WZTYPE,SBMC,BOX_NO,PART_NO,DZ,ZZ from equ_sbdh_arr  where conid= "+conid
		}else{
			sql="select PID,DH_ID,CONID,SB_ID,SCCJ,GGXH,DW,ZS,DHSL,DJ,ZJ,JZH,ISKX,UUID,KXDH,SX,PARENTID,DHZT,SBBM,WZTYPE,SBMC,BOX_NO,PART_NO,DZ,ZZ from equ_sbdh_arr  where conid = "+conid+" and SB_ID ="+kxsbid
		}
		baseMgm.getData(sql,function(_list){
			//parentList = _list[0].PARENTID;
			parentList = _list[0][16];
		});
	}else{
		equlistMgm.getparent(conid, function(value){
			parentList = value
		});
	}
	DWREngine.setAsync(true);
	
	
	var	btnConfirm = new Ext.Button({
		text: '确定',
		iconCls : 'save',
		handler: confirmChoose
	})
            
    var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	 });
    var excelBtn = new Ext.Button({
			text:'excel导入',
			tooltip:'导入',
			iconCls: 'upload',
			pressed:true,
			//disabled:true,
			handler:showExcelWin
		}) 
	root = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        checked:false,
        listeners:{'checkchange':function(node,ifchecked){
        	if(ifchecked){
        		root.expand();
        		for(var i=0; i<node.childNodes.length; i++) {
        			var child = node.childNodes[i];
					var elNode = child.getUI().elNode;
        		} 
        	}
        }}
    })
  
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"getEqulistTree2", 
			businessName:"equMgm", 
			parent:parentList,
			kxuuid:kxuuid,
			kxsbid:kxsbid
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
		treePanel = new Ext.tree.ColumnTree({
        id: 'budget11-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 800,
        minSize: 275,
        maxSize: 600,
        frame: false,
        header: false,
        tbar:[tbarTitle,'-',
        	 {
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ root.expand(true); }
	            }, '-', {
	                iconCls: 'icon-collapse-all',
	                tooltip: 'Collapse All',
	                handler: function(){ root.collapse(true); }
	            },
        		'-',excelBtn,'->',btnConfirm/*,'-',btnReturn*/],
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '设备名称',
            width: 270,
            dataIndex: 'sbMc'
        },{
            header: '规格型号',
            width: 170,
            dataIndex: 'ggxh'
        },{
            header: '设备编码/图号',
            width: 0,
            dataIndex: 'sbBm',
            renderer: function(value){
            	return "<div id='sbBm'>"+value+"</div>";
            }
        },{
            header: '设备主键',
            width: 0,
            dataIndex: 'sbId',
            renderer: function(value){
            	return "<div id='sbId'>"+value+"</div>";
            }
        },{
            header: '到货主键',
            width: 0,
            dataIndex: 'dhId',
            renderer: function(value){
            	return "<div id='dhId'>"+value+"</div>";
            }
        },{
            header: '过滤条件',	
            width: 0,				
            dataIndex: 'indexId',
            renderer: function(value){
            	return "<div id='indexId'>"+value+"</div>";
            }
        },{
            header: '合同号',	
            width: 0,				
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
            header:'选择',
            width:40,
            dataIndex:'ischeck',
            renderer: checkColRender
            
        }], 
        loader: treeLoader,
        root: root,
        rootVisible : true 
	});
	treePanel.on('beforeload', function(node) {
		var sbId = node.attributes.sbId;
		var opensbid="";
		if (sbId == null){
			sbId = parentList;
			opensbid=kxsbid;
		}
		var baseParams = treePanel.loader.baseParams
		baseParams.ggid = ggid;
		baseParams.parent = sbId;
		baseParams.kxsbid = opensbid;
	})
	
	//新增右键
	treePanel.on('contextmenu', contextmenu, this);
	var treeMenu
	function contextmenu(node, e){
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		if (!treeMenu) {
			treeMenu = new Ext.menu.Menu({
				id : 'treeMenu',
				width : 100,
				items : [{
					id : 'menu_add',
					text : '新增',
					value : node,
					iconCls : 'add',
					handler : toHandler
				}, '-', {
					id : 'menu_update',
					text : '修改',
					value : node,
					iconCls : 'btn',
					handler : toHandler
				}, '-', {
					id : 'menu_del',
					text : '删除',
					value : node,
					iconCls : 'remove',
					handler : toHandler
				}]
			});
		}
		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
		if (isRoot) {
			//treeMenu.items.get("menu_add").disable();
			//treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			//treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();
		}
	}
	function toHandler(){
		formPanel.expand();
		var node = tmpNode;
		var state = this.text;
		var elNode = node.getUI().elNode;
		var isRoot = (rootText == node.text);
		var menu_nodeId = isRoot ? "0" : elNode.all("sbId").innerText;
		var menu_parent = isRoot ? "0" : elNode.all("parentid").innerText;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		//////////////////////////////////////////////////////////////////
		var newEquNo = "";
    	if(treeid !=null||treeid!=''){
	    	DWREngine.setAsync(false);
	    	equlistMgm.getEquNo(treeid,function(str){
	    		newEquNo = str;
	    	});
	    	DWREngine.setAsync(true);
    	}else{
    		var lastNewBm =onsbBm;
    		var increase = parseInt(lastNewBm.substring(lastNewBm.length-2,lastNewBm.length),10);
    		var strincrease = increase*1 < 9?"0"+(increase*1+1):increase*1+1 ;
    		newEquNo = lastNewBm.substring(0,lastNewBm.length-2)+strincrease
    	}
		/////////////////////////////////////////////////////////////////
		
	
		if ("新增" == state){
			saveBtn.setDisabled(false);
			var formRecord = Ext.data.Record.create(Columns);
			loadFormRecord = new formRecord({
				pid: CURRENTAPPID,
				sbId: null,
				sbMc: '',
				sbBm :newEquNo,
				dw : '',
				ggxh :'',
				sccj: '',
				conid : conid,
				parentid: treeid,
				zs:0,
				//kcsl: 0,
				recordman :REALNAME,
				storeBillstate: '到货已开箱',
				returnDate: '',
				partNo: '',
				sx:'-1'
			
			});	
			formPanel.getForm().loadRecord(loadFormRecord);
			var form = formPanel.getForm();
			//form.findField("bm").enable();
			//form.findField("mc").enable();
		} else if ("删除" == state) {
			delHandler(menu_isLeaf, menu_nodeId, menu_parent, node);
		} else {
			formPanel.isNew = false
			if ( menu_isLeaf==1) {
				saveBtn.setDisabled(false);
				var form = formPanel.getForm();
				//form.findField("bm").enable();
				//form.findField("mc").enable();
			}
		}
	}
	// 重新加载清单树    
    function reloadTree(){
    	if (tmpNode){
			var node = tmpNode.isLeaf()? tmpNode.parentNode : tmpNode;
			//var baseParams = treePanel.loader.baseParams
			//baseParams.parent = node.attributes.sbId;
			
			var sbId = node.attributes.sbId;
			if (sbId == null){
				sbId = parentList;
			}
			var baseParams = treePanel.loader.baseParams
			baseParams.ggid = ggid;
			baseParams.parent = sbId;
			
			//treePanel.getEl().mask('waiting..');
			if (node.isExpanded()) {
			   treeLoader.load(node);
			   node.expand();
		    } 
		    node.expand();
			//treePanel.getEl().unmask();
		}
    }
	function delHandler(leaf, nodeid, parentid, node){
		if ("0" == leaf){
			Ext.Msg.show({
			   title: '提示',
			   msg: '父节点不能进行删除操作！',
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			   
			});
		}else{
			Ext.Msg.show({
				title: '提示',
				msg: '是否删除' + node.attributes.ggxh,
				buttons : Ext.Msg.YESNO,
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(value){
					if ("yes" == value){
						treePanel.getEl().mask("loading...");
						equlistMgm.deleteChildNode(nodeid, function(flag) {
							if ("0" == flag) {
								var formDelRecord = Ext.data.Record
										.create(Columns);
								var flag = (node.parentNode.childNodes.length == 1)
								var pNode = flag
										? node.parentNode.parentNode
										: node.parentNode

								var formRecord = Ext.data.Record.create(Columns);
								var emptyRecord = new formRecord({									
									pid: CURRENTAPPID,
									sbId: null,
									isleaf: 1,
									parentid: '',
									indexId:''
								});								
								formPanel.getForm().loadRecord(emptyRecord);
								formPanel.getForm().clearInvalid();
								
								/*if (flag) {
									var parent = pNode.attributes.sbId;
									if (sbId == null){
										sbId = parentList;
									}
									var baseParams = treePanel.loader.baseParams
									baseParams.ggid = ggid;
									baseParams.parent = sbId;
								}*/
								
								Ext.example.msg('删除成功！', '您成功删除了一条信息！');
								setTimeout(reloadTree, 1000);
								window.location.reload();
								
							} else {
								Ext.Msg.show({
									title : '提示',
									msg : '数据删除失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
							treePanel.getEl().unmask();
						});						
					}
				}
		    })
		}
	}
	
	treePanel.on("click", function(node, e){
		var elNode = node.getUI().elNode;
		var chx = e.getTarget()
		
		var isRoot = node == root;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		
		tmp_parent = menu_isLeaf;
		menu_id = isRoot ? "0" : elNode.all("sbId").innerText;
		/*indexid=elNode.all("indexId").innerText;
		treeid=elNode.all("sbId").innerText;
		conid=elNode.all("conid").innerText;
		onsbBm=elNode.all("sbBm").innerText;
		onpparent=elNode.all("parentid").innerText;*/
		var formRecord = Ext.data.Record.create(Columns);
		loadFormRecord = null;
		saveBtn.setDisabled(true);
		var form = formPanel.getForm();
		DWREngine.setAsync(false);
		var result = 0;
		equRecMgm.storeNum(treeid,function(num){
				result = num;
			});
		baseMgm.findById(bean, menu_id, function(obj) {
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
		tmpNode = node;
		tmpLeaf = menu_isLeaf;
		formPanel.getForm().loadRecord(loadFormRecord);   
		//form.findField("kcsl").setValue(result);
		if (chx.id && chx.id.indexOf("Checker") > 0) {
			chx.className = chx.className=="x-grid3-check-col-on"? "x-grid3-check-col":"x-grid3-check-col-on";
			var checked = chx.className=="x-grid3-check-col-on";
			deepCheck(node, chx.id, checked)
			/*if (checked){
				var p = node.parentNode
				while(p){
					if (p.getUI().elNode && p.getUI().elNode.all(chx.id))
					checkerClick(p.getUI().elNode.all(chx.id), true)			
					p = p.parentNode
				}
			}*/
		}
	});
	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		//tbar : [],
		items : [treePanel, formPanel]

	})
	
	/////////////////////////////////////////////////////////////
	if (Ext.isAir) { // 创建viewpor
			var win = new Ext.air.MainWindow({
				layout : 'border',
				items : [contentPanel],
				title : 'Simple Tasks',
				iconCls : 'icon-show-all'
			}).render();
		} else {
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [contentPanel]
			});
		}
    
	treePanel.render();
	treePanel.expand();
	root.expand();
	 
    function checkColRender(value){
		if(value=='true'){
			return '<div id="colChecker"><font color=#FF0066;>已选</font></div>'
		}else{
			return '<div id="colChecker" class="x-grid3-check-col" onclick="checkerClick(this)">&#160;</div>' 
		}
	}
    
	function sumzs(parentList){
		dhzs=0;
		DWREngine.setAsync(false);  
		equlistMgm.dhzs(parentList, function(value){
			dhzs = value
		});
		DWREngine.setAsync(true);
		return dhzs;
     }
	
	function deepCheck(node, id, checked){
		for(var i=0; i<node.childNodes.length; i++) {		
			var child = node.childNodes[i];
			var elNode = child.getUI().elNode;
			var chx = elNode.all(id)
			checkerClick(chx, checked)
			deepCheck(child, id, checked)
		}
	}

	function checkerClick(chx, flag){
	    if(chx.className !="" ){
		var checked = chx.className == "x-grid3-check-col-on"
	
		if (typeof(flag)=="undefined")
			chx.className = checked ? "x-grid3-check-col" : "x-grid3-check-col-on"
		else
			chx.className = flag ? "x-grid3-check-col-on" : "x-grid3-check-col"
		}
	}
	
	function confirmChoose(){
		treePanel.getEl().mask('loading....');
	    var data = deepConcat(root);
    	DWREngine.setAsync(false);  
    	if("getgoods" == argments){
			equlistMgm.saveSelectEqu(conid,ggid, data, function(){
				treePanel.getEl().unmask();
			});     	
    	}else if("getgoodsarr" == argments){
			equlistMgm.saveSelectEquArr(conid,ggid, data, function(){
				treePanel.getEl().unmask();
			});     	    		
    	} else if("openbox" == argments){
			equlistMgm.saveSelectOpen(conid,kxuuid,data,ggid,kxsbid,function(){
				treePanel.getEl().unmask();
			});     	    		
    	}
		     
		DWREngine.setAsync(true);
		parent.selectWindow.hide();		
	}
	
	function deepConcat(node){
		var arr = new Array();
	   	var len = node.childNodes.length;
	   	for(var i=0; i<len; i++){
	   		var child = node.childNodes[i]
	   		var elNode = child.getUI().elNode;
			var checked = elNode.all("colChecker").className == "x-grid3-check-col-on";
			if (checked) {
				var id = elNode.all("sbId").innerText;
				arr.push(id);
			}
			arr = arr.concat(deepConcat(child));
	   	}
	   	return arr;
	}
	
	//excel导入窗口
	function showExcelWin(){
		if(!fileWin){
			var fileForm = new Ext.form.FormPanel({
				fileUpload:true,
				labelWidth:30,
				layout:'form',
				baseCls:'x-plain',
				items:[{
					id:'excelfile',
					xtype:'fileuploadfield',
					fieldLabel:'excel',
					buttonText:'excel上传',
					width: 390,
					border:false,
					listeners:{
						'fileselected':function(field,value){
							var _value = value.split('\\')[value.split('\\').length-1]
							if(_value.indexOf('.xls') != -1){
								this.ownerCt.buttons[0].enable()
							}else{
								field.setValue('')
								this.ownerCt.buttons[0].disable()
								Ext.example.msg('警告','请上传excel格式的文件')
							}
						}
					}
				}],
				buttons:[{
					text:'确定',
					iconCls:'upload',
					disabled:true,
					handler:doExcelUpLoad
				}]
			})
			var fileWin = new Ext.Window({
				id:'excelWin',
				title:'excel导入',
//				closeAction:'hide',
				modal:true,
				width:450,
				height:100,
				items:[fileForm]
			})
		}
		fileWin.show()
	}

	function doExcelUpLoad(){
		var win = this.ownerCt.ownerCt
		var stobill='到货已开箱';
		//var args = "parentid`"+tmpNode.attributes.sbId +";realname`"+REALNAME+";storeBillstate`"+stobill
		var args = "parentid`"+tmpNode.attributes.sbId +";realname`"+REALNAME+";storeBillstate`"+stobill+";indexid`"+indexid
		//var args = "parentid`"+tmpNode.attributes.sbId +";realname`"+REALNAME
		this.ownerCt.getForm().submit({
			waitTitle:'请稍候...',
			waitMsg:'数据上传中...',
			url:MAIN_SERVLET+"?ac=upExcel&bean="+bean+"&business=equlistMgm&method=saveHandleExcel&argments="+args,
			success:function(form,action){
				Ext.Msg.alert('恭喜',action.result.msg,function(v){
					win.close()
					treePanel.fireEvent('click',tmpNode)
				
				})
			},
			failure:function(form,action){
				Ext.Msg.alert('提示',action.result.msg,function(v){
					win.close()
					setTimeout(reloadTree, 2000);
				})
			}
		})
	}	

 });
	
