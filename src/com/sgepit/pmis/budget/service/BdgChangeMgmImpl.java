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
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.dao.BdgChangeDAO;
import com.sgepit.pmis.budget.hbm.BdgChangApp;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConCha;

public class BdgChangeMgmImpl extends BaseMgmImpl implements BdgChangeMgmFacade {

	private BdgChangeDAO bdgChangeDao;

	private BusinessException businessException;
	private Object[][] object;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static BdgChangeMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (BdgChangeMgmImpl) ctx.getBean("bdgChangeMgm");
	}


	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	
	
	public void setBdgChangeDao(BdgChangeDAO bdgChangeDao) {
		this.bdgChangeDao = bdgChangeDao;
	}

	private String checkValidConbre(BdgChangApp bdgChange) {
		StringBuffer msg = new StringBuffer("");
		//项目编号不能为空
		if (bdgChange.getPid() == null || bdgChange.getPid().trim().equals("")) {
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
		String where = " pid = '" + bdgChange.getPid() + "' and caid='" + bdgChange.getCaid() + "'  and conid <> '" + bdgChange.getConid() + "'";;
		List list = this.bdgChangeDao.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), where);		
		if (list.size() > 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}
		return msg.toString();
	}
	
	private boolean checkUniqueConbre(BdgChangApp bdgChange) {
		String where = " pid = '" + bdgChange.getPid() + "' and claid='" + bdgChange.getCaid() + "'";
		List list = this.bdgChangeDao.findByWhere(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), where);
		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	public void deleteBdgChange(BdgChangApp bdgChange) throws SQLException,
			BusinessException {
		this.bdgChangeDao.delete(bdgChange);
		
	}

	public void insertBdgChange(BdgChangApp bdgChange) throws SQLException,
			BusinessException {
		this.bdgChangeDao.insert(bdgChange);
		
	}

	@SuppressWarnings("unchecked")
	public void updateBdgChange(BdgChangApp bdgChange) throws SQLException,
			BusinessException {
		PcDynamicData pdd = new PcDynamicData();
		if(bdgChange.getCaid()==null||"".equals(bdgChange.getCaid())){
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		}else {
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
		}
		this.bdgChangeDao.saveOrUpdate(bdgChange);
		pdd.setPcdynamicdate( new Date());
		pdd.setPctablebean(BdgChangApp.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgChangApp.class.getName()));
		pdd.setPctableuids(bdgChange.getCaid());
		pdd.setPcurl(DynamicDataUtil.BDG_CHANGEAPP_URL);
		pdd.setPid(bdgChange.getPid());
		this.bdgChangeDao.insert(pdd);
		List dataList = new ArrayList();
		dataList.add(bdgChange);
		dataList.add(pdd);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bdgChange.getPid(),"","","修改变更分摊");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
		
	}
   //-----------------------------------------------------------------------------------------------------------
  // user method
  //------------------------------------------------------------------------------------------------------------
	/**
	 * zhugx  获得选择后的树(合同变更分摊)
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgChangeTree(String parentId, String conId,String chaid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and conid = '%s' and cano = '%s' order by bdgid";
		str = String.format(str, parentId, conId, chaid);
		List<BdgChangApp> objects = this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), str);
		Iterator<BdgChangApp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgChangApp temp = (BdgChangApp) itr.next();
			String strChild= " conid = '%s' and bdgid = '%s'";
			strChild = String.format(strChild,conId, temp.getBdgid());
			List<VBdgConApp> bis = this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strChild);
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
			//n.setIfcheck("none");
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}	
	/**
	 * shangtw  获得选择后的树(合同变更分摊),treeGrid方式
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgChangeTreeGrid(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException {
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String conId=(String)map.get("conid");
		String chaid=(String)map.get("chaid");
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and conid = '%s' and cano = '%s' order by bdgid";
		str = String.format(str, parentId, conId, chaid);
		List<BdgChangApp> objects = this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), str);
		Iterator<BdgChangApp> itr = objects.iterator();
		
		while (itr.hasNext()) {
			BdgChangApp temp = (BdgChangApp) itr.next();
			String strChild= " conid = '%s' and bdgid = '%s'";
			strChild = String.format(strChild,conId, temp.getBdgid());
			List<VBdgConApp> bis = this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strChild);
			VBdgConApp bi=new VBdgConApp();
			if(bis!=null&&bis.size()>0)bi=bis.get(0);
			if (bi ==null)
				continue;
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
	 * zhugx 保存选择的子树(合同变更分摊)
	 * @param conid
	 * @param ids
	 */
	@SuppressWarnings("unchecked")
	public int  saveBdgmoneyTree(String conid, String chaid,String[] ids) {
		List dataList = new ArrayList();
		String pid ="";
		for (int i = 0; i < ids.length; i++) {
			BdgChangApp bca = new BdgChangApp();
			BdgMoneyApp bma = (BdgMoneyApp) this.bdgChangeDao.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), ids[i]);
			if(i==0){
				pid=bma.getPid();
			}
				String str = "bdgid = '" +bma.getBdgid() + "'" + "and conid='" + conid + "' and cano='" + chaid + "'" ;
					List list = (List) this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), str);
					if (list.size() > 0)
						continue ;
			bca.setPid(bma.getPid());
			bca.setBdgid(bma.getBdgid());
			bca.setConid(conid);
			bca.setCano(chaid);
			bca.setIsleaf(bma.getIsleaf());
			bca.setParent(bma.getParent());
			this.bdgChangeDao.insert(bca);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate( new Date());
			pdd.setPctablebean(BdgChangApp.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgChangApp.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(bca.getCaid());
			pdd.setPcurl(DynamicDataUtil.BDG_CHANGEAPP_URL);
			pdd.setPid(bca.getPid());
			this.bdgChangeDao.insert(pdd);
			dataList.add(bca);
			dataList.add(pdd);
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","保存变更分摊树");
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
	public int deleteChildNodeBdgChangeApp(String caid) throws SQLException, BusinessException{
		int flag = 1; // 删除返回标志: 0为成功，1为失败

		String beanName = BusinessConstants.BDG_PACKAGE+ BusinessConstants.BDG_CHANGE_APP;

		BdgChangApp bca = (BdgChangApp) this.bdgChangeDao.findById(beanName, caid);

		// 查询记录不存在返回失败
		if (bca == null) {
			return 1;
		}
		// 删除记录，并且改变节点统计金额
		this.bdgChangeDao.delete(bca);
		List dataList = new ArrayList();
		dataList.add(bca);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,bca.getPid(),"","","删除合同变更树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
		//父节点本身直接删除
		if(bca.getParent().equals("0")){
			return 0;
		}
		//得到父节点容器
		String strParent = "bdgid = '" + bca.getParent() + "' and conid= '"+ bca.getConid() + "'" + "and cano='" + bca.getCano() + "'";
		List list = (List) this.bdgChangeDao.findByWhere(beanName, strParent);
		BdgChangApp bcaParent = (BdgChangApp) list.get(0);
		
		if(bcaParent.getParent().equals("0")){
			if(null == bcaParent.getCamoney()){
				bcaParent.setCamoney(new Double("0"));
			}
			if(null == bca.getCamoney()){
				bca.setCamoney(new Double("0"));
			}
			Double r = bcaParent.getCamoney() - bca.getCamoney();
			bcaParent.setCamoney(r);	
		}else{
			this.sumbdgChangeAppForDelete(bca);
		}
		
		flag = 0;

		// 查询这条记录父节点有几条子记录
		String strKid = "parent = '" + bcaParent.getBdgid() + "' and conid= '"
				+ bca.getConid() + "'" + "and cano='" + bca.getCano() + "'";;
		
		List listKid = (List) this.bdgChangeDao.findByWhere(beanName, strKid);

		//如果父节点对应子记录不存在，则传父节点id进行递归
		if (listKid.size() == 0) {
			this.deleteChildNodeBdgChangeApp(bcaParent.getCaid());
		}

		// 返回标志
		return flag;
	}
	/**
	 * zhugx 保存对合同变更概算编辑(右键编辑)数据
	 * @param bdgId6
	 * @return
	 */
	public int addOrUpdateBdgChangeApp(BdgChangApp bca){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants. BDG_CHANG_APP;		
		try {			
			this.updateBdgChange(bca);				
			this.sumbdgChangeApp(bca.getParent(),bca.getConid(),bca.getCano());
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				List datachangeList = new ArrayList();
				String sql = "select * from (select * from bdg_chang_app app where app.pid='"+bca.getPid()+"' and app.conid='"+bca.getConid()+"') t  start with t.bdgid='"+bca.getBdgid()+"' connect by prior t.parent=t.bdgid";
				List listchangeApp=bdgChangeDao.getDataAutoCloseSes(sql);
				for(int i=0;i<listchangeApp.size();i++){
					Object[] objs=(Object[])listchangeApp.get(i);
					BdgChangApp  bcaData= new BdgChangApp();
					bcaData.setCaid((String)objs[0]);
					PcDynamicData pdd = new PcDynamicData();
					pdd.setPcdynamicdate(new Date());
					pdd.setPctablebean(beanName);
					pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(beanName));
					pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					pdd.setPctableuids((String)objs[0]);
					pdd.setPcurl(DynamicDataUtil.BDG_CHANGEAPP_URL);
					pdd.setPid(bca.getPid());
					bdgChangeDao.insert(pdd);
					datachangeList.add(pdd);
					datachangeList.add(bcaData);
				}
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(datachangeList, Constant.DefaultOrgRootID,bca.getPid(),"","","修改变更分摊");
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
	public void sumbdgChangeApp(String parentId, String conid,String cano) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CHANGE_APP;
		String str = "parent = '" + parentId + "' and conid= '" + conid + "'" + "and cano='" + cano +"'";
		List list = (List)this.bdgChangeDao.findByWhere(beanName, str);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgChangApp bma = (BdgChangApp) iterator.next();
			Double d = bma.getCamoney();
			if (d == null){
				d = new Double(0);
			}
			db += d;
		}
		String strParent = "bdgid = '" + parentId + "' and conid= '" + conid + "'" + "and cano='" + cano +"'" ;
		List  list3= (List)this.bdgChangeDao.findByWhere(beanName,strParent);
		BdgChangApp  parentInfo =(BdgChangApp)list3.get(0);
		parentInfo.setCamoney(db);
		this.updateBdgChange(parentInfo);
		
		if (!"0".equals(parentInfo.getParent()))
			this.sumbdgChangeApp(parentInfo.getParent(),conid,cano);
	}
	/**
	 * @author zhugx  合同变更概算金额统计(删除时)
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public void sumbdgChangeAppForDelete(BdgChangApp bca) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CHANGE_APP;
		String str = "parent = '" + bca.getParent() + "' and conid= '" + bca.getConid() + "'" + " and cano='" + bca.getCano()+"'";
		List list = (List)this.bdgChangeDao.findByWhere(beanName, str);
	
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgChangApp obj_bdgInfo = (BdgChangApp) iterator.next();
				if (obj_bdgInfo.getBdgid().equals(bca.getBdgid()))
					continue;
				if(obj_bdgInfo.getCamoney()!=null)
				db += obj_bdgInfo.getCamoney();
		}
		
		String strParent = "bdgid = '" +  bca.getParent() + "' and conid= '" +  bca.getConid() + "'"+ " and cano='" + bca.getCano()+"'";
		List  list3= (List)this.bdgChangeDao.findByWhere(beanName,strParent);
		
		if (list3.size() > 0){
			BdgChangApp  parentInfo  =(BdgChangApp)list3.get(0);
			parentInfo.setCamoney(db);
			this.updateBdgChange(parentInfo);
			this.sumbdgChangeApp(parentInfo.getParent(),parentInfo.getConid(),parentInfo.getCano());
		}
		
	}
	
	/**
	 *  判断该合同是否有工程量分摊
	 */
	public int isProject(String conid){
		int flag = 0;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = " select  distinct t.conid " + 
					 " from bdg_project t " +
					 " where t.conid='"+conid+"'";
		List list = jdbc.queryForList(sql);
		if (list.size() > 0){
			flag = 1;
		}
		return flag;
	}
	
	/**
	 *  判断该合同是否有设备
	 */
	public int isEquipment(String conid){
		int flag = 0;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select distinct  t.conid " + 
					 " from equ_info t " + 
					 "  where t.conid = '"+ conid +"' ";
		List list = jdbc.queryForList(sql);
		if (list.size() > 0){
			flag = 1;
		}
		return flag;
	}


	@SuppressWarnings("unchecked")
	public String CheckChaAppIsValid(String chaid, String bdgid, String pid,
			String money) {
		 String appSql="select nvl(app.camoney,0) from bdg_chang_app  app where app.cano='"+chaid+"' and app.pid="+pid+" and app.parent='0'";
		 List appList = bdgChangeDao.getDataAutoCloseSes(appSql);
		 String currentApp="select nvl(app.camoney,0) from bdg_chang_app  app where app.cano='"+chaid+"' and app.pid="+pid+" and app.bdgid='"+bdgid+"'";
		 List currApp=bdgChangeDao.getDataAutoCloseSes(currentApp);
		 double appMoney=0d;
		 if(appList.size()>0){
			 appMoney+=((BigDecimal)appList.get(0)).doubleValue();
		 }
		 if(money!=null&&!"".equals(money)){
			 appMoney+=Double.valueOf(money);
		 }
		 if(currApp.size()>0){
			 appMoney-=((BigDecimal)currApp.get(0)).doubleValue();
		 }
		 ConCha   conCha= (ConCha) bdgChangeDao.findById(ConCha.class.getName(), chaid);
		 if(conCha!=null){
			 if(appMoney>conCha.getChamoney()){
				 return "1";
			 }
		 }
		 
		 //概算项目上的累计金额超过分摊金额
		 String conSql= "select nvl(sum(nvl(app.realmoney,0)),0) from bdg_money_app  app where app.bdgid='"+bdgid+"' and app.pid='"+pid+"' ";
		 List conList =bdgChangeDao.getDataAutoCloseSes(conSql);
		 double  totalMoney=0d;
		 if(conList.size()>0){
			 totalMoney+=((BigDecimal)conList.get(0)).doubleValue();
		 }
		    //变更累计
	    String chaSql = "select nvl(sum(nvl(app.camoney,0)),0) from bdg_chang_app  app where  app.pid='"+pid+"' and app.bdgid='"+bdgid+"' and app.cano<>'"+chaid+"'";
	    List chaList = bdgChangeDao.getDataAutoCloseSes(chaSql);
	    if(chaList.size()>0){
	    	totalMoney+=((BigDecimal)chaList.get(0)).doubleValue();
	    }
	    if(money!=null&&!"".equals(money)){
		    totalMoney+=Double.valueOf(money);
	    }
	    //索赔累计
	    String breSql="select nvl(sum(nvl(app.appmoney,0)),0) from bdg_breach_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgid+"'";
	    List breList =bdgChangeDao.getDataAutoCloseSes(breSql);
	    if(breList.size()>0){
	    	totalMoney+=((BigDecimal)breList.get(0)).doubleValue();
	    }
	    //违约累计
	    String claSql ="select nvl(sum(nvl(app.clamoney,0)),0) from bdg_cla_app  app where app.pid='"+pid+"' and app.bdgid='"+bdgid+"'";
	    List claList =bdgChangeDao.getDataAutoCloseSes(claSql);
	    if(claList.size()>0){
	    	totalMoney+=((BigDecimal)claList.get(0)).doubleValue();
	    }
	    BdgInfo bdgInfo=(BdgInfo)bdgChangeDao.findById(BdgInfo.class.getName(), bdgid);
		if(totalMoney>bdgInfo.getBdgmoney()){
			return "2";
		} 
	    return "";
	}
	
	/**
	 * zhugx 保存选择的子树(概算金额分摊)
	 * @param conid
	 * @param ids
	 */
	@SuppressWarnings("all")
	public void saveGetBudgetTree(String conid, String chaid,String[] ids) {
		List dataList = new ArrayList();
		String pid ="";
		for (int i = 0; i < ids.length; i++) {
			BdgChangApp bca = new BdgChangApp();
			BdgInfo bma = (BdgInfo) this.bdgChangeDao.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), ids[i]);
			if(i==0){
				pid=bma.getPid();
			}
				String str = "bdgid = '" +bma.getBdgid() + "'" + "and conid='" + conid + "' and cano='" + chaid + "'" ;
					List list = (List) this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), str);
					if (list.size() > 0)
						continue ;
			bca.setPid(bma.getPid());
			bca.setBdgid(bma.getBdgid());
			bca.setConid(conid);
			bca.setCano(chaid);
			bca.setIsleaf(bma.getIsleaf());
			bca.setParent(bma.getParent());
			this.bdgChangeDao.insert(bca);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate( new Date());
			pdd.setPctablebean(BdgChangApp.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgChangApp.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(bca.getCaid());
			pdd.setPcurl(DynamicDataUtil.BDG_CHANGEAPP_URL);
			pdd.setPid(bca.getPid());
			this.bdgChangeDao.insert(pdd);
			dataList.add(bca);
			dataList.add(pdd);
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","保存变更分摊选择其他树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
	}
	/**
	 * shangtw  获得选择后的树(合同变更分摊)
	 * @param parentId
	 * @param conid
	 * chaid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgProjectChangeTree(String parentId, String conId,String chaid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and conid = '%s' and cano = '%s' order by bdgid";
		str = String.format(str, parentId, conId, chaid);
		List<BdgChangApp> objects = this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), str);
		Iterator<BdgChangApp> itr = objects.iterator();
		String textStr="";
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgChangApp temp = (BdgChangApp) itr.next();
			String strChild= " conid = '%s' and bdgid = '%s'";
			strChild = String.format(strChild,conId, temp.getBdgid());
			List<VBdgConApp> bis = this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), strChild);
			VBdgConApp bi=new VBdgConApp();
			if(bis!=null&&bis.size()>0)bi=bis.get(0);
			if (bi ==null)
				continue;
			temp.setBdgno(bi.getBdgno());
			temp.setBdgname(bi.getBdgname());
			temp.setBdgmoney(bi.getBdgmoney());
			temp.setConbdgappmoney(bi.getConbdgappmoney());
			temp.setConappmoney(bi.getConappmoney());
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgid());			// treenode.id
			if(null==temp.getCamoney()){
				temp.setCamoney(0.0);
			}
			textStr=temp.getBdgname()+"_"+temp.getBdgno()+"("+temp.getCamoney()+")";
			n.setText(textStr);		// treenode.text
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
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	/**
	 * shangtw 保存选择的子树(合同变更分摊)
	 * @param conid
	 * @param ids
	 */
	@SuppressWarnings("unchecked")
	public int  saveBdgmoneyNewTree(String conid, String chaid,String[] ids) {
		List dataList = new ArrayList();
		String pid ="";
		for (int i = 0; i < ids.length; i++) {
			BdgChangApp bca = new BdgChangApp();
			String strbma= "bdgid = '%s' and conid='%s' order by bdgid";
			strbma = String.format(strbma, ids[i], conid);
			List<BdgMoneyApp> objects = this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), strbma);
			BdgMoneyApp bma=new BdgMoneyApp();
			if(objects!=null&&objects.size()>0){
				bma=objects.get(0);
			}
			if(i==0){
				pid=bma.getPid();
			}
				String str = "bdgid = '" +bma.getBdgid() + "'" + "and conid='" + conid + "' and cano='" + chaid + "'" ;
					List list = (List) this.bdgChangeDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANGE_APP), str);
					if (list.size() > 0)
						continue ;
			bca.setPid(bma.getPid());
			bca.setBdgid(bma.getBdgid());
			bca.setConid(conid);
			bca.setCano(chaid);
			bca.setIsleaf(bma.getIsleaf());
			bca.setParent(bma.getParent());
			this.bdgChangeDao.insert(bca);
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate( new Date());
			pdd.setPctablebean(BdgChangApp.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgChangApp.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
			pdd.setPctableuids(bca.getCaid());
			pdd.setPcurl(DynamicDataUtil.BDG_CHANGEAPP_URL);
			pdd.setPid(bca.getPid());
			this.bdgChangeDao.insert(pdd);
			dataList.add(bca);
			dataList.add(pdd);
		}
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","保存变更分摊树");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
		return 0;
	}
	
}
