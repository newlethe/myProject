var rootText = "工程概算";
Ext.onReady(function(){
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : '0'
    })
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"bdgMoneyTree", 
			businessName:"bdgMgm", 
			conid: parent.selectConId, 
			conmoney: "",
			parent:0
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelNew = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        iconCls: 'icon-by-category',
        region: 'west',
        width: 270,
        minSize: 275,
        maxSize: 600,
        frame: false,
        header: false,
        tbar:[
			'<font color=#15428b><b>&nbsp;合同分摊概算</b></font>','-',
			{
                iconCls: 'icon-expand-all',
				tooltip: '展开概算树',
                handler: function(){ rootNew.expand(true); }
            }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: '收起概算树',
                handler: function(){ rootNew.collapse(true); }
            },'->'
		],
        border: true,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            //header: '概算名称',
            width: 270,				//隐藏字段
            dataIndex: 'bdgname'
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: false
	});
	treePanelNew.on('beforeload', function(node) {
		bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.conid = parent.selectConId;
		baseParams.conmoney = "" ;
		baseParams.parent = bdgid;	
	})
	treePanelNew.on("beforeclick",function(node){
		if(ds.getModifiedRecords().length>0){
			if(confirm("有修改的数据未进行保存，请确认是否进行保存")){
				gridSave();
				return false;
			}
		}
		return true;
	})
	treePanelNew.on("click",function(node){
		
		investmentPlanService.getFullBdgPath(parent.selectConId,node.id,function(dat){
			selectBdgId = dat
			ds.load({params:{start:0,limit: PAGE_SIZE}});
		})
	})
})