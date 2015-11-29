package com.sgepit.pmis.equipment.service;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.PropertyType;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquList;
import com.sgepit.pmis.equipment.hbm.EquListQc;
import com.sgepit.pmis.equipment.hbm.EquOpenBox;
import com.sgepit.pmis.equipment.hbm.EquOpenBoxSub;
import com.sgepit.pmis.equipment.hbm.EquRecSub;
import com.sgepit.pmis.equipment.hbm.EquSbdh;
import com.sgepit.pmis.equipment.hbm.EquSbdhArr;


public class EqulistMgmImpl extends BaseMgmImpl implements EqulistMgmFacade {
	
	EquipmentDAO  equipmentDAO;
	ApplicationMgmFacade applicationMgm;
	
	public static EqulistMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EqulistMgmImpl) ctx.getBean("equlistMgm");
	}

	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}
	
	public void setApplicationMgm(ApplicationMgmFacade applicationMgm) {
		this.applicationMgm = applicationMgm;
	}
	
	public ApplicationMgmFacade getApplicationMgm() {
		return applicationMgm;
	}
	
	public List<TreeNode> equlistTreeAuto(String parentId,String sbHtFl1Id,String parentType){
		List<TreeNode> list = new ArrayList<TreeNode>(); 
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
					"sort = '"+parentId+"' and CONDIVNO = '"+sbHtFl1Id+"' ");
			for(int i=0;i<htList.size();i++){
				TreeNode n = new TreeNode();	
				String htmc = "【"+htList.get(i).getConno()+"】"+htList.get(i).getConname();
				n.setId(htList.get(i).getConid());			// treenode.id
				n.setText(htList.get(i).getConname());		// treenode.text
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");
				n.setDescription("Ht");
				list.add(n);
			}
		}
		return list;
	}
	
	
	/* 设备清单树
	 * (non-Javadoc)
	 * @see com.hdkj.webpmis.domain.business.equipment.EqulistMgmFacade#equlistTree(java.lang.String)
	 */
	public List<ColumnTreeNode> equlistTree(String parentId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parentid='"+ parent +"' order by indexId ";
		List<EquList> objects = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST), str);
		Iterator<EquList> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EquList temp = (EquList) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getSbId());			// treenode.id
			n.setText(temp.getSbMc());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

	/**
	 * 设备清册 
	 * @param parentId 父节点
	 * @param whereStr	其他查询条件
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> equlistTreeQc(String parentId, String whereStr) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent='"+ parent +"'" + whereStr + " order by kks ";
		List<EquListQc> objects = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat("EquListQc"), str);
		Iterator<EquListQc> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EquListQc temp = (EquListQc) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getSbid());			// treenode.id
			n.setText(temp.getSbMc());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	
	/*
	 * 获得设备清单树（供选择）
	 */
	public List<ColumnTreeNode> getEqulistTree(String parentId, String dhId,String ggid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = " parentid='"+ parentId +"' order by indexId,ggxh"; 
		
//		StringBuffer bfs = new StringBuffer();
//		bfs.append("parentid='" + parentId);
//		if (null != dhId && !dhId.equals("")) {
//			bfs.append("' and sbId='" + dhId);
//		}
//		bfs.append("' order by indexId ");
		List<EquList> objects = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST),  str);
		Iterator<EquList> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EquList temp = (EquList) itr.next();
			int leaf = temp.getIsleaf().intValue();	
			n.setId(temp.getSbId());			// treenode.id
			n.setText(temp.getSbMc());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");	
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode

			JSONObject jo = JSONObject.fromObject(temp);
			//List lt = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_DH_ARR),  
				//	"conid = '" + dhId + "' and sbId = '"+ temp.getSbId() + "'");
			List lt = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_DH_ARR),  
					"sbId = '" + temp.getSbId() + "' and dhId ='"+ggid+"'" );
			if (leaf == 1 && lt != null && lt.size() > 0) {
				jo.accumulate("ischeck", "true");
			} else {
				jo.accumulate("ischeck", "false");	// 扩展的属性
			}
			cn.setColumns(jo);						// ColumnTreeNode.columns
			list.add(cn);
		}
		return list;
	}
	
	public List<ColumnTreeNode> getEqulistTree2(String parentId,String kxuuid,String kxsbid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str =null;
		if(!kxsbid.equals("")){
			str = " parentid='"+ parentId +"' and sbId='"+kxsbid+"' order by indexId,ggxh ";
			}
		else {str=" parentid='"+ parentId +"' order by indexId "; }
//		StringBuffer bfs = new StringBuffer();
//		bfs.append("parentid='" + parentId);
//		if (null != dhId && !dhId.equals("")) {
//			bfs.append("' and sbId='" + dhId);
//		}
//		bfs.append("' order by indexId ");
		List<EquList> objects = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST),  str);
		Iterator<EquList> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EquList temp = (EquList) itr.next();
			int leaf = temp.getIsleaf().intValue();	
			n.setId(temp.getSbId());			// treenode.id
			n.setText(temp.getSbMc());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");	
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode

			JSONObject jo = JSONObject.fromObject(temp);
			//List lt = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_DH_ARR),  
				//	"conid = '" + dhId + "' and sbId = '"+ temp.getSbId() + "'");
			List lt = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_OPEN_BOX_SUB),  
					"sbId = '" + temp.getSbId() + "' and open_id ='"+kxuuid+"'" );
			if (leaf == 1 && lt != null && lt.size() > 0) {
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
	 * 子节点新增一个节点的时候
	 * @param sbId
	 */
	public void saveEqulist(String sbId){
		String beanName = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		EquList equList = (EquList)this.equipmentDAO .findById(beanName, sbId);
		if (equList.getIsleaf()==1){
			equList.setIsleaf(new Long(0));
		}
		
		this.equipmentDAO.saveOrUpdate(equList);
	}
	/**
	 * 子节点新增一个节点的时候
	 * @param sbId
	 */
	public void saveEqulistQc(String sbId){
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquListQc");
		EquListQc equList = (EquListQc)this.equipmentDAO .findById(beanName, sbId);
		if (equList.getIsleaf()==1){
			equList.setIsleaf(new Long(0));
		}
		
		this.equipmentDAO.saveOrUpdate(equList);
	}
	
	/*
	 * 删除一个子节点
	 */
	public int deleteEqulist(String[] sbIds){
		int flag = 0;
		String beanName = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		for (int i = 0; i < sbIds.length; i++) {
			EquList equList = (EquList)this.equipmentDAO .findById(beanName, sbIds[i]);
			String parentId = equList.getParentid();
			String ParWhere = "parentid = '" + parentId + "'";
			List ParList = (List)this.equipmentDAO.findByWhere2(beanName, ParWhere);
			
			String where = "parentid = '" + sbIds[i] + "'";
			List list = (List)this.equipmentDAO.findByWhere2(beanName, where);
			
			if (list.size()>0){
				flag = 1;    // 有子结点不能直接删除
			}else{
				// 判断删除的节点是否是该父节点下唯一的子节点
				if (ParList.size() == 1){
					EquList parent = (EquList)this.equipmentDAO .findById(beanName, parentId);
					parent.setIsleaf(new Long(1));
					this.equipmentDAO.saveOrUpdate(parent);
				}
				
			}
		}
		return flag;
	}
	
	/*
	 * 删除一个子节点
	 */
	public int deleteEqulistQc(String[] sbIds){
		int flag = 0;
		String beanName = BusinessConstants.EQU_PACKAGE.concat("EquListQc");
		String beanNameList = BusinessConstants.EQU_PACKAGE.concat("EquList");
		for (int i = 0; i < sbIds.length; i++) {
			EquListQc equList = (EquListQc)this.equipmentDAO .findById(beanName, sbIds[i]);
			String kks = equList.getKks();
			String parentId = equList.getParent();
			//1.有子节点的不能删除
			List childList = this.equipmentDAO.findByWhere(beanName, "parent = '"+kks+"'");
			if(childList.size()>0){
				flag = 1;
				break;
			}
			//2.被设备清单中使用过的设备不能删除
			List listList = this.equipmentDAO.findByWhere(beanNameList, "sb_bm = '"+kks+"'");
			if(listList.size()>0){
				flag = 2;
				break;
			}
			//3.删除最后一个子节点时，同时更新对应父节点为叶子节点
			EquListQc parent = (EquListQc) this.equipmentDAO.findByWhere(beanName, "kks = '"+parentId+"'").get(0);
			List parList = this.equipmentDAO.findByWhere(beanName, "parent = '"+parentId+"'");
			if(parList.size() == 1){
				parent.setIsleaf(new Long(1));
				this.equipmentDAO.saveOrUpdate(parent);
			}
			//4.删除设备
			this.equipmentDAO.delete(equList);
		}
		return flag;
	}
	
	
	/* (non-Javadoc)删除一个子节点,右键删除
	 * @see com.hdkj.webpmis.domain.business.equipment.EqulistMgmFacade#deleteChildNode(java.lang.String)
	 */
	public int deleteChildNode(String noid) {
		int flag = 0;
		String beanName = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
			EquList equList = (EquList)this.equipmentDAO .findById(beanName, noid);
			String parentId = equList.getParentid();
			String ParWhere = "parentid = '" + parentId + "'";
			List ParList = (List)this.equipmentDAO.findByWhere2(beanName, ParWhere);
			
			String where = "parentid = '" + noid + "'";
			List list = (List)this.equipmentDAO.findByWhere2(beanName, where);
			
			if (list.size()>0){
				flag = 1;    // 有子结点不能直接删除
			}else{
				// 判断删除的节点是否是该父节点下唯一的子节点
				if (ParList.size() == 1){
					EquList parent = (EquList)this.equipmentDAO .findById(beanName, parentId);
					parent.setIsleaf(new Long(1));
					this.equipmentDAO.saveOrUpdate(parent);
				}
				this.equipmentDAO.delete(equList);
			}
		
		return flag;
	}
	
	/*
	 * 增加树结点
	 */
	public int addOrUpdate(EquList equlist, String indexid) {
		int flag = 0;
		String beanName = BusinessConstants.EQU_PACKAGE
				+ BusinessConstants.EQU_LIST;
		try {
			if ("".equals(equlist.getSbId())) { // 新增
				/*
				 * 当新增节点是它父节点的第一个子节点，如果该父节点(新 增前是没子节点)原来是[工程量]，就要自动改成[概算]！
				 */
				// 查找是否有同级节点
				List list = (List) this.equipmentDAO.findByProperty(beanName,
						"parentid", equlist.getParentid());
				if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
					EquList parentBdg = (EquList) this.equipmentDAO.findById(
							beanName, equlist.getParentid());
					parentBdg.setIsleaf(new Long(0));
					this.equipmentDAO.saveOrUpdate(parentBdg);
				}
				String str = this.getIndexId(equlist.getParentid());

				if (str == null || str.equals("")) {
					return 0;
				}
				if (str.substring(str.length() - 1, str.length()).equals("9999")) {
					return 1;
				}
				equlist.setIndexId(str);
				equlist.setIsleaf(new Long(1));
				this.equipmentDAO.insert(equlist);
			}else{
				equlist.setIndexId(indexid);
				this.equipmentDAO.saveOrUpdate(equlist);
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	public String getIndexId(String sbId){
		WebContext webContext = WebContextFactory.get();
		if(webContext!=null) {
			HttpSession session = webContext.getSession() ;
			System.out.println("session::" + session.getAttribute(Constant.CURRENTAPPPID));
		}
		
		JdbcTemplate jdbc =  JdbcUtil.getJdbcTemplate();
		String sql = "  select lpad(nvl(max(TO_NUMBER (substr(t.kks, length(t.kks)-3, length(t.kks)))),0) + 1,4,0) sbid " +
		"	from equ_list_qc t where t.parent = '"+sbId+"'";
		String indexId2 = (String)jdbc.queryForObject(sql, String.class);
		sbId += indexId2;
		return sbId;
	}
	 
	/*
	 * 保存选择的设备到货
	 */
	public void saveSelectEqu(String conid, String ggid, String[] sbIds){
		String beanEqu = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		
		for (int i = 0; i < sbIds.length; i++) {
			EquList equList = (EquList)this.equipmentDAO.findById(beanEqu, sbIds[i]);
			EquSbdh equDh =new EquSbdh();
			equDh.setConid(conid);
			equDh.setParentid(equList.getParentid());
			Double d = equList.getZs();
				if (d == null) d = new Double(0);
			equDh.setZs(d);
			equDh.setDhsl(new Long(0));
			equDh.setSbId(sbIds[i]);
			equDh.setDhId(ggid);
			equDh.setDj(equList.getDj());
			equDh.setPid(equList.getPid());
			this.equipmentDAO.saveOrUpdate(equDh);
		}
	}
	
	/*
	 * 保存选择的设备到货 新
	 */
	public void saveSelectEquArr(String conid, String ggid, String[] sbIds,String partB){
		String beanEqu = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		for (int i = 0; i < sbIds.length; i++) {
			EquList equList = (EquList)this.equipmentDAO.findById(beanEqu, sbIds[i]);
			
			String sbbm = equList.getSbBm();
			String sql = "select sum(dhsl) dhsl from EQU_SBDH_ARR where sbbm='"+sbbm+"' and dh_id in(select ggid from equ_get_goods_arr where billstate='1')";
			List zslist = this.equipmentDAO.getDataAutoCloseSes(sql);
			EquSbdhArr equDh =new EquSbdhArr();
			equDh.setConid(conid);
			equDh.setParentid(equList.getParentid());
			Double d = new Double(0);
			if(zslist.get(0)!=null){
			  d = Double.parseDouble(zslist.get(0)+"");
			}
			equDh.setZs(d);
			equDh.setSbId(sbIds[i]);
			equDh.setDhId(ggid);
			equDh.setDj(equList.getDj());
			equDh.setJzh(equList.getJzh());
			equDh.setPid(equList.getPid());
			equDh.setBoxno(equList.getBoxNo());
			equDh.setPartno(equList.getPartNo());
			this.equipmentDAO.saveOrUpdate(equDh);
			
		}
	}
	
	/*
	 * 保存选择的设备开箱从表 
	 */
	public void saveSelectOpen(String conid, String kxuuid, String[] sbIds,String ggid,String kxsbid){
		String JZH=null,wztype=null,BOX_NO=null,PART_NO=null;
		String beanEqu = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		String beanRecSub = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_REC_SUB);
		List list = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_OPEN_BOX, "uuid='"+kxuuid+"'");
		Iterator<EquOpenBox> it=list.iterator();
		while(it.hasNext()){
			EquOpenBox openbox=(EquOpenBox)it.next();
			JZH=openbox.getJzh();
			wztype=openbox.getWztype();
			BOX_NO=openbox.getBox_no();
			PART_NO=openbox.getPartno();
		}
		
		for (int i = 0; i < sbIds.length; i++) {
			JdbcTemplate jdbc =  JdbcUtil.getJdbcTemplate();
			EquList equList = (EquList)this.equipmentDAO.findById(beanEqu, sbIds[i]);
				if(equList.getIsleaf()==0){continue;}
			EquOpenBoxSub equDh =new EquOpenBoxSub();
			Double d = new Double(0);
			Double DHSL=new Double(0);
			Double DZ=new Double(0);
			Double ZZ=new Double(0);
			if(kxsbid.equals(sbIds[i])){
				DHSL=(Double)jdbc.queryForObject("select DHSL from EQU_SBDH_ARR where DH_ID='"+ggid+"' and SB_ID='"+kxsbid+"'", Double.class);
				DZ=(Double)jdbc.queryForObject("select DZ from EQU_SBDH_ARR where DH_ID='"+ggid+"' and SB_ID='"+kxsbid+"'", Double.class);
				ZZ=(Double)jdbc.queryForObject("select ZZ from EQU_SBDH_ARR where DH_ID='"+ggid+"' and SB_ID='"+kxsbid+"'", Double.class);
			}
			equDh.setOpensl(DHSL);
			equDh.setDz(DZ);
			equDh.setZz(ZZ);
			if (null == equList.getZs()) {
				d = new Double(0);
			} else {
				d = equList.getZs();
			}
			equDh.setPid(equList.getPid());
			equDh.setSl(d);
			equDh.setOpenId(kxuuid);
			equDh.setSbId(sbIds[i]);
			this.equipmentDAO.saveOrUpdate(equDh);
			
			//加载数据到设备领用的"待领用中"
			List<EquRecSub> EquRecSub = this.equipmentDAO.findByWhere2(beanRecSub,  "equid='"+sbIds[i]+"'");
			EquRecSub rqurecsub=new EquRecSub();
			if(EquRecSub.isEmpty()){
			rqurecsub.setEquid(sbIds[i]);
			rqurecsub.setConid(conid);
		    rqurecsub.setWztype(wztype);
		    rqurecsub.setSbmc(equList.getSbMc());
		    rqurecsub.setGgxh(equList.getGgxh());
		    rqurecsub.setDw(equList.getDw());
		    rqurecsub.setSccj(equList.getSccj());
			rqurecsub.setPleRecnum(Double.parseDouble("0"));           //请领数量一开始设为0
			rqurecsub.setRecnum(Double.parseDouble("0"));              // 领用数量一开始设为0
			rqurecsub.setMachineNo(JZH);
			rqurecsub.setBox_no(BOX_NO);
			rqurecsub.setPart_no(PART_NO);
			rqurecsub.setKcsl(DHSL);
			rqurecsub.setPid(equList.getPid());
			this.equipmentDAO.insert(rqurecsub);
			}else{
				Long OldDhsl=(Long)jdbc.queryForObject("select  kcsl from EQU_REC_SUB where equid='"+sbIds[i]+"' and recid is null", Long.class);
				jdbc.update("update equ_rec_sub set kcsl='"+(OldDhsl+DHSL)+"' where equid='"+sbIds[i]+"'");
			}
		}
	}		
	
	public String findEquType(String id){
		String result = "";
		String beanEqu = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		EquList equParent = (EquList) this.equipmentDAO.findById(beanEqu, id);
		if(null == equParent)return result;
		if("2".equals(equParent.getSx())||"3".equals(equParent.getSx())||"4".equals(equParent.getSx())){
			result = equParent.getSx();
		}else{
			return findEquType(equParent.getParentid());
		}		
		return result;
	}
	/**
	 * 对所属专业下增加合同
	 */
	//1 锅炉专业、2 汽机专业、3 电气专业、4 热控专业、5 输煤专业、6 化学专业、7 脱硫脱硝专业、8 除尘专业 9 其他
	public void addContract(String sbId, String name){
		String type = null;
		String bean = BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE);
		String beanEqu = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);

		List list = getApplicationMgm().getCodeValue("设备合同分类");
		
		StringBuffer sb = new StringBuffer();
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			PropertyCode app = (PropertyCode) iterator.next();
			sb.append(app.getPropertyName()).append("|--|").append(app.getPropertyCode()).append("|--|");
			if (app.getPropertyName().trim().equals(name.trim())){
				type = app.getPropertyCode();
			}
		}
		
		EquList equParent = (EquList)this.equipmentDAO.findById(beanEqu, sbId);
		List contracts = this.equipmentDAO.findByProperty(bean, "sort", type);
		
		Iterator itcon = contracts.iterator();

		while (itcon.hasNext()){
			ConOve con = (ConOve)itcon.next();   
			String conId = con.getConid();
			List  list2 = this.equipmentDAO.findByProperty(beanEqu, "conid", conId);
				if (list2.size()>0) 	continue;  // 判断合同是否存在
			EquList equList = new EquList();
			String indexId = this.getIndexId(sbId);
			
			equList.setConid(conId);
			equList.setPid(con.getPid());
			equList.setSbBm(con.getConno());
			equList.setSbMc(con.getConno()+"【"+con.getConname()+"】");
			equList.setIndexId(indexId);
			equList.setParentid(sbId);
			equList.setSx("5");
			equList.setIsleaf(new Long(0));
			equParent.setIsleaf(new Long(0));
			this.equipmentDAO.saveOrUpdate(equList);
			this.equipmentDAO.saveOrUpdate(equParent);
			
			//在添加合同的同时同时增加 设备、备品备件、专用工具
			List  typeCon = this.equipmentDAO.findByProperty(beanEqu, "parentid", sbId);
			EquList con_equ = new EquList();
			con_equ.setConid(conId);
			con_equ.setSbBm("4"+type+(typeCon.size()+1)+"01");
			con_equ.setSbMc("设备");
			con_equ.setIndexId(this.getIndexId(equList.getSbId()));
			con_equ.setParentid(equList.getSbId());
			con_equ.setSx("2");
			con_equ.setIsleaf(new Long(1));
			con_equ.setPid(con.getPid());
			this.equipmentDAO.saveOrUpdate(con_equ);
			
			EquList equ_part = new EquList();
			equ_part.setPid(con.getPid());
			equ_part.setConid(conId);
			equ_part.setSbBm("4"+type+(typeCon.size()+1)+"02");
			equ_part.setSbMc("备品备件");
			equ_part.setIndexId(this.getIndexId(equList.getSbId()));
			equ_part.setParentid(equList.getSbId());
			equ_part.setSx("3");
			equ_part.setIsleaf(new Long(1));
			this.equipmentDAO.saveOrUpdate(equ_part);
			
			EquList equ_tool = new EquList();
			equ_tool.setPid(con.getPid());
			equ_tool.setConid(conId);
			equ_tool.setSbBm("4"+type+(typeCon.size()+1)+"03");
			equ_tool.setSbMc("专用工具");
			equ_tool.setIndexId(this.getIndexId(equList.getSbId()));
			equ_tool.setParentid(equList.getSbId());
			equ_tool.setSx("4");
			equ_tool.setIsleaf(new Long(1));
			this.equipmentDAO.saveOrUpdate(equ_tool);			
		}
		
	}
	
	/**
	 * 去掉已经删除的合同的信息
	 * @param conid
	 */
	public void deleteConAll(String  conid){
		String beanEqu = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		List list = this.equipmentDAO.findByProperty(beanEqu, "conid", conid);
		if (list.size()>0){
			EquList equCon = (EquList)list.get(0);
			String parentId = equCon.getParentid();
			List listPare = this.equipmentDAO.findByProperty(beanEqu, "parentid", parentId);
		
			Iterator it = list.iterator();
			while (it.hasNext()){
				EquList equ = (EquList)it.next();
				String indexId = equ.getIndexId();
				String where = " indexId like '" + indexId + "%'";
				List DelList = this.equipmentDAO.findByWhere2(beanEqu, where);
				this.equipmentDAO.deleteAll(DelList);
			}
			if (listPare.size() == 1){
				EquList parent = (EquList)this.equipmentDAO.findById(beanEqu, parentId);
				parent.setIsleaf(new Long(1));
				this.equipmentDAO.saveOrUpdate(parent);
			}
		}
	}
	
	/**
	 * 移动 所属系统发生变化
	 */
	
	public void moveCon(String conid, String typeName){
//		String beanEqu = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
//		List conList = this.equipmentDAO.findByProperty(beanEqu, "conid", conid);
//	
//		if (conList.size()>0){
//			List listEqu = this.equipmentDAO.findByProperty(beanEqu, "sbMc", typeName.trim());
//			EquList equParent = (EquList)listEqu.get(0);
//			EquList equCon = (EquList)conList.get(0);
//			String indexBefore = equCon.getIndexId();
//			String parentId = equCon.getParentid();
//			String indexLater = this.getIndexId(equParent.getSbId());
//			
//			List listPare = this.equipmentDAO.findByProperty(beanEqu, "parentid", parentId);
//			equCon.setParentid(equParent.getSbId());
//			equCon.setIndexId(indexLater);
//			
//			if (equParent.getIsleaf() == 1){
//				equParent.setIsleaf(new Long(0));
//				this.equipmentDAO.saveOrUpdate(equParent);
//			}
//			
//			JdbcTemplate jdbc =  JdbcUtil.getJdbcTemplate();
//			String sql = "update  equ_list t set t.index_id = '"+indexLater+"'  || substr(t.index_id,13) "  +
//						 " where t.index_id like '"+indexBefore+"%'";
//			jdbc.execute(sql);
//			
//			this.equipmentDAO.saveOrUpdate(equCon);
//			
//			if (listPare.size() == 1){
//				EquList parent = (EquList)this.equipmentDAO.findById(beanEqu, parentId);
//				parent.setIsleaf(new Long(1));
//			
//				this.equipmentDAO.saveOrUpdate(parent);
//			}
//		}
	}
	
	//计算到货总数量
	public int dhzs(String id){
		int i=0;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql="select sum(zs) from equ_list t where parentid='"+id+"'";
		i=jdbc.queryForInt(sql);
		return i;
	}
	public String getparent(String conid){
		System.out.println("conid="+conid);
		String parent = "";
		String beanName = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		List list = this.equipmentDAO.findByWhere2(beanName, "conid = '"+ conid +"' order by indexId");//.findByProperty(beanName, "conid", conid);
		if (list.size() > 0){
			EquList equList = (EquList)list.get(0);
			parent = equList.getSbId();
		}
		System.out.println("parent="+parent);
		return parent;
		
	}

	public String getEquNo(String parentid){
		NumberFormat numberFormat = NumberFormat.getInstance(Locale.CHINESE);
		numberFormat.setMinimumIntegerDigits(3);
		String sql = "select sb_bm from equ_list where sb_id = '"+parentid+"'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String strNo = (String) jdbc.queryForObject(sql, String.class);
		List  totalEqu = this.equipmentDAO.findByProperty(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST), "parentid", parentid);
		String totalNum = numberFormat.format(totalEqu.size()+1);
		return strNo.concat(totalNum);
	}
	/**
	 * 处理excel格式导入的数据
	 */
	public void saveHandleExcel(EquList equList,Map argments) throws BusinessException{
		String parentid = (String) argments.get("parentid");
		if(null == parentid) throw new BusinessException("参数不正确...");
		String realname = (String) argments.get("realname");
		String stobillstate=(String) argments.get("storeBillstate");
		String indexid=(String) argments.get("indexid");
		if(null == realname)realname="";
		String beanName = BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST);
		if(indexid!=null){
		List lista=this.equipmentDAO.findByWhere2(beanName, "ggxh='"+equList.getGgxh()+"' and indexId like'"+indexid+"%'");
		EquList parentEqu = (EquList)this.equipmentDAO .findById(beanName, parentid);		
		parentEqu.setIsleaf(new Long(0));
		this.equipmentDAO.saveOrUpdate(parentEqu);
		
		equList.setPid(parentEqu.getPid());
		equList.setIsleaf(new Long(1));
		equList.setParentid(parentid);
		equList.setConid(parentEqu.getConid());
		equList.setIndexId(this.getIndexId(parentid));
		equList.setSbBm(this.getEquNo(parentid));
		equList.setRecordman(realname);
		equList.setStoreBillstate(stobillstate);
		if(lista.size()>0){
			
		}else{
			this.equipmentDAO.saveOrUpdate(equList);
		}
		}
	}
	/*
	 * 验证规格型号唯一
	 */
	public boolean checkGgXh(String ggxh,String indexid){
		List list = this.equipmentDAO.findByWhere2(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_LIST), "indexId like'"+indexid+"%' and ggxh='"+ggxh+"'");
		if (list.size()>0) return false;
		return true;
	
	}

	/**
	 * 从设备清册中选择设备到设备清单
	 * @param parentid 设备清册分类树父编号
	 * @param listqc 设备清册对象
	 * @param bdgid 概算主键
	 * @param bdgno 概算编号
	 */
	public boolean selectSbtoList(String parentid,EquListQc [] listqc,String bdgid,String bdgno){
		try{
			boolean bool = true;
			for(int i =0; i<listqc.length;i++){
				//判断是否是新增但是还没有保存的设备
				if(listqc[i].getSbid()==null || listqc[i].getSbid().equals("")){
					bool = false;
					break;	
				}
				EquList eqlist = new EquList();
				eqlist.setConid(parentid);
				eqlist.setSbId(listqc[i].getSbid());
				eqlist.setIsleaf(listqc[i].getIsleaf());
				eqlist.setSbMc(listqc[i].getSbMc());
				eqlist.setSx(listqc[i].getSx());
				eqlist.setGgxh(listqc[i].getGgxh());
				eqlist.setSccj(listqc[i].getSccj());
				eqlist.setDw(listqc[i].getDw());
				eqlist.setJhsl(listqc[i].getJhsl());
				eqlist.setSbBm(listqc[i].getKks());//修改，设备清册中kks改为这里的设备编码
				eqlist.setJhsl(listqc[i].getJhsl());
				eqlist.setJzh(listqc[i].getJzh());
				eqlist.setPid(listqc[i].getPid());
				eqlist.setBdgid(bdgid);				//概算主键
				eqlist.setBdgno(bdgno);				//概算编号
				this.equipmentDAO.insert(eqlist);
			}
			return bool;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 保存修改的设备，并更新到设备清册。保存前判断设备是否有到货记录，有则不能修改
	 * @param sbids 需要修改的设备
	 * @param conid 合同编号
	 * @author zhangh
	 * @since 2011-03-08
	 * @return 	2 有使用过，不能修改。
	 * 			1 修改成功。
	 * 			0 异常
	 */
	public int saveEqulistAndUpdateQc(EquList[] equListArr,String conid){
		int m = 1;
		try {
			String beanArr = "com.sgepit.pmis.equipment.hbm.EquSbdhArr";
			String where = new String();
			for (int i = 0; i < equListArr.length; i++) {
				where = "sbId = '"+equListArr[i].getSbId()+"' and conid = '"+conid+"'";
				List list = this.equipmentDAO.findByWhere(beanArr, where);
				if(list.size() > 0) m = 2;
				break;
			}
			if(m!=2){
				String beanListQc = "com.sgepit.pmis.equipment.hbm.EquListQc";
				for (int i = 0; i < equListArr.length; i++) {
					this.equipmentDAO.saveOrUpdate(equListArr[i]);
					List<EquListQc> list = this.equipmentDAO.findByWhere(beanListQc, "kks='"+equListArr[i].getSbBm()+"'");
					if(list.size()>0){
						EquListQc equListQc = list.get(0);
						equListQc.setSbMc(equListArr[i].getSbMc());
						equListQc.setSx(equListArr[i].getSx());
						equListQc.setGgxh(equListArr[i].getGgxh());
						equListQc.setDw(equListArr[i].getDw());
						equListQc.setJhsl(equListArr[i].getJhsl());
						equListQc.setSccj(equListArr[i].getSccj());
						equListQc.setJzh(equListArr[i].getJzh());
						this.equipmentDAO.saveOrUpdate(equListQc);
					}
				}
			}
			return m;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}
	
	
	/**
	 * 删除清单中的设备。删除前判断设备是否有到货记录，有则不能删除
	 * @param sbids 需要删除是设备主键
	 * @param conid 合同编号
	 * @author zhangh
	 * @since 2011-03-08
	 * @return 	2 有使用过，不能删除。
	 * 			1 删除成功。
	 * 			0 异常
	 */
	public int deleteEqulistSb(String[] sbids,String conid){
		int m = 1;
		try {
			String beanArr = "com.sgepit.pmis.equipment.hbm.EquSbdhArr";
			String where = new String();
			for (int i = 0; i < sbids.length; i++) {
				where = "sbId = '"+sbids[i]+"' and conid = '"+conid+"'";
				List list = this.equipmentDAO.findByWhere(beanArr, where);
				if(list.size() > 0) m = 2;
				break;
			}
			if(m!=2){
				String beanList = "com.sgepit.pmis.equipment.hbm.EquList";
				for (int i = 0; i < sbids.length; i++) {
					EquList equList = (EquList) this.equipmentDAO.findById(beanList,sbids[i]);
					this.equipmentDAO.delete(equList);
				}
			}
			return m;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}
}
