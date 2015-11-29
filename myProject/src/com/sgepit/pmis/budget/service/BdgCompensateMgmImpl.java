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
import com.sgepit.pmis.budget.dao.BdgCompensateDAO;
import com.sgepit.pmis.budget.hbm.BdgBreachApp;
import com.sgepit.pmis.budget.hbm.BdgChangApp;
import com.sgepit.pmis.budget.hbm.BdgClaApp;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.budget.hbm.VBdgInfo;
import com.sgepit.pmis.budget.hbm.VBdgLibrary;
import com.sgepit.pmis.budget.hbm.VBdgpayapp;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConCla;

public class BdgCompensateMgmImpl extends BaseMgmImpl implements BdgComopensateMgmFacade {

	private BdgCompensateDAO bdgCompensateDao;

	private BusinessException businessException;
	private Object[][] object;
	
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static BdgCompensateMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (BdgCompensateMgmImpl) ctx.getBean("bdgCompensateMgm");
	}


	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	public void setBdgCompensateDao(BdgCompensateDAO bdgCompensateDao) {
		this.bdgCompensateDao = bdgCompensateDao;
	}

	private String checkValidConbre(BdgChangApp bdgChange) {
		StringBuffer msg = new StringBuffer("");
		//项目编号不能为空
		if (bdgChange.getPid() == null || bdgChange.getPid().trim().equals("")) {
			msg.append(new BusinessException(BusinessConstants.MSG_PID_IS_NULL));
			msg.append("<br>");
			
		}
		//检查数据是否唯一
		String where = " pid = '" + bdgChange.getPid() + "' and caid='" + bdgChange.getCaid() + "'  and conid <> '" + bdgChange.getConid() + "'";;
		List list = this.bdgCompensateDao.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), where);		
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}
		return msg.toString();
	}
	
	private boolean checkUniqueConbre(BdgChangApp bdgChange) {
		String where = " pid = '" + bdgChange.getPid() + "' and claid='" + bdgChange.getCaid() + "'";
		List list = this.bdgCompensateDao.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), where);
		if (list.size() > 0) {
			return false;
		}
		return true;
	}
	
	public void deleteBdgCompensate(BdgClaApp bdgCompensate) throws SQLException,
			BusinessException {
		this.bdgCompensateDao.delete(bdgCompensate);
		
	}

	public void insertBdgCompensate(BdgClaApp bdgCompensate) throws SQLException,
			BusinessException {
		this.bdgCompensateDao.insert(bdgCompensate);
		
	}

	@SuppressWarnings("unchecked")
	public void updateBdgCompensate(BdgClaApp bdgCompensate) throws SQLException,
			BusinessException {
		PcDynamicData  pdd = new PcDynamicData();
		if(bdgCompensate.getClaappid()==null||"".equals(bdgCompensate.getClaappid())){
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		}else {
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
		}
		this.bdgCompensateDao.saveOrUpdate(bdgCompensate);
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(BdgClaApp.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgClaApp.class.getName()));
		
		pdd.setPctableuids(bdgCompensate.getClaappid());
		pdd.setPcurl(DynamicDataUtil.BDG_CLAAPP_URL);
		pdd.setPid(bdgCompensate.getPid());
		bdgCompensateDao.insert(pdd);
		List dataList = new ArrayList();
		dataList.add(bdgCompensate);
		dataList.add(pdd);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgCompensate.getPid(),"","","修改索赔分摊数据");
			dataExchangeService.addExchangeListToQueue(ExchangeList);	
		}
	}
   //-----------------------------------------------------------------------------------------------------------
  // user method
  //------------------------------------------------------------------------------------------------------------
	/**
	 * zhugx  获得选择后的树(合同索赔分摊)
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgCompensateTree(String parentId, String conid,String claid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + conid+  "' and claid = '" + claid + "' order by bdgid";
		List<BdgClaApp> objects = this.bdgCompensateDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_COMPENSATE_APP), str);
		Iterator<BdgClaApp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgClaApp temp = (BdgClaApp) itr.next();
			String strChild= " conid = '%s' and bdgid = '%s'";
			strChild = String.format(strChild,conid, temp.getBdgid());
			List<VBdgConApp> bis = this.bdgCompensateDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strChild);
			VBdgConApp bi=new VBdgConApp();
			if(bis!=null&&bis.size()>0)bi=bis.get(0);
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
//	public String bdgCompensateTree(String parentId, String conid,String claid)
//			throws BusinessException {
//		StringBuffer sbf = new StringBuffer("[");
//		try {
//			String parent = parentId != null ? parentId: Constant.APPBudgetRootID;
//			String str = "parent = '" + parent + "' and conid = '" + conid+  "' and claid = '" + claid + "' order by bdgid";
//
//			List list = this.bdgCompensateDao.findByWhere(
//					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_COMPENSATE_APP), str);
//
//			BdgClaApp bca = null;
//			List bmaExtlist = new ArrayList();
//
//			for (int i = 0; i < list.size(); i++) {
//				bca = (BdgClaApp) list.get(i);
//				String s = "conid='" + bca.getConid() + "' and bdgid='" + bca.getBdgid() + "'";
//				List bm =  this.bdgCompensateDao.findByWhere(
//						BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP),s);
//				bca.setBdgmoney(((BdgMoneyApp)bm.get(0)).getRealmoney());
//				
//				BdgInfo bi = (BdgInfo) this.bdgCompensateDao.findById(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), 
//						bca.getBdgid());
//				
//				bca.setBdgno(bi.getBdgno());
//				bca.setBdgname(bi.getBdgname());
//				bmaExtlist.add(bca);
//			}
//
//			Iterator itr = bmaExtlist.iterator();
//			while (itr.hasNext()) {
//				BdgClaApp temp = (BdgClaApp) itr.next();
//				int leaf = temp.getIsleaf().intValue();
//				
//				sbf.append("{claappid:\"");
//				sbf.append(temp.getClaappid());	
//				sbf.append("\",bdgid:\"");
//				sbf.append(temp.getBdgid());
//				sbf.append("\",pid:\"");
//				sbf.append(temp.getPid());
//				sbf.append("\",conid:\"");
//				sbf.append(temp.getConid());
//				sbf.append("\",bdgno:\"");
//				sbf.append(temp.getBdgno());
//				sbf.append("\",bdgname:\"");
//				sbf.append(temp.getBdgname());
//				sbf.append("\",bdgmoney:");
//				Double bdgmoney = temp.getBdgmoney();
//				if (bdgmoney == null){
//					bdgmoney = new Double(0); 
//				}
//				sbf.append(bdgmoney);
//				sbf.append(",clamoney:");
//				Double clamoney = temp.getClamoney();
//				if (clamoney == null){
//					clamoney = new Double(0); 
//				}
//				sbf.append(clamoney);
//				sbf.append(",claid:\"");
//				sbf.append(temp.getClaid());
//				sbf.append("\",isleaf:");
//				sbf.append(temp.getIsleaf());
//				sbf.append(",parent:\"");
//				sbf.append(temp.getParent());
//				sbf.append("\",uiProvider:\"col\"");
//				if (0 == leaf) {
//					sbf.append(",cls:\"master-task\",iconCls:\"task-folder\"");
//					//sbf.append(",children:");
//					//sbf.append(bdgCompensateTree(temp.getBdgid(), conid,claid));
//				} else {
//					sbf.append(",iconCls:\"task\",leaf:true");
//				}
//				sbf.append("}");
//				if (itr.hasNext()) {
//					sbf.append(",");
//				}
//			}
//			sbf.append("]");
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BusinessException(e.getMessage());
//		}
//		return sbf.toString();
//	}
	
	/**
	 * zhugx 保存选择的子树(合同索赔分摊)
	 * @param conid
	 * @param ids
	 */
	@SuppressWarnings("unchecked")
	public int  saveBdgcompensateTree(String conid, String claid,String[] ids) {
		List dataList = new ArrayList();
		String pid="";
		for (int i = 0; i < ids.length; i++) {
			BdgClaApp bca = new BdgClaApp();
			BdgMoneyApp bma = (BdgMoneyApp) this.bdgCompensateDao.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), ids[i]);
			if(i==0)
				pid=bma.getPid();
				String str = "bdgid = '" +bma.getBdgid() + "'" + "and conid='" + conid + "' and claid='" + claid + "'" ;
					List list = (List) this.bdgCompensateDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_COMPENSATE_APP), str);
					if (list.size() > 0)
						continue ;
			bca.setPid(bma.getPid());
			bca.setBdgid(bma.getBdgid());
			bca.setConid(conid);
			bca.setClaid(claid);
			bca.setIsleaf(bma.getIsleaf());
			bca.setParent(bma.getParent());
			this.bdgCompensateDao.insert(bca);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(BdgClaApp.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgClaApp.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(bca.getClaappid());
			pdd.setPcurl(DynamicDataUtil.BDG_CLAAPP_URL);
			pdd.setPid(bca.getPid());
			bdgCompensateDao.insert(pdd);
			dataList.add(bca);
			dataList.add(pdd);
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","保存索赔分摊树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
		return 0;
	}
	
	/**
	 * @author zhugx 删除合同变更概算树 
	 * @param bdgId
	 * @return
	 * @throws BusinessException 
	 * @throws SQLException 
	 */
	@SuppressWarnings("unchecked")
	public int deleteBdgCompensate(String claappid) throws SQLException, BusinessException{
		int flag = 1; // 删除返回标志: 0为成功，1为失败
		String beanName = BusinessConstants.BDG_PACKAGE+ BusinessConstants.BDG_COMPENSATE_APP;
		BdgClaApp bca = (BdgClaApp) this.bdgCompensateDao.findById(beanName, claappid);
		// 查询记录不存在返回失败
		if (bca == null) {
			return 1;
		}
		// 删除记录，并且改变节点统计金额
		this.bdgCompensateDao.delete(bca);
		List dataList = new ArrayList();
		dataList.add(bca);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bca.getPid(),"","","删除索赔分摊");
			dataExchangeService.addExchangeListToQueue(ExchangeList);	
		}
		//父节点本身直接删除
		if(bca.getParent().equals("0")){
			return 0;
		}
		//得到父节点容器
		String strParent = "bdgid = '" + bca.getParent() + "' and conid= '"+ bca.getConid() + "'" + "and claid='" + bca.getClaid() + "'";
		List list = (List) this.bdgCompensateDao.findByWhere(beanName, strParent);
		BdgClaApp bcaParent = (BdgClaApp) list.get(0);
		
		if(bcaParent.getParent().equals("0")){
			if(null == bcaParent.getClamoney()){
				bcaParent.setClamoney(new Double("0"));
			}
			if(null == bca.getClamoney()){
				bca.setClamoney(new Double("0"));
			}
			Double r = bcaParent.getClamoney() - bca.getClamoney();
			bcaParent.setClamoney(r);	
		}else{
			this.sumbdgCompensateForDelete(bca);
		}
		
		flag = 0;

		// 查询这条记录父节点有几条子记录
		String strKid = "parent = '" + bcaParent.getBdgid() + "' and conid= '"
				+ bca.getConid() + "'" + "and claid='" + bca.getClaid() + "'";;
		
		List listKid = (List) this.bdgCompensateDao.findByWhere(beanName, strKid);

		//如果父节点对应子记录不存在，则传父节点id进行递归
		if (listKid.size() == 0) {
			this.deleteBdgCompensate(bcaParent.getClaappid());
		}

		// 返回标志
		return flag;
	}
	/**
	 * zhugx 保存对合同变更概算编辑(右键编辑)数据
	 * @param bdgId6
	 * @return
	 */
	public int addOrUpdateBdgCompensate(BdgClaApp bca){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants. BDG_COMPENSATE_APP;
		try {
			this.updateBdgCompensate(bca);			
			this.sumbdgCompensate(bca.getParent(),bca.getConid(),bca.getClaid());
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				List datachangeList = new ArrayList();
				String sql = "select * from (select * from bdg_cla_app  app where app.pid='"+bca.getPid()+"' and app.conid='"+bca.getConid()+"') t  start with t.bdgid='"+bca.getBdgid()+"' connect by prior t.parent=t.bdgid";
				List listcompensateApp=bdgCompensateDao.getDataAutoCloseSes(sql);
				for(int i=0;i<listcompensateApp.size();i++){
					Object[] objs=(Object[])listcompensateApp.get(i);
					BdgClaApp  bcaData= new BdgClaApp();
					bcaData.setClaappid((String)objs[0]);
					PcDynamicData pdd = new PcDynamicData();
					pdd.setPcdynamicdate(new Date());
					pdd.setPctablebean(beanName);
					pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
					pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					pdd.setPctableuids((String)objs[0]);
					pdd.setPcurl(DynamicDataUtil.BDG_CLAAPP_URL);
					pdd.setPid(bca.getPid());
					bdgCompensateDao.insert(pdd);
					datachangeList.add(pdd);
					datachangeList.add(bcaData);
				}
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(datachangeList, Constant.DefaultOrgRootID,bca.getPid(),"","","修改索赔分摊");
				dataExchangeService.addExchangeListToQueue(ExchangeList);		
			}			
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * @author zhugx  合同变更概算金额统计(编辑时)
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public void sumbdgCompensate(String parentId, String conid,String claid) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_COMPENSATE_APP;
		String str = "parent = '" + parentId + "' and conid= '" + conid + "'" + "and claid='" + claid +"'";
		List list = (List)this.bdgCompensateDao.findByWhere(beanName, str);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgClaApp bma = (BdgClaApp) iterator.next();
			Double d = bma.getClamoney();
			if (d == null){
				d = new Double(0);
			}
			db += d;
		}
		String strParent = "bdgid = '" + parentId + "' and conid= '" + conid + "'" + "and claid='" + claid +"'" ;
		List  list3= (List)this.bdgCompensateDao.findByWhere(beanName,strParent);
		if(list3.size()>0){
			BdgClaApp  parentInfo =(BdgClaApp)list3.get(0);
			parentInfo.setClamoney(db);
			this.updateBdgCompensate(parentInfo);	
			if (!"0".equals(parentInfo.getParent()))
				this.sumbdgCompensate(parentInfo.getParent(),conid,claid);			
		}
	}
	/**
	 * @author zhugx  合同变更概算金额统计(删除时)
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgCompensateForDelete(BdgClaApp bca) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_COMPENSATE_APP;
		String str = "parent = '" + bca.getParent() + "' and conid= '" + bca.getConid() + "'" + " and claid='" + bca.getClaid()+"'";
		List list = (List)this.bdgCompensateDao.findByWhere(beanName, str);
	
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgClaApp obj_bdgInfo = (BdgClaApp) iterator.next();
				if (obj_bdgInfo.getBdgid().equals(bca.getBdgid())) continue;
				if(null==obj_bdgInfo.getClamoney())
					obj_bdgInfo.setClamoney(0.0);
			db += obj_bdgInfo.getClamoney();
		}
		
		String strParent = "bdgid = '" +  bca.getParent() + "' and conid= '" +  bca.getConid() + "'"+ " and claid='" + bca.getClaid()+"'";
		List  list3= (List)this.bdgCompensateDao.findByWhere(beanName,strParent);
		
		if (list3.size() > 0){
			BdgClaApp  parentInfo  =(BdgClaApp)list3.get(0);
			parentInfo.setClamoney(db);
			this.updateBdgCompensate(parentInfo);
			this.sumbdgCompensate(parentInfo.getParent(),parentInfo.getConid(),parentInfo.getClaid());
		}
		
	}


	@SuppressWarnings("all")
	public String validateCompensate(String conpenid, String pid, String bdgid,
			String compenMoney) {
		String comApp= "select nvl(app.clamoney,0) from BDG_CLA_APP app where app.claid='"+conpenid+"' and app.pid='"+pid+"' and app.parent='0'";
		List appList= bdgCompensateDao.getDataAutoCloseSes(comApp);		
		 double appMoney=0d;
		 if(appList.size()>0){
			 appMoney+=((BigDecimal)appList.get(0)).doubleValue();
		 }
		 if(compenMoney!=null&&!"".equals(compenMoney)){
			 appMoney+=Double.valueOf(compenMoney);
		 }
		 String currentSql = "select nvl(app.clamoney,0) from BDG_CLA_APP app where app.claid='"+conpenid+"' and app.pid='"+pid+"' and app.bdgid='"+bdgid+"'";
		 List currList =bdgCompensateDao.getDataAutoCloseSes(currentSql);
		 if(currList.size()>0){
			 appMoney-=((BigDecimal)currList.get(0)).doubleValue();
		 }
		 ConCla  conCla=(ConCla)bdgCompensateDao.findById(ConCla.class.getName(),conpenid);
		 if(conCla!=null){
			 if(appMoney>conCla.getClamoney()){
				 return "1";
			 }
		 }
		 //计算累计
		 String conSql= "select nvl(sum(nvl(app.realmoney,0)),0) from bdg_money_app  app where app.bdgid='"+bdgid+"' and app.pid='"+pid+"' ";
		 List conList =bdgCompensateDao.getDataAutoCloseSes(conSql);
		 double  totalMoney=0d;
		 if(conList.size()>0){
			 totalMoney+=((BigDecimal)conList.get(0)).doubleValue();
		 }
		    //变更累计
	    String chaSql = "select nvl(sum(nvl(app.camoney,0)),0) from bdg_chang_app  app where  app.pid='"+pid+"' and app.bdgid='"+bdgid+"'";
	    List chaList = bdgCompensateDao.getDataAutoCloseSes(chaSql);
	    if(chaList.size()>0){
	    	totalMoney+=((BigDecimal)chaList.get(0)).doubleValue();
	    }
	    if(compenMoney!=null&&!"".equals(compenMoney)){
		    totalMoney+=Double.valueOf(compenMoney);
	    }
	    //违约累计
	    String breSql="select nvl(sum(nvl(app.appmoney,0)),0) from bdg_breach_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgid+"'";
	    List breList =bdgCompensateDao.getDataAutoCloseSes(breSql);
	    if(breList.size()>0){
	    	totalMoney+=((BigDecimal)breList.get(0)).doubleValue();
	    }
	    //索赔累计
	    String claSql ="select nvl(sum(nvl(app.clamoney,0)),0) from bdg_cla_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgid+"' and app.claid<>'"+conpenid+"'";
	    List claList =bdgCompensateDao.getDataAutoCloseSes(claSql);
	    if(claList.size()>0){
	    	totalMoney+=((BigDecimal)claList.get(0)).doubleValue();
	    }
	    BdgInfo bdgInfo=(BdgInfo)bdgCompensateDao.findById(BdgInfo.class.getName(), bdgid);
		if(totalMoney>bdgInfo.getBdgmoney()){
			return "2";
		} 
		 return "";
		
	}

	/**
	 * zhugx 保存选择的子树(合同索赔分摊)
	 * @param conid
	 * @param ids
	 */
	@SuppressWarnings("unchecked")
	public int  saveBdgcompensateLibraryTree(String conid, String claid,String[] ids) {
		List dataList = new ArrayList();
		String pid="";
		String strSql="";
		String bdgid="";		
		for (int i = 0; i < ids.length; i++) {
			BdgClaApp bca = new BdgClaApp();
			bdgid = ids[i];
			strSql = "bdgid = '%s' and conid = '%s' order by bdgid";
			strSql= String.format(strSql, bdgid, conid);
			List<VBdgConApp> objects = this.bdgCompensateDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strSql);
			VBdgConApp vbdgconapp=new VBdgConApp();
			if(objects!=null&&objects.size()>0)
				vbdgconapp=objects.get(0);
			if(i==0)
				pid=vbdgconapp.getPid();
				String str = "bdgid = '" +bdgid + "'" + "and conid='" + conid + "' and claid='" + claid + "'" ;
					List list = (List) this.bdgCompensateDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_COMPENSATE_APP), str);
					if (list.size() > 0)
						continue ;
			bca.setPid(vbdgconapp.getPid());
			bca.setBdgid(vbdgconapp.getBdgid());
			bca.setConid(conid);
			bca.setClaid(claid);
			bca.setIsleaf(vbdgconapp.getIsleaf());
			bca.setParent(vbdgconapp.getParent());
			this.bdgCompensateDao.insert(bca);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(BdgClaApp.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgClaApp.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(bca.getClaappid());
			pdd.setPcurl(DynamicDataUtil.BDG_CLAAPP_URL);
			pdd.setPid(bca.getPid());
			bdgCompensateDao.insert(pdd);
			dataList.add(bca);
			dataList.add(pdd);
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","保存索赔分摊树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
		return 0;
	}
	/**
	 * shangtw  获得选择后的树(合同索赔分摊)treeGrid
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgCompensateTreeGrid(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String conid=(String)map.get("conid");
		String claid=(String)map.get("claid");		
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + conid+  "' and claid = '" + claid + "' order by bdgid";
		List<BdgClaApp> objects = this.bdgCompensateDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_COMPENSATE_APP), str);
		Iterator<BdgClaApp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			BdgClaApp temp = (BdgClaApp) itr.next();
			String strChild= " conid = '%s' and bdgid = '%s'";
			strChild = String.format(strChild,conid, temp.getBdgid());
			List<VBdgConApp> bis = this.bdgCompensateDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strChild);
			VBdgConApp bi=new VBdgConApp();
			if(bis!=null&&bis.size()>0)bi=bis.get(0);
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

	/**
	 * shangtw  合同索赔分摊 - 删除节点
	 * @param clappid
	 * @return int
	 */
	public int deleteCompensateChildNode(String clappid) {
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_COMPENSATE_APP;
		try {
			BdgClaApp bdgClaApp = (BdgClaApp)this.bdgCompensateDao.findById(beanName, clappid);
			if (null == bdgClaApp) return flag;
			String strWhere = "parent = '" + bdgClaApp.getParent() + "' and conid = '" + bdgClaApp.getConid() + "' and claid = '" + bdgClaApp.getClaid() + "'";
			List list = (List)this.bdgCompensateDao.findByWhere(beanName, strWhere);
			if (list != null){
				if (list.size() == 1){
					String strPWhere = "bdgid = '" + bdgClaApp.getParent() + "' and conid = '" + bdgClaApp.getConid() + "' and claid = '" + bdgClaApp.getClaid() + "'";
					List list2 = (List)this.bdgCompensateDao.findByWhere(beanName, strPWhere);
					if (list2.size() > 0){
						BdgClaApp parentBdg = (BdgClaApp)list2.get(0);
						parentBdg.setIsleaf(new Long("1"));
						this.bdgCompensateDao.saveOrUpdate(parentBdg);
						String uuid = parentBdg.getClaappid();
						this.bdgCompensateDao.delete(bdgClaApp);
						List dataList = new ArrayList();
						dataList.add(parentBdg);
						dataList.add(bdgClaApp);
						if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
							PCDataExchangeService dataExchangeService = 
								(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
							List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgClaApp.getPid(),"","","删除索赔分摊树");
							dataExchangeService.addExchangeListToQueue(ExchangeList);	
						}
						this.deleteCompensateChildNode(uuid);
					}
				}
				this.bdgCompensateDao.delete(bdgClaApp);
				List dataList = new ArrayList();
				dataList.add(bdgClaApp);
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgClaApp.getPid(),"","","删除违约分摊");
					dataExchangeService.addExchangeListToQueue(ExchangeList);	
				}
			}else{
				flag = 1;return flag;
			}
			this.sumbdgCompensateForDelete(bdgClaApp);
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}

	
}
