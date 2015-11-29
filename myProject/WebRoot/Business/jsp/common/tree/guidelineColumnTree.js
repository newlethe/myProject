var guidelineModelType = 'multiple';
var guideTree;
var zbSeqno = "";
var guidelineNodeUrl = CONTEXT_PATH + "/servlet/GuidelineServlet?ac=tree&treeType=columnTree&treeName=GuidelineTree";
var guideDefaultParentId='d';
var hasCheckBox = 'true';
var guideTreeCollapsible = true;
var guideTreeCollapseMode = 'mini';
var state = '';

Ext.onReady(function(){
	var stateArr = new Array();//有效状态
	var ifpubArr = new Array();//归属类型
	DWREngine.setAsync(false);	
	systemMgm.getCodeValue("有效状态", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			stateArr.push(temp);
		}
	});	
	
	systemMgm.getCodeValue("归属类型", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			ifpubArr.push(temp);
		}
	});	
	DWREngine.setAsync(true);
	root = new Ext.tree.AsyncTreeNode({
        text: '指标',
        id:guideDefaultParentId,
        iconCls: 'form'
    });
    
    var dataUrl = guidelineNodeUrl + "&parentId="+guideDefaultParentId+"&hasCheckBox="+hasCheckBox;
	if(state!=''){
		dataUrl += "&state="+state;
	}
    treeLoader = new Ext.tree.TreeLoader({
		dataUrl: dataUrl,
		requestMethod: "GET",
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	var cm = [
	  {header:'名称',width:document.body.clientWidth-452,dataIndex:'realname'},
	  {header:'编码', width:100,dataIndex:'id'},  
	  {header:'计量单位',width:100,dataIndex:'jldw'},
	  {header:'有效',width:100,dataIndex:'state',renderer:tansState},
	  {header:'指标所属',width:150,dataIndex:'ifpub',renderer:tansIfPub}
    ];
    
	guideTree = new Ext.tree.ColumnTree({
        id: 'guideline_tree',
        iconCls: 'icon-by-category',
        region: 'center',
	    minSize: 275,
	    maxSize: 400,
	    split: true,
	    frame: false,
	    header: false,
	    border: false,
	    lines: true,
	    autoScroll: true,
	    animate: false,
	    tbar: [],
		columns:cm, 
        loader: treeLoader,
        root: root,
        rootVisible: false
	});
	
	guideTree.on('beforeload', function(node) {
		var dataUrl = guidelineNodeUrl + "&parentId="+node.id+"&treeName=GuidelineTree&hasCheckBox="+hasCheckBox
		if(state!=''){
			dataUrl += "&state="+state;
		}
		guideTree.loader.dataUrl = dataUrl;
	})
	
	function tansState(value){
		for(var i=0; i<stateArr.length; i++){
      	 	if (value == stateArr[i][0])
      	 		return stateArr[i][1]
      	 }
	}
	
	function tansIfPub(value){
		for(var i=0; i<ifpubArr.length; i++){
      	 	if (value == ifpubArr[i][0])
      	 		return ifpubArr[i][1]
      	 }
	}
	
});