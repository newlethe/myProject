package com.sgepit.frame.datastructure;

import net.sf.json.JSONObject;
/**
 * ColumnTreeNode 用于构建Ext.tree.ColumnTree的节点数据
 * 
 * @author xjdawu
 * @since 2008.4.8
 */
public class ColumnTreeNode {
	private TreeNode treenode;
	
	private JSONObject columns;
	
	private String uiProvider = "col";
	
	public ColumnTreeNode(){
		
	}
	
	public ColumnTreeNode(TreeNode treenode){
		setTreenode(treenode);
	}
	
	public String getUiProvider() {
		return uiProvider;
	}
	public void setUiProvider(String uiProvider) {
		this.uiProvider = uiProvider;
	}

	public TreeNode getTreenode() {
		return treenode;
	}
	public void setTreenode(TreeNode treenode) {
		this.treenode = treenode;
	}
	public JSONObject getColumns() {
		return columns;
	}

	public void setColumns(JSONObject columns) {
		this.columns = columns;
	}
	
}
