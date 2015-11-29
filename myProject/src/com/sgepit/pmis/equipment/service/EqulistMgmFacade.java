package com.sgepit.pmis.equipment.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.equipment.hbm.EquList;
import com.sgepit.pmis.equipment.hbm.EquListQc;

public interface EqulistMgmFacade {

	public List<ColumnTreeNode> equlistTree(String parentId) throws BusinessException;
	
	/**
	 * 设备清册 
	 * @param parentId 父节点
	 * @param whereStr	其他查询条件
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> equlistTreeQc(String parentId, String whereStr) throws BusinessException;
	
	public List<ColumnTreeNode> getEqulistTree(String parentId, String dhId,String ggid) throws BusinessException;
	public List<ColumnTreeNode> getEqulistTree2(String parentId,String kxuuid,String kxsbid) throws BusinessException;
	//处理excel数据、供控制层反射调用
	public void saveHandleExcel(EquList equList,Map argments) throws BusinessException;
	//删除子结点
	//int deleteChildNode(String noid);
	
	
	public void saveEqulist(String sbId);
	public void saveEqulistQc(String sbId);
	public int deleteEqulist(String[] sbIds);
	public int deleteEqulistQc(String[] sbIds);
	
	public String getIndexId(String sbId);
	public void saveSelectEqu(String conid, String ggid, String[] sbIds);
	public void addContract(String sbId, String name);
	public void moveCon(String conid, String typeName);
	public void deleteConAll(String  conid);
	public String getparent(String conid);
	public String getEquNo(String parentid);
	public void saveSelectEquArr(String conid, String ggid, String[] sbIds,String partB);
	public void saveSelectOpen(String conid, String kxuuid, String[] sbIds,String ggid,String kxsbid);
	public int deleteChildNode(String noid);
	public int addOrUpdate(EquList equlist, String indexid);
	public int dhzs(String id);
	public boolean checkGgXh(String ggxh,String indexid);
	public List<TreeNode> equlistTreeAuto(String parentId,String sbHtFl1Id,String parentType);
	
	public boolean selectSbtoList(String parentid,EquListQc [] listqc,String bdgid,String bdgno);
	public int saveEqulistAndUpdateQc(EquList[] equListArr,String conid);
	public int deleteEqulistSb(String[] sbids, String conid);
}
