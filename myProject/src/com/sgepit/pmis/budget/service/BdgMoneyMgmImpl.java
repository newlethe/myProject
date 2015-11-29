package com.sgepit.pmis.budget.service;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.dao.BdgMoneyDAO;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlan;
import com.sgepit.pmis.budget.hbm.BidBdgApportion;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.budget.hbm.VBdgInfo;
import com.sgepit.pmis.budget.hbm.VBdgLibrary;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.contract.hbm.ConOveView;

public class BdgMoneyMgmImpl extends BaseMgmImpl implements BdgMoneyMgmFacade {

	private BdgMoneyDAO bdgMoneyDao;
	
	public static BdgMoneyMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		
		return (BdgMoneyMgmImpl) ctx.getBean("bdgMoneyMgm");
	}
	
	public void setBdgMoneyDao(BdgMoneyDAO bdgMoneyDao) {
		this.bdgMoneyDao = bdgMoneyDao;
	}


	

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	public void deleteBdgMoney(BdgMoneyApp bdgMoney) throws SQLException,BusinessException {
		this.bdgMoneyDao.delete(bdgMoney);
	}

	public void insertBdgMoney(BdgMoneyApp bdgMoney) throws SQLException,BusinessException {
		this.bdgMoneyDao.insert(bdgMoney);
	}

	@SuppressWarnings("unchecked")
	public void updateBdgMoney(BdgMoneyApp bdgMoney) throws SQLException,BusinessException {
		this.bdgMoneyDao.saveOrUpdate(bdgMoney);
	}
	
	/*
	 * 合同金额分摊时获得概算树（被选择的树）
	 */
	public List<ColumnTreeNode> getBudgetTree(String parentId, String pid,String contId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' order by bdgid";
		str = String.format(str, parent, pid);
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
			//n.setIfcheck("none");
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			
			String uiProvider = "col";
			List lt = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP),
					"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "'");
			if (leaf == 1 && lt != null && lt.size() > 0) {
				jo.accumulate("disabled", true);
				uiProvider = "plain";
			} 
			cn.setUiProvider(uiProvider);
			cn.setColumns(jo);						// ColumnTreeNode.columns
			list.add(cn);
		}
		
		return list;
	}
	
	/**
	 * zhugx 保存选择的子树(概算金额分摊)
	 * @param conid
	 * @param ids
	 */
	@SuppressWarnings("all")
	public void saveGetBudgetTree(String conid, String[] ids) {
		List dataList = new ArrayList();
		String pid ="";
		for (int i = 0; i < ids.length; i++) {
			BdgMoneyApp bme = new BdgMoneyApp();
			BdgInfo dgInfo = (BdgInfo) this.bdgMoneyDao.findById(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), ids[i]);
			if(pid==null||"".equals(pid))
			pid=dgInfo.getPid();
			String str = "bdgid = '" +dgInfo.getBdgid() + "' and conid='" + conid+ "'";
			List list = (List) this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), str);
			if (list.size() > 0)
				continue;
			bme.setPid(dgInfo.getPid());
			bme.setBdgid(dgInfo.getBdgid());
			bme.setConid(conid);
			bme.setIsleaf(dgInfo.getIsleaf());
			bme.setParent(dgInfo.getParent());
			bme.setRealmoney(new Double(0)); 
			bdgMoneyDao.insert(bme);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(BdgMoneyApp.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgMoneyApp.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(bme.getAppid());
			pdd.setPcurl(DynamicDataUtil.BDG_MONEYAPP_URL);
			pdd.setPid(bme.getPid());
			bdgMoneyDao.insert(pdd);
			dataList.add(bme);
			dataList.add(pdd);
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","保存合同分摊结构树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
	}
	
	/**
	 * 合同金额分摊树
	 */
	public List<ColumnTreeNode> bdgMoneyTree(String parentId, String conId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and conid = '%s' order by bdgid";
		str = String.format(str, parent, conId);
		List<VBdgConApp> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), str);
		
		Iterator<VBdgConApp> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			VBdgConApp temp1 = (VBdgConApp) itr.next();
			VBdgConApp temp = new VBdgConApp();
			try {
				BeanUtils.copyProperties(temp, temp1);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
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
			n.setIfcheck("none");
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
	@SuppressWarnings("unchecked")
	public int addOrUpdateBdgMoneyApp(BdgMoneyApp bdgMoneyApp){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants. BDG_MONEY_APP;
//		String bdgid = bdgMoneyApp.getBdgid();
		String parentId = bdgMoneyApp.getParent();
		try {
			this.updateBdgMoney(bdgMoneyApp);
//			BdgInfoMgmFacade bdgInfoMgm = (BdgInfoMgmFacade)Constant.wact.getBean("bdgInfoMgm");
//			bdgInfoMgm.sumContmoney(bdgid);  // 修改概算结构维护中的合同分摊总金额的和
			this.sumbdgMoneyApp(parentId,bdgMoneyApp.getConid());
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			List datachangeList = new ArrayList();
			String sql = "select * from (select * from bdg_money_app  app where app.pid='"+bdgMoneyApp.getPid()+"' and app.conid='"+bdgMoneyApp.getConid()+"') t  start with t.bdgid='"+bdgMoneyApp.getBdgid()+"' connect by prior t.parent=t.bdgid";
			List listmoneyApp=bdgMoneyDao.getDataAutoCloseSes(sql);
			for(int i=0;i<listmoneyApp.size();i++){
				Object[] objs=(Object[])listmoneyApp.get(i);
				BdgMoneyApp  bma = new BdgMoneyApp();
				bma.setAppid((String)objs[0]);
				PcDynamicData pdd = new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(beanName);
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
				pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
				pdd.setPctableuids((String)objs[0]);
				pdd.setPcurl(DynamicDataUtil.BDG_MONEYAPP_URL);
				pdd.setPid(bdgMoneyApp.getPid());
				bdgMoneyDao.insert(pdd);
				datachangeList.add(pdd);
				datachangeList.add(bma);
			}
			
			/*	合同付款分摊，无需对概算和合同数据做数据交换 
			List listBdgInfo =bdgMoneyDao.getDataAutoCloseSes("select * from bdg_info bi  where bi.pid='"+bdgMoneyApp.getPid()+"' start with bi.bdgid='"+bdgMoneyApp.getBdgid()+"' connect by prior bi.parent=bi.bdgid");
			for(int j=0;j<listBdgInfo.size();j++){
				Object[] objs = (Object[])listBdgInfo.get(j);
				BdgInfo  bi  = new BdgInfo();
				bi.setBdgid((String)objs[0]);
				PcDynamicData pdd = new PcDynamicData();
				pdd.setPcdynamicdate(new Date());
				pdd.setPctablebean(BdgInfo.class.getName());
				pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgInfo.class.getName()));
				pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
				pdd.setPctableuids((String)objs[0]);
				pdd.setPcurl(DynamicDataUtil.BDG_INFO_URL);
				pdd.setPid(bdgMoneyApp.getPid());
				bdgMoneyDao.insert(pdd);
				datachangeList.add(bi);
				datachangeList.add(pdd);
			}
			ConOve conOve = (ConOve) this.bdgMoneyDao.findById(BusinessConstants.CON_PACKAGE + BusinessConstants.CON_OVE, bdgMoneyApp.getConid());
			datachangeList.add(conOve);
			*/
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(datachangeList, Constant.DefaultOrgRootID,bdgMoneyApp.getPid(),"","","更新合同分摊");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
		} catch (SQLException e){
			flag = 1; 
			e.printStackTrace();
		} catch (BusinessException e){
			flag = 1; 
			e.printStackTrace();
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
	@SuppressWarnings("unchecked")
	public int deleteChildNodeBdgMoneyApp(String appid) throws SQLException, BusinessException{
		
		int flag = 0; // 删除返回标志: 0为成功，1为失败
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		BdgMoneyApp bma = (BdgMoneyApp) this.bdgMoneyDao.findById(beanName, appid);
		String parentId = bma.getParent();
		String where = "parent ='"+ parentId +"' and conid= '" + bma.getConid() + "'";
		List list = (List)this.bdgMoneyDao.findByWhere(beanName, where);
		try {
			if (!"0".equals(bma.getBdgid())){
				this.bdgMoneyDao.delete(bma);
//				BdgInfoMgmFacade bdgInfoMgm = (BdgInfoMgmFacade)Constant.wact.getBean("bdgInfoMgm");
//				bdgInfoMgm.sumContmoney(bma.getBdgid());
				this.sumbdgMoneyApp(bma.getParent(), bma.getConid());
				if (list.size() == 1){
					String strParent = "bdgid = '" + bma.getParent() + "' and conid= '"	+ bma.getConid() + "'";
					List listPa = (List) this.bdgMoneyDao.findByWhere(beanName, strParent);
					if (listPa.size() > 0){
						BdgMoneyApp bmaParent = (BdgMoneyApp) listPa.get(0); // 得到父亲节点
						this.deleteChildNodeBdgMoneyApp(bmaParent.getAppid());
					}
				}
				
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					List datachangeList = new ArrayList();
					String sql = "select * from (select * from bdg_money_app  app where app.pid='"+bma.getPid()+"' and app.conid='"+ bma.getConid()+"') t  start with t.bdgid='"+bma.getBdgid()+"' connect by prior t.parent=t.bdgid";
					List listmoneyApp=bdgMoneyDao.getDataAutoCloseSes(sql);
					datachangeList.add(bma);
					for(int i=0;i<listmoneyApp.size();i++){
						Object[] objs=(Object[])listmoneyApp.get(i);
						BdgMoneyApp  bm = new BdgMoneyApp();
						bm.setAppid((String)objs[0]);
						datachangeList.add(bm);
					}
					
					/*	合同付款分摊，无需对概算和合同数据做数据交换
					List listBdgInfo =bdgMoneyDao.getDataAutoCloseSes("select * from bdg_info bi  where bi.pid='"+bma.getPid()+"' start with bi.bdgid='"+bma.getBdgid()+"' connect by prior bi.parent=bi.bdgid");
					for(int j=0;j<listBdgInfo.size();j++){
						Object[] objs = (Object[])listBdgInfo.get(j);
						BdgInfo  bi  = new BdgInfo();
						bi.setBdgid((String)objs[0]);
						datachangeList.add(bi);
					}
					ConOve conOve = (ConOve) this.bdgMoneyDao.findById(BusinessConstants.CON_PACKAGE + BusinessConstants.CON_OVE, bma.getConid());
					datachangeList.add(conOve);
					*/
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(datachangeList, Constant.DefaultOrgRootID,bma.getPid(),"","","删除分摊结构树");
					dataExchangeService.addExchangeListToQueue(ExchangeList);
					
				}
			}else{
				flag = 1;
			}
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		}

		return flag;
	}
	
	/**
	 * @author zhugx  合同金额概算金额统计
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public void sumbdgMoneyApp(String parentId, String conid) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_MONEY_APP;
		String str = "parent = '" + parentId + "' and conid= '" + conid + "'";
		List list = (List)this.bdgMoneyDao.findByWhere(beanName, str);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgMoneyApp bma = (BdgMoneyApp) iterator.next();
			Double d = bma.getRealmoney();
			if (d == null){
				d = new Double(0);
			}
			db += d;
		}
		
		String strParent = "bdgid = '" + parentId + "' and conid= '" + conid + "'";
		List  list3= (List)this.bdgMoneyDao.findByWhere(beanName,strParent);
		if (list3.size() > 0){
			BdgMoneyApp  parentInfo =(BdgMoneyApp)list3.get(0);
			parentInfo.setRealmoney(db);
			String strbma= "parent = '%s' and conid='%s' and bdgid='%s' order by bdgid";
			strbma = String.format(strbma, parentInfo.getParent(), conid,parentInfo.getBdgid());
			List<BdgMoneyApp> objectbma = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), strbma);	
			if(objectbma!=null&&objectbma.size()>0){
				BdgMoneyApp temp=objectbma.get(0);
				parentInfo.setAppid(temp.getAppid());
			}			
			this.updateBdgMoney(parentInfo);
//			BdgInfoMgmFacade bdgInfoMgm = (BdgInfoMgmFacade)Constant.wact.getBean("bdgInfoMgm");
//			bdgInfoMgm.sumContmoney(parentInfo.getBdgid());
			if (!"0".equals(parentInfo.getParent())){
				this.sumbdgMoneyApp(parentInfo.getParent(),conid);
			}else{//新增对合同信息中 概算金额的保存
				ConOve conOve = (ConOve) this.bdgMoneyDao.findById(BusinessConstants.CON_PACKAGE + BusinessConstants.CON_OVE, conid);
				conOve.setBdgmoney(db);
				this.bdgMoneyDao.saveOrUpdate(conOve);
			}
		}
	}
	
	/**
	 * @author zhugx  获得金额概算树 用来被 变更分摊 违约分摊 索赔分摊 来选择
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> getBdgMoneyTree(String parentId, String contId,String type,String typeId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and conid='%s' order by bdgid";
		str = String.format(str, parent, contId);
		List<BdgMoneyApp> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), str);
		Iterator<BdgMoneyApp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgMoneyApp temp = (BdgMoneyApp) itr.next();
			BdgInfo bi = (BdgInfo) this.bdgMoneyDao.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), temp.getBdgid());
			if (bi ==null)	continue;
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
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
			List lt = new ArrayList();
			if ("change".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANG_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and cano='" + typeId + "'" );
			}
			if ("pay".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_PAY_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and payappno='" + typeId + "'"  );
			}
			if ("breach".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BREACH_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and  breappno='" + typeId + "'"  );
			}
			if ("balance".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BALANCE_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and balid='" + typeId + "'"  );
			}
			
			if ("compensate".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_COMPENSATE_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and claid='" + typeId + "'"  );
			}
			
			if ( lt != null && lt.size() > 0) {
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
	 * 判断页面的父节点是否有子节点；flag:0 则没有子节点；flag：1 则有子节点
	 * 因为合同分摊的时候有时候是直接分摊到父节点上的
	 */
	public String checkifhaveChild(String conid,String parentno){
		String flag = "1";
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_MONEY_APP;
		String whereStr = "conid = '" + conid + "' and parent = '" + parentno + "'";
		List list = this.bdgMoneyDao.findByWhere(beanName, whereStr);
		if(list.isEmpty())
			flag = "0";
		return flag;
	}
	
	/**
	 * 判断被删除的合同分摊的项目是否存在付款分摊和变更分摊
	 */
	public boolean isPayorChangeApp(String bdgid,String conid){
		boolean flag = false;
		String payBeanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_PAY_APP);
		String changeBeanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANG_APP);
		String claBeanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_COMPENSATE_APP);
		String breachBeanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BREACH_APP);
		List paylist = this.bdgMoneyDao.findByWhere(payBeanName, " conid = '"+ conid +"' and bdgid = '"+ bdgid +"' ");
		List changelist = this.bdgMoneyDao.findByWhere(changeBeanName, " conid = '"+ conid +"' and bdgid = '"+ bdgid +"' ");
		List clalist = this.bdgMoneyDao.findByWhere(claBeanName, " conid = '"+ conid +"' and bdgid = '"+ bdgid +"' ");
		List breachlist = this.bdgMoneyDao.findByWhere(breachBeanName, " conid = '"+ conid +"' and bdgid = '"+ bdgid +"' ");
		
		if(paylist.size()>0||changelist.size()>0||clalist.size()>0||breachlist.size()>0)
			flag = true;
		return flag;
	}  	
	
	public boolean isMonneyApp(String conid){
		String moneyAppBean = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		List list = this.bdgMoneyDao.findByWhere(moneyAppBean, "conid='"+ conid +"'");
		if(list.isEmpty())return false;
		return true;
	}
	
	/**
	 * 费用计划表
	 * @param cjspb
	 * @return
	 */
	public String addOrUpdateBdgMonthMoneyPlan(BdgMonthMoneyPlan cjspb) {
		String flag = "0";
		System.out.println(cjspb.getUids());
		try{
			if("".equals(cjspb.getUids())||cjspb.getUids()==null){//新增
				/*if ("Thu Jan 01 08:00:00 CST 1970".equals(cjspb.getPzrq().toString())){
					cjspb.setPzrq(null);
				}*/
				this.bdgMoneyDao.insert(cjspb);
				flag="1";
			}else{//修改
				this.bdgMoneyDao.saveOrUpdate(cjspb);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}

	@SuppressWarnings("unchecked")
	public String checkBdgMonAppValueByConId(String conId, String appmoney,
			String pid,String bdgId) {
		  String sumSql = "select nvl(app.realmoney,0) from bdg_money_app app where app.conid='"+conId+"' and app.pid='"+pid+"' and app.parent='0'";
	    List list=bdgMoneyDao.getDataAutoCloseSes(sumSql);
	    String currentApp="select nvl(app.realmoney,0) from bdg_money_app app where app.conid='"+conId+"' and app.pid='"+pid+"' and app.bdgid='"+bdgId+"'";
	    List appList =bdgMoneyDao.getDataAutoCloseSes(currentApp);
	    double money=0d; 
	    if(list.size()>0)
	    	money+=((BigDecimal)list.get(0)).doubleValue();
	    money+=Double.valueOf(appmoney);
	    if(appList.size()>0){
	    	money-=((BigDecimal)appList.get(0)).doubleValue();
	    }
	    ConOveView  conOveView = (ConOveView) bdgMoneyDao.findById(ConOveView.class.getName(), conId);
		//合同分摊到概算上各项目的累计分摊金额超过合同签订金额
	    if(conOveView!=null){
			if(money>conOveView.getConmoney()){
				return "1";
			}
		} 
	    //概算项目上的所有合同的累计分摊金额超过概算金额
	    String bdgMoneySql ="select nvl(sum(nvl(app.realmoney,0)),0) from bdg_money_app  app where app.bdgid='"+bdgId+"' and app.pid='"+pid+"' and app.conid<>'"+conId+"'";
	    double bdgmoney =0d;
	    List bdgList =bdgMoneyDao.getDataAutoCloseSes(bdgMoneySql);
	    if(bdgList.size()>0){
	    	bdgmoney+=((BigDecimal)bdgList.get(0)).doubleValue();
	    }
	    //变更累计
	    String chaSql = "select nvl(sum(nvl(app.camoney,0)),0) from bdg_chang_app  app where  app.pid='"+pid+"' and app.bdgid='"+bdgId+"'";
	    List chaList = bdgMoneyDao.getDataAutoCloseSes(chaSql);
	    if(chaList.size()>0){
	    	bdgmoney+=((BigDecimal)chaList.get(0)).doubleValue();
	    }
	    //索赔累计
	    String breSql="select nvl(sum(nvl(app.appmoney,0)),0) from bdg_breach_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgId+"'";
	    List breList =bdgMoneyDao.getDataAutoCloseSes(breSql);
	    if(breList.size()>0){
	    	bdgmoney+=((BigDecimal)breList.get(0)).doubleValue();
	    }
	    //违约累计
	    String claSql ="select nvl(sum(nvl(app.clamoney,0)),0) from bdg_cla_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgId+"'";
	    List claList =bdgMoneyDao.getDataAutoCloseSes(claSql);
	    if(claList.size()>0){
	    	bdgmoney+=((BigDecimal)claList.get(0)).doubleValue();
	    }
	    List listinfo=bdgMoneyDao.findByWhere(BdgInfo.class.getName(), "bdgid='"+bdgId+"' and pid='"+pid+"'");
	    if(listinfo.size()>0){
	    	BdgInfo bdgInfo=(BdgInfo) listinfo.get(0);
	    	if(bdgmoney>bdgInfo.getBdgmoney()){
	    		return "2";
	    	}
	    }
	    return "";
	}

	public String checkBdgMonAppNotModify(String conid, String bdgid, String pid) {
	    //合同已结算或合同已终止不能进行分摊修改
		  ConOveView  conOveView = (ConOveView) bdgMoneyDao.findById(ConOveView.class.getName(), conid);		
		   if(conOveView.getBillstate()==3||conOveView.getBillstate()==4){
			    return "3";
		   } 
		   
		   String  paySql="select count(*) from bdg_pay_app  ap where ap.bdgid= '"+bdgid+"' and ap.pid='"+pid+"' and ap.conid='" + conid + "'";
		         List listpay=bdgMoneyDao.getDataAutoCloseSes(paySql);
		         if(listpay.size()>0){
		        	 if((((BigDecimal)listpay.get(0)).intValue())>0){
		        		 return "4";
		        	 }
		         }
		    String chaSql="select count(*)  from  bdg_chang_app  cha where cha.bdgid='"+bdgid+"' and cha.pid='"+pid+"' and cha.conid='" + conid + "'";
		    List chaList =bdgMoneyDao.getDataAutoCloseSes(chaSql);
		    if(chaList.size()>0){
		    	if(((BigDecimal)chaList.get(0)).intValue()>0){
		    		return "5";
		    	}
		    }
		return "";
	}
	/**
	 * @author shangtw  获得金额概算树 用来被 变更分摊 来选择
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> getBdgMoneyChangeTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String contId=(String)map.get("conid");
	       //拼装一般查询语句
		String changeId=(String)map.get("changeId");
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and conid='%s' order by bdgid";
		str = String.format(str, parent, contId);
		List<BdgMoneyApp> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), str);
		Iterator<BdgMoneyApp> itrbma = objects.iterator();
		String bdgids="";
		while (itrbma.hasNext()) {
			BdgMoneyApp temp = (BdgMoneyApp) itrbma.next();
			bdgids+="'"+temp.getBdgid()+"'"+",";
		}
		if(bdgids!=""){
			bdgids=bdgids.substring(0,bdgids.length()-1);
			bdgids="("+bdgids+")";
		}
		String strbca="";
		if(bdgids==""){
			strbca="parent = '%s' and conid = '%s' order by bdgid";
			strbca = String.format(strbca, parent, contId);
		}
		else{
			strbca="parent = '%s' and conid = '%s' and bdgid in %s order by bdgid";
			strbca = String.format(strbca, parent, contId,bdgids);
		}
		List<VBdgConApp> objectbca= this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strbca);
		Iterator<VBdgConApp> itr = objectbca.iterator();				
		while (itr.hasNext()) {
			VBdgConApp temp = (VBdgConApp) itr.next();
			int leaf = temp.getIsleaf().intValue();		
			List lt = new ArrayList();
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANG_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and cano='" + changeId + "'" );	
			if ( lt != null && lt.size() > 0) {
				temp.setIscheck(true);
			}
		}
		
		List newList=DynamicDataUtil.changeisLeaf(objectbca, "isleaf");
		return newList;
	}
	/*
	 * 变更分摊时获其他得概算树（被选择的树）treeGrid
	 */
	public List<ColumnTreeNode> getBudgetOtherChangeTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String contId=(String)map.get("conid");
	       //拼装一般查询语句
		String changeid=(String)map.get("changeId");
		
		String pid=(String)map.get("pid");
		
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' order by bdgid";
		str = String.format(str, parent, pid);
		List<VBdgInfo> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgInfo"), str);
		Iterator<VBdgInfo> itr = objects.iterator();
		
		while (itr.hasNext()) {
			VBdgInfo temp = (VBdgInfo) itr.next();
			int leaf = temp.getIsleaf().intValue();				
			List lt = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP),
					"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "'");
			if (leaf == 1 && lt != null && lt.size() > 0) {
				objects.remove(temp);//签订时选择的概算过滤掉
				itr=objects.iterator();//更新迭代器
			} 
			else{
				List ltc= this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and cano='"+changeid+"'");
				if ( ltc != null && ltc.size() > 0) {
					temp.setIscheck(true);
				} 
			}

		}
		
		List newList=DynamicDataUtil.changeisLeaf(objects, "isleaf");
		return newList;
	}
	/**
	 * @author shangtw  获得金额概算树 用来被 付款分摊 违约分摊 索赔分摊 来选择
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> getBdgMoneyPayBreClaTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String contId=(String)map.get("conid");
	       //拼装一般查询语句
		String typeId=(String)map.get("typeId");
		String type=(String)map.get("type");//付款分摊 违约分摊 索赔分摊
		
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and conid='%s' order by bdgid";
		str = String.format(str, parent, contId);
		List<VBdgLibrary> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.V_BDG_LIBRARY), str);
		Iterator<VBdgLibrary> itr = objects.iterator();
		
		while (itr.hasNext()) {
			VBdgLibrary temp = (VBdgLibrary) itr.next();
			BdgInfo bi = (BdgInfo) this.bdgMoneyDao.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), temp.getBdgid());
			str = "parent = '%s' and conid='%s' and bdgid='%s'";
			str = String.format(str, temp.getParent(), contId,temp.getBdgid());
			List<BdgMoneyApp> bma = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), str);
			if (bi ==null)	continue;
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			if(bma!=null&&bma.size()>0){
				BdgMoneyApp  bmoneyapp=bma.get(0);
				temp.setRealmoney(bmoneyapp.getRealmoney());
			}
			
			int leaf =bi.getIsleaf().intValue();			
			temp.setIsleaf(bi.getIsleaf());
			JSONObject jo = JSONObject.fromObject(temp);
			List lt = new ArrayList();
			if ("pay".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_PAY_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and payappno='" + typeId + "'"  );
			}
			if ("breach".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BREACH_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and  breappno='" + typeId + "'"  );
			}
			if ("balance".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_BALANCE_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and balid='" + typeId + "'"  );
			}
			
			if ("compensate".equals(type)){
				lt = this.bdgMoneyDao.findByWhere(
						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_COMPENSATE_APP),
						"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "' and claid='" + typeId + "'"  );
			}
			
			if ( lt != null && lt.size() > 0) {
				temp.setIscheck(true);
			} 
		}
		
		List newList=DynamicDataUtil.changeisLeaf(objects, "isleaf");
		return newList;
	}
	/**
	 * @author shangtw 删除合同金额概算树 
	 * @param bdgId
	 * @param conid
	 * @return
	 * @throws BusinessException 
	 * @throws SQLException 
	 */
	@SuppressWarnings("unchecked")
	public int deleteChildNodeBdgVMoneyApp(String conid,String bdgid) throws SQLException, BusinessException{
		
		int flag = 0; // 删除返回标志: 0为成功，1为失败
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		String strbma= "conid = '%s' and bdgid='%s' order by bdgid";
		strbma = String.format(strbma, conid, bdgid);
		List<BdgMoneyApp> objectbma = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), strbma);
		BdgMoneyApp bma=new BdgMoneyApp();
		if(objectbma!=null&&objectbma.size()>0)
			bma=objectbma.get(0);
		String parentId = bma.getParent();
		String where = "parent ='"+ parentId +"' and conid= '" + bma.getConid() + "'";
		List list = (List)this.bdgMoneyDao.findByWhere(beanName, where);
		try {
			if (!"0".equals(bma.getBdgid())){
				this.bdgMoneyDao.delete(bma);
//				BdgInfoMgmFacade bdgInfoMgm = (BdgInfoMgmFacade)Constant.wact.getBean("bdgInfoMgm");
//				bdgInfoMgm.sumContmoney(bma.getBdgid());
				this.sumbdgMoneyApp(bma.getParent(), bma.getConid());
				if (list.size() == 1){
					String strParent = "bdgid = '" + bma.getParent() + "' and conid= '"	+ bma.getConid() + "'";
					List listPa = (List) this.bdgMoneyDao.findByWhere(beanName, strParent);
					if (listPa.size() > 0){
						BdgMoneyApp bmaParent = (BdgMoneyApp) listPa.get(0); // 得到父亲节点
						this.deleteChildNodeBdgVMoneyApp(conid,bmaParent.getBdgid());
					}
				}
				
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					List datachangeList = new ArrayList();
					String sql = "select * from (select * from bdg_money_app  app where app.pid='"+bma.getPid()+"' and app.conid='"+ bma.getConid()+"') t  start with t.bdgid='"+bma.getBdgid()+"' connect by prior t.parent=t.bdgid";
					List listmoneyApp=bdgMoneyDao.getDataAutoCloseSes(sql);
					datachangeList.add(bma);
					for(int i=0;i<listmoneyApp.size();i++){
						Object[] objs=(Object[])listmoneyApp.get(i);
						BdgMoneyApp  bm = new BdgMoneyApp();
						bm.setAppid((String)objs[0]);
						datachangeList.add(bm);
					}
					
					/*	合同付款分摊，无需对概算和合同数据做数据交换
					List listBdgInfo =bdgMoneyDao.getDataAutoCloseSes("select * from bdg_info bi  where bi.pid='"+bma.getPid()+"' start with bi.bdgid='"+bma.getBdgid()+"' connect by prior bi.parent=bi.bdgid");
					for(int j=0;j<listBdgInfo.size();j++){
						Object[] objs = (Object[])listBdgInfo.get(j);
						BdgInfo  bi  = new BdgInfo();
						bi.setBdgid((String)objs[0]);
						datachangeList.add(bi);
					}
					ConOve conOve = (ConOve) this.bdgMoneyDao.findById(BusinessConstants.CON_PACKAGE + BusinessConstants.CON_OVE, bma.getConid());
					datachangeList.add(conOve);
					*/
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(datachangeList, Constant.DefaultOrgRootID,bma.getPid(),"","","删除分摊结构树");
					dataExchangeService.addExchangeListToQueue(ExchangeList);
					
				}
			}else{
				flag = 1;
			}
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		}

		return flag;
		}
	/**
	 * 合同工程量分摊树
	 */
	public List<ColumnTreeNode> bdgMoneyProjectTree(String parentId, String conId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String strbma= "parent = '%s' and conid='%s' order by bdgid";
		strbma = String.format(strbma, parentId, conId);
		List<BdgMoneyApp> objectbma = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), strbma);
		Iterator<BdgMoneyApp> itrbma = objectbma.iterator();
		String bdgids="";
		while (itrbma.hasNext()) {
			BdgMoneyApp temp = (BdgMoneyApp) itrbma.next();
			bdgids+="'"+temp.getBdgid()+"'"+",";
		}
		if(bdgids!=""){
			bdgids=bdgids.substring(0,bdgids.length()-1);
			bdgids="("+bdgids+")";
		}		
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str="";
		if(bdgids==""){
			str="parent = '%s' and conid = '%s' order by bdgid";
			str = String.format(str, parent, conId);
		}else{
			str="parent = '%s' and conid = '%s' and bdgid in %s order by bdgid";
			str = String.format(str, parent, conId,bdgids);
		}
		List<VBdgConApp> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), str);
		String textStr="";
		Iterator<VBdgConApp> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			VBdgConApp temp1 = (VBdgConApp) itr.next();
			VBdgConApp temp = new VBdgConApp();
			try {
				BeanUtils.copyProperties(temp, temp1);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgid());			// treenode.id
			if(null==temp.getInitappmoney()){
				temp.setInitappmoney(0.0);
			}
			textStr=temp.getBdgname()+"_"+temp.getBdgno()+"("+temp.getInitappmoney()+")";
			n.setText(textStr);		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("task");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			n.setIfcheck("none");
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	/**
	 * 合同金额分摊树,过滤掉新增的合同概算
	 */
	public List<ColumnTreeNode> bdgMoneyNewTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String conId=(String)map.get("conid");
	       //拼装一般查询语句
		String strbma= "parent = '%s' and conid='%s' order by bdgid";
		strbma = String.format(strbma, parentId, conId);
		List<BdgMoneyApp> objectbma = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), strbma);
		Iterator<BdgMoneyApp> itrbma = objectbma.iterator();
		String bdgids="";
		while (itrbma.hasNext()) {
			BdgMoneyApp temp = (BdgMoneyApp) itrbma.next();
			bdgids+="'"+temp.getBdgid()+"'"+",";
		}
		if(!"".equals(bdgids)){
			bdgids=bdgids.substring(0,bdgids.length()-1);
			//bdgids="("+bdgids+")";
		}
		//从招投标分摊表中查询对概算，
		//说明：目前招投标增加了概算分摊功能，对应表PC_Bid_Bdg_Apportion，因此在合同分摊中，需要同时查询出招投标分摊的内容，并且不能删除，
		//但是可以修改，一单修改后，将在表Bdg_Money_App中存放合同分摊数据,
		//因此数据必须合并两个边进行显示......
		//并将招投标的概算结构同步到合同概算分摊表中bdg_money_app
		ConOve conOve = (ConOve) this.bdgMoneyDao.findById(ConOve.class.getName(), conId);
		
		String where = "parentid = '"+parentId+"' and contentId = '"+conOve.getBidtype()+"' ";
		if(!"".equals(bdgids)){
			where += " and bdgid not in ("+bdgids+")";
		}
		List<BidBdgApportion> bbaList = this.bdgMoneyDao.findByWhere(BidBdgApportion.class.getName(), where);
		Iterator<BidBdgApportion> itrbba = bbaList.iterator();
		String bba_bdgids = "";
		while (itrbba.hasNext()) {
			BidBdgApportion temp = (BidBdgApportion) itrbba.next();
			bba_bdgids+="'"+temp.getBdgId()+"'"+",";
			BdgMoneyApp app = new BdgMoneyApp();
			app.setPid(temp.getPid());
			app.setConid(conId);
			app.setIsleaf(temp.getIsleaf());
			app.setParent(temp.getParentId());
			app.setBdgid(temp.getBdgId());
			app.setRealmoney(0d);
			this.bdgMoneyDao.saveOrUpdate(app);
		}
		if(!"".equals(bba_bdgids)){
			bba_bdgids = bba_bdgids.substring(0,bba_bdgids.length()-1);
			
			bba_bdgids = "("+bba_bdgids ;
			if(!"".equals(bdgids)){
				bba_bdgids += " , "+bdgids ;
			}
			bba_bdgids += " )";
		}
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str="";
		if("".equals(bba_bdgids)){
			str="parent = '%s' and conid = '%s' order by bdgid";
			str = String.format(str, parent, conId);
		}else{
			str="parent = '%s' and conid = '%s' and bdgid in %s order by bdgid";
			str = String.format(str, parent, conId, bba_bdgids);
		}
		List<VBdgConApp> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), str);
	    //对查询语句的返回值进行处理，
		//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
		//isleaf是根据当前实体Bean 中的属性进行定义
		//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
		//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置
		//则页面显示复选框及是否选中状态

		List newList=DynamicDataUtil.changeisLeaf(objects, "isleaf");
		return newList;
	}
	/*
	 * 合同金额分摊时获得概算树（被选择的树）treeGrid
	 */
	public List<ColumnTreeNode> getBudgetNewTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String contId=(String)map.get("conid");
		String pid=(String)map.get("pid");
	       //拼装一般查询语句		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' order by bdgid";
		str = String.format(str, parent, pid);
		List<VBdgInfo> objects = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgInfo"), str);
		Iterator<VBdgInfo> itr = objects.iterator();
		
		while (itr.hasNext()) {
			VBdgInfo temp = (VBdgInfo) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			List lt = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgLibrary"),
					"conid = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "'");
			if (lt != null && lt.size() > 0) {
				temp.setIscheck(true);
			} 
		}
		
		List newList=DynamicDataUtil.changeisLeaf(objects, "isleaf");
		return newList;
	}
	/**
	 * shangtw 得到moneyApp
	 * @param bdgMoneyApp
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getBdgMoneyAppNew(BdgMoneyApp bdgMoneyApp)throws BusinessException{
		int flag = 0;
		String bdgid = bdgMoneyApp.getBdgid();
		String conid=bdgMoneyApp.getConid();
		String parentId = bdgMoneyApp.getParent();
		String strbma= "parent = '%s' and conid='%s' and bdgid='%s' order by bdgid";
		strbma = String.format(strbma, parentId, conid,bdgid);
		List<BdgMoneyApp> objectbma = this.bdgMoneyDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), strbma);
		BdgMoneyApp temp=new BdgMoneyApp();
		if(objectbma!=null&&objectbma.size()>0){
			temp=objectbma.get(0);
		}
		if(temp!=null){
			return temp.getAppid();
		}
		return "";
	}
			
}
