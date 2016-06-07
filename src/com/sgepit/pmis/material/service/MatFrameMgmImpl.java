package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.material.hbm.MatCodeApply;
import com.sgepit.pmis.material.hbm.MatFrame;
import com.sgepit.pmis.material.hbm.MatFrameContract;


public class MatFrameMgmImpl extends BaseMgmImpl implements MatFrameMgmFacade {

	private EquipmentDAO equipmentDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static MatFrameMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (MatFrameMgmImpl) ctx.getBean("matFrameMgm");
	}
	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	public void deleteMatFrame(String  id) throws SQLException,
	BusinessException {
		MatFrame ef = (MatFrame)this.equipmentDAO.findById(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), id);
		List sublist = this.equipmentDAO.findByProperty(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), "parent", ef.getParent());
		if(sublist.size() == 1){
			MatFrame parent = (MatFrame) this.equipmentDAO.findById(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), ef.getParent());
			parent.setIsleaf(new Long(1));
			this.equipmentDAO.saveOrUpdate(parent);
		}
		this.equipmentDAO.delete(ef);
	
	}
	public void insertMatFrame(MatFrame matFrame) throws SQLException,
		BusinessException {
		this.equipmentDAO.insert(matFrame);
	
	}
	public void updateMatFrame(MatFrame matFrame) throws SQLException,
		BusinessException {
		
		if ("".equals(matFrame.getUuid())){
				MatFrame parentBdg = (MatFrame)this.equipmentDAO.findById(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME),
						matFrame.getParent());
				
				parentBdg.setIsleaf(new Long(0));
				this.equipmentDAO.saveOrUpdate(parentBdg);
				this.equipmentDAO.insert(matFrame);
		}else{
			if (!"".equals(matFrame.getAppid())&& matFrame.getAppid() != null){
				String beanApp =  BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_CODE_APPLY);
				MatCodeApply mcApp = (MatCodeApply)this.equipmentDAO.findById(beanApp, matFrame.getAppid());
				String Auint = mcApp.getUnit() == null ? "":mcApp.getUnit();
				Double Aprice = mcApp.getPrice() == null ? 0D :mcApp.getPrice();
				String Awarehouse = mcApp.getWarehouse() == null ? "":mcApp.getWarehouse();
				String AwareNo = mcApp.getWareNo() == null ? "":mcApp.getWareNo();
				String Buint = matFrame.getUnit() == null ? "":matFrame.getUnit();
				Double Bprice = matFrame.getPrice() == null ? 0D:matFrame.getPrice();
				String Bwarehouse = matFrame.getWarehouse() == null ? "":matFrame.getWarehouse();
				String BwareNo = matFrame.getWareNo() == null ? "":matFrame.getWareNo();
				
				if (!Auint.equals( Buint)) mcApp.setUnit( Buint); 
				if (!Aprice.equals(Bprice)) mcApp.setPrice(Bprice); 
				if (!Awarehouse.equals(Bwarehouse)) mcApp.setWarehouse(Bwarehouse);
				if (!AwareNo.equals(BwareNo)) mcApp.setWareNo(BwareNo);
				
				this.equipmentDAO.saveOrUpdate(mcApp);
			}
			
			this.equipmentDAO.saveOrUpdate(matFrame);
		}
	}
	//---------------------------------------------------------------------------------------------------
	//	user  method  
	//---------------------------------------------------------------------------------------------------
	
	/**
	 * 获得设备结构 - 树
	 * @author xiaos
	 * @param parentId
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> matFrameTree(String parentId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
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
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	public List<ColumnTreeNode> matContractTree(String parentId, String conid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent='"+ parent +"' and conid ='" + conid + "'";
		List<MatFrameContract> objects = this.equipmentDAO.findByWhere(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME_CONTRCAT), str);
		Iterator<MatFrameContract> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			MatFrameContract temp = (MatFrameContract) itr.next();
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
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}	
	/**
	 *  材料申请时供选择的树
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> getMatFrameTree(String parentId,String appid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String strParent = "parent='"+ parent +"'  order by catNo ";
		List<MatFrame> objects = this.equipmentDAO.findByWhere(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), strParent);
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
			
			if (leaf == 0) {
				jo.accumulate("ischeck", "true");
			} else {
				jo.accumulate("ischeck", "false");	// 扩展的属性
			}
			cn.setColumns(jo);						// ColumnTreeNode.columns
			list.add(cn);
		}
		
		return list;
	}	
	
	/**
	 *  合同材料选择的树
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> getMatConTree(String parentId,String conid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String strParent = "parent='"+ parent +"'  order by catNo ";
		List<MatFrame> objects = this.equipmentDAO.findByWhere(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), strParent);
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
			
//			if (leaf == 0) {
//				jo.accumulate("ischeck", "true");
//			} else {
				jo.accumulate("ischeck", "false");	// 扩展的属性
//			}
			cn.setColumns(jo);						// ColumnTreeNode.columns
			list.add(cn);
		}
		
		return list;
	}	
	
	/**
	 *  该合同的材料
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> contractMatTree(String parentId,String conid, String type) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String strParent = "parent='"+ parent +"' and conid = '"+ conid +"' order by catNo ";
		List<MatFrameContract> objects = this.equipmentDAO.findByWhere(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME_CONTRCAT), strParent);
		Iterator<MatFrameContract> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			MatFrameContract temp = (MatFrameContract) itr.next();
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
			
//			if (leaf == 0) {
//				jo.accumulate("ischeck", "true");
//			} else {
				jo.accumulate("ischeck", "false");	// 扩展的属性
//			}
			cn.setColumns(jo);						// ColumnTreeNode.columns
			list.add(cn);
		}
		
		return list;
	}	
	/**
	 * 获得材料编码
	 * @param frameId
	 * @return
	 */
	public String getIndexId(String frameId){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME);
		StringBuffer  sb = new StringBuffer();
		MatFrame matFrame = (MatFrame)this.equipmentDAO .findById(beanName, frameId);
		sb.append(matFrame.getCatNo());
		JdbcTemplate jdbc =  JdbcUtil.getJdbcTemplate();
		String sql = " select lpad(nvl(max(TO_NUMBER (substr(t.cat_no, length(t.cat_no)-3, length(t.cat_no)))),0) + 1,4,0) indexid  " + 
					 "	from mat_frame t where t.parent = '"+ frameId +"' " ;
		String indexId = (String)jdbc.queryForObject(sql, String.class);
		return sb.append(indexId).toString();
	}
	
	
	/**
	 * zhugx 保存选择的子树(合同材料)
	 * @param conid
	 * @param ids
	 */
	public void saveMatContractTree(String conid, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			MatFrameContract mfc = new MatFrameContract();
			MatFrame mf = (MatFrame) this.equipmentDAO.findById(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), ids[i]);
			
			if (mf.getIsleaf() == 0){
				String str = "matId = '" + mf.getUuid() + "' and conid='" + conid+ "'";
				List list = (List) this.equipmentDAO.findByWhere(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME_CONTRCAT), str);
				if (list.size() > 0)
					continue ;
			}
			mfc.setMatId(mf.getUuid());
			mfc.setCatName(mf.getCatName());
			mfc.setCatNo(mf.getCatNo());
			mfc.setEnName(mf.getEnName());
			mfc.setMaterial(mf.getMaterial());
			mfc.setSpec(mf.getSpec());
			mfc.setUnit(mf.getUnit());
			mfc.setPrice(mf.getPrice());
			mfc.setWarehouse(mf.getWarehouse());
			mfc.setWareNo(mf.getWareNo());
			mfc.setParent(mf.getParent());
			mfc.setIsleaf(mf.getIsleaf());
			mfc.setConid(conid);
			equipmentDAO.insert(mfc);
		}
	}
}

