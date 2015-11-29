package com.sgepit.pmis.budget.service;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.dao.BdgPayDAO;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgPayApp;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.budget.hbm.VBdgInfo;
import com.sgepit.pmis.budget.hbm.VBdgLibrary;
import com.sgepit.pmis.budget.hbm.VBdgmoneyapp;
import com.sgepit.pmis.budget.hbm.VBdgpayapp;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConPay;

public class BdgPayMgmImpl extends BaseMgmImpl implements BdgPayMgmFacade {

	private BdgPayDAO bdgPayDao;

	private BusinessException businessException;
	private Object[][] object;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static BdgPayMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (BdgPayMgmImpl) ctx.getBean("bdgPayMgm");
	}


	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	

	public void setBdgPayDao(BdgPayDAO bdgPayDao) {
		this.bdgPayDao = bdgPayDao;
	}	
	

	private String checkValidConbre(BdgPayApp bdgPay) {
		StringBuffer msg = new StringBuffer("");
		//项目编号不能为空
		if (bdgPay.getPid() == null || bdgPay.getPid().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_PID_IS_NULL));
			msg.append("<br>");
			
		}
		return msg.toString();
		
	}
	
	private boolean checkUniqueConbre(BdgPayApp bdgPay) {
		String where = " pid = '" + bdgPay.getPid() + "' and payappid='" + bdgPay.getPayappid()+  "'";
		List list = this.bdgPayDao.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.BDG_PAY_APP), where);
		if (list.size() > 0) {
			return false;
		}
		return true;
	}


	
	public void deleteBdgPay(BdgPayApp bdgPay) throws SQLException,
	BusinessException {
	this.bdgPayDao.delete(bdgPay);
	
	}
	
	
	public void insertBdgPay(BdgPayApp bdgPay) throws SQLException,
		BusinessException {
	this.bdgPayDao.insert(bdgPay);
	
	}
	
	
	public void updateBdgPay(BdgPayApp bdgPay) throws SQLException,
		BusinessException {
	this.bdgPayDao.saveOrUpdate(bdgPay);

}
	
   //-----------------------------------------------------------------------------------------------------------
  // user method
  //------------------------------------------------------------------------------------------------------------

	/**
	 * 获得合同付款 - 树
	 * @author xiaos
	 * @param parentId
	 * @return json
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgPayTree(String parentId, String contId, String payid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + contId + "' and payappno = '" + payid + "' order by bdgid";
		List<VBdgpayapp> objects = this.bdgPayDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgpayapp"), str);
		Iterator<VBdgpayapp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			VBdgpayapp temp = (VBdgpayapp) itr.next();
			VBdgInfo bi = (VBdgInfo) this.bdgPayDao.findById(VBdgInfo.class.getName(), temp.getBdgid());
			if (bi ==null)	continue;
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setRealbdgmoney(bi.getConapp());
			temp.setSumrealmoney(bi.getConbdgappmoney());
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
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}		
/*	public List<ColumnTreeNode> bdgPayTree(String parentId, String contId, String payid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + contId + "' and payappno = '" + payid + "' order by bdgid";
		List<BdgPayApp> objects = this.bdgPayDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_PAY_APP), str);
		Iterator<BdgPayApp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgPayApp temp = (BdgPayApp) itr.next();
			BdgInfo bi = (BdgInfo) this.bdgPayDao.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), temp.getBdgid());
			if (bi ==null)	continue;
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			temp.setRealbdgmoney(bi.getBdgmoney());
			String s = "conid='" + contId + "' and bdgid='" + temp.getBdgid() + "'";
			List bm =  this.bdgPayDao.findByWhere(
			BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP),s);
			if (bm ==null)	continue;
			temp.setBdgmoney(((BdgMoneyApp)bm.get(0)).getRealmoney());
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
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		System.out.println(list);
		return list;
	}	*/

	/**
	 * 合同付款分摊 - 保存在合同金额树上选中的数据节点
	 * @author xiaos
	 * @param conid
	 * @param ids
	 * @throws BusinessException
	 * @return flag
	 */
	@SuppressWarnings("unchecked")
	public int savePayTree(String conid, String payid, String[] ids) throws BusinessException{
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		List dataList = new ArrayList();
		String pid ="";
		try {
			for (int i = 0; i < ids.length; i++) {
				String appid = ids[i];
				BdgMoneyApp bdgMoneyApp = (BdgMoneyApp)this.bdgPayDao.findById(beanName, appid);
				if(i==0)
					pid=bdgMoneyApp.getPid();
				//if (bdgMoneyApp.getIsleaf() == 0){
				String str = "bdgid = '" +bdgMoneyApp.getBdgid() + "'" + " and conid='" + conid + "' and payappno='" + payid + "'" ;
				List list = (List) this.bdgPayDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_PAY_APP), str);
				if (list.size() > 0){
					continue ;
				}					
				//}				
				BdgPayApp bdgPayApp = new BdgPayApp();
				bdgPayApp.setPid(bdgMoneyApp.getPid());
				bdgPayApp.setBdgid(bdgMoneyApp.getBdgid());
				bdgPayApp.setConid(conid);
				bdgPayApp.setPayappno(payid);
				bdgPayApp.setFactpay(new Double(0));
				bdgPayApp.setApplypay(new Double(0));
				bdgPayApp.setPasspay(new Double(0));
				bdgPayApp.setIsleaf(bdgMoneyApp.getIsleaf());
				bdgPayApp.setParent(bdgMoneyApp.getParent());
				this.bdgPayDao.insert(bdgPayApp);
				PcDynamicData pdd = new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(BdgPayApp.class.getName());
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgPayApp.class.getName()));
				pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
				pdd.setPctableuids(bdgPayApp.getPayappid());
				pdd.setPcurl(DynamicDataUtil.BDG_PAYAPP_URL);
				pdd.setPid(bdgPayApp.getPid());
				this.bdgPayDao.insert(pdd);
				dataList.add(bdgPayApp);
				dataList.add(pdd);
			}
		} catch (RuntimeException e) {
			flag = 1; e.printStackTrace();
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","保存付款分摊结构");
			dataExchangeService.addExchangeListToQueue(ExchangeList);			
		}
		return flag;
	}

	
	/**
	 * 合同付款分摊 - 新增、修改节点
	 * @author xiaos
	 * @param bdgInfo
	 * @return
	 */
	@SuppressWarnings("all")
	public int addOrUpdateBdgPayApp(BdgPayApp bdgPayApp){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_PAY_APP;
		List dataList = new ArrayList();
		try {
			if ("".equals(bdgPayApp.getPayappid())){
				String strWhere = "parent = '" + bdgPayApp.getParent() + "' and conid = '" + bdgPayApp.getConid()+ "' and payappno = '" + bdgPayApp.getPayappno() + "'";
				List list = (List)this.bdgPayDao.findByWhere(beanName, strWhere);
				if (list.isEmpty()){
					BdgPayApp parentBdg = (BdgPayApp)(this.bdgPayDao.findByProperty(beanName, "bdgid", bdgPayApp.getParent())).get(0);
					//BdgPayApp parentBdg = (BdgInfo)this.budgetDAO.findById(beanName, bdgPayApp.getParent());
					parentBdg.setIsleaf(new Long(0));
					this.bdgPayDao.saveOrUpdate(parentBdg);
					PcDynamicData  pdd = new PcDynamicData();
					pdd.setPcdynamicdate(new Date());
					pdd.setPctablebean(beanName);
					pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
					pdd.setPcurl(DynamicDataUtil.BDG_PAYAPP_URL);
					pdd.setPid(parentBdg.getPid());
					pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					pdd.setPctableuids(parentBdg.getPayappid());
					this.bdgPayDao.insert(pdd);
					List data1List = new ArrayList();
					data1List.add(parentBdg);
					data1List.add(pdd);
					if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
						PCDataExchangeService dataExchangeService = 
							(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
						List ExchangeList = dataExchangeService.getExcDataList(data1List, Constant.DefaultOrgRootID,parentBdg.getPid(),"","","保存付款分摊金额");
						dataExchangeService.addExchangeListToQueue(ExchangeList);						
					}
				}
				this.bdgPayDao.insert(bdgPayApp);
				PcDynamicData  pdd = new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(beanName);
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
				pdd.setPcurl(DynamicDataUtil.BDG_PAYAPP_URL);
				pdd.setPid(bdgPayApp.getPid());
				pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
				pdd.setPctableuids(bdgPayApp.getPayappid());
				this.bdgPayDao.insert(pdd);
				dataList.add(bdgPayApp);
				dataList.add(pdd);
				
			}else{
				this.bdgPayDao.saveOrUpdate(bdgPayApp);
				PcDynamicData  pdd = new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(beanName);
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
				pdd.setPcurl(DynamicDataUtil.BDG_PAYAPP_URL);
				pdd.setPid(bdgPayApp.getPid());
				pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
				pdd.setPctableuids(bdgPayApp.getPayappid());
				this.bdgPayDao.insert(pdd);
				dataList.add(bdgPayApp);
				dataList.add(pdd);
			}
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgPayApp.getPid(),"","","保存付款分摊金额");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}
			this.sumPayMoneyHandler(bdgPayApp.getParent(), bdgPayApp.getConid(), bdgPayApp.getPayappno());
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 合同付款分摊 - 删除节点
	 * @author xiaos
	 * @param bdgId
	 * @return
	 */
	public int deletePayChildNode(String payappid){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_PAY_APP;
		try {
			BdgPayApp bdgPayApp = (BdgPayApp)this.bdgPayDao.findById(beanName, payappid);
			if (null == bdgPayApp) return flag;
			String strWhere = "parent = '" + bdgPayApp.getParent() + "' and conid = '" + bdgPayApp.getConid() + "' and payappno = '" + bdgPayApp.getPayappno() + "'";
			List list = (List)this.bdgPayDao.findByWhere(beanName, strWhere);
			if (list != null){
				if (list.size() == 1){
					String strPWhere = "bdgid = '" + bdgPayApp.getParent() + "' and conid = '" + bdgPayApp.getConid() + "' and payappno = '" + bdgPayApp.getPayappno() + "'";
					List list2 = (List)this.bdgPayDao.findByWhere(beanName, strPWhere);
					if (list2.size() > 0){
						BdgPayApp parentBdg = (BdgPayApp)list2.get(0);
						parentBdg.setIsleaf(new Long("1"));
						this.bdgPayDao.saveOrUpdate(parentBdg);
						String uuid = parentBdg.getPayappid();
						this.bdgPayDao.delete(bdgPayApp);
						List dataList = new ArrayList();
						dataList.add(parentBdg);
						dataList.add(bdgPayApp);
						if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
							PCDataExchangeService dataExchangeService = 
								(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
							List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,parentBdg.getPid(),"","","删除付款分摊");
							dataExchangeService.addExchangeListToQueue(ExchangeList);
						}
						this.deletePayChildNode(uuid);
					}
				}
				this.bdgPayDao.delete(bdgPayApp);
				List dataList = new ArrayList();
				dataList.add(bdgPayApp);
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgPayApp.getPid(),"","","删除付款分摊");
					dataExchangeService.addExchangeListToQueue(ExchangeList);
				}
			}else{
				flag = 1;
			}
			
			this.sumForPayDelete(bdgPayApp);
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 合同付款分摊 - 累计（新增、修改时）
	 * author xiaos
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public void sumPayMoneyHandler(String parentId, String conid, String payid) throws SQLException, BusinessException{
		Double dbApppay = new Double(0);
		Double applyPay = new Double(0);
		String strWhere = "parent = '" + parentId + "' and conid = '" + conid+ "' and payappno = '" + payid + "'";
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_PAY_APP;
		List list = (List)this.bdgPayDao.findByWhere(beanName, strWhere);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgPayApp obj_bdgPayApp = (BdgPayApp) iterator.next();
			dbApppay += obj_bdgPayApp.getFactpay();
			applyPay += obj_bdgPayApp.getApplypay();
		}
		String strParentWhere = "bdgid = '" + parentId + "' and conid = '" + conid+ "' and payappno = '" + payid + "'";
		List list2 = this.bdgPayDao.findByWhere(beanName, strParentWhere);
		if (list2.size() > 0){
			BdgPayApp parentPayApp = (BdgPayApp)list2.get(0);
			parentPayApp.setFactpay(dbApppay);
			parentPayApp.setApplypay(applyPay);
			this.bdgPayDao.saveOrUpdate(parentPayApp);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(beanName);
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
			pdd.setPcurl(DynamicDataUtil.BDG_PAYAPP_URL);
			pdd.setPid(parentPayApp.getPid());
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
			pdd.setPctableuids(parentPayApp.getPayappid());
			this.bdgPayDao.insert(pdd);
			List dataList = new ArrayList();
			dataList.add(parentPayApp);
			dataList.add(pdd);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,parentPayApp.getPid(),"","","新增修改时累计付款");
				dataExchangeService.addExchangeListToQueue(ExchangeList);			
			}
			if (!"0".equals(parentPayApp.getParent()))
				sumPayMoneyHandler(parentPayApp.getParent(), conid, payid);
		}
	}
	
	/**
	 * 合同付款分摊 - 累计（删除时）
	 * @author xiaos
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumForPayDelete(BdgPayApp bdgPayApp) throws SQLException, BusinessException{
		Double dbApppay = new Double(0);
		Double applyPay = new Double(0);
		String strWhere = "parent = '" + bdgPayApp.getParent() + "' and conid = '" + bdgPayApp.getConid()+ "' and payappno = '" + bdgPayApp.getPayappno() + "'";
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_PAY_APP;
		List list = (List)this.bdgPayDao.findByWhere(beanName, strWhere);
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgPayApp obj_bdgPayApp = (BdgPayApp) iterator.next();
			if (obj_bdgPayApp.getPayappid().equals(bdgPayApp.getPayappid())) continue;
			dbApppay += obj_bdgPayApp.getFactpay();
			applyPay += obj_bdgPayApp.getApplypay();
		}
		String strParentWhere = "bdgid = '" + bdgPayApp.getParent() + "' and conid = '" + bdgPayApp.getConid() + "' and payappno = '" + bdgPayApp.getPayappno() + "'";
		List list2 = this.bdgPayDao.findByWhere(beanName, strParentWhere);
		if (list2.size()>0){
			BdgPayApp parentPay = (BdgPayApp)list2.get(0);
			parentPay.setFactpay(dbApppay);
			parentPay.setApplypay(applyPay);
			this.bdgPayDao.saveOrUpdate(parentPay);
			List dataList = new ArrayList();
			dataList.add(parentPay);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,parentPay.getPid(),"","","删除时累计付款");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
			this.sumPayMoneyHandler(parentPay.getParent(), parentPay.getConid(), parentPay.getPayappno());
		}
	}
	
	/*
	 * payappno:合同付款编号
	 * payappid：合同付款分摊编号
	 * flag 0没有子节点；1有子节点
	 */
	public String checkifhavaChild(String payappno,String parentno){
		String flag = "1";
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_PAY_APP);
		String strWhere = "payappno = '"+payappno+"' and parent = '"+ parentno +"'";
		List list = this.bdgPayDao.findByWhere(beanName, strWhere);
		if(list.isEmpty())
			flag = "0";
		return flag;
	}


	@SuppressWarnings("all")
	public String checkAppPay(String payid, String pid, String bdgid,
			String applyMoney, String realMoney) {
		   String applySql ="select  nvl(payapp.applypay,0) from bdg_pay_app payapp  where payapp.payappno='"+payid+"' and payapp.pid='"+pid+"' and payapp.parent='0'";
		   List applyList = bdgPayDao.getDataAutoCloseSes(applySql);
		   double applymoney =0d;
		   if(applyList.size()>0){
			   applymoney+=((BigDecimal)applyList.get(0)).doubleValue();
		   }
		   if(applyMoney!=null&&!"".equals(applyMoney)){
			   applymoney+=Double.valueOf(applyMoney);
		   }
		   String currApply="select  nvl(payapp.applypay,0),nvl(payapp.factpay,0) from bdg_pay_app payapp  where payapp.payappno='"+payid+"' and payapp.pid='"+pid+"' and payapp.bdgid='"+bdgid+"'";
		   List currApplyList = bdgPayDao.getDataAutoCloseSes(currApply);
		   if(currApplyList.size()>0){
			   Object[] objs = (Object[])currApplyList.get(0);
			   applymoney-=((BigDecimal)objs[0]).doubleValue();
		   }
		   ConPay conPay=(ConPay)bdgPayDao.findById(ConPay.class.getName(),payid);
		   if(conPay!=null){
			   if(applymoney>conPay.getAppmoney()){
				   return "1";//申请付款大于分摊
			   }
		   }
		   // 实际付款
		   String realSql ="select  nvl(payapp.factpay,0) from bdg_pay_app payapp  where payapp.payappno='"+payid+"' and payapp.pid='"+pid+"' and payapp.parent='0'";
		   List realList = bdgPayDao.getDataAutoCloseSes(realSql);
		   double realmoney=0d;
		   if(realList.size()>0){
			   realmoney+=((BigDecimal)realList.get(0)).doubleValue();
		   }
		   if(realMoney!=null&&!"".equals(realMoney)){
			   realmoney+=Double.valueOf(realMoney);
		   }
		   if(currApplyList.size()>0){
			   Object [] objs =(Object [])currApplyList.get(0);
			   realmoney-=((BigDecimal)objs[1]).doubleValue();
		   }
		   if(conPay!=null){
			   if(realmoney>conPay.getPaymoney()){
				   return "2";//实际付款金额异常
			   }
		   }
		   //付款分摊统计的各项目的合同累计付款分摊金额如果大于合同分摊金额
		   String payTotal ="select nvl(sum(nvl(app.factpay,0)),0)  from bdg_pay_app app where app.pid='"+pid+"' and app.parent='0'";
		   List payTotalList = bdgPayDao.getDataAutoCloseSes(payTotal);
		   double totalPay=0d;//累计付款金额
		   if(payTotalList.size()>0){
			   totalPay+=((BigDecimal)payTotalList.get(0)).doubleValue();
		   }
		   if(currApplyList.size()>0){
			   Object[] objs=   (Object[])currApplyList.get(0);
			   totalPay-=((BigDecimal)objs[1]).doubleValue();
		   }
		   if(realMoney!=null&&!"".equals(realMoney)){
			   totalPay+=Double.valueOf(realMoney);
		   }
		   
		   double totalApp=0d;//累计分摊金额
		   List listbdg =bdgPayDao.findByWhere(VBdgInfo.class.getName(),"pid='"+pid+"' and parent='0'" );
		   if(listbdg.size()>0){
			   VBdgInfo bdgInfo=(VBdgInfo)listbdg.get(0);
			   if(totalPay>bdgInfo.getConbdgappmoney()){
				   return "3";
			   }
		   }
		   
		   String totalSql ="select nvl(sum(nvl(app.factpay,0)),0) from bdg_pay_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgid+"'  and app.payappno<>'"+payid+"'";
		   double  totalmoney=0d;
		   List totalList = bdgPayDao.getDataAutoCloseSes(totalSql);
		   if(totalList.size()>0){
			   totalmoney+=((BigDecimal)totalList.get(0)).doubleValue();
		   }
		   if(realMoney!=null&&!"".equals(realMoney)){
			   totalmoney+=Double.valueOf(realMoney);
		   }
		   List currProBdg =bdgPayDao.findByWhere(VBdgInfo.class.getName(),"pid='"+pid+"' and bdgid='"+bdgid+"'" );
		   if(currProBdg.size()>0){
			   VBdgInfo bdgInfo=(VBdgInfo)currProBdg.get(0);
			   if(totalmoney>bdgInfo.getConbdgappmoney()){
				   return "4";
			   }
		   }
		   return "";
	}
	
	/**
	 * 合同付款分摊 - 保存在合同金额树上选中的数据节点
	 * @author shangtw
	 * @param conid
	 * @param ids
	 * @throws BusinessException
	 * @return flag
	 */
	@SuppressWarnings("unchecked")
	public int savePayLibraryTree(String conid, String payid, String[] ids) throws BusinessException{
		int flag = 0;
		String beanName =BusinessConstants.BDG_PACKAGE.concat("VBdgConApp");
		List dataList = new ArrayList();
		String pid ="";
		String strSql="";
		String bdgid="";
		try {
			for (int i = 0; i < ids.length; i++) {
				bdgid = ids[i];
				strSql = "bdgid = '%s' and conid = '%s' order by bdgid";
				strSql= String.format(strSql, bdgid, conid);
				List<VBdgConApp> objects = this.bdgPayDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strSql);
				VBdgConApp vbdgconapp=new VBdgConApp();
				if(objects!=null&&objects.size()>0)
					vbdgconapp=objects.get(0);
				if(i==0)
					pid=vbdgconapp.getPid();
				//if (bdgMoneyApp.getIsleaf() == 0){
				String str = "bdgid = '" +bdgid+ "'" + " and conid='" + conid + "' and payappno='" + payid + "'" ;
				List list = (List) this.bdgPayDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_PAY_APP), str);
				if (list.size() > 0){
					continue ;
				}					
				//}				
				BdgPayApp bdgPayApp = new BdgPayApp();
				bdgPayApp.setPid(vbdgconapp.getPid());
				bdgPayApp.setBdgid(vbdgconapp.getBdgid());
				bdgPayApp.setConid(conid);
				bdgPayApp.setPayappno(payid);
				bdgPayApp.setFactpay(new Double(0));
				bdgPayApp.setApplypay(new Double(0));
				bdgPayApp.setPasspay(new Double(0));
				bdgPayApp.setIsleaf(vbdgconapp.getIsleaf());
				bdgPayApp.setParent(vbdgconapp.getParent());
				this.bdgPayDao.insert(bdgPayApp);
				PcDynamicData pdd = new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(BdgPayApp.class.getName());
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgPayApp.class.getName()));
				pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
				pdd.setPctableuids(bdgPayApp.getPayappid());
				pdd.setPcurl(DynamicDataUtil.BDG_PAYAPP_URL);
				pdd.setPid(bdgPayApp.getPid());
				this.bdgPayDao.insert(pdd);
				dataList.add(bdgPayApp);
				dataList.add(pdd);
			}
		} catch (RuntimeException e) {
			flag = 1; e.printStackTrace();
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","保存付款分摊结构");
			dataExchangeService.addExchangeListToQueue(ExchangeList);			
		}
		return flag;
	}
	/**
	 * shangtw  获得选择后的树(合同付款分摊)
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgPayTreeGrid(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String contId=(String)map.get("conid");
		String payid=(String)map.get("payid");	
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + contId + "' and payappno = '" + payid + "' order by bdgid";
		List<VBdgpayapp> objects = this.bdgPayDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgpayapp"), str);
		Iterator<VBdgpayapp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			VBdgpayapp temp = (VBdgpayapp) itr.next();
			VBdgInfo bi = (VBdgInfo) this.bdgPayDao.findById(VBdgInfo.class.getName(), temp.getBdgid());
			if (bi ==null)	continue;
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setRealbdgmoney(bi.getConapp());
			temp.setSumrealmoney(bi.getConbdgappmoney());
			
		}
		List newList=DynamicDataUtil.changeisLeaf(objects, "isleaf");
		return newList;
	}		

}
