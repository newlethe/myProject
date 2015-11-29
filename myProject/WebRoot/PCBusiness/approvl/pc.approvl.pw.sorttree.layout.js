Ext.onReady(function() {
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [treePanel, formPanel]
					});
			formPanel.collapse();
			treePanel.getSelectionModel().select(root);
			// 使用键盘上的Delete键弹出删除提示
			keymap = new Ext.KeyMap(treePanel.id, {
						key : Ext.EventObject.DELETE,
						stopEvent : true,
						fn : function() {
							if (treePanel.getSelectionModel().getSelectedNode()) {
								delHandler();
							}
						}
					});
		})
