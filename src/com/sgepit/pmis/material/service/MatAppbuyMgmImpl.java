package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.material.hbm.MatAppbuyApply;
import com.sgepit.pmis.material.hbm.MatAppbuyMaterial;
import com.sgepit.pmis.material.hbm.MatFrame;


public class MatAppbuyMgmImpl extends BaseMgmImpl implements MatAppbuyMgmFacade {

	private EquipmentDAO equipmentDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static MatAppbuyMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (MatAppbuyMgmImpl) ctx.getBean("appBuyMgm");
	}
	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}
	
	public void deleteMaterial(MatAppbuyMaterial mcApp) throws SQLException,
			BusinessException {
		this.equipmentDAO.delete(mcApp);
		
	}
	public void insertMaterial(MatAppbuyMaterial mcApp) throws SQLException,
			BusinessException {
		this.equipmentDAO.insert(mcApp);
		
	}
	public void updateMaterialp(MatAppbuyMaterial mcApp) throws SQLException,
			BusinessException {
		this.equipmentDAO.saveOrUpdate(mcApp);
	}
	public void deleteBuy(MatAppbuyMaterial mcApp) throws SQLException,
		BusinessException {
		mcApp.setBuyId(null);
		this.equipmentDAO.saveOrUpdate(mcApp);
	}
	public void deleteForm(MatAppbuyMaterial mcApp) throws SQLException,
		BusinessException {
		mcApp.setFormId(null);
		this.equipmentDAO.saveOrUpdate(mcApp);
	}
	public void insertBuy(MatAppbuyMaterial mcApp) throws SQLException,
		BusinessException {
		this.equipmentDAO.insert(mcApp);
	}
	public void insertForm(MatAppbuyMaterial mcApp) throws SQLException,
		BusinessException {
		this.equipmentDAO.insert(mcApp);
	
	}
	public void updateBuy(MatAppbuyMaterial mcApp) throws SQLException,
		BusinessException {
		this.equipmentDAO.saveOrUpdate(mcApp);
	
	}
	public void updateForm(MatAppbuyMaterial mcApp) throws SQLException,
		BusinessException {
		this.equipmentDAO.saveOrUpdate(mcApp);
	
	}
	
	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	
	// 得到所有物资
	public List<ColumnTreeNode> getMatFrameTree(String parentId, String appid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent='"+ parent +"'";
		List<MatFrame> objects = this.equipmentDAO.findByWhere(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), str);
		Iterator<MatFrame> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			MatFrame temp = (MatFrame) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getUuid());			// treenode.id
			n.setText(temp.getCatName());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("task");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode

			JSONObject jo = JSONObject.fromObject(temp);
//			List lt = this.equipmentDAO.findByWhere(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_MATERIAL),
//					"conid = '" + contId + "' and matId = '"+ temp.getUuid() + "'");
//			if (leaf == 1 && lt != null && lt.size() > 0) {
//				jo.accumulate("ischeck", "true");
//			} else {
				jo.accumulate("ischeck", "false");	// 扩展的属性
//			}
			cn.setColumns(jo);						// ColumnTreeNode.columns
			list.add(cn);
		}
		
		return list;
	}
	
	// 选择申请的物资(材料清单)
	public void saveMatFrameTree(String appid, String[] ids) {
		String parentBean = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_APP);
		MatAppbuyApply parent = (MatAppbuyApply) this.equipmentDAO.findById(parentBean, appid);
		String parentNo = parent.getAppNo()==null?"":parent.getAppNo();
		for (int i = 0; i < ids.length; i++) {
			MatAppbuyMaterial mam = new MatAppbuyMaterial();
			MatFrame mf = (MatFrame) this.equipmentDAO.findById(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), ids[i]);
			String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_MATERIAL);
			String where = " appid ='" + appid + "' and matId ='" + ids[i] + "'";
			List list = (List)this.equipmentDAO.findByWhere(beanName, where);
			if (list.size() > 0){
				continue;
			}
			mam.setMatId(mf.getUuid());
			mam.setCatNo(mf.getCatNo());
			mam.setCatName(mf.getCatName());
			mam.setEnName(mf.getEnName());
			mam.setSpec(mf.getSpec());
			mam.setUnit(mf.getUnit());
			mam.setPrice(mf.getPrice());
			mam.setMaterial(mf.getMaterial());
			mam.setWarehouse(mf.getWarehouse());
			mam.setWareNo(mf.getWareNo());
			mam.setAppid(appid);
			mam.setAppNo(parentNo);
			equipmentDAO.insert(mam);
		}
	}
	
	// 选择需要采购的物资
	public void selectBuyMat(String buyId, String[] matIds){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_MATERIAL);
		for (int i=0; i<matIds.length; i++){
			MatAppbuyMaterial mam = (MatAppbuyMaterial)this.equipmentDAO.findById(beanName, matIds[i]);
			mam.setBuyId(buyId);
			mam.setIsBuy("1");
			this.equipmentDAO.saveOrUpdate(mam);
		}
	}
	
	// 选择形成采购单的物资
	public void selectFormMat(String formId, String[] matIds){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_MATERIAL);
		for (int i=0; i<matIds.length; i++){
			MatAppbuyMaterial mam = (MatAppbuyMaterial)this.equipmentDAO.findById(beanName, matIds[i]);
			mam.setFormId(formId);
			this.equipmentDAO.saveOrUpdate(mam);
		}
	}
	
	//更新物质申请计划的申请总价
	public void updateSumPrice(String appid){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_APP);
		String subBean = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_MATERIAL);
		MatAppbuyApply matapp = (MatAppbuyApply) this.equipmentDAO.findById(beanName, appid);
		List list = this.equipmentDAO.findByProperty(subBean, "appid", appid);
		Double sumMoney = new Double(0);
		Iterator<MatAppbuyMaterial> itr = list.iterator();
		while(itr.hasNext()){
			MatAppbuyMaterial material = itr.next();
			sumMoney += material.getSum()==null?0:material.getSum();
		}
		matapp.setAppMoney(sumMoney);
		this.equipmentDAO.saveOrUpdate(matapp);
	}
}

