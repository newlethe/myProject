package com.sgepit.pcmis.warn.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.SQLQuery;
import org.springframework.dao.DataAccessResourceFailureException;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.pcmis.warn.hbm.PcWarnDowithInfo;
import com.sgepit.pcmis.warn.hbm.UserBean;

public class PCWarnDAO extends BaseDAO {

	@Override
	public List findBySql(String unitid, String sql, Integer start,
			Integer limit) throws DataAccessResourceFailureException,
			HibernateException, IllegalStateException, ClassNotFoundException {
		   List list = new ArrayList();
		   if(sql != null && sql.length() > 0)
	        {
	            SQLQuery query = getSession().createSQLQuery(sql);
	            int size = query.list().size();
	            if(start != null && limit != null)
	            {
	                query.setFirstResult(start.intValue());
	                query.setMaxResults(limit.intValue());
	            }
	          List   resultList = query.list();
	          for(int k=0;k<resultList.size();k++){
	        	  Object [] objs =(Object [])resultList.get(k);
	        	  UserBean  userBean = new UserBean();
	        	  userBean.setUserid((String)objs[0]);
	        	  userBean.setUsername((String)objs[1]);
	        	  userBean.setRealname((String)objs[2]);
	        	  userBean.setSex((String)objs[3]);
	        	  userBean.setDowithtype((String)objs[4]);
	        	  userBean.setSearchtype((String)objs[5]);
	        	  list.add(userBean);
	          }
	            list.add(Integer.valueOf(size));
	            return list;
	        } else
	        {
	            return new ArrayList();
	        }
	}
	
}
