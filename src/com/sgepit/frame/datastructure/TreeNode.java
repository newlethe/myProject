package com.sgepit.frame.datastructure;

/**
 * TreeNode 参照Ext.tree.TreeNode的构造参数 
 * 
 * @author xjdawu
 * @since 2007.11.30
 */
public class TreeNode {
	/*
	 * 节点文字
	 */
	private String text;
	
	private String nodeType;
	
	/*
	 * 节点id，DOM中使用
	 */
	private String id;

	/*
	 * 是否叶子节点
	 */
	private boolean leaf;
	
	/*
	 * 节点css样式名称，页面中�?定义
	 */
	private String cls;
	
	/*
	 * 节点图标css样式名称，页面中�?定义
	 */
	private String iconCls;
	
	/*
	 * 描述，可用做tip提示文字或其他用�?
	 */
	private String description;
	
	/*
	 * 节点超链接
	 */
	private String href;
	//是否有复选框
	private String ifcheck;
	
	public TreeNode(){
		
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public boolean getLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	public String getCls() {
		return cls;
	}
	public void setCls(String cls) {
		this.cls = cls;
	}
	public String getIconCls() {
		return iconCls;
	}
	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getHref() {
		return href;
	}
	public void setHref(String href) {
		this.href = href;
	}
	public String getNodeType() {
		return nodeType;
	}
	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}
	public String getIfcheck() {
		return (ifcheck==null?"none":ifcheck);
	}
	public void setIfcheck(String ifcheck) {
		this.ifcheck = ifcheck;
	}
	
	
}
