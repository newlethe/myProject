package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.pmis.budget.dao.BdgMoneyPlanConDAO;
import com.sgepit.pmis.budget.hbm.BdgMoneyPlanCon;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.contract.hbm.ConPay;

public class BdgMoneyPlanConMgmImpl extends BaseMgmImpl implements
		BdgMoneyPlanConMgmFacade {
	
	
	BdgMoneyPlanConDAO bdgMoneyPlanConDAO;
	
	ContractDAO contractDAO;

	public static BdgMoneyPlanConMgmImpl getFromApplicationContext(ApplicationContext ctx){
		return (BdgMoneyPlanConMgmImpl) ctx.getBean("bdgMoneyPlanConMgmImpl");
	}
	
	//setters
	public void setBdgMoneyPlanConDAO(BdgMoneyPlanConDAO bdgMoneyPlanConDAO) {
		this.bdgMoneyPlanConDAO = bdgMoneyPlanConDAO;
	}	

	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}
	
	//interface function
	public String deleteBdgMoneyPlanCon(BdgMoneyPlanCon planCon)
			throws SQLException, BusinessException {
		// TODO Auto-generated method stub
		return null;
	}

	public String insertBdgMoneyPlanCon(BdgMoneyPlanCon planCon)
			throws SQLException, BusinessException {
		// TODO Auto-generated method stub
		return null;
	}

	public String updateBdgMoneyPlanCon(BdgMoneyPlanCon planCon)
			throws SQLException, BusinessException {
		// TODO Auto-generated method stub
		return null;
	}
	
	//user
	/**
	 * 合同分类-合同树
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,String paramentId,Map params) throws BusinessException{
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if(treeName.equalsIgnoreCase("bdgMoneyPlanCon"))
			list = getConListTree(paramentId);
		return list;
	}	
	
	//合同分类树，第一层为合同分类（把合同分类依次取出来利用合同对象作为载体存储），第二层为具体合同列表
	public List<ColumnTreeNode> getConListTree(String parentId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String concode = "合同划分类型";
		if(parentId == null ||parentId.equals("")){
			ApplicationMgmFacade applicationMgmImpl = (ApplicationMgmFacade)Constant.wact.getBean("applicationMgm");
			List typeList = applicationMgmImpl.getCodeValue(concode);
			Iterator typeItr = typeList.iterator();
			while(typeItr.hasNext()){
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				PropertyCode conType = (PropertyCode) typeItr.next();
				ConOve con = new ConOve();
				con.setConid(conType.getUids());
				con.setCondivno(conType.getPropertyCode()); //把合同分类层节点的合同类型 作为父节点
				con.setConname(conType.getPropertyName());
				
				
				//假借PID字段来存储 合同划分类型 和具体合同的区别：PID为"合同划分类型"的为合同划分类型，反之则为具体合同
				con.setPid("合同划分类型");              
				n.setText(con.getConname());
				n.setId(con.getConid());
				n.setLeaf(false);
				n.setCls("master-task");
				n.setIconCls("icon-pkg");
				cn.setTreenode(n);
				JSONObject jo = JSONObject.fromObject(con);
				cn.setColumns(jo);
				list.add(cn);
			}
		}else{
			String str = "condivno = '"+ parentId +"' order by conno";
			List<ConOve>  conList = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), str);
			Iterator<ConOve> conItr = conList.iterator();
			while(conItr.hasNext()){
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				ConOve conTemp = conItr.next();
				n.setText(conTemp.getConname());
				n.setId(conTemp.getConid());
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
				cn.setTreenode(n);
				JSONObject jo = JSONObject.fromObject(conTemp);
				cn.setColumns(jo);
				list.add(cn);				
			}
		}
		return list;
	}

	public double getConPayTotal(String conid) {
		List ls = contractDAO.findByProperty(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_PAY), "conid", conid);
		double fl = 0;
		ConPay pay = null;
		for (int i = 0; i < ls.size(); i++) {
			pay = (ConPay) ls.get(i);
			fl = fl + pay.getPaymoney();
		}
		return fl;
	}
}
