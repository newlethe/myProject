package com.sgepit.pmis.equipment.service;


import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;


public class EquInstruMgmImpl extends BaseMgmImpl implements EquInstruMgmFacade{
	
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static EquInstruMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EquInstruMgmImpl) ctx.getBean("equInstruMgm");
	}
	// -------------------------------------------------------------------------
	// Operation methods, implementing the EquInstruMgmFacade interface
	// -------------------------------------------------------------------------
	public List equInstruSub(String conid, String sxValue){
		String sql = "select e.sb_id, l.sb_mc, e.ggxh, e.dw, e.zs, e.dhsl, "
					+"e.sccj, e.dj, e.zj, e.jzh, g.gg_date "
					+"from equ_sbdh e, equ_list l, equ_get_goods g "
					+"where e.dh_id = g.ggid and e.sb_id = l.sb_id and "
					+"e.conid = '" + conid + "' and e.sx = '" + sxValue + "'";
		System.out.println("sql = "+sql);
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}
}
