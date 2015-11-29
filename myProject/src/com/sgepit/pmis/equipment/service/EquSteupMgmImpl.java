package com.sgepit.pmis.equipment.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.PropertyType;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquHouseout;
import com.sgepit.pmis.equipment.hbm.EquHouseoutSub;
import com.sgepit.pmis.equipment.hbm.EquSbaz;

public class EquSteupMgmImpl extends BaseMgmImpl implements EquSteupMgmFacade{
	
	private EquipmentDAO equipmentDAO;

	private String beanName = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_SB_SETUP;
	private String houseOutName = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_HOUSEOUT;
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static EquSteupMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EquSteupMgmImpl) ctx.getBean("equSteupMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}

	public String getSbCkdTree(String htId){
		List<EquHouseout> houseOutList = this.equipmentDAO.findWhereOrderBy(houseOutName, "conid = '"+htId+"'", "OUT_DATE desc");
		String nodeStr = "";
		for(int i=0;i<houseOutList.size();i++){
			EquHouseout outHbm = houseOutList.get(i);
			SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
			String text = outHbm.getOutno() + "【" +sdf.format(outHbm.getOutDate())+"】";
			
			List<EquHouseoutSub> houseOutSubList = this.equipmentDAO.findWhereOrderBy(houseOutName, "outid = '"+outHbm.getOutid()+"'", "SBNO desc");
			if(houseOutSubList.size()==0){
				nodeStr += ","+"{\"text\":\"" + text + "\""
								+ ",\"id\":\"" + outHbm.getOutid() + "\""
								+ ",\"isCkd\":true" 
								+ ",\"leaf\":true}";		
			}else{
				nodeStr += ","+"{\"text\":\"" + text + "\""
						+ ",\"id\":\"" + outHbm.getOutid() + "\""
						+ ",\"isCkd\":true" 
						+ ",\"leaf\":false,children:[";
				String sbStr = "";				
				for(int j=0;j<houseOutSubList.size();j++){
					EquHouseoutSub outSubHbm = houseOutSubList.get(j);
					String sbText = outSubHbm.getSbmc() +"【"+outSubHbm.getSbno()+"】";
					sbStr += "," +  "{\"text\":\"" + sbText + "\""
					+ ",\"id\":\"" + outSubHbm.getEquid() + "\""
					+ ",\"isCkd\":true" 
					+ ",\"leaf\":true}";
				}
				nodeStr = nodeStr.concat(sbStr.substring(1))+"]";
			}
			
		}
		return nodeStr;
	}
	/**
	 * 设备合同及出库单树
	 * @param parentId
	 * @param sbHtFl1Id
	 * @param parentType
	 * @return
	 */
	public List<TreeNode> htAndOutTree(String parentId,String sbHtFl1Id,String parentType){
		List<TreeNode> list = new ArrayList<TreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		if(parentType.equals("SortOne")){
			PropertyCodeDAO pcDao = PropertyCodeDAO.getInstence();
			String sbHtFlMc = pcDao.getCodeNameByPropertyName(sbHtFl1Id, "合同划分类型");
			PropertyType pt = (PropertyType) this.equipmentDAO.findBeanByProperty("com.sgepit.frame.sysman.hbm.PropertyType", "typeName", sbHtFlMc);
			List<PropertyCode> pcList = pcDao.findByWhere("com.sgepit.frame.sysman.hbm.PropertyCode", "type_name = '"+pt.getUids()+"'");
			for(int i=0;i<pcList.size();i++){
				TreeNode n = new TreeNode();
				List htList = this.equipmentDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), 
						"sort = '"+pcList.get(i).getPropertyCode()+"' and CONDIVNO = '"+sbHtFl1Id+"'");
				
				int leaf = htList.size()==0?1:0;			
				n.setId(pcList.get(i).getPropertyCode());			// treenode.id
				n.setText(pcList.get(i).getPropertyName());		// treenode.text
				if (leaf == 1) {
					n.setLeaf(true);				
					n.setIconCls("icon-cmp");			
				} else {
					n.setLeaf(false);				// treenode.leaf
					n.setCls("master-task");		// treenode.cls
					n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
				}
				n.setDescription("SortTwo");
				list.add(n);
			}
		}else if(parentType.equals("SortTwo")){
			List<ConOve> htList = this.equipmentDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), 
					"sort = '"+parentId+"'");
			for(int i=0;i<htList.size();i++){
				TreeNode n = new TreeNode();	
				String htmc = "【"+htList.get(i).getConno()+"】"+htList.get(i).getConname();
				n.setId(htList.get(i).getConid());			// treenode.id
				n.setText(htList.get(i).getConname());		// treenode.text
				List<EquHouseout> outList = this.equipmentDAO.findByWhere(houseOutName, "conid = '"+htList.get(i).getConid()+"'", "OUT_DATE desc");
				if(outList.size()>0){
					n.setLeaf(false);
				}else{
					n.setLeaf(true);
				}								
				n.setIconCls("icon-pkg");
				n.setDescription("Ht");
				list.add(n);
			}
		}else if(parentType.equals("Ht")){
			List<EquHouseout> htList = this.equipmentDAO.findByWhere(houseOutName, "conid = '"+parentId+"'", "OUT_DATE desc");
			for(int i=0;i<htList.size();i++){
				TreeNode n = new TreeNode();
				SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
				String ckd = htList.get(i).getOutno()==null?"":htList.get(i).getOutno();
				String mc = "【"+sdf.format(htList.get(i).getOutDate())+"】"+ ckd;
				n.setId(htList.get(i).getOutid());			// treenode.id
				n.setText(mc);		// treenode.text
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");
				n.setDescription("Ckd");
				list.add(n);
			}
		}
		return list;
	}
	
	/**
	 * 设备安装
	 */
	public String saveOrUpdateSbaz(EquSbaz sbaz){
		String str = "1";
		String uids = sbaz.getUids();
		try {
			if(uids == null || uids.equals("")){
				List<EquSbaz> list = this.equipmentDAO.findByWhere(beanName, "sbKks = '"+sbaz.getSbKks()+"'");
				if(list.size()>0){
					//KKS编码重复
					str = "3";
				}else{
					this.equipmentDAO.insert(sbaz);
				}
			}else{
				this.equipmentDAO.saveOrUpdate(sbaz);
				str = "2";
			}
			return str;
		} catch (Exception e) {
			e.printStackTrace();
			return "0";
		}
	}
}
