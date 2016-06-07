package com.sgepit.pcmis.jdgk.service;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.FileManagementService;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.common.hbm.PcBusniessBack;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pcmis.jdgk.dao.PCJdgkDao;
import com.sgepit.pcmis.jdgk.hbm.PcEdoProjectMonthD;
import com.sgepit.pcmis.jdgk.hbm.PcEdoProjectRate;
import com.sgepit.pcmis.jdgk.hbm.PcEdoReportInput;
import com.sgepit.pcmis.jdgk.hbm.PcJdgkMonthTask;
import com.sgepit.pcmis.jdgk.hbm.PcJdgkMonthTaskList;
import com.sgepit.pcmis.jdgk.hbm.PcJdgkWeekWork;
import com.sgepit.pcmis.jdgk.hbm.PcJdgkWeekWorkList;
import com.sgepit.pcmis.jdgk.hbm.PcProject;
import com.sgepit.pcmis.jdgk.hbm.VPcJdgkReport;
import com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanM;
import com.sgepit.pmis.gantt.Edo.util.Json;
import com.sgepit.pmis.gantt.hbm.EdoProject;

public class PCJdgkMgmImpl extends BaseMgmImpl implements PCJdgkMgmFacade {
	Log log = LogFactory.getLog(PCJdgkMgmImpl.class);
	
	public PCJdgkDao pcJdgkDao;

	public PCJdgkDao getPcJdgkDao() {
		return pcJdgkDao;
	}

	public void setPcJdgkDao(PCJdgkDao pcJdgkDao) {
		this.pcJdgkDao = pcJdgkDao;
	}

	/**
	 * 查询出项目的进度相关信息
	 * @author zhangh
	 * @createDate 2011-6-9
	 */
	public List getProjectInfo(String orderBy, Integer start, Integer limit,
			HashMap<String, String> params) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			List list = new ArrayList();
			String unitid = params.get("unitid") == null ? "" : params.get("unitid").toString();
			String projName = params.get("projName") == null ? "" : params.get("projName").toString();
	
			SystemMgmFacade sysMgm = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
			List listSgcc = sysMgm.getPidsByUnitid(unitid);
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < listSgcc.size(); i++) {
				SgccIniUnit sgcc = (SgccIniUnit) listSgcc.get(i);
				sb.append("'" + sgcc.getUnitid() + "'");
				if (i < listSgcc.size() - 1) {
					sb.append(",");
				}
			}
			
			String sql = "select " +
		       		"p.uids,p.pid,p.industry_type,p.build_nature,p.prj_stage,p.prj_type,p.prj_name,p.prj_respond,p.invest_scale, " +
		       		"p.build_limit,p.fund_src,p.prj_address,p.prj_summary,p.memo,p.memo_c1,p.memo_c2, " +
					"nvl((select t.PERCENTCOMPLETE_ from edo_project e1,edo_task t where e1.uid_ = t.projectuid_  and e1.name_='一级网络计划' and t.id_='1' and  e1.pid = p.pid),0) yi_percent," +
					"nvl((select uid_ from edo_project e1 where e1.pid = p.pid and e1.name_='里程碑计划'),0) li_uid," +
					"nvl((select uid_ from edo_project e1 where e1.pid = p.pid and e1.name_='一级网络计划'),0) yi_uid, " +
					"(select t.start_ from edo_task t where t.id_='1' and  t.projectuid_ = (select uid_  from edo_project e1  where e1.pid = p.pid and e1.name_ = '里程碑计划')) build_start_date, " +
					"(select t.finish_ from edo_task t where t.id_='1' and  t.projectuid_ = (select uid_  from edo_project e1  where e1.pid = p.pid and e1.name_ = '里程碑计划')) build_end_date " +
					"from Pc_Zhxx_Prj_Info p where 1=1 ";
			
			if (sb.toString() != null && !sb.toString().equals("")) {
				sql += " and p.pid in ( " + sb.toString() + ")";
			}
			
			if (projName != null && (!projName.equals(""))) {
				sql += " and p.prj_name like '%" + projName + "%'";
			}
			
			if (orderBy != null && !orderBy.trim().equals("")) {
				sql += " order by " + orderBy;
			}else{
				sql += " order by p.pid";
			}
			
			if(start != null && limit != null){
				
			}
			
			//String pageSql = "select * from ("+sql+") temp where temp.r>"+start+" and temp.r<="+(start+limit);
			String pageSql =  sql;
			System.out.println("pageSql:"+pageSql);
			String sqlCount = "select count(*) num from ("+sql+")";
			
			List<Map<String, Object>> listCount = JdbcUtil.query(sqlCount);
			Integer size =0 ;
			if(listCount.size()>0){
				size = Integer.parseInt(listCount.get(0).get("num").toString());
			}
			
			List<Map<String, Object>> listMap = JdbcUtil.query(pageSql);
			for (Map<String, Object> map : listMap) {
				PcProject pro = new PcProject();
				if(map.get("build_start_date")!=null)
				pro.setBuildStartDate(sdf.parse(map.get("build_start_date").toString()));
				if(map.get("build_end_date")!=null)
				pro.setBuildEndDate(sdf.parse(map.get("build_end_date").toString()));
				pro.setPid(map.get("pid").toString());
				pro.setYiPercent(Long.valueOf(map.get("yi_percent").toString()));
				pro.setYiUid(map.get("yi_uid").toString());
				pro.setLiUid(map.get("li_uid").toString());
				list.add(pro);
			}
			list.add(size);
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	/**
	 * 判断是否存在“里程碑计划”和“一级网络计划”，存在则跳过，不存在自动初始化
	 * @param pid 工程项目编号
	 * @param plan 值为li或yi，区分里程碑计划和一级网络计划
	 * @param projectuid 项目计划编号
	 * @return String 不存在，返回新增的最新编号；存在，返回当前计划编号
	 * @author zhangh
	 * @createDate 2010-6-9
	 */
	public String isHaveProjectPlan(String pid,String plan){
		try {

				String beanName = EdoProject.class.getName();
				String planName = "里程碑计划";
				EdoProject newPro = new EdoProject();
				if(plan.equals("yi"))planName = "一级网络计划";
				String where = "pid='"+pid+"' and name_='"+planName+"'";
				List<EdoProject> list = this.pcJdgkDao.findByWhere(beanName, where);
				if(list.size()==0){
					String sql = "select app_url from sgcc_ini_unit where unitid = '"+pid+"'";
					List list_app_url = JdbcUtil.query(sql);
					Map mapUrl = (Map) list_app_url.get(0);
					
					String deployType = Constant.propsMap.get("DEPLOY_UNITTYPE")==null?"0":Constant.propsMap.get("DEPLOY_UNITTYPE").toString();
					if(deployType.equals("A")||mapUrl.get("APP_URL")==null){//单独部署项目单位时需要初始化
						newPro.setName(planName);
						newPro.setPid(pid);
						newPro.setStartdate(new Date());
						newPro.setFinishdate(new Date());
						newPro.setCreationdate(new Date());
						newPro.setLastsaved(new Date());
						newPro.setCalendaruid("1");
						newPro.setWeekstartday(Long.valueOf("480"));
						newPro.setDefaultstarttime("8");
						newPro.setDefaultfinishtime("17");
						newPro.setMinutesperday(Long.valueOf("480"));
						newPro.setMinutesperweek(Long.valueOf("2400"));
						newPro.setDayspermonth(Long.valueOf("20"));
						this.pcJdgkDao.insert(newPro);
					}else{
						//已经部署系统的项目单位，不在进度管控中初始化，须在工程管理中自动初始化，并提交交互数据。
						return null;
					}
				}else{
					newPro = list.get(0);
				}
				return newPro.getUid();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	

	public Map<String,String> getQuaProjectSheduleByPid(String pid){
		String sql = "select t.PERCENTCOMPLETE_ from edo_project e1,edo_task t where e1.uid_ = t.projectuid_  and e1.name_='一级网络计划' and t.id_='1' and  e1.pid = '"+pid+"' ";
		List<Map> list = JdbcUtil.query(sql);
		String rate = "0";
		if (list.size()>0) rate = list.get(0).get("PERCENTCOMPLETE_").toString();
		Double d = Double.parseDouble(rate);
		Map map = new HashMap<String,String>();
		map.put("propercentage", String.valueOf(d/100));
		return map;
	};
	
	
	/**
	 * 进度管控甘特图的数据交互。
	 */
	@SuppressWarnings("unchecked")
	public boolean pcJdgkExchangeDataToQueue(String projectJosn, String projectUid, String pid){
		try {
			//优先判断，只有里程碑计划和一级网络计划才进行数据交换
			//String where = "uid='"+projectUid+"' and name in ('里程碑计划','一级网络计划')";
			EdoProject edoPrj = (EdoProject) this.pcJdgkDao.findById("com.sgepit.pmis.gantt.hbm.EdoProject", projectUid);
			String type = "";
			if(edoPrj == null||edoPrj.getName()==null){
				return false;
			}else{
				type = edoPrj.getName();
				if(!(type.equals("里程碑计划"))&&!(type.equals("一级网络计划"))){
					return false;
				}
			}
			
			PcDynamicData  pdd = new PcDynamicData();
			pdd.setPcdynamicdate(new Date());
			pdd.setPctablebean(EdoProject.class.getName());
			pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(EdoProject.class.getName()));
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
			pdd.setPctableuids(edoPrj.getUid());
			pdd.setPcurl(type.equals("里程碑计划")?DynamicDataUtil.SCHEDULE_LICHENGBEI_URL:DynamicDataUtil.SCHEDULE_YIJIWANGLUO_URL);
			pdd.setPid(edoPrj.getPid());
			pcJdgkDao.insert(pdd);
			
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
				
				Map proMap = (Map)Json.decode(projectJosn);
				//处理前置sql语句，主要执行删除已有数据
				StringBuilder sqlBefore = new StringBuilder();
				//删除EDO_PROJECT（要确保UID_相同）
				sqlBefore.append("delete from EDO_PROJECT where pid = '"+pid+"' and name_ ='"+type+"';");

				//删除edo_resource
				sqlBefore.append("delete from edo_resource where ProjectUID_ = '"+projectUid+"' ;");
				//删除edo_calendar
				sqlBefore.append("delete from edo_calendar where ProjectUID_ = '"+projectUid+"' ;");
				//删除WeekDay
				sqlBefore.append("delete from edo_weekday where ProjectUID_ = '"+projectUid+"' ;");
				//删除任务自身
				sqlBefore.append("delete from edo_task where ProjectUID_ = '"+projectUid+"' ;");
				//删除比较基准(根据项目UID和任务UID)
				sqlBefore.append("delete from edo_baseline where ProjectUID_ = '"+projectUid+"' ;");
				//删除资源分配关系(根据项目UID和任务UID)
				sqlBefore.append("delete from edo_assignment where ProjectUID_ = '"+projectUid+"' ;");
				//删除任务相关性((根据项目UID和任务UID) 
				sqlBefore.append("delete from edo_predecessorLink where ProjectUID_ = '"+projectUid+"' ");
				//System.out.println("sqlBefore >>> "+sqlBefore.toString());
				
				List<PcDataExchange> allDataList = new ArrayList<PcDataExchange>();
				String bizInfo = type+"【"+pid+"】";//业务说明
				//获取PCDataExchangeService实例
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				//0.需要报送表Edo_Project（一级网路计划和里程碑杯计划两条记录）
				PcDataExchange edoExc = dataExchangeService.getExcData(edoPrj, Constant.DefaultOrgRootID, pid, sqlBefore.toString(), null, bizInfo);
				//增加进度动态数据展示
				PcDataExchange pddDy=dataExchangeService.getExcData(pdd, Constant.DefaultOrgRootID, pid, "", null, "动态数据报送");
				//序号
				Long xh = edoExc.getXh()+1;
				//事物编号
				String curTxGroup = edoExc.getTxGroup();
				allDataList.add(edoExc);
				allDataList.add(pddDy);
				//1.处理EDO_RESOURCE（资源表）表数据交互
				List resources = (List)proMap.get("Resources");
				if(resources != null && resources.size()>0){
					for(int i=0,l=resources.size(); i<l; i++){
						Map edo_resource = (Map) resources.get(i);
						PcDataExchange exchange = new PcDataExchange();
						//设置表名
						exchange.setTableName("EDO_RESOURCE");
						//设置主键
						JSONArray kvarr = new JSONArray();
						JSONObject kv = new JSONObject();
						kv.put("UID_", edo_resource.get("UID"));
						kvarr.add(kv);
						kv = new JSONObject();
						kv.put("PROJECTUID_", projectUid);
						kvarr.add(kv);
						exchange.setKeyValue(kvarr.toString());
						//手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
						exchange.setXh(xh++);
						exchange.setPid(Constant.DefaultOrgRootID);
						exchange.setTxGroup(curTxGroup);
						exchange.setSuccessFlag("0");
						exchange.setSpareC5(pid);//发送单位
						exchange.setBizInfo(bizInfo);//业务说明
						//加入队列list
						allDataList.add(exchange);
					}
				}
				
				//2.任务,任务相关性,基准,资源分配关系
				List tasks = (List)proMap.get("Tasks");
				if(tasks != null && tasks.size()>0){				     					
					for(int i=0,l=tasks.size(); i<l; i++){
						Map edo_task = (Map) tasks.get(i);
						PcDataExchange exchange = new PcDataExchange();
						//获取任务编号，解决baseline中取不到任务编号的问题
						Object task_uid_obj = edo_task.get("UID");
						//设置表名
						exchange.setTableName("EDO_TASK");
						//设置主键
						JSONArray kvarr = new JSONArray();
						JSONObject kv = new JSONObject();
						kv.put("UID_", edo_task.get("UID"));
						kvarr.add(kv);
						kv = new JSONObject();
						kv.put("PROJECTUID_", projectUid);
						kvarr.add(kv);
						exchange.setKeyValue(kvarr.toString());
						//手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
						exchange.setXh(xh);
						exchange.setPid(Constant.DefaultOrgRootID);
						exchange.setTxGroup(curTxGroup);
						exchange.setSuccessFlag("0");
						exchange.setSpareC5(pid);//发送单位
						exchange.setBizInfo(bizInfo);//业务说明
						//加入队列list
						allDataList.add(exchange);
						xh +=1;
						
						//处理任务相关性开始
						List links = (List)edo_task.get("PredecessorLink");
						if(links != null && links.size()>0){
							for(int m=0,n=links.size(); m<n; m++){
								Map edo_link = (Map) links.get(m);
								PcDataExchange exchangeLink = new PcDataExchange();
								//设置表名
								exchangeLink.setTableName("EDO_PREDECESSORLINK");
								//设置主键
								JSONArray kvarr_link = new JSONArray();
								JSONObject kv_link = new JSONObject();
								kv_link.put("PREDECESSORUID_", edo_link.get("PredecessorUID"));
								kvarr_link.add(kv_link);
								kv_link = new JSONObject();
								kv_link.put("TASKUID_", edo_link.get("TaskUID"));
								kvarr_link.add(kv_link);
								kv_link = new JSONObject();
								kv_link.put("PROJECTUID_", projectUid);
								kvarr_link.add(kv_link);
								exchangeLink.setKeyValue(kvarr_link.toString());
								//手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
								exchangeLink.setXh(xh);
								exchangeLink.setPid(Constant.DefaultOrgRootID);
								exchangeLink.setTxGroup(curTxGroup);
								exchangeLink.setSuccessFlag("0");
								exchangeLink.setSpareC5(pid);//发送单位
								exchangeLink.setBizInfo(bizInfo);//业务说明
								//加入队列list
								allDataList.add(exchangeLink);
								xh +=1;
							}			
						}
						//处理任务相关性结束
						
						//处理比较基准开始
						List lines = (List)edo_task.get("Baseline");
						if(lines != null && lines.size()>0){
							for(int m=0,n=lines.size(); m<n; m++){
								Map edo_line = (Map) lines.get(m);
								PcDataExchange exchangeLine = new PcDataExchange();
								//设置表名
								exchangeLine.setTableName("EDO_BASELINE");
								//设置主键
								JSONArray kvarr_line = new JSONArray();
								JSONObject kv_line = new JSONObject();
								kv_line.put("TASKUID_", edo_line.get("TaskUID")==null ? task_uid_obj : edo_line.get("TaskUID"));
								kvarr_line.add(kv_line);
								kv_line = new JSONObject();
								kv_line.put("PROJECTUID_", projectUid);
								kvarr_line.add(kv_line);
								exchangeLine.setKeyValue(kvarr_line.toString());
								//手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
								exchangeLine.setXh(xh);
								exchangeLine.setPid(Constant.DefaultOrgRootID);
								exchangeLine.setTxGroup(curTxGroup);
								exchangeLine.setSuccessFlag("0");
								exchangeLine.setSpareC5(pid);//发送单位
								exchangeLine.setBizInfo(bizInfo);//业务说明
								//加入队列list
								allDataList.add(exchangeLine);
								xh +=1;
							}			
						}
						//处理比较基准结束
						
						//处理资源分配开始
						List assignments = (List)edo_task.get("Assignments");
						if(assignments != null && assignments.size()>0){
							for(int m=0,n=assignments.size(); m<n; m++){
								Map edo_assignment = (Map) assignments.get(m);
								PcDataExchange exchangeAssignment = new PcDataExchange();
								//设置表名
								exchangeAssignment.setTableName("EDO_ASSIGNMENT");
								//设置主键
								JSONArray kvarr_assignment = new JSONArray();
								JSONObject kv_assignment = new JSONObject();
								kv_assignment.put("TASKUID_", edo_assignment.get("TaskUID"));
								kvarr_assignment.add(kv_assignment);
								kv_assignment = new JSONObject();
								kv_assignment.put("RESOURCEUID_", edo_assignment.get("ResourceUID"));
								kvarr_assignment.add(kv_assignment);
								kv_assignment = new JSONObject();
								kv_assignment.put("PROJECTUID_", projectUid);
								kvarr_assignment.add(kv_assignment);
								exchangeAssignment.setKeyValue(kvarr_assignment.toString());
								//手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
								exchangeAssignment.setXh(xh);
								exchangeAssignment.setPid(Constant.DefaultOrgRootID);
								exchangeAssignment.setTxGroup(curTxGroup);
								exchangeAssignment.setSuccessFlag("0");
								exchangeAssignment.setSpareC5(pid);//发送单位
								exchangeAssignment.setBizInfo(bizInfo);//业务说明
								//加入队列list
								allDataList.add(exchangeAssignment);
								xh +=1;
							}			
						}
						//处理资源分配结束
					}
				}
				
				
				//新增日历
				List calendars = (List)proMap.get("Calendars");
				if(calendars != null && calendars.size()>0){
					for(int i=0,l=calendars.size(); i<l; i++){
						Map edo_calendar = (Map) calendars.get(i);
						PcDataExchange exchange = new PcDataExchange();
						//设置表名
						exchange.setTableName("EDO_CALENDAR");
						//设置主键
						JSONArray kvarr = new JSONArray();
						JSONObject kv = new JSONObject();
						kv.put("UID_", edo_calendar.get("UID"));
						kvarr.add(kv);
						kv = new JSONObject();
						kv.put("PROJECTUID_", projectUid);
						kvarr.add(kv);
						exchange.setKeyValue(kvarr.toString());
						//手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
						exchange.setXh(xh);
						exchange.setPid(Constant.DefaultOrgRootID);
						exchange.setTxGroup(curTxGroup);
						exchange.setSuccessFlag("0");
						exchange.setSpareC5(pid);//发送单位
						exchange.setBizInfo(bizInfo);//业务说明
						//加入队列list
						allDataList.add(exchange);
						xh +=1;
						//日历表处理完成
						
						//开始处理工作日
						List weekdays = (List)edo_calendar.get("WeekDays");
						if(weekdays != null && weekdays.size()>0){
							for(int m=0,n=weekdays.size(); m<n; m++){
								Map edo_weekday = (Map) weekdays.get(m);
								//无主键，拼接sql，对应PC_DATA_EXCHANGE中的SQL_DATA
								PcDataExchange exchangeWeekday = new PcDataExchange();
								exchangeWeekday.setTableName("EDO_WEEKDAY");
								exchangeWeekday.setXh(xh);
								exchangeWeekday.setPid(Constant.DefaultOrgRootID);
								exchangeWeekday.setTxGroup(curTxGroup);
								exchangeWeekday.setSuccessFlag("0");
								exchangeWeekday.setKeyValue(projectUid+"-"+(xh++));
								exchangeWeekday.setSpareC5(pid);//发送单位
								exchangeWeekday.setBizInfo(bizInfo);//业务说明
								//开始创建insert语句
								String sql_data = "insert into edo_weekday ";
								//生成时间的插入语句
								String Working_column = "";
								String Working_values = "";
								
								List wts = (List)edo_weekday.get("WorkingTimes");
								
								Date fromDate = new Date();
								if(edo_weekday.get("TimePeriodFromDateTime")!=null){
									fromDate.setTime((Long)edo_weekday.get("TimePeriodFromDateTime"));
								}
								
								Date toDate = new Date();
								if(edo_weekday.get("TimePeriodToDateTime")!=null)
									toDate.setTime((Long)edo_weekday.get("TimePeriodToDateTime"));
								
								String col_Name = edo_weekday.get("Name")==null?"":(String)edo_weekday.get("Name");
								String col_FromDate = edo_weekday.get("TimePeriodFromDateTime")==null?"":sdf.format(fromDate);
								String col_ToDate = edo_weekday.get("TimePeriodToDateTime")==null?"":sdf.format(toDate);
								
								if(wts != null && wts.size()>0){
									int len = wts.size();
									for (int in = 0; in < 9; in++){
							        	int index = in + 1; 
							            String fromtime = "";
							            String totime = "";
							            if (len > in){
							            	Map wt = (Map)wts.get(in);
							                fromtime = wt.get("FromTime")==null?"":(String)wt.get("FromTime");
							                totime = wt.get("ToTime")==null?"":(String)wt.get("ToTime");
							            }
							            Working_column += "WorkingTimeFromTime"+index+"_ , WorkingTimeToTime"+index+"_ ,";
							            Working_values += " '"+fromtime+"' , '"+totime+"' ,";
							        }
								
									Working_column = Working_column.substring(0, Working_column.length()-1); 
									Working_values = Working_values.substring(0, Working_values.length()-1);
									
									
									String sql_column = " (DayType_,DayWorking_,ProjectUID_,CalendarUID_,Name_,TimePeriodFromDate_,TimePeriodToDate_,"+Working_column+")";
									String sql_values = " VALUES("+edo_weekday.get("DayType")+", "+edo_weekday.get("DayWorking")+"," +
														" '"+projectUid+"', '"+edo_calendar.get("UID")+"', " +
														" '"+col_Name+"'," +
														" to_date('"+col_FromDate+"','yyyymmddhh24miss'), " +
														" to_date('"+col_ToDate+"','yyyymmddhh24miss'), " +
														" "+Working_values+")";
									
									sql_data = sql_data + sql_column + sql_values;
								}else{
									String sql_column = " (DayType_,DayWorking_,ProjectUID_,CalendarUID_,Name_,TimePeriodFromDate_,TimePeriodToDate_)";
									String sql_values = " VALUES("+edo_weekday.get("DayType")+", "+edo_weekday.get("DayWorking")+"," +
														" '"+projectUid+"', '"+edo_calendar.get("UID")+"', " +
														" '"+col_Name+"'," +
														" to_date('"+col_FromDate+"','yyyymmddhh24miss'), " +
														" to_date('"+col_ToDate+"','yyyymmddhh24miss'))";
									sql_data = sql_data + sql_column + sql_values;
									//结束创建insert语句
								}
								exchangeWeekday.setSqlData(sql_data);
								//加入队列list
								allDataList.add(exchangeWeekday);
							}
						}
						//处理工作日结束
					}
				}
				//单独处理pc_data_exchange中EDO_WEEKDAY的数据
				String delSql = "delete from pc_data_exchange where pid='"+pid+"' and table_name = 'EDO_WEEKDAY' and key_value like '"+projectUid+"%'";
				JdbcUtil.execute(delSql);
				//无映射文件的表直接存入队列。
				dataExchangeService.addExchangeListToQueue(allDataList);
				//直接发送
				//dataExchangeService.sendExchangeData(allDataList);
				return true;
			}else{
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	/**
	 * @param rootPid
	 * @param sjType
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private List<ColumnTreeNode> getUnitYearPlanReportTree(String rootPid, String sjType){
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
	
	//得到当前用户管辖所有项目
	SystemMgmFacade systemMgm=(SystemMgmFacade)Constant.wact.getBean("systemMgm");
	   List<SgccIniUnit> unitList=(List<SgccIniUnit>)systemMgm.getPidsByUnitid(rootPid);
	String sqlWhere = " pid = '%s' and sjType = '%s' and issueStatus = '1'";
	for (SgccIniUnit unit : unitList) {
		
		
		List<PcTzglYearPlanM> tempList = pcJdgkDao.findByWhere(PcTzglYearPlanM.class.getName(), String.format(sqlWhere, unit.getUnitid(), sjType));
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
	 * @param rootPid
	 * @param sjType
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private List<ColumnTreeNode> getUnitMonthReportTree(String rootPid, String sjType){
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
		
		//得到当前用户管辖所有项目
		SystemMgmFacade systemMgm=(SystemMgmFacade)Constant.wact.getBean("systemMgm");
		   List<SgccIniUnit> unitList=(List<SgccIniUnit>)systemMgm.getPidsByUnitid(rootPid);
		String sqlWhere = " pid = '%s' and sjType = '%s' and state = '1'";
		for (SgccIniUnit unit : unitList) {
			//找到该项目当月报表上报情况
			
			List<PcEdoReportInput> tempList = pcJdgkDao.findByWhere(PcEdoReportInput.class.getName(), String.format(sqlWhere, unit.getUnitid(), sjType));
			PcEdoReportInput mainReport;
			if ( tempList.size() > 0 ){
				mainReport = tempList.get(0);
			}
			else{
				mainReport = new PcEdoReportInput();
				mainReport.setPid(unit.getUnitid());
				mainReport.setState("0");
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
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 */
	@SuppressWarnings("unchecked")
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
		}
		else if (treeName.equalsIgnoreCase("getEdoTask")) {
			String projectuid = ((String[])params.get("projectuid"))[0];
			String treeid = ((String[])params.get("treeid"))[0];
			list = getEdoTask(parentId, pid, projectuid,treeid);
			return list;
		}
		
		return list;
	}
	
	
	/**
	 * 
	 * 实现将进度管控的信息通过数据交互传递给集团二级公司
	 * @param unitid String   数据交互目的公司编号
	 * @param uids String  输入进度信息唯一标识 
	 * 
	 * 标注(liangwj,2011-09-22):
	 * 数据交互的条件：
	 * 集团->项目单位：需要判断项目单位的远程地址是否存在(也就是sgcc_ini_unit表中字段app_url是否存在)
	 * 项目单位->集团：需要判断系统资源文件中系统的部署模式(system.properties中DEPLOY_UNITTYPE的属性值)，如果DEPLOY_UNITTYPE=0表示项目单位和集团公司、
	 *                二级企业、三级企业子同一系统中，此时不需要进行数据交互；如果DEPLOY_UNITTYPE=A表示项目单位单独部署，此时需要数据交互。
 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public String submitReport(String uids, String toUnit, String fromUnit, String opUser)
	{
		String flag = "1";
		try{
			PcEdoReportInput edoHbm = (PcEdoReportInput)pcJdgkDao.findById(PcEdoReportInput.class.getName(), uids);
			//判断能不能进行数据交互
			if(edoHbm==null)
			{ 	 
				return "0";
			} 	 
			else
			{
				String opUnitName = "	";
				SgccIniUnit unit = (SgccIniUnit) pcJdgkDao.findBeanByProperty(SgccIniUnit.class.getName(), "unitid", edoHbm.getPid());
				if(unit!=null) opUnitName=unit.getUnitname();
				
				//动态数据
				PcDynamicData dyda=new PcDynamicData();
				dyda.setPid(edoHbm.getPid());
				dyda.setPctablebean(PcEdoReportInput.class.getName());
				dyda.setPctablename("V_PC_JDGK_REPORT");
				dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
				dyda.setPctableuids(edoHbm.getUids());
				dyda.setPcdynamicdate(new Date());
				dyda.setPcurl(DynamicDataUtil.SCHEDULE_PROGRESS_URL);
				
				Session session =pcJdgkDao.getSessionFactory().openSession();
				session.beginTransaction();
				
				
				//查询此项目单位对应的二级企业，插入二级企业记录，便于二级企业上报到集团(需要二级企业的主记录)
				List lt = pcJdgkDao.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
				 		"connect by prior t.upunit = t.unitid start with t.unitid='"+edoHbm.getPid()+"' ");
				String master2Rec = "";//二级企业主记录，如果没有主记录则新增一条
				if(lt.size()>0){
					Object[] obj = (Object[]) lt.get(0);
					String reportname = ((String) obj[1])+edoHbm.getSjType().substring(0, 4)+"年"+edoHbm.getSjType().substring(4, 6)+"月进度情况月度报表";
					master2Rec = "merge into pc_edo_report_input tab1 using (select '"+((String) obj[0])+"' as pid," +
					 		"'"+SnUtil.getNewID()+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, '0' as state," +
					 		"'"+edoHbm.getSjType()+"' as sj_type,'"+opUser+"' as createperson from dual ) tab2 " +
					 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
					 		"insert (pid,uids,createdate,reportname,state,sj_type,createperson) values (tab2.pid,tab2.uids," +
					 		"tab2.createdate,tab2.reportname,tab2.state,tab2.sj_type,tab2.createperson) when matched then update set tab1.memo=tab1.memo";
				}
				 //判断是否有必要进行数据交互
				SgccIniUnit unitHbm = (SgccIniUnit)this.pcJdgkDao.findBeanByProperty(SgccIniUnit.class.getName(),"unitid", toUnit);
				String deployType =  Constant.propsMap.get("DEPLOY_UNITTYPE");
				
				if(deployType.toString().equals("A") && (unitHbm!=null) && (unitHbm.getAppUrl()!=null))
				{
					//满足执行数据交互的条件, 执行下面的方法
					List jdList = pcJdgkDao.findByWhere(PcEdoProjectMonthD.class.getName(),	
							"unit_id='"+edoHbm.getPid()+"' and sj_type = '"+edoHbm.getSjType()+"'");
					
					session.save(dyda);
					session.getTransaction().commit();
					session.close();
					
					List allDataList = new ArrayList();
					allDataList.add(edoHbm);      
					allDataList.addAll(jdList);  
					allDataList.add(dyda);
					
					String afterSql = master2Rec;
					if (master2Rec.length()>0) 		afterSql += ";";
					afterSql += "update pc_edo_report_input set state='1' where uids ='" + edoHbm.getUids() + "';";
					afterSql += "insert into pc_busniess_back (uids,pid,busniess_id,back_user,back_date,busniess_type,spare_c1,spare_c2,back_reason) " +
					  			"values ('"+SnUtil.getNewID()+"','"+edoHbm.getPid()+"','"+edoHbm.getUids()+"','"+opUser+"'," +
					  					"sysdate,'上报','上报','"+opUnitName+"',' ')";
					
					PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
					
					List<PcDataExchange> excList = 
						 		excService.getExcDataList(allDataList, toUnit, fromUnit, null, afterSql, "项目单位进度月报报送");
					Map<String, String> retVal = excService.sendExchangeData(excList);
					
					String result = retVal.get("result");
					 
					if(result.equalsIgnoreCase("success"))
					{
						edoHbm.setState("1");
						pcJdgkDao.saveOrUpdate(edoHbm);
					}
					else
					{
						flag = "0";
					}
				}else{//不需要进行数据交互，直接修改报送状态
					if(master2Rec.equals("")){
						 edoHbm.setState("1");
						 pcJdgkDao.saveOrUpdate(edoHbm);
						 
						 session.save(dyda);
						 session.getTransaction().commit();
						 session.close();
					}else{
						int len = pcJdgkDao.updateBySQL(master2Rec);
						if(len==1){
							 edoHbm.setState("1");
							 pcJdgkDao.saveOrUpdate(edoHbm);

							 session.save(dyda);
							 session.getTransaction().commit();
							 session.close();
						}else{
							flag = "0";
						}
					} 
				}
				
				if(flag.equals("1")){//添加上报日志
					String log = "insert into pc_busniess_back (uids,pid,busniess_id,back_user,back_date,busniess_type,spare_c1,spare_c2,back_reason) " +
			  			"values ('"+SnUtil.getNewID()+"','"+edoHbm.getPid()+"','"+edoHbm.getUids()+"','"+opUser+"',sysdate,'上报','上报','"+opUnitName+"',' ')";
					pcJdgkDao.updateBySQL(log);
				}
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
	
	//删除某月的进度信息
	public void deleteRate(String unitid, String sjType)
	{
		List<PcEdoProjectRate> rateList = new ArrayList<PcEdoProjectRate>();
		rateList = pcJdgkDao.findByWhere("com.sgepit.pcmis.jdgk.hbm.PcEdoProjectRate", 
														"unit_id="+unitid+"and sj_type="+sjType);
		pcJdgkDao.deleteAll(rateList);
	}
	/**
	 * 进度月报退回
	 * @param uids
	 * @param reason
	 * @param backUser
	 * @param backUnitId
	 * @return
	 */
	public String sendBackJdgkReport(String uids, String reason, String backUser, String backUnitId) {
		String flag = "1";
		try{
			VPcJdgkReport reportHbm = (VPcJdgkReport) pcJdgkDao.findById(VPcJdgkReport.class.getName(), uids);
			log.debug("【进度报表退回】退回人："+backUser+",退回原因："+reason);
			if(reportHbm!=null){
				PcEdoReportInput reportHbm1 = (PcEdoReportInput) pcJdgkDao.findById(PcEdoReportInput.class.getName(), uids);
				//退回原因
				PcBusniessBack backHbm = new PcBusniessBack();
				backHbm.setBackDate(new Date());
				backHbm.setBackReason(reason);
				backHbm.setBackUser(backUser);
				backHbm.setBusniessId(uids);
				backHbm.setPid(reportHbm.getPid());
				
				String unitTypeId = reportHbm.getUnitTypeId();
				if(unitTypeId.equals("2")){//由集团退回到二级企业，不需要数据交互，直接修改状态
					reportHbm1.setState("2");
					backHbm.setBusniessType("进度报表退回<集团退回到二级企业>");
					
					pcJdgkDao.saveOrUpdate(reportHbm1);
					pcJdgkDao.insert(backHbm);
				}else if(unitTypeId.equals("A")){//由二级企业退回到项目单位
					backHbm.setBusniessType("进度报表退回<二级企业退回到项目单位>");
					//判断是否需要数据交互
					String pid = reportHbm1.getPid();
					if(pcJdgkDao.findByWhere(SgccIniUnit.class.getName(), 
							"unitid = '"+pid+"' and appUrl is not null").size()>0){//需要数据交互
						 PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
						 PcDataExchange exHbm = excService.getExcData(backHbm, pid, backUnitId, null, null, backHbm.getBusniessType());
						 
						 SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
						 
						 String beforeSql = "merge into pc_busniess_back tab1 using (select '"+SnUtil.getNewID()+"' as uids,'"+backUnitId+"' as pid," +
						 		"'"+uids+"' as busniess_id,'"+backUser+"' as back_user, " +
						 		"to_date('"+sdf.format(backHbm.getBackDate())+"', 'yyyymmddhh24miss') as back_date, " +
						 		"'"+reason+"' as back_reason, '进度报表退回<二级企业退回到项目单位>' as busniess_type from dual) tab2 " +
						 		"on (tab1.uids=tab2.uids) when matched then update set tab1.back_user=tab2.back_user, tab1.back_date=tab2.back_date," +
						 		"tab1.back_reason=tab2.back_reason when not matched then insert (uids,pid,busniess_id,back_user,back_date,back_reason,busniess_type) " +
						 		"values (tab2.uids,tab2.pid,tab2.busniess_id,tab2.back_user,tab2.back_date,tab2.back_reason,tab2.busniess_type)";
						 String updateSql = "update PC_EDO_REPORT_INPUT set state='2' where sj_type = '"+reportHbm1.getSjType()+"' and pid = '"+pid+"'";
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
							 pcJdgkDao.delete(backHbm);
							 flag = "0";
						 }
					}else{//不需要数据交互
						 reportHbm1.setState("2");
						 pcJdgkDao.saveOrUpdate(reportHbm1);
						 pcJdgkDao.insert(backHbm);
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
	 * 构造XXX项目XXX月进度任务分析列表树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @author zhangh 2014-03-06
	 */
	@SuppressWarnings({"unchecked", "rawtypes"})
	public List<ColumnTreeNode> getPcJdgkMonthTaskList(String orderBy,
			Integer start, Integer limit, HashMap map) {
		List<PcJdgkMonthTaskList> list = new ArrayList();
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		String parentid = (String) map.get("parentid");
		String masterid = (String) map.get("masterid");
		String sjType = (String) map.get("sjType");
		// 拼装一般查询语句
		if("0".equals(pid)&&"0".equals(masterid)){
			//pid和masterid都为0的时候，进行汇总查询
			list = pcJdgkDao.findByWhere(PcJdgkMonthTaskList.class.getName(),
					"treeid like '%-"+sjType+"%' and parentid='" + parentid + "'", "treeid");
		}else{
			list = pcJdgkDao.findByWhere(PcJdgkMonthTaskList.class.getName(),
					"pid = '" + pid + "' and parentid='" + parentid
							+ "' and masterid = '" + masterid + "'", "treeid");
		}
		
		List newList = DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	
	
	/**
	 * 针对新增的月度任务进行明细初始化
	 * @param pid
	 * @param insertUids
	 * @author zhangh 2014-03-06
	 */
	public void initMonthTaskList(String pid, String pname, String idsOfInsert){
		String[] taskTitle = {"本月一级网络计划完成情况","本月其他工作计划完成情况","下月一级网络计划","下月其他工作计划"};
		try {
			String[] insertUids = idsOfInsert.split(",");
			String beanName = EdoProject.class.getName();
			List<EdoProject> listPro = this.pcJdgkDao.findByWhere(beanName, 
					"pid='"+pid+"' and name_='一级网络计划'");
			if(listPro.size() == 1){
				EdoProject edoProject = listPro.get(0);
				String projectuid = edoProject.getUid();
				String sjType = "";
				for (int i = 0; i < insertUids.length; i++) {
					String uids = insertUids[i];
					PcJdgkMonthTask monthTask = (PcJdgkMonthTask) this.pcJdgkDao
							.findById(PcJdgkMonthTask.class.getName(), uids);
					sjType = monthTask.getSjType();
					monthTask.setEdoProjectUid(projectuid);
					this.pcJdgkDao.saveOrUpdate(monthTask);
					//创建项目单位根节点
					String year = "";
					String month = "";
					if(monthTask.getSjType()!=null && !"".equals(monthTask.getSjType())){
						year = monthTask.getSjType().substring(0, 4);
						String mon = monthTask.getSjType().substring(4,monthTask.getSjType().length()-1);
						if("1".equals(mon)){
							month = monthTask.getSjType().substring(4,monthTask.getSjType().length());
						}else{
							month = monthTask.getSjType().substring(5,monthTask.getSjType().length());
						}
					}
					PcJdgkMonthTaskList proTaskList = new PcJdgkMonthTaskList();
					proTaskList.setMasterid(uids);
					proTaskList.setPid(pid);
					proTaskList.setEdoProjectUid(projectuid);
					proTaskList.setTreeid(pid+"-"+sjType);
					proTaskList.setParentid("0");
					proTaskList.setIsleaf(0l);
					proTaskList.setTaskName(pname+year+"年"+month+"月工程进度任务分析");
					proTaskList.setSjType(monthTask.getSjType());
					this.pcJdgkDao.insert(proTaskList);
					
					List<Map<String,String>> totalList = this.getEdoTasksByTree(projectuid);
					//创建四个初始节点
					for (int j = 0; j < taskTitle.length; j++) {
						PcJdgkMonthTaskList monthTaskList = new PcJdgkMonthTaskList();
						monthTaskList.setMasterid(uids);
						monthTaskList.setPid(pid);
						monthTaskList.setEdoProjectUid(projectuid);
						monthTaskList.setTreeid(pid+"-"+sjType+"-0"+(j+1));
						monthTaskList.setParentid(pid+"-"+sjType);
						monthTaskList.setIsleaf(1l);
						monthTaskList.setTaskName(taskTitle[j]);
						monthTaskList.setSjType(monthTask.getSjType());
						//返回的主键
						String uuids = this.pcJdgkDao.insert(monthTaskList);
						if( j == 0){
							List<Map<String,String>> uidsList = this.getEdoTasks(projectuid, sjType);
							String result = this.mergeEdoTaskIds(totalList, uidsList);
							saveEdoTaskToMonthTask(result,uuids,sjType);
						}
						if(j == 2){
							List<Map<String,String>> uidsList = this.getNextMonthTasks(projectuid, sjType);
							String result = this.mergeEdoTaskIds(totalList, uidsList);
							saveEdoTaskToMonthTask(result,uuids,sjType);
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	
	/**
	 * 月度任务进行明细
	 * @param masterid 主记录主键，可通过主记录主键删除全部明细
	 * @param taskuids 单个明细主键
	 * @return
	 * @author zhangh 2014-03-07
	 */
	public String deleteMonthTaskList(String masterid,String taskuids){
		if(!"".equals(masterid)){
			//通过主记录主键直接删除所有明细
			this.pcJdgkDao.executeHQL("delete PcJdgkMonthTaskList as p where p.masterid='"+masterid+"'");
			return "0";
		}else{
			PcJdgkMonthTaskList task = (PcJdgkMonthTaskList) this.pcJdgkDao.findById(PcJdgkMonthTaskList.class.getName(), taskuids);
			if(task != null){
				String parentid = task.getParentid();
				this.pcJdgkDao.delete(task);
				//判断是否需要修改父节点为叶子节点
				List<PcJdgkMonthTaskList > taskList = this.pcJdgkDao.findByWhere(PcJdgkMonthTaskList.class.getName(), "parentid = '"+parentid+"'");
				if(taskList.size() == 0){
					List<PcJdgkMonthTaskList > parentTaskList = this.pcJdgkDao.findByWhere(PcJdgkMonthTaskList.class.getName(), "treeid = '"+parentid+"'");
					if(parentTaskList.size() == 1){
						PcJdgkMonthTaskList parentTask = parentTaskList.get(0);
						parentTask.setIsleaf(1l);
						this.pcJdgkDao.saveOrUpdate(parentTask);
					}
				}
				return "1";
			}else{
				return "";
			}
		}
	}
	
	
	/**
	 * @param parentId
	 * @param pid
	 * @param projectuid
	 * @author zhangh 2014-03-07
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> getEdoTask(String parentId, String pid,
			String projectuid, String treeid) {
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();

		String sql = "SELECT UID_,NAME_,TYPE_,PARENTTASKUID_ FROM EDO_TASK " +
				"where projectuid_ = '"+projectuid+"' " +
				"AND PARENTTASKUID_ = '"+parentId+"' ORDER BY id_";
		List<Map> list = JdbcUtil.query(sql);
		for (int i = 0; i < list.size(); i++) {
			Map map = list.get(i);
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			EdoTask edoTask = new EdoTask();
			Long leaf = "1".equals(map.get("TYPE_").toString()) ? 0l : 1l;
			edoTask.setIsleaf(leaf);
			n.setId(map.get("UID_").toString()); // treenode.id
			edoTask.setTreeid(n.getId());
			n.setText(map.get("NAME_").toString()); // treenode.text
			edoTask.setName(n.getText());
			edoTask.setParentid(map.get("PARENTTASKUID_").toString());
			n.setIfcheck("true");
			
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("master-task"); // treenode.cls
				n.setIconCls("icon-pkg"); // treenode.iconCls icon-pkg 文件夹样式
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(edoTask);
			List<PcJdgkMonthTaskList> list2 = this.pcJdgkDao.findByWhere(
					PcJdgkMonthTaskList.class.getName(), "treeid = '"+treeid+"-"+map.get("UID_").toString()+"'");
			if(list2.size() > 0){
				jo.put("checked", true);
				jo.put("disabled", true);
			}
			cn.setColumns(jo); // columns
			nodeList.add(cn);
		
		}
		return nodeList;
	}
	
	
	/**
	 * 从一级网络计划中选择任务
	 * @param ppks 所选的一级网络计划pid
	 * @param uids 月度任务计划明细主键
	 * @param sjType 时间期别
	 * @return
	 * @author zhangh 2014-3-8
	 */
	public String saveEdoTaskToMonthTask(String ppks, String uids,String sjType){
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String uidIn = StringUtil.transStrToIn(ppks, ",");
			String[] uidArr = StringUtil.split(ppks, ",");
			PcJdgkMonthTaskList monthTaskList = (PcJdgkMonthTaskList) this.pcJdgkDao
					.findById(PcJdgkMonthTaskList.class.getName(), uids);
			
//			String sql = "SELECT UID_,NAME_,TYPE_,PARENTTASKUID_,START_,FINISH_" +
//					" FROM EDO_TASK WHERE" +
//					" projectuid_ = '"+monthTaskList.getEdoProjectUid()+"' " +
//					" and uid_ in ("+uidIn+") ORDER BY id_";
			
			/**
			 *说明：一级网络计划开始时间、结束时间、实际开始时间、结束时间需要同步到 月底任务分析中；
			 *@time 20151119 
			 *@author tengri
			 *@bugId [8247] 
			 */
			String sql = "select t1.uid_, t1.name_, t1.type_, t1.parenttaskuid_,t2.start_  planStart, t2.finish_ planFinish," +
					" t1.start_ realstart, t1.finish_ realfinish from edo_task t1,edo_baseline t2 where t1.uid_ = t2.taskuid_(+) " +
					" and t1.projectuid_ = '"+monthTaskList.getEdoProjectUid()+"' " +
					" and t2.projectuid_= '"+monthTaskList.getEdoProjectUid()+"' and t1.uid_ in ("+uidIn+") order by t1.id_";
			
			List<Map> list = JdbcUtil.query(sql);
			for (int i = 0; i < list.size(); i++) {
				Map map = list.get(i);
				List<PcJdgkMonthTaskList> list2 = this.pcJdgkDao.findByWhere(
						PcJdgkMonthTaskList.class.getName(), "treeid = '"+monthTaskList.getTreeid()+"-"+map.get("UID_").toString()+"'");
				if(list2.size() > 0) continue;//大于0，表示该节点已经存在，不用重复添加
				
				PcJdgkMonthTaskList taskList = new PcJdgkMonthTaskList();
				taskList.setPid(monthTaskList.getPid());
				taskList.setMasterid(monthTaskList.getMasterid());
				taskList.setEdoTaskUid(map.get("UID_").toString());
				taskList.setEdoProjectUid(monthTaskList.getEdoProjectUid());
				taskList.setTaskName(map.get("NAME_").toString());
				//实际开始时间
				Date realStartTime = sdf.parse(map.get("realstart").toString());
				taskList.setRealStartTime(realStartTime);
				//实际结束时间
				Date realCompTime = sdf.parse(map.get("realfinish").toString());
				taskList.setRealCompTime(realCompTime);
				//计划开始时间
				Date planStartTime = sdf.parse(map.get("planStart").toString());
				taskList.setPlanStartTime(planStartTime);
				//计划结束时间
				Date planCompTime = sdf.parse(map.get("planFinish").toString());
				taskList.setPlanCompTime(planCompTime);
				String treeid = monthTaskList.getTreeid()+"-"+map.get("UID_").toString();
				taskList.setTreeid(treeid);
				String parentid = monthTaskList.getTreeid()+"-"+map.get("PARENTTASKUID_").toString();;
				if("1".equals(map.get("PARENTTASKUID_").toString())){
					parentid = monthTaskList.getTreeid();
				}
				taskList.setParentid(parentid);
				taskList.setIsleaf("1".equals(map.get("TYPE_").toString()) ? 0l : 1l);
				taskList.setSjType(sjType);
				this.pcJdgkDao.insert(taskList);
			}
			monthTaskList.setIsleaf(0l);
			this.pcJdgkDao.saveOrUpdate(monthTaskList);
		} catch (ParseException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "1";
	}
	
	
	
	/**
	 * 保存一级网络计划时实际时间
	 * @param taskList
	 * @return
	 * @author zhangh 2014-3-8
	 */
	public String saveTaskListRealTime(PcJdgkMonthTaskList taskList) {
		PcJdgkMonthTaskList monthTaskList = (PcJdgkMonthTaskList) this.pcJdgkDao
			.findById(PcJdgkMonthTaskList.class.getName(), taskList.getUids());
		if(monthTaskList != null){
			Date start = taskList.getRealStartTime();
			String data2 = start.toString();
			if (data2.equals("Thu Jan 01 08:00:00 CST 1970")){
				monthTaskList.setRealStartTime(null);
			}else{
				start.setHours(8);
				monthTaskList.setRealStartTime(start);
			}
			Date comp = taskList.getRealCompTime();
			String data3 = comp.toString();
			if (data3.equals("Thu Jan 01 08:00:00 CST 1970")){
				monthTaskList.setRealCompTime(null);
			}else{
				comp.setHours(17);
				monthTaskList.setRealCompTime(comp);
			}
			monthTaskList.setMemo(taskList.getMemo());
			this.pcJdgkDao.saveOrUpdate(monthTaskList);
			
			/**
			 * 说明：月度任务分析中的实际开始时间和实际结束时间修改以后，要同步到一级网络计划中
			 * @author tengri
			 * @bugid:@bugId [8247] 
			 */
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			String edoTaskUids = monthTaskList.getEdoTaskUid();
			if(null != edoTaskUids || !"".equals(edoTaskUids)){
				String sql = "update EDO_TASK t set t.start_ =  to_date('"+sdf.format(start)+"','yyyy-mm-dd hh24:mi:ss'), " +
						" t.finish_ = to_date('"+sdf.format(comp)+"','yyyy-mm-dd hh24:mi:ss') where t.uid_ = '"+edoTaskUids+"' " +
						" and t.projectuid_ = '"+monthTaskList.getEdoProjectUid()+"'";
				JdbcUtil.update(sql);
			}
		}
		return "1";
	}
	
	/**
	 * 保存任务
	 * @param taskList
	 * @return
	 * @author zhangh 2014-3-8
	 */
	public String saveTaskList(PcJdgkMonthTaskList taskList){
		
		if( taskList.getPlanStartTime()!= null){
			String data2 = taskList.getPlanStartTime().toString();
			if (data2.equals("Thu Jan 01 08:00:00 CST 1970")){
				taskList.setPlanStartTime(null);
			}
		}
		if( taskList.getPlanCompTime()!= null){
			String data2 = taskList.getPlanCompTime().toString();
			if (data2.equals("Thu Jan 01 08:00:00 CST 1970")){
				taskList.setPlanCompTime(null);
			}
		}
		if( taskList.getRealStartTime()!= null){
			String data2 = taskList.getRealStartTime().toString();
			if (data2.equals("Thu Jan 01 08:00:00 CST 1970")){
				taskList.setRealStartTime(null);
			}
		}
		if( taskList.getRealCompTime()!= null){
			String data2 = taskList.getRealCompTime().toString();
			if (data2.equals("Thu Jan 01 08:00:00 CST 1970")){
				taskList.setRealCompTime(null);
			}
		}
		
		if("".equals(taskList.getUids())){
			this.pcJdgkDao.insert(taskList);
			List<PcJdgkMonthTaskList> parentTaskList = this.pcJdgkDao.findByWhere(PcJdgkMonthTaskList.class.getName(), "treeid = '"+taskList.getParentid()+"'");
			if(parentTaskList.size() == 1){
				PcJdgkMonthTaskList parentTask = parentTaskList.get(0);
				parentTask.setIsleaf(0l);
				this.pcJdgkDao.saveOrUpdate(parentTask);
			}
		}else{
			this.pcJdgkDao.saveOrUpdate(taskList);
		}
		return "1";
	}
	
	/**
	 * 新增时获取新的节点编号
	 * @param pid PID
	 * @param prefix 编号前缀
	 * @param col 列名称
	 * @param table 表名称
	 * @param lsh 最大的流水号（可手动传入。null，表示没有传入，需要从数据库中获取）
	 * @return
	 * @author zhangh 2014-3-8
	 */
	@SuppressWarnings("unchecked")
	public String getNewTreeid(String pid, String prefix, String col,
			String table, Long lsh) {
		String bh = "";
		String newLsh = "";
		if (lsh == null) {
			String sql = "select trim(to_char(nvl(max(substr(" + col
					+ ",length('" + prefix + "') +1, 2)),0) +1,'00')) from "
					+ table + " where pid = '" + pid + "' and  substr(" + col
					+ ",1,length('" + prefix + "')) ='" + prefix + "'";
			List<String> list = this.pcJdgkDao.getDataAutoCloseSes(sql);
			if (list != null) {
				newLsh = list.get(0);
			}
		} else {
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);
		}
		bh = prefix.concat(newLsh);
		return bh;
	}
	
	
	public class EdoTask{
		private String uid;
		private String name;
		private String treeid;
		private String parentid;
		private Long isleaf;
		public String getUid() {
			return uid;
		}
		public void setUid(String uid) {
			this.uid = uid;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getTreeid() {
			return treeid;
		}
		public void setTreeid(String treeid) {
			this.treeid = treeid;
		}
		public String getParentid() {
			return parentid;
		}
		public void setParentid(String parentid) {
			this.parentid = parentid;
		}
		public Long getIsleaf() {
			return isleaf;
		}
		public void setIsleaf(Long isleaf) {
			this.isleaf = isleaf;
		}
		
	}
	
	
	/**
	 * 
	* @Title: initWeekWorkList
	* @Description: 初始化周工作明细
	* @param pid
	* @param pname
	* @param idsOfInsert   
	* @return void    
	* @throws
	* @author qiupy 2014-7-15
	 */
	public void initWeekWorkList(String pid, String pname, String idsOfInsert){
		try {
			String[] insertUids = idsOfInsert.split(",");
			String sjType="";
			for (int i = 0; i < insertUids.length; i++) {
				String uids = insertUids[i];
				PcJdgkWeekWork weekWork = (PcJdgkWeekWork) this.pcJdgkDao
						.findById(PcJdgkWeekWork.class.getName(), uids);
				sjType = weekWork.getSjType();
				//创建项目单位根节点
				PcJdgkWeekWorkList weekWorkList = new PcJdgkWeekWorkList();
				weekWorkList.setMasterid(uids);
				weekWorkList.setPid(pid);
				weekWorkList.setTreeid(pid+"-"+sjType);
				weekWorkList.setParentid("0");
				weekWorkList.setIsleaf(0l);
				weekWorkList.setWorkPlan(weekWork.getReportname());
				this.pcJdgkDao.insert(weekWorkList);
				//创建两个初始节点
				PcJdgkWeekWorkList weekWorkListChild1 = new PcJdgkWeekWorkList();
				weekWorkListChild1.setMasterid(uids);
				weekWorkListChild1.setPid(pid);
				weekWorkListChild1.setTreeid(pid+"-"+sjType+"-01");
				weekWorkListChild1.setParentid(pid+"-"+sjType);
				weekWorkListChild1.setIsleaf(1l);
				weekWorkListChild1.setWorkPlan("本周工作计划及完成");
				weekWorkListChild1.setWorkNum("一");
				int time = Integer.valueOf(sjType.substring(6,7));
				int mon = Integer.valueOf(sjType.substring(5,7));
				int sjTime = Integer.valueOf(sjType)-1;
		    	if(time == 1){//每月的第一周的上一周
		    		sjTime = Integer.valueOf(sjType)-6;
		    	} 
		    	if(mon == 11){//每年的一月第一周的上一周
		    		sjTime = Integer.valueOf(sjType)-886;
		    	}
		    	String preMasterId="";
		    	List<PcJdgkWeekWork> list1=this.pcJdgkDao.findByWhere(PcJdgkWeekWork.class.getName(), "pid='"+pid+"' and sjType='"+sjTime+"'");
		    	if(list1!=null&&list1.size()>0){
		    		preMasterId=list1.get(0).getUids();
		    	}else{
		    		sjTime=sjTime-1;
		    		List<PcJdgkWeekWork> list2=this.pcJdgkDao.findByWhere(PcJdgkWeekWork.class.getName(), "pid='"+pid+"' and sjType='"+sjTime+"'");
		    		if(list2!=null&&list2.size()>0){
			    		preMasterId=list2.get(0).getUids();
			    	}
		    	}
		    	if(preMasterId!=null&&preMasterId.length()>0){
					List<PcJdgkWeekWorkList> list3=this.pcJdgkDao.findByWhere(PcJdgkWeekWorkList.class.getName(),
							"masterid='"+preMasterId+"' and treeid like '"+pid+"-"+sjTime+"-020%'");
					if(list3!=null&&list3.size()>0){
						weekWorkListChild1.setIsleaf(0l);
						for(int k=0;k<list3.size();k++){
							PcJdgkWeekWorkList preWeekWork=list3.get(k);
							PcJdgkWeekWorkList weekWorkListChild3 = new PcJdgkWeekWorkList();
							weekWorkListChild3.setMasterid(uids);
							weekWorkListChild3.setPid(pid);
							weekWorkListChild3.setTreeid(pid+"-"+sjType+"-01"+preWeekWork.getTreeid().substring(pid.length()+sjType.length()+4));
							weekWorkListChild3.setParentid(pid+"-"+sjType+"-01");
							weekWorkListChild3.setIsleaf(preWeekWork.getIsleaf());
							weekWorkListChild3.setWorkPlan(preWeekWork.getWorkPlan());
							weekWorkListChild3.setWorkNum(preWeekWork.getWorkNum());
							weekWorkListChild3.setWorkFinish(preWeekWork.getWorkFinish());
							weekWorkListChild3.setWorkProblem(preWeekWork.getWorkProblem());
							this.pcJdgkDao.insert(weekWorkListChild3);
						}
					}
				}
				this.pcJdgkDao.insert(weekWorkListChild1);
				
				PcJdgkWeekWorkList weekWorkListChild2 = new PcJdgkWeekWorkList();
				weekWorkListChild2.setMasterid(uids);
				weekWorkListChild2.setPid(pid);
				weekWorkListChild2.setTreeid(pid+"-"+sjType+"-02");
				weekWorkListChild2.setParentid(pid+"-"+sjType);
				weekWorkListChild2.setIsleaf(1l);
				weekWorkListChild2.setWorkPlan("下周工作计划");
				weekWorkListChild2.setWorkNum("二");
				this.pcJdgkDao.insert(weekWorkListChild2);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * 
	* @Title: deleteWeekWorkList
	* @Description: 删除周工作计划明细
	* @param masterid
	* @param taskuids
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-15
	 */
	public String deleteWeekWorkList(String masterid,String taskuids){
		if(!"".equals(masterid)){
			//通过主记录主键直接删除所有明细
			this.pcJdgkDao.executeHQL("delete PcJdgkWeekWorkList as p where p.masterid='"+masterid+"'");
			return "0";
		}else{
			PcJdgkWeekWorkList task = (PcJdgkWeekWorkList) this.pcJdgkDao.findById(PcJdgkWeekWorkList.class.getName(), taskuids);
			if(task != null){
				String parentid = task.getParentid();
				this.pcJdgkDao.delete(task);
				//判断是否需要修改父节点为叶子节点
				List<PcJdgkWeekWorkList > taskList = this.pcJdgkDao.findByWhere(PcJdgkWeekWorkList.class.getName(), "parentid = '"+parentid+"'");
				if(taskList.size() == 0){
					List<PcJdgkWeekWorkList > parentTaskList = this.pcJdgkDao.findByWhere(PcJdgkWeekWorkList.class.getName(), "treeid = '"+parentid+"'");
					if(parentTaskList.size() == 1){
						PcJdgkWeekWorkList parentTask = parentTaskList.get(0);
						parentTask.setIsleaf(1l);
						this.pcJdgkDao.saveOrUpdate(parentTask);
					}
				}
				return "1";
			}else{
				return "";
			}
		}
	}
	/**
	 * 
	* @Title: saveWeekWorkList
	* @Description: 保存周工作计划
	* @param taskList
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-15
	 */
	public String saveWeekWorkList(PcJdgkWeekWorkList taskList){
		if("".equals(taskList.getUids())){
			this.pcJdgkDao.insert(taskList);
			List<PcJdgkWeekWorkList> parentTaskList = this.pcJdgkDao.findByWhere(PcJdgkWeekWorkList.class.getName(), "treeid = '"+taskList.getParentid()+"'");
			if(parentTaskList.size() == 1){
				PcJdgkWeekWorkList parentTask = parentTaskList.get(0);
				parentTask.setIsleaf(0l);
				this.pcJdgkDao.saveOrUpdate(parentTask);
			}
		}else{
			this.pcJdgkDao.saveOrUpdate(taskList);
		}
		return "1";
	}
	/**
	 * 
	* @Title: getPcJdgkWeekWorkListTree
	* @Description: 构造周工作计划树
	* @param orderBy
	* @param start
	* @param limit
	* @param map
	* @return   
	* @return List<ColumnTreeNode>    
	* @throws
	* @author qiupy 2014-7-15
	 */
	public List<ColumnTreeNode> getPcJdgkWeekWorkListTree(String orderBy,
			Integer start, Integer limit, HashMap map) {
		List<PcJdgkWeekWorkList> list = new ArrayList();
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		String parentid = (String) map.get("parentid");
		String masterid = (String) map.get("masterid");
		String sjType = (String) map.get("sjType");
		// 拼装一般查询语句
		if("0".equals(pid)&&"0".equals(masterid)){
			//pid和masterid都为0的时候，进行汇总查询
			list = pcJdgkDao.findByWhere(PcJdgkWeekWorkList.class.getName(),
					"treeid like '%-"+sjType+"%' and parentid='" + parentid + "'", "treeid");
		}else{
			list = pcJdgkDao.findByWhere(PcJdgkWeekWorkList.class.getName(),
					"pid = '" + pid + "' and parentid='" + parentid
							+ "' and masterid = '" + masterid + "'", "treeid");
		}
		
		List newList = DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	/**
	 * 
	* @Title: pcWeekWorkExchangeDataToQueue
	* @Description: 执行周工作计划上报操作
	* @param uids
	* @param pid
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-16
	 */
	public String pcWeekWorkExchangeDataToQueue(String uids,String pid){
		if(uids!=null&&uids.length()>0){
			List exchangeList=new ArrayList();
			PcJdgkWeekWork weekWork =(PcJdgkWeekWork) this.pcJdgkDao.findById(PcJdgkWeekWork.class.getName(), uids);
			weekWork.setReportStatus(1l);
			this.pcJdgkDao.saveOrUpdate(weekWork);
			List<PcJdgkWeekWorkList> weekWorkList=this.pcJdgkDao.findByWhere(PcJdgkWeekWorkList.class.getName(), "pid = '" + pid + "' and masterid='" + uids+"'");
			exchangeList.add(weekWork);
			if(weekWorkList!=null&&weekWorkList.size()>0){
				exchangeList.addAll(weekWorkList);
			}
			if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
						.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(
						exchangeList, Constant.DefaultOrgRootID,pid,"","", "项目周报报表上报");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}
			return "上报成功！";
		}else{
			return "上报失败！";
		}
	}
	/**
	 * 数据交互：项目单位向上级公司提交香梅月度任务分析
	 * @param unitid String 集团二级公司,集团三级公司或者集团公司编号
	 * @Param uids 某条监理报告唯一标识
	 * @return String 标识数据交互业务是否成功 
	 * @author shuz
	 * 
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public String pcJdgkMonthExchangeDataToQueue(String unitid, String uids)
	{
		String flag = "上报成功!"; 
		try{
			PcJdgkMonthTask month = (PcJdgkMonthTask)pcJdgkDao.findById(PcJdgkMonthTask.class.getName(), uids);
			
			 if(month==null) return "上报失败!";
			 
			 String deployType =  Constant.propsMap.get("DEPLOY_UNITTYPE");
			 if(deployType!=null&&deployType.equals("A")){//需要进行数据交互
				 SgccIniUnit unitBean = (SgccIniUnit) this.pcJdgkDao.
				 		findBeanByProperty(SgccIniUnit.class.getName(),	"unitid", unitid);
				 //如果项目编号为PID的项目单位在sgcc_ini_unit表中找不到，立即返回交互失败
				 if(unitBean==null)
				 {
					 return "上报失败!";
				 }	
				 //判断项目单位是否有数据交互的地址app_url，没有说明不需要进行数据交互，立即返回"unnecessary"
				 String appUrl = unitBean.getAppUrl();
				 if( appUrl == null || appUrl.equals("") )
				 {
					 return "unnecessary";
				 }
				 //主表对应明细表
				 List<PcJdgkMonthTaskList> taskList = pcJdgkDao.findByWhere(PcJdgkMonthTaskList.class.getName(), "masterid = '"+uids+"'");
			     List<SgccAttachList> attachList = new ArrayList<SgccAttachList>();
				    
				 //对应附件大对象list
				 FileManagementService fileManagementServiceImp=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
				    
				 String attachSQL = "TRANSACTION_ID='"+uids+"'";
			    
				 try {
					attachList = fileManagementServiceImp.geAttachListByWhere(attachSQL, null, null);
				 } catch (BusinessException e) 
				 {
					e.printStackTrace();
				 }
				 List allDataList = new ArrayList();
			 	 allDataList.add(month); //加入项目月度任务分析主表的beans
			 	 allDataList.addAll(taskList);
				 allDataList.addAll(attachList);
				 PCDataExchangeService exchangeServiceImp = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
				 List<PcDataExchange> listInQueue = exchangeServiceImp.getExcDataList(allDataList, unitid,
						 month.getPid(),null,"","上报项目月度任务分析【"+month.getPid()+"】");
				 
				 //加入大对象内容
				 if(attachList.size()>0&&listInQueue.size()>0){
					 PcDataExchange temp = (PcDataExchange)listInQueue.get(listInQueue.size()-1);
					 String txGroup = temp.getTxGroup();
					 long xh = temp.getXh();
					 for(int i=0;i<attachList.size();i++){
						 SgccAttachList attach = attachList.get(i);
						 
						 JSONArray kvarr = new JSONArray();
						 JSONObject kv = new JSONObject();
						 kv.put("FILE_LSH", attach.getFileLsh());
						 kvarr.add(kv);
						
						 PcDataExchange exchange = new PcDataExchange();
						 exchange.setTableName("SGCC_ATTACH_BLOB");
						 exchange.setBlobCol("FILE_NR");
						 exchange.setKeyValue(kvarr.toString());
						 exchange.setSuccessFlag("0");
						 exchange.setXh(++xh);
						 exchange.setSpareC5(month.getPid());
						 exchange.setPid(unitid);
						 exchange.setBizInfo("上报项目月度任务分析【"+month.getPid()+"】");
						 exchange.setTxGroup(txGroup);
						 
						 listInQueue.add(exchange);
					 }
				 }
				 //调试，加入待报送队列，查看数据是否完整
				 String result = exchangeServiceImp.addExchangeListToQueue(listInQueue);
				// Map<String, String> retVal = exchangeServiceImp.sendExchangeData(listInQueue);
				 //String result = retVal.get("result");
			 
				 if(result.equalsIgnoreCase("1"))
				 {
					 month.setReportStatus(1L);
					 pcJdgkDao.saveOrUpdate(month);
				 }else{
					 flag = "上报失败!";
				 }
			 }else{//不进行数据交互，直接修改报送状态即可
				 month.setReportStatus(1L);
				 pcJdgkDao.saveOrUpdate(month);
			 }
			 return flag;
		 }catch(BusinessException ex){
			 ex.printStackTrace();
			 return "上报失败!";
		 }   
	}

	/**根据项目id和当前时间获取该项目下的任务集合
	 * @param projectuid 一级网络计划的uid
	 * @param sjType 时间
	 * @return   返回的是任务的id集合
	 * @throws Exception
	 * 说明：获取规则：
	 * “本月一级网络计划完成情况”取本项目一级网络计划中计划开始时间在本月之前（含本月），
	 * 但实际完成进度在本月之前（不含本月）不为100%的项目节点（即实际完成进度在本月才调整为100%的也要自动获取）；
	 */
	@Override
	public List<Map<String,String>> getEdoTasks(String projectuid, String sjType) throws Exception {
		String sql = "select distinct(t2.taskuid_) uids from EDO_TASK t1, edo_baseline t2 where t1.uid_ = t2.taskuid_(+) " +
				" and t2.projectuid_ = '"+projectuid+"' and t1.projectuid_ = '"+projectuid+"' and t1.type_ = '0'" +
				" and  (" +
					"(to_char(t2.start_,'yyyymm') <='"+sjType+"' and t1.percentcomplete_ < '100') " +
					"or" +
					"(to_char(t2.start_,'yyyymm') ='"+sjType+"' and t1.percentcomplete_ = '100')" +
				") ";
		List<Map<String,String>> list = JdbcUtil.query(sql);
		
 		return list;
	}

	@Override
	public List<Map<String,String>> getNextMonthTasks(String projectuid, String sjType) throws Exception {
		sjType = getNextMonth(sjType);
		String sql = "select distinct(t2.taskuid_) uids from EDO_TASK t1, edo_baseline t2 where t1.uid_ = t2.taskuid_(+) " +
				" and t2.projectuid_ = '"+projectuid+"' and t1.projectuid_ = '"+projectuid+"' and t1.type_ = '0' " +
				" and  to_char(t2.start_,'yyyymm') <='"+sjType+"' and t1.percentcomplete_ < '100'";	
		List<Map<String,String>> list = JdbcUtil.query(sql);
		
 		return list;
	}
	
	private static String getNextMonth(String sjType){
		String year = sjType.substring(0, 4);
		Integer iYear = Integer.parseInt(year);
		String month = sjType.substring(4);
		Integer iMonth = Integer.parseInt(month) +1;
		month = iMonth < 10 ? "0" + iMonth : String.valueOf(iMonth);
		sjType =  iMonth > 12 ? (iYear+1) + "01":(iYear +month);
		return sjType;
	}
	
	@Override
	public String getUids2Str(List<Map<String, String>> list) throws Exception {
		String result = "";
		if(null != list && list.size()>0){
			for(int i = 0 ; i< list.size();i++){
				String uids = list.get(i).get("uids");
				result += uids + ",";
			}
			result = result.substring(0,result.length()-1);
		}
		return result;
	}

	@Override
	public List<Map<String, String>> getEdoTasksByTree(String projectId)throws Exception {
		String sql = "select SYS_CONNECT_BY_PATH(t.uid_, '~') || '~' code_path from " +
				"(select * from EDO_TASK tt where tt.projectuid_ = '"+projectId+"') t " +
				" START WITH t.parenttaskuid_ = '1' CONNECT BY NOCYCLE t.parenttaskuid_ = PRIOR t.uid_";
		List<Map<String,String>> list = JdbcUtil.query(sql);
		return list;
	}

	@Override
	public String mergeEdoTaskIds(List<Map<String, String>> totalList,List<Map<String, String>> uidsList) {
		String result = "";
		Map<String,String> map = new HashMap<String,String>();
		for(int i = 0 ; i< totalList.size();i++){
			String codePath = totalList.get(i).get("code_path");
			String[] uids = codePath.split("~");
			for(int j = 0 ; j< uidsList.size();j++){
				String taskId = uidsList.get(j).get("uids");
				if(codePath.lastIndexOf("~" + taskId + "~") !=-1){
					for(int k = 0 ; k < uids.length;k++){
						if(null != uids[k] && !"".equals(uids[k])){
							map.put(uids[k], "");
						}
					}
				}
			}
		}
		
		Iterator<String> its = map.keySet().iterator();
		while(its.hasNext()){
			result += its.next() + ",";
		}
		result = result.length()>0 ? result.substring(0, result.length()-1):"";
		return result;
	}
	
	
}
