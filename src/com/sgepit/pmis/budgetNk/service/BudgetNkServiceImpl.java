package com.sgepit.pmis.budgetNk.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;

public class BudgetNkServiceImpl implements BudgetNkService {

	private BudgetStructureService budgetStructureService;
	private BudgetMoneyAppNkService budgetMoneyAppNkService;
	private BudgetChangeAppNkService budgetChangeAppNkService;
	private BudgetPayAppNkService budgetPayAppNkService;
	private BudgetClaAppNkService budgetClaAppNkService;
	private BudgetBreakAppNkService budgetBreakAppNkService;

	public void setBudgetBreakAppNkService(
			BudgetBreakAppNkService budgetBreakAppNkService) {
		this.budgetBreakAppNkService = budgetBreakAppNkService;
	}

	public void setBudgetClaAppNkService(BudgetClaAppNkService budgetClaAppNkService) {
		this.budgetClaAppNkService = budgetClaAppNkService;
	}

	public void setBudgetPayAppNkService(BudgetPayAppNkService budgetPayAppNkService) {
		this.budgetPayAppNkService = budgetPayAppNkService;
	}

	public void setBudgetChangeAppNkService(
			BudgetChangeAppNkService budgetChangeAppNkService) {
		this.budgetChangeAppNkService = budgetChangeAppNkService;
	}

	public BudgetStructureService getBudgetStructureService() {
		return budgetStructureService;
	}

	public void setBudgetStructureService(
			BudgetStructureService budgetStructureService) {
		this.budgetStructureService = budgetStructureService;
	}

	public BudgetMoneyAppNkService getBudgetMoneyAppNkService() {
		return budgetMoneyAppNkService;
	}

	public void setBudgetMoneyAppNkService(
			BudgetMoneyAppNkService budgetMoneyAppNkService) {
		this.budgetMoneyAppNkService = budgetMoneyAppNkService;
	}

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		String pid = "";
		if ( params.get("pid") != null ){
			pid = ((String[])params.get("pid"))[0];
		}
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();

		if (treeName.equalsIgnoreCase("BudgetInfoTree")) { // 概算结构树
			list = budgetStructureService.getbudgetNkTree(parentId, pid);
			return list;
		}

		if (treeName.equalsIgnoreCase("BudgetMoneyAppTree")) { //合同金额分摊
			String conId = ((String[]) params.get("conid"))[0];
			// String conmoney = ((String[]) params.get("conmoney"))[0];
			list = budgetMoneyAppNkService.getBdgMoneyTree(parentId, conId);
			return list;
		}

		if (treeName.equalsIgnoreCase("BudgetSelectTree")) { //为合同金额分摊选择概算
			String conId = ((String[]) params.get("conid"))[0];
			list = budgetMoneyAppNkService.getBudgetNkSelectTree(parentId, pid,
					conId);
			return list;
		}

		if (treeName.equalsIgnoreCase("BudgetMoneyAppSelectTree")) { //为变更，付款，索赔，违约分摊选择概算
			String conid = ((String[]) params.get("conid"))[0];
			String typeName= ((String[]) params.get("type"))[0];
			String typeId = ((String[]) params.get("typeid"))[0];
			list = budgetMoneyAppNkService.getBudgetMoneyAppSelectTree(
					parentId, conid, typeName, typeId);
			return list;
		}

		if (treeName.equalsIgnoreCase("BudgetChangeTree")) { //变更分摊信息树
			String conId = ((String[]) params.get("conid"))[0];
			String chaid = ((String[]) params.get("chaid"))[0];
			list = budgetChangeAppNkService.getBdgChangeAppTree(parentId,
					conId, chaid);
			return list;
		}
		
		if (treeName.equalsIgnoreCase("BudgetPayTree")) { //付款分摊信息树
			String conId = ((String[]) params.get("conid"))[0];
			String payAppNo = ((String[]) params.get("payappno"))[0];
			list = budgetPayAppNkService.getBdgPayTree(parentId, conId, payAppNo);
			return list;
		}
		
		if ( treeName.equalsIgnoreCase("BudgetClaimTree") ){ //索赔分摊树
			String conId = ((String[]) params.get("conid"))[0];
			String claid = ((String[]) params.get("claid"))[0];
			list = budgetClaAppNkService.getBdgClaAppTree(parentId, conId, claid);
			return list;
		}
		
		if ( treeName.equalsIgnoreCase("BudgetBreakTree") ){ //违约分摊树
			String conId = ((String[]) params.get("conid"))[0];
			String breid = ((String[]) params.get("breid"))[0];
			list = budgetBreakAppNkService.getBdgBreakAppTree(parentId, conId, breid);
			return list;
		}

		return list;
	}

}
