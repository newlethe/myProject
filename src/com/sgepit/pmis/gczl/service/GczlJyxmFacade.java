package com.sgepit.pmis.gczl.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.flow.hbm.GczlFlow;
import com.sgepit.frame.flow.hbm.GczlJymb;
import com.sgepit.frame.flow.hbm.GczlJyxm;
import com.sgepit.pmis.gczl.hbm.GczlJyxmApproval;

public interface GczlJyxmFacade {
	List<ColumnTreeNode> gczlJyxmTree(String parentId, String pid) throws BusinessException;
	public boolean isHasChilds(String uids);
	public int addOrUpdate(GczlJyxm bdgInfo);
	public int deleteChildNode(String uids);
	
	/*
	 * 保存模板
	 */
	public String saveOrUpdateWord(GczlJymb jymb);
	public int deleteWordById(String uids);
	public void setDefaultById(String uids,String nodeUids, String tabs);
	public void saveFlow(String[] uids, String userid, String jyxmUids);
	public int deleteFlowById(String uids);
	public boolean getFlowByFileId(String fileid);
	public void setWordDisableById(String uids);
	public boolean isHasWordOrFlow(String uids);
	public void setDisableWordById(String uids);	
	
	public String isHaveTreeRoot(String pid, String root);
	/*
	 * 检验模块记录保存
	 * @param GczlJyxmApproval
	 * author:shangtw
	 * */
	public String saveOrUpdateApproval(GczlJyxmApproval gczlJyxmApproval);
	/**
	 * 删除审批信息
	 * @param uids
	 * @author shangtw
	 */	
	public int deleteWordApprovalById(String uids);
	
	/**
	 * 得到审批组合信息
	 * @param approvaluids
	 * @param mbuids
	 * @author shangtw
	 */	
	public GczlJyxmApproval findByDoubleId(String approvaluids,String mbuids);
	
	/**
	 * 上报审批信息
	 * @param approvaluids
	 * @param userid
	 * @author shangtw
	 */	
	
	public String uploadApproval(String approvalUids,String userid,String newStatus,String approvalResult);
	
}
