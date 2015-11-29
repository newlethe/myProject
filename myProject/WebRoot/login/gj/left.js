var west1, p;
var viewport;
var currentMode; // OA menu
Ext.onReady(function() {

			west1 = new WestPanel({// define in FeedPanel.js
	
				collapseMode : 'mini',
				split : true,
				width : 200,
				minSize : 199,
				maxSize : 201,
				border : false
			});

			p = new Ext.Panel({
						//collapsible : true,
				
						contentEl : "naviContnet",
						width : 215
					});

		});

function openFun(rockId) {
	//显示菜单窗口，覆盖掉背景图标
	if (!viewport) {
		viewport = new Ext.Viewport({
						layout : 'fit',
						items : [west1]
					});
	}

	west1.expand();
	var funRockPanel = (west1.findById(rockId));
	if (funRockPanel) {
		funRockPanel.expand();
	}

}

