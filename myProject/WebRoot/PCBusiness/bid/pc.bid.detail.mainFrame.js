// 招标类型array
var bidApplySelectBar;
// 招标内容array
var zbContentArr = new Array();
var zbContentStore;
var zbContentCombo;
var curZbStat = new Object();
var doExchange = DEPLOY_UNITTYPE != '0';
var fileWin;
var firstChildId = null; //第一个子页面

//全局变量, 招标项目编号和招标内容编号初始化为"", 子页面的下拉框选择时间会修改该变量
Ext.onReady(function() {
	
	// 招标项目下拉框
	var zbApplyArr = new Array();

	DWREngine.setAsync(false);
	PCBidDWR.getBidApplyForCurrentPrj(outFilter,currentPid, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].zbName);
					temp.push(list[i].zbType)
					zbApplyArr.push(temp);
				}
			});
			
	DWREngine.setAsync(true);
	
	//招标项目数据源
	zbApplyStore = new Ext.data.SimpleStore({
				fields : ['k', 'v', 't'],
				data : zbApplyArr
			});
			
	//招标内容数据源		
	zbContentStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : []

			});

	zbApplyCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标项目',
				mode : 'local',
				lazyRender : true,
				store : zbApplyStore,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				name : 'zbApplyId'
			});
			
	// 选择已通过预审单位
	zbContentCombo = new Ext.form.ComboBox({
				triggerAction : 'all',emptyText : '请选择招标内容',
				mode : 'local',
				store : zbContentStore,
				lazyRender : true,
				valueField : 'k',
				displayField : 'v',
				editable : false
			});

	zbApplyCombo.on('select', function(combo, record, index) {
		zbApplyComboSelect(record);
	});
				
	function zbApplyComboSelect(record){
		loadZbContentCombo(record.data.k);
	}
	
	zbContentCombo.on('select', function(combo,record,index){
		var contentUids = record.data.k;
		//reloadBidDetail(contentUids);
		//loadProgressForm();
		
	});
	
//	bidApplySelectBar = new Ext.Toolbar({
//					items : ['招标项目: ', zbApplyCombo, '招标内容', zbContentCombo]
//
//				});
	
	menuTreePanel = new Ext.tree.TreePanel({
		region : 'west',
		width : 180,
		rootVisible : false,
		autoScroll : true, 
		loader : new Ext.tree.TreeLoader(),
		root : new Ext.tree.AsyncTreeNode({
			id : 'bid-procedure',
			text : '详细过程',
			leaf : false,
			children : [
{
						id:'TbUnitInfo',
						text : '投标人报名信息及预审结果',
						href : "PCBusiness/bid/pc.bid.applicant.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						id:'TbSendZbDoc',
						text : '发售招标文件',
						href : "PCBusiness/bid/pc.bid.send.zbdoc.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, 
//						{
//						text : '招标文件澄清',
//						href : "PCBusiness/bid/pc.bid.clarificate.zbdoc.jsp?pid="
//								+ currentPid,
//						hrefTarget : "bidDetailFrame",
//						leaf : true
//					}, 
					 {
						id:'AcceptTbdoc',
						text : '接收投标文件及投标保证金',
						href : "PCBusiness/bid/pc.bid.accept.tbdoc.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					},	{
						id:'AssessCouncil',
						text : '组建评标委员会',
						href : "PCBusiness/bid/pc.bid.assess.council.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						id:'OpenBidding',
						text : '开标',
						href : "PCBusiness/bid/pc.bid.open.bidding.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						id:'BidAssess',
						text : '评标及评标结果公示',
						href : "PCBusiness/bid/pc.bid.assess.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						id:'issue',
						text : '发放中标通知书',
						href : "PCBusiness/bid/pc.bid.issue.win.doc.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						id:'track',
						text : '合同签订情况跟踪',
						href : "PCBusiness/bid/pc.bid.contract.track.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}]
		})
	});

	
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [menuTreePanel,{
					region : 'center',
					xtype : 'panel',
					html : '<iframe name="bidDetailFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
				}]
			});
			
	if(dydaView){
	//如果某个子页面没有动态数据, 删除该子页面
		DWREngine.setAsync(false);
			PCBidDWR.filterBidDetailTreeNode(outFilter,function(list){
				var rootNode = menuTreePanel.getRootNode();
				var childNodes = rootNode.childNodes;
				for(var i=0; i<childNodes.length; i++)
				{
					if(list.toString().indexOf(childNodes[i].id)==-1)
					{
						rootNode.removeChild(childNodes[i]);
//						i = 0;
						i--;
					}
				}
				firstChildId = childNodes[0].id;
			});
		DWREngine.setAsync(true);
	    }		
	var firstChild = (firstChildId==null)?menuTreePanel.getRootNode().firstChild : menuTreePanel.getNodeById(firstChildId);
	loadNode(firstChild);
});

function loadNode(node){
	node.select();
	window.frames['bidDetailFrame'].location.href = CONTEXT_PATH
			+ '/' + node.attributes.href;
}

function loadZbContentCombo(zbUids){
	zbContentArr = new Array();
			PCBidDWR.getContentForCurrentApply(outFilter,zbUids, function(list){
				for ( var i = 0; i < list.length; i++ ){
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].contentes);
					zbContentArr.push(temp);
				}
				zbContentStore.loadData(zbContentArr)
			});
}



function reloadBidDetail(contentId) {
	bidContentId = contentId;
	plantInt.contentUids = contentId;
	if (contentId != null && contentId != '')
		applicantDs.reload();
}

function showUploadWin(businessType, editable, businessId, winTitle,beanName) {

	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId+"&beanName="+beanName;
	fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
}

/**
 * 显示合同详细信息窗口（合同跟踪中使用）
 * 
 * @param {}
 *            conid
 */
function showContractWindow(conid) {
	var url = BASE_PATH
			+ 'Business/contract/cont.generalInfo.view.jsp?windowMode=1&conid='
			+ conid;
	var contractWin = new Ext.Window({
		header : false,
		layout : 'fit',
		width : 900,
		height : 400,
		title : "合同详细信息",
		// constrain: true,
		modal : false,
		maximizable : true,
		// minimizable: true,
		closeAction : 'hide',
		plain : true,
		items : [{
			html : '<iframe name="contractDetailFrame" src="'
					+ url
					+ '" frameborder=0 style="width:100%;height:100%;"></iframe>'
		}]
	});

	contractWin.show();
}
function uploadSuccess(fileLsh, businessId, businessType, blobTable, beanName) {
	if (doExchange) {
		var fileIdArr = new Array();
		fileIdArr.push(fileLsh);
		//参数说明：业务bean名称，数据主键数据，流水号数组，发送单位，接收单位，业务说明，是否立即发送
		PCBidDWR.excDataAttachments(beanName,businessId,fileIdArr,currentPid,defaultOrgRootID,"招标投标管理【附件上传】",false,
			function(flag){
		})

	}
}

function deleteSuccess(fidArr,businessId, businessType, blobTable, beanName) {
	if (doExchange) {
		//参数说明：业务bean名称，数据主键数据，流水号数组，发送单位，接收单位，业务说明，是否立即发送
		PCBidDWR.excDataAttachments(beanName,businessId,fidArr,currentPid,defaultOrgRootID,"招标投标管理【附件删除】",false,
			function(flag){
		
		})
	}
}

