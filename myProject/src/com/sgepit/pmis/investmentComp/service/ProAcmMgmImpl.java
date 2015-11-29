package com.sgepit.pmis.investmentComp.service;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.budget.hbm.VBdgProject;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.investmentComp.dao.ProAcmDAO;
import com.sgepit.pmis.investmentComp.hbm.ProAcmInfo;
import com.sgepit.pmis.investmentComp.hbm.ProAcmInfoTreeReport;
import com.sgepit.pmis.investmentComp.hbm.ProAcmInfoTreeView;
import com.sgepit.pmis.investmentComp.hbm.ProAcmMonth;
import com.sgepit.pmis.investmentComp.hbm.ProAcmTree;


public class ProAcmMgmImpl extends BaseMgmImpl  implements ProAcmMgmFacade{
	private ProAcmDAO proAcmDAO;
	
	public static ProAcmMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (ProAcmMgmImpl) ctx.getBean("proAcmMgm");
	}
	
	public void setProAcmDAO(ProAcmDAO proAcmDAO) {
		this.proAcmDAO = proAcmDAO;
	}
	
	public void delProAcm(ProAcmInfo proAcmInfo) throws SQLException,
		BusinessException {
		this.proAcmDAO.delete(proAcmInfo);
	}
	
	public void insertProAcm(ProAcmInfo proAcmInfo) throws SQLException,
		BusinessException {
		this.proAcmDAO.insert(proAcmInfo);
	}
	
	public void updateProAcm(ProAcmInfo proAcmInfo) throws SQLException,
		BusinessException {
		this.proAcmDAO.saveOrUpdate(proAcmInfo);
	}
	
	//---------------------------------------------------------------
	//  logic method
	//---------------------------------------------------------------
	/**
	 * 工程量投资完成每个月份的树
	 */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> proAcmTree(String parentId, String conid, String  monId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '" + parent + "' and conid = '" + conid+ "' and monId = '"+ monId +"' order by bdgid";
		List<ProAcmTree> objects = this.proAcmDAO.findByWhere(ProAcmTree.class.getName(), str);
		Iterator<ProAcmTree> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			ProAcmTree temp = (ProAcmTree) itr.next();
			BdgInfo bi = (BdgInfo) this.proAcmDAO.findById(
					BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), temp.getBdgid());
			temp.setBdgname(bi.getBdgname());
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getBdgid());			// treenode.id
			if (leaf == 1) {
				//有工程量投资完成记录的概算记录标红
				List<ProAcmInfo> proInfoList=this.proAcmDAO.findByWhere(ProAcmInfo.class.getName(), "bdgid='"+temp.getBdgid()+"' and monId='"+monId+"' and conid='"+conid+"'");
				if(proInfoList!=null&&proInfoList.size()>0){
					n.setText("<font color='red'>"+temp.getBdgname()+"</font>");
				}
				n.setLeaf(true);				
				n.setIconCls("task");
			} else {
				n.setText(temp.getBdgname());		// treenode.text
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
	
//	/**
//	 * 初始化工程工资完成-Info 信息
//	 * @param conid
//	 * @param monId
//	 * @param pid	项目编号
//	 */
//	@SuppressWarnings("unchecked")
	public void initialProAcmInfo(String conid, String monId, String pid){
		List list3 = this.proAcmDAO.findByProperty(ProAcmInfo.class.getName(), "monId",monId);
		if(list3!=null&&list3.size()>0){//如果工程工资完成-Info 信息已经存在，则不需要初始化
			return;
		}
		List list2 = this.proAcmDAO.findByProperty(ProAcmTree.class.getName(), "monId",monId);
		ProAcmMonth proMonth=(ProAcmMonth) this.proAcmDAO.findById(ProAcmMonth.class.getName(), monId);
		String preMonthId="";
		//取得前一个月份的投资完成主记录
		if(proMonth!=null){
			String sjType=proMonth.getMonth();
			List<ProAcmMonth> proMonthList=this.proAcmDAO.findByWhere(ProAcmMonth.class.getName(), "month<"+sjType+" and conid='"+conid+"' and pid='"+pid+"'", "month desc");
			if(proMonthList!=null&&proMonthList.size()>0){
				ProAcmMonth preMonth=proMonthList.get(0);
				preMonthId=preMonth.getUids();
			}
		}
		for (int i=0; i<list2.size(); i++){
			ProAcmTree pat = (ProAcmTree)list2.get(i);
			//初始化时自动将最近一月份已发生报量的工程量清单信息初始化到本月对应概算项
			if(preMonthId!=null&&preMonthId.length()>0){
				List<ProAcmInfo> proInfoList=this.proAcmDAO.findByWhere(ProAcmInfo.class.getName(), "bdgid='"+pat.getBdgid()+"' and monId='"+preMonthId+"' and pid='"+pid+"'");
				if(proInfoList!=null&&proInfoList.size()>0){
					for(int j=0;j<proInfoList.size();j++){
						ProAcmInfo pai = new ProAcmInfo();
						ProAcmInfo bp = (ProAcmInfo)proInfoList.get(j);
						 Double totalpro = this.getTotalpro(conid, monId, bp.getProid());
						 Double totalAmount = bp.getAmount();
						 Double totalMoney =bp.getMoney();
						 pai.setBdgid( bp.getBdgid());
						 pai.setConid(conid);//合同ID
						 pai.setMonId(monId);//月份主键
						 pai.setProid(bp.getProid());//工程量分摊主键
						 pai.setProname(bp.getProname());
						 pai.setAmount(totalAmount);//总工程量
						 pai.setMoney(totalMoney);//总金额
						 pai.setIsper(bp.getIsper());
						 if(totalAmount>0&&totalMoney>0){
							 NumberFormat nbf = NumberFormat.getInstance();
							 nbf.setMaximumFractionDigits(3);
							 pai.setPrice(totalMoney/totalAmount);
						 }else {
							 pai.setPrice(0d);
						 }
						 pai.setTotalpro(totalpro);//累计已完成工程量
						 pai.setUnit(bp.getUnit());
						 if(totalpro>0&&totalAmount>0){
							 pai.setTotalpercent((totalpro / totalAmount)*100);
						 }else {
							 pai.setTotalpercent(0d*100);
						 }
						 pai.setDeclpro(0.0);
						 pai.setDecmoney(0.0);
						 pai.setCheckpro(0.0);
						 pai.setCheckmoney(0.0);
						 pai.setRatiftpro(0.0);
						 pai.setRatiftmoney(0.0);
						 pai.setPid(pid);
						 this.proAcmDAO.insert(pai);
					}
				}
			}
		}
//		 List list = this.proAcmDAO.findByWhere(VBdgProject.class.getName(), "conid='"+conid+"' and pid='"+pid+"'");
//		 List list2 = this.proAcmDAO.findByProperty(ProAcmInfo.class.getName(), "monId",monId);
//		 this.proAcmDAO.deleteAll(list2);
//		 
//		 //初始化删除Pro_Acm_Info数据后更新Pro_Acm_month金额
//		 ProAcmMonth pam = (ProAcmMonth) this.proAcmDAO.findById(ProAcmMonth.class.getName(), monId);
//		 pam.setCheckmoney(0d);
//		 pam.setDecmoney(0d);
//		 pam.setRatiftmoney(0d);
//		 this.proAcmDAO.saveOrUpdate(pam);
//		 for (int i = 0; i < list.size(); i++) {
//			 ProAcmInfo pai = new ProAcmInfo();
//			 VBdgProject bp = (VBdgProject)list.get(i);
//			 Double totalpro = this.getTotalpro(conid, monId, bp.getProappid());
//			 Double totalAmount = this.getTotalProNameNumByConidAndProNo(bp.getProappid(), conid, bp.getBdgid(), bp.getProno(), pid);
//			 Double totalMoney =this.getTotalProMoneyByConidAndProNo(conid, bp, pid,totalAmount);
//			 pai.setBdgid( bp.getBdgid());
//			 pai.setConid(conid);//合同ID
//			 pai.setMonId(monId);//月份主键
//			 pai.setProid(bp.getProappid());//工程量分摊主键
//			 pai.setProname(bp.getProname());
//			 pai.setAmount(totalAmount);//总工程量
//			 pai.setMoney(totalMoney);//总金额
//			 
//			 if(totalAmount>0&&totalMoney>0){
//				 NumberFormat nbf = NumberFormat.getInstance();
//				 nbf.setMaximumFractionDigits(3);
//				 //String res=nbf.format(totalMoney/totalAmount);
//				 //pai.setPrice(Double.valueOf(res));
//				 pai.setPrice(totalMoney/totalAmount);
//			 }else {
//				 pai.setPrice(0d);
//			 }
//			 pai.setTotalpro(totalpro);//累计已完成工程量
//			 pai.setUnit(bp.getUnit());
//			 if(totalpro>0&&totalAmount>0){
//				 pai.setTotalpercent((totalpro / totalAmount)*100);
//			 }else {
//				 pai.setTotalpercent(0d*100);
//			 }
//			 pai.setDeclpro(0.0);
//			 pai.setDecmoney(0.0);
//			 pai.setCheckpro(0.0);
//			 pai.setCheckmoney(0.0);
//			 pai.setRatiftpro(0.0);
//			 pai.setRatiftmoney(0.0);
//			 pai.setPid(pid);
//			 this.proAcmDAO.insert(pai);
//		}
//		this.initialProAcmTree(conid, monId, pid);
	}

	/**
	 * 通过工程量主键获取总工程量（以前是通过工程量编号查询，并求和，现在改为直接找到这条数据的总工程量）
	 * @param proappid proappid 工程量主键
	 * @param conid 合同主键
	 * @param bdgid 概算主键
	 * @param prono 工程量编号
	 * @param pid pid 项目ID
	 * @return 总工程量
	 * @aythor pengy 2013-12-23
	 */
	private double getTotalProNameNumByConidAndProNo(String proappid, String conid, String bdgid, String prono, String pid){
		double amount=0d;
		BdgProject bdgPro = (BdgProject) proAcmDAO.findById(BdgProject.class.getName(), proappid);
		if(bdgPro != null){
			amount = bdgPro.getAmount();
		}
		//state 1  新增变更，2 单价变更，3 数量变更
		//司龙与国峰用户沟通后，工程量变更不计入投资完成统计 2013-12-24
//		List<BdgChangeProject> bdgChangePro = proAcmDAO.findByWhere2(BdgChangeProject.class.getName(),
//				"conid='" + conid + "' and bdgid='" + bdgid + "' and changeprono='" + prono + "' and pid='" + pid + "' and state='3'");
//		if(bdgChangePro != null && bdgChangePro.size()>0){
//			amount += bdgChangePro.get(0).getChangeamount();
//		}
		return amount;
	}

	/**
	 * 计算工程量总金额
	 * @param conid 合同主键
	 * @param pro 选择的工程量对象
	 * @param pid 项目ID
	 * @param totalAmount 总工程量
	 * @return 工程量总金额
	 */
	private double getTotalProMoneyByConidAndProNo(String conid,VBdgProject pro,String pid,Double totalAmount){
		double money =0d;
		//司龙与国峰用户沟通后，工程量变更不计入投资完成统计 2013-12-24
//		List<BdgChangeProject> priceChangeList = proAcmDAO.findByWhere(BdgChangeProject.class.getName(),
//				"conid='"+conid+"' and bdgid='"+pro.getBdgid()+"' and changeprono='"+pro.getProno()+"' and pid='"+pid+"' and state='2'");
//		if(priceChangeList.size()>0){
//			BdgChangeProject bdgChangeProject=(BdgChangeProject)priceChangeList.get(0);
//			money = (totalAmount-bdgChangeProject.getChangeamount())*pro.getPrice() + bdgChangeProject.getChangemoney();
//		}else {
			money = totalAmount * pro.getPrice();
//		}
		return money;
	}

	/**
	 * 初始化工程量投资完成每月的树
	 * @param conid
	 * @param monId
	 * @param pid	项目编号
	 */
	public void initialProAcmTree(String conid, String monId, String pid){
		List list = this.proAcmDAO.findByWhere(BusinessConstants.BDG_PACKAGE +BusinessConstants.BDG_MONEY_APP , "conid='"+conid+"' and pid='"+pid+"'");
		List list2 = this.proAcmDAO.findByProperty(ProAcmTree.class.getName(), "monId",monId);
		this.proAcmDAO.deleteAll(list2);
		for (int i=0; i<list.size(); i++){
			ProAcmTree pat = new ProAcmTree();
			BdgMoneyApp bma = (BdgMoneyApp)list.get(i);
			pat.setConid(conid);
			pat.setMonId(monId);
			pat.setBdgid(bma.getBdgid());
			pat.setProMoney(0D);
			
			pat.setParent(bma.getParent());
			pat.setIsleaf(bma.getIsleaf());
			pat.setPid(pid);
			Double sumMoney = this.getSumMoney(conid, monId, bma.getBdgid());
			pat.setSumMoney(sumMoney);
			
			pat.setDecmoney(0d);
			pat.setCheckmoney(0d);
			pat.setRatiftmoney(0d);
			this.proAcmDAO.insert(pat);
		}
		
	}
	

	/**
	 * 获得累计工程量
	 * @param conid
	 * @param monId
	 * @param bdgid
	 * @return
	 */
	public Double getTotalpro(String conid, String monId, String proid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		Double totalpro = new Double(0);
		String sql = " select nvl(sum(nvl(t.ratiftpro,0)),0) total  from pro_acm_info t where t.mon_id in ( " +
					 " select distinct x.uids  " +
                     " from  pro_acm_month x, pro_acm_month y " +
                     " where x.month < y.month and y.uids = '"+ monId +"' ) " + 
                     " and t.conid ='"+ conid +"' and t.proid ='"+ proid +"'";
		totalpro = (Double)jdbc.queryForObject(sql, Double.class);
		return totalpro;
	} 
	
	/**
	 * 累计完成金额
	 * @param conid
	 * @param monId
	 * @return
	 */
	public Double getSumMoney(String conid, String monId, String bdgid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		Double sumMoney = new Double(0);
		String sql = " select nvl(sum(nvl(pro_money,0)),0) from pro_acm_tree t where t.mon_id in ( " + 
					 " select x.uids  " + 
                     " from  pro_acm_month x, pro_acm_month y " + 
                     " where x.month < y.month and y.uids = '"+ monId +"' ) " + 
                     " and t.conid ='"+ conid +"'  and t.bdgid ='"+ bdgid +"'";
		sumMoney = (Double)jdbc.queryForObject(sql, Double.class);
		return sumMoney;
	}
	/**
	 * 获得当月累计完成金额
	 * @param conid
	 * @param monId
	 * @return
	 */
	public Double getMoney(String monId, String type){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		Double money = new Double(0);
		String sql = " select nvl(sum(nvl(t."+ type +"*t.price, 0)),0)  " + 
					 " from pro_acm_info t " + 
					 " where t.mon_id = '"+ monId +"'";
		money = (Double)jdbc.queryForObject(sql, Double.class);
		return money;
	}
	
	/**
	 * 累计该概算项的当月完成金额
	 * @param monId
	 * @param bdgid
	 * @return
	 */
	public Double sumBdgMoney(String monId, String bdgid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		Double money = new Double(0);
		String sql = " select nvl(sum(nvl(nvl(t.ratiftpro,0)*t.price, 0)),0)  " + 
					 " from pro_acm_info t " + 
					 " where t.mon_id = '"+ monId +"' and bdgid ='" + bdgid +"'";
		money = (Double)jdbc.queryForObject(sql, Double.class);
		return money;
	}
	/**
	 * 修改投资完成树
	 * @param pat
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public int UpdateTree(String[] bdgids, String monId, String conid){
		int flag = 0;
		List listMonth = this.hasNextMonth(monId, conid);
		Double  difference = 0D; 
		
		ArrayList temp = new ArrayList();
		for (int i=0; i<bdgids.length; i++){
			if (!temp.contains(bdgids[i])){
				temp.add(bdgids[i]);
			}
		}
		//-----------------------------
//		try {
//			new Thread().sleep(5000);
//		} catch (InterruptedException e1) {e1.printStackTrace();}
		//-----------------------------
		for (int i=0; i<temp.size(); i++){
			String where = " bdgid ='"+ temp.get(i).toString() + "' and monId = '"+ monId + "'";
			String beanName = ProAcmTree.class.getName();
			List list = this.proAcmDAO.findByWhere(beanName, where);
			ProAcmTree pat = (ProAcmTree)list.get(0);
			Double proMoney = this.sumBdgMoney(monId, temp.get(i).toString());
			difference = proMoney - pat.getProMoney();
			pat.setProMoney(proMoney);
			this.proAcmDAO.saveOrUpdate(pat);
			try {
				this.sumMoneyHandler(pat);
			} catch (SQLException e) {
				flag = 1;
				e.printStackTrace();
			} catch (BusinessException e) {
				flag = 1;
				e.printStackTrace();
			}
			if (listMonth.size()>0){
				this.laterMonthTree(listMonth, temp.get(i).toString(), difference);
			}
		}
		if(monId == null||"null".equals(monId)){
			monId="";
		}
		String bean = ProAcmMonth.class.getName();
		ProAcmMonth pam = (ProAcmMonth)this.proAcmDAO.findById(bean, monId);
		if(pam!=null){
			pam.setDecmoney(this.getMoney(monId, "declpro")==null?0:this.getMoney(monId, "declpro"));
			pam.setCheckmoney(this.getMoney(monId, "checkpro")==null?0:this.getMoney(monId, "checkpro"));
			pam.setRatiftmoney(this.getMoney(monId, "ratiftpro")==null?0:this.getMoney(monId, "ratiftpro"));
			this.proAcmDAO.saveOrUpdate(pam);
		}
		
		return flag;
	}
	
	/**
	 * 判断下个月是否已经有投资完成记录
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List hasNextMonth(String uids, String conid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = " select t.uids from pro_acm_month t, pro_acm_month y " +
					 " where  t.month>y.month and y.uids='"+ uids +"' and t.conid ='" + conid +"'" ;
		List list = jdbc.queryForList(sql);
		return list;
	}
	
	// 当下个月已经投资完成了,但是还修改本月的时候, 修改这个月以后的投资完成累计量(树)
	@SuppressWarnings("unchecked")
	public void laterMonthTree(List listMonth, String bdgid, Double difference ){
		String bean = ProAcmTree.class.getName();
		Iterator it = listMonth.iterator();
		while (it.hasNext()){
			Map map = (Map)it.next();
			String monId =(String)map.get("MON_ID");
			String where = " bdgid ='"+ bdgid + "' and monId = '"+ monId + "'";
			List list = this.proAcmDAO.findByWhere(bean, where);
			ProAcmTree pat = (ProAcmTree)list.get(0);
			pat.setSumMoney(pat.getSumMoney() + difference);
			this.proAcmDAO.saveOrUpdate(pat);
			try {
				this.sumMoneyHandler(pat);
			} catch (SQLException e) {
				e.printStackTrace();
			} catch (BusinessException e) {
				e.printStackTrace();
			}
		}
	}
	
	// 当下个月已经投资完成了,但是还修改本月的时候, 修改这个月以后的工程量累计量(左边grid pro_acm_Info)
	@SuppressWarnings("unchecked")
	public void laterMonthInfo(String monId, String conid,  String[] proIds, Double[] difference ){
		String bean = ProAcmInfo.class.getName();
		List laterMonth = this.hasNextMonth(monId, conid);
		if (laterMonth.size() > 0){
			for (int i=0; i<proIds.length; i++){
				Iterator it = laterMonth.iterator();
				while (it.hasNext()){
					Map map = (Map)it.next();
					String monid =(String)map.get("MON_ID");
					String where = " proid ='"+ proIds[i] + "' and monId = '"+ monid + "'";
					List list = this.proAcmDAO.findByWhere(bean, where);
					ProAcmInfo pai = (ProAcmInfo)list.get(0);
					System.out.println(monid + "|---->|"+pai.getProname() + "|--|"+ difference[i] + "|--|" + pai.getTotalpro());
 					pai.setTotalpro(pai.getTotalpro() + difference[i]);
 					pai.setTotalpercent((pai.getTotalpro() + difference[i])/pai.getAmount());
					this.proAcmDAO.saveOrUpdate(pai);
					
				}
			}
		}
	};
	
	/**
	 * 累计当月完成金额
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
	public void sumMoneyHandler(ProAcmTree pat) throws SQLException, BusinessException{
		Double db = new Double(0);
		Double sumMoney = new Double(0);
		String beanName = ProAcmTree.class.getName();
		String parentWhere = " parent ='" + pat.getParent() + "' and monId ='" + pat.getMonId() + "'";
		List list = (List)this.proAcmDAO.findByWhere(beanName, parentWhere);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			ProAcmTree pat2  = (ProAcmTree) iterator.next();
			db += pat2.getProMoney();
			sumMoney += pat2.getSumMoney();
		}
		
		String where = " bdgid ='"+ pat.getParent() + "' and monId ='"+ pat.getMonId() +"'";
		List listParent = this.proAcmDAO.findByWhere(beanName, where);
		ProAcmTree parentPat = (ProAcmTree)listParent.get(0);
		if(parentPat != null){
			if (parentPat.getProMoney() != db){
				parentPat.setProMoney(db);
			} 
			if (parentPat.getSumMoney() != sumMoney){
				parentPat.setSumMoney(sumMoney);
			}
			this.proAcmDAO.saveOrUpdate(parentPat);
			
		if (!"0".equals(parentPat.getParent()))
			sumMoneyHandler(parentPat);
		}
	}
	
  /**
   * 通过一个工程量查找对应的概算项
   * @param bdgid
   * @param monId
   * @return
   */
	@SuppressWarnings("unchecked")
   public String getPath(String bdgid, String monId){
	  StringBuffer path = new StringBuffer();
	  String tempBdgid = bdgid;
	  path.append(bdgid).append("/");
	  for(;;){
		  String where = " bdgid ='" + tempBdgid + "' and monId ='" + monId + "'";
		  String beanName = ProAcmTree.class.getName();
		  List list = this.proAcmDAO.findByWhere(beanName, where);
		  if(list != null && list.size() >0){
			  ProAcmTree pat = (ProAcmTree)list.get(0);
			  String parentBdgid = pat.getParent();
			  path.append(parentBdgid).append("/");
			  tempBdgid = parentBdgid;
			  if (tempBdgid.trim().equals("01")){
				  break;
			  } 
		  } else{
			  break;
		  }
		 
	  } 
	  path.append("0");
	  
	  String [] bdgids = path.toString().split("/");
	  StringBuffer path2 = new StringBuffer();
	  path2.append("/");
	  for (int i=bdgids.length-1; i>=0; i--){
		  path2.append(bdgids[i]);
		  if (i != 0){
			  path2.append("/");
		  }
	  }
	  return path2.toString();
  }
   /**
	 * 获取可以新增的数据期别
	 * @param conId          合同ID
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getSjTypeForComp(String conId){
		String jsonStr = "";
		Date date = new Date();
		int curYear = date.getYear()+1900;
		int lastYear = curYear - 3;
		int nextYear = curYear + 1;
		//从计划主表中获取已经存在的数据期别
		String yearInStr = "'"+String.valueOf(lastYear)+"',"+"'"+String.valueOf(curYear)+"',"+"'"+String.valueOf(nextYear)+"'"; 
		List<ProAcmMonth> list = this.proAcmDAO.findWhereOrderBy(ProAcmMonth.class.getName(), 
				"conid = '"+conId+"' and substr(month,1,4) in("+yearInStr+")", "month asc");
		String exsitSjType = "";
		for (int i =0;i<list.size();i++){
			exsitSjType = exsitSjType + "," + list.get(i).getMonth();
		}
		if(list.size()>0){
			exsitSjType = exsitSjType.substring(1);
		}		
		for(int i= lastYear;i<=nextYear;i++){
			for(int j=1;j<=12;j++){
				String sjType = String.valueOf(i)+(j<10?"0"+String.valueOf(j):String.valueOf(j));
				String sjTypeDes = String.valueOf(i)+"年" + String.valueOf(j)+"月";
				if(exsitSjType.indexOf(sjType)==-1){
					jsonStr = jsonStr + ",['"+sjType+"','"+sjTypeDes+"']";
				}
			}
		}
		if(jsonStr.length()>0){
			jsonStr = "[" + jsonStr.substring(1)+"]";
		}else{
			jsonStr = "[]";
		}
		return jsonStr;		
	}
	
	/**
	 * 删除工程量投资完成主表，同时删除从表和概算树
	 * @param pam
	 * @return
	 * @author zhangh
	 */
	@SuppressWarnings("unchecked")
	public String delProAcmMonth(ProAcmMonth pam){
		try {
			List infoList = this.proAcmDAO.findByWhere(ProAcmInfo.class.getName(), "monId = '"+pam.getUids()+"'");
			List treeList = this.proAcmDAO.findByWhere(ProAcmTree.class.getName(), "monId = '"+pam.getUids()+"'");
			this.proAcmDAO.deleteAll(treeList);
			this.proAcmDAO.deleteAll(infoList);
			this.proAcmDAO.delete(pam);
			return "1";
		} catch (Exception e) {
			e.printStackTrace();
			return "0";
		}
	}
	
	
	@SuppressWarnings("unchecked")
	public List getProAcmTree(String orderBy, Integer start, Integer limit, HashMap map) {
		List list = new ArrayList();
		//页面定义处的参数
		String parent = (String)map.get("parent");
		String pid = (String)map.get("pid");
		String conid = (String)map.get("conid");
		String monId = (String)map.get("monId");
		//String bdgid = (String)map.get("bdgid");
		
		//拼装一般查询语句
		String hql = "from ProAcmTree t ,BdgInfo i where t.bdgid = i.bdgid " +
				" and t.parent='"+parent+"' and t.pid='"+pid+"' and t.conid='"+conid+"' " +
				" and t.monId='"+monId+"' order by t.bdgid";
		List<Object[]> listObj = this.proAcmDAO.findByHql(hql);
		for (int i = 0; i < listObj.size(); i++) {
			Object[] obj = listObj.get(i);
			ProAcmTree tree = (ProAcmTree)obj[0];
			BdgInfo info = (BdgInfo)obj[1];
			tree.setBdgname(info.getBdgname());
			//动态计算本月总额和累计总额
			String bdgid = tree.getBdgid();
			String bdgSql = "select t1.bdgid from (select * from bdg_money_app t " +
					"where t.conid = '"+conid+"' and pid = '"+pid+"') t1 " +
					"start with t1.bdgid='01' connect by prior t1.bdgid = t1.parent";
			
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			//动态计算本月总额
			String thisMonthSql = "select nvl(sum(t.ratiftmoney),0) from pro_acm_info t " +
					"where t.mon_id = '"+monId+"' and bdgid in ( "+bdgSql+" )";
			Double thisMonthTotal = (Double)jdbc.queryForObject(thisMonthSql, Double.class);
			//System.out.println("本月金额："+tree.getProMoney()+"==="+thisMonthTotal);
			tree.setProMoney(thisMonthTotal);
			
			//动态计算累计总额（不含本月）
			String monIdSql = "select t.uids from pro_acm_month t, pro_acm_month y " +
					" where t.month<=y.month and y.uids='"+monId+"' and t.conid ='"+conid+"' ";
			String totalMonthSql = "select nvl(sum(t.ratiftmoney),0) from pro_acm_info t " +
					"where t.mon_id in ( "+monIdSql+" ) and bdgid in ( "+bdgSql+" )";
			Double monthTotal = (Double)jdbc.queryForObject(totalMonthSql, Double.class);
			//System.out.println("累计金额："+tree.getSumMoney()+"==="+monthTotal);
			tree.setSumMoney(monthTotal);
			
			list.add(i,tree);
		}
		List newList=DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	
	
	/**
	 * 工程量投资明细保存完成后更新Pro_Acm_month金额
	 * @param monId
	 */
	@SuppressWarnings("unchecked")
	public void updateProAcmMonth(String monId){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select nvl(sum(t.decmoney),0) d, nvl(sum(t.checkmoney),0) c, nvl(sum(t.ratiftmoney),0) r " +
		" from pro_acm_info t where mon_id = '"+monId+"'";
		Map map = jdbc.queryForMap(sql);
		BigDecimal decmoney = (BigDecimal) map.get("d");
		BigDecimal checkmoney = (BigDecimal) map.get("c");
		BigDecimal ratiftmoney = (BigDecimal) map.get("r");
		
		ProAcmMonth month = (ProAcmMonth) this.proAcmDAO.findById(ProAcmMonth.class.getName(), monId);
		month.setDecmoney(decmoney.doubleValue());
		month.setCheckmoney(checkmoney.doubleValue());
		month.setRatiftmoney(ratiftmoney.doubleValue());
		this.proAcmDAO.saveOrUpdate(month);
	}
	
	/**
	 * 工程量投资完成： 根据pro_acm_info表中的数据，更新pro_acm_tree表；
	 * @param monId
	 * @author: Liuay
	 * @createDate: 2012-2-28
	 */
	public void updateProAcmTree(String monId){
		String sql = "select t.bdgid, sum(t.decmoney) d, sum(t.checkmoney) c, sum(t.ratiftmoney) r " +
				" from pro_acm_info t where mon_id = '"+monId+"' group by t.bdgid";
		List list = JdbcUtil.query(sql);
		
		for (int i = 0; i < list.size(); i++) {
			Map map = (Map) list.get(i);
			
			String bdgid = (String) map.get("bdgid");
			BigDecimal decmoney = (BigDecimal) map.get("d");
			BigDecimal checkmoney = (BigDecimal) map.get("c");
			BigDecimal ratiftmoney = (BigDecimal) map.get("r");
			
			List<ProAcmTree> treeList = this.proAcmDAO.findByWhere(ProAcmTree.class.getName(), "mon_id='" + monId + "' and bdgid='" + bdgid + "'");
			if(treeList.size()==1) {
				ProAcmTree proAcmTree = treeList.get(0);
				proAcmTree.setDecmoney(decmoney.doubleValue());
				proAcmTree.setCheckmoney(checkmoney.doubleValue());
				proAcmTree.setRatiftmoney(ratiftmoney.doubleValue());
				this.proAcmDAO.saveOrUpdate(proAcmTree);
			}
			
			this.calParentProAcmTree(monId, bdgid);
		}
		
	}
	
	/**
	 * 工程量投资完成： 递归计算父bdgId父节点的工程量投资完成数据；
	 * @param monId
	 * @param bdgId
	 * @author: Liuay
	 * @createDate: 2012-2-28
	 */
	private void calParentProAcmTree (String monId, String bdgId) {
		BdgInfo bdgInfo = (BdgInfo) this.proAcmDAO.findById(BdgInfo.class.getName(), bdgId);
		if(bdgInfo==null)return;
		String bdgParentId = bdgInfo.getParent();

		if (!bdgParentId.equals("0")) {
			String sql = "select sum(t1.decmoney) d,sum(t1.checkmoney) c,sum(t1.ratiftmoney) r from "
				+ " (select t.* from pro_acm_tree t where t.mon_id = '"+monId+"') t1 where t1.isleaf = '1' "
				+ " start with t1.bdgid = '"+bdgParentId+"' connect by  PRIOR  t1.bdgid =  t1.parent "
				+ " order by t1.bdgid ";
			
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			Map map = jdbc.queryForMap(sql);
			BigDecimal decmoney = (BigDecimal) map.get("d");
			BigDecimal checkmoney = (BigDecimal) map.get("c");
			BigDecimal ratiftmoney = (BigDecimal) map.get("r");
			List<ProAcmTree> treeList = this.proAcmDAO.findByWhere(ProAcmTree.class.getName(), "mon_id='" + monId + "' and bdgid='" + bdgParentId + "'");
			if(treeList.size()==1) {
				ProAcmTree proAcmTree = treeList.get(0);
				proAcmTree.setDecmoney(decmoney==null ? 0D : decmoney.doubleValue());
				proAcmTree.setCheckmoney(checkmoney==null ? 0D : checkmoney.doubleValue());
				proAcmTree.setRatiftmoney(ratiftmoney==null ? 0D : ratiftmoney.doubleValue());
				this.proAcmDAO.saveOrUpdate(proAcmTree);
			}
			
			this.calParentProAcmTree(monId, bdgParentId);
		}
	}
	
	
	/**
	 * 工程量投资完成数据交互
	 * @param uids
	 * @param toPid
	 * @param fromPid
	 * @param initial 是否执行工程量完成的初始化，
	 * 				添加三个表的删除SQL，1：初始化-执行前置SQL，0：报表保存-不执行，2：删除主表数据-执行后置
	 * @return
	 * @author: zhangh
	 * @createDate: 2012-03-15
	 */
	@SuppressWarnings("unchecked")
	public String proAcmDataExchange(String uids, String toPid, String fromPid, String initial){
		ProAcmMonth proAcmMonth =  (ProAcmMonth) this.proAcmDAO.findById(ProAcmMonth.class.getName(), uids);
		if(proAcmMonth == null){
			return "0";
		}else{
			//处理前置sql语句，主要执行删除已有数据
			StringBuilder delSql = new StringBuilder();
			if(initial.equals("1")||initial.equals("2")){
				delSql.append("delete from pro_acm_month where mon_id = '"+uids+"';");
				delSql.append("delete from pro_acm_info where mon_id = '"+uids+"';");
				delSql.append("delete from pro_acm_tree where mon_id = '"+uids+"';");
			}
			
			List allDataList = new ArrayList();
			allDataList.add(proAcmMonth);
			if(!initial.equals("2")){
				List<ProAcmInfo> listInfo = this.proAcmDAO.findByWhere(ProAcmInfo.class.getName(), "monId = '"+uids+"' ");
				List<ProAcmTree> listTree = this.proAcmDAO.findByWhere(ProAcmTree.class.getName(), "monId = '"+uids+"' ");
				if(listInfo.size()>0) allDataList.addAll(listInfo);
				allDataList.addAll(listTree);
			}
			PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
			List<PcDataExchange> exchangeList = new ArrayList<PcDataExchange>();
			
			if(initial.equals("2")){
				//2为执行删除主记录操作，删除语句delSql转为后置SQL
				exchangeList = excService.getExcDataList(allDataList, toPid, fromPid, null, delSql.toString(), "工程量投资完成数据交互");
			}else{
				exchangeList = excService.getExcDataList(allDataList, toPid, fromPid, delSql.toString(), null, "工程量投资完成数据交互");
			}
			excService.addExchangeListToQueue(exchangeList);
			return "1";
		}
	}
	/*
	public String getOtherReportXml(String monId,String conid,String pid,String bdgid){
		StringBuilder xmlStr = new StringBuilder();
		String bdgRoot = "01";
		xmlStr.append("<rows>");
		xmlStr.append("<head>");
		
		xmlStr.append("<column id='bdgname' width='390' type='tree' align='left' sort='str'>概算名称</column>");;
		xmlStr.append("<column id='uuid' width='120' type='ro' align ='left' sort='str' hidden='true'>主键</column>");
		//xmlStr.append("<column id='bdgid' width='0' type='ro' align ='left' sort='str' hidden='true'>概算主键</column>");
		//xmlStr.append("<column id='bdgno' width='0' type='ro' align ='left' sort='str' hidden='true'>概算编号</column>");
		//xmlStr.append("<column id='parent' width='0' type='ro' align ='left' sort='str' hidden='true'>父编号</column>");
		//xmlStr.append("<column id='isleaf' width='0' type='ro' align ='left' sort='str' hidden='true'>是否是子节点</column>");
		xmlStr.append("<column id='decmoney' width='90' type='edn[=sum]' align ='right' sort='int' format='0.00'>申报金额</column>");
		xmlStr.append("<column id='checkmoney' width='90' type='edn[=sum]' align ='right' sort='int' format='0.00'>核定金额</column>");
		xmlStr.append("<column id='ratiftmoney' width='90' type='edn[=sum]' align ='right' sort='int' format='0.00'>批准金额</column>");
		xmlStr.append("<column id='pro_money' width='90' type='ron' align ='right' sort='int' format='0.00'>本月总额</column>");
		xmlStr.append("<column id='sum_money' width='90' type='ron' align ='right' sort='int' format='0.00'>累计总额</column>");
		//构造表头
		xmlStr.append("</head>");
		//构造数据
		xmlStr.append(this.getOtherReportStringXml(monId,conid,pid,bdgRoot));
		xmlStr.append("</rows>");
		System.out.println("xml:"+xmlStr.toString());
		return xmlStr.toString();
	}
	
	
	public String getOtherReportStringXml(String monId,String conid,String pid,String bdgid){
		StringBuilder xmlStr = new StringBuilder();
		//String where = " monId = '"+monId+"' and conid = '"+conid+"' and pid = '"+pid+"' and bdgid = '"+bdgid+"' ";
		//List<ProAcmTree> patList = this.proAcmDAO.findByWhere(ProAcmTree.class.getName(), where);
		
		String hql = "from ProAcmTree t ,BdgInfo i where t.bdgid = i.bdgid " +
		" and t.bdgid='"+bdgid+"' and t.pid='"+pid+"' and t.conid='"+conid+"' " +
		" and t.monId='"+monId+"' order by t.bdgid";
		
		List<Object[]> patList = this.proAcmDAO.findByHql(hql);
		if(patList.size()==0)return "";

		//for (int i = 0; i < patList.size(); i++) {
			Object[] obj = patList.get(0);
			ProAcmTree tree = (ProAcmTree)obj[0];
			BdgInfo info = (BdgInfo)obj[1];
			tree.setBdgname(info.getBdgname());
			
			//构造根节点
			xmlStr.append("<row id='"+tree.getBdgid()+"' open='1' root='"+tree.getIsleaf()+"'>");
			xmlStr.append("<cell>"+tree.getBdgname()+"</cell>");
			xmlStr.append("<cell>"+tree.getUuid()+"</cell>");
			
			//查询出所有子节点
			String sql = "select bdgid from pro_acm_tree where " +
				" mon_id = '"+monId+"' and conid = '"+conid+"' and pid = '"+pid+"' " +
				" and parent = '"+tree.getBdgid()+"' order by bdgid ";
			List<Map<String, String>> childList = JdbcUtil.query(sql);

			for (Map<String, String> childMap : childList) {
				xmlStr.append(getOtherReportStringXml(monId, conid, pid, childMap.get("bdgid")));
			}

			boolean isLeaf = childList.isEmpty();
			Double dec = tree.getDecmoney() == null ? 0d : tree.getDecmoney();
			Double check = tree.getCheckmoney() == null ? 0d : tree.getCheckmoney();
			Double ratif = tree.getRatiftmoney() == null ? 0d : tree.getRatiftmoney();
			xmlStr.append("<cell type='edn'>"+dec+"</cell>");
			xmlStr.append("<cell>"+check+"</cell>");
			xmlStr.append("<cell>"+ratif+"</cell>");
			xmlStr.append("<cell>"+tree.getProMoney()+"</cell>");
			xmlStr.append("<cell>"+tree.getSumMoney()+"</cell>");
			xmlStr.append("</row>");
		//}
		return xmlStr.toString();
	}
	*/

	/**
	 * 工程量从bdg_project中选择相关项后新增到pro_acm_info
	 * @param proappid
	 * @param conid
	 * @param monId
	 * @param pid
	 * 
	 */
	@SuppressWarnings("unchecked")
	public void initialNewProAcmInfo(String proappid,String conid,String monId,String pid ) {
		// TODO Auto-generated method stub
		 List<VBdgProject> list = this.proAcmDAO.findByWhere(VBdgProject.class.getName(), "conid='"+conid+"' and pid='"+pid+"' and proappid='"+proappid+"'");
		 //若用户选择了工程量，却没有填写工程量，主表数据则变成了0 pengy 2013-12-27
		 ProAcmMonth pam = (ProAcmMonth) this.proAcmDAO.findById(ProAcmMonth.class.getName(), monId);
		 pam.setCheckmoney(pam.getCheckmoney() != null && !pam.getCheckmoney().equals("") ? pam.getCheckmoney() : 0);
		 pam.setDecmoney(pam.getDecmoney() != null && !pam.getDecmoney().equals("") ? pam.getDecmoney() : 0);
		 pam.setRatiftmoney(pam.getRatiftmoney() != null && !pam.getRatiftmoney().equals("") ? pam.getRatiftmoney() : 0);
		 this.proAcmDAO.saveOrUpdate(pam);
		 for (int i = 0; i < list.size(); i++) {
			 ProAcmInfo pai = new ProAcmInfo();
			 VBdgProject bp = (VBdgProject)list.get(i);
			 Double totalpro = this.getTotalpro(conid, monId, proappid);
			 Double totalAmount = this.getTotalProNameNumByConidAndProNo(proappid, conid, bp.getBdgid(), bp.getProno(), pid);
			 Double totalMoney =this.getTotalProMoneyByConidAndProNo(conid, bp, pid,totalAmount);
			 pai.setBdgid( bp.getBdgid());
			 pai.setConid(conid);//合同ID
			 pai.setMonId(monId);//月份主键
			 pai.setProid(bp.getProappid());//工程量分摊主键
			 pai.setProname(bp.getProname());
			 pai.setAmount(totalAmount);//总工程量
			 pai.setMoney(totalMoney);//总金额
			 
			 if(totalAmount != 0 && totalMoney != 0){
				 NumberFormat nbf = NumberFormat.getInstance();
				 nbf.setMaximumFractionDigits(3);
				 //String res=nbf.format(totalMoney/totalAmount);
				 //pai.setPrice(Double.valueOf(res));
				 pai.setPrice(Math.abs(totalMoney/totalAmount));
			 }
			 pai.setTotalpro(totalpro);//累计已完成工程量
			 pai.setUnit(bp.getUnit());
			 if(totalpro>0&&totalAmount>0){
				 pai.setTotalpercent((totalpro / totalAmount)*100);
			 }else {
				 pai.setTotalpercent(0d*100);
			 }
			 pai.setDeclpro(0.0);
			 pai.setDecmoney(0.0);
			 pai.setCheckpro(0.0);
			 pai.setCheckmoney(0.0);
			 pai.setRatiftpro(0.0);
			 pai.setRatiftmoney(0.0);
			 pai.setPid(pid);
			 pai.setIsper(bp.getIsper());
			 this.proAcmDAO.insert(pai);
		}
	}

	/**
	 * 优化报表打开时间，直接将报表数据存储到表
	 * @param masterId 投资完成主表主键
	 * @parem pid 项目id
	 * @author pengy
	 * @createtime 2014-02-27
	 */
	@SuppressWarnings("unchecked")
	public void saveProAcmTreeToTable(String masterId, String pid){
		String needInit = "SELECT COUNT(*) FROM PRO_ACM_INFO_TREE_REPORT T WHERE T.PID='" + pid + "'";
		List<BigDecimal> needInitList = this.proAcmDAO.getDataAutoCloseSes(needInit);
		String initSql1 = "select b.bdgid,b.bdgname,b.prono,p.conid,p.mon_id,m.month,p.parent,p.pid" +
				" from pro_acm_tree p, bdg_info b, pro_acm_month m where b.bdgid = p.bdgid" +
				" and p.mon_id = m.uids and b.pid='" + pid + "' and p.pid='"+ pid + "'";
		if (needInitList != null && needInitList.size()==1 && needInitList.get(0).doubleValue()==0){
			List<Object[]> initList1 = this.proAcmDAO.getDataAutoCloseSes(initSql1);
			List<ProAcmInfoTreeView> initList2 = this.proAcmDAO.findByWhere(ProAcmInfoTreeView.class.getName(), "pid='" + pid + "'");
			saveBdgAndInfoTree(initList1, initList2);
		} else if (needInitList != null && needInitList.size()==1 && needInitList.get(0).doubleValue()>0){
			List<ProAcmInfoTreeReport> old = this.proAcmDAO.findByWhere(
					ProAcmInfoTreeReport.class.getName(), "pid='" + pid + "' and mon_id='" + masterId + "'");
			this.proAcmDAO.deleteAll(old);
			String insertSql1= initSql1 + " and m.uids='" + masterId + "'";
			List<Object[]> insertList1 = this.proAcmDAO.getDataAutoCloseSes(insertSql1);
			List<ProAcmInfoTreeView> insertList2 = this.proAcmDAO.findByWhere(
					ProAcmInfoTreeView.class.getName(), "pid='" + pid + "' and mon_id='" + masterId + "'");
			saveBdgAndInfoTree(insertList1, insertList2);
		}
	}

	/**
	 * 存入报表数据
	 * @param initList1 概算部分信息
	 * @param initList2 工程量部分信息
	 * 概算项的累计投资完成值，需要计算该概算项下所有工程量的累计值，而不是某一个月份报表中的工程量累计值
	 * 同一份合同的不同月份报表，工程量可能存在很大的差异
	 * @author pengy
	 * @createtime 2014-02-28
	 */
	private void saveBdgAndInfoTree(List<Object[]> initList1,List<ProAcmInfoTreeView> initList2){
		if (initList1 != null && initList1.size()>0){
			for (int i=0; i<initList1.size(); i++){
				ProAcmInfoTreeReport report = new ProAcmInfoTreeReport();
				report.setBdgid(initList1.get(i)[0].toString());
				report.setBdgname(initList1.get(i)[1].toString());
				report.setProno(initList1.get(i)[2] == null ? "" : initList1.get(i)[2].toString());
				report.setConid(initList1.get(i)[3].toString());
				report.setMonId(initList1.get(i)[4].toString());
				report.setMonth(initList1.get(i)[5].toString());
				report.setParent(initList1.get(i)[6].toString());
				report.setPid(initList1.get(i)[7].toString());
				String sql = "select nvl(sum(bb.money),0) as money from BDG_PROJECT bb where bb.CONID = '"+report.getConid()+"' and bb.BDGID like '"+report.getBdgid()+"'||'%'";
				List<Map<String,BigDecimal>> list1 = JdbcUtil.query(sql);
				Double money=0d;
				if(list1!=null&&list1.size()==1){
					Map<String,BigDecimal> map=(Map) list1.get(0);
					money=map.get("money").doubleValue();
				}
				String sql1="select nvl(sum(p1.ratiftmoney),0) as totalRatiMonthMoney from pro_acm_info p1 where p1.conid = '"+report.getConid()+"' "
                   +"and p1.bdgid like '"+report.getBdgid()+"'||'%' and p1.mon_id in (select t.uids from pro_acm_month t where " +
                   	" t.conid = '"+report.getConid()+"' and t.month <= "+report.getMonth()+")";
				List<Map<String,BigDecimal>> list2 = JdbcUtil.query(sql1);
				Double totalRatiMonthMoney=0d;//截止本月累计总额
				if(list2!=null&&list2.size()==1){
					Map<String,BigDecimal> map=(Map) list2.get(0);
					totalRatiMonthMoney=map.get("totalRatiMonthMoney").doubleValue();
				}
				Double percent = new Double(0);//累计完成占合同总价
				if(money!=null&&money!=0){
					percent=div(totalRatiMonthMoney,money,4)*100;
				}
				report.setTotalratimonthmoney(totalRatiMonthMoney);
				report.setMoney(money);
				report.setPercent1(percent + "%");
				report.setPercent2(percent);
				report.setIsleaf(0L);
				String sql2="select nvl(sum(p1.ratiftmoney),0) as totalRatiMonthMoneyLast from pro_acm_info p1 where p1.conid = '"+report.getConid()+"' "
                +"and p1.bdgid like '"+report.getBdgid()+"'||'%' and p1.mon_id in (select t.uids from pro_acm_month t where " +
                	" t.conid = '"+report.getConid()+"' and t.month < "+report.getMonth()+")";
				List<Map<String,BigDecimal>> list3 = JdbcUtil.query(sql2);
				Double totalRatiMonthMoneyLast=0d;//截止上月累计总额
				if(list3!=null&&list3.size()==1){
					Map<String,BigDecimal> map=(Map) list3.get(0);
					totalRatiMonthMoneyLast=map.get("totalRatiMonthMoneyLast").doubleValue();
				}
				report.setTotalratimonthmoneylast(totalRatiMonthMoneyLast);
				String sql3="select nvl(sum(p1.ratiftmoney),0) as totalRatiMonthMoneyLastAll from pro_acm_info p1 where p1.conid = '"+report.getConid()+"' "
                +"and p1.bdgid like '"+report.getBdgid()+"'||'%' and p1.mon_id in (select t.uids from pro_acm_month t where " +
                	" t.conid = '"+report.getConid()+"' and substr(t.month, 0, length(t.month) - 2) <= " +
                			"  substr(to_char(add_months(to_date('"+report.getMonth()+"','yyyyMM'), -12), 'yyyyMM'),0,4))";
				List<Map<String,BigDecimal>> list4 = JdbcUtil.query(sql3);
				Double totalRatiMonthMoneyLastAll=0d;//自开工至上年累计投资完成额
				if(list4!=null&&list4.size()==1){
					Map<String,BigDecimal> map=(Map) list4.get(0);
					totalRatiMonthMoneyLastAll=map.get("totalRatiMonthMoneyLastAll").doubleValue();
				}
				report.setTotalratimonthmoneylastall(totalRatiMonthMoneyLastAll);
				this.proAcmDAO.insert(report);
			}
		}
		List<String> parentIdList = new ArrayList<String>();
		if (initList2 != null && initList2.size()>0){
			for (int j=0; j<initList2.size(); j++){
				ProAcmInfoTreeReport report = new ProAcmInfoTreeReport();
				report.setAcmid(initList2.get(j).getAcmId());
				report.setAmount(initList2.get(j).getAmount());
				report.setBdgid(initList2.get(j).getBdgid() + "-" + (j+1));
				report.setBdgname(initList2.get(j).getProname());
				report.setConid(initList2.get(j).getConid());
				report.setCheckpro(initList2.get(j).getCheckpro());
				report.setCheckmoney(initList2.get(j).getCheckmoney());
				report.setDeclpro(initList2.get(j).getDeclpro());
				report.setDecmoney(initList2.get(j).getDecmoney());
				report.setMoney(initList2.get(j).getMoney());
				report.setMonId(initList2.get(j).getMonId());
				report.setMonth(initList2.get(j).getMonth());
				report.setPercent1(initList2.get(j).getPercent1() + "%");
				report.setPercent2(initList2.get(j).getPercent1());
				report.setPrice(initList2.get(j).getPrice());
				report.setPid(initList2.get(j).getPid());
				report.setProid(initList2.get(j).getProid());
				report.setProno(initList2.get(j).getProno());
				report.setProname(initList2.get(j).getProname());
				report.setRatiftpro(initList2.get(j).getRatiftpro());
				report.setRatiftmoney(initList2.get(j).getRatiftmoney());
				report.setTotalratimonth(initList2.get(j).getTotalratimonth());
				report.setTotalratimonthlast(initList2.get(j).getTotalratimonthlast());
				report.setTotalratimonthmoney(initList2.get(j).getTotalratimonthmoney());
				report.setTotalratimonthmoneylast(initList2.get(j).getTotalratimonthmoneylast());
				report.setTotalratimonthmoneylastall(initList2.get(j).getTotalratimonthmoneylastall());
				report.setUnit(initList2.get(j).getUnit());
				report.setIsleaf(1L);
				report.setParent(initList2.get(j).getBdgid());
				this.proAcmDAO.insert(report);
				String parentId = report.getParent()+"`"+report.getMonId();
				if (!parentIdList.contains(parentId)) {
					parentIdList.add(parentId);
				}
			}
		}
		for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
			String parentStr=iterator.next();
			this.calParentProAcmTreeInfo(parentStr.split("[`]")[1],parentStr.split("[`]")[0]);
		}
	}
	/**工程量投资完成： 递归计算父bdgId父节点的工程量投资完成相关数据；
	* @Title: calParentProAcmTreeInfo
	* @Description: 
	* @param monId
	* @param bdgId   
	* @return void    
	* @throws
	* @author qiupy 2014-4-17
	 */
	private void calParentProAcmTreeInfo(String monId, String bdgId){
//		Double money = new Double(0);//合价
//		Double totalRatiMonthMoneyLastAll = new Double(0);//自开工至上年累计投资完成额
//		Double totalRatiMonthMoneyLast = new Double(0);//到上月底累计总额
		Double decmoney = new Double(0);//申报金额
		Double checkmoney = new Double(0);//核定金额
		Double ratiftmoney = new Double(0);//批准金额
//		Double totalRatiMonthMoney = new Double(0);//截止本月累计总额
//		Double percent = new Double(0);//累计完成占合同总价
		String beanName=ProAcmInfoTreeReport.class.getName();
		List<ProAcmInfoTreeReport> parentReportList = this.proAcmDAO.findByWhere(beanName, "bdgId='"+bdgId+"' and monId='"+monId+"'");
		if(parentReportList != null&&parentReportList.size()>0){
			ProAcmInfoTreeReport parentReport=parentReportList.get(0);
			List list = (List)this.proAcmDAO.findByWhere(beanName, "parent='"+bdgId+"' and monId='"+monId+"'");
//			String sql = "select nvl(sum(bb.money),0) as money from BDG_PROJECT bb where bb.CONID = '"+parentReport.getConid()+"' and bb.BDGID like '"+parentReport.getBdgid()+"'||'%'";
//			List<Map<String,BigDecimal>> list1 = JdbcUtil.query(sql);
//			if(list1!=null&&list1.size()==1){
//				Map<String,BigDecimal> map=(Map) list1.get(0);
//				money=map.get("money").doubleValue();
//			}
			for (Iterator iterator = list.iterator(); iterator.hasNext();) {
				ProAcmInfoTreeReport proReport = (ProAcmInfoTreeReport) iterator.next();
//				money=proReport.getMoney()==null?money:add(money,proReport.getMoney());
//				totalRatiMonthMoneyLastAll=proReport.getTotalratimonthmoneylastall()==null?totalRatiMonthMoneyLastAll:add(totalRatiMonthMoneyLastAll,proReport.getTotalratimonthmoneylastall());
//				totalRatiMonthMoneyLast=proReport.getTotalratimonthmoneylast()==null?totalRatiMonthMoneyLast:add(totalRatiMonthMoneyLast,proReport.getTotalratimonthmoneylast());
				decmoney=proReport.getDecmoney()==null?decmoney:add(decmoney,proReport.getDecmoney());
				checkmoney=proReport.getCheckmoney()==null?checkmoney:add(checkmoney,proReport.getCheckmoney());
				ratiftmoney=proReport.getRatiftmoney()==null?ratiftmoney:add(ratiftmoney,proReport.getRatiftmoney());
//				totalRatiMonthMoney=proReport.getTotalratimonthmoney()==null?totalRatiMonthMoney:add(totalRatiMonthMoney,proReport.getTotalratimonthmoney());
			}
//			if(money!=null&&money!=0){
//				percent=div(totalRatiMonthMoney,money,4)*100;
//			}
//			parentReport.setMoney(money);
//			parentReport.setPercent1(percent + "%");
//			parentReport.setPercent2(percent);
			parentReport.setCheckmoney(checkmoney);
			parentReport.setDecmoney(decmoney);
			parentReport.setRatiftmoney(ratiftmoney);
//			parentReport.setTotalratimonthmoney(totalRatiMonthMoney);
//			parentReport.setTotalratimonthmoneylast(totalRatiMonthMoneyLast);
//			parentReport.setTotalratimonthmoneylastall(totalRatiMonthMoneyLastAll);
			if (!"0".equals(parentReport.getParent())) {
				calParentProAcmTreeInfo(monId,parentReport.getParent());
			}
		}
	}
	/**
     * DOUBLE精确的加法运算。
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */
	public double add(double v1,double v2){
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.add(b2).doubleValue();
	}
	 /** 
     * double 除法 
     * @param d1 
     * @param d2 
     * @param scale 四舍五入 小数点位数 
     * @return 
     */ 
    public double div(double d1,double d2,int scale){ 
        //  当然在此之前，你要判断分母是否为0，   
        //  为0你可以根据实际需求做相应的处理 

        BigDecimal bd1 = new BigDecimal(Double.toString(d1)); 
        BigDecimal bd2 = new BigDecimal(Double.toString(d2)); 
        return bd1.divide 
               (bd2,scale,BigDecimal.ROUND_HALF_UP).doubleValue(); 
    } 


}