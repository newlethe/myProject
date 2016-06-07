package com.sgepit.pmis.finalAccounts.complete.service;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConOveView;
import com.sgepit.pmis.finalAccounts.complete.dao.FACompleteDAO;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompFixedAssetList;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompCostFixedAssetCont;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompCostFixedTotalView;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAsset;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherAssetConView;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostConView;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostCont;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostProject;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostProjectView;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostStatistics;
import com.sgepit.pmis.investmentComp.hbm.ProAcmInfo;
import com.sgepit.pmis.investmentComp.hbm.ProAcmMonth;

public class FACostManageServiceImpl implements FACostManageService {
	
	private FACompleteDAO faCompleteDAO;
	/**
	 * 一类和二类费用分摊公式
	 */
	public final static String HANDFORMULA="0001";//手动分摊
	public final static String FIRST001="FIRST001";//一类费用分摊公式一
	public final static String FIRST003="FIRST003";//一类费用分摊公式三
	public final static String SECOND001="SECOND001";//二类费用分摊公式一
	public final static String SECOND004="SECOND004";//二类费用分摊公式四
	/**
	 * 固定资产分类编码
	 */
	public final static String FIXED_ASSET_TYPE_SB_NEED_SB="010103";//设备--需安装设备
	public final static String FIXED_ASSET_TYPE_SB_NEED_SB_FLAG="C";//设备--需安装设备
	public final static String FIXED_ASSET_TYPE_SB_UN_NEED_SB_FLAG="D";//设备--不需安装设备
	public final static String FIXED_ASSET_TYPE_SB_UN_NEED_SB="010104";//设备--不需安装设备
	public final static String FIXED_ASSET_TYPE_SB_JZ="";//土建--设备基座
//	public final static String FIXED_ASSET_TYPE_TJ="010101";//土建
//	public final static String FIXED_ASSET_TYPE_SB="010102";//设备
	public final static String FIXED_ASSET_TYPE_TJ_FW_FLAG="A";//土建--房屋
	public final static String FIXED_ASSET_TYPE_TJ_FW="010101";//土建--房屋
	public final static String FIXED_ASSET_TYPE_TJ_JZWANDGZW_FLAG="B";//土建--建筑物和构筑物
	public final static String FIXED_ASSET_TYPE_TJ_JZWANDGZW="010102";//土建--建筑物和构筑物
	
	public String FIXED_ASSET_TYPE_SB_NEED_SB_STR1="(select treeid from FACOMP_FIXED_ASSET_TREE where FIXEDNO='"+this.FIXED_ASSET_TYPE_SB_NEED_SB+"')||'%'";
	public String FIXED_ASSET_TYPE_SB_NEED_SB_STR2="'"+this.FIXED_ASSET_TYPE_SB_NEED_SB+"%'";

	public FACompleteDAO getFaCompleteDAO() {
		return faCompleteDAO;
	}

	public void setFaCompleteDAO(FACompleteDAO faCompleteDAO) {
		this.faCompleteDAO = faCompleteDAO;
	}
	public String getUuidValue() {
		return getUUID().replaceAll("-", "");
	}
	
	/**
	 * 通过session获取pid，可以不从前台传递
	 * @return
	 * @author zhangh 2013-7-30
	 */
	public String getPid() {
		String pid = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			pid = session.getAttribute(Constant.CURRENTAPPPID).toString(); 
		}
		return pid;
	}
	
	/**
	 * 返回随机主键36位（带'-'号）
	 * @return
	 */
	public static String getUUID(){
		return java.util.UUID.randomUUID().toString();
	}
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String pid = "";
		if ( params.get("pid") != null){
			pid = ((String[]) params.get("pid"))[0];
		}
		if (treeName.equalsIgnoreCase("bdgMoneyProjectTree")) { // 获得合同工程量分摊树
			String contId = ((String[]) params.get("conid"))[0];
			list = getBdgMoneyProjectTree(parentId, contId);
			return list;
		}
		if (treeName.equalsIgnoreCase("otherAssetConTree")) { // 获得其他资产合同树
			list = getOtherAssetConTree(parentId, pid);
			return list;
		}
		return list;
	}
	public List<ColumnTreeNode> getOtherAssetConTree(String parentId, String pid){
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String str= "parentid = '"+parentId+"' and pid='"+pid+"' order by conid";
		List<FacompOtherAssetConView> objects = this.faCompleteDAO.findByWhere(FacompOtherAssetConView.class.getName(), str);
		Iterator<FacompOtherAssetConView> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			FacompOtherAssetConView temp = (FacompOtherAssetConView) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getConid());
			n.setText(temp.getConname());		// treenode.text
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
	 * 合同工程量概算树
	 */
	public List<ColumnTreeNode> getBdgMoneyProjectTree(String parentId, String conId){
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String strbma= "parent = '%s' and conid='%s' order by bdgid";
		strbma = String.format(strbma, parentId, conId);
		List<BdgMoneyApp> objectbma = this.faCompleteDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), strbma);
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
		List<VBdgConApp> objects = this.faCompleteDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgConApp"), str);
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
	 * 
	* @Title: getOtherCostProjectTree
	* @Description: 参与其他费用分摊的合同工程量明细树
	* @param orderBy
	* @param start
	* @param limit
	* @param map
	* @return   
	* @return List<ColumnTreeNode>    
	* @throws
	* @author qiupy 2013-7-6
	 */
	public List<ColumnTreeNode> getOtherCostProjectTree(String orderBy, Integer start, Integer limit, HashMap map) {
		List<FacompOtherCostProjectView> list = new ArrayList();
		// 页面定义处的参数
		String parent = (String) map.get("parent");
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		String conid = (String) map.get("conid");
		String bdgid = (String) map.get("bdgid");
		
		// 拼装一般查询语句
		list = this.faCompleteDAO.findByWhere(FacompOtherCostProjectView.class.getName(),
				" parent='" + parent + "' and pid='" + pid + "' and conid='"
				+ conid + "' and bdgid = '"+bdgid+"' ", "treeid");
	    //对查询语句的返回值进行处理，
		//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
		//isleaf是根据当前实体Bean 中的属性进行定义
		//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
		//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置,则页面显示复选框及是否选中状态
		for (FacompOtherCostProjectView faocpv : list) {
			List lt = this.faCompleteDAO.findByWhere(FacompOtherCostProject.class.getName(),
					"PROID = '" + faocpv.getProappid() + "' and BDGID = '" + faocpv.getBdgid() +
					"' and CONID = '"+ faocpv.getConid() + "' and pid = '"+ faocpv.getPid() + "'");
			if (lt != null && lt.size() > 0) {
				faocpv.setIscheck(1L);
			}
		}
	    List newList= DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	/**
	 * 
	* @Title: saveSelectProjectTree
	* @Description:  保存合同对应的工程量
	* @param conid
	* @param costType
	* @param ids   
	* @return void    
	* @throws
	* @author qiupy 2013-7-10
	 */
	public void saveSelectProjectTree(String conid,String costType, String[] ids){
		FacompOtherCostConView faoccv=(FacompOtherCostConView) this.faCompleteDAO.findById(FacompOtherCostConView.class.getName(), conid);
		if(faoccv!=null){
			String masterid =faoccv.getMasterid();
			FacompOtherCostCont faocc=null;
			Double  costContMoney=0d;
			String billStateStr="";
//			//只有完结的施工进度款报表数据才能参与分摊
//			if("SG".equals(faoccv.getCondivno())){
//				billStateStr=" and bill_state='1' ";
//			}
			if(masterid==null){
				faocc=new FacompOtherCostCont();
				faocc.setPid(faoccv.getPid());
				faocc.setConid(faoccv.getConid());
				faocc.setContState("0");
				faocc.setOtherCostType(costType);
				faocc.setContFormula("");
				//取得整个合同的投资完成金额,只有财务稽核通过的数据才有效
				String sql="select nvl(sum(nvl(RATIFTMONEY,0)),0) as TOTALRATIMONTHMONEY from pro_acm_tree where BDGID='"+faoccv.getPid()+"-01' "
				+" and MON_ID in(select uids from pro_acm_month where audit_State='1' and conid='"+conid+"' and pid='"+faoccv.getPid()+"' and month<=(select max(month) from "
				+" pro_acm_month where audit_State='1' and conid='"+conid+"' and pid='"+faoccv.getPid()+"'))";
				List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
				Iterator it = l.iterator();
				Double investmentFinishMoney=0d;
				while (it.hasNext()) {
					Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
					investmentFinishMoney=map.get("TOTALRATIMONTHMONEY").doubleValue();
				}
				faocc.setInvestmentFinishMoney(investmentFinishMoney);
				faocc.setUnContMoney(0d);
				faocc.setAlContMoney(0d);
				faocc.setCostContMoney(costContMoney);
				faocc.setRemark("");
				this.faCompleteDAO.insert(faocc);
				masterid=faocc.getUids();
			}else{
				faocc=(FacompOtherCostCont) this.faCompleteDAO.findById(FacompOtherCostCont.class.getName(), masterid);
			}
			costContMoney=faocc.getCostContMoney()==null?new Double(0):faocc.getCostContMoney();
			for(int i=0;i<ids.length;i++){
				FacompOtherCostProject faocp=new FacompOtherCostProject();
				FacompOtherCostProjectView faocpv=(FacompOtherCostProjectView) this.faCompleteDAO.findById(FacompOtherCostProjectView.class.getName(), ids[i]);
				String str=" proid='"+faocpv.getProappid()+"' and bdgid = '" +faocpv.getBdgid() + "' and conid='" + conid+ "'";
				List list=this.faCompleteDAO.findByWhere(FacompOtherCostProject.class.getName(), str);
				if(list!=null&&list.size()>0) continue;
				faocp.setBdgid(faocpv.getBdgid());
				faocp.setConid(conid);
				faocp.setMasterid(masterid);
				faocp.setPid(faocpv.getPid());
				faocp.setProid(faocpv.getProappid());
				faocp.setTreeid(faocpv.getBdgid());
				faocp.setIscheck(1L);
				//取得单个工程量的投资完成金额
//				String sql="select nvl(THIS_MON_COMP,0) as THIS_MON_COMP from V_CONT_BAL_MANAGE_REPORT where BDGID='"+faocpv.getTreeid()+"' "
//				+" and MASTER_ID=(select uids from CONT_BAL_MANAGE where conid='"+conid+"' and sj_type=(select max(sj_type) from "
//				+" CONT_BAL_MANAGE where audit_State='1' and conid='"+conid+"' and projecttype in('2','QT')  and pid='"+faoccv.getPid()+"'))";
//				List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
//				Iterator it = l.iterator();
				Double investmentFinishMoney=faocpv.getInvestmentFinishMoney()==null?0d:faocpv.getInvestmentFinishMoney();
//				while (it.hasNext()) {
//					Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
//					investmentFinishMoney=map.get("THIS_MON_COMP").doubleValue();
//				}
				costContMoney=costContMoney+investmentFinishMoney;
				faocp.setInvestmentFinishMoney(investmentFinishMoney);
				this.faCompleteDAO.insert(faocp);
			}
			faocc.setCostContMoney(costContMoney);
			this.faCompleteDAO.saveOrUpdate(faocc);
		}
	}
	/**
	 * 
	* @Title: initFixedAssetTreeForFirstCon
	* @Description:  参与一类费用分摊的合同初始化固定资产数据
	* @param masterid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-10
	 */
	public void initFixedAssetTreeForFirstCon(String masterid){
		List<FACompFixedAssetList> list=this.faCompleteDAO.findByWhere(FACompFixedAssetList.class.getName(), "1=1");
		Iterator items = list.iterator();
		while(items.hasNext()){
			FACompFixedAssetList fafat=(FACompFixedAssetList) items.next();
			FacompCostFixedAssetCont facfac=null;
			List<FacompCostFixedAssetCont> facfacList=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "treeid='"+fafat.getTreeid()+"' and masterid='"+masterid+"'");
			if(facfacList!=null&&facfacList.size()>0){
				facfac=facfacList.get(0);
			}else{
				facfac=new FacompCostFixedAssetCont();
				facfac.setMasterid(masterid);
				facfac.setTreeid(fafat.getTreeid());
				facfac.setParentid(fafat.getParentid());
				facfac.setCostValue2(0d);
				facfac.setPid(fafat.getPid());
			}
			String sql="select nvl(sum(nvl(JZGC_GCL,0)+nvl(JZGC_CL,0)+nvl(AZGC_GCL,0)+nvl(AZGC_CL,0)+nvl(SBGZF,0)),0) FIXED_ASSERT_MONEY from facomp_fixed_asset "
				+" where treeid like '"+fafat.getTreeid()+"%'";
			List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
			Iterator it = l.iterator();
			Double costValue1=0d;
			while (it.hasNext()) {
				Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
				costValue1=map.get("FIXED_ASSERT_MONEY").doubleValue();
			}
			facfac.setFixedno(fafat.getFixedno());
			facfac.setFixedname(fafat.getFixedname());
			facfac.setIsleaf(fafat.getIsleaf());
			facfac.setCostValue1(costValue1);
			Double costValue2=facfac.getCostValue2()==null?new Double(0):facfac.getCostValue2();
			facfac.setCostValue3(costValue1+costValue2);
			this.faCompleteDAO.saveOrUpdate(facfac);
		}
	}
	/**
	 * 
	* @Title: initFixedAssetTreeForSecondtCon
	* @Description:  参与二类费用分摊的合同初始化固定资产数据
	* @param masterid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-10
	 */
	public void initFixedAssetTreeForSecondCon(String masterid){
		List<FACompFixedAssetList> list=this.faCompleteDAO.findByWhere(FACompFixedAssetList.class.getName(), "1=1");
		Iterator items = list.iterator();
		while(items.hasNext()){
			FACompFixedAssetList fafat=(FACompFixedAssetList) items.next();
			FacompCostFixedAssetCont facfac=null;
			List<FacompCostFixedAssetCont> facfacList=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "treeid='"+fafat.getTreeid()+"' and masterid='"+masterid+"'");
			if(facfacList!=null&&facfacList.size()>0){
				facfac=facfacList.get(0);
			}else{
				facfac=new FacompCostFixedAssetCont();
				facfac.setMasterid(masterid);
				facfac.setTreeid(fafat.getTreeid());
				facfac.setParentid(fafat.getParentid());
				facfac.setCostValue1(0d);
				facfac.setCostValue2(0d);
				facfac.setPid(fafat.getPid());
			}
			String sql="select nvl(cost_value3,0) FIRST_COST_MONEY from facomp_cost_fixed_total_view "
				+" where treeid ='"+fafat.getTreeid()+"' and other_cost_type='0001'";
			List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
			Iterator it = l.iterator();
			Double costValue3=0d;
			while (it.hasNext()) {
				Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
				costValue3=map.get("FIRST_COST_MONEY").doubleValue();
			}
			facfac.setFixedno(fafat.getFixedno());
			facfac.setFixedname(fafat.getFixedname());
			facfac.setIsleaf(fafat.getIsleaf());
			facfac.setCostValue3(costValue3);
			this.faCompleteDAO.saveOrUpdate(facfac);
		}
	}
	/**
	 * 
	* @Title: updateFixedAssetTreeForFirstCon
	* @Description: 
	* @param masterid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-15
	 */
	public void updateFixedAssetTreeForSecondCon(String masterid){
		List<FacompCostFixedAssetCont> list=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "masterid='"+masterid+"'");
		Iterator items = list.iterator();
		while(items.hasNext()){
			FacompCostFixedAssetCont facfac=(FacompCostFixedAssetCont) items.next();
			String sql="select nvl(cost_value3,0) FIRST_COST_MONEY from facomp_cost_fixed_total_view "
				+" where treeid ='"+facfac.getTreeid()+"' and other_cost_type='0001'";
			List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
			Iterator it = l.iterator();
			Double costValue3=0d;
			while (it.hasNext()) {
				Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
				costValue3=map.get("FIRST_COST_MONEY").doubleValue();
			}
			facfac.setCostValue3(costValue3);
			this.faCompleteDAO.saveOrUpdate(facfac);
		}
	}
	public void updateFixedAssetTreeForFirstCon(String masterid){
		List<FacompCostFixedAssetCont> list=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "masterid='"+masterid+"'");
		Iterator items = list.iterator();
		while(items.hasNext()){
			FacompCostFixedAssetCont facfac=(FacompCostFixedAssetCont) items.next();
			String sql="select nvl(sum(nvl(JZGC_GCL,0)+nvl(JZGC_CL,0)+nvl(AZGC_GCL,0)+nvl(AZGC_CL,0)),0) FIXED_ASSERT_MONEY from facomp_fixed_asset "
				+" where treeid like '"+facfac.getTreeid()+"%'";
			List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
			Iterator it = l.iterator();
			Double costValue1=0d;
			System.out.println(facfac.getTreeid());
			while (it.hasNext()) {
				Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
				costValue1=map.get("FIXED_ASSERT_MONEY").doubleValue();
			}
			facfac.setCostValue1(costValue1);
			Double costValue2=facfac.getCostValue2()==null?new Double(0):facfac.getCostValue2();
			Double costValue3=costValue1+costValue2;
			facfac.setCostValue3(costValue3);
			this.faCompleteDAO.saveOrUpdate(facfac);
		}
	}
	/**
	 * 获取参与分摊的合同的固定资产数据
	 */
	public List<ColumnTreeNode> getFACompFixedAssetList(String orderBy, Integer start, Integer limit, HashMap map) {
		List<FacompCostFixedAssetCont> list = new ArrayList();
		// 页面定义处的参数
		String parent = (String) map.get("parent");
		// 页面定义处的参数
		String masterid = (String) map.get("masterid");
		
		// 拼装一般查询语句
		list = this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(),
				" parentid='" + parent + "' and masterid='" + masterid + "'","treeid");
	    List newList= DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	/**
	 * 获取一类和二类费用汇总数据
	 */
	public List<ColumnTreeNode> getFACompFixedAssetTotalList(String orderBy, Integer start, Integer limit, HashMap map) {
		List<FacompCostFixedTotalView> list = new ArrayList();
		// 页面定义处的参数
		String parent = (String) map.get("parent");
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		String costType = (String) map.get("costType");
		
		// 拼装一般查询语句
		list = this.faCompleteDAO.findByWhere(FacompCostFixedTotalView.class.getName(),
				"otherCostType='"+costType+"' and parentid='" + parent + "' and pid='" + pid + "'","treeid");
	    List newList= DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	/**
	 * 
	* @Title: deleteContConById
	* @Description: 删除参与其他费用分摊的合同信息
	* @param masterid
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2013-7-11
	 */
	public String deleteContConById(String masterid){
		if(masterid!=null&&masterid.length()>0){
			List<FacompCostFixedAssetCont> list =this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(),
					"masterid='" + masterid + "'");
			if(list!=null&&list.size()>0){
				this.faCompleteDAO.deleteAll(list);
			}
			List<FacompOtherCostProject> list1 =this.faCompleteDAO.findByWhere(FacompOtherCostProject.class.getName(),
					"masterid='" + masterid + "'");
			if(list1!=null&&list1.size()>0){
				this.faCompleteDAO.deleteAll(list1);
			}
			FacompOtherCostCont faocc=(FacompOtherCostCont) this.faCompleteDAO.findById(FacompOtherCostCont.class.getName(), masterid);
			this.faCompleteDAO.delete(faocc);
			return "1";
		}else{
			return "0";
		}
	}
	/**
	 * 更新一类费用固定资产的分摊金额
	 */
	public String updateCostFixedAssetCont(FacompCostFixedAssetCont facfac){
		if(facfac!=null){
//			this.faCompleteDAO.saveOrUpdate(facfac);
			String masterid=facfac.getMasterid();
			String treeid=facfac.getTreeid();
			Double costValue1=facfac.getCostValue1()==null?new Double(0):facfac.getCostValue1();
			Double costValue2=facfac.getCostValue2()==null?new Double(0):facfac.getCostValue2();
			Double costValue3=costValue1+costValue2;
			String updateSql="update facomp_cost_fixed_asset_cont set cost_value3="+costValue3+",cost_value2="+facfac.getCostValue2()+" ,remark='"+facfac.getRemark()+"' where "
			+" masterid='"+masterid+"' and treeid='"+treeid+"'";
			JdbcUtil.execute(updateSql);
			String whereSql = "select t.* from facomp_cost_fixed_asset_cont t where t.masterid='"
				+ masterid
				+ "' connect by prior  t.parentid = t.treeid "
				+ " start with t.treeid='" + treeid + "' order by t.treeid desc"; // 找到父节点
			List list = JdbcUtil.query(whereSql);
			for (int i = 1; i < list.size(); i++) {//更新父节点分摊数值
				Map m = (Map) list.get(i);
				Object o = m.get("uids");
				String uidsTemp = o.toString();
				FacompCostFixedAssetCont facfacTemp = (FacompCostFixedAssetCont) this.faCompleteDAO.findById(
						FacompCostFixedAssetCont.class.getName(), uidsTemp);
				String sql="select nvl(cost_value1,0) cost_value1,nvl(cost_value2,0) cost_value2,nvl(cost_value3,0) cost_value3 from facomp_cost_fixed_asset_view where uids='"+uidsTemp+"' ";
				List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
				Iterator it = l.iterator();
//				Double pCostValue1=0d;
				Double pCostValue2=0d;
				Double pCostValue3=0d;
				while (it.hasNext()) {
					Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
//					pCostValue1=map.get("COST_VALUE1").doubleValue();
					pCostValue2=map.get("COST_VALUE2").doubleValue();
					pCostValue3=map.get("COST_VALUE3").doubleValue();
				}
//				facfacTemp.setCostValue1(pCostValue1);
				facfacTemp.setCostValue2(pCostValue2);
				facfacTemp.setCostValue3(pCostValue3);
				this.faCompleteDAO.saveOrUpdate(facfacTemp);
			}
			return "1";
		}else{
			return "0";
		}
	}
	/**
	 * 更新二类费用固定资产的分摊金额
	 */
	public String updateCost2FixedAssetCont(FacompCostFixedAssetCont facfac){
		if(facfac!=null){
			String masterid=facfac.getMasterid();
			String treeid=facfac.getTreeid();
			String updateSql="update facomp_cost_fixed_asset_cont set cost_value2="+facfac.getCostValue2()+" ,remark='"+facfac.getRemark()+"' where "
			+" masterid='"+masterid+"' and treeid='"+treeid+"'";
			JdbcUtil.execute(updateSql);
			String whereSql = "select t.* from facomp_cost_fixed_asset_cont t where t.masterid='"
				+ masterid
				+ "' connect by prior  t.parentid = t.treeid "
				+ " start with t.treeid='" + treeid + "' order by t.treeid desc"; // 找到父节点
			List list = JdbcUtil.query(whereSql);
			for (int i = 1; i < list.size(); i++) {//更新父节点分摊数值
				Map m = (Map) list.get(i);
				Object o = m.get("uids");
				String uidsTemp = o.toString();
				FacompCostFixedAssetCont facfacTemp = (FacompCostFixedAssetCont) this.faCompleteDAO.findById(
						FacompCostFixedAssetCont.class.getName(), uidsTemp);
				String sql="select nvl(cost_value2,0) cost_value2 from facomp_cost_fixed_asset_view where uids='"+uidsTemp+"' ";
				List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
				Iterator it = l.iterator();
				Double pCostValue2=0d;
				while (it.hasNext()) {
					Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
					pCostValue2=map.get("COST_VALUE2").doubleValue();
				}
				facfacTemp.setCostValue2(pCostValue2);
				this.faCompleteDAO.saveOrUpdate(facfacTemp);
			}
			return "1";
		}else{
			return "0";
		}
	}
	/**
	 * 
	* @Title: updateOtherCostContMoney
	* @Description: 更新参与其他费用分摊合同的已分摊金额
	* @param masterid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-11
	 */
	public void updateOtherCostContMoney(String masterid){
		if(masterid!=null){
			List<FacompCostFixedAssetCont> list=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "masterid='"+masterid+"' and parentid='0'");
			if(list!=null&&list.size()>0){
				FacompCostFixedAssetCont facfac=list.get(0);
				FacompOtherCostCont faocc=(FacompOtherCostCont) this.faCompleteDAO.findById(FacompOtherCostCont.class.getName(), masterid);
				Double alContMoney=facfac.getCostValue2()==null?new Double(0):facfac.getCostValue2();
				Double costContMoney=faocc.getCostContMoney()==null?new Double(0):faocc.getCostContMoney();
				Double unContMoney=costContMoney-alContMoney;
				faocc.setAlContMoney(alContMoney);
				faocc.setUnContMoney(unContMoney);
				this.faCompleteDAO.saveOrUpdate(faocc);
			}
		}
	}
	/**
	 * 更新其他费用统计
	 */
	public String updateOtherCostStatistics(FacompOtherCostStatistics focs){
		if(focs!=null){
			String treeid=focs.getTreeid();
			String updateSql="update facomp_other_cost_statistics set remark='"+focs.getRemark()+"' where "
			+" treeid='"+treeid+"'";
			JdbcUtil.execute(updateSql);
			return "1";
		}else{
			return "0";
		}
	}
	/**
	 * 
	* @Title: sumMoneyHandler
	* @Description: 汇总父节点数据
	* @param parentId   
	* @return void    
	* @throws
	* @author qiupy 2013-7-15
	 */
	private void sumMoneyHandler(String parentId){
		Double investmentFinishMoney = new Double(0);
		Double tjmoeny = new Double(0);
		Double sbmoeny = new Double(0);
		Double ldmoeny = new Double(0);
		Double wxmoeny = new Double(0);
		Double cqdtmoeny = new Double(0);
		Double totalmoney = new Double(0);
		String beanName=FacompOtherCostStatistics.class.getName();
		List list = (List)this.faCompleteDAO.findByProperty(beanName, "parentid", parentId);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			FacompOtherCostStatistics faocs = (FacompOtherCostStatistics) iterator.next();
			investmentFinishMoney+=faocs.getInvestmentFinishMoney()==null?new Double(0):faocs.getInvestmentFinishMoney();
			tjmoeny+=faocs.getTjmoeny()==null?new Double(0):faocs.getTjmoeny();
			sbmoeny+=faocs.getSbmoney()==null?new Double(0):faocs.getSbmoney();
			ldmoeny+=faocs.getLdmoney()==null?new Double(0):faocs.getLdmoney();
			wxmoeny+=faocs.getWxmoney()==null?new Double(0):faocs.getWxmoney();
			cqdtmoeny+=faocs.getCqdtmoney()==null?new Double(0):faocs.getCqdtmoney();
			totalmoney+=faocs.getTotalmoney()==null?new Double(0):faocs.getTotalmoney();
		}
		List<FacompOtherCostStatistics> parentInfoList = this.faCompleteDAO.findByProperty(beanName, "treeid", parentId);
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompOtherCostStatistics parentInfo=parentInfoList.get(0);
			parentInfo.setInvestmentFinishMoney(investmentFinishMoney);
			parentInfo.setTjmoeny(tjmoeny);
			parentInfo.setSbmoney(sbmoeny);
			parentInfo.setLdmoney(ldmoeny);
			parentInfo.setWxmoney(wxmoeny);
			parentInfo.setCqdtmoney(cqdtmoeny);
			parentInfo.setTotalmoney(totalmoney);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!"01".equals(parentInfo.getParentid())) {
				sumMoneyHandler(parentInfo.getParentid());
			}
		}
	}
	/**
	 * 
	* @Title: initOtherCostStatisticsTree
	* @Description: 初始化其他费用统计树
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2013-7-13
	 */
	public String initOtherCostStatisticsTree(String pid){
		List<FacompOtherCostStatistics> delList=this.faCompleteDAO.findByWhere(FacompOtherCostStatistics.class.getName(), "pid='"+pid+"'");
		if(delList.size()>0){
			this.faCompleteDAO.deleteAll(delList);
		}
		String whereSql = "select t.bdgid from bdg_info t where t.pid='"+ pid
			+ "' connect by prior  t.bdgid= t.parent "
			+ " start with t.bdgid='"+pid+"-0104' order by t.bdgid"; // 找到子节点
		List list = JdbcUtil.query(whereSql);
		List<String> parentIdList = new ArrayList<String>();
		for (int i = 0; i < list.size(); i++) {
			Map m = (Map) list.get(i);
			Object o = m.get("bdgid");
			String uidsTemp = o.toString();
			BdgInfo bdgInfo = (BdgInfo) this.faCompleteDAO.findById(
					BdgInfo.class.getName(), uidsTemp);
			FacompOtherCostStatistics faocs=new FacompOtherCostStatistics();
			faocs.setTreeid(bdgInfo.getBdgid());
			faocs.setPid(pid);
			faocs.setParentid(bdgInfo.getParent());
			faocs.setProno(bdgInfo.getBdgno());
			faocs.setProname(bdgInfo.getBdgname());
			faocs.setBdgmoney(bdgInfo.getBdgmoney());
			faocs.setInvestmentFinishMoney(0d);
			faocs.setTjmoeny(0d);
			faocs.setSbmoney(0d);
			faocs.setLdmoney(0d);
			faocs.setWxmoney(0d);
			faocs.setCqdtmoney(0d);
			faocs.setTotalmoney(0d);
			if(bdgInfo.getIsleaf()==0){//如果是根节点，则直接初始化为根节点
				faocs.setIsleaf(bdgInfo.getIsleaf());
				this.faCompleteDAO.insert(faocs);
			}else{//如果不是根节点，如果该叶子概算下存在分摊合同，则设置为根节点，否则为子节点
				//施工合同、服务合同和其他合同中填写了其他费用类型的合同才计入其他费用
				String moneyApp = "select b.conid  from bdg_money_app b,con_ove v where b.pid='"+ pid+ "' and b.bdgid='"+ bdgInfo.getBdgid()+"'" +
						" and b.conid=v.conid and v.CONDIVNO in('SG','QT','FW') and v.OTHER_COST_TYPE in('0001','0002','0003','0004','0005')";
				List moneyList = faCompleteDAO.getDataAutoCloseSes(moneyApp);
				if (moneyList!=null&&moneyList.size() > 0){
					faocs.setIsleaf(0l);
					parentIdList.add(bdgInfo.getBdgid());
					this.initOtherCostStatisticsConTree(moneyList,bdgInfo.getBdgid(),pid);
				}else{
					faocs.setIsleaf(1l);
				}
				this.faCompleteDAO.insert(faocs);
			}
		}
		for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
			this.sumMoneyHandler(iterator.next());
		}
		return "1";
	}
	/**
	 * 
	* @Title: initOtherCostStatisticsConTree
	* @Description: 将合同信息初始化到其他费用统计树中
	* @param conidlist
	* @param parent
	* @param pid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-15
	 */
	public void initOtherCostStatisticsConTree(List conidlist,String parent,String pid){
		for(int i=0;i<conidlist.size();i++){
			String conid =(String)conidlist.get(i);
			ConOveView cov=(ConOveView) this.faCompleteDAO.findById(ConOveView.class.getName(), conid);
			if(cov==null) continue;
			String divno=cov.getCondivno();
			String otherCostType=cov.getOtherCostType();
			FacompOtherCostStatistics faocs=new FacompOtherCostStatistics();
			faocs.setTreeid(parent+"_"+conid);//概算节点主键和合同主键组合id
			faocs.setPid(pid);
			faocs.setParentid(parent);
			faocs.setProno(cov.getConno());
			faocs.setProname(cov.getConname());
			faocs.setBdgmoney(cov.getConvaluemoney());
			//取最近一个月
			List<ProAcmMonth> contBalManageList=this.faCompleteDAO.findByWhere(ProAcmMonth.class.getName(), "auditState='1' and conid='"+conid+"' and pid='"+pid+"'", "month desc");
			Double investmentFinishMoney = 0d;
			if(contBalManageList!=null&&contBalManageList.size()>0){
				ProAcmMonth manage=contBalManageList.get(0);
				List<ProAcmInfo> listRep = this.faCompleteDAO.findByWhere(
						ProAcmInfo.class.getName(), "monId in (from " + ProAcmMonth.class.getName()
								+ " m where m.auditState='1' and m.conid = '" + manage.getConid()
								+ "' and m.month<='" + manage.getMonth() + "' and m.pid='"+pid+"') "
								+ " and bdgid ='"+parent+"'");
				for (int j = 0; j < listRep.size(); j++) {
					ProAcmInfo report = listRep.get(j);
					if(report.getRatiftmoney()!=null){
						investmentFinishMoney += report.getRatiftmoney();
					}
				}
			}
			faocs.setInvestmentFinishMoney(investmentFinishMoney);
			List<FacompOtherCostCont> facompOtherCostContList=this.faCompleteDAO.findByWhere(FacompOtherCostCont.class.getName(), "conid='"+conid+"' and pid='"+pid+"'");
			Double tjmoeny=0d;
			Double sbmoeny=0d;
			if(facompOtherCostContList!=null&&facompOtherCostContList.size()>0){
				FacompOtherCostCont faocc=facompOtherCostContList.get(0);
				String masterid=faocc.getUids();
				String sql1="select nvl(sum(cost_value2),0) cost_value2 from facomp_cost_fixed_asset_cont where treeid in(select treeid from facomp_fixed_asset where (typetreeid like '"+this.FIXED_ASSET_TYPE_TJ_FW+"%') or (typetreeid like '"+this.FIXED_ASSET_TYPE_TJ_JZWANDGZW+"%')) and masterid='"+masterid+"' ";
				List<Map<String, BigDecimal>> l = JdbcUtil.query(sql1);
				Iterator it = l.iterator();
				while (it.hasNext()) {
					Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
					tjmoeny=map.get("COST_VALUE2").doubleValue();
				}
				String sql2="select nvl(sum(cost_value2),0) cost_value2 from facomp_cost_fixed_asset_cont where treeid in(select treeid from facomp_fixed_asset where (typetreeid like '"+this.FIXED_ASSET_TYPE_SB_NEED_SB+"%') or (typetreeid like '"+this.FIXED_ASSET_TYPE_SB_UN_NEED_SB+"%')) and masterid='"+masterid+"' ";
				List<Map<String, BigDecimal>> l2 = JdbcUtil.query(sql2);
				Iterator it2 = l2.iterator();
				while (it2.hasNext()) {
					Map<String, BigDecimal> map = (Map<String, BigDecimal>) it2.next();
					sbmoeny=map.get("COST_VALUE2").doubleValue();
				}
				faocs.setTjmoeny(tjmoeny);
				faocs.setSbmoney(sbmoeny);
			}else{
				faocs.setTjmoeny(0d);
				faocs.setSbmoney(0d);
			}
			if("0003".equals(otherCostType)){
				faocs.setLdmoney(investmentFinishMoney);
			}else{
				faocs.setLdmoney(0d);
			}
			if("0004".equals(otherCostType)){
				faocs.setCqdtmoney(investmentFinishMoney);
			}else{
				faocs.setCqdtmoney(0d);
			}
			if("0005".equals(otherCostType)){
				faocs.setWxmoney(investmentFinishMoney);
			}else{
				faocs.setWxmoney(0d);
			}
			Double totalMoney = tjmoeny+sbmoeny+faocs.getLdmoney()+faocs.getCqdtmoney()+faocs.getWxmoney();
			faocs.setTotalmoney(totalMoney);
			faocs.setIsleaf(1l);
			this.faCompleteDAO.insert(faocs);
		}
		
	}
	/**
	 * 获取其他费用统计数据
	 */
	public List<ColumnTreeNode> getFacompOtherCostStatisticsTree(String orderBy, Integer start, Integer limit, HashMap map) {
		List<FacompOtherCostStatistics> list = new ArrayList();
		// 页面定义处的参数
		String parent = (String) map.get("parent");
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		
		// 拼装一般查询语句
		list = this.faCompleteDAO.findByWhere(FacompOtherCostStatistics.class.getName(),
				"parentid='" + parent + "' and pid='" + pid + "'","prono");
	    List newList= DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	/**
	 * 
	* @Title: checkFixedAssetUsed
	* @Description: 判断固定资产是否已经被使用
	* @param treeid  固定资产树id
	* @return   
	* @return true表示已经被使用，false表示未被使用   
	* @throws
	* @author qiupy 2013-7-16
	 */
	public boolean checkFixedAssetUsed(String treeid){
		List list=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "treeid='"+treeid+"'");
		if(list!=null&&list.size()>0){
			return true;
		}
		return false;
	}
	/**
	 * 
	* @Title: doContByContFormula
	* @Description:  处理分摊公式
	* @param masterid   参与其他费用分摊记录的主键
	* @param formulaType  公式编码
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2013-7-22
	 */
	public String doContByContFormula(String masterid,String formulaType){
		if(this.FIRST001.equals(formulaType)){
			doFirstContFormula1(masterid);
		}else if(this.FIRST003.equals(formulaType)){
			doFirstContFormula3(masterid);
		}else if(this.SECOND001.equals(formulaType)){
			doSecondContFormula1(masterid);
		}else if(this.SECOND004.equals(formulaType)){
			doSecondContFormula4(masterid);
		}
		return "1";
	}
	/**
	 * 
	* @Title: doFirstContFormula
	* @Description: 某设备类固定资产的一类费用分摊值=（参与分摊的一类费用金额/所有需安装设备类固定资产的设备购置费用之和）*该设备的设备购置费
	* @param masterid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-22
	 */
	public void doFirstContFormula1(String masterid){
		FacompOtherCostCont faocc=(FacompOtherCostCont) this.faCompleteDAO.findById(FacompOtherCostCont.class.getName(), masterid);
		if(faocc!=null){
			//参与分摊的一类费用金额
			Double costContMoney=faocc.getCostContMoney()==null?0d:faocc.getCostContMoney();
			String sql1="select nvl(sum(nvl(SBGZF,0)),0) FIXEDSB from facomp_fixed_asset where typetreeid " +
					" like '"+this.FIXED_ASSET_TYPE_SB_NEED_SB+"%' and pid='"+faocc.getPid()+"'";
			List<Map<String, BigDecimal>> l = JdbcUtil.query(sql1);
			Iterator it = l.iterator();
			//所有需安装设备类固定资产的设备购置费用之和
			Double fixedSbTotal=0d;
			while (it.hasNext()) {
				Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
				fixedSbTotal=map.get("FIXEDSB").doubleValue();
			}
			List<FacompCostFixedAssetCont> leafList=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "isleaf=1 and masterid='"+masterid+"'");
			List<String> parentIdList = new ArrayList<String>();
			for (Iterator iterator = leafList.iterator(); iterator.hasNext();) {
				FacompCostFixedAssetCont leaf_facfac = (FacompCostFixedAssetCont) iterator.next();
				FacompFixedAsset fafa=null;
				List lt=this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(), "treeid='"+leaf_facfac.getTreeid()+"' and pid='"+faocc.getPid()+"'");
				if(lt!=null&&lt.size()>0) fafa=(FacompFixedAsset) lt.get(0);
				//该设备的设备购置费
				Double sbBuyMoney=0d;
				if(fafa!=null) sbBuyMoney=fafa.getSbgzf()==null?0d:fafa.getSbgzf();
				BigDecimal costValue2=new BigDecimal(0);
				BigDecimal fixedSbTotal1=new BigDecimal(fixedSbTotal);
				if (fixedSbTotal1.compareTo(new BigDecimal(0)) != 0) {
					costValue2 = new BigDecimal(costContMoney).multiply(
							new BigDecimal(sbBuyMoney)).divide(
							fixedSbTotal1, 2, BigDecimal.ROUND_HALF_UP);
				}
				leaf_facfac.setCostValue2(costValue2.doubleValue());
				this.faCompleteDAO.saveOrUpdate(leaf_facfac);
				String parentId = leaf_facfac.getParentid();
				if (!parentIdList.contains(parentId)) {
					parentIdList.add(parentId);
				}
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumFirstCostContMoneyHandler(iterator.next(),masterid);
			}
		}
	}
	/**
	 * 
	* @Title: doFirstContFormula2
	* @Description: 某建筑类固定资产的一类费用分摊值=（参与分摊的一类费用金额/所有固定资产的建筑工程价值之和 ）*该固定资产的建筑工程价值之和
	* @param masterid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-23
	 */
	public void doFirstContFormula3(String masterid){
		FacompOtherCostCont faocc=(FacompOtherCostCont) this.faCompleteDAO.findById(FacompOtherCostCont.class.getName(), masterid);
		if(faocc!=null){
			//参与分摊的一类费用金额
			Double costContMoney=faocc.getCostContMoney()==null?0d:faocc.getCostContMoney();
			String sql1="select nvl(sum(nvl(JZGC_GCL,0)+nvl(JZGC_CL,0)),0) FIXEDSB from facomp_fixed_asset where pid='"+faocc.getPid()+"'";
			List<Map<String, BigDecimal>> l = JdbcUtil.query(sql1);
			Iterator it = l.iterator();
			//所有固定资产的建筑工程价值之和
			Double fixedSbTotal=0d;
			while (it.hasNext()) {
				Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
				fixedSbTotal=map.get("FIXEDSB").doubleValue();
			}
			List<FacompCostFixedAssetCont> leafList=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "masterid='"+masterid+"'");
			List<String> parentIdList = new ArrayList<String>();
			for (Iterator iterator = leafList.iterator(); iterator.hasNext();) {
				FacompCostFixedAssetCont leaf_facfac = (FacompCostFixedAssetCont) iterator.next();
				FacompFixedAsset fafa=null;
				List lt=this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(), "treeid='"+leaf_facfac.getTreeid()+"' and pid='"+faocc.getPid()+"'");
				if(lt!=null&&lt.size()>0) fafa=(FacompFixedAsset) lt.get(0);
				//该固定资产的建筑工程价值之和
				Double sbBuyMoney=0d;
				Double JzgcGcl=0d;
				Double JzgcCl=0d;
				if(fafa!=null){ 
					JzgcGcl=fafa.getJzgcGcl()==null?0d:fafa.getJzgcGcl();
					JzgcCl=fafa.getJzgcCl()==null?0d:fafa.getJzgcCl();
				}
				sbBuyMoney=JzgcGcl+JzgcCl;
				BigDecimal costValue2=new BigDecimal(0);
				BigDecimal fixedSbTotal1=new BigDecimal(fixedSbTotal);
				if (fixedSbTotal1.compareTo(new BigDecimal(0)) != 0) {
					costValue2 = new BigDecimal(costContMoney).multiply(
							new BigDecimal(sbBuyMoney)).divide(
							fixedSbTotal1, 2, BigDecimal.ROUND_HALF_UP);
				}
				leaf_facfac.setCostValue2(costValue2.doubleValue());
				this.faCompleteDAO.saveOrUpdate(leaf_facfac);
				String parentId = leaf_facfac.getParentid();
				if (!parentIdList.contains(parentId)) {
					parentIdList.add(parentId);
				}
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumFirstCostContMoneyHandler(iterator.next(),masterid);
			}
		}
	}
	/**
	 * 
	* @Title: sumFirstCostContMoneyHandler
	* @Description: 一类费用分摊公式--向上累加分摊数据
	* @param parentId   
	* @return void    
	* @throws
	* @author qiupy 2013-7-24
	 */
	private void sumFirstCostContMoneyHandler(String parentId,String masterid){
		Double costValue2 = new Double(0);
		String beanName=FacompCostFixedAssetCont.class.getName();
		List list = (List)this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and masterid='"+masterid+"'");
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			FacompCostFixedAssetCont facfa = (FacompCostFixedAssetCont) iterator.next();
			costValue2+=facfa.getCostValue2()==null?new Double(0):facfa.getCostValue2();
		}
		List<FacompCostFixedAssetCont> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and masterid='"+masterid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompCostFixedAssetCont parentInfo=parentInfoList.get(0);
			Double costValue1=parentInfo.getCostValue1()==null?0d:parentInfo.getCostValue1();
			Double costValue3=costValue1+costValue2;
			parentInfo.setCostValue2(costValue2);
			parentInfo.setCostValue3(costValue3);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!"0".equals(parentInfo.getParentid())) {
				sumFirstCostContMoneyHandler(parentInfo.getParentid(),masterid);
			}
		}
	}
	/**
	 * 
	* @Title: sumSecondtCostContMoneyHandler
	* @Description: 二类费用分摊公式--向上累加分摊数据
	* @param parentId   
	* @return void    
	* @throws
	* @author qiupy 2013-7-24
	 */
	private void sumSecondtCostContMoneyHandler(String parentId,String masterid){
		Double costValue2 = new Double(0);
		String beanName=FacompCostFixedAssetCont.class.getName();
		List list = (List)this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and masterid='"+masterid+"'");
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			FacompCostFixedAssetCont facfa = (FacompCostFixedAssetCont) iterator.next();
			costValue2+=facfa.getCostValue2()==null?new Double(0):facfa.getCostValue2();
		}
		List<FacompCostFixedAssetCont> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and masterid='"+masterid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompCostFixedAssetCont parentInfo=parentInfoList.get(0);
			parentInfo.setCostValue2(costValue2);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!"0".equals(parentInfo.getParentid())) {
				sumSecondtCostContMoneyHandler(parentInfo.getParentid(),masterid);
			}
		}
	}
	/**
	 * 
	* @Title: doSecondContFormula1
	* @Description: 某设备类固定资产的二类费用分摊值=（参与分摊的二类费用金额/所有需安装设备类固定资产的设备购置费用之和）*该设备的设备购置费
	* @param masterid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-23
	 */
	public void doSecondContFormula1(String masterid){
		FacompOtherCostCont faocc=(FacompOtherCostCont) this.faCompleteDAO.findById(FacompOtherCostCont.class.getName(), masterid);
		if(faocc!=null){
			//参与分摊的二类费用金额
			Double costContMoney=faocc.getCostContMoney()==null?0d:faocc.getCostContMoney();
			String sql1="select nvl(sum(nvl(SBGZF,0)),0) FIXEDSB from facomp_fixed_asset where typetreeid " +
					"like '"+this.FIXED_ASSET_TYPE_SB_NEED_SB+"%' and pid='"+faocc.getPid()+"'";
			List<Map<String, BigDecimal>> l = JdbcUtil.query(sql1);
			Iterator it = l.iterator();
			//所有需安装设备类固定资产的设备购置费用之和
			Double fixedSbTotal=0d;
			while (it.hasNext()) {
				Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
				fixedSbTotal=map.get("FIXEDSB").doubleValue();
			}
			List<FacompCostFixedAssetCont> leafList=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "isleaf=1 and masterid='"+masterid+"'");
			List<String> parentIdList = new ArrayList<String>();
			for (Iterator iterator = leafList.iterator(); iterator.hasNext();) {
				FacompCostFixedAssetCont leaf_facfac = (FacompCostFixedAssetCont) iterator.next();
				FacompFixedAsset fafa=null;
				List lt=this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(), "treeid='"+leaf_facfac.getTreeid()+"' and pid='"+faocc.getPid()+"'");
				if(lt!=null&&lt.size()>0) fafa=(FacompFixedAsset) lt.get(0);
				//该设备的设备购置费
				Double sbBuyMoney=0d;
				if(fafa!=null) sbBuyMoney=fafa.getSbgzf()==null?0d:fafa.getSbgzf();
				BigDecimal costValue2=new BigDecimal(0);
				BigDecimal fixedSbTotal1=new BigDecimal(fixedSbTotal);
				if (fixedSbTotal1.compareTo(new BigDecimal(0)) != 0) {
					costValue2 = new BigDecimal(costContMoney).multiply(
							new BigDecimal(sbBuyMoney)).divide(
							fixedSbTotal1, 2, BigDecimal.ROUND_HALF_UP);
				}
				leaf_facfac.setCostValue2(costValue2.doubleValue());
				this.faCompleteDAO.saveOrUpdate(leaf_facfac);
				String parentId = leaf_facfac.getParentid();
				if (!parentIdList.contains(parentId)) {
					parentIdList.add(parentId);
				}
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumSecondtCostContMoneyHandler(iterator.next(),masterid);
			}
		}
	}
	/**
	 * 
	* @Title: doSecondContFormula4
	* @Description: 某建筑类固定资产的二类费用分摊值=（参与分摊的二类费用金额/所有房屋、建筑物、构筑物总价值之和）*该固定资产的总价值 
	* @param masterid   
	* @return void    
	* @throws
	* @author qiupy 2013-7-23
	 */
	public void doSecondContFormula4(String masterid){
		FacompOtherCostCont faocc=(FacompOtherCostCont) this.faCompleteDAO.findById(FacompOtherCostCont.class.getName(), masterid);
		if(faocc!=null){
			//参与分摊的二类费用金额
			Double costContMoney=faocc.getCostContMoney()==null?0d:faocc.getCostContMoney();
			String sql1="select nvl(sum(nvl(JZGC_GCL,0)+nvl(JZGC_CL,0)+nvl(AZGC_GCL,0)+nvl(AZGC_CL,0)+nvl(SBGZF,0)+nvl(QTFY_ONE,0)),0) FIXEDSB from facomp_fixed_asset where ((typetreeid like '"+this.FIXED_ASSET_TYPE_TJ_FW+"%') or (typetreeid like '"+this.FIXED_ASSET_TYPE_TJ_JZWANDGZW+"%')) and pid='"+faocc.getPid()+"'";
			List<Map<String, BigDecimal>> l = JdbcUtil.query(sql1);
			Iterator it = l.iterator();
			//所有房屋、建筑物、构筑物总价值之和
			Double fixedSbTotal=0d;
			while (it.hasNext()) {
				Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
				fixedSbTotal=map.get("FIXEDSB").doubleValue();
			}
			List<FacompCostFixedAssetCont> leafList=this.faCompleteDAO.findByWhere(FacompCostFixedAssetCont.class.getName(), "isleaf=1 and masterid='"+masterid+"'");
			List<String> parentIdList = new ArrayList<String>();
			for (Iterator iterator = leafList.iterator(); iterator.hasNext();) {
				FacompCostFixedAssetCont leaf_facfac = (FacompCostFixedAssetCont) iterator.next();
				FacompFixedAsset fafa=null;
				List lt=this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(), "treeid='"+leaf_facfac.getTreeid()+"' and pid='"+faocc.getPid()+"'");
				if(lt!=null&&lt.size()>0) fafa=(FacompFixedAsset) lt.get(0);
				//该固定资产的总价值 
				Double sbBuyMoney=0d;
				Double JzgcGcl=0d;
				Double JzgcCl=0d;
				Double AZGC_GCL=0d;
				Double AZGC_CL=0d;
				if(fafa!=null){ 
					JzgcGcl=fafa.getJzgcGcl()==null?0d:fafa.getJzgcGcl();
					JzgcCl=fafa.getJzgcCl()==null?0d:fafa.getJzgcCl();
					AZGC_GCL=fafa.getAzgcGcl()==null?0d:fafa.getAzgcGcl();
					AZGC_CL=fafa.getAzgcCl()==null?0d:fafa.getAzgcCl();
				}
				sbBuyMoney=JzgcGcl+JzgcCl+AZGC_CL+AZGC_GCL;
				BigDecimal costValue2=new BigDecimal(0);
				BigDecimal fixedSbTotal1=new BigDecimal(fixedSbTotal);
				if (fixedSbTotal1.compareTo(new BigDecimal(0)) != 0) {
					costValue2 = new BigDecimal(costContMoney).multiply(
							new BigDecimal(sbBuyMoney)).divide(
							fixedSbTotal1, 2, BigDecimal.ROUND_HALF_UP);
				}
				leaf_facfac.setCostValue2(costValue2.doubleValue());
				this.faCompleteDAO.saveOrUpdate(leaf_facfac);
				String parentId = leaf_facfac.getParentid();
				if (!parentIdList.contains(parentId)) {
					parentIdList.add(parentId);
				}
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumSecondtCostContMoneyHandler(iterator.next(),masterid);
			}
		}
	}

	@Override
	public void saveFacompOtherCostCon(String conid, String costType) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<ColumnTreeNode> getFACompCloutFixedAssetList(String orderBy,
			Integer start, Integer limit, HashMap map) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String initFixedAssetTreeForClout(String pid, String outsubUids,
			double amount, String masterid, String type, String using,
			String relateAsset) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void updateCloutApprotionMoney(String masterid, String uids,
			double apportionMoney, String remark) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateRelateAsset(String outSubUids, double amount,
			String treeid) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<ColumnTreeNode> getFinanceSubjectTree(String orderBy,
			Integer start, Integer limit, HashMap map) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String addContConByFinaceSubject(String selectIds, String costType,
			String pid) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String updateContConByFinaceSubject(String masterId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String initCloutApportion(String pid, String flag) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String initOtherCostStatisticsTreeFromSubject(String pid) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String updateAllOtherCostCont(String pid, String costType) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void chooseFormula(String[][] masterAndFormula, String pid) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateParentCloutAppor(String pid) {
		// TODO Auto-generated method stub
		
	}
}
