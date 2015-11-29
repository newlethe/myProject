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
import com.sgepit.pmis.budget.dao.BdgBreachDAO;
import com.sgepit.pmis.budget.hbm.BdgBreachApp;
import com.sgepit.pmis.budget.hbm.BdgChangApp;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.budget.hbm.VBdgInfo;
import com.sgepit.pmis.budget.hbm.VBdgLibrary;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConBre;

public class BdgBreachMgmImpl extends BaseMgmImpl implements BdgBreachMgmFacade {

	private BdgBreachDAO bdgBreachDao;

	private BusinessException businessException;
	private Object[][] object;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static BdgPayMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (BdgPayMgmImpl) ctx.getBean("bdgBreachMgm");
	}


	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	
	
	public void setBdgBreachDao(BdgBreachDAO bdgBreachDao) {
		this.bdgBreachDao = bdgBreachDao;
	}

	private String checkValidConbre(BdgBreachApp bdgBreach) {
		StringBuffer msg = new StringBuffer("");
		//项目编号不能为空
		if (bdgBreach.getPid() == null || bdgBreach.getPid().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_PID_IS_NULL));
			msg.append("<br>");
			
		}
		/*
		if (conbre.getBrework() == null || conbre.getBrework().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_BREWORK_IS_NOT_NULL));
			msg.append("<br>");	
		}
		*/		
		//检查数据是否唯一
		String where = " pid = '" + bdgBreach.getPid() + "' and breappid='" + bdgBreach.getBreappid() + "'  and conid <> '" + bdgBreach.getConid() + "'";;
		List list = this.bdgBreachDao.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), where);		
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}
		return msg.toString();
	}
	
	private boolean checkUniqueConbre(BdgBreachApp bdgBreach) {
		String where = " pid = '" + bdgBreach.getPid() + "' and breappid='" + bdgBreach.getBreappid() + "'";
		List list = this.bdgBreachDao.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), where);
		if (list.size() > 0) {
			return false;
		}
		return true;
	}


	public void deleteBdgBreach(BdgBreachApp bdgBreach) throws SQLException,
			BusinessException {
		this.bdgBreachDao.delete(bdgBreach);
		
	}


	public void insertBdgBreach(BdgBreachApp bdgBreach) throws SQLException,
			BusinessException {
		this.bdgBreachDao.insert(bdgBreach);
		
	}


	public void updateBdgBreach(BdgBreachApp bdgBreach) throws SQLException,
			BusinessException {
		this.bdgBreachDao.saveOrUpdate(bdgBreach);
		
	}

	
   //-----------------------------------------------------------------------------------------------------------
  // user method
  //------------------------------------------------------------------------------------------------------------

	public List<ColumnTreeNode> bgdgBreachTree(String parentId, String conid, String breid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + conid+ "' and breappno = '" + breid + "' order by bdgid";
		List<BdgBreachApp> objects = this.bdgBreachDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BREACH_APP), str);
		Iterator<BdgBreachApp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgBreachApp temp = (BdgBreachApp) itr.next();
			String strChild= " conid = '%s' and bdgid = '%s'";
			strChild = String.format(strChild,conid, temp.getBdgid());
			List<VBdgConApp> bis = this.bdgBreachDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strChild);
			VBdgConApp bi=new VBdgConApp();
			if(bis!=null)bi=bis.get(0);
			if (bi ==null)	continue;
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setConbdgappmoney(bi.getConbdgappmoney());
			temp.setConappmoney(bi.getConappmoney());			
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
	
	
	/**
	 * 合同违约分摊 - 保存在合同金额树上选中的数据节点
	 * @author xiaos
	 * @param conid
	 * @param ids
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public int saveBreachTree(String conid, String breid, String[] ids) throws BusinessException{
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		List dataList = new ArrayList();
		String pid ="";
		try {
			for (int i = 0; i < ids.length; i++) {
				String appid = ids[i];
				BdgMoneyApp bdgMoneyApp = (BdgMoneyApp)this.bdgBreachDao.findById(beanName, appid);
				String str = "bdgid = '" +bdgMoneyApp.getBdgid() + "'" + "and conid='" + conid + "' and breappno='" + breid + "'" ;
				List list = (List) this.bdgBreachDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BREACH_APP), str);
				if (list.size() > 0)
					continue ;
				
				if(i==0){
					pid=bdgMoneyApp.getPid();
				}
				BdgBreachApp bdgBreachApp = new BdgBreachApp();
				bdgBreachApp.setPid(bdgMoneyApp.getPid());
				bdgBreachApp.setBdgid(bdgMoneyApp.getBdgid());
				bdgBreachApp.setConid(conid);
				bdgBreachApp.setBreappno(breid);
				bdgBreachApp.setAppmoney(new Double(0));
				bdgBreachApp.setIsleaf(bdgMoneyApp.getIsleaf());
				bdgBreachApp.setParent(bdgMoneyApp.getParent());
				this.bdgBreachDao.insert(bdgBreachApp);
				PcDynamicData  pdd =new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(BdgBreachApp.class.getName());
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgBreachApp.class.getName()));
				pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
				pdd.setPctableuids(bdgBreachApp.getBreappid());
				pdd.setPcurl(DynamicDataUtil.BDG_BREAPP_URL);
				pdd.setPid(bdgBreachApp.getPid());
				bdgBreachDao.insert(pdd);
				dataList.add(bdgBreachApp);
				dataList.add(pdd);
			}
		} catch (RuntimeException e) {
			flag = 1; e.printStackTrace();
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","选择保存违约分摊树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);	
		}
		return flag;
	}
	
	/**
	 * 合同违约分摊 - 新增、修改节点
	 * @author xiaos
	 * @param bdgInfo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public int addOrUpdateBdgBreachApp(BdgBreachApp bdgBreachApp){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_BREACH_APP;
		try {
			List dataList = new ArrayList();
			if ("".equals(bdgBreachApp.getBreappid())){
				String strWhere = "parent = '" + bdgBreachApp.getParent() + "' and conid = '" + bdgBreachApp.getConid()+ "' and breappno = '" + bdgBreachApp.getBreappno() + "'";
				List list = (List)this.bdgBreachDao.findByWhere(beanName, strWhere);
				if (list.isEmpty()){
					BdgBreachApp parentBdg = (BdgBreachApp)(this.bdgBreachDao.findByProperty(beanName, "bdgid", bdgBreachApp.getParent())).get(0);
					//BdgPayApp parentBdg = (BdgInfo)this.budgetDAO.findById(beanName, bdgPayApp.getParent());
					parentBdg.setIsleaf(new Long(0));
					this.bdgBreachDao.saveOrUpdate(parentBdg);
					PcDynamicData  pdd = new PcDynamicData();
					pdd.setPcdynamicdate(new Date());
					pdd.setPctablebean(beanName);
					pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
					pdd.setPcurl(DynamicDataUtil.BDG_BREAPP_URL);
					pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					pdd.setPctableuids(parentBdg.getBreappid());
					pdd.setPid(parentBdg.getPid());
					this.bdgBreachDao.insert(pdd);
					dataList.add(parentBdg);
					dataList.add(pdd);
				}
				this.bdgBreachDao.insert(bdgBreachApp);
				PcDynamicData  pdd = new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(beanName);
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
				pdd.setPcurl(DynamicDataUtil.BDG_BREAPP_URL);
				pdd.setPid(bdgBreachApp.getPid());
				pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
				pdd.setPctableuids(bdgBreachApp.getBreappid());
				this.bdgBreachDao.insert(pdd);
				dataList.add(bdgBreachApp);
				dataList.add(pdd);
			}else{
				this.bdgBreachDao.saveOrUpdate(bdgBreachApp);
				PcDynamicData  pdd = new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(beanName);
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
				pdd.setPcurl(DynamicDataUtil.BDG_BREAPP_URL);
				pdd.setPid(bdgBreachApp.getPid());
				pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
				pdd.setPctableuids(bdgBreachApp.getBreappid());
				this.bdgBreachDao.insert(pdd);
				dataList.add(bdgBreachApp);
				dataList.add(pdd);
			}
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgBreachApp.getPid(),"","","修改违约分摊");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
			this.sumBreachMoneyHandler(bdgBreachApp.getParent(), bdgBreachApp.getConid(), bdgBreachApp.getBreappno());
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 合同违约分摊 - 删除节点
	 * @author xiaos
	 * @param bdgId
	 * @return
	 */
	public int deleteBreachChildNode(String breappid){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_BREACH_APP;
		try {
			BdgBreachApp bdgBreachApp = (BdgBreachApp)this.bdgBreachDao.findById(beanName, breappid);
			if (null == bdgBreachApp) return flag;
			String strWhere = "parent = '" + bdgBreachApp.getParent() + "' and conid = '" + bdgBreachApp.getConid() + "' and breappno = '" + bdgBreachApp.getBreappno() + "'";
			List list = (List)this.bdgBreachDao.findByWhere(beanName, strWhere);
			if (list != null){
				if (list.size() == 1){
					String strPWhere = "bdgid = '" + bdgBreachApp.getParent() + "' and conid = '" + bdgBreachApp.getConid() + "' and breappno = '" + bdgBreachApp.getBreappno() + "'";
					List list2 = (List)this.bdgBreachDao.findByWhere(beanName, strPWhere);
					if (list2.size() > 0){
						BdgBreachApp parentBdg = (BdgBreachApp)list2.get(0);
						parentBdg.setIsleaf(new Long("1"));
						this.bdgBreachDao.saveOrUpdate(parentBdg);
						String uuid = parentBdg.getBreappid();
						this.bdgBreachDao.delete(bdgBreachApp);
						List dataList = new ArrayList();
						dataList.add(parentBdg);
						dataList.add(bdgBreachApp);
						if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
							PCDataExchangeService dataExchangeService = 
								(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
							List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgBreachApp.getPid(),"","","删除违约分摊树");
							dataExchangeService.addExchangeListToQueue(ExchangeList);	
						}
						this.deleteBreachChildNode(uuid);
					}
				}
				this.bdgBreachDao.delete(bdgBreachApp);
				List dataList = new ArrayList();
				dataList.add(bdgBreachApp);
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgBreachApp.getPid(),"","","删除违约分摊");
					dataExchangeService.addExchangeListToQueue(ExchangeList);	
				}
			}else{
				flag = 1;return flag;
			}
			this.sumForBreachDelete(bdgBreachApp);
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 合同违约分摊 - 累计（新增、修改时）
	 * author xiaos
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public void sumBreachMoneyHandler(String parentId, String conid, String breid) throws SQLException, BusinessException{
		Double dbAppmoney = new Double(0);
		String strWhere = "parent = '" + parentId + "' and conid = '" + conid+ "' and breappno = '" + breid + "'";
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_BREACH_APP;
		List list = (List)this.bdgBreachDao.findByWhere(beanName, strWhere);
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgBreachApp obj_bdgBreachApp = (BdgBreachApp) iterator.next();
			dbAppmoney += obj_bdgBreachApp.getAppmoney();
		}
		String strParentWhere = "bdgid = '" + parentId + "' and conid = '" + conid+ "' and breappno = '" + breid + "'";
		List list2 = this.bdgBreachDao.findByWhere(beanName, strParentWhere);
		if (list2.size() > 0){
			BdgBreachApp parentBreachApp = (BdgBreachApp)list2.get(0);
			parentBreachApp.setAppmoney(dbAppmoney);
			this.bdgBreachDao.saveOrUpdate(parentBreachApp);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(beanName);
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
			pdd.setPcurl(DynamicDataUtil.BDG_BREAPP_URL);
			pdd.setPid(parentBreachApp.getPid());
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
			pdd.setPctableuids(parentBreachApp.getBreappid());
			this.bdgBreachDao.insert(pdd);
			List dataList = new ArrayList();
			dataList.add(parentBreachApp);
			dataList.add(pdd);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,parentBreachApp.getPid(),"","","修改违约累计分摊");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
			if (!"0".equals(parentBreachApp.getParent()))
				sumBreachMoneyHandler(parentBreachApp.getParent(), conid, breid);
		}
	}
	
	/**
	 * 合同违约分摊 - 累计（删除时）
	 * @author xiaos
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public void sumForBreachDelete(BdgBreachApp bdgBreachApp) throws SQLException, BusinessException{
		Double dbAppmoney = new Double(0);
		String strWhere = "parent = '" + bdgBreachApp.getParent() + "' and conid = '" + bdgBreachApp.getConid()+ "' and breappno = '" + bdgBreachApp.getBreappno() + "'";
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_BREACH_APP;
		List list = (List)this.bdgBreachDao.findByWhere(beanName, strWhere);
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgBreachApp obj_bdgBreachApp = (BdgBreachApp) iterator.next();
			if (obj_bdgBreachApp.getBreappid().equals(bdgBreachApp.getBreappid())) continue;
			dbAppmoney += obj_bdgBreachApp.getAppmoney();
		}
		String strParentWhere = "bdgid = '" + bdgBreachApp.getParent() + "' and conid = '" + bdgBreachApp.getConid() + "' and breappno = '" + bdgBreachApp.getBreappno() + "'";
		List list2 = this.bdgBreachDao.findByWhere(beanName, strParentWhere);
		if (list2.size()>0){
			BdgBreachApp parentBreach = (BdgBreachApp)list2.get(0);
			parentBreach.setAppmoney(dbAppmoney);
			this.bdgBreachDao.saveOrUpdate(parentBreach);
			List dataList = new ArrayList();
			dataList.add(parentBreach);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,parentBreach.getPid(),"","","删除时累计分摊");
				dataExchangeService.addExchangeListToQueue(ExchangeList);	
			}
			this.sumBreachMoneyHandler(parentBreach.getParent(), parentBreach.getConid(), parentBreach.getBreappno());
		}
	}


	@SuppressWarnings("unchecked")
	public String checkBdgBreachValid(String breid, String pid, String bdgid,
			String bremoney) {
		String appSql="select nvl(app.appmoney,0) from bdg_breach_app  app where  app.pid='"+pid+"' and app.breappno='"+breid+"' and app.parent='0'";
		List appList =bdgBreachDao.getDataAutoCloseSes(appSql);
		double appMoney =0d;
		if(appList.size()>0){
			appMoney+=((BigDecimal)appList.get(0)).doubleValue();
		}
		if(bremoney!=null&&!"".equals(bremoney)){
			appMoney+=Double.valueOf(bremoney);
		}
		//当前项目分摊金额
		String currBdg="select nvl(app.appmoney,0) from bdg_breach_app  app where  app.pid='"+pid+"' and app.breappno='"+breid+"' and app.bdgid='"+bdgid+"'";
		List currList=bdgBreachDao.getDataAutoCloseSes(currBdg);
		if(currList.size()>0){
			appMoney-=((BigDecimal)currList.get(0)).doubleValue();
		}
		ConBre conBre=(ConBre)bdgBreachDao.findById(ConBre.class.getName(),breid);
		if(conBre!=null){
			if(appMoney>conBre.getDedmoney()){
				return "1";
			}
		}
		//计算所有概算批准金额是否超过分摊金额
		 String conSql= "select nvl(sum(nvl(app.realmoney,0)),0) from bdg_money_app  app where app.bdgid='"+bdgid+"' and app.pid='"+pid+"' ";
		 List conList =bdgBreachDao.getDataAutoCloseSes(conSql);
		 double  totalMoney=0d;
		 if(conList.size()>0){
			 totalMoney+=((BigDecimal)conList.get(0)).doubleValue();
		 }
		    //变更累计
	    String chaSql = "select nvl(sum(nvl(app.camoney,0)),0) from bdg_chang_app  app where  app.pid='"+pid+"' and app.bdgid='"+bdgid+"'";
	    List chaList = bdgBreachDao.getDataAutoCloseSes(chaSql);
	    if(chaList.size()>0){
	    	totalMoney+=((BigDecimal)chaList.get(0)).doubleValue();
	    }
	    if(bremoney!=null&&!"".equals(bremoney)){
		    totalMoney+=Double.valueOf(bremoney);
	    }
	    //违约累计
	    String breSql="select nvl(sum(nvl(app.appmoney,0)),0) from bdg_breach_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgid+"' and app.breappno<>'"+breid+"'";
	    List breList =bdgBreachDao.getDataAutoCloseSes(breSql);
	    if(breList.size()>0){
	    	totalMoney+=((BigDecimal)breList.get(0)).doubleValue();
	    }
	    //索赔累计
	    String claSql ="select nvl(sum(nvl(app.clamoney,0)),0) from bdg_cla_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgid+"'";
	    List claList =bdgBreachDao.getDataAutoCloseSes(claSql);
	    if(claList.size()>0){
	    	totalMoney+=((BigDecimal)claList.get(0)).doubleValue();
	    }
	    BdgInfo bdgInfo=(BdgInfo)bdgBreachDao.findById(BdgInfo.class.getName(), bdgid);
		if(totalMoney>bdgInfo.getBdgmoney()){
			return "2";
		} 		
		return null;
	}
	/**
	 * 合同违约分摊 - 保存在合同金额概算库树树上选中的数据节点
	 * @author shangtw
	 * @param conid
	 * @param ids
	 * @param breid
	 * @throws BusinessExceptionsave
	 */
	@SuppressWarnings("unchecked")
	public int saveBreachLibraryTree(String conid, String breid, String[] ids) throws BusinessException{
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		List dataList = new ArrayList();
		String pid ="";
		String strSql="";
		String bdgid="";		
		try {
			for (int i = 0; i < ids.length; i++) {
				bdgid = ids[i];
				strSql = "bdgid = '%s' and conid = '%s' order by bdgid";
				strSql= String.format(strSql, bdgid, conid);
				List<VBdgConApp> objects = this.bdgBreachDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strSql);
				VBdgConApp vbdgconapp=new VBdgConApp();
				if(objects!=null&&objects.size()>0)
					vbdgconapp=objects.get(0);
				String str = "bdgid = '" +bdgid + "'" + "and conid='" + conid + "' and breappno='" + breid + "'" ;
				List list = (List) this.bdgBreachDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BREACH_APP), str);
				if (list.size() > 0)
					continue ;
				
				if(i==0){
					pid=vbdgconapp.getPid();
				}
				BdgBreachApp bdgBreachApp = new BdgBreachApp();
				bdgBreachApp.setPid(vbdgconapp.getPid());
				bdgBreachApp.setBdgid(vbdgconapp.getBdgid());
				bdgBreachApp.setConid(conid);
				bdgBreachApp.setBreappno(breid);
				bdgBreachApp.setAppmoney(new Double(0));
				bdgBreachApp.setIsleaf(vbdgconapp.getIsleaf());
				bdgBreachApp.setParent(vbdgconapp.getParent());
				this.bdgBreachDao.insert(bdgBreachApp);
				PcDynamicData  pdd =new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(BdgBreachApp.class.getName());
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgBreachApp.class.getName()));
				pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
				pdd.setPctableuids(bdgBreachApp.getBreappid());
				pdd.setPcurl(DynamicDataUtil.BDG_BREAPP_URL);
				pdd.setPid(bdgBreachApp.getPid());
				bdgBreachDao.insert(pdd);
				dataList.add(bdgBreachApp);
				dataList.add(pdd);
			}
		} catch (RuntimeException e) {
			flag = 1; e.printStackTrace();
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","选择保存违约分摊树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);	
		}
		return flag;
	}
	/**
	 * shangtw  获得选择后的树(合同违约分摊)
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bgdgBreachTreeGrid(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String conid=(String)map.get("conid");
		String breid=(String)map.get("breid");		
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + conid+ "' and breappno = '" + breid + "' order by bdgid";
		List<BdgBreachApp> objects = this.bdgBreachDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BREACH_APP), str);
		Iterator<BdgBreachApp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			BdgBreachApp temp = (BdgBreachApp) itr.next();
			String strChild= " conid = '%s' and bdgid = '%s'";
			strChild = String.format(strChild,conid, temp.getBdgid());
			List<VBdgConApp> bis = this.bdgBreachDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strChild);
			VBdgConApp bi=new VBdgConApp();
			if(bis!=null)bi=bis.get(0);
			if (bi ==null)	continue;
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setConbdgappmoney(bi.getConbdgappmoney());
			temp.setConappmoney(bi.getConappmoney());			
		}
		List newList=DynamicDataUtil.changeisLeaf(objects, "isleaf");
		return newList;
	}
	

}
