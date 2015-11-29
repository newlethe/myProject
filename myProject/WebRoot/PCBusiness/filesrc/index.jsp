<%@ page language="java" pageEncoding="UTF-8" %>
<%@page import="com.sgepit.frame.base.Constant"%>
<%
	String path     = request.getContextPath();	
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";	
%>
 <html>
	<head>
		<title>资源管理</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<script>
			var BASE_PATH = '<%= basePath %>';
		</script>
		<style>
			* {font-size:12px;}
			input { border:1px solid #888; vertical-align:middle}
		</style>
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-gray.css" /> 
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css">
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/source/debug.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="extExtend/columnTreeNodeUI.js"></script>
	</head>
	<script type="text/javascript">
		var TextAreaTab = { 
   		Register : function(obj){ 
	       obj.onclick = new Function('TextAreaTab.CreateInsertPosition(this)'); 
	       obj.onselect = new Function('TextAreaTab.CreateInsertPosition(this)'); 
	       obj.onkeyup = new Function('TextAreaTab.CreateInsertPosition(this)'); 
	       obj.onkeydown = new Function('TextAreaTab.InsertTab(this)'); 
	   }, 
   		CreateInsertPosition : function(obj){ 
       		if (obj.createTextRange){ 
           		obj.InsertPosition = document.selection.createRange().duplicate(); // 光标选中的对象 
       		} 
   		}, 
   		InsertTab : function(obj) { 
       		var evt = this.GetEvent();
       		if (evt.keyCode == 9){ 
	           	if (obj.createTextRange && obj.InsertPosition){ 
	               obj.InsertPosition.text = '\t'; 
	               evt.returnValue = false; 
	           }else if (window.getSelection){ 
	               var scrollTop = obj.scrollTop; 
	               var start = obj.selectionStart;
	
	               var pre = obj.value.substr(0, obj.selectionStart);
	               var next = obj.value.substr(obj.selectionEnd); 
	               obj.value = pre + '\t' + next; 
	
	               evt.preventDefault(); 
	               obj.selectionStart = start + 1; 
	               obj.selectionEnd = start + 1; 
	               obj.scrollTop = scrollTop; 
	           } 
       		} 
   		}, 
   		GetEvent : function() { 
       		if(document.all){ 
           		return window.event; 
       		} 

       		func = this.GetEvent.caller; 
       		while(func != null) { 
           		var arg0 = func.arguments[0]; 
           		if(arg0) { 
               		if((arg0.constructor == Event || arg0.constructor == MouseEvent) 
                   			||(typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) { 
                   		return arg0; 
               		} 
           		} 
           		func = func.caller; 
       		} 
       		return null; 
   		} 
	} 
	</script>
	<script type="text/javascript">
		var viewport;
		var baseRoot = '/frame/PCBusiness';
		Ext.onReady(function() {
			var maxw = document.body.clientWidth;
			viewport = new Ext.Viewport({
				layout:'fit',
				items:[new Ext.tree.ColumnTree({
					autoScroll:true,
					lines :true,
					rootVisible:false,
					tbar:['<b>路径:</b>',{
						xtype:'textfield',width:400,value:baseRoot,id:'pt',readOnly:true
					},{
						text:'<b>进入</b>',
						handler:function(){
							baseRoot=Ext.getCmp('pt').getValue();
							viewport.items.get(0).root.reload();
						}
					},{
						text:'<b>向上</b>',
						handler:function(){
							var _p=Ext.getCmp('pt').getValue();
							_p=_p.substring(0,_p.lastIndexOf("/"));
							Ext.getCmp('pt').setValue(_p);
							baseRoot=_p;
							viewport.items.get(0).root.reload();
						}
					},{
						text:'<b>删除</b>',
						handler:function(){
							var tree=viewport.items.get(0);
							var node= tree.getSelectionModel().getSelectedNode();
							if(node){
								var type=node.attributes.type
								if(type=="item") return

								var _url = baseRoot;
				        		if(_url.substring(0,1)=="/") _url= _url.substring(1);
				        		if(_url.substring(_url.length)!="/") _url= _url+"/";
								var fullPath = _url+(node.attributes.fpath);
								var pnode = node.parentNode;
								
								
								var warn = (type=="item"?"删除后不可恢复，是否删除【"+node.text+"】文件夹？":
										"删除后不可恢复，是否删除此【"+node.text+"】文件?")
								Ext.Msg.confirm("提示",warn,function(sel){
									if(sel=="yes"){
										Ext.Ajax.request({
											url : BASE_PATH+"PCBusiness/filesrc/action.jsp",
											params : {
												ac : "del",
												fpath:fullPath
											},
											method : "POST",
											success : function(response, params) {
												Ext.Msg.show({
													title: '提示',
													msg: response.responseText,
													icon: Ext.Msg.Info,
													buttons: Ext.Msg.OK,
													fn:function(){
														if(pnode) pnode.reload();
													}
												});
											},
											failure : function(){
												alert("操作失败!")
											}
										});	
									}
								})
							}
						}
					},'->',{
						text:'<b>系统日志</b>',
						handler:function(){
							var downUrl = BASE_PATH+"PCBusiness/filesrc/download.jsp?log=1";
							window.location.href = downUrl;
						}
					}],
					root:new Ext.tree.AsyncTreeNode({
						id:'0',
						text:'文件列表',
						expanded:true,
						fpath:""
					}),
					listeners:{
						click : function(n,e){
							if(n.hasChildNodes()){
								Ext.getCmp('pt').setValue(baseRoot+"/"+n.id)
							}
						}
					},
					loader : new Ext.tree.TreeLoader({
						url : BASE_PATH+"PCBusiness/filesrc/treedata.jsp",
						clearOnLoad : true,
						baseParams :{
							fpath:""
						},
						listeners:{
							beforeload:function(This, node, callback ){
								This.baseParams.fpath = node.attributes.fpath;
								This.baseParams.proot = baseRoot;
							}
						},uiProviders:{
						    'col': Ext.tree.ColumnNodeUI
						}
					}),
					columns:[{
			            header: '文件名称',
			            width:maxw-100-160-330,
			            dataIndex: 'text'
			        },{
			        	header:'<center>操作</center>',
			        	width:200,
			        	align:'center',
			        	dataIndex:'fpath',
			        	renderer:function(value,n,a){
			        		if(n.isLeaf()){
			        			var _url = baseRoot;
			        			if(_url.substring(0,1)=="/") _url= _url.substring(1);
			        			if(_url.substring(_url.length)!="/") _url= _url+"/";
			        			var _url2 =_url;
			        			if(_url2!="/") _url2="/"+_url2;
			        			var eidtLink = '<a href="#" style="color: red;" onClick="editFile(\''+(_url+value)+'\');">【编辑】</a>'
			        			if(!n.attributes.edit) eidtLink="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
								var downUrl = BASE_PATH+"PCBusiness/filesrc/download.jsp?fpath="+(_url+value);
								return '<center>'+
										'<a href="#" style="color: blue;" onClick="download(\''+downUrl+'\');">【下载】</a>'+
										'<a href="#" style="color: green;" onClick="upload(\''+(_url+value)+'\');">【上传】</a>'+
										'<a href="#" style="color: orange;" onClick="openLink(\''+(_url2+n.attributes.durl)+'\');">【浏览】</a>'+
										eidtLink+
										'</center>'
			        		}else{
								return ""						
			        		}
			        	}
			        },{
			        	header:'<center>文件大小</center>',
			            width: 100,
			        	align:'right',
			            dataIndex: 'size'
			            ,renderer:function(v){return '<div align="right">'+(v?v:"")+'</div>'}
			        },{
			        	header:'<center>最后修改时间</center>',
			            width: 160,
			        	align:'center',
			            dataIndex: 'update'
			            ,renderer:function(v){return '<center>'+(v?v:"")+'</center>'}
			        }]
				})]
			})
		});
		function download(downUrl){
			window.location.href = downUrl;
		}
		function upload(downUrl){
			var fileForm = new Ext.FormPanel({
				fileUpload: true,
				bodyStyle: 'padding: 10px 10px;',
				url: BASE_PATH+"PCBusiness/filesrc/action.jsp?ac=upload&random="+Math.random()+"&fpath="+downUrl,
				items: [{
					hideLabel:true,xtype:'field',inputType :'file',width:370,
					defaultAutoCreate:{tag : 'input',style:'padding: 3px 3px;'}
				}]
			})
			var win = new Ext.Window({
				layout:'fit',
				width:400,
				height:130,
				resizable :false,
				closable : false,
				title:'文件上传', 
				modal  : true,
				items:[fileForm],
				buttonAlign:'center',
				buttons:[{
					text: '确定',
					handler: function(){
						fileForm.getForm().submit({
							waitTitle: 'Please waiting...',
							waitMsg: 'Upload data...',
							success: function(form, action){
								if(action.result.success==1||action.result.success=="1"){
									try{
										var ftree = viewport.items.get(0);
										var node = ftree.getSelectionModel().getSelectedNode();
										var pnode = node.parentNode;
										ftree.loader.load(node.parentNode,function(){
											pnode.expand();
											win.hide();
										})
									}catch(e){
										win.hide();
									}
								}else{
									alert("上传失败")
								}
							},
							failure: function(form, action){
								Ext.Msg.show({
									title: '提示',
									msg: action.result.msg,
									icon: Ext.Msg.ERROR,
									buttons: Ext.Msg.OK
								});
							}
						})
					}
				},{
					text:'取消',
					handler:function(){
						win.hide();
					}
				}]
			})
			win.show();
		}
		function editFile(downUrl){
			Ext.Ajax.request({
				url : BASE_PATH+"PCBusiness/filesrc/action.jsp",
				params : {
					ac : "get",
					fpath:downUrl
				},
				method : "POST",
				success : function(response, params) {
					var w = 800;
					var h=600;
					if(document.body){
						w = document.body.clientWidth-50;
						h = document.body.clientHeight-50;
					}
					var win = new Ext.Window({
						layout:'fit',
						width:w,modal :true,
						height:h,
						html:'<textarea id="TextArea" style="width:100%;height:100%;">'+response.responseText+'</textarea>',
						buttonAlign:'center',
						buttons:[{
							text:'保存',
							handler:function(){
								var bak=0;
								Ext.Msg.confirm('提示','是否备份文件?',function(txt){
									if(txt=="yes") bak=1;
									Ext.Ajax.request({
										url : BASE_PATH+"PCBusiness/filesrc/action.jsp",
										params : {
											ac : "save",
											fpath:downUrl,
											bak:bak,
											html:Ext.getDom("TextArea").value
										},
										method : "POST",
										success : function(response, params) {
											Ext.Msg.alert("提示","保存成功!");
										},
										failure : function(){
											Ext.Msg.alert("提示","保存失败!");
										}
									});	
								})
							}
						},{
							text:'取消',
							handler:function(){
								win.hide();
							}
						}]
					});
					win.show();
					TextAreaTab.Register(Ext.getDom("TextArea"));
				},
				failure : function(){
					alert("文件读取失败!")
				}
			});	
		}
		function openLink(linkUrl){
			window.open(linkUrl,'_blank')
		}
	</script>
</html>