package com.sgepit.pmis.budget.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.investmentComp.service.ProAcmMgmFacade;

public class BdgMgmImpl extends BaseMgmImpl implements BdgMgmFacade {
	
	private BaseDAO baseDao;
	/*
	 * private BdgInfoMgmFacade bdgInfoMgm; private BdgMoneyMgmFacade
	 * bdgMoneyMgm; private BdgChangeMgmFacade bdgChangeMgm; private
	 * BdgPayMgmFacade bdgPayMgm; private BdgBalMgmFacade bdgBalMgm; private
	 * BdgBreachMgmFacade bdgBreachMgm; private BdgComopensateMgmFacade
	 * bdgCompensateMgm; private othCompletionMgmFacade othCompletionMgm;
	 * private ProAcmMgmFacade proAcmMgm;
	 */

	public void setBaseDao(BaseDAO baseDao) {
		this.baseDao = baseDao;
	}

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static BdgMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (BdgMgmImpl) ctx.getBean("bdgMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------

	/*
	 * public void setBdgChangeMgm(BdgChangeMgmImpl bdgChangeMgm) {
	 * this.bdgChangeMgm = bdgChangeMgm; }
	 * 
	 * public void setBdgPayMgm(BdgPayMgmImpl bdgPayMgm) { this.bdgPayMgm =
	 * bdgPayMgm; }
	 * 
	 * public void setBdgBalMgm(BdgBalMgmImpl bdgBalMgm) { this.bdgBalMgm =
	 * bdgBalMgm; }
	 * 
	 * public void setBdgBreachMgm(BdgBreachMgmImpl bdgBreachMgm) {
	 * this.bdgBreachMgm = bdgBreachMgm; }
	 * 
	 * public void setBdgCompensateMgm(BdgCompensateMgmImpl bdgCompensateMgm) {
	 * this.bdgCompensateMgm = bdgCompensateMgm; }
	 * 
	 * 
	 * public void setBdgInfoMgm(BdgInfoMgmFacade bdgInfoMgm) { this.bdgInfoMgm
	 * = bdgInfoMgm; }
	 * 
	 * public void setBdgMoneyMgm(BdgMoneyMgmFacade bdgMoneyMgm) {
	 * this.bdgMoneyMgm = bdgMoneyMgm; }
	 */

	/*
	 * public void setOthCompletionMgm(othCompletionMgmFacade othCompletionMgm)
	 * { this.othCompletionMgm = othCompletionMgm; }
	 * 
	 * public void setProAcmMgm(ProAcmMgmFacade proAcmMgm) { this.proAcmMgm =
	 * proAcmMgm; }
	 */
	// -------------------------------------------------------------------------
	// user methods
	// -------------------------------------------------------------------------

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String pid = "";
		if ( params.get("pid") != null){
			pid = ((String[]) params.get("pid"))[0];
		}
		
		BdgInfoMgmFacade bdgInfoMgm = (BdgInfoMgmFacade) Constant.wact
				.getBean("bdgInfoMgm");
		if (treeName.equalsIgnoreCase("BudgetInfoTree")) { // 概算结构树
			list = bdgInfoMgm.BdgInfoTree(parentId, pid);
			return list;
		}
		if (treeName.equalsIgnoreCase("BudgetInfoTreeQuery")) { // 概算查询结构树
			list = bdgInfoMgm.BdgInfoTreeQuery(parentId, pid);
			return list;
		}
		if (treeName.equalsIgnoreCase("BudgetCheckTree")) { // 平衡检查概算树
			list = bdgInfoMgm.BdgCheckTree(parentId, pid);
			return list;
		}

		BdgMoneyMgmFacade bdgMoneyMgm = (BdgMoneyMgmFacade) Constant.wact
				.getBean("bdgMoneyMgm");
		if (treeName.equalsIgnoreCase("BudgetChoosenTree")) { // 选择概算结构树组成合同分摊树
			String contId = ((String[]) params.get("conid"))[0];
			list = bdgMoneyMgm.getBudgetTree(parentId, pid,contId);
			return list;
		}

		if (treeName.equalsIgnoreCase("bdgMoneyTree")) { // 获得合同分摊树
			String contId = ((String[]) params.get("conid"))[0];
			//String conmoney = ((String[]) params.get("conmoney"))[0];
			list = bdgMoneyMgm.bdgMoneyTree(parentId, contId);
			return list;
		}
		
		if (treeName.equalsIgnoreCase("bdgMoneyProjectTree")) { // 获得合同工程量分摊树
			String contId = ((String[]) params.get("conid"))[0];
			//String conmoney = ((String[]) params.get("conmoney"))[0];
			list = bdgMoneyMgm.bdgMoneyProjectTree(parentId, contId);
			return list;
		}		
		
		if (treeName.equalsIgnoreCase("BdgMoneyChoosenTree")) { // 获得合同分摊树选择树
			String contId = ((String[]) params.get("conid"))[0];
			String type = ((String[]) params.get("type"))[0];
			String typeId = ((String[]) params.get("typeId"))[0];
			list = bdgMoneyMgm.getBdgMoneyTree(parentId, contId, type, typeId);
			return list;
		}
		BdgChangeMgmFacade bdgChangeMgm = (BdgChangeMgmFacade) Constant.wact
				.getBean("bdgChangeMgm");
		if (treeName.equalsIgnoreCase("bdgChangeTree")) { // 获得变更分摊树
			String contId = ((String[]) params.get("conid"))[0];
			String chaid = ((String[]) params.get("chaid"))[0];
			list = bdgChangeMgm.bdgChangeTree(parentId, contId, chaid);
			return list;
		}
		if (treeName.equalsIgnoreCase("bdgProjectChangeTree")) { // 获得工程量变更分摊树
			String contId = ((String[]) params.get("conid"))[0];
			String chaid = ((String[]) params.get("chaid"))[0];
			list = bdgChangeMgm.bdgProjectChangeTree(parentId, contId, chaid);
			return list;
		}		
		
		BdgPayMgmFacade bdgPayMgm = (BdgPayMgmFacade) Constant.wact
				.getBean("bdgPayMgm");
		if (treeName.equalsIgnoreCase("bdgPayTree")) { // 获得付款分摊树
			String contId = ((String[]) params.get("conid"))[0];
			String payid = ((String[]) params.get("payid"))[0];
			list = bdgPayMgm.bdgPayTree(parentId, contId, payid);
			return list;
		}

		BdgBalMgmFacade bdgBalMgm = (BdgBalMgmFacade) Constant.wact
				.getBean("bdgBalMgm");
		if (treeName.equalsIgnoreCase("bdgBalTree")) { // 获得结算分摊树
			String contId = ((String[]) params.get("conid"))[0];
			String balid = ((String[]) params.get("balid"))[0];
			list = bdgBalMgm.bdgBalTree(parentId, contId, balid);
			return list;
		}

		BdgBreachMgmFacade bdgBreachMgm = (BdgBreachMgmFacade) Constant.wact
				.getBean("bdgBreachMgm");
		if (treeName.equalsIgnoreCase("bdgBreachTree")) { // 获得违约分摊树
			String conid = ((String[]) params.get("conid"))[0];
			String breid = ((String[]) params.get("breid"))[0];
			list = bdgBreachMgm.bgdgBreachTree(parentId, conid, breid);
			return list;
		}

		BdgComopensateMgmFacade bdgCompensateMgm = (BdgComopensateMgmFacade) Constant.wact
				.getBean("bdgCompensateMgm");
		if (treeName.equalsIgnoreCase("bdgCompensateTree")) { // 获得索赔分摊树
			String conid = ((String[]) params.get("conid"))[0];
			String claid = ((String[]) params.get("claid"))[0];
			list = bdgCompensateMgm.bdgCompensateTree(parentId, conid, claid);
			return list;
		}
		OthCompletionMgmFacade othCompletionMgm = (OthCompletionMgmFacade) Constant.wact
				.getBean("othCompletionMgm");
		if (treeName.equalsIgnoreCase("getOtherTree")) {
			String id = ((String[]) params.get("otherId"))[0];
			list = othCompletionMgm.getOtherTree(parentId, id);
			return list;
		}

		if (treeName.equalsIgnoreCase("otherCompTree")) {
			String id = ((String[]) params.get("otherId"))[0];
			list = othCompletionMgm.otherCompTree(parentId, id);
			return list;
		}
		ProAcmMgmFacade proAcmMgm = (ProAcmMgmFacade) Constant.wact
				.getBean("proAcmMgm");
		if (treeName.equalsIgnoreCase("ProAcmTree")) {
			String conid = ((String[]) params.get("conid"))[0];
			String monId = ((String[]) params.get("monId"))[0];
			list = proAcmMgm.proAcmTree(parentId, conid, monId);
			return list;
		}
		return list;
	}

}
