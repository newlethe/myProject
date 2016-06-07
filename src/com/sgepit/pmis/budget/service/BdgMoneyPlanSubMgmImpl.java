package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.budget.dao.BdgMoneyPlanSubDAO;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgMoneyPlanMain;
import com.sgepit.pmis.budget.hbm.BdgMoneyPlanSub;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConOve;


public class BdgMoneyPlanSubMgmImpl extends BaseMgmImpl implements
		BdgMoneyPlanSubMgmFacade {
	
	private BdgMoneyPlanSubDAO bdgMoneyPlanSubDAO;

	public BdgMoneyPlanSubDAO getBdgMoneyPlanSubDAO() {
		return bdgMoneyPlanSubDAO;
	}

	public void setBdgMoneyPlanSubDAO(BdgMoneyPlanSubDAO bdgMoneyPlanSubDAO) {
		this.bdgMoneyPlanSubDAO = bdgMoneyPlanSubDAO;
	}

	public String deletePlanSub(BdgMoneyPlanSub bdgMoney) throws SQLException,
			BusinessException {
		// TODO Auto-generated method stub
		this.bdgMoneyPlanSubDAO.delete(bdgMoney);
		return null;
	}

	public String insertPlanSub(BdgMoneyPlanSub bdgMoney) throws SQLException,
			BusinessException {
		// TODO Auto-generated method stub
		this.bdgMoneyPlanSubDAO.insert(bdgMoney);
		return null;
	}

	public String updatePlanSub(BdgMoneyPlanSub bdgMoney) throws SQLException,
			BusinessException {
		// TODO Auto-generated method stub
		this.bdgMoneyPlanSubDAO.saveOrUpdate(bdgMoney);
		return null;
	}
	
	//user methods
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,String parentId,Map params)throws BusinessException{
		List <ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if(treeName.equalsIgnoreCase("getBudgetTree")){
			String mainId = ((String[]) params.get("mainid"))[0];
			list = this.getBudgetTree(parentId, mainId);
		}
		if(treeName.equals("planSubTree")){
			String mainId = ((String[]) params.get("mainid"))[0];
			list = this.planSubTree(parentId, mainId);
		}
		return list;
	}
	
	//投资计划选择的概算树
	public List<ColumnTreeNode> getBudgetTree(String parentId,String mainId) throws BusinessException{
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId !=null?parentId:"0";
		String str = "parent = '"+ parent +"' order by bdgid ";
		List<BdgInfo> objects = this.bdgMoneyPlanSubDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), str);
		Iterator<BdgInfo> itr = objects.iterator();
		while(itr.hasNext()){
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgInfo temp = itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getBdgid());
			n.setText(temp.getBdgname());
			if(leaf == 1){
				n.setLeaf(true);
				n.setIconCls("task");
			}else{
				n.setLeaf(false);
				n.setCls("master-task");
				n.setIconCls("task-folder");
			}
			cn.setTreenode(n);
			
			JSONObject jo = JSONObject.fromObject(temp);
			List lt = this.bdgMoneyPlanSubDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_PLAN_SUB), 
					"mainid = '"+ mainId +"' and bdgid = '"+ temp.getBdgid() +"'");
			if(leaf == 1 && lt != null && lt.size()>0)
				jo.accumulate("ischeck", "true");
			else
				jo.accumulate("ischeck", "false");
			cn.setColumns(jo);
			list.add(cn);
		}
		return list;
	}
	
	//保存选择的子树 工程量投资计划
	public void savePlanSubTree(String mainId,String[] ids){
		for(int i = 0; i < ids.length; i++){
			BdgMoneyPlanSub sub = new BdgMoneyPlanSub();
			BdgInfo bdgInfo = (BdgInfo) this.bdgMoneyPlanSubDAO.findById(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), ids[i]);
			String str = "bdgid = '"+ bdgInfo.getBdgid() +"' and mainid = '"+ mainId +"' ";
			List list = this.bdgMoneyPlanSubDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_PLAN_SUB), str);
			if(list.size()>0)
				continue;
			sub.setMainid(mainId);
			sub.setPid(bdgInfo.getPid());
			sub.setBdgid(bdgInfo.getBdgid());
			sub.setIsleaf(bdgInfo.getIsleaf());
			sub.setParent(bdgInfo.getParent());
			sub.setPlanmoney(new Double(0));
			if(bdgInfo.getIsleaf() == 1)
				sub.setBdgconids(this.getBdgAppConids(bdgInfo.getBdgid()));
			else
				sub.setBdgconids("");
			this.bdgMoneyPlanSubDAO.insert(sub);
		}
	}
	
	//工程量投资计划树
	public List<ColumnTreeNode> planSubTree(String parentId,String mainId)throws BusinessException{
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId !=null&&!parentId.equals("")?parentId:"0";
		String str = "parent = '"+ parent +"' and mainid = '"+ mainId +"' order by bdgid ";
		List<BdgMoneyPlanSub> objects = this.bdgMoneyPlanSubDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_PLAN_SUB), str);
		Iterator<BdgMoneyPlanSub> itr = objects.iterator();
		
		while(itr.hasNext()){
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgMoneyPlanSub temp = itr.next();
			BdgInfo bi = (BdgInfo) this.bdgMoneyPlanSubDAO.findById(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), temp.getBdgid());
			if(bi == null)
				continue;
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setTotalappmoney(bi.getContmoney());
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getId());
			n.setText(bi.getBdgname());
			if(leaf == 1){
				n.setLeaf(true);
				n.setIconCls("task");
				if(temp.getBdgconids()!=null)
					temp.setConnames(this.getBdgAppConnames(temp.getBdgconids()));
				else
					temp.setConnames("");
			}else{
				n.setLeaf(false);
				n.setCls("master-task");
				n.setIconCls("task=folder");
				temp.setConnames("");
			}
			cn.setTreenode(n);
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);
			list.add(cn);
		}
		return list;
	}
	
	//根据概算编号得到该概算分摊下的合同编号集合
	public String getBdgAppConids(String bdgid){
		String strs = "";
		List<BdgMoneyApp> objects = this.bdgMoneyPlanSubDAO.findByProperty(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), "bdgid", bdgid);
		if(objects.isEmpty())
			return "";
		Iterator<BdgMoneyApp> itr = objects.iterator();
		while(itr.hasNext()){
			BdgMoneyApp temp = itr.next();
			if(strs.equals(""))
				strs = "'"+temp.getConid()+"'";
			else
				strs = strs.concat(",'"+temp.getConid()+"'");
		}
		return strs;
	}
	
	//根据概算编号得到该概算分摊下的合同名称集合
	public String getBdgAppConnames(String conids){
		String strs = "";
		if(conids.equals(""))
			return "";
		String strWhere = "conid in ("+ conids +")";
		List<ConOve> objects = this.bdgMoneyPlanSubDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), strWhere, "conid");
		if(objects.isEmpty())
			return "";
		Iterator<ConOve> itr = objects.iterator();
		while(itr.hasNext()){
			ConOve temp = itr.next();
			if(strs.equals(""))
				strs = temp.getConname();
			else
				strs = strs.concat("。").concat(temp.getConname());
		}
		return strs;
	}	
	
	//保存对投资计划树金额的数据 右键点编辑时
	public String updatePlanSubtree(BdgMoneyPlanSub bdgMoneyPlanSub){
		String flag = "0";
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_PLAN_SUB);
		String parentid = bdgMoneyPlanSub.getParent();
		String mainid = bdgMoneyPlanSub.getMainid();
		try{
			this.bdgMoneyPlanSubDAO.saveOrUpdate(bdgMoneyPlanSub);
			this.sumplanMoney(parentid, mainid);
		}catch(SQLException e){
			flag = "1";
			e.printStackTrace();
		}catch(BusinessException e){
			flag = "1";
			e.printStackTrace();
		}
		return flag;
	}
	
	//工程计划量投资金额统计，根据底层节点更新父节点的投资金额
	public void sumplanMoney(String parentid,String mainid) throws SQLException,BusinessException{
		Double db = new Double(0);
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_PLAN_SUB);
		String str = "parent = '"+ parentid +"' and mainid = '"+ mainid +"'";
		List list = this.bdgMoneyPlanSubDAO.findByWhere(beanName, str);
		
		for(Iterator itr = list.iterator();itr.hasNext();){
			BdgMoneyPlanSub plan = (BdgMoneyPlanSub) itr.next();
			Double d = plan.getPlanmoney();
			if(d == null)
				d = new Double(0);
			db += d;
		}
		
		String strParent = "bdgid = '"+ parentid +"' and mainid = '"+ mainid +"'";
		List list3 = this.bdgMoneyPlanSubDAO.findByWhere(beanName, strParent);
		if(list3.size()>0){
			BdgMoneyPlanSub parentPlan = (BdgMoneyPlanSub) list3.get(0);
			parentPlan.setPlanmoney(db);
			this.updatePlanSub(parentPlan);
			if(parentPlan.getParent().equals("0")){
				BdgMoneyPlanMain mainPlan = (BdgMoneyPlanMain) this.bdgMoneyPlanSubDAO.findById(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_PLAN_MAIN),mainid);
				mainPlan.setPlanTotal(db);
				this.bdgMoneyPlanSubDAO.saveOrUpdate(mainPlan);
			}else{
				this.sumplanMoney(parentPlan.getParent(), mainid);
			}
		}
	}

	//删除投资计划树的子节点
	public String deleteChildNodePlanSub(String id)throws BusinessException, SQLException{
		String flag = "0";
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_PLAN_SUB);
		BdgMoneyPlanSub sub = (BdgMoneyPlanSub) this.bdgMoneyPlanSubDAO.findById(beanName, id);
		String parentid = sub.getParent();
		String mainid = sub.getMainid();
		String where = "parent = '"+ parentid +"' and mainid = '"+ mainid +"'";
		List list = this.bdgMoneyPlanSubDAO.findByWhere(beanName, where);
		
		try{
			if(!sub.getBdgid().equals("0")){
				this.deletePlanSub(sub);
				this.sumplanMoney(parentid, mainid);
				if(list.size() == 1){
					String strParent = "bdgid = '"+ parentid +"' and mainid = '"+ mainid +"'";
					List listPa = this.bdgMoneyPlanSubDAO.findByWhere(beanName, strParent);
					if(listPa.size()>0){
						BdgMoneyPlanSub subPa = (BdgMoneyPlanSub) listPa.get(0);
						this.deleteChildNodePlanSub(subPa.getId());
					}
				}
			}else{
				flag = "1";
			}
		}catch(BusinessException e){
			flag = "1";
			e.printStackTrace();
		}catch(SQLException e){
			flag = "1";
			e.printStackTrace();			
		}
		return flag;
	}

	//检查主记录下面是否存在子树，存在则返回1，不存在则返回0
	public String checkMaintoSub(String mainid){
		String flag = "0";
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_PLAN_SUB);
		List list = this.bdgMoneyPlanSubDAO.findByProperty(beanName, "mainid", mainid);
		if(list.size()>0)
			flag = "1";
		return flag;
	}
	
	
}
