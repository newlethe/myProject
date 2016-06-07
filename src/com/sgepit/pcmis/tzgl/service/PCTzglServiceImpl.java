package com.sgepit.pcmis.tzgl.service;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.dataexchange.PCDataExchangeException;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.budget.service.PCBdgInfoService;
import com.sgepit.pcmis.common.hbm.PcBusniessBack;
import com.sgepit.pcmis.common.util.MultistageReportUtil;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pcmis.jdgk.hbm.PcEdoProjectMonthD;
import com.sgepit.pcmis.tzgl.dao.TzglDAO;
import com.sgepit.pcmis.tzgl.hbm.PcTzgkMonthCompDetail;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport1D;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport1M;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport2D;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport2M;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport3D;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport3M;
import com.sgepit.pcmis.tzgl.hbm.PcTzglMonthCompD;
import com.sgepit.pcmis.tzgl.hbm.PcTzglMonthCompM;
import com.sgepit.pcmis.tzgl.hbm.PcTzglMonthInvestD;
import com.sgepit.pcmis.tzgl.hbm.PcTzglMonthInvestM;
import com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanD;
import com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanM;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport1M;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport2M;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport3M;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglMonthCompM;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglMonthReport;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglYearPlanM;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglYearPlanReport;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo;

public class PCTzglServiceImpl implements PCTzglService {
	Log log = LogFactory.getLog(PCTzglServiceImpl.class);
	
	private TzglDAO tzglDAO;
	public String getYearInvestXml(String pid) {
		String xmlStr = "";
		xmlStr += "<rows>";
		xmlStr += "<head>";
		xmlStr += "<column width=\"30\" type=\"ro\" align=\"center\" color=\"white\" sort=\"str\">序号</column>";
		xmlStr += "<column width=\"70\" type=\"ro\" align=\"center\" color=\"white\" sort=\"str\">年度</column>";
		xmlStr += "<column width=\"130\" type=\"ro\" align=\"center\" color=\"white\" sort=\"str\">年度投资计划报表</column>";
		xmlStr += "<column width=\"100\" type=\"ro\" align=\"center\" color=\"white\" sort=\"str\">项目总投资</column>";
		xmlStr += "<column width=\"150\" type=\"ro\" align=\"center\" color=\"white\" sort=\"str\">截止上年累计完成投资</column>";
		xmlStr += "<column width=\"100\" type=\"ro\" align=\"center\" color=\"white\" sort=\"str\">#cspan</column>";
		xmlStr += "<column width=\"100\" type=\"ro\" align=\"center\" color=\"white\" sort=\"str\">本年计划</column>";
		xmlStr += "<column width=\"100\" type=\"ro\" align=\"center\" color=\"white\" sort=\"str\">#cspan</column>";
		xmlStr += "<column width=\"80\" type=\"ro\" align=\"center\" sort=\"str\">本年累计完成投资</column>";
		xmlStr += "<column width=\"80\" type=\"ro\" align=\"center\" sort=\"str\">形象进度目标</column>";
		xmlStr += "<column width=\"115\" type=\"ro\" align=\"center\" sort=\"str\">备注</column>";
		xmlStr += "<settings>";
		xmlStr += "<colwidth>px</colwidth>";
		xmlStr += "</settings>";
		xmlStr += "<beforeInit>";
		xmlStr += "<call command=\"attachHeader\">";
		xmlStr += "<param>#rspan,#rspan,#rspan,#rspan,完成工程量总额,资金到位总额,工程计划总额,资金计划总额,#rspan,#rspan,#rspan</param>";
		xmlStr += "</call>";
		xmlStr += "</beforeInit>";
		xmlStr += "</head>";
		xmlStr=getYearInvestCelldata(pid,xmlStr);
		xmlStr += "</rows>";

		return xmlStr;
	}

	private String getYearInvestCelldata(String pid, String xmlStr) {
		int cell1=1;//序号
		 List<PcTzglYearPlanM> yearPlanMList=tzglDAO.findByWhere(PcTzglYearPlanM.class.getName(), 
				   "pid='"+pid+"' order by sjType");
		 for(int i=0; i<yearPlanMList.size();i++){
			 String cell2="";//年度
			String cell3="";//报表名称
			Double cell4=0d;//总投资
			Double cell5=0d;//完成工程量总额（截止上年）
			Double cell6=0d;//资金到位总额（截止上年）
			Double cell7=0d;//工程计划总额（本年计划）
			Double cell8=0d;//资金计划总额（本年计划）
			Double cell9=0d;//本年累计完成投资
			String cell10="";//形象进度目标
			String cell11="";//备注
			 PcTzglYearPlanM yearPlanM=(PcTzglYearPlanM)yearPlanMList.get(i);
			 PcTzglYearPlanD yearPlanD=(PcTzglYearPlanD)tzglDAO.findBeanByProperty(
					 PcTzglYearPlanD.class.getName(), "masterUids", yearPlanM.getUids());
			 //序号
			 cell1+=i;
			 //年度
			 cell2=yearPlanM.getSjType()+"年";
			 //报表名称
			 cell3=yearPlanM.getTitle();
			//本年累计投资完成
			 String hql="from PcTzglMonthCompD t where t.pid='"+pid+"' and t.sjType like '"+yearPlanM.getSjType()+"__'";
			 List<PcTzglMonthCompD> monthCompList2=tzglDAO.findByHql(hql);
			 for(int j=0; j<monthCompList2.size();j++){
				 PcTzglMonthCompD monthComp=(PcTzglMonthCompD)monthCompList2.get(j);
				 cell9 += (monthComp.getMonthCompBuild()==null?0:monthComp.getMonthCompBuild())
				 			+(monthComp.getMonthCompEquip()==null?0:monthComp.getMonthCompEquip())
				 			+(monthComp.getMonthCompInstall()==null?0:monthComp.getMonthCompInstall())
				 			+(monthComp.getMonthCompOther()==null?0:monthComp.getMonthCompOther());
		     }
			 if(yearPlanD !=null){
				//总投资
//				 cell4=(yearPlanD.getSrcCapitalOther()==null?0:yearPlanD.getSrcCapitalOther())
//					   +(yearPlanD.getSrcCorpInvest()==null?0:yearPlanD.getSrcCorpInvest())
//					   +(yearPlanD.getSrcEquityFund()==null?0:yearPlanD.getSrcEquityFund())
//					   +(yearPlanD.getSrcLoan()==null?0:yearPlanD.getSrcLoan())
//					   +(yearPlanD.getSrcOther()==null?0:yearPlanD.getSrcOther());
				//完成工程量总额（截止上年）
				 cell5=(yearPlanD.getTotalWorkAmount()==null?0:yearPlanD.getTotalWorkAmount());
				//资金到位总额（截止上年）
				 cell6=(yearPlanD.getTotalFullFunded()==null?0:yearPlanD.getTotalFullFunded());
				//工程计划总额（本年计划）
				 cell7=(yearPlanD.getBuildMoney()==null?0:yearPlanD.getBuildMoney())
	   				+(yearPlanD.getEquipMoney()==null?0:yearPlanD.getEquipMoney())
	   				+(yearPlanD.getInstallMoney()==null?0:yearPlanD.getInstallMoney())
	   				+(yearPlanD.getRouteMoney()==null?0:yearPlanD.getRouteMoney())
	   				+(yearPlanD.getOtherMoney()==null?0:yearPlanD.getOtherMoney());
			   //资金计划总额（本年计划）
				 cell8=(yearPlanD.getGroupAddFund()==null?0:yearPlanD.getGroupAddFund())
		   				+(yearPlanD.getEquityFund()==null?0:yearPlanD.getEquityFund())
		   				+(yearPlanD.getCapitalLoan()==null?0:yearPlanD.getCapitalLoan())
		   				+(yearPlanD.getCapitalOther()==null?0:yearPlanD.getCapitalOther())
		   				+(yearPlanD.getFundPlanLoan()==null?0:yearPlanD.getFundPlanLoan())
		   				+(yearPlanD.getFundPlanOther()==null?0:yearPlanD.getFundPlanOther());
			  //形象进度目标 
				 cell10=yearPlanD.getProgressObjective();
			  //备注
				 cell11=yearPlanD.getMemo();
			 }
			 xmlStr += "<row id=\"1\">";
			 xmlStr += "<cell>"+cell1+"</cell>";
			 xmlStr += "<cell>"+cell2+"</cell>";
			 xmlStr += "<cell>"+cell3+"</cell>";
			 xmlStr += "<cell>"+cell4+"</cell>";
			 xmlStr += "<cell>"+cell5+"</cell>";
			 xmlStr += "<cell>"+cell6+"</cell>";
			 xmlStr += "<cell>"+cell7+"</cell>";
			 xmlStr += "<cell>"+cell8+"</cell>";
			 xmlStr += "<cell>"+cell9+"</cell>";
			 xmlStr += "<cell>"+cell10+"</cell>";
			 xmlStr += "<cell>"+cell11+"</cell>";
			 xmlStr += "</row>";
		 }
		return xmlStr;
	}
	
	public String[] sjTypeFilter(String pid, String bean){
		List list=new ArrayList();
		list=tzglDAO.findByProperty(bean, "pid", pid);
		String sjType[]=new String[list.size()];
		try{
			for(int i=0;i<list.size();i++){
				//Class.forName(bean).cast(list.get(i))
				Object o = list.get(i);
				Method md= Class.forName(bean).getMethod("getSjType");
				String sj = (String) md.invoke(o);
				sjType[i]=sj;
			}
		}catch(Exception ex){
			ex.printStackTrace();
		}
		return sjType;
	}

	public TzglDAO getTzglDAO() {
		return tzglDAO;
	}

	public void setTzglDAO(TzglDAO tzglDAO) {
		this.tzglDAO = tzglDAO;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List indexOfTzglCount(String orderBy, Integer start,
				Integer limit, HashMap<String, String> params){
		
		   List<JSONObject> list = new ArrayList<JSONObject>();
		   String unitid=params.get("unitid")==null?"":params.get("unitid").toString();
		   String sjType=params.get("sjType")==null?"000000":params.get("sjType").toString();
		   String prjName=params.get("prjName")==null?"%":params.get("prjName").toString();
		   String unitTypeId = params.get("type")!=null?params.get("type").toString():"A";
		   String filter = (unitTypeId.equals("0")?" and state_2<>'0'":""); //集团用户查询时需要判断二级企业是否报送，使用unitTypeId=='0'
		   
		   String sql="select unitid,unitname from sgcc_ini_unit where unit_type_id='A' and unitid in " +
		   		"(select pid from pc_zhxx_prj_info where prj_name like '%"+prjName+"%') " +
		   		"connect by prior unitid=upunit start with unitid='"+unitid+"' order by unitid asc";
		   List prjList = JdbcUtil.query(sql);
		   
		   for(Iterator iter=prjList.iterator();iter.hasNext();){
			   Map zhxxPrj=(Map)iter.next();
			   String pid = zhxxPrj.get("unitid").toString();
			   String pname = zhxxPrj.get("unitname").toString();
			   Double zTouz = 0d;//总投资
			   Double nJihTouz = 0d;//年计划投资
			   Double yWancTouz = 0d;//本月完成投资
			   Double nLjWcTouz = 0d;//年累计完成投资
			   Double ljWcTouz = 0d;//累计完成投资
			   Double completeMoney = 0d;//施工投资完成金额，批准金额合计
			   
			   //总投资(资金来源总和)
//			   List<Map> lt1= JdbcUtil.query("select sum(invest_scale) ZTZ from PC_ZHXX_PRJ_INFO where pid='"+pid+"'");
//			   if(lt1.size()>0) zTouz = ((BigDecimal)lt1.get(0).get("ZTZ")).doubleValue();
			   //“总投资”字段取值项目单位最新投资完成月报中“执行概算”字段值。zhangh 2013-11-27 BUG5075
			   List<Map> lt1= JdbcUtil.query("select nvl(sum(ZX_BDG),0) ZTZ from PC_TZGK_MONTH_COMP_DETAIL where unit_id='"+pid+"' and sj_type='"+sjType+"'");
			   if(lt1.size()>0) zTouz = ((BigDecimal)lt1.get(0).get("ZTZ")).doubleValue();
			   System.out.println("<<<"+zTouz);
			   if(zTouz == 0d){
				   String zTouz_sql = "select nvl(t.ZX_BDG, 0) as ZTZ from PC_TZGK_MONTH_COMP_DETAIL t " +
							" where t.unit_id = '"+pid+"' and t.sj_type = (select max(m.sj_type) from pc_tzgl_month_comp_m m " +
							" where m.report_status in ('1', '3') and unit_id = '"+pid+"')";
				   System.out.println(">>>>>>>>>>"+zTouz_sql);
				   List<Map> lt2= JdbcUtil.query(zTouz_sql);
				   if(lt2.size()>0) zTouz = ((BigDecimal)lt2.get(0).get("ZTZ")).doubleValue();
			   }
			   
			   
			   //年度计划信息(集团用户查询时需要判断二级企业是否报送，使用unitTypeId=='0')
//			   List<Map> lt2 = JdbcUtil.query("select nvl(plan_fund_total,0) PLANZTZ from v_pc_tzgl_year_plan_report where " +
//		   			   "unit_id='"+pid+"' and sj_type = '"+sjType.substring(0,4)+"' and state_a in('1','3')"+filter);
//		   	   if(lt2.size()>0) nJihTouz = ((BigDecimal)lt2.get(0).get("PLANZTZ")).doubleValue();
		   	   //“本年度投资计划”字段取值最新年度投资计划报表中“工程计划总额”。zhangh 2013-11-27 BUG5075
			   List<Map> lt2 = JdbcUtil.query("select nvl(prj_Money_Total,0) PLANZTZ from v_pc_tzgl_year_plan_report where " +
		   			   "unit_id='"+pid+"' and sj_type = '"+sjType.substring(0,4)+"' and state_a in('1','3')"+filter);
		   	   if(lt2.size()>0) nJihTouz = ((BigDecimal)lt2.get(0).get("PLANZTZ")).doubleValue();
		   	   
			   
			   //本月投资计划完成(集团用户查询时需要判断二级企业是否报送，使用unitTypeId=='0')
			   List<Map> lt3=JdbcUtil.query("select nvl(MONTH_COMP,0) MONTH_COMP from V_PC_TZGL_MONTH_REPORT where " +
	   				   "unit_id='"+pid+"' and sj_type='"+sjType+"' and state_a in('1','3')"+filter);
			   if(lt3.size()>0) yWancTouz = ((BigDecimal)lt3.get(0).get("MONTH_COMP")).doubleValue();
			   
			   //本年累计投资完成
			   //距给定时间最近的已上报的月度投资计划月报时间
			   String sbTime= "(select max(sj_type) from V_PC_TZGL_MONTH_REPORT where " +
				   		"unit_id='"+pid+"' and sj_type <='"+sjType+"' and state_a in('1','3')"+filter+")";
			   List<Map> lt4=JdbcUtil.query("select nvl(YEAR_COMP,0) YEAR_COMP from V_PC_TZGL_MONTH_REPORT where unit_id='"+pid+"' and sj_type ="+sbTime);
			   if(lt4.size()>0) nLjWcTouz = ((BigDecimal)lt4.get(0).get("YEAR_COMP")).doubleValue();
			   
			   //累计投资完成
			   List<Map> lt5=JdbcUtil.query("select nvl(TOTAL_COMP,0) TOTAL_COMP from V_PC_TZGL_MONTH_REPORT where unit_id='"+pid+"' and sj_type ="+sbTime);
			   if(lt5.size()>0) ljWcTouz = ((BigDecimal)lt5.get(0).get("TOTAL_COMP")).doubleValue();

			   //施工投资完成金额，批准金额合计
			   List<Map> lt6=JdbcUtil.query("select nvl(sum(t.ratiftmoney),0) COMPLETE_MONEY from PRO_ACM_MONTH t where t.PID = '"
			   + pid + "' and t.CONID in (select c.CONID from CON_OVE c where c.CONDIVNO = 'SG')");
			   if(lt6.size()>0) completeMoney = ((BigDecimal)lt6.get(0).get("COMPLETE_MONEY")).doubleValue();
			   
			   JSONObject jo = new JSONObject();
			   jo.put("pid",pid);
			   jo.put("pname",pname);
			   jo.put("zTouz",zTouz);
			   jo.put("nJihTouz",nJihTouz);
			   jo.put("yWancTouz",yWancTouz);
			   jo.put("nLjWcTouz",nLjWcTouz);
			   jo.put("ljWcTouz",ljWcTouz);
			   jo.put("completeMoney",completeMoney);
			   
			   list.add(jo);
		   }
		   return list;
	   }
	public List indexOfMonthCompQuery(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params){
		List<JSONObject> list = new ArrayList<JSONObject>();
		String pid=params.get("pid");
		 List<PcTzglMonthCompM> monthCompMList=tzglDAO.findByWhere(PcTzglMonthCompM.class.getName(), 
				   "pid='"+pid+"'");
		 for(Iterator iter=monthCompMList.iterator();iter.hasNext();){
			 String yearMonth="";//月度
			String title="";//报表名称
			Double totalInvest=0d;//总投资
			Double untilLastYearInvest=0d;//截止上年累计完成投资
			Double thisYearPlan=0d;//本年计划
			Double thisMonthComp=0d;//本月投资完成
			Double thisYearComp=0d;//本年累计投资完成
			String progressObjective="";//形象进度目标
			String memo="";//备注 选择附表的备注
			 PcTzglMonthCompM monthCompM=(PcTzglMonthCompM)iter.next();
			 PcTzglMonthCompD monthCompD=(PcTzglMonthCompD)tzglDAO.findBeanByProperty(
					 PcTzglMonthCompD.class.getName(), "masterId", monthCompM.getUids());
			//月度
			 yearMonth=monthCompM.getSjType();
			 String year=yearMonth.substring(0, 4);
			//报表名称
			 title=monthCompM.getTitle();
			//本年累计投资完成
			   String hql="from PcTzglMonthCompD t where t.pid='"+pid+"' and t.sjType <= '"+yearMonth+"' and t.sjType >= '"+year+"01"+"'";
			   List<PcTzglMonthCompD> monthCompList=tzglDAO.findByHql(hql);
			   for(int i=0; i<monthCompList.size();i++){
				   PcTzglMonthCompD monthComp=(PcTzglMonthCompD)monthCompList.get(i);
				   thisYearComp += (monthComp.getMonthCompBuild()==null?0:monthComp.getMonthCompBuild())
				   			 +(monthComp.getMonthCompEquip()==null?0:monthComp.getMonthCompEquip())
				   			 +(monthComp.getMonthCompInstall()==null?0:monthComp.getMonthCompInstall())
				   			 +(monthComp.getMonthCompOther()==null?0:monthComp.getMonthCompOther());
			   }
			 //截止上年累计完成投资
			   String hql2="from PcTzglMonthCompD t where t.pid='"+pid+"' and t.sjType <= '"+(Integer.parseInt(year)-1)+"12"+"'";
			   List<PcTzglMonthCompD> monthCompList2=tzglDAO.findByHql(hql2);
			   for(int i=0; i<monthCompList2.size();i++){
				   PcTzglMonthCompD monthComp=(PcTzglMonthCompD)monthCompList2.get(i);
				   untilLastYearInvest += (monthComp.getMonthCompBuild()==null?0:monthComp.getMonthCompBuild())
				   			 +(monthComp.getMonthCompEquip()==null?0:monthComp.getMonthCompEquip())
				   			 +(monthComp.getMonthCompInstall()==null?0:monthComp.getMonthCompInstall())
				   			 +(monthComp.getMonthCompOther()==null?0:monthComp.getMonthCompOther());
			   }
			 if(monthCompD !=null){
				//总投资
				 totalInvest=( monthCompD.getTotalInvest()==null?0: monthCompD.getTotalInvest());
				//本年计划
				 thisYearPlan=(monthCompD.getYearPlanInves()==null ?0:monthCompD.getYearPlanInves());
				//本月投资完成
				 thisMonthComp=(monthCompD.getMonthCompBuild()==null ?0:monthCompD.getMonthCompBuild())
				 				+(monthCompD.getMonthCompEquip()==null ?0:monthCompD.getMonthCompEquip())
				 				+(monthCompD.getMonthCompInstall()==null ?0:monthCompD.getMonthCompInstall())
				 				+(monthCompD.getMonthCompOther()==null ?0:monthCompD.getMonthCompOther());
				//形象进度目标
				 progressObjective=monthCompD.getProgressObjective();
				//备注
				 memo=monthCompD.getMemo();
			 }
			 
			 JSONObject jo = new JSONObject();
			   jo.put("yearMonth",yearMonth);
			   jo.put("title",title);
			   jo.put("totalInvest",totalInvest);
			   jo.put("untilLastYearInvest",untilLastYearInvest);
			   jo.put("thisYearPlan",thisYearPlan);
			   jo.put("thisMonthComp",thisMonthComp);
			   jo.put("thisYearComp",thisYearComp);
			   jo.put("progressObjective",progressObjective);
			   jo.put("memo",memo);
			   list.add(jo);
		 }
		return list;
	}
	/**
	 * 年度投资计划上报
	 * @param uids 主键
	 * @param fromUnit 发送单位（项目单位）
	 * @param toUnit  接收单位
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String mis2jtOfYearPlan(String uids, String toUnitType, String fromUnit, String bizInfo,String reportMan){
		String flag = "1";
		
		try{
			//主表记录
			PcTzglYearPlanM M_yearPlan = (PcTzglYearPlanM) tzglDAO.findBeanByProperty(PcTzglYearPlanM.class.getName(), "uids", uids);
			String toUnitId = "";
			if(M_yearPlan==null){
				flag = "0";
			}else{
				VPcTzglYearPlanM vyearPlanHbm = (VPcTzglYearPlanM)tzglDAO.findById(VPcTzglYearPlanM.class.getName(), uids);
				PcBusniessBack bussBack=new PcBusniessBack();
				bussBack.setPid(vyearPlanHbm.getPid());
				bussBack.setBusniessId(vyearPlanHbm.getUids());
				bussBack.setBackUser(vyearPlanHbm.getUserId());
				bussBack.setBackDate(new Date());
				bussBack.setBusniessType("年度投资计划上报【项目单位上报到二级企业】");
				bussBack.setSpareC1("上报");
				bussBack.setSpareC2(vyearPlanHbm.getUnitname());
				bussBack.setBackReason("  ");
				//找到记录后, 查找该记录的二级公司, 如果没有二级公司merge="",
				 List lt = tzglDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='" + toUnitType + "' " +
					 		"connect by prior t.upunit = t.unitid start with t.unitid='"+M_yearPlan.getPid()+"' ");
				 String mergeSql = "";
				 if(lt.size()>0){
					 Object[] obj = (Object[]) lt.get(0);
					 String newUids = SnUtil.getNewID();
					 String unitid = (String) obj[0];//二级企业单位id
					 toUnitId = unitid;
					 String unitname = (String) obj[1];//二级企业名称
					 String reportname = M_yearPlan.getSjType()+"年"+unitname+"年度投资计划报表";
					 
					 mergeSql = "merge into pc_tzgl_year_plan_m tab1 using (select '"+unitid+"' as pid," +
				 		"'"+newUids+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, '0' as report_status," +
				 		"'"+M_yearPlan.getSjType()+"' as sj_type from dual ) tab2 " +
				 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
				 		"insert (pid,uids,create_date,title,issue_status,sj_type) values (tab2.pid,tab2.uids," +
				 		"tab2.createdate,tab2.reportname,tab2.report_status,tab2.sj_type) when matched then update set tab1.memo=''";
				 }
				 
				if(Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A")){//需要进行数据交互
					PcDynamicData dyda=new PcDynamicData();
					dyda.setPid(M_yearPlan.getPid());
					dyda.setPctablebean(PcTzglYearPlanM.class.getName());
					//通过视图查询处理机制不一样
					dyda.setPctablename("V_PC_TZGL_YEAR_PLAN_M");
					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
					dyda.setPctableuids(M_yearPlan.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.INVEST_YEAR_URL);
					
					Session session =tzglDAO.getSessionFactory().openSession();
					session.beginTransaction();
					session.save(dyda);
					session.save(bussBack);
					session.getTransaction().commit();
					session.close();
					
					
					//细表记录（zb_seqno、sj_type、unit_id唯一约束）
					List dPlanLt = tzglDAO.findByWhere(PcTzglYearPlanD.class.getName(), 
							"unit_id='"+M_yearPlan.getPid()+"' and sj_type='"+M_yearPlan.getSjType()+"'");
					
					List allDataList=new ArrayList();
					allDataList.add(M_yearPlan);
					allDataList.add(dyda);
					allDataList.addAll(dPlanLt);
					allDataList.add(bussBack);  
					
					PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					String sqlAfter = "update PC_TZGL_YEAR_PLAN_M set ISSUE_STATUS=1 where uids='"+uids+"'";
					List<PcDataExchange> exchangeList = 
						exchangeServiceImp.getExcDataList(allDataList, toUnitId, fromUnit, mergeSql, sqlAfter, "年度投资计划上报");
					Map<String,String> rtnMap = exchangeServiceImp.sendExchangeData(exchangeList);
					if(rtnMap.get("result").equals("success")){
						M_yearPlan.setIssueStatus(1L);
						tzglDAO.saveOrUpdate(M_yearPlan);//报送成功，修改上报状态
					}else{
						flag = "0";//报送失败
					}
				}else{//不需要进行数据交互，直接修改报送状态
					 if(mergeSql.equals("")){
						 M_yearPlan.setIssueStatus(1L);
						 tzglDAO.saveOrUpdate(M_yearPlan);
						 PcDynamicData dyda=new PcDynamicData();
							dyda.setPid(M_yearPlan.getPid());
							dyda.setPctablebean(PcTzglYearPlanM.class.getName());
							dyda.setPctablename("V_PC_TZGL_YEAR_PLAN_M");
							dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
							dyda.setPctableuids(M_yearPlan.getUids());
							dyda.setPcdynamicdate(new Date());
							dyda.setPcurl(DynamicDataUtil.INVEST_YEAR_URL);
							
							Session session =tzglDAO.getSessionFactory().openSession();
							session.beginTransaction();
							session.save(dyda);
							session.save(bussBack);
							session.getTransaction().commit();
							session.close();
					 }else{
						 log.info(mergeSql);
						 int len = tzglDAO.updateBySQL(mergeSql);
						 if(len==1){
							 M_yearPlan.setIssueStatus(1L);
							 tzglDAO.saveOrUpdate(M_yearPlan);
							 PcDynamicData dyda=new PcDynamicData();
								dyda.setPid(M_yearPlan.getPid());
								dyda.setPctablebean(PcTzglYearPlanM.class.getName());
								dyda.setPctablename("V_PC_TZGL_YEAR_PLAN_M");
								dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
								dyda.setPctableuids(M_yearPlan.getUids());
								dyda.setPcdynamicdate(new Date());
								dyda.setPcurl(DynamicDataUtil.INVEST_YEAR_URL);
								Session session =tzglDAO.getSessionFactory().openSession();
								session.beginTransaction();
								session.save(dyda);
								session.save(bussBack);
								session.getTransaction().commit();
								session.close();
						 }else{
							 flag = "0";
						 }
					 }
				}
			}
		}catch (PCDataExchangeException e) {
			e.printStackTrace();
			flag = "0";
		}
		return flag;
	}
	
	//年度投资计划上报(集团二级公司上报集团)
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String comp2TojtOfYearCmp(String uids, String sendPerson,String unitname)
	{
		String flag = "1";
		String beanName = "com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanM";
		try
		{
			PcTzglYearPlanM compM = (PcTzglYearPlanM)tzglDAO.findById(beanName, uids);
			 List lt = tzglDAO.getDataAutoCloseSes("select pid from v_pc_tzgl_year_plan_report t where t.sj_type='" + compM.getSjType() + "' " +
				 		"and state_a='3'");
			 if(lt.size()==0){
				 return "2";
			 }
			compM.setIssueStatus(1L);
			compM.setUserId(sendPerson);
			tzglDAO.saveOrUpdate(compM);
			
			PcBusniessBack bussBack=new PcBusniessBack();
			bussBack.setPid(compM.getPid());
			bussBack.setBusniessId(compM.getUids());
			bussBack.setBackUser(sendPerson);
			bussBack.setBackDate(new Date());
			bussBack.setBusniessType("年度投资计划上报【二级企业->集团】");
			bussBack.setSpareC1("上报");
			bussBack.setSpareC2(unitname);
			bussBack.setBackReason(" ");
			tzglDAO.saveOrUpdate(bussBack);
		}
		catch(BusinessException ex)
		{
			 flag = "0";
			 log.debug(Constant.getTrace(ex));
			 ex.printStackTrace();
		}
		
		return flag;
	}
	
	
	/**
	 * 月度投资完成上报(项目单位发送到二级公司)
	 * @param uids 主键
	 * @param fromUnit 发送单位（项目单位）
	 * @param toUnit  接收单位
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String mis2jtOfMonthCmp(String uids,String fromUnit,String toUnit){
		String flag = "1";
		try{
			if(uids.equals("")){
				flag = "0";
			}else{
				//主表记录
				PcTzglMonthCompM comPlanM = (PcTzglMonthCompM) tzglDAO.findBeanByProperty(PcTzglMonthCompM.class.getName(), "uids", uids);
				if(comPlanM==null){
					flag = "0";
				}else{
					//找到记录后, 查找该记录的二级公司, 如果没有二级公司merge="",
					 List lt = tzglDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
					 		"connect by prior t.upunit = t.unitid start with t.unitid='"+comPlanM.getPid()+"' ");
					 String mergeSql = "";
					 if(lt.size()>0){
						 Object[] obj = (Object[]) lt.get(0);
						 String newUids = SnUtil.getNewID();
						 String unitid = (String) obj[0];//二级企业单位id
						 String unitname = (String) obj[1];//二级企业名称
						 String reportname = comPlanM.getSjType().substring(0, 4)+"年"+comPlanM.getSjType().substring(4, 6)+"月"+unitname+"投资月报";
						 
						 mergeSql = "merge into pc_tzgl_month_comp_m tab1 using (select '"+unitid+"' as pid," +
					 		"'"+newUids+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, '0' as report_status," +
					 		"'"+comPlanM.getSjType()+"' as sj_type from dual ) tab2 " +
					 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
					 		"insert (pid,uids,create_date,title,report_status,sj_type) values (tab2.pid,tab2.uids," +
					 		"tab2.createdate,tab2.reportname,tab2.report_status,tab2.sj_type) when matched then update set tab1.memo=''";
					 }
					 
					if(Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A")){//需要进行数据交互
						//视图与表的数据保持一致性
						PcDynamicData dyda=new PcDynamicData();
						dyda.setPid(comPlanM.getPid());
						dyda.setPctablebean(PcTzglMonthCompM.class.getName());
						dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcTzglMonthCompM.class.getName()));
						dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
						dyda.setPctableuids(comPlanM.getUids());
						dyda.setPcdynamicdate(new Date());
						dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_URL);
						
						Session session = tzglDAO.getSessionFactory().openSession();
						session.beginTransaction();
						session.save(dyda);
						session.getTransaction().commit();
						session.close();

						//细表记录（zb_seqno、sj_type、unit_id唯一约束）
						List dPlanLt = tzglDAO.findByWhere(PcTzglMonthCompD.class.getName(), 
								"unit_id='"+comPlanM.getPid()+"' and sj_type='"+comPlanM.getSjType()+"'");
						
						List allDataList=new ArrayList();
						allDataList.add(comPlanM);
						allDataList.add(dyda);
						allDataList.addAll(dPlanLt);
						
						PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
						String sqlAfter = "update pc_tzgl_month_comp_m set report_status=1 where uids='"+uids+"'";
						List<PcDataExchange> exchangeList = 
							exchangeServiceImp.getExcDataList(allDataList, toUnit, fromUnit, mergeSql, sqlAfter, "月度投资完成上报");
						
						Map<String, String> retVal = exchangeServiceImp.sendExchangeData(exchangeList);
						String result = retVal.get("result");
						 
						 if(result.equalsIgnoreCase("success"))
						 {
							 comPlanM.setReportStatus(1L);
							 tzglDAO.saveOrUpdate(comPlanM);
						 }
						 else
						 {
							 flag = "0";
						 }
					}else{//不需要进行数据交互，直接修改报送状态
						 if(mergeSql.equals("")){
							 comPlanM.setReportStatus(1L);
							 tzglDAO.saveOrUpdate(comPlanM);
						 }else{
							 log.info(mergeSql);
							 int len = tzglDAO.updateBySQL(mergeSql);
							 if(len==1){
								 comPlanM.setReportStatus(1L);
								 tzglDAO.saveOrUpdate(comPlanM);
							 }else{
								 flag = "0";
							 }
						 }
					}
				}
			}
		}catch (PCDataExchangeException e) {
			 flag = "0";
			 log.debug(Constant.getTrace(e));
			 e.printStackTrace();
		}
		return flag;
	}
	
    //月度投资完成上报(集团二级公司报送到集团)
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String comp2TojtOfMonthCmp(String uids, String sendPerson,String unitname)
	{
		String flag = "1";
		String beanName = "com.sgepit.pcmis.tzgl.hbm.PcTzglMonthCompM";
		try
		{
			PcTzglMonthCompM compM = (PcTzglMonthCompM)tzglDAO.findById(beanName, uids);
			compM.setReportStatus(1L);
			if(compM.getCreateperson() == null || "".equals(compM.getCreateperson()))compM.setCreateperson(sendPerson);
			tzglDAO.saveOrUpdate(compM);
			
			PcBusniessBack bussBack=new PcBusniessBack();
			bussBack.setPid(compM.getPid());
//			bussBack.setUids(SnUtil.getNewID());
			bussBack.setBusniessId(compM.getUids());
			bussBack.setBackUser(sendPerson);
			bussBack.setBackDate(new Date());
			bussBack.setBusniessType("月度投资完成月报上报【二级企业->集团】");
			bussBack.setSpareC1("上报");
			bussBack.setSpareC2(unitname);
			bussBack.setBackReason(" ");
			tzglDAO.saveOrUpdate(bussBack);
		}
		catch(BusinessException ex)
		{
			 flag = "0";
			 log.debug(Constant.getTrace(ex));
			 ex.printStackTrace();
		}
		
		return flag;
	}
	
	
	/**
	 * 投资计划电源类报表报送(项目单位报送到集团二级公司)
	 * @param uids
	 * @param pid
	 * @param dyreportType
	 * @param fromUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String mis2jtOfDYReport(String uids,String pid, String dyreportType,String fromUnit,String toUnit, String reportMan){
		String flag = "1";
		String mergeSql = "";
		
		try{
			if(uids.equals("")){
				flag = "0";
			}else{
				PcBusniessBack bussBack=null;
				String logStr="";
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
				java.util.Date date=new java.util.Date();  
				String reportDate=sdf.format(date);
				//在进行数据交互判断之前生成merSql(即使不需要进行数据交互,该merSql也需要在本地被执行)
				if(dyreportType.equals("1"))
				{
					VPcTzglDyreport1M report1M = (VPcTzglDyreport1M) tzglDAO.findBeanByProperty(VPcTzglDyreport1M.class.getName(), "uids", uids);
					if(report1M==null){
						flag = "0";
					}
					else
					{	
						bussBack=new PcBusniessBack();
						bussBack.setPid(report1M.getPid());
						bussBack.setBusniessId(report1M.getUids());
						bussBack.setBackUser(reportMan);
						bussBack.setBackDate(date);
						bussBack.setBusniessType("电源固定资产投资完成情况月报");
						bussBack.setSpareC1("上报");
						bussBack.setSpareC2(report1M.getUnitname());
						bussBack.setBackReason("  ");
						logStr="insert into PC_BUSNIESS_BACK (pid,uids,busniess_id,back_user,back_date,busniess_type,spare_c1,spare_c2,back_reason)"+
						"values('"+report1M.getPid()+"','"+SnUtil.getNewID()+"','"+report1M.getUids()+"','"+reportMan+
						"',to_date('"+reportDate+"','YYYY-MM-DD HH24:MI:SS'),'招标(合同)月报上报【项目单位上报到二级企业】','上报','"+
						report1M.getUnitname()+"','  ')";
						///////////////////////////////////////
						 List lt = tzglDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
							 		"connect by prior t.upunit = t.unitid start with t.unitid='"+report1M.getPid()+"' ");
						 if(lt.size()>0){
							 Object[] obj = (Object[]) lt.get(0);
							 String newUids = SnUtil.getNewID();
							 String unitid = (String) obj[0];//二级企业单位id
							 String unitname = (String) obj[1];//二级企业名称
							 String reportname = report1M.getSjType().substring(0,4)+"年"+report1M.getSjType().substring(4, 6)+"月"+unitname+"电源固定资产投资完成情况月报";
							 
							 mergeSql = "merge into pc_tzgl_dyreport1_m tab1 using (select '"+unitid+"' as pid," +
						 		"'"+newUids+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, '0' as report_status," +
						 		"'"+report1M.getSjType()+"' as sj_type from dual ) tab2 " +
						 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
						 		"insert (pid,uids,create_date,title,state,sj_type) values (tab2.pid,tab2.uids," +
						 		"tab2.createdate,tab2.reportname,tab2.report_status,tab2.sj_type) when matched then update set tab1.memo=''";
						 }
					}
				}
				else if(dyreportType.equals("2"))
				{
					VPcTzglDyreport2M report2M = (VPcTzglDyreport2M) tzglDAO.findBeanByProperty(VPcTzglDyreport2M.class.getName(), "uids", uids);
					if(report2M==null){
						flag = "0";
					}
					else
					{	
						bussBack=new PcBusniessBack();
						bussBack.setPid(report2M.getPid());
						bussBack.setBusniessId(report2M.getUids());
						bussBack.setBackUser(reportMan);
						bussBack.setBackDate(date);
						bussBack.setBusniessType("电源项目建设规模和新增生产能力月报");
						bussBack.setSpareC1("上报");
						bussBack.setSpareC2(report2M.getUnitname());
						bussBack.setBackReason("  ");
						logStr="insert into PC_BUSNIESS_BACK (pid,uids,busniess_id,back_user,back_date,busniess_type,spare_c1,spare_c2,back_reason)"+
						"values('"+report2M.getPid()+"','"+SnUtil.getNewID()+"','"+report2M.getUids()+"','"+reportMan+
						"',to_date('"+reportDate+"','YYYY-MM-DD HH24:MI:SS'),'招标(合同)月报上报【项目单位上报到二级企业】','上报','"+
						report2M.getUnitname()+"','  ')";
						/////////////////////////////////
						List lt = tzglDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
						 		"connect by prior t.upunit = t.unitid start with t.unitid='"+report2M.getPid()+"' ");
						 if(lt.size()>0){
							 Object[] obj = (Object[]) lt.get(0);
							 String newUids = SnUtil.getNewID();
							 String unitid = (String) obj[0];//二级企业单位id
							 String unitname = (String) obj[1];//二级企业名称
							 String reportname = report2M.getSjType().substring(0,4)+"年"+report2M.getSjType().substring(4, 6)+"月"+unitname+"电源项目建设规模和新增生产能力月报";
						 
						 mergeSql = "merge into pc_tzgl_dyreport2_m tab1 using (select '"+unitid+"' as pid," +
					 		"'"+newUids+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, '0' as report_status," +
					 		"'"+report2M.getSjType()+"' as sj_type from dual ) tab2 " +
					 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
					 		"insert (pid,uids,create_date,title,state,sj_type) values (tab2.pid,tab2.uids," +
					 		"tab2.createdate,tab2.reportname,tab2.report_status,tab2.sj_type) when matched then update set tab1.memo=''";
						 }
					}
				}
				else if(dyreportType.equals("3"))
				{
					VPcTzglDyreport3M report3M = (VPcTzglDyreport3M) tzglDAO.findBeanByProperty(VPcTzglDyreport3M.class.getName(), "uids", uids);
					if(report3M==null){
						flag = "0";
					}else{
						bussBack=new PcBusniessBack();
						bussBack.setPid(report3M.getPid());
						bussBack.setBusniessId(report3M.getUids());
						bussBack.setBackUser(reportMan);
						bussBack.setBackDate(date);
						bussBack.setBusniessType("电源固定资产投资本年资金到位年报");
						bussBack.setSpareC1("上报");
						bussBack.setSpareC2(report3M.getUnitname());
						bussBack.setBackReason("  ");
						logStr="insert into PC_BUSNIESS_BACK (pid,uids,busniess_id,back_user,back_date,busniess_type,spare_c1,spare_c2,back_reason)"+
						"values('"+report3M.getPid()+"','"+SnUtil.getNewID()+"','"+report3M.getUids()+"','"+reportMan+
						"',to_date('"+reportDate+"','YYYY-MM-DD HH24:MI:SS'),'招标(合同)月报上报【项目单位上报到二级企业】','上报','"+
						report3M.getUnitname()+"','  ')";
						//////////
						List lt = tzglDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
						 		"connect by prior t.upunit = t.unitid start with t.unitid='"+report3M.getPid()+"' ");
						if(lt.size()>0){
							 Object[] obj = (Object[]) lt.get(0);
							 String newUids = SnUtil.getNewID();
							 String unitid = (String) obj[0];//二级企业单位id
							 String unitname = (String) obj[1];//二级企业名称
							 String reportname = report3M.getSjType().substring(0,4)+"年"+report3M.getSjType().substring(4,6)+"月"+unitname+"电源固定资产投资本年资金到位年报";
							 
						 mergeSql = "merge into pc_tzgl_dyreport3_m tab1 using (select '"+unitid+"' as pid," +
					 		"'"+newUids+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, '0' as report_status," +
					 		"'"+report3M.getSjType()+"' as sj_type from dual ) tab2 " +
					 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
					 		"insert (pid,uids,create_date,title,state,sj_type) values (tab2.pid,tab2.uids," +
					 		"tab2.createdate,tab2.reportname,tab2.report_status,tab2.sj_type) when matched then update set tab1.memo=''";
							}
					}
				}
				else
				{
					flag = "0";
					return flag;
				}
				
	//-----------merSql语句生成完成-------------------------
				if(Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A")){//需要进行数据交互
					
					PCDataExchangeService excService = 
										(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List list = new ArrayList();   //封装需要数据交互的报表主记录, 报表内容以及动态数据
					PcDynamicData dyda = new PcDynamicData();  //上报的时候添加动态数据
					if(dyreportType.equals("1")){  //电源固定资产投资完成情况月报上报
						PcTzglDyreport1M report1M = (PcTzglDyreport1M) tzglDAO.findBeanByProperty(PcTzglDyreport1M.class.getName(), "uids", uids);
						if(report1M==null){
							flag = "0";
						}else{
							//动态数据属性设定
							dyda.setPid(report1M.getPid());
							dyda.setPctablebean(VPcTzglDyreport1M.class.getName());
							dyda.setPctablename("PC_TZGL_DYREPORT1_M");
							dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
							dyda.setPctableuids(report1M.getUids());
							dyda.setPcdynamicdate(new Date());
							dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_TZWC_URL);
							
							Session session = tzglDAO.getSessionFactory().openSession();
							session.beginTransaction();
							session.save(dyda);
							session.getTransaction().commit();
							session.close();
							
							list.add(dyda); //动态数据添加到交互队列 封装成PcDataExchange对象
							List tempList =  tzglDAO.findByWhere(PcTzglDyreport1D.class.getName(),
									"unit_id='"+report1M.getUnitId()+"' and sj_type='"+report1M.getSjType()+"'");
							list.add(report1M);  //报表添加list中, 封装成PcDataExchange对象
							list.addAll(tempList); //报表内容添加到list中 封装成PcDataExchange对象
							
							if(mergeSql.length()>0){
								mergeSql+=";";
							}
							mergeSql+=logStr;
							String sqlAfter = "update PC_TZGL_DYREPORT1_M set STATE=1, report_date=to_date('"+
													reportDate+"','YYYY-MM-DD HH24:MI:SS') where uids='"+uids+"';"+mergeSql;
							String sqlBefore = "delete from pc_tzgl_dyreport1_d where unit_id='"+report1M.getUnitId()+"' and sj_type='"+report1M.getSjType()+"'";
							
							List<PcDataExchange> exchangeList = 
								excService.getExcDataList(list, toUnit, fromUnit, sqlBefore, sqlAfter, 
																				"电源固定资产投资完成情况月报");
							
							Map<String,String> rtnMap = excService.sendExchangeData(exchangeList);
							if(rtnMap.get("result").equals("success")){
								report1M.setState("1");
								report1M.setReportDate(date);
								tzglDAO.saveOrUpdate(report1M);//报送成功，修改上报状态
								tzglDAO.saveOrUpdate(bussBack);
							}else{
								flag = "0";//报送失败s
							}
						}
					}else if(dyreportType.equals("2"))  //电源项目建设规模和新增生产能力月报上报
					{
						PcTzglDyreport2M report2M = (PcTzglDyreport2M) tzglDAO.findBeanByProperty(PcTzglDyreport2M.class.getName(), "uids", uids);
						if(report2M==null){
							flag = "0";
						}else{
							//动态数据属性设定
							dyda.setPid(report2M.getPid());
							dyda.setPctablebean(PcTzglDyreport2M.class.getName());
							dyda.setPctablename("PC_TZGL_DYREPORT2_M");
							dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
							dyda.setPctableuids(report2M.getUids());
							dyda.setPcdynamicdate(new Date());
							dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_SCNL_URL);
							
							Session session = tzglDAO.getSessionFactory().openSession();
							session.beginTransaction();
							session.save(dyda);
							session.getTransaction().commit();
							session.close();
							list.add(dyda);
							
							List tempList =  tzglDAO.findByWhere(PcTzglDyreport2D.class.getName(),
									"unit_id='"+report2M.getUnitId()+"' and sj_type='"+report2M.getSjType()+"'");
							list.add(report2M);
							list.addAll(tempList);
							
							if(mergeSql.length()>0){
								mergeSql+=";";
							}
							mergeSql+=logStr;
							String sqlAfter = "update PC_TZGL_DYREPORT2_M set STATE=1, report_date=to_date('"+
													reportDate+"','YYYY-MM-DD HH24:MI:SS') where uids='"+uids+"';"+mergeSql;
							String sqlBefore = "delete from pc_tzgl_dyreport2_d where unit_id='"+report2M.getUnitId()+"' and sj_type='"+report2M.getSjType()+"'";

							List<PcDataExchange> exchangeList = excService.getExcDataList(list, toUnit, 
									fromUnit, sqlBefore, sqlAfter, "电源项目建设规模和新增生产能力月报");
							
							Map<String,String> rtnMap = excService.sendExchangeData(exchangeList);
							if(rtnMap.get("result").equals("success")){
								report2M.setState("1");
								report2M.setReportDate(date);
								tzglDAO.saveOrUpdate(report2M);//报送成功，修改上报状态
								tzglDAO.saveOrUpdate(bussBack);
							}else{
								flag = "0";//报送失败
							}
						}
					}else if(dyreportType.equals("3"))  //电源固定资产投资本年资金到位情况上报
					{
						PcTzglDyreport3M report3M = (PcTzglDyreport3M) tzglDAO.findBeanByProperty(PcTzglDyreport3M.class.getName(), "uids", uids);
						if(report3M==null){
							flag = "0";
						}else{
							//设定动态数据属性
							dyda.setPid(report3M.getPid());
							dyda.setPctablebean(PcTzglDyreport2M.class.getName());
							dyda.setPctablename("PC_TZGL_DYREPORT3_M");
							dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
							dyda.setPctableuids(report3M.getUids());
							dyda.setPcdynamicdate(new Date());
							dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_ZJDW_URL);
							
							Session session = tzglDAO.getSessionFactory().openSession();
							session.beginTransaction();
							session.save(dyda);
							session.getTransaction().commit();
							session.close();
							
							list.add(dyda);
							List tempList =  tzglDAO.findByWhere(PcTzglDyreport3D.class.getName(),
									"unit_id='"+report3M.getUnitId()+"' and sj_type='"+report3M.getSjType()+"'");
							list.add(report3M);
							list.addAll(tempList);
							
							if(mergeSql.length()>0){
								mergeSql+=";";
							}
							mergeSql+=logStr;
							
							String sqlAfter = "update PC_TZGL_DYREPORT3_M set STATE=1, report_date=to_date('"+
													reportDate+"','YYYY-MM-DD HH24:MI:SS') where uids='"+uids+"';"+mergeSql;
							String sqlBefore = "delete from pc_tzgl_dyreport3_d where unit_id='"+report3M.getUnitId()+"' and sj_type='"+report3M.getSjType()+"'";

							//动态数据数据交换对象
							List<PcDataExchange> exchangeList = 
								excService.getExcDataList(list, toUnit, fromUnit, sqlBefore, sqlAfter, 
																			"电源固定资产投资本年资金到位情况");
							
							Map<String,String> rtnMap = excService.sendExchangeData(exchangeList);
							if(rtnMap.get("result").equals("success")){
								report3M.setState("1");
								report3M.setReportDate(date);
								tzglDAO.saveOrUpdate(report3M);//报送成功，修改上报状态
								tzglDAO.saveOrUpdate(bussBack);
							}else{
								flag = "0";//报送失败
							}
						}
					}
				}else{		//不需要数据交互，直接修改报送状态
					PcDynamicData dyda = new PcDynamicData();
					if(dyreportType.equals("1")){
						PcTzglDyreport1M report1M = (PcTzglDyreport1M) tzglDAO.findBeanByProperty(PcTzglDyreport1M.class.getName(), "uids", uids);
						if(report1M==null){
							flag = "0";
						}else{
							if(mergeSql.equals("")){
								 report1M.setState("1");
								 report1M.setReportDate(date);
								 tzglDAO.saveOrUpdate(report1M);
								 tzglDAO.saveOrUpdate(bussBack);
							}
							else{
								 log.info(mergeSql);
								 int len = tzglDAO.updateBySQL(mergeSql);
								 if(len==1){
									 report1M.setState("1");
									 report1M.setReportDate(date);
									 tzglDAO.saveOrUpdate(report1M);
									 tzglDAO.saveOrUpdate(bussBack);
								 }else{
									 flag = "0";
								 }
							 }
							}
						
						  dyda.setPid(report1M.getPid());
						  dyda.setPctablebean(VPcTzglDyreport1M.class.getName());
						  dyda.setPctablename("PC_TZGL_DYREPORT1_M");
						  dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
						  dyda.setPctableuids(report1M.getUids());
						  dyda.setPcdynamicdate(new Date());
						  dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_TZWC_URL);
					}
					else if(dyreportType.equals("2")){
						PcTzglDyreport2M report2M = (PcTzglDyreport2M) tzglDAO.findBeanByProperty(PcTzglDyreport2M.class.getName(), "uids", uids);
						if(report2M==null){
							flag = "0";
						}else{
							if(mergeSql.equals("")){
								report2M.setState("1");
								report2M.setReportDate(date);
								 tzglDAO.saveOrUpdate(report2M);
								 tzglDAO.saveOrUpdate(bussBack);
							}
							else{
								 log.info(mergeSql);
								 int len = tzglDAO.updateBySQL(mergeSql);
								 if(len==1){
									 report2M.setState("1");
									 report2M.setReportDate(date);
									 tzglDAO.saveOrUpdate(report2M);
									 tzglDAO.saveOrUpdate(bussBack);
								 }else{
									 flag = "0";
								 }
							 }
							
								dyda.setPid(report2M.getPid());
								dyda.setPctablebean(PcTzglDyreport2M.class.getName());
								dyda.setPctablename("PC_TZGL_DYREPORT2_M");
								dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
								dyda.setPctableuids(report2M.getUids());
								dyda.setPcdynamicdate(new Date());
								dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_SCNL_URL);
							}
					}
					else if(dyreportType.equals("3")){
						PcTzglDyreport3M report3M = (PcTzglDyreport3M) tzglDAO.findBeanByProperty(PcTzglDyreport3M.class.getName(), "uids", uids);
						if(report3M==null){
							flag = "0";
						}else{
							if(mergeSql.equals("")){
								report3M.setState("1");
								report3M.setReportDate(date);
								 tzglDAO.saveOrUpdate(report3M);
								 tzglDAO.saveOrUpdate(bussBack);
							}
							else{
								 log.info(mergeSql);
								 int len = tzglDAO.updateBySQL(mergeSql);
								 if(len==1){
									 report3M.setState("1");
									 report3M.setReportDate(date);
									 tzglDAO.saveOrUpdate(report3M);
									 tzglDAO.saveOrUpdate(bussBack);
								 }else{
									 flag = "0";
								 }
							 }
							
							dyda.setPid(report3M.getPid());
							dyda.setPctablebean(PcTzglDyreport2M.class.getName());
							dyda.setPctablename("PC_TZGL_DYREPORT3_M");
							dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
							dyda.setPctableuids(report3M.getUids());
							dyda.setPcdynamicdate(new Date());
							dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_ZJDW_URL);
							}
						}
					
					  Session session = tzglDAO.getSessionFactory().openSession();
					  session.beginTransaction();
					  session.save(dyda);
					  session.getTransaction().commit();
					  session.close();
					}
				}
		}catch (PCDataExchangeException e) {
			e.printStackTrace();
			flag = "0";
		}
		return flag;
	}
	
	/**
	 * 投资计划电源类报表报送(集团二级公司报送到集团)
	 * @param uids 唯一记录
	 * @param sendPerson 发送人
	 * @param dyreportType  报表类型
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String comp2TojtOfDYReport(String uids, String sendPerson, String dyreportType,String unitname)
	{
		String flag = "1";
		String type = dyreportType;
		try
		{
			if(type.equals("1"))
			{
				PcTzglDyreport1M report1M = (PcTzglDyreport1M) tzglDAO.findBeanByProperty(PcTzglDyreport1M.class.getName(), "uids", uids);
				List lt = tzglDAO.getDataAutoCloseSes("select pid from v_pc_tzgl_dyreport1_m t where t.sj_type='" + report1M.getSjType() + "' " +
		 			"and unit_type_id='A' and state='3'");
				 if(lt.size()==0){
					 return "2";
				 }
				report1M.setState("1");
				report1M.setUserId(sendPerson);
				if(report1M.getCreateperson() ==null || report1M.getCreateperson().equals(""))report1M.setCreateperson(sendPerson);
				tzglDAO.saveOrUpdate(report1M);
				
				PcBusniessBack bussBack=new PcBusniessBack();
				bussBack.setPid(report1M.getPid());
				bussBack.setBusniessId(report1M.getUids());
				bussBack.setBackUser(sendPerson);
				bussBack.setBackDate(new Date());
				bussBack.setBusniessType("电源固定资产投资完成情况月报【二级企业->集团】");
				bussBack.setSpareC1("上报");
				bussBack.setSpareC2(unitname);
				bussBack.setBackReason(" ");
				tzglDAO.saveOrUpdate(bussBack);
			}
			else if(type.equals("2"))
			{
				PcTzglDyreport2M report2M = (PcTzglDyreport2M) tzglDAO.findBeanByProperty(PcTzglDyreport2M.class.getName(), "uids", uids);
				List lt = tzglDAO.getDataAutoCloseSes("select pid from v_pc_tzgl_dyreport2_m t where t.sj_type='" + report2M.getSjType() + "' " +
	 			"and unit_type_id='A' and state='3'");
				 if(lt.size()==0){
					 return "2";
				 }
				report2M.setState("1");
				report2M.setUserId(sendPerson);
				if(report2M.getCreateperson() ==null ||report2M.getCreateperson().equals(""))report2M.setCreateperson(sendPerson);
				tzglDAO.saveOrUpdate(report2M);
				
				PcBusniessBack bussBack=new PcBusniessBack();
				bussBack.setPid(report2M.getPid());
				bussBack.setBusniessId(report2M.getUids());
				bussBack.setBackUser(sendPerson);
				bussBack.setBackDate(new Date());
				bussBack.setBusniessType("电源项目建设规模和新增生产能力月报【二级企业->集团】");
				bussBack.setSpareC1("上报");
				bussBack.setSpareC2(unitname);
				bussBack.setBackReason(" ");
				tzglDAO.saveOrUpdate(bussBack);
			}
			else if(type.equals("3"))
			{
				PcTzglDyreport3M report3M = (PcTzglDyreport3M) tzglDAO.findBeanByProperty(PcTzglDyreport3M.class.getName(), "uids", uids);
				List lt = tzglDAO.getDataAutoCloseSes("select pid from v_pc_tzgl_dyreport3_m t where t.sj_type='" + report3M.getSjType() + "' " +
	 			"and unit_type_id='A' and state='3'");
				 if(lt.size()==0){
					 return "2";
				 }
				report3M.setState("1");
				report3M.setUserId(sendPerson);
				if(report3M.getCreateperson() ==null ||report3M.getCreateperson().equals(""))report3M.setCreateperson(sendPerson);
				tzglDAO.saveOrUpdate(report3M);
				
				PcBusniessBack bussBack=new PcBusniessBack();
				bussBack.setPid(report3M.getPid());
				bussBack.setBusniessId(report3M.getUids());
				bussBack.setBackUser(sendPerson);
				bussBack.setBackDate(new Date());
				bussBack.setBusniessType("电源固定资产投资本年资金到位年报【二级企业->集团】");
				bussBack.setSpareC1("上报");
				bussBack.setSpareC2(unitname);
				bussBack.setBackReason(" ");
				tzglDAO.saveOrUpdate(bussBack);
			}
			else
			{
				flag = "0";
				return flag;
			}
		}	
		catch(BusinessException ex)
		{
			 flag = "0";
			 log.debug(Constant.getTrace(ex));
			 ex.printStackTrace();
		}
		
		return flag;
	}
	
	
	/**
	 * 月度投资完成数据录入的 新增和修改
	 */
	public String monthCompddOrUpdate(PcTzglMonthCompD monthCompD) {
		String flag = "0";
		try{
			 
			if("".equals(monthCompD.getUids())||monthCompD.getUids()==null){//新增
				this.tzglDAO.insert(monthCompD);
				
				flag="1";
			}else{//修改
				this.tzglDAO.saveOrUpdate(monthCompD);
				flag = "2";
			}
			
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
		}
		return flag;
	}
	/**
	 * 年度投资计划数据录入的 新增和修改
	 */
	public String yearPlanAddOrUpdate(PcTzglYearPlanD yearPlanD) {
		String flag = "0";
		try{
			
			if("".equals(yearPlanD.getUids())||yearPlanD.getUids()==null){//新增
				this.tzglDAO.insert(yearPlanD);
				
				flag="1";
			}else{//修改
				this.tzglDAO.saveOrUpdate(yearPlanD);
				flag = "2";
			}
			
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	
	public String dyReport1AddOrUpdate(PcTzglDyreport1D report1) {
		String flag = "0";
		try{
			
			if("".equals(report1.getUids())||report1.getUids()==null){//新增
				this.tzglDAO.insert(report1);
				
				flag="1";
			}else{//修改
				this.tzglDAO.saveOrUpdate(report1);
				flag = "2";
			}
			
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	public String dyReport2AddOrUpdate(PcTzglDyreport2D report1) {
		String flag = "0";
		try{
			
			if("".equals(report1.getUids())||report1.getUids()==null){//新增
				this.tzglDAO.insert(report1);
				
				flag="1";
			}else{//修改
				this.tzglDAO.saveOrUpdate(report1);
				flag = "2";
			}
			
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	public String dyReport3AddOrUpdate(PcTzglDyreport3D report1) {
		String flag = "0";
		try{
			
			if("".equals(report1.getUids())||report1.getUids()==null){//新增
				this.tzglDAO.insert(report1);
				
				flag="1";
			}else{//修改
				this.tzglDAO.saveOrUpdate(report1);
				flag = "2";
			}
			
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	
	/**
	 * 年度投资计划数据录入时的初始化
	 */
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List yearPlanIni(String uids, String pid, String sjType){
		List list=new ArrayList();
		List<VPcTzglYearPlanReport> vpy=tzglDAO.findByWhere2(VPcTzglYearPlanReport.class.getName(), "UNIT_ID='"+pid+"' and sjType='"+sjType+"'");
		if(vpy.size()>0){
			return vpy;
		}else {
			List<VPcTzglYearPlanReport> vpy2=tzglDAO.findByWhere2(VPcTzglYearPlanReport.class.getName(), "UNIT_ID='"+pid+"' and sjType<'"+sjType+"' order by sjType desc");
			if(vpy2.size()>0){
				VPcTzglYearPlanReport temp=vpy2.get(0);
				VPcTzglYearPlanReport temp2=new VPcTzglYearPlanReport();
				temp2.setSjType(sjType);
				temp2.setUnitname(temp.getUnitname());
				temp2.setBuildLimit(temp.getBuildLimit());
				temp2.setBuildScale(temp.getBuildScale());
				temp2.setBuildNature(temp.getBuildNature());
				temp2.setInvestTotal(temp.getInvestTotal());
				temp2.setSrcZbjjt(temp.getSrcZbjjt());
				temp2.setSrcZbjqt(temp.getSrcZbjqt());
				temp2.setSrcZbjzy(temp.getSrcZbjzy());
				temp2.setSrcZbjTotal(temp.getSrcZbjTotal());
				temp2.setSrcDk(temp.getSrcDk());
				temp2.setSrcQt(temp.getSrcQt());
				String sql="select nvl(sum(month_comp),0) year_comp,nvl(sum(month_in),0) total_in "
						+" from PC_TZGK_MONTH_COMP_DETAIL where UNIT_ID='"+temp.getPid()+"' and sj_type <= '"+(new Long(sjType)-1)+"12'";
				List<Map> tempList=JdbcUtil.query(sql);
				if(tempList.size()>0){
					BigDecimal d1=(BigDecimal)tempList.get(0).get("year_comp");
					BigDecimal d2=(BigDecimal)tempList.get(0).get("total_in");
					temp2.setLastYearCompTotal(d1.doubleValue());
					temp2.setLastYearFundedTotal(d2.doubleValue());
				}
				list.add(temp2);
			}else{
				String sql="select info.PRJ_NAME unitname,info.memo_c2 build_scale, info.BUILD_NATURE_NAME build_nature, info.BUILD_LIMIT,"+
				"( select round(nvl(sum(s1.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s1 where s1.pid = info.pid and s1.src_type = 'ZBJJT' ) src_zbjjt,"+
				"( select round(nvl(sum(s2.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s2 where s2.pid = info.pid and s2.src_type = 'ZBJZY' ) src_zbjzy,"+
				"( select round(nvl(sum(s3.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s3 where s3.pid = info.pid and s3.src_type = 'ZBJQT' ) src_zbjqt,"+
				"( select round(nvl(sum(s4.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s4 where s4.pid = info.pid and s4.src_type = 'DK' ) src_dk,"+
				"( select round(nvl(sum(s5.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s5 where s5.pid = info.pid and s5.src_type = 'QT' ) src_qt,"+
				"( select round(nvl(sum(s6.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s6 where s6.pid = info.pid and s6.src_type in ( 'ZBJJT', 'ZBJZY','ZBJQT' )  ) src_zbj_total ,"+
				"( select round(nvl(sum(s7.amount),0)/10000,2) from pc_zhxx_prj_fundsrc s7 where s7.pid = info.pid and s7.src_type in ( 'ZBJJT', 'ZBJZY','ZBJQT', 'DK', 'QT' )  ) invest_total"+ 
				" from v_pc_zhxx_prj_info info where info.PID='"+pid+"'";
				List<Map> tempList=JdbcUtil.query(sql);
				if(tempList.size()>0){
					Map map=tempList.get(0);
					BigDecimal src_zbj_total=(BigDecimal)(map.get("src_zbj_total")==null ? new BigDecimal(0):map.get("src_zbj_total"));
					BigDecimal invest_total=(BigDecimal)(map.get("invest_total")==null ? new BigDecimal(0):map.get("invest_total"));
					VPcTzglYearPlanReport temp2=new VPcTzglYearPlanReport();
					temp2.setSjType(sjType);
					temp2.setUnitname(map.get("unitname")==null?"":map.get("unitname").toString());
					temp2.setBuildLimit(map.get("BUILD_LIMIT")==null?"":map.get("BUILD_LIMIT").toString());
					temp2.setBuildScale(map.get("build_scale")==null?"":map.get("build_scale").toString());
					temp2.setBuildNature(map.get("build_nature")==null?"":map.get("build_nature").toString());
					temp2.setInvestTotal(invest_total.doubleValue());
					temp2.setSrcZbjjt(map.get("src_zbjjt")==null?0d:Double.valueOf(map.get("src_zbjjt").toString()));
					temp2.setSrcZbjqt(map.get("src_zbjqt")==null?0d:Double.valueOf(map.get("src_zbjqt").toString()));
					temp2.setSrcZbjzy(map.get("src_zbjzy")==null?0d:Double.valueOf(map.get("src_zbjzy").toString()));
					temp2.setSrcZbjTotal(src_zbj_total.doubleValue());
					temp2.setSrcDk(map.get("src_dk")==null? 0d: Double.valueOf(map.get("src_dk").toString()));
					temp2.setSrcQt(map.get("src_qt")==null?0d:Double.valueOf(map.get("src_qt").toString()));
					list.add(temp2);
				}
			}
		}
		return list;
	}
	/**
	 * 投资管控->电源报表管理->投资完成报表
	 * 建筑、按照、设备、其他的月度完成数据从进度月报(PC_EDO_PROJECT_MONTH_D)中读取
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List dyReport1Ini(String unitId, String sjType){
		List list=new ArrayList();
		List<PcTzglDyreport1D> tempList=tzglDAO.findByWhere2(PcTzglDyreport1D.class.getName(), "unitId='"+unitId+"' and sjType='"+sjType+"'");
		if(tempList.size()>0){
			list.add(tempList.get(0));
			return list;
		}else {
			PcTzglDyreport1D report1=new PcTzglDyreport1D();
			report1.setSjType(sjType);
			report1.setUnitId(unitId);
			report1.setZbSeqno("DY_MONTHREPORT1");
			//“年度投资计划”中取数
			String year=sjType.substring(0, 4);
			List<VPcTzglYearPlanReport> tempList2=tzglDAO.findByWhere2(VPcTzglYearPlanReport.class.getName(), 
					"unitId='"+unitId+"' and sjType='"+year+"'");
			if(tempList2.size()>0){
				VPcTzglYearPlanReport tempObj=tempList2.get(0);
				report1.setVal1(tempObj.getInvestTotal());//计划总投资
			}
			//“投资完成月报”取数
			List <VPcTzglMonthReport> mpList=tzglDAO.findByWhere2(VPcTzglMonthReport.class.getName(),
					"unitId='"+unitId+"' and sjType='"+sjType+"'");
			if(mpList.size()>0){
				VPcTzglMonthReport tempObj=mpList.get(0);
				report1.setVal3(tempObj.getTotalComp());//自开工累计完成投资
				report1.setVal4(tempObj.getPlanFundTotal().doubleValue());//本年计划投资
				report1.setVal5(tempObj.getYearComp());//本年完成投资
			}
			//“进度情况月报”取数
			List<PcEdoProjectMonthD> tempList3=tzglDAO.findByWhere2(PcEdoProjectMonthD.class.getName(), 
					"unitId='"+unitId+"' and sjType='"+sjType+"'");
			if(tempList3.size()>0){
				PcEdoProjectMonthD tempObj=tempList3.get(0);
				//本年完成投资-建筑工程
				report1.setVal6(tempObj.getYearCompBuild());
				//本年完成投资-安装工程
				report1.setVal7(tempObj.getYearCompInstall());
				//本年完成投资-设备工器具购置
				report1.setVal8(tempObj.getYearCompEqu());
				//本年完成投资-其它费用
				report1.setVal9(tempObj.getYearCompOther());
			}
			list.add(report1);
		}
		return list;
	}
	public List dyReport2Ini(String unitId, String sjType){
		//查询本年以前所有年份最后一个月已上报的“本年新增生产能力”数据之和
		String sql="select nvl(sum(t.val81),0) a, nvl(sum(t.val82),0) b from pc_tzgl_dyreport2_d t where t.unit_id='"+unitId+"' "
				+ " and t.sj_type in (select max(d.sj_type) from pc_tzgl_dyreport2_m d "
				+ " where d.unit_id = '"+unitId+"' and substr(d.sj_type,0,4) < '"+sjType.substring(0, 4)+"' "
				//+ " and d.state = '1' "
				+ " group by substr(d.sj_type,0,4)) "
				+ " and t.sj_type < '"+sjType+"'";
		List<Map> tempList4=JdbcUtil.query(sql);
		BigDecimal a = new BigDecimal(0);
		BigDecimal b = new BigDecimal(0);
		if(tempList4.size()>0){
			Map map=tempList4.get(0);
			if(map.get("a") != null) a = (BigDecimal)map.get("a");
			if(map.get("b") != null) b = (BigDecimal)map.get("b");
		}
		
		List list=new ArrayList();
		List<PcTzglDyreport2D> tempList=tzglDAO.findByWhere2(PcTzglDyreport2D.class.getName(), "unitId='"+unitId+"' and sjType='"+sjType+"'");
		if(tempList.size()>0){
			PcTzglDyreport2D report2 = tempList.get(0);
			report2.setVal71hide(a.doubleValue());
			report2.setVal72hide(b.doubleValue());
			list.add(report2);
			return list;
		}else {
			PcTzglDyreport2D report1=new PcTzglDyreport2D();
			report1.setSjType(sjType);
			report1.setUnitId(unitId);
			report1.setZbSeqno("DY_MONTHREPORT2");
			String year=sjType.substring(0, 4);
			String month=sjType.substring(4, 6);
			report1.setVal71hide(a.doubleValue());
			report1.setVal72hide(b.doubleValue());
			report1.setVal71(a.doubleValue());
			report1.setVal72(b.doubleValue());
			List<PcZhxxPrjInfo> tempList2=tzglDAO.findByWhere2(PcZhxxPrjInfo.class.getName(), "pid='"+unitId+"'");
			if(tempList2.size()>0){
				PcZhxxPrjInfo tempObj=tempList2.get(0);
				report1.setVal11(tempObj.getPrjAddress());
				report1.setVal12(tempObj.getMemoC3());
				report1.setVal2(tempObj.getBuildStart());
				report1.setVal31(tempObj.getMemoC2()==null?0:Double.valueOf(tempObj.getMemoC2()));
				//项目基本信息中"建设规模"的单位是兆瓦，而电源报表中"建设规模"的单位是万千瓦，数值相差10倍。
				report1.setVal32(tempObj.getMemoC4()==null?0:Double.valueOf(tempObj.getMemoC4())*0.1);
			}
			List<PcTzglDyreport2M> tempListM=tzglDAO.findByWhere2(PcTzglDyreport2M.class.getName(), 
					"state=3 and pid='"+unitId+"' and sjType>'"+year+"00"+"' and sjType<'"+(Integer.parseInt(year)+1)+"00"+"'");
			if(tempListM.size()>0){
				List<PcTzglDyreport2D> tempList3=tzglDAO.findByWhere2(PcTzglDyreport2D.class.getName(), 
						"unitId='"+unitId+"' and sjType>'"+year+"00"+"' and sjType<'"+(Integer.parseInt(year)+1)+"00"+"'");
				if(tempList3.size()>0){
					PcTzglDyreport2D tempObj=tempList3.get(0);
					report1.setVal41(tempObj.getVal41());
					report1.setVal42(tempObj.getVal42());
					report1.setVal51(tempObj.getVal51());
					report1.setVal52(tempObj.getVal52());
					report1.setVal61(tempObj.getVal61());
					report1.setVal62(tempObj.getVal62());
					report1.setVal63(tempObj.getVal63());
				}
			}
			
			
			list.add(report1);
		}
		return list;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List dyReport3Ini(String unitId, String sjType){
		List list=new ArrayList();
		List<PcTzglDyreport3D> tempList=tzglDAO.findByWhere2(PcTzglDyreport3D.class.getName(), 
				"unitId='"+unitId+"' and sjType='"+sjType+"'");
		if(tempList.size()>0){
			list.add(tempList.get(0));
			return list;
		}else {
			PcTzglDyreport3D report1=new PcTzglDyreport3D();
			report1.setSjType(sjType);
			report1.setUnitId(unitId);
			report1.setZbSeqno("DY_MONTHREPORT3");
			List<VPcTzglMonthReport> tempList2=tzglDAO.findByWhere2(VPcTzglMonthReport.class.getName(), 
					"unitId='"+unitId+"' and sjType='"+sjType+"'");
			if(tempList2.size()>0){
				VPcTzglMonthReport tempObj=tempList2.get(0);
				report1.setVal1(tempObj.getTotalIn());//自开工累计资金到位
				report1.setVal2(tempObj.getYearIn());//本年到位
			}
			list.add(report1);
		}
		return list;
	}
	
	public List getCompData(String pid, String sjType){
		PCBdgInfoService bdgs=(PCBdgInfoService)Constant.wact.getBean("pcBdgInfoMgm");
		List arrList=bdgs.getBdgInfoForInvestManagement(pid,sjType);
		return arrList;
	}
	/**
	 * 月度投资完成数据录入时的初始化
	 */
	
	public List monthCompIni(String uids, String pid, String sjType){
		List list=new ArrayList();
		List<VPcTzglMonthReport> vpm=tzglDAO.findByWhere2(VPcTzglMonthReport.class.getName(), "masterId='"+uids+"' and sjType='"+sjType+"'");
		VPcTzglMonthReport temp2=new VPcTzglMonthReport();
		if(vpm.size()>0){
			VPcTzglMonthReport temp=vpm.get(0);
		}else {
			String te= "pid='"+pid+"' and sjType<'"+sjType+"' and sjType>'"+sjType.substring(0, 4)+"00"+"' order by sjType desc";
			List<VPcTzglMonthReport> vpm2=tzglDAO.findByWhere2(VPcTzglMonthReport.class.getName(), "pid='"+pid+"' and sjType<'"+sjType+"' and sjType>'"+sjType.substring(0, 4)+"00"+"' order by sjType desc");
			if(vpm2.size()>0){
				VPcTzglMonthReport temp=vpm2.get(0);
				temp2.setUnitname(temp.getUnitname());
			}else{
				String sql="select (select (y1.group_add_fund + y1.equity_fund + y1.capital_loan + y1.capital_other + y1.fund_plan_loan + y1.fund_plan_other) from pc_tzgl_year_plan_d y1 "+
                        			   "where y1.pid = m.pid and y1.sj_type = substr(m.sj_type, 0, 4) ) yearPlanFund,"+
                        		  "(select sum(amount) from pc_zhxx_prj_fundsrc src where src.pid = m.pid) totalInvestCal,"+
                                  "(select (y2.build_money + y2.equip_money + y2.install_money + y2.other_money + y2.route_money) from pc_tzgl_year_plan_d y2 "+
                                  	   "where y2.pid = m.pid and y2.sj_type = substr(m.sj_type, 0, 4) ) yearInvestFund,"+
                                  "(select sum(m5.month_full_funded) from pc_tzgl_month_comp_d m5 where m5.pid = m.pid and sj_type <= m.sj_type||'01' ) totalFunded,"+
                                  "(select sum(month_comp_build + month_comp_equip + month_comp_install +month_comp_other) "+
                                  "from pc_tzgl_month_comp_d m11 where m11.pid = m.pid and m11.sj_type <m.sj_type|| '01' ) lastYearTotalComp "+
                           "from pc_tzgl_year_plan_d m where m.pid='"+pid+"' and m.sj_type='"+sjType.substring(0, 4)+"'";
				List<Map> tempList=JdbcUtil.query(sql);
				if(tempList.size()>0){
					Map map=tempList.get(0);
					BigDecimal totalInvestCal=(BigDecimal)(map.get("totalInvestCal")==null ? new BigDecimal(0):map.get("totalInvestCal"));
					BigDecimal lastYearTotalComp=(BigDecimal)(map.get("lastYearTotalComp")==null ? new BigDecimal(0):map.get("lastYearTotalComp"));
					BigDecimal yearInvestFund=(BigDecimal)(map.get("yearInvestFund")==null ? new BigDecimal(0):map.get("yearInvestFund"));
					BigDecimal yearPlanFund=(BigDecimal)(map.get("yearPlanFund")==null ? new BigDecimal(0):map.get("yearPlanFund"));
					BigDecimal totalFunded=(BigDecimal)(map.get("totalFunded")==null ? new BigDecimal(0):map.get("totalFunded"));
				}
			}
		}
		list.add(temp2);
		
		return list;
	}
	private List<ColumnTreeNode> getUnitYearPlanReportTree(String rootPid, String sjType){
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
	
	//得到当前用户管辖所有项目
	SystemMgmFacade systemMgm=(SystemMgmFacade)Constant.wact.getBean("systemMgm");
	   List<SgccIniUnit> unitList=(List<SgccIniUnit>)systemMgm.getPidsByUnitid(rootPid);
	String sqlWhere = " pid = '%s' and sjType = '%s' and issueStatus = '1'";
	for (SgccIniUnit unit : unitList) {
		
		
		List<PcTzglYearPlanM> tempList = tzglDAO.findByWhere(PcTzglYearPlanM.class.getName(), String.format(sqlWhere, unit.getUnitid(), sjType));
		PcTzglYearPlanM mainReport;
		if ( tempList.size() > 0 ){
			mainReport = tempList.get(0);
		}
		else{
			mainReport = new PcTzglYearPlanM();
			mainReport.setPid(unit.getUnitid());
			mainReport.setIssueStatus(0L);
		}
		ColumnTreeNode columnNode = new ColumnTreeNode();
		TreeNode node = new TreeNode();
		node.setId(unit.getUnitid());
		node.setText(unit.getUnitname());
		node.setLeaf(true);
		node.setIconCls("task");
		
		columnNode.setTreenode(node);
		JSONObject jsonObject = JSONObject.fromObject(mainReport);
		columnNode.setColumns(jsonObject);
		nodeList.add(columnNode);
	}
	   
	return nodeList;
}

/**
 * 月度投资完成上报查询树
 * @param rootPid 用户所属组织机构ID
 * @param sjType 时间
 * @return
 */
private List<ColumnTreeNode> getUnitMonthReportTree(String rootPid, String sjType){
	List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
	
	//得到当前用户管辖所有项目
	SystemMgmFacade systemMgm=(SystemMgmFacade)Constant.wact.getBean("systemMgm");
	   List<SgccIniUnit> unitList=(List<SgccIniUnit>)systemMgm.getPidsByUnitid(rootPid);
	String sqlWhere = " pid = '%s' and sjType = '%s' and reportStatus = '1'";
	for (SgccIniUnit unit : unitList) {
		//找到该项目当月报表上报情况
		
		List<PcTzglMonthCompM> tempList = tzglDAO.findByWhere(PcTzglMonthCompM.class.getName(), String.format(sqlWhere, unit.getUnitid(), sjType));
		PcTzglMonthCompM mainReport;
		if ( tempList.size() > 0 ){
			mainReport = tempList.get(0);
		}
		else{
			mainReport = new PcTzglMonthCompM();
			mainReport.setPid(unit.getUnitid());
			mainReport.setReportStatus(0L);
		}
		ColumnTreeNode columnNode = new ColumnTreeNode();
		TreeNode node = new TreeNode();
		node.setId(unit.getUnitid());
		node.setText(unit.getUnitname());
		node.setLeaf(true);
		node.setIconCls("task");
		
		columnNode.setTreenode(node);
		JSONObject jsonObject = JSONObject.fromObject(mainReport);
		columnNode.setColumns(jsonObject);
		nodeList.add(columnNode);
	}
	   
	return nodeList;
}

private List<ColumnTreeNode> getDYReportTree(String rootPid, String sjType, String dyreportType){
	List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
	
	//得到当前用户管辖所有项目
	SystemMgmFacade systemMgm=(SystemMgmFacade)Constant.wact.getBean("systemMgm");
	List<SgccIniUnit> unitList=(List<SgccIniUnit>)systemMgm.getPidsByUnitid(rootPid);
	String sqlWhere = " pid = '%s' and sjType = '%s' and state = '1'";
	for (SgccIniUnit unit : unitList) {
		//找到该项目当月报表上报情况
		String bean=null;
		Object mainReport=null;
		if(dyreportType.equals("1")){
			bean="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport1M";
			List<PcTzglDyreport1M> tempList = tzglDAO.findByWhere(bean, String.format(sqlWhere, unit.getUnitid(), sjType));
			PcTzglDyreport1M report;
			if ( tempList.size() > 0 ){
				report = tempList.get(0);
			}
			else{
				report = new PcTzglDyreport1M();
				report.setPid(unit.getUnitid());
				report.setState("0");
			}
			mainReport=report;
		}else if(dyreportType.equals("2")){
			bean="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport2M";
			List<PcTzglDyreport2M> tempList = tzglDAO.findByWhere(bean, String.format(sqlWhere, unit.getUnitid(), sjType));
			PcTzglDyreport2M report;
			if ( tempList.size() > 0 ){
				report = tempList.get(0);
			}
			else{
				report = new PcTzglDyreport2M();
				report.setPid(unit.getUnitid());
				report.setState("0");
			}
			mainReport=report;
		}else if(dyreportType.equals("3")){
			bean="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport3M";
			List<PcTzglDyreport3M> tempList = tzglDAO.findByWhere(bean, String.format(sqlWhere, unit.getUnitid(), sjType));
			PcTzglDyreport3M report;
			if ( tempList.size() > 0 ){
				report = tempList.get(0);
			}
			else{
				report = new PcTzglDyreport3M();
				report.setPid(unit.getUnitid());
				report.setState("0");
			}
			mainReport=report;
		}
		
		ColumnTreeNode columnNode = new ColumnTreeNode();
		TreeNode node = new TreeNode();
		node.setId(unit.getUnitid());
		node.setText(unit.getUnitname());
		node.setLeaf(true);
		node.setIconCls("task");
		
		columnNode.setTreenode(node);
		JSONObject jsonObject = JSONObject.fromObject(mainReport);
		columnNode.setColumns(jsonObject);
		nodeList.add(columnNode);
	}
	
	return nodeList;
}

public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
		String parentId, Map params) throws BusinessException {
	String pid = "";
	if ( params.get("pid") != null ){
		pid = ((String[])params.get("pid"))[0];
	}
	
	List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();

	if (treeName.equalsIgnoreCase("UnitMonthReportTree")) { // 概算结构树
		String rootPid = ((String[])params.get("rootpid"))[0];
		String sjType = ((String[])params.get("sjtype"))[0];
		list =getUnitMonthReportTree(rootPid, sjType);
		return list;
	}
	else if( treeName.equalsIgnoreCase("UnitYearReportTree") ){
		String rootPid = ((String[])params.get("rootpid"))[0];
		String sjType = ((String[])params.get("sjtype"))[0];
		list =getUnitYearPlanReportTree(rootPid, sjType);
		return list;
	}else if( treeName.equalsIgnoreCase("DYReportTree") ){
		String rootPid = ((String[])params.get("rootpid"))[0];
		String sjType = ((String[])params.get("sjtype"))[0];
		String dyreportType = ((String[])params.get("dyreportType"))[0];
		list =getDYReportTree(rootPid, sjType,dyreportType);
		return list;
	}

	return list;
	
	
}

public String getEarliestMonthReportSj() {
	String sql = "select nvl(min(sj_type),'200701') minsj from pc_tzgl_month_comp_m";
	List<Map<String, Object>> list = JdbcUtil.query(sql);
	String result = "200701";
	if(list.size()>0) result = list.get(0).get("minsj").toString();
	return result;
}

public String getYearReportSj() {
	String sql = "select max(sj_type) maxsj, min(sj_type) minsj from pc_tzgl_year_plan_m";
	List<Map<String, Object>> list = JdbcUtil.query(sql);
	String maxSj = list.get(0).get("maxsj").toString();
	String minSj = list.get(0).get("minsj").toString();
	return minSj + "," + maxSj;
}
  

//投资管理年报退回
public String sendBackTzglYearReport(String uids, String reason,String backUser, String backUnitId) {
	String flag = "1";
	try{
		VPcTzglYearPlanM reportHbmV = (VPcTzglYearPlanM) tzglDAO.findById(VPcTzglYearPlanM.class.getName(), uids);
		log.debug("【投资管理月报退回】退回人："+backUser+",退回原因："+reason);
		if(reportHbmV!=null){
			PcTzglYearPlanM reportHbm = (PcTzglYearPlanM) tzglDAO.findById(PcTzglYearPlanM.class.getName(), uids);
			//退回原因
			PcBusniessBack backHbm = new PcBusniessBack();
			backHbm.setBackDate(new Date());
			backHbm.setBackReason(reason);
			backHbm.setBackUser(backUser);
			backHbm.setBusniessId(uids);
			backHbm.setPid(reportHbm.getPid());
			
			String unitTypeId = reportHbmV.getUnitTypeId();
			if(unitTypeId.equals("2")){//由集团退回到二级企业，不需要数据交互，直接修改状态
//				reportHbm.setReportStatus(2L);
				reportHbm.setIssueStatus(2L);
				backHbm.setBusniessType("投资完成年报退回【集团退回到二级企业】");
				
				tzglDAO.saveOrUpdate(reportHbm);
				tzglDAO.insert(backHbm);
			}else if(unitTypeId.equals("A")){//由二级企业退回到项目单位
				backHbm.setBusniessType("投资完成年报退回【二级企业退回到项目单位】");
				//判断是否需要数据交互
				String pid = reportHbm.getPid();
				if(tzglDAO.findByWhere(SgccIniUnit.class.getName(), 
						"unitid = '"+pid+"' and appUrl is not null").size()>0){//需要数据交互
					 PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
					 PcDataExchange exHbm = excService.getExcData(backHbm, pid, backUnitId, null, null, backHbm.getBusniessType());
					 
					 SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
					 
					 String beforeSql = "merge into pc_busniess_back tab1 using (select '"+SnUtil.getNewID()+"' as uids,'"+backUnitId+"' as pid," +
					 		"'"+uids+"' as busniess_id,'"+backUser+"' as back_user, " +
					 		"to_date('"+sdf.format(backHbm.getBackDate())+"', 'yyyymmddhh24miss') as back_date, " +
					 		"'"+reason+"' as back_reason, '投资完成年报退回【二级企业退回到项目单位】' as busniess_type from dual) tab2 " +
					 		"on (tab1.uids=tab2.uids) when matched then update set tab1.back_user=tab2.back_user, tab1.back_date=tab2.back_date," +
					 		"tab1.back_reason=tab2.back_reason when not matched then insert (uids,pid,busniess_id,back_user,back_date,back_reason,busniess_type) " +
					 		"values (tab2.uids,tab2.pid,tab2.busniess_id,tab2.back_user,tab2.back_date,tab2.back_reason,tab2.busniess_type)";
					 
					 String updateSql = "update PC_TZGL_YEAR_PLAN_M set ISSUE_STATUS='2' where sj_type = '"+reportHbm.getSjType()+"' and pid = '"+pid+"'";
					 log.info("【退回原因】前置SQL:"+beforeSql);
					 exHbm.setSpareC1(beforeSql);//前置sql，插入退回原因
					 exHbm.setSqlData(updateSql);
					 
					 List<PcDataExchange> preExData = new ArrayList<PcDataExchange>();
					 preExData.add(exHbm);
					 
					 Map<String,String> rtn = excService.sendExchangeData(preExData);
					 if(rtn.get("result").equals("success")){//发送成功
						 try {
							Connection conn = HibernateSessionFactory.getConnection();
							conn.setAutoCommit(false);
							Statement stmt = conn.createStatement();
							stmt.addBatch(updateSql);
							stmt.addBatch(beforeSql);
							stmt.executeBatch();
							conn.commit();
							stmt.close();
							conn.close();
						} catch (SQLException e) {
							flag = "0";
							log.error(Constant.getTrace(e));
							e.printStackTrace();
						}
					 }else{//发送失败
						 tzglDAO.delete(backHbm);
						 flag = "0";
					 }
				}else{//不需要数据交互
//					 reportHbm.setReportStatus(2L);
					 reportHbm.setIssueStatus(2L);
					 tzglDAO.saveOrUpdate(reportHbm);
					 tzglDAO.insert(backHbm);
				}
			}
		}else{
			flag = "0";
		}
	}catch (BusinessException e) {
		flag = "0";
		e.printStackTrace();
		log.debug(Constant.getTrace(e));
	}
	return flag;
}

	
	/**
	 * 投资管理月报退回
	 * @param uids			退回记录的主记录
	 * @param reason		退回原因
	 * @param backUser		退回操作人
	 * @param fromUnitTypeId	退回操作的单位类型：0、2、3
	 * @return
	 * @author: Liuay
	 * @createDate: 2011-12-1
	 */
	public String sendBackTzglMonReport(String uids, String reason,String backUser, String fromUnitTypeId) {
		String flag = "1";
		try{
			VPcTzglMonthCompM reportHbmV = (VPcTzglMonthCompM) tzglDAO.findById(VPcTzglMonthCompM.class.getName(), uids);
			log.debug("【投资管理月报退回】退回人："+backUser+",退回原因："+reason);
			if(reportHbmV!=null){
				PcTzglMonthCompM reportHbm = (PcTzglMonthCompM) tzglDAO.findById(PcTzglMonthCompM.class.getName(), uids);
				//退回原因
				PcBusniessBack backHbm = new PcBusniessBack();
				backHbm.setBackDate(new Date());
				backHbm.setBackReason(reason);
				backHbm.setBackUser(backUser);
				backHbm.setBusniessId(uids);
				backHbm.setPid(reportHbm.getPid());
				
				String unitTypeId = reportHbmV.getUnitTypeId();
				if(unitTypeId.equals("2")){//由集团退回到二级企业，不需要数据交互，直接修改状态
					reportHbm.setReportStatus(2L);
					backHbm.setBusniessType("投资管理月报退回【集团退回到二级企业】");
					
					tzglDAO.saveOrUpdate(reportHbm);
					tzglDAO.insert(backHbm);
				}else if(unitTypeId.equals("A")){//由二级企业退回到项目单位
					backHbm.setBusniessType("投资管理月报退回【二级企业退回到项目单位】");
					//判断是否需要数据交互
					String pid = reportHbm.getPid();
					
//					查找退回操作的单位
					String fromUnitId = "";
					List lt = tzglDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='" + fromUnitTypeId + "' " +
					 		"connect by prior t.upunit = t.unitid start with t.unitid='"+pid+"' ");
					if(lt.size()>0){
						Object[] obj = (Object[]) lt.get(0);
						fromUnitId = (String) obj[0];
						//判断是否有必要进行数据交互
						SgccIniUnit fromUnitHbm = (SgccIniUnit)this.tzglDAO.findBeanByProperty(SgccIniUnit.class.getName(),"unitid", fromUnitId);
						SgccIniUnit toUnitHbm = (SgccIniUnit)this.tzglDAO.findBeanByProperty(SgccIniUnit.class.getName(),"unitid", pid);
						String deployType =  Constant.propsMap.get("DEPLOY_UNITTYPE");
						
						if(deployType.toString().equals("0") && fromUnitHbm!=null && (toUnitHbm!=null && toUnitHbm.getAppUrl()!=null) && !toUnitHbm.getAppUrl().equals(fromUnitHbm.getAppUrl())) {
							PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
							PcDataExchange exHbm = excService.getExcData(backHbm, pid, fromUnitId, null, null, backHbm.getBusniessType());

							SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
							String beforeSql = "merge into pc_busniess_back tab1 using (select '"+SnUtil.getNewID()+"' as uids,'"+fromUnitId+"' as pid," +
							 		"'"+uids+"' as busniess_id,'"+backUser+"' as back_user, " +
							 		"to_date('"+sdf.format(backHbm.getBackDate())+"', 'yyyymmddhh24miss') as back_date, " +
							 		"'"+reason+"' as back_reason, '投资管理月报退回【二级企业退回到项目单位】' as busniess_type from dual) tab2 " +
							 		"on (tab1.uids=tab2.uids) when matched then update set tab1.back_user=tab2.back_user, tab1.back_date=tab2.back_date," +
							 		"tab1.back_reason=tab2.back_reason when not matched then insert (uids,pid,busniess_id,back_user,back_date,back_reason,busniess_type) " +
							 		"values (tab2.uids,tab2.pid,tab2.busniess_id,tab2.back_user,tab2.back_date,tab2.back_reason,tab2.busniess_type)";
							 
							String updateSql = "update PC_TZGL_MONTH_COMP_M set report_status=2 where sj_type = '"+reportHbm.getSjType()+"' and pid = '"+pid+"'";
							log.info("【退回原因】前置SQL:"+beforeSql);
							exHbm.setSpareC1(beforeSql);//前置sql，插入退回原因
							exHbm.setSqlData(updateSql);

							List<PcDataExchange> preExData = new ArrayList<PcDataExchange>();
							preExData.add(exHbm);
							 
							Map<String,String> rtn = excService.sendExchangeData(preExData);
							if(rtn.get("result").equals("success")){//发送成功
								try {
									Connection conn = HibernateSessionFactory.getConnection();
									conn.setAutoCommit(false);
									Statement stmt = conn.createStatement();
									stmt.addBatch(updateSql);
									stmt.addBatch(beforeSql);
									stmt.executeBatch();
									
									conn.commit();
									stmt.close();
									conn.close();
								} catch (SQLException e) {
									flag = "0";
									log.error(Constant.getTrace(e));
									e.printStackTrace();
								}
							 }else{//发送失败
								 tzglDAO.delete(backHbm);
								 flag = "0";
							 }
						}
					}else{//不需要数据交互
						 reportHbm.setReportStatus(2L);
						 tzglDAO.saveOrUpdate(reportHbm);
						 tzglDAO.insert(backHbm);
					}
				}
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		return flag;
	}
	
	/**
	 * 电源类投资完成月报退回方法
	 * @param uids 唯一记录
	 * @param reason 返回原因
	 * @param backUser  返回操作人
	 * @param backUnitId 返回到的单位编号
	 * @return String 0--失败; 1--成功
	 */
	public String sendBackDYReport1M(String uids, String reason,String backUser, String backUnitId)
	{
		String flag = "1";
		try{
			VPcTzglDyreport1M reportHbmV= (VPcTzglDyreport1M) tzglDAO.findById(VPcTzglDyreport1M.class.getName(), uids);
			log.debug("【电源投资完成月报退回】退回人："+backUser+",退回原因："+reason);
			if(reportHbmV!=null){
				PcTzglDyreport1M reportHbm = (PcTzglDyreport1M) tzglDAO.findById(PcTzglDyreport1M.class.getName(), uids);
				//退回原因
				PcBusniessBack backHbm = new PcBusniessBack();
				backHbm.setBackDate(new Date());
				backHbm.setBackReason(reason);
				backHbm.setBackUser(backUser);
				backHbm.setBusniessId(uids);
				backHbm.setPid(reportHbm.getPid());
				
				String unitTypeId = reportHbmV.getUnitTypeId();
				if(unitTypeId.equals("2")){//由集团退回到二级企业，不需要数据交互，直接修改状态
					reportHbm.setState("2");
					backHbm.setBusniessType("电源类投资完成月报退回【集团退回到二级企业】");
					
					tzglDAO.saveOrUpdate(reportHbm);
					tzglDAO.insert(backHbm);
				}else if(unitTypeId.equals("A")){//由二级企业退回到项目单位
					backHbm.setBusniessType("电源类投资完成月报退回【二级企业退回到项目单位】");
					//判断是否需要数据交互
					String pid = reportHbm.getPid();
					if(tzglDAO.findByWhere(SgccIniUnit.class.getName(), 
							"unitid = '"+pid+"' and appUrl is not null").size()>0){//需要数据交互
						 PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
						 PcDataExchange exHbm = excService.getExcData(backHbm, pid, backUnitId, null, null, backHbm.getBusniessType());
						 
						 SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
						 
						 String beforeSql = "merge into pc_busniess_back tab1 using (select '"+SnUtil.getNewID()+"' as uids,'"+backUnitId+"' as pid," +
						 		"'"+uids+"' as busniess_id,'"+backUser+"' as back_user, " +
						 		"to_date('"+sdf.format(backHbm.getBackDate())+"', 'yyyymmddhh24miss') as back_date, " +
						 		"'"+reason+"' as back_reason, '电源类投资完成月报退回【二级企业退回到项目单位】' as busniess_type from dual) tab2 " +
						 		"on (tab1.uids=tab2.uids) when matched then update set tab1.back_user=tab2.back_user, tab1.back_date=tab2.back_date," +
						 		"tab1.back_reason=tab2.back_reason when not matched then insert (uids,pid,busniess_id,back_user,back_date,back_reason,busniess_type) " +
						 		"values (tab2.uids,tab2.pid,tab2.busniess_id,tab2.back_user,tab2.back_date,tab2.back_reason,tab2.busniess_type)";
						 
						 String updateSql = "update pc_tzgl_dyreport1_m set state='2' where sj_type = '"+reportHbm.getSjType()+"' and pid = '"+pid+"'";
						 log.info("【退回原因】前置SQL:"+beforeSql);
						 exHbm.setSpareC1(beforeSql);//前置sql，插入退回原因
						 exHbm.setSqlData(updateSql);
						 
						 List<PcDataExchange> preExData = new ArrayList<PcDataExchange>();
						 preExData.add(exHbm);
						 
						 Map<String,String> rtn = excService.sendExchangeData(preExData);
						 if(rtn.get("result").equals("success")){//发送成功
							 try {
								Connection conn = HibernateSessionFactory.getConnection();
								conn.setAutoCommit(false);
								Statement stmt = conn.createStatement();
								stmt.addBatch(updateSql);
								stmt.addBatch(beforeSql);
								stmt.executeBatch();
								conn.commit();
								stmt.close();
								conn.close();
							} catch (SQLException e) {
								flag = "0";
								log.error(Constant.getTrace(e));
								e.printStackTrace();
							}
						 }else{//发送失败
							 tzglDAO.delete(backHbm);
							 flag = "0";
						 }
					}else{//不需要数据交互
						 reportHbm.setState("2");
						 tzglDAO.saveOrUpdate(reportHbm);
						 tzglDAO.insert(backHbm);
					}
				}
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		return flag;
	}
	
	/**
	 * 建设规模和新增生产能力月报退回方法
	 * @param uids 唯一记录
	 * @param reason 返回原因
	 * @param backUser  返回操作人
	 * @param backUnitId 返回到的单位编号
	 * @return String 0--失败; 1--成功
	 */
	public String sendBackDYReport2M(String uids, String reason,String backUser, String backUnitId)
	{
		String flag = "1";
		try{
			VPcTzglDyreport2M reportHbmV= (VPcTzglDyreport2M) tzglDAO.findById(VPcTzglDyreport2M.class.getName(), uids);
			log.debug("【建设规模和新增生产能力月报退回】退回人："+backUser+",退回原因："+reason);
			if(reportHbmV!=null){
				PcTzglDyreport2M reportHbm = (PcTzglDyreport2M) tzglDAO.findById(PcTzglDyreport2M.class.getName(), uids);
				//退回原因
				PcBusniessBack backHbm = new PcBusniessBack();
				backHbm.setBackDate(new Date());
				backHbm.setBackReason(reason);
				backHbm.setBackUser(backUser);
				backHbm.setBusniessId(uids);
				backHbm.setPid(reportHbm.getPid());
				
				String unitTypeId = reportHbmV.getUnitTypeId();
				if(unitTypeId.equals("2")){//由集团退回到二级企业，不需要数据交互，直接修改状态
					reportHbm.setState("2");
					backHbm.setBusniessType("建设规模和新增生产能力月报退回【集团退回到二级企业】");
					
					tzglDAO.saveOrUpdate(reportHbm);
					tzglDAO.insert(backHbm);
				}else if(unitTypeId.equals("A")){//由二级企业退回到项目单位
					backHbm.setBusniessType("建设规模和新增生产能力月报退回【二级企业退回到项目单位】");
					//判断是否需要数据交互
					String pid = reportHbm.getPid();
					if(tzglDAO.findByWhere(SgccIniUnit.class.getName(), 
							"unitid = '"+pid+"' and appUrl is not null").size()>0){//需要数据交互
						 PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
						 PcDataExchange exHbm = excService.getExcData(backHbm, pid, backUnitId, null, null, backHbm.getBusniessType());
						 
						 SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
						 
						 String beforeSql = "merge into pc_busniess_back tab1 using (select '"+SnUtil.getNewID()+"' as uids,'"+backUnitId+"' as pid," +
						 		"'"+uids+"' as busniess_id,'"+backUser+"' as back_user, " +
						 		"to_date('"+sdf.format(backHbm.getBackDate())+"', 'yyyymmddhh24miss') as back_date, " +
						 		"'"+reason+"' as back_reason, '建设规模和新增生产能力月报退回【二级企业退回到项目单位】' as busniess_type from dual) tab2 " +
						 		"on (tab1.uids=tab2.uids) when matched then update set tab1.back_user=tab2.back_user, tab1.back_date=tab2.back_date," +
						 		"tab1.back_reason=tab2.back_reason when not matched then insert (uids,pid,busniess_id,back_user,back_date,back_reason,busniess_type) " +
						 		"values (tab2.uids,tab2.pid,tab2.busniess_id,tab2.back_user,tab2.back_date,tab2.back_reason,tab2.busniess_type)";
						 
						 String updateSql = "update pc_tzgl_dyreport2_m set state='2' where sj_type = '"+reportHbm.getSjType()+"' and pid = '"+pid+"'";
						 log.info("【退回原因】前置SQL:"+beforeSql);
						 exHbm.setSpareC1(beforeSql);//前置sql，插入退回原因
						 exHbm.setSqlData(updateSql);
						 
						 List<PcDataExchange> preExData = new ArrayList<PcDataExchange>();
						 preExData.add(exHbm);
						 
						 Map<String,String> rtn = excService.sendExchangeData(preExData);
						 if(rtn.get("result").equals("success")){//发送成功
							 try {
								Connection conn = HibernateSessionFactory.getConnection();
								conn.setAutoCommit(false);
								Statement stmt = conn.createStatement();
								stmt.addBatch(updateSql);
								stmt.addBatch(beforeSql);
								stmt.executeBatch();
								conn.commit();
								stmt.close();
								conn.close();
							} catch (SQLException e) {
								flag = "0";
								log.error(Constant.getTrace(e));
								e.printStackTrace();
							}
						 }else{//发送失败
							 tzglDAO.delete(backHbm);
							 flag = "0";
						 }
					}else{//不需要数据交互
						 reportHbm.setState("2");
						 tzglDAO.saveOrUpdate(reportHbm);
						 tzglDAO.insert(backHbm);
					}
				}
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		return flag;
	}
	
	/**
	 * 电源类资金到位情况年报退回方法
	 * @param uids 唯一记录
	 * @param reason 返回原因
	 * @param backUser  返回操作人
	 * @param backUnitId 返回到的单位编号
	 * @return String 0--失败; 1--成功
	 */
	public String sendBackDYReport3M(String uids, String reason,String backUser, String backUnitId)
	{
		String flag = "1";
		try{
			VPcTzglDyreport3M reportHbmV= (VPcTzglDyreport3M) tzglDAO.findById(VPcTzglDyreport3M.class.getName(), uids);
			log.debug("【电源类资金到位情况年报退回】退回人："+backUser+",退回原因："+reason);
			if(reportHbmV!=null){
				PcTzglDyreport3M reportHbm = (PcTzglDyreport3M) tzglDAO.findById(PcTzglDyreport3M.class.getName(), uids);
				//退回原因
				PcBusniessBack backHbm = new PcBusniessBack();
				backHbm.setBackDate(new Date());
				backHbm.setBackReason(reason);
				backHbm.setBackUser(backUser);
				backHbm.setBusniessId(uids);
				backHbm.setPid(reportHbm.getPid());
				
				String unitTypeId = reportHbmV.getUnitTypeId();
				if(unitTypeId.equals("2")){//由集团退回到二级企业，不需要数据交互，直接修改状态
					reportHbm.setState("2");
					backHbm.setBusniessType("电源类资金到位情况年报退回【集团退回到二级企业】");
					
					tzglDAO.saveOrUpdate(reportHbm);
					tzglDAO.insert(backHbm);
				}else if(unitTypeId.equals("A")){//由二级企业退回到项目单位
					backHbm.setBusniessType("电源类资金到位情况年报退回【二级企业退回到项目单位】");
					//判断是否需要数据交互
					String pid = reportHbm.getPid();
					if(tzglDAO.findByWhere(SgccIniUnit.class.getName(), 
							"unitid = '"+pid+"' and appUrl is not null").size()>0){//需要数据交互
						 PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
						 PcDataExchange exHbm = excService.getExcData(backHbm, pid, backUnitId, null, null, backHbm.getBusniessType());
						 
						 SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
						 
						 String beforeSql = "merge into pc_busniess_back tab1 using (select '"+SnUtil.getNewID()+"' as uids,'"+backUnitId+"' as pid," +
						 		"'"+uids+"' as busniess_id,'"+backUser+"' as back_user, " +
						 		"to_date('"+sdf.format(backHbm.getBackDate())+"', 'yyyymmddhh24miss') as back_date, " +
						 		"'"+reason+"' as back_reason, '电源类资金到位情况年报月报退回【二级企业退回到项目单位】' as busniess_type from dual) tab2 " +
						 		"on (tab1.uids=tab2.uids) when matched then update set tab1.back_user=tab2.back_user, tab1.back_date=tab2.back_date," +
						 		"tab1.back_reason=tab2.back_reason when not matched then insert (uids,pid,busniess_id,back_user,back_date,back_reason,busniess_type) " +
						 		"values (tab2.uids,tab2.pid,tab2.busniess_id,tab2.back_user,tab2.back_date,tab2.back_reason,tab2.busniess_type)";
						 
						 String updateSql = "update pc_tzgl_dyreport3_m set state='2' where sj_type = '"+reportHbm.getSjType()+"' and pid = '"+pid+"'";
						 log.info("【退回原因】前置SQL:"+beforeSql);
						 exHbm.setSpareC1(beforeSql);//前置sql，插入退回原因
						 exHbm.setSqlData(updateSql);
						 
						 List<PcDataExchange> preExData = new ArrayList<PcDataExchange>();
						 preExData.add(exHbm);
						 
						 Map<String,String> rtn = excService.sendExchangeData(preExData);
						 if(rtn.get("result").equals("success")){//发送成功
							 try {
								Connection conn = HibernateSessionFactory.getConnection();
								conn.setAutoCommit(false);
								Statement stmt = conn.createStatement();
								stmt.addBatch(updateSql);
								stmt.addBatch(beforeSql);
								stmt.executeBatch();
								conn.commit();
								stmt.close();
								conn.close();
							} catch (SQLException e) {
								flag = "0";
								log.error(Constant.getTrace(e));
								e.printStackTrace();
							}
						 }else{//发送失败
							 tzglDAO.delete(backHbm);
							 flag = "0";
						 }
					}else{//不需要数据交互
						 reportHbm.setState("2");
						 tzglDAO.saveOrUpdate(reportHbm);
						 tzglDAO.insert(backHbm);
					}
				}
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		return flag;
	}
	
	//----------------------------------------------------项目单位-->二级企业-->集团
	/**
	 * 
	 * 实现将进度管控的信息通过数据交互传递给集团二级公司
	 * @param uids	上报主记录
	 * @param toUnitType	上报到上级单位的类型
	 * @param fromUnit		上报数据的单位
	 * @param bizInfo		数据交换的信息
	 * 
	 * 标注(liangwj,2011-09-22):
	 * 数据交互的条件：
	 * 集团->项目单位：需要判断项目单位的远程地址是否存在(也就是sgcc_ini_unit表中字段app_url是否存在)
	 * 项目单位->集团：需要判断系统资源文件中系统的部署模式(system.properties中DEPLOY_UNITTYPE的属性值)，如果DEPLOY_UNITTYPE=0表示项目单位和集团公司、
	 *                二级企业、三级企业子同一系统中，此时不需要进行数据交互；如果DEPLOY_UNITTYPE=A表示项目单位单独部署，此时需要数据交互。

	 * @author: Liuay
	 * @createDate: 2011-11-30
	 */
	public String xmdwSubmitReport2(String uids, String toUnitType, String fromUnit, String bizInfo,String reportMan) {
		String flag = "1";
		try{
			PcTzglMonthCompM monthCompHbm = (PcTzglMonthCompM)tzglDAO.findById(PcTzglMonthCompM.class.getName(), uids);
			String toUnitId = "";
			//判断能不能进行数据交互
			if(null==monthCompHbm){ 	 
				return "0";
			} else {
				VPcTzglMonthCompM vmonthCompHbm = (VPcTzglMonthCompM)tzglDAO.findById(VPcTzglMonthCompM.class.getName(), uids);
				PcBusniessBack bussBack=new PcBusniessBack();
				bussBack.setPid(vmonthCompHbm.getPid());
				bussBack.setBusniessId(vmonthCompHbm.getUids());
				bussBack.setBackUser(reportMan);
				bussBack.setBackDate(new Date());
				bussBack.setBusniessType("月度投资完成月报上报【项目单位上报到二级企业】");
				bussBack.setSpareC1("上报");
				bussBack.setSpareC2(vmonthCompHbm.getUnitname());
				bussBack.setBackReason("  ");
				//查询此项目单位对应的二级企业，插入二级企业记录，便于二级企业上报到集团(需要二级企业的主记录)
				List lt = tzglDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='" + toUnitType + "' " +
				 		"connect by prior t.upunit = t.unitid start with t.unitid='"+monthCompHbm.getPid()+"' ");
				String mergeSql = "";
				if(lt.size()>0){
					Object[] obj = (Object[]) lt.get(0);
					String newUids = SnUtil.getNewID();
					String unitid = (String) obj[0];
					toUnitId = unitid;
					String unitname = (String) obj[1];
					String reportname = unitname+monthCompHbm.getSjType().substring(0, 4)+"年"+monthCompHbm.getSjType().substring(4, 6)+"月"+"投资完成月度报表";

					mergeSql = "merge into pc_tzgl_month_comp_m tab1 using (select '"+unitid+"' as pid," +
					 		"'"+newUids+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, 0 as report_status," +
					 		"'"+monthCompHbm.getSjType()+"' as sj_type,'"+reportMan+"' as createperson from dual ) tab2 " +
					 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
					 		"insert (pid,uids,create_date,title,report_status,sj_type,createperson) values (tab2.pid,tab2.uids," +
					 		"tab2.createdate,tab2.reportname,tab2.report_status,tab2.sj_type,tab2.createperson) when matched then update set tab1.memo=''";
				}
				 //判断是否有必要进行数据交互
				SgccIniUnit fromUnitHbm = (SgccIniUnit)this.tzglDAO.findBeanByProperty(SgccIniUnit.class.getName(),"unitid", fromUnit);
				SgccIniUnit toUnitHbm = (SgccIniUnit)this.tzglDAO.findBeanByProperty(SgccIniUnit.class.getName(),"unitid", toUnitId);
				String deployType =  Constant.propsMap.get("DEPLOY_UNITTYPE");
				
				if(deployType.toString().equals("A") && (toUnitHbm!=null) && (toUnitHbm.getAppUrl()!=null) && !toUnitHbm.getAppUrl().equals(fromUnitHbm.getAppUrl())) {
					//满足执行数据交互的条件, 执行下面的方法
					List<PcTzgkMonthCompDetail> monthCompList = new ArrayList<PcTzgkMonthCompDetail>();
					monthCompList = tzglDAO.findByWhere(PcTzgkMonthCompDetail.class.getName(), "unit_id='"+monthCompHbm.getPid()+"' and sj_type = '"+monthCompHbm.getSjType()+"'");
					PcDynamicData dyda=new PcDynamicData();
					dyda.setPid(monthCompHbm.getPid());
					dyda.setPctablebean(PcTzglYearPlanM.class.getName());
					//通过视图查询处理机制不一样
					dyda.setPctablename("V_PC_TZGL_MONTH_REPORT_M");
					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
					dyda.setPctableuids(monthCompHbm.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_URL);
					
					
					
					Session session =tzglDAO.getSessionFactory().openSession();
					session.beginTransaction();
					session.save(dyda);
					session.save(bussBack);
					session.getTransaction().commit();
					session.close();
					
					List allDataList = new ArrayList();
					allDataList.add(monthCompHbm);      
					allDataList.addAll(monthCompList);  
					allDataList.add(dyda);  
					allDataList.add(bussBack);  
					
					String afterSql = mergeSql;
					if (mergeSql.length()>0) {
						afterSql += ";";
					}
					afterSql += "update pc_tzgl_month_comp_m set report_status=1 where uids ='" + monthCompHbm.getUids() + "'";
					PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
					List<PcDataExchange> excList = 
						 		excService.getExcDataList(allDataList, toUnitId, fromUnit, null, afterSql, bizInfo);
					Map<String, String> retVal = excService.sendExchangeData(excList);
					String result = retVal.get("result");
					 
					if(result.equalsIgnoreCase("success")){
						monthCompHbm.setReportStatus(1L);
						tzglDAO.saveOrUpdate(monthCompHbm);
					} else {
						flag = "0";
					}
				}else{//不需要进行数据交互，直接修改报送状态
					if(mergeSql.equals("")){
						monthCompHbm.setReportStatus(1L);
						tzglDAO.saveOrUpdate(monthCompHbm);
						PcDynamicData dyda=new PcDynamicData();
						dyda.setPid(monthCompHbm.getPid());
						dyda.setPctablebean(PcTzglYearPlanM.class.getName());
						//通过视图查询处理机制不一样
						dyda.setPctablename("V_PC_TZGL_MONTH_REPORT_M");
						dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
						dyda.setPctableuids(monthCompHbm.getUids());
						dyda.setPcdynamicdate(new Date());
						dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_URL);
						
						Session session =tzglDAO.getSessionFactory().openSession();
						session.beginTransaction();
						session.save(dyda);
						session.save(bussBack);
						session.getTransaction().commit();
						session.close();
					}else{
						log.info(mergeSql);
						int len = tzglDAO.updateBySQL(mergeSql);
						if(len==1){
							monthCompHbm.setReportStatus(1L);
							tzglDAO.saveOrUpdate(monthCompHbm);
							PcDynamicData dyda=new PcDynamicData();
							dyda.setPid(monthCompHbm.getPid());
							dyda.setPctablebean(PcTzglYearPlanM.class.getName());
							//通过视图查询处理机制不一样
							dyda.setPctablename("V_PC_TZGL_MONTH_REPORT_M");
							dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
							dyda.setPctableuids(monthCompHbm.getUids());
							dyda.setPcdynamicdate(new Date());
							dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_URL);
							Session session =tzglDAO.getSessionFactory().openSession();
							session.beginTransaction();
							session.save(dyda);
							session.save(bussBack);
							session.getTransaction().commit();
							session.close();
						}else{
							flag = "0";
						}
					} 
				}
			}	 
		} catch(BusinessException ex) {
			 flag = "0";
			 log.debug(Constant.getTrace(ex));
			 ex.printStackTrace();
		} 
	    return flag;
	}
	
	/**
	 * 获取主记录信息
	 * @param tableName
	 * @param uniqueWhere
	 * @return
	 * @author: Liuay
	 * @createDate: 2011-12-1
	 */
	public Map findDataByTableId(String tableName, String uniqueWhere) {
		String sql = "select * from " + tableName + " where " + uniqueWhere;
		List<Map> l = JdbcUtil.query(sql);
		if (l.size()>0) {
			Map list= l.get(0);
			String pid=(String)list.get("pid");
			String unit_sql="select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='3' " +
	 		"and t.unitid in (select upunit from sgcc_ini_unit where unitid='"+pid+"')";
			List unitList=tzglDAO.getDataAutoCloseSes(unit_sql);
			if(unitList.size()>0){
				Object[] obj = (Object[]) unitList.get(0);
				String corpid = (String) obj[0];
				String corpname = (String) obj[1];
				list.put("corpname", corpname);
			}else{
				String unitname=(String)list.get("unitname")==null?"":(String)list.get("unitname");
				list.put("corpname", unitname);
			}
			return list;
		} else {
			return null;
		}
	}
	
	/**
	 * 更新报表的签名信息
	 * @param tableName	需要更新的表名
	 * @param uniqueWhere	查询唯一数据的条件
	 * @param dataList		需要更新的字段`值
	 * @return
	 * @author: Liuay
	 * @createDate: 2011-12-1
	 */
	public String updateDataByTableId(String tableName, String uniqueWhere, List dataList) {
		if(dataList!=null && dataList.size()>0){
			String sql = "update " + tableName + " set ";
			for (int i = 0; i < dataList.size(); i++) {
				String[] dataArr = ((String)dataList.get(i)).split("`");
				String key = dataArr[0];
				String value = "";
				if (dataArr.length>1) {
					value = dataArr[1];
				}
				if (i==0) {
					sql += key + "='" + value + "' "; 
				}else {
					sql += ", " + key + "='" + value + "' "; 
				}
			}
			sql += " where " + uniqueWhere;
			JdbcUtil.execute(sql);
		}
		return "OK";
	}
	public Object[] getFilterUnitId(String table, String where){
		Object[] pidArr=null;
		String sql="select pid from "+table+" "+where; 
		List pidList=tzglDAO.getDataAutoCloseSes(sql);
		if(pidList.size()>0){
			pidArr=pidList.toArray();
		}
		return pidArr;
	}
	
	public String updateState(String uids,String backUser,String unitname,String reason,String fromUnit,long state){
		String flag = "1";
		String op="";
		if(state==2)op="退回";
		if(state==3)op="审核通过";
		try{
			VPcTzglMonthCompM reportHbmV = (VPcTzglMonthCompM) tzglDAO.findById(VPcTzglMonthCompM.class.getName(), uids);
			if(reportHbmV!=null){
				PcTzglMonthCompM reportHbm = (PcTzglMonthCompM) tzglDAO.findById(PcTzglMonthCompM.class.getName(), uids);
				//退回原因
				PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, op, reason, "投资完成月报"+op);
				String unitTypeId = reportHbmV.getUnitTypeId();
				long oldState = reportHbm.getReportStatus();
				
				reportHbm.setReportStatus(state);
				
				Session session =HibernateSessionFactory.getSession();
				session.beginTransaction();
				session.update(reportHbm);
				session.save(bussBack);
				session.getTransaction().commit();
				List<Object> objList=new ArrayList<Object>();
				objList.add(reportHbm);
				flag=MultistageReportUtil.multiReport(objList, bussBack, unitTypeId,fromUnit, reportHbm.getPid(), "投资完成月报"+op);
				if(flag.equals("0")){
					reportHbm.setReportStatus(oldState);
					session.beginTransaction();
					session.update(reportHbm);
					session.delete(bussBack);
					session.getTransaction().commit();
				}
				session.close();
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		
		return flag;
	}
	
	public String updateState2(String uids,String backUser,String unitname,String reason,String fromUnit,long state){
		String flag = "1";
		String op="";
		if(state==2)op="退回";
		if(state==3)op="审核通过";
		try{
			VPcTzglYearPlanM reportHbmV = (VPcTzglYearPlanM) tzglDAO.findById(VPcTzglYearPlanM.class.getName(), uids);
			if(reportHbmV!=null){
				PcTzglYearPlanM reportHbm = (PcTzglYearPlanM) tzglDAO.findById(PcTzglYearPlanM.class.getName(), uids);
				//退回原因
				PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, op, reason, "年度投资计划"+op);
				String unitTypeId = reportHbmV.getUnitTypeId();
				long oldState = reportHbm.getIssueStatus();
				
				reportHbm.setIssueStatus(state);
				
				Session session =HibernateSessionFactory.getSession();
				session.beginTransaction();
				session.update(reportHbm);
				session.save(bussBack);
				session.getTransaction().commit();
				List<Object> objList=new ArrayList<Object>();
				objList.add(reportHbm);
				flag=MultistageReportUtil.multiReport(objList, bussBack, unitTypeId,fromUnit, reportHbm.getPid(), "年度投资计划"+op);
				if(flag.equals("0")){
					reportHbm.setIssueStatus(oldState);
					session.beginTransaction();
					session.update(reportHbm);
					session.delete(bussBack);
					session.getTransaction().commit();
				}
				session.close();
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		
		return flag;
	}
	
	public String updateStateDYReport(String uids,String backUser,String unitname,String reason,String fromUnit,long state,String reportType){
		String flag = "1";
		String op="";
		if(state==2)op="退回";
		if(state==3)op="审核通过";
		try{
			if(reportType.equals("1")){
				VPcTzglDyreport1M reportHbmV = (VPcTzglDyreport1M) tzglDAO.findById(VPcTzglDyreport1M.class.getName(), uids);
				if(reportHbmV!=null){
					PcTzglDyreport1M reportHbm = (PcTzglDyreport1M) tzglDAO.findById(PcTzglDyreport1M.class.getName(), uids);
					//退回原因
					PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, op, reason, "电源固定资产投资完成情况月报"+op);
					String unitTypeId = reportHbmV.getUnitTypeId();
					String oldState = reportHbm.getState();
					
					reportHbm.setState(String.valueOf(state));
					
					Session session =HibernateSessionFactory.getSession();
					session.beginTransaction();
					session.update(reportHbm);
					session.save(bussBack);
					session.getTransaction().commit();
					List<Object> objList=new ArrayList<Object>();
					objList.add(reportHbm);
					flag=MultistageReportUtil.multiReport(objList, bussBack, unitTypeId,fromUnit, reportHbm.getPid(), "电源固定资产投资完成情况月报"+op);
					if(flag.equals("0")){
						reportHbm.setState(oldState);
						session.beginTransaction();
						session.update(reportHbm);
						session.delete(bussBack);
						session.getTransaction().commit();
					}
					session.close();
				}else{
					flag = "0";
				}
			}else if(reportType.equals("2")){
				VPcTzglDyreport2M reportHbmV = (VPcTzglDyreport2M) tzglDAO.findById(VPcTzglDyreport2M.class.getName(), uids);
				if(reportHbmV!=null){
					PcTzglDyreport2M reportHbm = (PcTzglDyreport2M) tzglDAO.findById(PcTzglDyreport2M.class.getName(), uids);
					//退回原因
					PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, op, reason, "电源项目建设规模和新增生产能力月报"+op);
					String unitTypeId = reportHbmV.getUnitTypeId();
					String oldState = reportHbm.getState();
					
					reportHbm.setState(String.valueOf(state));
					
					Session session =HibernateSessionFactory.getSession();
					session.beginTransaction();
					session.update(reportHbm);
					session.save(bussBack);
					session.getTransaction().commit();
					List<Object> objList=new ArrayList<Object>();
					objList.add(reportHbm);
					
					String afterSql="";
					if(state==3){
						List<PcTzglDyreport2M> list=tzglDAO.findByWhere(PcTzglDyreport2M.class.getName(), "pid='"+reportHbm.getPid()+
								"' and sjType< '"+reportHbm.getSjType()+"' and sjType> '"+reportHbm.getSjType().substring(0, 4)+"00"+"' and state=3");
						if(list.size()>0){
							
						}else{
							List<PcTzglDyreport2D> listD=tzglDAO.findByWhere(PcTzglDyreport2D.class.getName(), "unitId='"+reportHbm.getPid()+
									"' and sjType='"+reportHbm.getSjType()+"'");
							if(listD.size()>0){
								PcTzglDyreport2D objD=listD.get(0);
								SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								String reportDate=sdf.format(objD.getVal63());
								String year=objD.getSjType().substring(0, 4);
								afterSql="update pc_tzgl_dyreport2_d set val41="+objD.getVal41()+",val42="+objD.getVal42()+
									",val51="+objD.getVal51()+",val52="+objD.getVal52()+",val61="+objD.getVal61()+",val62="+
									objD.getVal62()+",val63=to_date('"+reportDate+"','YYYY-MM-DD HH24:MI:SS') where unit_id='"+
									objD.getUnitId()+"' and sj_type> '"+year+"00"+"' and sj_type<'"+(Integer.valueOf(year)+1)+"00"+"'";
							}
						}
					}
					flag=MultistageReportUtil.multiReport2(objList, bussBack, unitTypeId,fromUnit, reportHbm.getPid(), "电源项目建设规模和新增生产能力月报"+op,null,afterSql);
					if(flag.equals("0")){
						reportHbm.setState(oldState);
						session.beginTransaction();
						session.update(reportHbm);
						session.delete(bussBack);
						session.getTransaction().commit();
					}
					session.close();
				}else{
					flag = "0";
				}
			}else if(reportType.equals("3")){
				VPcTzglDyreport3M reportHbmV = (VPcTzglDyreport3M) tzglDAO.findById(VPcTzglDyreport3M.class.getName(), uids);
				if(reportHbmV!=null){
					PcTzglDyreport3M reportHbm = (PcTzglDyreport3M) tzglDAO.findById(PcTzglDyreport3M.class.getName(), uids);
					//退回原因
					PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, op, reason, "电源固定资产投资本年资金到位年报"+op);
					String unitTypeId = reportHbmV.getUnitTypeId();
					String oldState = reportHbm.getState();
					
					reportHbm.setState(String.valueOf(state));
					
					Session session =HibernateSessionFactory.getSession();
					session.beginTransaction();
					session.update(reportHbm);
					session.save(bussBack);
					session.getTransaction().commit();
					List<Object> objList=new ArrayList<Object>();
					objList.add(reportHbm);
					flag=MultistageReportUtil.multiReport(objList, bussBack, unitTypeId,fromUnit, reportHbm.getPid(), "电源固定资产投资本年资金到位年报"+op);
					if(flag.equals("0")){
						reportHbm.setState(oldState);
						session.beginTransaction();
						session.update(reportHbm);
						session.delete(bussBack);
						session.getTransaction().commit();
					}
					session.close();
				}else{
					flag = "0";
				}
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		
		return flag;
	}
	public List getReportPids(String dyreportType, String f_date){
		String sql="";
		if(dyreportType.equals("1")){
			sql="select pid from pc_tzgl_dyreport1_m t where t.sj_type='"+f_date+"' and t.state='3'";
		}else if(dyreportType.equals("2")){
			sql="select pid from pc_tzgl_dyreport2_m t where t.sj_type='"+f_date+"' and t.state='3'";
		}else if(dyreportType.equals("3")){
			sql="select pid from pc_tzgl_dyreport3_m t where t.sj_type='"+f_date+"' and t.state='3'";
		}else if(dyreportType.equals("4")){
			sql="select unit_id from v_pc_tzgl_dyreport4 t where t.sj_type='"+f_date.substring(0,4)+"'";
		}else if(dyreportType.equals("5")){
			sql="select unit_id from v_pc_tzgl_dyreport5 t where t.sj_type='"+f_date.substring(0,4)+"'";
		}
		List list=tzglDAO.getDataAutoCloseSes(sql);
		return list;
	}
	/**
	 * 初始化投资完成情况报表明细（新）
	 */
	public void initPcTzglMonthInvestD(String pid,String idsOfInsert){
		String[] insertUids = idsOfInsert.split(",");
		String sjType="";
		for (int i = 0; i < insertUids.length; i++) {
			String uids = insertUids[i];
			PcTzglMonthInvestM monthInvestM=(PcTzglMonthInvestM) this.tzglDAO.findById(PcTzglMonthInvestM.class.getName(), uids);
			sjType=monthInvestM.getSjType();
			PcTzglMonthInvestD monthInvestD=new PcTzglMonthInvestD();
			monthInvestD.setPid(pid);
			monthInvestD.setSjType(sjType);
			monthInvestD.setUnitId(pid);
			monthInvestD.setMasterId(uids);
			String monthStr=sjType.substring(4,6);
			String preSjtype="";
			if("01".equals(monthStr)){//一月份
				preSjtype= (Integer.valueOf(sjType.substring(0, 4))-1)+"12";
				List<PcTzglMonthInvestD> list1=this.tzglDAO.findByWhere(PcTzglMonthInvestD.class.getName(), "pid='"+pid+"' and sjType='"+preSjtype+"'");
				if(list1!=null&&list1.size()>0){
					PcTzglMonthInvestD preMonthInvestD=list1.get(0);
					monthInvestD.setBalCompTotal(preMonthInvestD.getBalCompTotal());
					monthInvestD.setBdgCompTotal(preMonthInvestD.getBdgCompTotal());
					monthInvestD.setFundInTotal(preMonthInvestD.getFundInTotal());
					monthInvestD.setFundPayTotal(preMonthInvestD.getFundPayTotal());
				}
				this.tzglDAO.insert(monthInvestD);
			}else{
				preSjtype=(Integer.valueOf(sjType)-1)+"";
				List<PcTzglMonthInvestD> list2=this.tzglDAO.findByWhere(PcTzglMonthInvestD.class.getName(), "pid='"+pid+"' and sjType='"+preSjtype+"'");
				if(list2!=null&&list2.size()>0){
					PcTzglMonthInvestD preMonthInvestD=list2.get(0);
					monthInvestD.setBalCompTotal(preMonthInvestD.getBalCompTotal());
					monthInvestD.setBdgCompTotal(preMonthInvestD.getBdgCompTotal());
					monthInvestD.setFundInTotal(preMonthInvestD.getFundInTotal());
					monthInvestD.setFundPayTotal(preMonthInvestD.getFundPayTotal());
					monthInvestD.setLastMonthCopmpAz(preMonthInvestD.getMonthCopmpAz());
					monthInvestD.setLastMonthCopmpBal(preMonthInvestD.getMonthCopmpBal());
					monthInvestD.setLastMonthCopmpIn(preMonthInvestD.getMonthCopmpIn());
					monthInvestD.setLastMonthCopmpJz(preMonthInvestD.getMonthCopmpJz());
					monthInvestD.setLastMonthCopmpPay(preMonthInvestD.getMonthCopmpPay());
					monthInvestD.setLastMonthCopmpQt(preMonthInvestD.getMonthCopmpQt());
					monthInvestD.setLastMonthCopmpSb(preMonthInvestD.getMonthCopmpSb());
					monthInvestD.setLastMonthCopmpSj(preMonthInvestD.getMonthCopmpSj());
					monthInvestD.setLastMonthCopmpTd(preMonthInvestD.getMonthCopmpTd());
					monthInvestD.setLastMonthCopmpTotal(preMonthInvestD.getMonthCopmpTotal());
					monthInvestD.setYearCopmpAz(preMonthInvestD.getMonthCopmpAz());
					monthInvestD.setYearCopmpIn(preMonthInvestD.getMonthCopmpIn());
					monthInvestD.setYearCopmpJz(preMonthInvestD.getMonthCopmpJz());
					monthInvestD.setYearCopmpPay(preMonthInvestD.getMonthCopmpPay());
					monthInvestD.setLastMonthCopmpQt(preMonthInvestD.getMonthCopmpQt());
					monthInvestD.setLastMonthCopmpSb(preMonthInvestD.getMonthCopmpSb());
					monthInvestD.setLastMonthCopmpSj(preMonthInvestD.getMonthCopmpSj());
					monthInvestD.setLastMonthCopmpTd(preMonthInvestD.getMonthCopmpTd());
					monthInvestD.setLastMonthCopmpTotal(preMonthInvestD.getMonthCopmpTotal());
					monthInvestD.setYearCopmpRate(preMonthInvestD.getYearCopmpRate());
					monthInvestD.setYearInvestPlan(preMonthInvestD.getYearInvestPlan());
					monthInvestD.setYearInvestPlanRate(preMonthInvestD.getYearInvestPlanRate());
					monthInvestD.setYearPlanVisualSchedule(preMonthInvestD.getYearPlanVisualSchedule());
					monthInvestD.setMonthVisualSchedule(preMonthInvestD.getMonthVisualSchedule());
				}
				this.tzglDAO.insert(monthInvestD);
			}
		}
	}
	
	/**
	 * 
	 * 实现将进度管控的信息通过数据交互传递给集团
	 * @param uids	上报主记录
	 * @param fromUnit		上报数据的单位
	 * @param bizInfo		数据交换的信息
	 * 
	 * 标注(liangwj,2011-09-22):
	 * 数据交互的条件：
	 * 集团->项目单位：需要判断项目单位的远程地址是否存在(也就是sgcc_ini_unit表中字段app_url是否存在)
	 * 项目单位->集团：需要判断系统资源文件中系统的部署模式(system.properties中DEPLOY_UNITTYPE的属性值)，如果DEPLOY_UNITTYPE=0表示项目单位和集团公司、
	 *                二级企业、三级企业子同一系统中，此时不需要进行数据交互；如果DEPLOY_UNITTYPE=A表示项目单位单独部署，此时需要数据交互。
	 */
	public String submitReportFormXmdwToJt(String uids, String fromUnit, String bizInfo,String reportMan,String reportUnitName) {
		String flag = "1";
		try{
			PcTzglMonthInvestM monthInvestM = (PcTzglMonthInvestM)tzglDAO.findById(PcTzglMonthInvestM.class.getName(), uids);
			String toUnitId = Constant.DefaultOrgRootID;
			//判断能不能进行数据交互
			if(null==monthInvestM){ 	 
				return "0";
			} else {
				PcBusniessBack bussBack=new PcBusniessBack();
				bussBack.setPid(monthInvestM.getPid());
				bussBack.setBusniessId(monthInvestM.getUids());
				bussBack.setBackUser(reportMan);
				bussBack.setBackDate(new Date());
				bussBack.setBusniessType("投资完成情况报表上报");
				bussBack.setSpareC1("上报");
				bussBack.setSpareC2(reportUnitName);
				bussBack.setBackReason("  ");
//				//查询此项目单位对应的二级企业，插入二级企业记录，便于二级企业上报到集团(需要二级企业的主记录)
//				List lt = tzglDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='" + toUnitType + "' " +
//				 		"connect by prior t.upunit = t.unitid start with t.unitid='"+monthCompHbm.getPid()+"' ");
				String mergeSql = "";
//				if(lt.size()>0){
//					Object[] obj = (Object[]) lt.get(0);
//					String newUids = SnUtil.getNewID();
//					String unitid = (String) obj[0];
//					toUnitId = unitid;
//					String unitname = (String) obj[1];
//					String reportname = unitname+monthCompHbm.getSjType().substring(0, 4)+"年"+monthCompHbm.getSjType().substring(4, 6)+"月"+"投资完成月度报表";
//
				String creadate = monthInvestM.getCreateDate().toString().substring(0,monthInvestM.getCreateDate().toString().lastIndexOf('.'));	
				mergeSql = "merge into pc_tzgl_month_comp_m tab1 using (select '"+monthInvestM.getPid()+"' as pid," +
					 		"'"+SnUtil.getNewID()+"' as uids,to_date('"+creadate+"','yyyy-MM-dd HH24:mi:ss') as createdate,'"+monthInvestM.getTitle()+"' as reportname, 0 as report_status," +
					 		"'"+monthInvestM.getSjType()+"' as sj_type,'"+monthInvestM.getCreateperson()+"' as createperson from dual ) tab2 " +
					 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
					 		"insert (pid,uids,create_date,title,report_status,sj_type,createperson) values (tab2.pid,tab2.uids," +
					 		"tab2.createdate,tab2.reportname,tab2.report_status,tab2.sj_type,tab2.createperson) when matched then update set tab1.memo=''";
//				}
				 //判断是否有必要进行数据交互
				SgccIniUnit fromUnitHbm = (SgccIniUnit)this.tzglDAO.findBeanByProperty(SgccIniUnit.class.getName(),"unitid", fromUnit);
				SgccIniUnit toUnitHbm = (SgccIniUnit)this.tzglDAO.findBeanByProperty(SgccIniUnit.class.getName(),"unitid", toUnitId);
				String deployType =  Constant.propsMap.get("DEPLOY_UNITTYPE");
				
				if(deployType.toString().equals("A") && (toUnitHbm!=null) && (toUnitHbm.getAppUrl()!=null) && !toUnitHbm.getAppUrl().equals(fromUnitHbm.getAppUrl())) {
					//满足执行数据交互的条件, 执行下面的方法
					List<PcTzglMonthInvestD> monthInvestDList = new ArrayList<PcTzglMonthInvestD>();
					monthInvestDList = tzglDAO.findByWhere(PcTzglMonthInvestD.class.getName(), "pid='"+monthInvestM.getPid()+"' and sj_type = '"+monthInvestM.getSjType()+"'");
//					PcDynamicData dyda=new PcDynamicData();
//					dyda.setPid(monthCompHbm.getPid());
//					dyda.setPctablebean(PcTzglYearPlanM.class.getName());
//					//通过视图查询处理机制不一样
//					dyda.setPctablename("V_PC_TZGL_MONTH_REPORT_M");
//					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
//					dyda.setPctableuids(monthCompHbm.getUids());
//					dyda.setPcdynamicdate(new Date());
//					dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_URL);
					
					
					
					Session session =tzglDAO.getSessionFactory().openSession();
					session.beginTransaction();
//					session.save(dyda);
					session.save(bussBack);
					session.getTransaction().commit();
					session.close();
					
					List allDataList = new ArrayList();
//					allDataList.add(monthInvestM);      
					allDataList.addAll(monthInvestDList);  
//					allDataList.add(dyda);  
					allDataList.add(bussBack);  
					
					String beforeSql = mergeSql;
					String afterSql = "";
					afterSql += "update Pc_Tzgl_Month_Invest_m set report_status=1 where uids ='" + monthInvestM.getUids() + "'";
					PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
					List<PcDataExchange> excList = 
						 		excService.getExcDataList(allDataList, toUnitId, fromUnit, beforeSql, afterSql, bizInfo);
					Map<String, String> retVal = excService.sendExchangeData(excList);
					String result = retVal.get("result");
					 
					if(result.equalsIgnoreCase("success")){
						monthInvestM.setReportStatus(1L);
						tzglDAO.saveOrUpdate(monthInvestM);
					} else {
						flag = "0";
					}
				}else{//不需要进行数据交互，直接修改报送状态
					if(mergeSql.equals("")){
						monthInvestM.setReportStatus(1L);
						tzglDAO.saveOrUpdate(monthInvestM);
//						PcDynamicData dyda=new PcDynamicData();
//						dyda.setPid(monthInvestM.getPid());
//						dyda.setPctablebean(PcTzglYearPlanM.class.getName());
//						//通过视图查询处理机制不一样
//						dyda.setPctablename("V_PC_TZGL_MONTH_REPORT_M");
//						dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
//						dyda.setPctableuids(monthInvestM.getUids());
//						dyda.setPcdynamicdate(new Date());
//						dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_URL);
						
						Session session =tzglDAO.getSessionFactory().openSession();
						session.beginTransaction();
//						session.save(dyda);
						session.save(bussBack);
						session.getTransaction().commit();
						session.close();
					}else{
						log.info(mergeSql);
						int len = tzglDAO.updateBySQL(mergeSql);
						if(len==1){
							monthInvestM.setReportStatus(1L);
							tzglDAO.saveOrUpdate(monthInvestM);
//							PcDynamicData dyda=new PcDynamicData();
//							dyda.setPid(monthInvestM.getPid());
//							dyda.setPctablebean(PcTzglYearPlanM.class.getName());
//							//通过视图查询处理机制不一样
//							dyda.setPctablename("V_PC_TZGL_MONTH_REPORT_M");
//							dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
//							dyda.setPctableuids(monthInvestM.getUids());
//							dyda.setPcdynamicdate(new Date());
//							dyda.setPcurl(DynamicDataUtil.INVEST_MONTH_URL);
							Session session =tzglDAO.getSessionFactory().openSession();
							session.beginTransaction();
//							session.save(dyda);
							session.save(bussBack);
							session.getTransaction().commit();
							session.close();
						}else{
							flag = "0";
						}
					} 
				}
			}	 
		} catch(BusinessException ex) {
			 flag = "0";
			 log.debug(Constant.getTrace(ex));
			 ex.printStackTrace();
		} 
	    return flag;
	}
	/**
	 * 
	* @Title: updatePcTzglMonthInvestMState
	* @Description: 修改报表状态
	* @param uids
	* @param backUser
	* @param unitname
	* @param reason
	* @param fromUnit
	* @param state
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-18
	 */
	public String updatePcTzglMonthInvestMState(String uids,String backUser,String unitname,String reason,String fromUnit,long state){
		String flag = "1";
		String op="";
		if(state==2)op="退回";
		if(state==3)op="审核通过";
		try{
			PcTzglMonthInvestM monthInvestM = (PcTzglMonthInvestM) tzglDAO.findById(PcTzglMonthInvestM.class.getName(), uids);
			if(monthInvestM!=null){
				//退回原因
				PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(monthInvestM.getPid(), monthInvestM.getUids(),
							backUser, unitname, op, reason, "投资完成情况报表"+op);
				long oldState = monthInvestM.getReportStatus();
				
				monthInvestM.setReportStatus(state);
				
				Session session =HibernateSessionFactory.getSession();
				session.beginTransaction();
				session.update(monthInvestM);
				session.save(bussBack);
				session.getTransaction().commit();
				List<Object> objList=new ArrayList<Object>();
				objList.add(monthInvestM);
				if(bussBack !=null){
					bussBack.setBusniessType(bussBack.getBusniessType()+"【集团->到项目单位】");
					session.beginTransaction();
					session.update(bussBack);
					session.getTransaction().commit();
				}
				//判断是否需要数据交互
				if(tzglDAO.findByWhere(SgccIniUnit.class.getName(), 
						"unitid = '"+monthInvestM.getPid()+"' and appUrl is not null").size()>0){//需要数据交互
					if(bussBack !=null)objList.add(bussBack);
					 PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
					 List<PcDataExchange> exchangeList=excService.getExcDataList(objList, monthInvestM.getPid(), fromUnit,null, null, "投资完成情况报表"+op);
					 Map<String,String> rtn = excService.sendExchangeData(exchangeList);
					 if(rtn.get("result").equals("success")){//发送成功
						 flag="1";
					 }else{//发送失败
						 flag="0";
					 }
				}else{//不需要数据交互
					flag="1";
				}
				if(flag.equals("0")){
					monthInvestM.setReportStatus(oldState);
					session.beginTransaction();
					session.update(monthInvestM);
					session.delete(bussBack);
					session.getTransaction().commit();
				}
				session.close();
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		
		return flag;
	}
}
