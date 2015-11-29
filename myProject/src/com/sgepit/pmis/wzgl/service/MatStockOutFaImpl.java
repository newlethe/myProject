package com.sgepit.pmis.wzgl.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.hibernate.Session;

import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.pmis.finalAccounts.interfaces.MatFaFacade;
import com.sgepit.pmis.finalAccounts.interfaces.vo.MatStockOutDetailVO;
import com.sgepit.pmis.finalAccounts.interfaces.vo.MatStockOutVO;


public class MatStockOutFaImpl extends BaseMgmImpl implements MatFaFacade {
	
	/**
	 * 获取物资出库单信息
	 * @param pid:		项目编号（多项目共用同一系统使用）
	 * @param outType:	物资出库类型：1计划内；2计划外；如果此字段为空，表示查询所有出库单；
	 * @param orderBy:	排序字符
	 * @param param:	提供查询条件的参数：如出库单编号{{“outNo”,”GQ”}}and outNo like ‘%GQ%’
	 * @param start:	分页显示的起始
	 * @param limit:	分页显示一页显示的行数
	 * @return			返回出库单的列表
	 */
	public List getMatStockOut(String pid, String outType, String orderBy, HashMap<String, String> param, Integer start, Integer limit) {
		String whereStr = " (select count(s.uuid) from mat_store_outsub s where s.app_id=t.out_no)>0 " ;
		if (param!=null && !param.isEmpty()) {
			Iterator<String> iterator = param.keySet().iterator();
			while (iterator.hasNext()) {
				String key = iterator.next();
				String value = param.get(key);
				whereStr += " and " + key + " like '%" + value + "%'";
			}
		}
		
		if (outType!=null) {
			if(outType.equals("1")) {
				whereStr += " and outType = 4";
			} else if(outType.equals("2")) {
				whereStr += " and outType = 2";
			}
		}
		if (pid!=null) {
			whereStr += " and pid = '" + pid + "'";
		}
		
		
		String sql = "select t.out_no outNo, decode(t.out_type, '2', '2', '1') outType, t.deal_man applyUser, t.out_date applyTime, t.bill_state state" +
				"  from mat_store_out t where " + whereStr ;
		
		if (orderBy!=null && orderBy.length()>0) {
			sql += " order by " + orderBy;
		}
		
		Session s = null;
		List l = null;
		int size = 0;
		try {
			s = HibernateSessionFactory.getSession();
			SQLQuery q = s.createSQLQuery(sql)
					.addScalar("outNo", Hibernate.STRING)
					.addScalar("outType", Hibernate.STRING)
					.addScalar("applyUser", Hibernate.STRING)
					.addScalar("applyTime", Hibernate.DATE)
					.addScalar("state", Hibernate.STRING);
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
		for (int i = 0; i <l.size(); i++) {
			MatStockOutVO vo = new MatStockOutVO();
			Object[] objs = (Object[]) l.get(i);
			vo.setOutId((String)objs[0]);
			vo.setOutNo((String)objs[0]);
			vo.setOutType(objs[1].equals("2") ? "计划外" : "计划内");
			vo.setApplyUser((String)objs[2]);
			vo.setApplyTime((Date)objs[3]);
			vo.setState((String)objs[4]);
			
			returnList.add(vo);
		}
		returnList.add(size);
					
		return returnList;
	}

	
	/**
	 * 获取出库单对应的出库物资明细
	 * @param pid:		项目编号（多项目共用同一系统使用）
	 * @param outId:	出库单编码
	 * @param orderBy:	排序字符串
	 * @param param:	提供查询条件的参数：如出库单编号{{“outNo”,”GQ”}}and outNo like ‘%GQ%’
	 * @param start:	分页显示的起始
	 * @param limit:	分页显示一页显示的行数
	 * @return			返回出库单的出库物质列表
	 */
	public List getMatStockOutDetail(String pid, String outId, String orderBy, HashMap<String, String> param, Integer start,Integer limit) {
		
		
		String whereStr = " pid='" + pid + "'" ;
		if (outId!=null && outId.length()>0) {
			whereStr += " and app_id = '" + outId + "'";
		}
		if (param!=null && !param.isEmpty()) {
			Iterator<String> iterator = param.keySet().iterator();
			while (iterator.hasNext()) {
				String key = iterator.next();
				String value = param.get(key);
				whereStr += " and " + key + " like '%" + value + "%'";
			}
		}
		
		String sql = "select t.uuid id, t.out_id outId, t.cat_no matCode, t.cat_name matName, t.spec matSpec, t.unit matUnit, t.real_num num, t.price matPrice, t.money amount, '' usingUser , t.mat_id matId" +
				" from mat_store_outsub t where " + whereStr ;
		
		Session s = null;
		List l = null;
		int size = 0;
		try {
			s = HibernateSessionFactory.getSession();
			SQLQuery q = s.createSQLQuery(sql)
			.addScalar("id", Hibernate.STRING)
			.addScalar("outId", Hibernate.STRING)
			.addScalar("matCode", Hibernate.STRING)
			.addScalar("matName", Hibernate.STRING)
			.addScalar("matSpec", Hibernate.STRING)
			.addScalar("matUnit", Hibernate.STRING)
			.addScalar("num", Hibernate.BIG_DECIMAL)
			.addScalar("matPrice", Hibernate.BIG_DECIMAL)
			.addScalar("amount", Hibernate.BIG_DECIMAL)
			.addScalar("usingUser", Hibernate.STRING)
			.addScalar("matId", Hibernate.STRING);
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
		
		for (int i = 0; i <l.size(); i++) {
			MatStockOutDetailVO vo = new MatStockOutDetailVO();
			Object[] objs = (Object[]) l.get(i);
			vo.setMatId((String)objs[0]);
			vo.setOutId((String)objs[1]);
			vo.setOutNo((String)objs[1]);
			vo.setMatCode((String)objs[2]);
			vo.setMatName((String)objs[3]);
			vo.setMatSpec((String)objs[4]);
			vo.setMatUnit((String)objs[5]);
			vo.setNum((BigDecimal)objs[6]);
			vo.setMatPrice((BigDecimal)objs[7]);
			vo.setAmount((BigDecimal)objs[8]);
			vo.setUsingUser((String)objs[9]);
			vo.setMatId((String)objs[10]);
			
			returnList.add(vo);
		}
		returnList.add(size);
		
		return returnList;
	}
	
}
