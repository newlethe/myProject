package com.sgepit.pmis.equipment.service;

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
import com.sgepit.pmis.finalAccounts.interfaces.EquFaFacade;
import com.sgepit.pmis.finalAccounts.interfaces.vo.EquStockOutDetailVO;

public class EquStockOutFaImpl extends BaseMgmImpl implements EquFaFacade {

	/**
	 * 根据设备合同信息，获取该合同对应设备的出库单出库设备的信息；
	 * @param pid
	 * @param conId
	 * @param orderby	排序信息
	 * @param param	查询的条件信息
	 * @param start	分页信息
	 * @param limit	分页信息
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-15
	 */
	public List getEquStockOutDetail(String pid, String conId, String orderBy, HashMap<String, String> param, Integer start, Integer limit){
		List returnList = new ArrayList();
		
		String whereStr = " and m.conid='" + conId + "'" ;
		if (param!=null && !param.isEmpty()) {
			Iterator<String> iterator = param.keySet().iterator();
			while (iterator.hasNext()) {
				String key = iterator.next();
				String value = param.get(key);
				whereStr += " and " + key + " like '%" + value + "%'";
			}
		}
		
		String sql = "select t1.*, t2.bdgid from (select m.pid, m.outno, m.state, m.out_date, m.get_person, m.conid, " +
				"s.outid, s.equid, s.sbno, s.sbmc, s.spec, s.unit, s.price, s.sccj, s.real_num, s.zj " +
				" from equ_houseout_sub s left outer join  equ_houseout m on m.outid = s.outid where 1=1 " + whereStr + ") t1, equ_list t2" +
				" where t1.equid = t2.sb_id ";
		if (orderBy!=null && orderBy.length()>0) {
			sql += " order by " + orderBy;
		}
		
		Session s = null;
		List l = null;
		int size = 0;
		try {
			s = HibernateSessionFactory.getSession();
			SQLQuery q = s.createSQLQuery(sql)
					.addScalar("pid", Hibernate.STRING)
					.addScalar("outno", Hibernate.STRING)
					.addScalar("state", Hibernate.STRING)
					.addScalar("out_date", Hibernate.DATE)
					.addScalar("get_person", Hibernate.STRING)
					.addScalar("conid", Hibernate.STRING)
					.addScalar("outid", Hibernate.STRING)
					.addScalar("equid", Hibernate.STRING)
					.addScalar("sbno", Hibernate.STRING)
					.addScalar("sbmc", Hibernate.STRING)
					.addScalar("spec", Hibernate.STRING)
					.addScalar("unit", Hibernate.STRING)
					.addScalar("price", Hibernate.DOUBLE)
					.addScalar("sccj", Hibernate.STRING)
					.addScalar("real_num", Hibernate.DOUBLE)
					.addScalar("zj", Hibernate.DOUBLE)
					.addScalar("bdgid", Hibernate.STRING);
			size = q.list().size();
			
			q.setFirstResult(start);
			q.setMaxResults(limit);
			l = q.list();
			
		} catch (Exception e) {
		} finally {
			s.close();
		}
		
		EquStockOutDetailVO stockOutDetailVO = null;
		
		for (int i = 0; i <l.size(); i++) {
			Object[] objs = (Object[]) l.get(i);
					
			stockOutDetailVO = new EquStockOutDetailVO();
			stockOutDetailVO.setPid((String)objs[0]);
			stockOutDetailVO.setOutno((String)objs[1]);
			stockOutDetailVO.setOutState((String)objs[2]);
			stockOutDetailVO.setOutDate((Date)objs[3]);
			stockOutDetailVO.setApplyUser((String)objs[4]);
			stockOutDetailVO.setConid((String)objs[5]);
			
			stockOutDetailVO.setOutid((String)objs[6]);
			stockOutDetailVO.setEquId((String)objs[7]);
			stockOutDetailVO.setEquCode((String)objs[8]);
			stockOutDetailVO.setEquName((String)objs[9]);
			stockOutDetailVO.setEquSpec((String)objs[10]);
			stockOutDetailVO.setEquUnit((String)objs[11]);
			stockOutDetailVO.setEquPrice(new BigDecimal((Double)objs[12]));
			stockOutDetailVO.setEquSupplyunit((String)objs[13]);
			stockOutDetailVO.setEquNum(new BigDecimal((Double)objs[14]));
			stockOutDetailVO.setEquAmount(new BigDecimal((Double)objs[15]));
			stockOutDetailVO.setBdgid((String)objs[16]);
			
			returnList.add(stockOutDetailVO);
		}
		returnList.add(size);
		
		return returnList;
	}

}
