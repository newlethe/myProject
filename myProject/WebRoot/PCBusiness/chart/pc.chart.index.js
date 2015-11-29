var CmlGrid,store,ChartPanel,CardPanel,chartSWF;
var saveBtn,viewBtn,returnBtn;
function initialise(){
	store = new Ext.data.Store({
		reader:new Ext.data.JsonReader({},[
			{
				name:'bizname',
				type:'string'
			},{
				name:'type',
				type:'string'
			},{
				name:'path',
				type:'string'
			},{
				name:'filename',
				type:'string'
			},{
				name:'state',
				type:'bool'
			},{
				name:'date',
				type:'string'
			}
		])
	});
	store.setDefaultSort("type", 'asc');
	CmlGrid = new Ext.grid.GridPanel({
		columns:[
			new Ext.grid.RowNumberer(),
			{
				header : '图表',
				dataIndex : "bizname",
				width:100,sortable:true
			},{
				header : '编号',
				width:80,sortable:true,
				dataIndex : "type",
				align : 'center'
			},{
				header : '路径',
				dataIndex : "path",
				width:400,sortable:true,
				align : 'left'
			},{
				header : '状态',
				dataIndex : "state",
				width:60,sortable:true,
				align : 'center',
				renderer:function(v){
					if(v===false){
						return "<font color=gray>备用配置</font>"
					}else{
						return "<font color=green><b>使用中</b></font>"
					}
				}
			},{
				header : '操作',
				dataIndex : "type",
				width:200,
				align : 'center',
				renderer:function(v,m,r){
					var type = r.get("type");
					var filename = r.get("filename");
					return  "<button style=\"border:none;background-color:transparent\" onclick=\"editcml(\'"+filename+"\',\'"+type+"\')\">编辑</button>"+
							"<button style=\"border:none;background-color:transparent\" onclick=\"activecml(\'"+filename+"\',\'"+type+"\')\">启用</button>"+
							"<button style=\"border:none;background-color:transparent\" onclick=\"backupcml(\'"+filename+"\',\'"+type+"\')\">备份</button>"+
							"<button style=\"border:none;background-color:transparent\" onclick=\"deletecml(\'"+filename+"\',\'"+type+"\')\">删除</button>"
				}
			},{
				header: '最后修改日期',
				dataIndex : "date",
				width:200,sortable:true,
				align : 'center'
			}
		],
		ds : store,
		sm : new Ext.grid.RowSelectionModel({singleSelect:true}),
		id : '_grid'
	});
	//ChartPanel
	ChartPanel = new Ext.Panel({
    	id:'_chart',
    	filename:null,
    	html:'<div id="myChart" style="height:100%"></div>'
	});
	var topbar = new Ext.Toolbar({height:25});
	CardPanel = new Ext.Panel({
			layout:'card',
        	activeItem:0,
        	tbar : topbar,
        	items:[CmlGrid,ChartPanel]
	});
	
	new Ext.Viewport({
		layout : 'fit',
		items : [CardPanel]
	});
	loadStore();
	chartSWF = new Carton("/XCarton/main.swf", "main", "100%", "100%", "#FFFFFF", "0");
    chartSWF.render("myChart");
    
    saveBtn = new Ext.Button({
		text:'保存',
		hidden:true,
		handler:function(){
			if(CardPanel.layout.activeItem.id=='_chart'){
				savecml(chartSWF.saveAsXML(),ChartPanel.filename);
			}
		}
    });
    returnBtn = new Ext.Button({
		text:'返回',
		hidden:true,
		iconCls: 'returnTo',
		handler:function(){
			CardPanel.layout.setActiveItem('_grid');
			buttonsCtrl();
		}
    });
    viewBtn = new Ext.Button({
		text:'预览',
		hidden:true,
		iconCls: 'form',
		handler:function(){
			var url = IP+"/XCarton/preview.html";
			var sFeatures = "top=0,left=0,toolbar=no,resizable=yes,height="+screen.availHeight+",width="+screen.availWidth
			window.open(url,"_blank",sFeatures);
		}
    });
    topbar.add(viewBtn,saveBtn,returnBtn);
}
function buttonsCtrl(){
	if(CardPanel.layout.activeItem.id=='_chart'){
		saveBtn.show();
		returnBtn.show();
		viewBtn.show();
	}else{
		saveBtn.hide();
		returnBtn.hide();
		viewBtn.hide();
	}
}
function loadStore(){
	if(store){
		var o = new Array();
		o.push({bizname:'产业分布图',type:'zhxx'});
		o.push({bizname:'合同信息图',type:'conove'});
		o.push({bizname:'概算信息图',type:'bdg'});
		o.push({bizname:'首页图',type:'welcomeChart'});
		pcPrjService.getCmlFileList(Ext.encode(o),true,function(lt){
			store.loadData(lt)
		})
	}
}
function editcml(filename,type){
	CardPanel.layout.setActiveItem('_chart');
	ChartPanel.filename = filename;
	chartSWF.setDataURL(BASE_PATH+"PCBusiness/cml/"+filename);
	buttonsCtrl();
}
function savecml(xmlStr, filename){
	Ext.Msg.confirm('提示','是否保存?',function(btn){
		if(btn=='yes'){
			pcPrjService.saveCmlFile(xmlStr, filename, function(flag){
				if(flag){
					
				}else{
					Ext.Msg.alert('提示','操作失败!')	
				}
			})
		}
	})
}
function activecml(filename,type){
	if(filename==(type+".cml")){
		Ext.Msg.alert('提示','该配置文件已经启用!')		
	}else{
		Ext.Msg.confirm('提示','是否启用此配置信息?',function(btn){
			if(btn=='yes'){
				pcPrjService.activeCml(filename,type,function(flag){
					if(flag){
						loadStore()
					}else{
						Ext.Msg.alert('提示','操作失败!')	
					}
				})
			}
		})
	}
}
function backupcml(filename,type){
	pcPrjService.backupCml(filename,type,function(flag){
			if(flag){
				loadStore()
			}else{
				Ext.Msg.alert('提示','操作失败!')	
			}
		})
}
function deletecml(filename,type){
	if(filename==(type+".cml")){
		Ext.Msg.alert('提示','该配置文件使用中，不可删除!')		
	}else{
		Ext.Msg.confirm('提示','删除后不可恢复，是否删除此备份配置信息?',function(btn){
			if(btn=='yes'){
				pcPrjService.deleteCml(filename,type,function(flag){
					if(flag){
						loadStore()
					}else{
						Ext.Msg.alert('提示','操作失败!')	
					}
				})
			}
		})
	}
}
function loadChart(){
	var testStr = '<Carton width="443" height="121">'
					  +'<variable/>'
					  +'<Chart type="LABEL" width="232" height="46" UID="JFPS1M4" x="211" y="75">'
					    +'<param name="text" mode="prop" value="测试嘛"/>'
					    +'<param name="color" mode="style" value="39270"/>'
					    +'<param name="fontWeight" mode="style" value="bold"/>'
					    +'<param name="fontSize" mode="style" value="34"/>'
					    +'<param name="fontFamily" mode="style" value="华文仿宋"/>'
					    +'<param name="textAlign" mode="style" value="center"/>'
					  +'</Chart>'
					+'</Carton>'
    
	chart = new Carton("/XCarton/main.swf", "main", "100%", "100%", "#FFFFFF", "0");
    chart.render("myChart");
    //chart.setDataCML(testStr);
	chart.setDataURL(BASE_PATH+"PCBusiness/cml/zhxx.cml")
}
Ext.onReady(initialise);