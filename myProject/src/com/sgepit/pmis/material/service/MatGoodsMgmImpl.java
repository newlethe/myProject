package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.material.hbm.MatAppbuyMaterial;
import com.sgepit.pmis.material.hbm.MatFrame;
import com.sgepit.pmis.material.hbm.MatGoodsChecksub;
import com.sgepit.pmis.material.hbm.MatGoodsInvoicesub;
import com.sgepit.pmis.material.hbm.MatStoreInsub;


public class MatGoodsMgmImpl extends BaseMgmImpl implements MatGoodsMgmFacade {

	private EquipmentDAO equipmentDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static MatGoodsMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (MatGoodsMgmImpl) ctx.getBean("matGoodsMgm");
	}
	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}
	
	public void deleteMatGoods(MatGoodsChecksub matGoods) throws SQLException,BusinessException {
		this.equipmentDAO.delete(matGoods);
		
	}
	public void insertMatGoods(MatGoodsChecksub matGoods) throws SQLException,BusinessException {
		this.equipmentDAO.insert(matGoods);
		
	}
	public void updateMatGoods(MatGoodsChecksub matGoods) throws SQLException,BusinessException {
		this.equipmentDAO.saveOrUpdate(matGoods);
	}
	public void deleteMatInvoice(MatGoodsInvoicesub matGoods)throws SQLException, BusinessException {
		this.equipmentDAO.delete(matGoods);
	
	}
	public void insertMatInvoice(MatGoodsInvoicesub matGoods)throws SQLException, BusinessException {
		this.equipmentDAO.insert(matGoods);
	
	}
	public void updateMatInvoice(MatGoodsInvoicesub matGoods)throws SQLException, BusinessException {
		this.equipmentDAO.saveOrUpdate(matGoods);
	
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
	
	// 选择申到货的物资(树)
	public void saveMatFrameTree(String checkId, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			MatGoodsChecksub mgc = new MatGoodsChecksub();
			MatFrame mf = (MatFrame) this.equipmentDAO.findById(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), ids[i]);
			String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_GOODS_CHECKSUB);
			String where = " checkId ='" + checkId + "' and matid ='" + ids[i] + "'";
			List list = (List)this.equipmentDAO.findByWhere(beanName, where);
			if (list.size() > 0){
				continue;
			}
			mgc.setMatid(mf.getUuid());
			mgc.setCatNo(mf.getCatNo());
			mgc.setCatName(mf.getCatName());
			mgc.setSpec(mf.getSpec());
			mgc.setMaterial(mf.getMaterial());
			mgc.setCheckId(checkId);
			mgc.setIsIn("2");
			equipmentDAO.insert(mgc);
		}
	}
	
	//选择到货的物资(grid)
	public void selectGoodsMat(String checkId, String[] matIds, String formId){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_MATERIAL);
		String bean = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_GOODS_CHECKSUB);
		for (int i=0; i<matIds.length; i++){
			MatAppbuyMaterial mam = (MatAppbuyMaterial)this.equipmentDAO.findById(beanName, matIds[i]);
			MatGoodsChecksub mgc = new MatGoodsChecksub();
			String where = " checkId ='" + checkId + "' and matid ='" + mam.getMatId() + "'";
			List list = (List)this.equipmentDAO.findByWhere(bean, where);
			if (list.size() > 0){
				continue;
			}
			
			mgc.setMatid(mam.getMatId());
			mgc.setCatNo(mam.getCatNo());
			mgc.setCatName(mam.getCatName());
			mgc.setSpec(mam.getSpec());
			mgc.setMaterial(mam.getMaterial());
			mgc.setCheckId(checkId);
			mgc.setIsIn("2");
			mgc.setFormId(formId);
			this.equipmentDAO.insert(mgc);
		}
	}
	
	//发票管理 选入了库的物资(grid)
	public void selectStoreMat(String invoiceId, String[] matIds, String inId){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT__STORES_INSUB);
		String bean = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_GOODS_INVOICESUB);
		for (int i=0; i<matIds.length; i++){
			MatStoreInsub msi = (MatStoreInsub)this.equipmentDAO.findById(beanName, matIds[i]);
			MatGoodsInvoicesub mgi = new MatGoodsInvoicesub();
			String where = " invoiceId ='" + invoiceId + "' and matId ='" + msi.getMatId() + "'";
			List list = (List)this.equipmentDAO.findByWhere(bean, where);
			if (list.size() > 0){
				continue;
			}
			
			mgi.setMatId(msi.getMatId());
			mgi.setCatName(msi.getCatName());
			mgi.setCatNo(msi.getCatNo());
			mgi.setSpec(msi.getSpec());
			mgi.setUnit(msi.getUnit());
			mgi.setPrice(msi.getPrice());
			mgi.setFatory(msi.getFactory());
			mgi.setSum(msi.getSubSum());
			mgi.setInvoiceId(invoiceId);
			mgi.setStoreInId(inId);
			
			this.equipmentDAO.insert(mgi);
		}
	}
}

