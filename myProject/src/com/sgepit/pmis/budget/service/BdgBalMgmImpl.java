package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
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
import com.sgepit.pmis.budget.dao.BdgBalDAO;
import com.sgepit.pmis.budget.hbm.BdgBalApp;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.common.BusinessConstants;

public class BdgBalMgmImpl extends BaseMgmImpl implements BdgBalMgmFacade {

	private BdgBalDAO bdgBalDao;

	private BusinessException businessException;
	private Object[][] object;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static BdgBalMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (BdgBalMgmImpl) ctx.getBean("bdgBalMgm");
	}


	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	
	public void setBdgBalDao(BdgBalDAO bdgBalDao) {
		this.bdgBalDao = bdgBalDao;
	}

	
	/*
	private String checkValidConbre(BdgPayApp bdgPay) {
		StringBuffer msg = new StringBuffer("");
		//项目编号不能为空
		if (bdgPay.getPid() == null || bdgPay.getPid().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_PID_IS_NULL));
			msg.append("<br>");
			
		}
		
		if (conbre.getBrework() == null || conbre.getBrework().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_BREWORK_IS_NOT_NULL));
			msg.append("<br>");	
		}
		
		//检查数据是否唯一
		String where = " pid = '" + bdgPay.getPid() + "' and breappid='" + bdgBreach.getBreappid() + "'  and conid <> '" + bdgBreach.getConid() + "'";;
		List list = this.bdgPayDao.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), where);		
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
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

	*/	
	public void deleteBdgBal(BdgBalApp bdgBal) throws SQLException,
		BusinessException {
	this.bdgBalDao.delete(bdgBal);
	
	}
	
	
	public void insertBdgBal(BdgBalApp bdgBal) throws SQLException,
		BusinessException {
	this.bdgBalDao.insert(bdgBal);
	
	}
	
	
	public void updateBdgBal(BdgBalApp bdgBal) throws SQLException,
		BusinessException {
	this.bdgBalDao.saveOrUpdate(bdgBal);
	
	}
	
	public List<ColumnTreeNode> bdgBalTree(String parentId, String contId, String balId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		/*String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + contId + "' and payappno = '" + balid + "' order by bdgid";
		List<BdgPayApp> objects = this.bdgBalDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BALANCE_APP), str);
		Iterator<BdgPayApp> itr = objects.iterator();*/
		
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + contId+ "' and balid = '" + balId + "' order by bdgid";
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO);
		
		List<BdgBalApp> objects = this.bdgBalDao.findByWhere(
				BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BALANCE_APP), str);
		Iterator<BdgBalApp> itr = objects.iterator();	
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgBalApp temp = (BdgBalApp) itr.next();
			BdgInfo bi = (BdgInfo) this.bdgBalDao.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), temp.getBdgid());
			if (bi ==null)	continue;
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			String s = "conid='" + contId + "' and bdgid='" + temp.getBdgid() + "'";
			List bm =  this.bdgBalDao.findByWhere(
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
		return list;
	}

  //-----------------------------------------------------------------------------------------------------------
  // user method
  //------------------------------------------------------------------------------------------------------------

	/**
	 * 获得结算概算 - 树
	 * @author xiaos
	 * @param parentId
	 * @return json
	 * @throws BusinessException
	 */
	public String bdgBalTreeStr(String parentId, String conid, String balid)throws BusinessException {
		StringBuffer sbf = new StringBuffer("[");
		try {
			String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
			String str = "parent = '" + parent + "' and conid = '" + conid+ "' and balid = '" + balid + "' order by bdgid";
			String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO);
			
			List list = this.bdgBalDao.findByWhere(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BALANCE_APP), str);
			Iterator itr = list.iterator();
			while (itr.hasNext()) {
				BdgBalApp temp = (BdgBalApp) itr.next();
				BdgInfo bdgInfo = (BdgInfo)this.bdgBalDao.findById(beanName, temp.getBdgid());
				String s = "conid='" + temp.getConid() + "' and bdgid='" + temp.getBdgid() + "'";
				List bm =  this.bdgBalDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP),s);
				int leaf = temp.getIsleaf().intValue();

				sbf.append("{balappid:\"");
				sbf.append(temp.getBalappid());
				sbf.append("\",balid:\"");
				sbf.append(temp.getBalid());
				sbf.append("\",bdgid:\"");
				sbf.append(temp.getBdgid());
				sbf.append("\",pid:\"");
				sbf.append(temp.getPid());
				sbf.append("\",conid:\"");
				sbf.append(temp.getConid());
				sbf.append("\",bdgname:\"");
				sbf.append(bdgInfo.getBdgname());
				sbf.append("\",bdgmoney:");
				sbf.append(((BdgMoneyApp)bm.get(0)).getRealmoney());
				sbf.append(",bdgno:\"");
				sbf.append(bdgInfo.getBdgno());
				sbf.append("\",balid:\"");
				sbf.append(temp.getBalid());
				sbf.append("\",balmoney:");
				sbf.append(temp.getBalmoney());
				sbf.append(",isleaf:");
				sbf.append(temp.getIsleaf());
				sbf.append(",parent:\"");
				sbf.append(temp.getParent());
				sbf.append("\",uiProvider:\"col\"");
				if (0 == leaf) {
					sbf.append(",cls:\"master-task\",iconCls:\"task-folder\"");
					//sbf.append(",children:");
					//sbf.append(bdgBalTree(temp.getBdgid(), conid, balid));
				} else {
					sbf.append(",iconCls:\"task\",leaf:true");
				}
				sbf.append("}");
				if (itr.hasNext()) {
					sbf.append(",");
				}
			}
			sbf.append("]");
		} catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		return sbf.toString();
	}
	
	/**
	 * 合同结算分摊 - 保存在合同金额树上选中的数据节点
	 * @author xiaos
	 * @param conid
	 * @param ids
	 * @throws BusinessException
	 * @return flag
	 */
	@SuppressWarnings("unchecked")
	public int saveBalTree(String conid, String balid, String[] ids) throws BusinessException{
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		List dataList = new ArrayList();
		String pid ="";
		try {
			for (int i = 0; i < ids.length; i++) {
				String appid = ids[i];
				BdgMoneyApp bdgMoneyApp = (BdgMoneyApp)this.bdgBalDao.findById(beanName, appid);
				if(i==0){
					pid=bdgMoneyApp.getPid();
				}
				
				//if (bdgMoneyApp.getIsleaf() == 0){
					String str = "bdgid = '" +bdgMoneyApp.getBdgid() + "'" + "and conid='" + conid + "' and balid='" + balid + "'" ;
						List list = (List) this.bdgBalDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BALANCE_APP), str);
						if (list.size() > 0)
							continue ;
				//}
				
				BdgBalApp bdgBalApp = new BdgBalApp();
				bdgBalApp.setPid(bdgMoneyApp.getPid());
				bdgBalApp.setBdgid(bdgMoneyApp.getBdgid());
				bdgBalApp.setConid(conid);
				bdgBalApp.setBalid(balid);
				bdgBalApp.setBalmoney(new Double(0));
				bdgBalApp.setIsleaf(bdgMoneyApp.getIsleaf());
				bdgBalApp.setParent(bdgMoneyApp.getParent());
				this.bdgBalDao.insert(bdgBalApp);
				dataList.add(bdgBalApp);
			}
		} catch (RuntimeException e) {
			flag = 1; e.printStackTrace();
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","选择结算树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);	
		}
		return flag;
	}

	
	/**
	 * 合同结算分摊 - 新增、修改节点
	 * @author xiaos
	 * @param bdgInfo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public int addOrUpdateBdgBalApp(BdgBalApp bdgBalApp){
		int flag = 0;
			try {
				PcDynamicData  pdd = new PcDynamicData();
				if(bdgBalApp.getBalappid()==null|"".equals(bdgBalApp.getBalappid())){
					
					pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
				}else {
					pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
				}
				this.bdgBalDao.saveOrUpdate(bdgBalApp);
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(BdgBalApp.class.getName());
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgBalApp.class.getName()));
				pdd.setPctableuids(bdgBalApp.getBalappid());
				pdd.setPcurl(DynamicDataUtil.BDG_BALAPP_URL);
				pdd.setPid(bdgBalApp.getPid());
				this.bdgBalDao.insert(pdd);
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					List dataList = new ArrayList();
					dataList.add(bdgBalApp);
					dataList.add(pdd);
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgBalApp.getPid(),"","","新增或修改结算树");
					dataExchangeService.addExchangeListToQueue(ExchangeList);	
				}
				this.sumBalHandler(bdgBalApp.getParent(), bdgBalApp.getConid(), bdgBalApp.getBalid());
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (BusinessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		return flag;
	}
	
	/**
	 * 合同结算分摊 - 删除节点
	 * @author xiaos
	 * @param bdgId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public int deleteBalChildNode(String balappid){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_BALANCE_APP;
		try {
			BdgBalApp bdgBalApp = (BdgBalApp)this.bdgBalDao.findById(beanName, balappid);
			if (null == bdgBalApp) return flag;
			String strWhere = "parent = '" + bdgBalApp.getParent() + "' and conid = '" + bdgBalApp.getConid() + "' and balid = '" + bdgBalApp.getBalid() + "'";
			List list = (List)this.bdgBalDao.findByWhere(beanName, strWhere);
			if (list != null){
				if (list.size() == 1){
					String strPWhere = "bdgid = '" + bdgBalApp.getParent() + "' and conid = '" + bdgBalApp.getConid() + "' and balid = '" +bdgBalApp.getBalid() + "'";
					List list2 = (List)this.bdgBalDao.findByWhere(beanName, strPWhere);
					if (list2.size() > 0){
						BdgBalApp parentBdg = (BdgBalApp)list2.get(0);
						parentBdg.setIsleaf(new Long("1"));
						this.bdgBalDao.saveOrUpdate(parentBdg);
						String uuid = parentBdg.getBalappid();
						this.bdgBalDao.delete(bdgBalApp);
						List dataList = new ArrayList();
						dataList.add(parentBdg);
						dataList.add(bdgBalApp);
						if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
							PCDataExchangeService dataExchangeService = 
								(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
							List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,parentBdg.getPid(),"","","删除结算分摊");
							dataExchangeService.addExchangeListToQueue(ExchangeList);	
						}
						this.deleteBalChildNode(uuid);
					}
				}
				this.bdgBalDao.delete(bdgBalApp);
				List dataList = new ArrayList();
				dataList.add(bdgBalApp);
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgBalApp.getPid(),"","","删除结算分摊");
					dataExchangeService.addExchangeListToQueue(ExchangeList);	
				}
			}else{
				flag = 1;
			}
			this.sumForBalDelete(bdgBalApp);
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
	public void sumBalHandler(String parentId, String conid, String balid) throws SQLException, BusinessException{
		Double dbApppay = new Double(0);
		String strWhere = "parent = '" + parentId + "' and conid = '" + conid+ "' and balid = '" + balid + "'";
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_BALANCE_APP;
		List list = (List)this.bdgBalDao.findByWhere(beanName, strWhere);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgBalApp obj_bdgPayApp = (BdgBalApp) iterator.next();
			dbApppay += obj_bdgPayApp.getBalmoney();
		}
		String strParentWhere = "bdgid = '" + parentId + "' and conid = '" + conid+ "' and balid = '" + balid + "'";
		List list2 = this.bdgBalDao.findByWhere(beanName, strParentWhere);
		if (list2.size() > 0){
			BdgBalApp parentBalApp = (BdgBalApp)list2.get(0);
			parentBalApp.setBalmoney(dbApppay);
			this.bdgBalDao.saveOrUpdate(parentBalApp);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(BdgBalApp.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgBalApp.class.getName()));
			pdd.setPctableuids(parentBalApp.getBalappid());
			pdd.setPcurl(DynamicDataUtil.BDG_BALAPP_URL);
			pdd.setPid(parentBalApp.getPid());
			this.bdgBalDao.insert(pdd);
			List dataList = new ArrayList();
			dataList.add(parentBalApp);
			dataList.add(pdd);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,parentBalApp.getPid(),"","","累计合同分摊付款");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
			if (!"0".equals(parentBalApp.getParent()))
				sumBalHandler(parentBalApp.getParent(), conid, balid);
		}
	}
	
	/**
	 * 合同付款分摊 - 累计（删除时）
	 * @author xiaos
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public void sumForBalDelete(BdgBalApp bdgBalApp) throws SQLException, BusinessException{
		Double dbApppay = new Double(0);
		String strWhere = "parent = '" + bdgBalApp.getParent() + "' and conid = '" + bdgBalApp.getConid()+ "' and balid = '" + bdgBalApp.getBalid() + "'";
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_BALANCE_APP;
		List list = (List)this.bdgBalDao.findByWhere(beanName, strWhere);
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgBalApp obj_bdgBalApp = (BdgBalApp) iterator.next();
			if (obj_bdgBalApp.getBalappid().equals(bdgBalApp.getBalappid())) continue;
			dbApppay += obj_bdgBalApp.getBalmoney();
		}
		String strParentWhere = "bdgid = '" + bdgBalApp.getParent() + "' and conid = '" + bdgBalApp.getConid() + "' and balid = '" + bdgBalApp.getBalid() + "'";
		List list2 = this.bdgBalDao.findByWhere(beanName, strParentWhere);
		if (list2.size()>0){
			BdgBalApp parentBal = (BdgBalApp)list2.get(0);
			parentBal.setBalmoney(dbApppay);
			this.bdgBalDao.saveOrUpdate(parentBal);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				List dataList = new ArrayList();
				dataList.add(parentBal);
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,parentBal.getPid(),"","","累计删除");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
			this.sumBalHandler(parentBal.getParent(), parentBal.getConid(), parentBal.getBalid());
		}
	}

}
