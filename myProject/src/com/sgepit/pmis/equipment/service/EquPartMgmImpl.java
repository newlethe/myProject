package com.sgepit.pmis.equipment.service;


import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;


public class EquPartMgmImpl extends BaseMgmImpl implements EquPartMgmFacade{
	
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static EquPartMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EquPartMgmImpl) ctx.getBean("equPartMgm");
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the EquPartMgmFacade interface
	// -------------------------------------------------------------------------
	public List equPartSub(String conid, String sxValue){
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
