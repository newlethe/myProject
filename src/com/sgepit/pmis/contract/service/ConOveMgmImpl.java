package com.sgepit.pmis.contract.service;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import oracle.sql.BLOB;

import org.directwebremoting.WebContextFactory;
import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.PropertyType;
import com.sgepit.frame.sysman.hbm.RockCharacter2power;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;
import com.sgepit.pcmis.contract.service.PCContractServiceImpl;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.contract.hbm.ConOveView;
public class ConOveMgmImpl extends BaseMgmImpl implements ConOveMgmFacade {

	private ContractDAO contractDAO;
	public static ConOveMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConOveMgmImpl) ctx.getBean("conoveMgm");
	}
	public static PCContractServiceImpl getPCContractApplicationContext(
			ApplicationContext ctx) {
		return (PCContractServiceImpl) ctx.getBean("pcConMgm");
	}
	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}
     
	/**
     * 新增
     */
	@SuppressWarnings("all")
	public String insertConove(ConOve conove) throws SQLException,
			BusinessException {
		String state = "";
		String str = checkValidConove(conove);
		if (!str.equals("")) {
			state = str;
		}
		if (!checkUniqueConove(conove)) {
			throw new BusinessException(
					BusinessConstants.MSG_CON_IS_NOT_UNIQUEE);
		}
		if( conove.getSigndate()!= null){
			String data = conove.getSigndate().toString();
			if (data.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setSigndate(null);
			}
		}
		if( conove.getBiddate()!= null){
			String data2 = conove.getBiddate().toString();
			if (data2.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setBiddate(null);
			}
		}
		if( conove.getBidenddate()!= null){
			String data3 = conove.getBidenddate().toString();
			if (data3.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setBidenddate(null);
			}
		}
		if( conove.getStartdate()!= null){
			String data4 = conove.getStartdate().toString();
			if (data4.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setStartdate(null);
			}
		}
		if( conove.getPerformancedate()!= null){
			String data5= conove.getPerformancedate().toString();
			if (data5.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setPerformancedate(null);
			}
		}
		this.contractDAO.insert(conove);
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConOveView.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConOveView.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		pdd.setPctableuids(conove.getConid());
		pdd.setPcurl(DynamicDataUtil.CON_OVE_URL);
		pdd.setPid(conove.getPid());
		this.contractDAO.insert(pdd);
		//数据交换
		List conList = new ArrayList();
		conList.add(conove);
		conList.add(pdd);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,conove.getPid(),"","","新合同增");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
		return state;
	}

	@SuppressWarnings("unchecked")
	public String updateConove(ConOve conove) throws SQLException,
			BusinessException {
		String state = "";
		if( conove.getSigndate()!= null){
			String data = conove.getSigndate().toString();
			if (data.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setSigndate(null);
			}
		}
		if( conove.getBiddate()!= null){
			String data2 = conove.getBiddate().toString();
			if (data2.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setBiddate(null);
			}
		}
		if( conove.getBidenddate()!= null){
			String data3 = conove.getBidenddate().toString();
			if (data3.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setBidenddate(null);
			}
		}
		if( conove.getStartdate()!= null){
			String data4 = conove.getStartdate().toString();
			if (data4.equals("Thu Jan 01 08:00:00 CST 1970")){
				conove.setStartdate(null);
			}
		}
		PcDynamicData  pdd= new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(ConOveView.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(ConOveView.class.getName()));
		pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
		pdd.setPctableuids(conove.getConid());
		pdd.setPcurl(DynamicDataUtil.CON_OVE_URL);
		pdd.setPid(conove.getPid());
		this.contractDAO.saveOrUpdate(conove);
		this.contractDAO.insert(pdd);
		List conList = new ArrayList();
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			conList.add(conove);
			conList.add(pdd);
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,conove.getPid(),"","","修改合同");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
		return state;
	}


	private boolean checkUniqueConove(ConOve conove) {
		String where = " pid = '" + conove.getPid() + "' and Conid='"
				+ conove.getConid() + "'";
		List list = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_OVE), where);

		if (list.size() > 0) {
			return false;
		}
		return true;
	}

	private String checkValidConove(ConOve conove) {
		StringBuffer msg = new StringBuffer("");

		String where = " pid = '" + conove.getPid() + "' and conno = '"
				+ conove.getConno() + "' and conid <> '" + conove.getConid()
				+ "'";
		List list = this.contractDAO.findByWhere(BusinessConstants.CON_PACKAGE
				.concat(BusinessConstants.CON_OVE), where);
		if (list.size() > 0) {
			msg.append(new BusinessException(
					BusinessConstants.MSG_CON_IS_NOT_UNIQUEE));
			msg.append("<br>");
		}

		return msg.toString();
	}
	
	/**
	 * 删除合同
	 * @param conid
	 * @return
	 */
	public String deleteConove(String conid,String modId) {
		String flag = "0";
		try {
			ConOve conove = (ConOve)this.contractDAO.findById(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), conid);
			
			List conBal_list = this.contractDAO.findByProperty(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_BAL), "conid", conid);
			if(conBal_list != null && conBal_list.size()>0){
				return flag = "已存在结算记录，不能删除！";
			}
			
			List conPay_list = this.contractDAO.findByProperty(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_PAY), "conid", conid);
			if(conPay_list != null && conPay_list.size()>0){
				return flag = "已存在付款记录，不能删除！";
			}
			
			
			List conBre_list = this.contractDAO.findByProperty(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_BRE), "conid", conid);
			if(conBre_list != null && conBre_list.size()>0){
				return flag = "已存在违约记录，不能删除！";
			}			
			
			List conCha_list = this.contractDAO.findByProperty(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_CHA), "conid", conid);
			if(conCha_list != null && conCha_list.size()>0){
				return flag = "已存在变更记录，不能删除！";
			}
			
			List conCla_list = this.contractDAO.findByProperty(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_CLA), "conid", conid);
			if(conCla_list != null && conCla_list.size()>0){
				return flag = "已存在索赔记录，不能删除！";
			}
			
			List bdgMoneyApp_list = this.contractDAO.findByProperty(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), "conid", conid);
			if(bdgMoneyApp_list != null && bdgMoneyApp_list.size()>0){
				return flag = "已存在合同概算金额分摊记录，不能删除！";
			}
			
			List bdgChangApp_list = this.contractDAO.findByProperty(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CHANG_APP), "conid", conid);
			if(bdgChangApp_list != null && bdgChangApp_list.size()>0){
				return flag = "已存在合同变更分摊记录，不能删除！";
			}
			
			List conMat_list = this.contractDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.ConMat", "hth", conid);
			if(conMat_list != null && conMat_list.size()>0){
				return flag = "已存在合同材料清单，不能删除！";
			}
			List conZlInfo_list = this.contractDAO.findByProperty("com.sgepit.frame.flow.hbm.ZlInfo", "modtabid", conid);
			if(conZlInfo_list != null && conZlInfo_list.size()>0){
				return flag = "已存在合同文本或者附件，不能删除！";
			}
			
			HttpSession  session =WebContextFactory.get().getSession();
			String pid=(String)session.getAttribute(Constant.CURRENTAPPPID);
			 SystemMgmFacade systemMgmFacade  =(SystemMgmFacade)Constant.wact.getBean("systemMgm");
			 String rtn=systemMgmFacade.getFlowType(pid, modId);
			 if("BusinessProcess".equals(rtn)&&conove.getBillstate()!=0){
				 return "流程审批中的合同或已审批的合同,不能删除";
			 }
			this.contractDAO.delete(conove);
			List <ConOve>conList = new ArrayList<ConOve>();
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				conList.add(conove);
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(conList, Constant.DefaultOrgRootID,conove.getPid(),"","","删除合同");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}
		} catch (RuntimeException e) {
			flag = "1"; 
			e.printStackTrace(); 
			return flag;
		}
		return flag;
	}
	
	/**
	 * @description 合同移交
	 * @param conid
	 * @param username
	 * @return
	 */
	public String removeConove(String conid, String username){
		String state = "";
		if ("".equals(conid) || null == conid){
			state = "移交合同不能为空！";
		}else if ("".equals(username) || null == username){
			state = "移交的管理用户不能为空！";
		}else{
			String beanName = BusinessConstants.CON_PACKAGE + BusinessConstants.CON_OVE;
			try {
				ConOve conove = (ConOve)this.contractDAO.findById(beanName, conid);
				conove.setConadmin(username);
				this.contractDAO.saveOrUpdate(conove);
			} catch (RuntimeException e) {
				e.printStackTrace();
				state = "移交合同失败！";
				return state;
			}
		}
		return state;
	}
	
	/**
	 * 获得合同管理员名称
	 * @param userName
	 * @return
	 */
	public String getRealName(String userName){
		String name = "";
		List list = this.contractDAO.findByProperty("com.sgepit.frame.sysman.hbm.RockUser", "useraccount", userName);
		if (list.size() > 0){
			RockUser user = (RockUser)list.get(0);
			name = user.getRealname();
		}
		return name;
	}
	
	public boolean isApportion(String conid){
		boolean flag = false;
		List list = this.contractDAO.findByProperty(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP), 
				"conid", conid);
		if (list.size() > 0) 
			flag = true;
		return flag;
	}
	
	public boolean isEquInfo(String conid){
		boolean flag = false;
		List list = this.contractDAO.findByProperty(BusinessConstants.EQU_PACKAGE.concat(BusinessConstants.EQU_INFO), 
				"conid", conid);
		if (list.size() > 0) 
			flag = true;
		return flag;
	}
	
	public boolean checkConno(String conno){
		List list = this.contractDAO.findByProperty(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), "conno", conno);
		if (list.size()>0) return false;
		return true;
	}
	

	/*
	 * 获取签订金额和概算金额不相等的合同
	 */
	public List getUnequalcon(String pid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = " select t.conid, t.conno, t.conname, p.partyb ,t.conmoney, m.realmoney  " + 
					 " from con_ove t,bdg_money_app m,con_partyb p " +
					 " where t.conid=m.conid and t.pid='" + pid + "' and t.partybno=p.cpid and  m.parent='0' and t.conmoney <>  m.realmoney ";
		List list = jdbc.queryForList(sql);
		
		return list;
 	}
	
	/*
	 * 获取概算金额和工程量分摊总金额不相等的合同和概算项
	 */
	public List getUnequalbdg(String pid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select distinct t.conid, c.conname,t.bdgid,d.bdgname, t.realmoney " + 
					 " from bdg_money_app t, bdg_project b, bdg_info d,con_ove c   " + 
					 " where t.conid = b.conid and t.conid=c.conid and t.bdgid = b.bdgid and t.bdgid=d.bdgid and t.realmoney <>( " +
					 "  select round(sum(p.money)) " + 
					 " from  bdg_project p  " + 
					 " where b.bdgid = p.bdgid and t.pid = '" + pid + "' and b.conid=p.conid " + 
					 " group by p.bdgid "  + 
					 "	)  order by d.bdgname";
		List list = jdbc.queryForList(sql);
		
		return list;
 	}
	
	public List<PropertyCode> getContractSortByDept(String deptId){
		List<PropertyCode> list = new ArrayList<PropertyCode>();
		PropertyType cat = (PropertyType) this.contractDAO.findBeanByProperty("com.sgepit.frame.sysman.hbm.PropertyType","typeName", "合同划分类型");
		if(cat != null){
			list = this.contractDAO.findByWhere("com.sgepit.frame.sysman.hbm.PropertyCode", "(instr(detail_type,'"+deptId+"',1,1)>0 or detail_type is null or detail_type = '' ) and type_name = '"+cat.getUids()+"'");	
		}
		return list;
	}
	
	//zhangh 2010-10-19 查询出物资管理中的采购合同分类二
	//felei1: = 分类1ID ，filterFlag:分类二中对应的CG
	public List<PropertyCode> getCgContractSort(String felei1,String filterFlag){
		String sql = "select uids from property_type " +
				"where type_name in(select property_name from property_code " +
				"where property_code = '"+felei1+"' and type_name in (select uids from property_type " +
						"where type_name = '合同划分类型'))";
		List<PropertyType> list_type = new ArrayList<PropertyType>();
		String typeName="";
		List<Map> plist = JdbcUtil.query(sql);
		if(plist.size()==1){
			Map map = plist.get(0);
			typeName = map.get("uids").toString();	
		}
		String where = "TYPE_NAME='"+typeName+"'";
		if(filterFlag!=null && !filterFlag.equals("")){
			where = where + " and (detail_type like '%"+filterFlag+"%' or module_name like '%"+filterFlag+"%')";
		}
		List<PropertyCode> list = this.contractDAO.findByWhere("com.sgepit.frame.sysman.hbm.PropertyCode", where);
		return list;
	}
	
	/**
	 * 获取采购合同信息
	 * 2011-09-02 多项目中修改，此处采购合同隶属于材料合同，属性代码中“合同划分类型”的“详细设置”包含CL的合同分类下所有合同
	 * @param felei1       合同分类1编号
	 * @param filterFlag   分类二对应的过滤条件
	 * @param where        其他过滤条件
	 * @return
	 */
	public List<ConOve> getCgHt(String felei1,String filterFlag,String where){
		List<ConOve> list = new ArrayList<ConOve>();
		
		String contFilterId = "";				//合同一级分类属性代码，格式如('SB','GC','CL')
		//根据属性代码中对应“合同划分类型”中查询出材料合同，“详细设置”列包含CL
		String clSql = "select c.property_code,c.property_name from property_code c " +
				"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
				"and c.detail_type like '%CL%'";
		List<Map<String, String>> listCode = JdbcUtil.query(clSql);
		for(int i = 0; i < listCode.size(); i++) {
			contFilterId+="'"+listCode.get(i).get("property_code")+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length()-1);
		where += " and CONDIVNO in ("+contFilterId+") ";
		list = this.contractDAO.findWhereOrderBy(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_OVE), where, "conno");
		return list;
		
	}

	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author: zhangh
	 * @createDate: 2011-4-7
	 */
	public InputStream getExcelTemplate(String businessType){
		InputStream ins = null;
		String templateSql = "select fileid from app_template t where templatecode='" + businessType + "' order by lastmodify desc";
		List<Map<String, String>> l = JdbcUtil.query(templateSql);
		String templateFileId = "";
		if (l.size()>0) {
			templateFileId = l.get(0).get("fileid");
		}
		
		if (templateFileId!=null && templateFileId.length()>0) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = null;
				rs = stmt.executeQuery("SELECT BLOB FROM APP_BLOB WHERE FILEID ='"+templateFileId+"'");
				if(rs.next()) {
					BLOB blob = (BLOB) rs.getBlob(1);
					ins = blob.getBinaryStream();
				}
				rs.close() ;
				stmt.close() ;
				conn.close() ;
				initCtx.close() ;
				
			} catch (Exception ex) {
				ex.printStackTrace();
				return null ;
			}
		}
		return ins;
	}
	
	/**
	 * 生成合同自动编码规则；
	 * @param temp
	 * @return
	 * @author: shangtw
	 * @createDate: 2011-9-15
	 */
	public String generateConno(String temp) throws SQLException, BusinessException{
		String regEx=temp.replace("-", "\\-");
		regEx=regEx+"\\-[0-9]{3}";//生成正则表达式
		String sql="select conno_number from ("+
		"select SUBSTR(conno,-3,3) conno_number from CON_OVE"+
		" where REGEXP_LIKE(conno,'"+regEx+"') order by conno_number desc"+
		") where rownum=1";
		List<Map> list=JdbcUtil.query(sql);
		String stringNumber="001";
		if(!list.isEmpty()){ 
			String conno_number=list.get(0).get("conno_number").toString();
			int intNumber= Integer.parseInt(conno_number);
			intNumber+=1;
			stringNumber=String.valueOf(intNumber);
			if(stringNumber.length()<2 && stringNumber.length()>0) stringNumber="00"+stringNumber;
			if(stringNumber.length()<3 && stringNumber.length()>1) stringNumber="0"+stringNumber;
		}
		return stringNumber;

	}
	
	
	
	@SuppressWarnings("unchecked")
	public Map<String, String> getConRockPowerRole(String userAccount){
		Map<String, String> map = new HashMap<String, String>();
		List<Object[]> list = this.contractDAO.findByHql(" from " +
				" RockPower m, RockCharacter2power v, RockRole2user u, RockRole r, RockUser ru  where " +
				" m.powerpk = v.powerpk and " +
				" v.rolepk = u.rolepk and " +
				" r.rolepk = u.rolepk and " +
				" u.userid = ru.userid and " +
				" ru.useraccount = '"+userAccount+"' and " +
				" m.powername in ('合同付款','合同变更','合同索赔','合同违约','合同结算','合同附件','合同分摊') ");
		for(int i=0; i<list.size(); i++){
			Object[] obj = list.get(i); 
			for(int j=0; j<obj.length; j++){
				RockPower rockPower = (RockPower)obj[0];
				RockCharacter2power rolemod = (RockCharacter2power)obj[1];
				map.put(rockPower.getPowername(), 
						(rolemod.getLvl() == 1||rolemod.getLvl() == 3) ? "false" : "true");
			}
		}
		return map;
	}
	/**
	 * 查询本月新签订合同与累计签订合同；
	 * @param sj
	 * @param type
	 * @param pid
	 * @param params
	 * @param start
	 * @param limit
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-3-6
	 */		
	public List findPcBusinessCon(String sj,String type,String pid, String params,
			Integer start, Integer limit) {
		Session s = null;
		List l = null;	
		int size = 0;
		String sql="";
		if("con".equals(type)){
			sql="select * from  v_con c where  c.BILLSTATE>=1 and "+params+"";
			if(sj!=""){
				sql="select * from   v_con c where to_char(c.signdate,'yyyyMM')='"+sj+"'  and c.billstate>=1 and "+params+"";
			}			
		}
		else if("conPay".equals(type)){
			sql="select * from  v_con c where  c.BILLSTATE>=1 and "+params+" and c.conid in (select cp.conid from con_pay cp where cp.pid='"+pid+"')";
			if(sj!=""){
				sql="select * from   v_con c where  c.billstate>=1 and "+params+" and c.conid in (select cp.conid from con_pay cp where to_char(cp.paydate,'yyyyMM')='"+sj+"' and cp.pid='"+pid+"')";
			}			
		}		
		try {
			s = HibernateSessionFactory.getSession();
			SQLQuery q = s.createSQLQuery(sql)
			.addScalar("conid", Hibernate.STRING)
			.addScalar("pid", Hibernate.STRING)
			.addScalar("conno", Hibernate.STRING)
			.addScalar("conname", Hibernate.STRING)
			.addScalar("partybno", Hibernate.STRING)
			.addScalar("conmoney", Hibernate.DOUBLE)
			.addScalar("contractors", Hibernate.STRING)
			.addScalar("contractordept", Hibernate.STRING)
			.addScalar("conpay", Hibernate.DOUBLE)
			.addScalar("coninvoicemoney", Hibernate.DOUBLE)
			.addScalar("convaluemoney", Hibernate.DOUBLE)
			.addScalar("signdate", Hibernate.DATE)
			.addScalar("performancedate", Hibernate.DATE)
			.addScalar("billstate", Hibernate.LONG)
			.addScalar("bidtype", Hibernate.STRING);
			size = q.list().size();
			q.setFirstResult(start);
			q.setMaxResults(limit);
			l = q.list();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			s.close();
			}	
		List returnList = new ArrayList();
		if(size>0){
			for (int i = 0; i <l.size(); i++) {
				ConOveView cov=new ConOveView();
				Object[] objs = (Object[]) l.get(i);
				cov.setConid((String)objs[0]);
				cov.setPid((String)objs[1]);
				cov.setConno((String)objs[2]);
				cov.setConname((String)objs[3]);
				cov.setPartybno((String)objs[4]);
				cov.setConmoney((Double)objs[5]);
				cov.setContractors((String)objs[6]);
				cov.setContractordept((String)objs[7]);
				cov.setConpay((Double)objs[8]);
				cov.setConinvoicemoney((Double)objs[9]);
				cov.setConvaluemoney((Double)objs[10]);
				cov.setSigndate((Date)objs[11]);
				cov.setPerformancedate((Date)objs[12]);
				cov.setBillstate((Long)objs[13]);
				cov.setBidtype((String)objs[14]);
				returnList.add(cov);
				}
			
		}
		returnList.add(size);
		return returnList;
	}
	
	
	/**
	 * 合同附件信息同步，向集团同步遗漏数据
	 * @param pid
	 * @return
	 * @author zhangh 2013-03-27
	 */
	public String conOveFileDataExchange(String pid) {
		List dataList = new ArrayList();
		String hql1 = "from com.sgepit.frame.flow.hbm.ZlInfo z , " +
				" com.sgepit.pmis.contract.hbm.ConOve c " +
				" where z.fileno = c.conno and z.filelsh IS NOT NULL";
		List<Object[]> zlList = this.contractDAO.findByHql(hql1);
		for (int i = 0; i < zlList.size(); i++) {
			Object[] obj = zlList.get(i);
			dataList.add(obj[0]);
		}
		
		String hql2 = "from com.sgepit.frame.sysman.hbm.AppFileinfo t, " +
				" com.sgepit.frame.flow.hbm.ZlInfo z, " +
				" com.sgepit.pmis.contract.hbm.ConOve c " +
				" where t.fileid = z.filelsh and c.conno = z.fileno ";
		List<Object[]> appList = this.contractDAO.findByHql(hql2);
		for (int i = 0; i < appList.size(); i++) {
			Object[] obj = appList.get(i);
			dataList.add(obj[0]);
		}

		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
					.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList,
					Constant.DefaultOrgRootID, pid, "", "", "合同附件数据同步");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
		return "0";
	}
	
	
	@SuppressWarnings("rawtypes")
	public String doHistoryDataExchange(String type,String pid){
		String rtn = "0";
		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			try {
				String sql = "SELECT c.* FROM property_code c WHERE c.module_name = '"+type+"'" +
					" AND c.type_name = (SELECT t.uids FROM property_type t WHERE t.type_name='数据交互表')";
				List<Map<String, String>> proList = JdbcUtil.query(sql);
				if(proList.size() == 0)return "2";//模块名称输入错误
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
						.getBean("PCDataExchangeService");
				List dataList = new ArrayList();
				for(int i = 0; i < proList.size(); i++) {
					String beanName = proList.get(i).get("property_name");
					List li = this.contractDAO.findByWhere(beanName, "1=1");
					if(li.size() > 0)dataList.addAll(li);
				}
				List ExchangeList = dataExchangeService.getExcDataList(dataList,
						Constant.DefaultOrgRootID, pid, "", "", type);
				if(ExchangeList.size() > 0){
					dataExchangeService.addExchangeListToQueue(ExchangeList);
				}else{
					rtn = "3";//没有需要交互的数据
				}
			} catch (Exception e) {
				e.printStackTrace();
				return "4";
			}
		}else{
			rtn = "1";//不是项目单位，不需要交互数据到集团
		}
		return rtn;
	}
	/**
	 * 合同基本信息招标内容
	 * @param treeName		树的名称
	 * @param parentId		招标申请主键
	 * @param params		
	 * @return 
	 */
	public List buildTree(String treeName,String parentId,Map params){
		if(treeName.equals("zbContentTree")){
			String bidtype="";
			if (params!=null && params.size()>0) {
				String[] bidtypes = (String[]) params.get("bidtype");
				if (bidtypes!=null && bidtypes.length>0) {
					bidtype = bidtypes[0];
				}
			}
			List zbContentList = zbContentTree(parentId,bidtype);
			return zbContentList;
		}
		return null;
	}
	
	/**
	 * 通过招标申请主键查找其下的招标内容
	 * @param parentId		招标申请表主键
	 * @return		此招标申请下的所有招标内容
	 */
	private List<TreeNode> zbContentTree(String parentId,String bidtype) {
		Iterator itr;
		TreeNode n;
		List<TreeNode> nodeList = new ArrayList<TreeNode>();
		if (null == parentId || "".equals(parentId) || "0".equals(parentId)){
			//查询出所有招标申请表数据
			List zbAppList = this.contractDAO.findByWhere(PcBidZbApply.class.getName(), "1=1 order by uids");
			itr = zbAppList.iterator();
			String sql="";
			while (itr.hasNext()){
				PcBidZbApply zbApply = (PcBidZbApply) itr.next();
				n = new TreeNode();
				sql="select p.UIDS from PC_BID_ZB_CONTENT p where ((p.UIDS not in(select c.BIDTYPE from con_ove c WHERE c.Bidtype IS NOT NULL)) or p.UIDS='"+bidtype+"') and p.ZB_UIDS='"+zbApply.getUids()+"'";
				List list=JdbcUtil.query(sql);
				if(list!=null&&list.size()>0){
					n.setId(zbApply.getUids());
					n.setText(zbApply.getZbName());
					n.setLeaf(false);
			        n.setCls("master-task");
			        n.setIconCls("task-folder");
			        nodeList.add(n);
				}
			}
		} else {
			//查询出对应招标申请表的所有招标内容
			List ZbContentList = this.contractDAO.findByWhere(PcBidZbContent.class.getName(),
					"zb_uids = '" + parentId + "' order by uids");
			itr = ZbContentList.iterator();
			while (itr.hasNext()){
				PcBidZbContent zbContent = (PcBidZbContent) itr.next();
				n = new TreeNode();
				if(!zbContent.getUids().equals(bidtype)){//不能过滤掉当前合同选择的招标内容
					List list=this.contractDAO.findByWhere(ConOve.class.getName(), "bidtype='"+zbContent.getUids()+"'");
					if(list!=null&&list.size()>0){//过滤掉已经被合同选择的招标内容
						continue;
					}
				}
				n.setId(zbContent.getUids());
				n.setText(zbContent.getContentes());
		        n.setLeaf(true);
		        n.setCls("task");

		        nodeList.add(n);
		      }
		    }
		    return nodeList;
	}
}


