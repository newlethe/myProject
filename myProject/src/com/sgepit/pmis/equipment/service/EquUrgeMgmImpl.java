package com.sgepit.pmis.equipment.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.collections.map.ListOrderedMap;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;


public class EquUrgeMgmImpl extends BaseMgmImpl implements EquUrgeMgmFacade{
	
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static EquUrgeMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EquUrgeMgmImpl) ctx.getBean("equUrgeMgm");
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	
	public List equUrge(String inWhere){
		String sql = "select ei.equid, ei.equ_name, cp.partyb, cp.linkman, cp.phoneno, cp.fax "
					+"from equ_info ei, con_ove co, con_partyb cp "
					+"where ei.conid = co.conid and co.partybno = cp.cpid ";
		if (!("").equals(inWhere)) sql += "and ei.equid in " + inWhere;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		System.out.println(list.toString());
		return list;
	}
	
	public List selectEquUrge(String beginDate, String endDate){
		String sql = "select * from equ_urge t where t.getdate ";
		if ("".equals(beginDate) && "".equals(endDate)){
			return equUrge("");
		}else if ("".equals(beginDate) && !"".equals(endDate)){
			sql += "> to_date('"+beginDate+"','YYYY-MM-DD')";
		}else if (!"".equals(beginDate) && "".equals(endDate)){
			sql += "< to_date('"+endDate+"','YYYY-MM-DD')";
		}else if (!"".equals(beginDate) && !"".equals(endDate)){
			sql += "between to_date('"+beginDate+"','YYYY-MM-DD') "
				+"and to_date('"+endDate+"', 'YYYY-MM-DD')";
		}
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		System.out.println(list.toString());
		StringBuffer sb = new StringBuffer("");
		if (!list.isEmpty()){
			sb.append("(");
			for (Iterator iterator = list.iterator(); iterator.hasNext();) {
				ListOrderedMap map = (ListOrderedMap) iterator.next();
				sb.append("'"+map.getValue(1)+"'");
				if (iterator.hasNext()) sb.append(",");
			}
			sb.append(")");
			return equUrge(sb.toString());
		}
		return new ArrayList();
	}
	
}
