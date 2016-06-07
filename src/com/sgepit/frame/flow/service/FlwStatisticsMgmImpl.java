package com.sgepit.frame.flow.service;

import java.util.ArrayList;
import java.util.List;


import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.VFlowStatistics;
import com.sgepit.frame.util.JdbcUtil;

public class FlwStatisticsMgmImpl implements FlwStatisticsMgmFacade{
	private FlowDAO flowDAO;
	
	public FlowDAO getFlowDAO() {
		return flowDAO;
	}
	public void setFlowDAO(FlowDAO flowDAO) {
		this.flowDAO = flowDAO;
	}
	
	/**
	 * 功能：生成指定日期时间内流程统计视图
	 * @param startDate 开始时间(格式为2011-06-05)
	 * @param endDate   结束时间
	 * @param overHour  超时小时(默认24小时)
	 * @return  
	 */
	public void upDateViewFlwStatistics(String startDate, String endDate, int overHour)
	{
		//保存用户设置的超时时间标准
		VFlowStatistics.setOverHour(overHour);
		
		//更新视图
		StringBuffer createViewSql = new StringBuffer();
		createViewSql.append("create or replace view view_flw_statistics as ")
		 .append("select userid, realname as username, unitid,posid,")
		 .append("(select max(unitid) from sgcc_ini_unit where unit_type_id='2' connect by prior " +
		 		"upunit=unitid start with unitid=T1.unitid) unit2id,")
		 .append("(select max(unitid) from sgcc_ini_unit where unit_type_id='3' connect by prior " +
		 		"upunit=unitid start with unitid=T1.unitid) unit3id,")
		 .append("(select t.unitname from sgcc_ini_unit t where t.unitid=posid) as posname,")
		 .append("(select userstate from rock_user r where  r.userid = T1.USERID) as userstate,")
		 .append("(select t.view_order_num from  sgcc_ini_unit t where t.unitid=posid) as vieworder,")
		 .append("decode (c_sum, null, 0, c_sum) c_sum,")
		 .append("decode (p_sum, null, 0, p_sum) p_sum,")
		 .append("decode (over_sum, null, 0, over_sum) over_sum,")
		 .append("decode (u_sum, null, 0, u_sum) u_sum, ")
		 .append("decode (over_u_sum, null, 0, over_u_sum) over_u_sum ")
		 .append("from ")
		 .append("(select distinct userid, realname, unitid,r.dept_id as posid from rock_user r, flw_log log1 where " +
		 		"r.userid=log1.tonode ) T1 ")
		 .append("left join ")
		 .append("(select count(*) as c_sum, fromnode as fromnode1 from flw_log log2 where " +
		 		"log2.fromnodeid='-1' and to_char(log2.ftime,'YYYY-MM-DD') between '"+startDate+
		 		"' and '"+endDate+"' group by fromnode) T2 ")
		 .append("on T1.userid=T2.fromnode1 ")
		 .append("left join ")
		 .append("(select count(*) as p_sum, fromnode as fromnode2 from flw_log log3 where log3.fromnodeid<>'-1' and " +
		 		"to_char(log3.ftime,'YYYY-MM-DD') between '"+startDate+
		 		"' and '"+endDate+"' group by fromnode) T3 ")
		 .append("on T1.userid=T3.fromnode2 ")
		 .append("left join ")	
		 .append("(select count(*) as over_sum, tonode as tonode4 from " +
		 		"(select insid,nodeid,tonode, (ctime-ptime)*24 as spendtime from " +
		 		"(select A.insid,A.nodeid, A.tonode, A.ftime as ptime, B.ftime as ctime from " +
		 		"flw_log A, flw_log B where A.nodeid=B.fromnodeid and A.flag=1 and A.insid=B.INSID " +
		 		"and to_char(A.FTIME,'YYYY-MM-DD') between '"+startDate+"' and '"+endDate+"')) where spendtime>"+overHour+" group by tonode) T4 ")
		 .append("on T1.userid=T4.tonode4 ")
		 .append("left join ")
		 .append("(select count(*) as u_sum, tonode as tonode5 from flw_log log5 where log5.flag=0 group by tonode) T5 ")
		 .append("on T1.userid=T5.tonode5 ")
		 .append("left join ")
		 .append("(select count(*) as over_u_sum, tonode as tonode6 from "+
				 "(select tonode, ftime, sysdate from flw_log where flag=0 and (sysdate-ftime)*24>"+overHour+")group by tonode) T6 " )
		 .append("on T1.userid=T6.tonode6");
		
		try{
			JdbcUtil.execute(createViewSql.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取用户指定日期内某个流程处理人一种流程处理类型（用户起草，已处理， 超时处理，未处理）的流程处理日志记录主键logid
	 * @param startDate
	 * @param endDate
	 * @param userid
	 * @param type (c_sum: 用户起草，p_sum: 用户处理, over_sum: 处理超时，u_sum: 未处理待办)
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<String> getFlowLogids(String startDate, String endDate, String userid, String type)
	{
		int overHour = VFlowStatistics.getOverHour();
		List<String> list = new ArrayList<String>();
		StringBuffer sql = new StringBuffer();
		if(type.equals("csum"))			//用户起草的流程
		{
			sql.append("select logid from flw_log where");
			sql.append(" fromnode='"+userid+"' and to_char(ftime,'YYYY-MM-DD') between '"+startDate+"' and '" + endDate+"'");
			sql.append(" and fromnodeid='-1'");
		}
		else if(type.equals("psum"))		//用户已处理流程
		{
			sql.append("select logid from (");
			sql.append("select A.logid, B.fromnode from flw_log A, flw_log B where A.nodeid=B.fromnodeid");
			sql.append(" and A.insid=B.insid and to_char(B.ftime,'YYYY-MM-DD') between '"+startDate+"'");
			sql.append(" and '"+endDate+"')");
			sql.append("where fromnode='"+userid+"'");
		}
		else if(type.equals("oversum"))   //用户处理超时的流程
		{   
			sql.append("select logid from (");
			sql.append("select logid,insid,nodeid,tonode, (ctime-ptime)*24 as spendtime from");
			sql.append(" (select A.logid,A.insid,A.nodeid, A.tonode, A.ftime as ptime, B.ftime as ctime from");
			sql.append(" flw_log A, flw_log B where A.nodeid=B.fromnodeid and");
			sql.append(" A.flag=1 and A.insid=B.INSID and");
			sql.append(" to_char(A.FTIME,'YYYY-MM-DD') between '"+startDate+"' and '"+endDate+"')) where");
			sql.append(" tonode='"+userid+"' and spendtime>"+overHour);
		}
		else if(type.equals("usum"))        //用户未处理（待办）的流程 
		{
			sql.append("select logid from flw_log where tonode='"+userid+"' and flag=0");
		}
		else if(type.equals("overusum"))        //用户未处理并已超时的流程 
		{
			sql.append("select logid from flw_log where tonode='"+userid+"' and flag=0 and (sysdate-ftime)*24>"+overHour);
		}
		else 
		{
			return null;
		}
		
		list = this.flowDAO.getDataAutoCloseSes(sql.toString());
			
		return list;
	}
	
}
