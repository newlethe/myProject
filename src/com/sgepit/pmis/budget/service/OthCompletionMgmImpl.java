package com.sgepit.pmis.budget.service;

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
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budget.dao.BdgMoneyDAO;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.OtherCompletionSub;
import com.sgepit.pmis.common.BusinessConstants;

public class OthCompletionMgmImpl extends BaseMgmImpl implements OthCompletionMgmFacade {

	private BdgMoneyDAO bdgMoneyDao;

	private BusinessException businessException;
	private Object[][] object;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static OthCompletionMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (OthCompletionMgmImpl) ctx.getBean("othCompletionMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setBdgMoneyDao(BdgMoneyDAO bdgMoneyDao) {
		this.bdgMoneyDao = bdgMoneyDao;
	}
	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------

	public void deleteOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException {
		this.bdgMoneyDao.delete(othComp);
		
	}
	public void insertOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException {
		this.bdgMoneyDao.insert(othComp);
		
	}
	public void updateOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException {
		this.bdgMoneyDao.saveOrUpdate(othComp);
		
	}
	//-----------------------------------------------------------------------------------------------
	// user method
	//-------------------------------------------------------------------------------------------------
	
	public List<ColumnTreeNode> getOtherTree(String parentId, String id) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent='"+ parent +"' order by bdgid ";
		List<BdgInfo> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), str);
		Iterator<BdgInfo> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgInfo temp = (BdgInfo) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgid());			// treenode.id
			n.setText(temp.getBdgname());		// treenode.text
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
			List lt = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.COMP_OTHER_SUB),
					" otherUuid = '" + id + "' and bdgUuid = '"+ temp.getBdgid() + "'");
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
	 * zhugx 保存选择的子树(其他费用投资完成)
	 * @param conid
	 * @param ids
	 */
	public void saveOtherCompTree(String id, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			OtherCompletionSub oc = new OtherCompletionSub();
			BdgInfo dgInfo = (BdgInfo) this.bdgMoneyDao.findById( BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), ids[i]);
			
			if (dgInfo.getIsleaf() == 0){
				String str = "bdgUuid = '" +dgInfo.getBdgid() + "' and otherUuid='" + id + "'";
					List list = (List) this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.COMP_OTHER_SUB), str);
					if (list.size() > 0) continue ;
			}
			oc.setOtherUuid(id);
			oc.setBdgUuid(ids[i]);
				Double sumMoney = new Double(0);
				JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
				String sql = " select nvl(sum(t.month_money),0) total from other_completion_sub t " +
							 " where t.bdg_uuid='"+ids[i]+"'";
				Iterator it = jdbc.queryForList(sql).iterator();
				while (it.hasNext()){
					Map m = (Map)it.next();
					sumMoney = new Double(m.get("total").toString());
				}
			oc.setSumMoney(sumMoney);     
			oc.setMonthMoney(new Double(0));
			oc.setIsleaf(dgInfo.getIsleaf());
			oc.setParent(dgInfo.getParent());
			try {
				insertOthComp(oc);
			} catch (SQLException e) {
				e.printStackTrace();
			} catch (BusinessException e) {
				e.printStackTrace();
			}
		}
	}
	
	public List<ColumnTreeNode> otherCompTree(String parentId, String id) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and otherUuid = '" + id+ "' order by bdgUuid";
		List<OtherCompletionSub> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.COMP_OTHER_SUB), str);
		Iterator<OtherCompletionSub> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			OtherCompletionSub temp = (OtherCompletionSub) itr.next();
			BdgInfo bi = (BdgInfo) this.bdgMoneyDao.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), temp.getBdgUuid());
			if (bi ==null)	continue;
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			Double d1 = temp.getMonthMoney() == null?0:temp.getMonthMoney();
			Double d2 = bi.getBdgmoney() == null?1: bi.getBdgmoney() == 0?1:bi.getBdgmoney();
			temp.setSumPercent(d1/d2 * 100);
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgUuid());			// treenode.id
			n.setText(temp.getBdgname());		// treenode.text
			
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
	 * zhugx 保存对 概算金额编辑(右键编辑)数据
	 * @param bdgId6
	 * @return
	 */
	public int addOrUpdateBdgMoneyApp(OtherCompletionSub oc){
		int flag = 0;
		Double monthMoney = oc.getMonthMoney();
		if ( monthMoney == null || "".equals(monthMoney)){
			oc.setMonthMoney(new Double(0));
		}
		try {
			this.updateOthComp(oc);
			this.sumbdgMoneyApp(oc.getParent(),oc.getOtherUuid());
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * @author zhugx 删除合同金额概算树 
	 * @param bdgId
	 * @return
	 * @throws BusinessException 
	 * @throws SQLException 
	 */
	public int deleteChildNodeBdgMoneyApp(String appid) throws SQLException, BusinessException{
		int flag = 1; // 删除返回标志: 0为成功，1为失败
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.COMP_OTHER_SUB);
		OtherCompletionSub bma = (OtherCompletionSub) this.bdgMoneyDao.findById(beanName, appid);
		// 查询记录不存在返回失败
		if (bma == null) {
			return 1;
		}
		// 删除记录，并且改变节点统计金额
		this.bdgMoneyDao.delete(bma);
		
		// 以下是修改概算结构维护中的合同分摊总金额的和
		Long isLeaf = bma.getIsleaf();	
		String bdgUuid = bma.getBdgUuid();
		String parentId = bma.getParent();
		
		//父节点本身直接删除
		if(bma.getParent().equals("0104")){
			return 0;
		}
		
		//得到父节点容器
		String strParent = "bdgUuid = '" + bma.getParent() + "' and otherUuid= '"	+ bma.getOtherUuid() + "'";
		List list = (List) this.bdgMoneyDao.findByWhere(beanName, strParent);
		OtherCompletionSub bmaParent = (OtherCompletionSub) list.get(0);
		
		if(bmaParent.getParent().equals("0104")){
			if(null == bmaParent.getMonthMoney()){
				bmaParent.setMonthMoney(new Double("0"));
			}
			if(null == bma.getMonthMoney()){
				bma.setMonthMoney(new Double("0"));
			}
			Double r = bmaParent.getMonthMoney() - bma.getMonthMoney();
			bmaParent.setMonthMoney(r);	
		}else{
			this.sumbdgMoneyAppForDelete(bma);
		}
		
		flag = 0;

		// 查询这条记录父节点有几条子记录
		String strKid = "parent = '" + bmaParent.getBdgUuid() + "' and otherUuid= '"+ bma.getOtherUuid() + "'";
		
		List listKid = (List) this.bdgMoneyDao.findByWhere(beanName, strKid);

		//如果父节点对应子记录不存在，则传父节点id进行递归
		if (listKid.size() == 0) {
			this.deleteChildNodeBdgMoneyApp(bmaParent.getUuid());
		}

		// 返回标志
		return flag;
	}
	
	/**
	 * @author zhugx  合同金额概算金额统计(编辑时)
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgMoneyApp(String parentId, String id) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.COMP_OTHER_SUB;
		String str = "parent = '" + parentId + "' and otherUuid= '" + id + "'";
		List list = (List)this.bdgMoneyDao.findByWhere(beanName, str);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			OtherCompletionSub bma = (OtherCompletionSub) iterator.next();
			Double d = bma.getMonthMoney();
			if (d == null){
				d = new Double(0);
			}
			db += d;
		}
		String strParent = "bdgUuid = '" + parentId + "' and otherUuid= '" + id + "'";
		List  list3= (List)this.bdgMoneyDao.findByWhere(beanName,strParent);
		OtherCompletionSub  parentInfo =(OtherCompletionSub)list3.get(0);
		parentInfo.setMonthMoney(db);
		this.updateOthComp(parentInfo);
		
		if (!"0104".equals(parentInfo.getParent()))
			this.sumbdgMoneyApp(parentInfo.getParent(),id);
	}
	/**
	 * @author zhugx  合同金额概算金额统计(删除时)
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgMoneyAppForDelete(OtherCompletionSub bma) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.COMP_OTHER_SUB;
		String str = "parent = '" + bma.getParent() + "' and otherUuid= '" + bma.getOtherUuid() + "'";
		List list = (List)this.bdgMoneyDao.findByWhere(beanName, str);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			OtherCompletionSub obj_bdgInfo = (OtherCompletionSub) iterator.next();
				if (obj_bdgInfo.getBdgUuid().equals(bma.getBdgUuid())) continue;
			if (null != obj_bdgInfo.getMonthMoney())
				db += obj_bdgInfo.getMonthMoney();
		}
		
		String strParent = "bdgUuid = '" +  bma.getParent() + "' and otherUuid= '" +  bma.getOtherUuid() + "'";
		List  list3= (List)this.bdgMoneyDao.findByWhere(beanName,strParent);
		
		if (list3.size() > 0){
			OtherCompletionSub  parentInfo  =(OtherCompletionSub)list3.get(0);
			parentInfo.setMonthMoney(db);
			this.updateOthComp(parentInfo);
			this.sumbdgMoneyApp(parentInfo.getParent(),parentInfo.getOtherUuid());
		}
		
	}
	
	/**
	 * 对累计金额的计算
	 */
	public void sumMonthMoney(String id){
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.COMP_OTHER_SUB;
		OtherCompletionSub osc = (OtherCompletionSub)this.bdgMoneyDao.findById(beanName, id);
		osc.setSumMoney(osc.getMonthMoney());
		String sql = " ";
		JdbcTemplate jdbd = JdbcUtil.getJdbcTemplate();
	}

}
