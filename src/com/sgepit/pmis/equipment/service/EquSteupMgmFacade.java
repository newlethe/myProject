package com.sgepit.pmis.equipment.service;

import java.util.List;

import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.equipment.hbm.EquSbaz;

public interface EquSteupMgmFacade {
	/**
	 * 设备合同及出库单树
	 * @param parentId
	 * @param sbHtFl1Id
	 * @param parentType
	 * @return
	 */
	public List<TreeNode> htAndOutTree(String parentId,String sbHtFl1Id,String parentType);

	public String saveOrUpdateSbaz(EquSbaz sbaz);
}
