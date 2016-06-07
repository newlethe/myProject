package com.sgepit.frame.flow.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.datastructure.TreeNode;

public interface FlwZlypMgmFacade {
	/**
	 * 验评流程的获取，返回格式是JSONString
	 * 
	 * 流程接口
	 */
	public abstract String getZlypFlwTree(String pid);
	/**
	 * 验评分类树的获取，返回格式是JSONString
	 * 
	 * 质量验评接口
	 */
	public abstract String getZlypItemTree();
	/**
	 * 由验评分类id获取子分类
	 * @param xmbh
	 * @return
	 */
	public abstract List<TreeNode> getZlypNodeById(String id);
	/**
	 * 具体验评分类下的流程列表，返回格式是List
	 * 
	 * 质量验评接口
	 */
	public abstract List getFlwListByXmbh(String xmbh);
	/**
	 * 具体验评分类下的模板列表，返回格式是List
	 * 
	 * 质量验评接口
	 */
	public abstract List getModelListByXmbh(String xmbh);
	/**
	 * 判断具体验评分类下是否有运转中的流程，返回类型 Boolean
	 * 
	 * 流程接口
	 */
	public abstract boolean isHaveFlwingByXmbh(String xmbh);
	/**
	 * 根据模板ID判断该模板是否使用，返回类型 Boolean
	 * 
	 * 流程接口
	 */
	public abstract boolean isHaveFlwInsByModelid(String fileid);
	/**
	 * 设置或取消流程的验评属性
	 * @param flowid
	 * @param isyp
	 * @return
	 */
	public abstract boolean setIsypByFlowid(String flowid, String isyp);
}
